
# Jekyll will import posts from Blogger, but they still contain image
# references to Blogger's CDN. This script:
# - Finds all image references in an imported blogger page
# - Downloads the images into the assets/ directory
# - Rewrites the page with the appropriate image link

import re
import sys
import urllib

IMG_RE = re.compile('<img[^>]+src="(?P<src>[^"]+)"')
A_RE = re.compile('<a[^>]+href="(?P<href>http[^"]+(.jpg|.png|.gif))"')
DATE_RE = re.compile('(?P<date>[0-9]+\-[0-9]+\-[0-9]+)')

for filename in sys.argv[1:]:
    print(filename)
    date_prefix = DATE_RE.search(filename).group('date')
    with open(filename, 'r') as f:
        file_index = 0
        contents = f.read()
        for match in IMG_RE.finditer(contents):
            sourceurl = match.group('src')
            extstart = sourceurl.rfind('.')
            extension = sourceurl[extstart:]
            newfile = date_prefix + '-image-{:04d}{}'.format(file_index, extension)
            file_index += 1
            print('{} => {}'.format(sourceurl, newfile))
            urllib.FancyURLopener().retrieve(sourceurl, '../assets/' + newfile)
            contents = contents.replace(sourceurl, '{{ site.url }}/assets/' + newfile)
        for match in A_RE.finditer(contents):
            sourceurl = match.group('href')
            extstart = sourceurl.rfind('.')
            extension = sourceurl[extstart:]
            newfile = date_prefix + '-image-{:04d}{}'.format(file_index, extension)
            file_index += 1
            print('{} => {}'.format(sourceurl, newfile))
            urllib.FancyURLopener().retrieve(sourceurl, '../assets/' + newfile)
            contents = contents.replace(sourceurl, '{{ site.url }}/assets/' + newfile)

    with open(filename, 'w') as f:
        f.write(contents)
