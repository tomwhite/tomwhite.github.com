## Tom White's Projects

A website with links to some of my projects.

### Tools

#### Project descriptions

Metadata for each project is pulled from GitHub: the name, description, homepage, and code URL.

Start a local server:

```bash
python -m SimpleHTTPServer 8008
```

Go to http://localhost:8008/create-project-json.html, then copy the contents of downloaded
file to the relevant place in _index.html_.

#### Project logo

Each project must have a _logo.png_ file.

How to convert a (possibly dynamic) SVG to a PNG image to act as a project logo.

First install the [SVG Crowbar bookmarklet](http://nytimes.github.io/svg-crowbar/).
Then go to the page with a SVG image on it and download it.

```bash
mv "$(ls -t ~/Downloads/*.svg | head -1)" logo.svg
python -m SimpleHTTPServer 8008
```

If the SVG doesn't have `width` and `height` attributes (e.g. if produced by jsxgraph), then edit it to make sure it does.

Go to http://localhost:8008/create-logo.html

Then copy the logo

```bash
mv "$(ls -t ~/Downloads/*.png | head -1)" logo.png
```

Based on https://gist.github.com/mbostock/6466603.
