---
layout: page
title: Code and Data
group: navigation
---
{% include JB/setup %}

The book's example code is available from GitHub at [http://github.com/tomwhite/hadoop-book/](http://github.com/tomwhite/hadoop-book/). Code for each edition can be found in separate [branches](https://github.com/tomwhite/hadoop-book/branches).

A sample of the NCDC weather dataset that is used throughout the book can be found at [https://github.com/tomwhite/hadoop-book/tree/master/input/ncdc/all](https://github.com/tomwhite/hadoop-book/tree/master/input/ncdc/all).

The full dataset is stored on Amazon S3 in the `hadoopbook` bucket, and if you have an AWS account you can copy it to a EC2-based Hadoop cluster using Hadoop's `distcp` command (run from a machine in the cluster):

    hadoop distcp \
      -Dfs.s3n.awsAccessKeyId='...' \
      -Dfs.s3n.awsSecretAccessKey='...' \
      s3n://hadoopbook/ncdc/all input/ncdc/all

Note that the Hadoop cluster has to be running in the US East (Northern Virginia) EC2 Region since access to this S3 bucket is restricted to this region to avoid data transfer fees. (Of course, you are free to copy the data from your EC2 cluster to another cluster in another EC2 region, or outside EC2 entirely, although that will incur standard AWS transfer fees.)