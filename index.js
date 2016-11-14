var request = require('request'),
    Promise = require('bluebird'),
    fs      = require('fs'),
    listURL = 'https://www.instagram.com/explore/tags/',
    postURL = 'https://www.instagram.com/p/',
    locURL  = 'https://www.instagram.com/explore/locations/',
    dataExp = /window\._sharedData\s?=\s?({.+);<\/script>/;

exports.deepScrapeTagPage = function(tag) {
    return new Promise(function(resolve, reject){
        exports.scrapeTagPage(tag).then(function(tagPage){
            return Promise.map(tagPage.media, function(media, i, len) {
                return exports.scrapePostPage(media.code).then(function(postPage){
                    tagPage.media[i] = postPage;
                    if (postPage.location != null && postPage.location.has_public_page) {
                        return exports.scrapeLocationPage(postPage.location.id).then(function(locationPage){
                            tagPage.media[i].location = locationPage;
                        });
                    }
                });
            })
            .then(function(){ resolve(tagPage); });
        });        
    });
};

exports.scrapeTagPage = function(tag) {
    return new Promise(function(resolve, reject){
        if (!tag) return reject(new Error('Argument "tag" must be specified'));

        request(listURL + tag, function(err, response, body){
            if (err) return reject(err);

            var data = scrape(body)
            var media = data.entry_data.TagPage[0].tag.media;
            resolve({
                total: media.count,
                count: media.nodes.length,
                media: media.nodes
            });
        })
    });
};

exports.scrapeLocationPage = function(id) {
    return new Promise(function(resolve, reject){
        if (!id) return reject(new Error('Argument "id" must be specified'));
        
        request(locURL + id, function(err, response, body){
            var loc = scrape(body).entry_data.LocationsPage[0].location;
            resolve(loc); 
        });
    });
}

exports.scrapePostPage = function(code) {
    return new Promise(function(resolve, reject){
        if (!code) return reject(new Error('Argument "code" must be specified'));

        request(postURL + code, function(err, response, body){
            var data = scrape(body);
            resolve(data.entry_data.PostPage[0].media); 
        });
    });
}

var scrape = function(html) {
    var dataString = html.match(dataExp)[1];

    try {
        var json = JSON.parse(dataString);
    }
    catch(e) {
        if (process.env.NODE_ENV == 'development') {
            console.log('Last 100 chars: ' + dataString.substr(-100, 100));
            fs.writeFileSync('./debug.html', body, 'utf8');
        }
        throw e;
    }

    return json;
}