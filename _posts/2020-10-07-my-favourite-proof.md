---
layout: post
title:  "My favourite proof"
---

<script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
<script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>

<p>
My younger daughter Lottie is 16 today, and I gave her a square card with \(2^4\) on one side and \(4^2\) on the other.

</p>

<p>
  \[2^4 = 4^2\]
</p>

<p>
This is the only solution to \(a^b = b^a\) for whole numbers \(a\) and \(b\). The proof of this statement is especially elegant. I can't remember where I read it first, but it was when I was doing my A-levels.
</p>

<p>
Starting with
  \[a^b = b^a\]
taking (natural) logs
  \[b \log a = a \log b\]
and rearranging, we get
  \[\frac{\log a}{a} = \frac{\log b}{b}\]
</p>

<p>
Now consider the graph
    \[y = \frac{\log x}{x}\]
</p>

plotted here in red (thanks to [Desmos](https://www.desmos.com/calculator/62sc6ptpgw)):

![Graph of y = log(x)/x]({{ site.url }}{{ site.baseurl }}/assets/my-favourite-proof-graph1.png)

<p>
The notable thing about the graph is that it intercepts the \(x\) axis at \(x=1\), rises to a maximum between \(x=2\) and \(x=3\), then steadily decreases as \(x\) increases, but never reaches the \(x\) axis.
</p>

<p>
The blue line shows the solution above graphically, since
    \[\frac{\log 2}{2} = \frac{\log 4}{4} \approx 0.35\]
</p>

<p>
Now, this graph shows that \(a=2\), \(b=4\) is the <i>only</i> solution.
</p>

<p>
To see why, imagine that there is another solution, \(a>4\). Then, draw a horizontal line through the point on the graph where \(x=a\), shown here in green:
</p>

![Graph of y = log(x)/x with non-solution]({{ site.url }}{{ site.baseurl }}/assets/my-favourite-proof-graph2.png)

<p>
The green line intercepts the red curve strictly between \(x=1\) and \(x=2\), which shows that \(x\) <i>is not a whole number</i>. Therefore, there are no whole number solutions for \(a>4\).
</p>

<p>
Finally, we can see that \(a=3\) does not have any solutions, for the same reason (the other intercept is strictly between  \(x=2\) and \(x=3\) and again is not a whole number).
</p>

<p>
The thing I like about this proof is that it proves something about <i>whole numbers</i>, by operating in the domain of <i>real numbers</i>, and by using simple arguments about the properties of the graph of a function.
</p>

<p>
[One last pleasing thing. It's easy to show (by differentiation and setting to zero), that the curve is at its maximum at \(x=e\).]
</p>
