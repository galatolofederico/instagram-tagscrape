ig = require('./index');
proxy = "<HTTP/HTTPS PROXY>"

ig.scrapeTagPage("test", proxy).then( (r) => {
    console.log("scrapeTagPage: OK")
}).catch( () => {
    console.log("scrapeTagPage: ERROR")
})

ig.deepScrapeTagPage("test", proxy).then(r => {
    console.log("deepScrapeTagPage: OK")
}).catch( () => {
    console.log("deepScrapeTagPage: ERROR")
})

ig.scrapePostPage('BMm39DKD6DB', proxy).then(r => {
    console.log("scrapePostPage: OK")
}).catch( () => {
    console.log("scrapePostPage: ERROR")
})

ig.scrapeLocationPage(542401, proxy).then(r => {
    console.log("scrapeLocationPage: OK")
}).catch( () => {
    console.log("scrapeLocationPage: ERROR")
})

