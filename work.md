---
layout: page
title: Work
permalink: /work/
---

My long-term professional interest centres around large-scale distributed storage and processing.

The chart below shows the main open-source projects I have worked on professionally over my career.
Each dot is a week where I contributed in some way to the project code - typically a commit of
some code I wrote, or (for the Hadoop projects) reviewing and committing someone else's code.
I have contributed to many more projects than the ones shown here, but these are ones
to which I made sustained contributions, usually over multiple years.

<style>
  #work-chart { overflow-x: auto; margin-bottom: 15px; }
  #work-chart svg { max-width: none; }
</style>
<div id="work-chart"></div>
<script type="module" src="/assets/js/work-chart.js"></script>

Broadly speaking there are three main phases.

## Hadoop

I was one of the first committers on [Apache Hadoop](https://hadoop.apache.org/), and from 2006 to 2015 I worked on it and many other distributed systems projects in the Hadoop ecosystem
(mainly [Avro](https://github.com/apache/avro), [Parquet](https://github.com/apache/parquet-java), [Crunch](https://github.com/apache/crunch), [Kite](https://github.com/kite-sdk/kite), and [Whirr](https://github.com/apache/whirr)),
for the best part of a decade while working at [Cloudera](https://www.cloudera.com/).
I also wrote four editions of the bestselling book [Hadoop: The Definitive Guide](http://www.hadoopbook.com/), published by O'Reilly, from 2008 to 2012.

## Hadoop and Genomics

In 2015 I joined the data science team at Cloudera and shifted my focus to applications running on Hadoop and Spark.
I was the primary author of Spark support in [GATK](https://software.broadinstitute.org/gatk/), working with members of the [Broad Institute](https://www.broadinstitute.org/) GATK team from 2015 to 2019,
and contributed to related projects ([Hadoop-BAM](https://github.com/HadoopGenomics/Hadoop-BAM), [htsjdk](https://github.com/samtools/htsjdk)).
I also created [Disq](https://github.com/disq-bio/disq) for reading and writing bioinformatics sequencing formats from Spark.
I left Cloudera in 2018, but continued working on these projects through to the end of 2019.

During this time I also ported the single cell preprocessing pipeline in [Scanpy](https://scanpy.readthedocs.io/) so it could run in parallel using [Dask](https://dask.org/), and on GPUs using [RAPIDS](https://rapids.ai/),
and made contributions to the dimensionality reduction software [UMAP](https://umap-learn.readthedocs.io/) and the related project
[pynndescent](https://github.com/lmcinnes/pynndescent) (for calculating approximate nearest neighbours).

## Python and Genomics

In June 2020, I started working for [Related Sciences](https://www.related.vc/) on [sgkit](https://github.com/sgkit-dev/sgkit), a statistical genetics toolkit based on PyData technologies like Dask, Xarray, and Zarr. This work culminated in a new Zarr-based file format for variant data ([VCF Zarr](https://github.com/sgkit-dev/vcf-zarr-spec)), new tools for working with this data ([bio2zarr](https://github.com/sgkit-dev/bio2zarr), [vcztools](https://github.com/sgkit-dev/vcztools), and [vczstore](https://github.com/sgkit-dev/vczstore)), and a published paper: ['Analysis-ready VCF at Biobank scale using Zarr'](https://academic.oup.com/gigascience/article/doi/10.1093/gigascience/giaf049/8154315).

In tandem with this I developed [Cubed](https://github.com/cubed-dev/cubed), a project I started in 2022 as a drop-in replacement for Dask, to make
running large-scale array processing workloads more reliable. It has been used for workloads in sgkit (genomics) and Pangeo (geoscience).
