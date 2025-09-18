---
layout: post
title: "Optimizing Cubed"
author: Tom White
---

[_This post was originally published on the [Pangeo Blog](https://medium.com/pangeo/optimizing-cubed-7a0b8f65f5b7)._]

*We implemented a number of optimizations in Cubed to give a 4.8x performance improvement on the "Quadratic Means" problem when running on Lithops with AWS Lambda, with a 1.5 TB workload completing in around 100 seconds.*

<!--
What is Cubed: ND arrays; array API; distributed; bounded memory; serverless. Previous blog post about Xarray integration.

-->

[Cubed](https://github.com/cubed-dev/cubed) is a library for distributed processing of large multi-dimensional array data. Here are its key design highlights:

* **Cubed is designed to process Zarr array data at scale** <br>
    More and more scientific data from such fields as genomics and geoscience is stored in Zarr format - or in a format that can be made to look like Zarr via Kerchunk. Cubed was created to take advantage of this trend.
* **Cubed runs on multiple runtimes** <br>
    Cubed's architecture means it does not need a cluster to run on, and doesn't rely on shared state between worker processes. It provides a variety of runtime engines that use existing distributed serverless platforms like AWS Lambda and Google Cloud Functions. (However, if you do have an existing cluster, Cubed will work fine there too.)
* **Cubed has bounded memory usage** <br>
    This means that as a user you can be sure that your computation won't run out of memory.
* **Cubed implements the Python array API standard** <br>
    The [Python array API standard](https://data-apis.org/array-api/2022.12/) is emerging as a common standard for libraries and developers in the NumPy space. Cubed speaks this common language, which provides opportunities for increased interoperability with algorithms and tools from other projects.
* **Cubed can be used with Xarray** <br>
    You don't have to use the array API directly. Instead, you can run an existing [Xarray](https://xarray.dev/) workflow on Cubed by enabling a Cubed chunk manager provided by the [cubed-xarray package](https://github.com/cubed-dev/cubed-xarray).

## How Cubed works

<!--

Intermediate results are stored in Zarr arrays. Two core primitives: blockwise and rechunk.

-->

The unit of work in a Cubed computation is an operation on a chunk of a Zarr array. A computation can therefore be broken down into a set of embarrassingly parallel tasks that operate on the chunks in a Zarr array.

More complex computations are broken into stages to get from the input array to the output array. The intermediate results are saved to persistent shared storage (typically an object store like S3) so that the next stage can read them directly.

Here's an example of a computation with one intermediate Zarr array ("Zarr 2"):

![cubed-idea]({{ site.url }}{{ site.baseurl }}/assets/2024-04-03-cubed-idea.svg)

This diagram shows a very simple case where chunks (also called blocks) have a simple one-to-one mapping between each stage. More complex cases are possible, where output chunks depend on more than one input chunk, and can change their shape and dtype - which is essentially what `blockwise` does (originally from Dask Array).

Another operation is called `rechunk` (also from Dask Array), which resizes an array's chunks while leaving everything else the same (such as shape and dtype).

It turns out that essentially all of the operations in the Python array API standard can be implemented with these two primitives: `blockwise` and `rechunk`.

Cubed provides an implementation of the array API by expressing its operations in terms of the two primitives, and implements the two primitive operations that run on Zarr arrays using any of Cubed's runtimes.

## Visualizing a Cubed plan

Let's look at a small toy computation as an example.

```python
import cubed.array_api as xp

a = xp.asarray([[1, 2, 3], [4, 5, 6], [7, 8, 9]], chunks=(2, 2))
b = xp.negative(a)
c = xp.astype(b, xp.float32)

c.visualize(optimize_graph=False)
```

The call to `visualize` produces the following plan:

![toy-unoptimized]({{ site.url }}{{ site.baseurl }}/assets/2024-04-03-toy-unoptimized.svg)

The first thing to note is that there are two types of nodes in the plan. Boxes with rounded corners are *operations*, while boxes with square corners are *arrays*. In this case there are three operations (labelled `op-001`, `op-002`, and `op-003`), which produce the three arrays `a`, `b`, and `c`. (There is always an additional operation called `create-arrays`, shown on the right, which Cubed creates automatically.)

Arrays `b` and `c` are coloured orange, which means they are materialized as Zarr arrays. Array `a` does not need to be materialized as a Zarr array since it is a small constant array that is passed to the workers running the tasks.

Similarly, the operations that produce `b` and `c` are shown in a lilac colour to signify that they run tasks to produce their outputs. Operation `op-001` doesn't need to run any tasks since `a` is a small constant array.

## Optimization as a way of reducing IO

If we now enable optimization (which is actually the default), then we get a simpler plan:

```python
c.visualize()
```

![toy-optimized]({{ site.url }}{{ site.baseurl }}/assets/2024-04-03-toy-optimized.svg)

Operation `op-002` and array `b` have been "fused away". That is, the intermediate Zarr array is no longer written, and `op-002` (which is the call to `negative`) is performed as a part of the tasks running `op-003`.

You can see the effect of this optimization in the summary at the bottom of each plan. The total number of tasks is reduced from 10 to 5, and the amount of data written to storage is reduced from 108 bytes to 36 bytes.

This is a very simple case, but the principle of fusing operations as a way to reduce the number of tasks needed to run the computation and also to reduce the amount of intermediate IO applies to the more complex optimizations that Cubed performs.

One of these newly-implemented optimizations is the ability to fuse an operation with *multiple* predecessor operations, potentially across multiple levels of the plan. In general, it is not safe to fuse arbitrarily many operations since it could break Cubed's memory guarantees. To cope with this, Cubed will only fuse operations if the total size of the inputs to the fused operation does not cause the memory needed to execute a task to exceed the allowed memory.

## Example: The "Quadratic Means" problem

<!--

Motivation for the optimizations discussed below. Show a code snippet and the plan (just with simple optimizations). Number of tasks and intermediate data IO.

-->

To describe the optimizations that we made to Cubed, we'll use an example from the [previous blog post](https://xarray.dev/blog/cubed-xarray). The "Quadratic Means" problem is a simplified workload from climate science that finds the cross-product mean from the climatological anomalies of two variables, *U* and *V*.

We created a synthetic dataset stored in Zarr with 1.5 TB of random data in an Xarray dataset called `quad`:

```python
u = cubed.from_zarr(paths[0], spec=spec)
v = cubed.from_zarr(paths[1], spec=spec)
ds = xr.Dataset(
    dict(
        anom_u=(["time", "face", "j", "i"], u),
        anom_v=(["time", "face", "j", "i"], v),
    )
)
quad = ds**2
quad["uv"] = ds.anom_u * ds.anom_v
print(quad)
```

```
<xarray.Dataset> Size: 2TB
Dimensions:  (time: 50000, face: 1, j: 987, i: 1920)
Dimensions without coordinates: time, face, j, i
Data variables:
    anom_u   (time, face, j, i) float64 758GB cubed.Array<chunksize=(10, 1, 987, 1920)>
    anom_v   (time, face, j, i) float64 758GB cubed.Array<chunksize=(10, 1, 987, 1920)>
    uv       (time, face, j, i) float64 758GB cubed.Array<chunksize=(10, 1, 987, 1920)>
```

The code to compute the means is then simply:

```python
result = quad.mean("time", skipna=False)
```

The resulting plan - using the old optimization settings - looks like this:

![quadratic_means_xarray_50000_old]({{ site.url }}{{ site.baseurl }}/assets/2024-04-03-quadratic_means_xarray_50000_old.svg)

There are three linear series of nodes - corresponding to computing the means of *U*<sup>2</sup>, *UV*, and *V*<sup>2</sup>. The chains start with nodes that each have 5000 tasks at the top (to compute the powers *U*<sup>2</sup> and *V*<sup>2</sup> or product *UV*), then reduction rounds to compute the mean of 500 tasks, then 50 tasks, then 5 tasks, and finally 1 task.

## Implementing reduction

The reduction operation to compute the mean is implemented using a tree reduce algorithm, illustrated here, where the boxes represent chunks in an array.

![reduction_new_mean]({{ site.url }}{{ site.baseurl }}/assets/2024-04-03-reduction_new_mean.svg)


Each operation in the tree reduce is a partial reduce operation that reads up to a certain number of chunks (three here) and combines them into one (for calculating the mean it records totals and counts). The maximum number of chunks that each partial reduce reads is the split factor, which is specified by the `split_every` parameter in the API.

There is a final aggregation step that in the case of calculating the mean divides the totals by the counts.

What is a good choice for `split_every`? It is a [trade off](https://github.com/cubed-dev/cubed/issues/331) - larger values make the depth of the tree reduce smaller, which makes for fewer rounds of tasks, and so the computation can complete faster. But larger values also mean each partial reduce task has to read more chunks, which makes the computation slower.

Note that the chunks are read and combined sequentially, which means that they stay within the the task memory allowance.

For the Quadratic Means problem we set `split_every=10`, which was an arbitrary choice, and not something we have tried to optimize at this stage, so further performance improvements are possible.

## Quadratic Means with the new optimizations

<!--
New plan for QM. Comparison of num tasks and intermediate data IO. Power of fusing operations with a different number of tasks.
-->

With the new optimization settings the plan for Quadratic Means looks like this:

![quadratic_means_xarray_50000_new]({{ site.url }}{{ site.baseurl }}/assets/2024-04-03-quadratic_means_xarray_50000_new.svg)

Although at first glance this plan may not look very different, a whole layer of operations has been fused away. Comparing the two plan summaries, we see that the number of tasks needed to run the computation has gone down from **16683 to 1680 (a 10-fold decrease)**, and the amount of data written to Zarr storage has gone down from **2.3 TB to 50.5 GB (a 45-fold decrease)**.

These are significant improvements! How was this achieved?

The key change is that all the operations with 5000 tasks have been fused with the operations with 500 tasks. For example, in the new plan `op-082` has been fused with its 5000 task predecessor (which no longer appears in the plan) and needs only 500 tasks. This is possible because the new optimization implementation can fuse operations that have a different number of tasks. 

This reduces the number of tasks run and the amount of intermediate IO, but again it is a trade off since the number of chunks read by an operation is *multiplied* every time two operations are fused. In the original plan the 5000-task operations read 2 chunks each (from 2 input arrays), and the 500-task operations read 10 chunks each. When they are fused the combined operation of 500 tasks reads 20 chunks each.

There is an optimization setting called `max_total_num_input_blocks` which sets an upper limit on the number of blocks (chunks) that one task can read. (It defaults to 10, but we increased it to 20 for this workload.) Cubed will only fuse operations that don't cause this limit to be exceeded.

This limit explains why the whole reduction isn't fused into fewer levels and tasks. To fuse `op-082` and `op-083`, for example, would result in each task reading 200 input blocks, which would be very slow.

## Benchmarks

<!--
Running times for different sizes and clouds. Discussion of performance speed up.
-->

How does the new optimization implementation translate into running times? Here are the times running the [1.5TB workflow](https://github.com/cubed-dev/cubed-benchmarks/blob/quad-means-1.5tb/tests/benchmarks/test_array.py) using Lithops on AWS Lambda with the old and new optimization implementations:

| Optimization implementation | Compute arrays in parallel | Runtime (s) | Relative runtime |
| --- | --- | --- | --- |
| Old  | No | 475.1 | 4.8|
| New | No | 176.6 | 1.8|
| New | Yes | 100.0 | 1 |

Overall we gained a **4.8x speedup**.

<!--

| Optimization implementation | Compute arrays in parallel | Runtime (s) | Relative runtime |
| --- | --- | --- | --- |
| Old  | No | 444.1 | 4.7|
| New | No | 167.9 | 1.8|
| New | Yes | 94.9 | 1 |

| Optimization implementation | Compute arrays in parallel | Runtime (s) | Relative runtime |
| --- | --- | --- | --- |
| Old  | No | 469.3 | 4.2|
| New | No | 188.1 | 1.7|
| New | Yes | 111.0 | 1 |
-->

Most of the improvement was through the improvements in fusion, but some of the improvement was by enabling the `compute_arrays_in_parallel` runtime flag, which increases parallelism in the three independent series of computations for *U*<sup>2</sup>, *UV*, and *V*<sup>2</sup>.

The cost of running the optimized workflow was $2.27 according to the AWS billing page - this includes storage and compute, as well as the initial set up to write the random dataset to S3.

We also ran the same workflow using Lithops on Google Cloud Functions. Here is one typical run:

| Optimization implementation | Compute arrays in parallel | Runtime (s) | Relative runtime |
| --- | --- | --- | --- |
| Old  | No | 1049.4 	 | 2.1|
| New | No | 807.0 | 1.7|
| New | Yes | 488.4 | 1 |

<!--
| Optimization implementation | Compute arrays in parallel | Runtime (s) | Relative runtime |
| --- | --- | --- | --- |
| Old  | No | 1276.2 	 | 2.3|
| New | No | 1258.0 | 2.3|
| New | Yes | 544.4 | 1 |
-->

We found that running Lithops with Google Cloud Functions is slower than AWS Lambda by a significant margin. This needs more investigation, but we think function dispatch may be slower on Google Cloud Functions. We also noticed that we get more task failures. These are handled by backup tasks, but at the expense of overall runtime. Backup tasks also increase the variance of times from run to run, and this means that the overall speedup measured can vary by a wide margin.

## What's next?

Our work on the Cubed optimization implementation has yielded significant gains in speed for the Quadratic Means problem that we have focused on.

We are building a set of benchmarks in the [cubed-benchmarks](https://github.com/cubed-dev/cubed-benchmarks) repo that we will use to track the progress of further improvements. We also have some interesting features on our roadmap, such as support for [groupby in Xarray](https://github.com/cubed-dev/cubed/issues/223), and filling in some gaps in [array API support](https://github.com/cubed-dev/cubed/issues?q=is%3Aissue+is%3Aopen+label%3A%22array+api%22). 

While there are always [more optimizations](https://github.com/cubed-dev/cubed/issues?q=is%3Aissue+is%3Aopen+label%3Aoptimization) to do, we believe that Cubed's performance is now competitive enough for wider usage. If you are an Xarray user with a challenging workload we'd love you to try Cubed on your workload and let us know how it goes.

## Acknowledgments

Many thanks to Ryan Abernathey and Tom Nicholas for their valuable feedback and comments on this blog post.

This work was done in collaboration the the [Climate Data Science Lab](https://ocean-transport.github.io/) at Columbia University and supported by the Gordon and Betty Moore Foundation.
