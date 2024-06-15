---
layout: post
title: "Very Slow Movie Player"
---

I first came across the Very Slow Movie Player on [Mat Kelcey's blog](http://matpalm.com/blog/dithernet_vsmp/) in 2020, who was inspired by [the original by Bryan Boyer](https://bryan.medium.com/very-slow-movie-player-499f76c48b62). The concept is simple: play a movie very slowly on a small e-ink screen by advancing 24 frames per hour, rather than 24 frames per second. How would "watching" a movie like this change the way you think about it?

<img alt="Very Slow Movie Player" src="{{ site.url }}{{ site.baseurl }}/assets/2024-06-15-vsmp.jpg" width="400">

I added it to my "interesting things to
make" list, but didn't get round to buying the e-ink screen until November 2022,
intending to build it over the Christmas holiday. That didn't happen, but I
finally got round to building it earlier this year.

When I started looking at how to actually build it I discovered that Tom Whitwell
(not to be confused with me, and better known for
["52 things I learned in ..."](https://medium.com/magnetic/52-things-i-learned-in-2023-a3bbb9f9323d), and [Music Thing Modular](https://www.musicthing.co.uk/)) had written an
implementation of Very Slow Movie Player that he open sourced at
[https://github.com/TomWhitwell/SlowMovie](https://github.com/TomWhitwell/SlowMovie).

The code is well maintained by a team of folks, and has very clear and comprehensive installation instructions. This made it very easy - I just had to install the code on a Raspberry Pi and configure it for the display I had bought. I managed to mount the display in a picture frame I had lying around, and just propped the Pi behind it.

<img alt="The back of Very Slow Movie Player showing a picture frame, and a Raspberry Pi" src="{{ site.url }}{{ site.baseurl }}/assets/2024-06-15-vsmp-back.jpg" width="400">

The default settings update the display by four frames every two minutes. This is faster than the original which advanced 24 frames per hour, but means that most films will "only" take a couple of months to play.

## Debugging display crashes

After running the VSMP for a few days I noticed that the display would sometimes get stuck and not refresh at all. This normally happened overnight: when we got up in the morning it didn't seem to have changed _at all_. I knew it was slow, but this was ridiculous!

Looking at the `systemd` log messages I found that the error was "Timed out waiting for display to respond". I found a [couple](https://github.com/GregDMeyer/IT8951/issues/54) of [issues](https://github.com/GregDMeyer/IT8951/issues/56) that described the same problem, but with no obvious fix.

The [notes for the driver](https://github.com/GregDMeyer/IT8951) said that changing `VCOM` and `spi_hz` values might help with performance, so I tried changing these, but this didn't make any difference.

I had also [configured the display](https://github.com/TomWhitwell/SlowMovie?tab=readme-ov-file#e-ink-display-customization) to flip the picture vertically and horizontally, because of the way I had oriented the display in the frame. Perhaps that was causing the processor to struggle? Nope - changing it to not do any extra processing didn't make a difference either.

Running `top` showed that `lightdm` (the desktop display manager) was using about one third of the CPU. Perhaps that was slowing things down and booting the Pi to the console to avoid running a desktop would help? Nope. It still crashed once or twice a day.

Restarting the process manually had always fixed the problem - there was no need to reboot the Pi - so perhaps just [getting `systemd` to restart](https://ma.ttias.be/auto-restart-crashed-service-systemd/) it for me would fix it? Not the nicest fix, but it worked, and it's been running for a couple of months now. This is the service file I ended up with:

```shell
$ cat /etc/systemd/system/slowmovie.service
[Unit]
Description=Slow Movie Player Service

StartLimitIntervalSec=500
StartLimitBurst=5

[Service]
User=tom
WorkingDirectory=/home/tom/SlowMovie
ExecStart=/home/tom/SlowMovie/.venv/bin/python3 /home/tom/SlowMovie/slowmovie.py
StandardOutput=null
StandardError=journal

Restart=on-failure
RestartSec=30s

[Install]
WantedBy=multi-user.target
```

## Living with Very Slow Movies

When I put the player in the kitchen, my family were intrigued. It quickly became something we would check to see where we were in the film ([Singin' in the Rain](https://www.themoviedb.org/movie/872-singin-in-the-rain?language=en-GB)), and when Lottie had to go back to uni, she said she was sad that she wouldn't get to see the whole film. (I would send occasional photos of it to the family group chat.)

<img alt="A scene from Singin' in the Rain displayed on a Very Slow Movie Player" src="{{ site.url }}{{ site.baseurl }}/assets/2024-06-15-singin.jpg" width="400">

What makes a good film for a VSMP? One that you know well, with strong visuals and memorable scenes. Musicals are ideal - we love musicals in this family - which is why we started with Singin' in the Rain. Ours is currently playing [Casablanca](https://www.themoviedb.org/movie/289-casablanca?language=en-GB), which we re-watched recently at normal speed to remind ourselves of the plot.

The display I bought has support for "partial refresh", which means it can refresh the display without it going through a full refresh cycle, where the screen turns white, then black, before displaying the new frame. (If you've got an e-ink screen, such as a Kindle, you will be familiar with this phenomenon.) I had hoped to use partial refresh, but [SlowMovie doesn't support it](https://github.com/TomWhitwell/SlowMovie/issues/130).

It may seem clunky, but I now actually prefer having the full refresh. I though it would be distracting, but actually this is a feature - it's not so distracting that you notice it all the time, but occasionally it catches your eye and it reminds you to have a look. This is also useful for when visitors come round - they see the refresh and then ask about it. (It's fun to see if they can guess the film.)

Overall, I highly recommend building a Very Slow Movie Player. If you ever get bored of it you can always turn it into a [Mandlebrot PiArtFrame](https://magpi.raspberrypi.com/articles/piartframe).

## Build materials

- Waveshare 6 inch E-Ink Display HAT for Raspberry Pi 1448×1072 High Definition Black/White 16 Gray Scale with Embedded Controller IT8951 USB/SPI/I80 Interface
- Raspberry Pi 4 Model B running Raspbian GNU/Linux 11 (bullseye)
- SD card
- Power supply
- Picture frame and mounting board
