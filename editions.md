---
layout: page
title: Editions
group: navigation
---
{% include JB/setup %}

The following sections are from the book's preface, and outline the changes in each edition.
You can find the list of chapters in each edition on this [wiki page](https://github.com/tomwhite/hadoop-book/wiki/Chapter-Numbers-By-Edition).

## What's New in the Fourth Edition?

The fourth edition covers Hadoop 2 exclusively. The Hadoop 2 release series is the current
active release series and contains the most stable versions of Hadoop.

There are new chapters covering YARN (Chapter 4), Parquet (Chapter 13), Flume (Chapter 14), Crunch (Chapter 18), and Spark (Chapter 19). There’s also a new section to help readers navigate different pathways through the book, see "What’s in This Book?".

This edition includes two new case studies (Part V): one on how Hadoop is used in healthcare systems, and another on using Hadoop technologies for genomics data processing. Case studies from the previous editions can now be found online ([http://bit.ly/hadoop_tdg_prev](http://bit.ly/hadoop_tdg_prev)).

Many corrections, updates and improvements have been made to existing chapters to bring them up to date with the latest releases of Hadoop and its related projects.

## What's New in the Third Edition?

The third edition covers the 1.x (formerly 0.20) release series of Apache Hadoop, as well as
the newer 0.22 and 0.23 series. With a few exceptions, which are noted in the text, all the
examples in this book run
against these versions. The features in each release series are described at a high-level
in &quot;Hadoop Releases&quot; in Chapter 1.

This edition uses the new MapReduce API for most of the examples. Since the old API is
still in widespread use, it continues to be discussed in the text alongside the new API, and the equivalent code
using the old API can be found on the book’s website.

The major change in Hadoop 0.23 is the new MapReduce runtime, MapReduce 2, which is
built on a new distributed resource management system called YARN. This edition includes
new sections covering MapReduce on YARN: how it works (Chapter 6)
and how to run it (Chapter 9).

There is more MapReduce material too, including development practices like packaging MapReduce jobs
with Maven, setting the user’s Java classpath, and writing tests with MRUnit (all in Chapter
5); and more depth on features such as output committers, the distributed
cache (both in Chapter 8), and task memory
monitoring (Chapter 9). There is a new section on
writing MapReduce jobs to process Avro data (Chapter 4), and on running a simple MapReduce workflow in Oozie (Chapter 5).

The chapter on HDFS (Chapter 3) now has introductions to High Availability, Federation, and the new WebHDFS and HttpFS filesystems.

The chapters on Pig, Hive, Sqoop, and ZooKeeper have all been expanded to cover the new features and changes in their latest releases.

In addition, numerous corrections and improvements have been made throughout the book.

## What's New in the Second Edition?

The second edition has two new chapters on Hive and Sqoop (Chapters 12 and 15), a new section covering Avro (in Chapter 4), an introduction to the new security features in Hadoop (in Chapter 9), and a new case study on analyzing massive network graphs using Hadoop (in Chapter 16).

This edition continues to describe the 0.20 release series of Apache Hadoop because this was the latest stable release at the time of writing. New features from later releases are occasionally mentioned in the text, however, with reference to the version that they were introduced in.