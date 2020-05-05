---
layout: post
title:  "Looking for Interesting Data Projects"
---

Five years ago, in [Hadoop for Science](/2015/01/hadoop-for-science.html) I wrote about how three trends - open data, notebooks, and distributed data frames - were converging to make it easier "for scientists to analyse large amounts of data, on demand and in a way that is repeatable, using powerful high-level machine learning libraries".

In the intervening years I’ve been lucky enough to be able to help with this vision. First in the genomics space, working with a team at the [Broad Institute](https://www.broadinstitute.org/) led by David Roazen to get [GATK](https://software.broadinstitute.org/gatk/) pipelines running at scale on Spark. (And in the process getting [bioinformatics file formats to work in a distributed setting](https://github.com/disq-bio/disq).) Then in single cell analysis, where I worked with Uri Laserson’s group at [Mount Sinai](https://icahn.mssm.edu/) (NYC) to port the single cell preprocessing pipeline in [Scanpy](https://scanpy.readthedocs.io/) so it could run in parallel using [Dask](https://dask.org/), and on GPUs using [RAPIDS](https://rapids.ai/).

I’ve also been drawn to volunteer projects involving open data, including [analysing Wales school funding data](https://github.com/tomwhite/leveltheplayingfield), analysing the data for our local [car park](http://tom-e-white.com/crick-parking/), and most recently making [UK COVID-19 data machine-readable](https://github.com/tomwhite/covid-19-uk-data) (which has been used by the Financial Times for its [COVID visualizations](https://www.ft.com/coronavirus-latest)).

At the beginning of this year I went on sabbatical and started a [blog about data visualization](http://tom-e-white.com/datavision/index-alt.html) with the goal of creating one interesting visualization per week - with no constraints on dataset, visualization type, or technology. So far it’s been a useful exercise to make me become more fluent in exploring new datasets, and trying out new dataviz libraries (D3.js has become a particular favourite).

Now it’s time for something new. So, if you have an interesting data project - particularly those with infrastructure or data engineering challenges - I’d love to hear from you!
