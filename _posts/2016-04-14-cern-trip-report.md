---
layout: post
title: 'CERN Trip Report'
date: '2016-04-14T12:00:00.000+01:00'
author: Tom White
---

There are road works on the approach to the main reception building at CERN. This seems appropriate, as the fabric of
CERN is in constant flux. Many of the buildings are showing their age, and there’s no push to change that, I was told,
as all the money is directed into science. This includes civil engineering to build tunnels, engineering for the
cryogenics, magnets, vacuum technology, and particle detectors, and IT for networking, and data storage and processing.

The Large Hadron Collider (LHC) is the flagship project at CERN, and in 2013 CERN confirmed that the LHC had discovered
the Higgs Boson, to worldwide acclaim.

I was at CERN with Martin Gübeli and Guido Oswald from Cloudera's Swiss office, and our host was Alberto Di Meglio, the
CEO of the CERN openlab. Openlab is a way for CERN to collaborate with industry on new technologies. The idea is that
CERN and groups of companies pursue interesting projects together. The companies get access to very large datasets and
experts with real questions to answer (not necessarily physics questions, many projects are about managing large
infrastructure assets), and CERN gets access to new tools, techniques and technologies.

Our first stop was a meeting with a couple of teams who are using CDH for various investigations.
They wanted to ask some questions about the platform in general, but also detailed questions about various issues they
were having with Spark, Impala, Parquet and Sqoop. There’s a lot of interest in Kudu, as they want to move from Oracle
to a big data equivalent, and it looks like Kudu will fit the bill. They’ll need complex types and nesting though. 

Next, Alberto took us to the LHC data centre (they spell it the British way). The LHC has four experiments (ATLAS, CMS,
ALICE, and LHCb), each of which has a detector at a different position on the ring. Each detector has a local data
centre, but they act as staging stores, since all the data is sent to the central LHC data centre.

The detectors produce around 1PB of data per second. This is such a colossal rate that they need to filter events at
source. The first filter is a FGPA that filters out known signals - the idea is to keep the unusual ones since they are
more likely to lead to interesting physics. There are two further filters, both software-based, that do realtime
filtering. After filtering they are down to something of the order of a million interesting events per second.

CERN is collecting around 25-35PB per year. In total they have 200PB of data - they keep all historical data, most of
which is archived on tape. The reason they use tape is because if a tape breaks they only lose a few megabytes (where
the tape snapped), rather than a few terabytes in the case of a disk failure. Data is shared with physics institutes
worldwide through a series of tiering arrangements, flowing out at a sustained rate of 12Gb/s.

After lunch I gave a talk about Random Decision Forests in Spark. There’s renewed interest in Machine Learning at CERN
it seems. They want to use modern techniques to improve the ability of the detector to spot interesting collisions and
particles, which is why they are investigating how they might use streaming machine learning with Spark. In the spirit
of moving the computation to the data, there is a plan to move Hadoop clusters *to* the detectors so they can run on the
lightly filtered data as it streaming in!

After my talk we made a brief visit to the ATLAS control room. The LHC is currently in operation, so it was not possible
to go into the tunnel. The control room has a continuous staff presence, even when no experiment is running (this is not
true when the equipment is being upgraded). When we were there they we in the process of running a 9 hour calibration
operation. I hadn’t realised that the experiments are run for such a long time; typically, the collision experiments are
run for many hours at a time.

You can’t see evidence of the tunnel from the surface. There’s not even a marker showing where it runs. There is a nice
mural depicting a collision in the ATLAS detector.