---
layout: post
title: "Refurbishing my ZX81"
---

Forty years on since I received a ZX81 as a Christmas present, I've got it up and running again. This post has some notes on how I did it.

There are a lot of great guides explaining how to refurbish a ZX81, which go into more depth than my brief notes here. I refer to them throughout this post, and recommend them for anyone who is interested in reviving an old ZX81.

- [Sinclair ZX81 Restoration](https://retrorepairsandrefurbs.com/2021/07/05/sinclair-zx81-restoration/) by Adam Wilson
- [Restoring and Exploring a 1981 Sinclair ZX81](https://www.youtube.com/watch?v=xyluEM0N6TY) by RMC - The Cave
- [Simple Start to Retrofitting a ZX81](https://www.zx81keyboardadventure.com/2017/02/simple-start-to-retrofitting-zx81.html) by David Stephenson
- [Rejuvenating my geriatric childhood friend](http://kevman3d.blogspot.com/2016/02/rejuvenating-my-geriatric-childhood.html) by kevman3d

### Display

The ZX81 produces RF output for old TVs, so the first thing I had to think about was a modification to produce composite output for more modern TVs. Luckily, there are lots of kits to do this, which makes it pretty straightforward.

I got a [ZX2020 kit](https://zxrenew.co.uk/ZX81-Composite-Modulator-replacement-p364473489) from [ZX Renew](https://zxrenew.co.uk/). After reading [Rejuvenating my geriatric childhood friend](http://kevman3d.blogspot.com/2016/02/rejuvenating-my-geriatric-childhood.html), I was prepared for it to be a bit of a battle, but it wasn't as I had a different kit which involved removing the original RF box completely, and replacing it with a small, custom-made PCB. Using some solder braid and a desoldering pump I managed to remove the RF box without too much trouble.

![ZX81 with composite video mod]({{ site.url }}{{ site.baseurl }}/assets/zx81_with_composite_video_mod.jpg)

Another problem was that I don't own a TV with a composite video input. So I went looking on eBay, and after reading [ZX81 Video Monitor Perfection?](https://www.zx81keyboardadventure.com/2017/08/zx81-video-monitor-perfection.html) settled on an old (80s vintage) PVM (Professional Video Monitor) with a CRT. I got a [Sony PVM9020ME SM](https://archive.org/details/manual_PVM9020ME_SM_SONY/page/n5/mode/1up). Its 8-inch screen seemed appropriate as it wasn't much smaller than the black and white TV I used with my ZX81 when I was using it in the early 1980s. An LCD screen was another option, and while lacking the retro hum it would have a nice sharp display.

### Power supply

Before I could see if the composite video mod had worked, I needed to give the ZX81 power supply some attention.

The original power supply no longer had a power jack. There were just bare wires at the DC end, as I must have cut it off at some point for another project. The jack is a 3.5mm mono audio jack, which is unusual for a power supply. The Spectrum uses the more standard DC barrel type connector. Unfortunately, I didn't realise the [power supplies for the ZX81 and Spectrum](https://spectrumforeveryone.com/features/zx-spectrum-running-zx81-power/) were different, and I ordered a connector for the Spectrum, assuming they were the same.

But, no problem, as I got the power supply working again by simply soldering a new jack to the bare wires. The (inner) tip needs to be positive, and the outer ring is ground. I also replaced the mains plug with a modern one with insulated live and neutral prongs.

A multimeter reading told me that the power supply was producing about 14.4V, rather than the nominal 9V, which is to be expected since it is an unregulated power supply.

At this point I plugged in the power and the video cable into the ZX81, turned on the power ... and I saw the familiar inverse `K` symbol!

![ZX81 working again]({{ site.url }}{{ site.baseurl }}/assets/zx81_working.jpg)

### Voltage regulator

I noticed that the heatsink on the voltage regulator was getting pretty hot even after running for only a couple of minutes.

To avoid this, it's a [good idea](https://retrorepairsandrefurbs.com/2021/07/05/sinclair-zx81-restoration/) to replace the original voltage regulator with a more efficient version that doesn't need a heatsink. I used the [TSR 1-2450 from You Make Robots](https://www.youmakerobots.com/sinclair/68-zx-spectrum-zx81-5v-regulator-upgrade.html).

It took a bit of effort to get the solder out, and I snapped one of the legs of the old regulator when removing it.

![ZX81 with new voltage regulator]({{ site.url }}{{ site.baseurl }}/assets/zx81_voltage_regulator.jpg)

I checked it still worked after changing the regulator - thankfully it did.

### Capacitors

Although the ZX81 seemed to be working fine (although I hadn't tested the keyboard at this point), most things I've read say it's a good idea to replace the capacitors, also know as "re-capping". I got replacement capacitors from [Retroleum](https://www.retroleum.co.uk/zx81-components), which has packs for different board revisions. Mine was an issue one board from 1980 (this is printed on the board itself), so I only had to replace two capacitors, C3 and C5.

Desoldering was a bit of a fiddle; this [blog post](http://blog.retroleum.co.uk/electronics-articles/re-capping-the-spectrum/) has some tips that I found useful.

### Keyboard

I was amazed to learn that there are people still making the ZX81 keyboard - so I picked one up from [ZX Renew](https://zxrenew.co.uk/Sinclair-ZX81-Membrane-p102352920). Replacing the keyboard was fairly easy, and required no soldering. (I basically did what was described in [this blog post](http://kevman3d.blogspot.com/2016/02/rejuvenating-my-geriatric-childhood.html).)

### Running a program

After all that work I turned on the ZX81 and I tried running a small program:

![ZX81 all done]({{ site.url }}{{ site.baseurl }}/assets/zx81_all_done.jpg)

So that's where I've got to. I'm slightly surprised that it works at all after all these years and after making all these modifications.

The next obvious thing to do is to load some programs. This [TZXDuino kit](https://www.youmakerobots.com/retro-microsd-tape-device/42-tzxduinocasduinomaxduino-kit.html) looks tempting. I could use it to load [the first program I wrote](https://github.com/tomwhite/zx81-frogging), which I reverse engineered from a cassette tape a few years ago. Or I could just type it in, like in the old days...
