instagram-tagscrape-proxy
==============
Proxied version of the instagram-tagscrape module.

Please refer to the original [documentation](https://github.com/nordhagen/instagram-tagscrape).

## Usage
Each function of the original module accepts an optional *proxy* argument

```javascript
var ig = require('instagram-tagscrape-proxy');

ig.scrapeTagPage('bernie', "http://<YOUR PROXY>").then(function(result){
    console.dir(result);
})
```