var express = require('express');
var router = express.Router();
let steem = require("steem");
let Feed = require("feed").Feed;
var Remarkable = require('remarkable');
var md = new Remarkable({html:true, breaks: true, linkify: true});

const getValidImage = array => {
    return array &&
    Array.isArray(array) &&
    array.length >= 1 &&
    typeof array[0] === 'string'
        ? array[0]
        : null;
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/rss/@:account", (req, res) => {

    let {account} = req.params;

    let feed = new Feed({
        title: "Posts by @" + account,
        description: "Steemit blog from @" +account,
        id: "@" +account,
        link: "https://steemit.com/@" + account,
        image: "https://steemitimages.com/u/"+account+"/avatar",
        favicon: "https://steemit.com/images/favicons/favicon-32x32.png",
        copyright: "All rights reserved "+(new Date().getFullYear())+", @"+account,
        generator: "SteemFeed", // optional, default = 'Feed for Node.js'
        feedLinks: {
            json: "https://steemfeed.com/json/@"+account,
            atom: "https://steemfeed.com/atom/@" +account
        },
        author: {
            name: "SteemFeed",
            email: "contact@steemfeed.com",
            link: "https://steemfeed.com"
        }
    });

    steem.api.getDiscussionsByAuthorBeforeDate(req.params.account, "", '2100-01-01T00:00:00', 25,	(err, result) =>{
      result.forEach(post => {

          let image = "";

          try {
              let jsonMetadata = JSON.parse(post.json_metadata);
              if (jsonMetadata && jsonMetadata.image) {
                  image = getValidImage(jsonMetadata.image);
              }
          } catch (e) {

          }

          feed.addItem({
            title: post.title,
              id: post.permlink,
              link: 'https://steemit.com/' + post.category + '/@' + post.author + '/' + post.permlink,
              content: md.render(post.body),
              author: [
                  {
                      name: "@" + post.author,
                      link: 'https://steemit.com/@'+post.author
                  }
              ],
              date: (new Date(post.created)),
              image
          });
      })
        feed.addCategory("Technologie");
      res.type("xml")
      res.send(feed.rss2())
    });
});
router.get("/atom/@:account", (req, res) => {

    let {account} = req.params;

    let feed = new Feed({
        title: "Posts by @" + account,
        description: "Steemit blog from @" +account,
        id: "@" +account,
        link: "https://steemit.com/@" + account,
        image: "https://steemitimages.com/u/"+account+"/avatar",
        favicon: "https://steemit.com/images/favicons/favicon-32x32.png",
        copyright: "All rights reserved "+(new Date().getFullYear())+", @"+account,
        generator: "SteemFeed", // optional, default = 'Feed for Node.js'
        feedLinks: {
            json: "https://steemfeed.com/json/@"+account,
            rss: "https://steemfeed.com/rss/@" +account
        },
        author: {
            name: "SteemFeed",
            email: "contact@steemfeed.com",
            link: "https://steemfeed.com"
        }
    });

    steem.api.getDiscussionsByAuthorBeforeDate(req.params.account, "", '2100-01-01T00:00:00', 25,	(err, result) =>{
      result.forEach(post => {

          let image = "";

          try {
              let jsonMetadata = JSON.parse(post.json_metadata);
              if (jsonMetadata && jsonMetadata.image) {
                  image = getValidImage(jsonMetadata.image);
              }
          } catch (e) {

          }

          feed.addItem({
            title: post.title,
              id: post.permlink,
              link: 'https://steemit.com/' + post.category + '/@' + post.author + '/' + post.permlink,
              content: md.render(post.body),
              author: [
                  {
                      name: "@" + post.author,
                      link: 'https://steemit.com/@'+post.author
                  }
              ],
              date: (new Date(post.created)),
              image
          });
      })
        feed.addCategory("Technologie");
      res.type("xml")
      res.send(feed.atom1())
    });
});
router.get("/json/@:account", (req, res) => {

    let {account} = req.params;

    let feed = new Feed({
        title: "Posts by @" + account,
        description: "Steemit blog from @" +account,
        id: "@" +account,
        link: "https://steemit.com/@" + account,
        image: "https://steemitimages.com/u/"+account+"/avatar",
        favicon: "https://steemit.com/images/favicons/favicon-32x32.png",
        copyright: "All rights reserved "+(new Date().getFullYear())+", @"+account,
        generator: "SteemFeed", // optional, default = 'Feed for Node.js'
        feedLinks: {
            rss: "https://steemfeed.com/rss/@"+account,
            atom: "https://steemfeed.com/atom/@" +account
        },
        author: {
            name: "SteemFeed",
            email: "contact@steemfeed.com",
            link: "https://steemfeed.com"
        }
    });

    steem.api.getDiscussionsByAuthorBeforeDate(req.params.account, "", '2100-01-01T00:00:00', 25,	(err, result) =>{
      result.forEach(post => {

          let image = "";

          try {
              let jsonMetadata = JSON.parse(post.json_metadata);
              if (jsonMetadata && jsonMetadata.image) {
                  image = getValidImage(jsonMetadata.image);
              }
          } catch (e) {

          }

          feed.addItem({
            title: post.title,
              id: post.permlink,
              link: 'https://steemit.com/' + post.category + '/@' + post.author + '/' + post.permlink,
              content: md.render(post.body),
              author: [
                  {
                      name: "@" + post.author,
                      link: 'https://steemit.com/@'+post.author
                  }
              ],
              date: (new Date(post.created)),
              image
          });
      })
        feed.addCategory("Technologie");
      // res.type("json")
      res.json(JSON.parse(feed.json1()))
    });
});

router.get('/reblog/rss/@:account', (req, res) => {
    let {account} = req.params;
    var query = {
        tag: account,
        limit: 25
    };

    let feed = new Feed({
        title: "Reblogs by @" + account,
        description: "Steemit reblogs from @" +account,
        id: "@" +account,
        link: "https://steemit.com/@" + account,
        image: "https://steemitimages.com/u/"+account+"/avatar",
        favicon: "https://steemit.com/images/favicons/favicon-32x32.png",
        copyright: "All rights reserved "+(new Date().getFullYear())+", @"+account,
        generator: "SteemFeed", // optional, default = 'Feed for Node.js'
        feedLinks: {
            rss: "https://steemfeed.com/reblog/rss/@"+account,
            atom: "https://steemfeed.com/reblog/atom/@" +account
        },
        author: {
            name: "SteemFeed",
            email: "contact@steemfeed.com",
            link: "https://steemfeed.com"
        }
    });

    steem.api.getDiscussionsByBlog(query, function (err, result) {
        if(err) {
            res.send("404")
        } else {
            result = result.map(p => {
                return {
                    title: p.title,
                    permlink: p.permlink,
                    category: p.category,
                    author: p.author,
                    created: p.created,
                    first_reblogged_on: p.first_reblogged_on,
                    json_metadata: JSON.parse(p.json_metadata)
                }
            });
            result = result.filter((p) => {
                return p.first_reblogged_on !== undefined
            });

            result.forEach(p => {

                let image = null;

                if (p.json_metadata && p.json_metadata.image) {
                    image = getValidImage(p.json_metadata.image);
                }

                feed.addItem({
                    title: p.title,
                    id: p.permlink,
                    link: 'https://steemit.com/' + p.category + '/@' + p.author + '/' + p.permlink,
                    author: [
                        {
                            name: "@" + p.author,
                            link: 'https://steemit.com/@'+p.author
                        }
                    ],
                    date: (new Date(p.created)),
                    image
                });
            });

            feed.addCategory("Technologie");

            res.type("xml");
            res.send(feed.rss2())
        }
    });

});
router.get('/reblog/atom/@:account', (req, res) => {
    let {account} = req.params;
    var query = {
        tag: account,
        limit: 25
    };

    let feed = new Feed({
        title: "Reblogs by @" + account,
        description: "Steemit reblogs from @" +account,
        id: "@" +account,
        link: "https://steemit.com/@" + account,
        image: "https://steemitimages.com/u/"+account+"/avatar",
        favicon: "https://steemit.com/images/favicons/favicon-32x32.png",
        copyright: "All rights reserved "+(new Date().getFullYear())+", @"+account,
        generator: "SteemFeed", // optional, default = 'Feed for Node.js'
        feedLinks: {
            rss: "https://steemfeed.com/reblog/rss/@"+account,
            atom: "https://steemfeed.com/reblog/atom/@" +account
        },
        author: {
            name: "SteemFeed",
            email: "contact@steemfeed.com",
            link: "https://steemfeed.com"
        }
    });

    steem.api.getDiscussionsByBlog(query, function (err, result) {
        if(err) {
            res.send("404")
        } else {
            result = result.map(p => {
                return {
                    title: p.title,
                    permlink: p.permlink,
                    category: p.category,
                    author: p.author,
                    created: p.created,
                    first_reblogged_on: p.first_reblogged_on,
                    json_metadata: JSON.parse(p.json_metadata)
                }
            });
            result = result.filter((p) => {
                return p.first_reblogged_on !== undefined
            });

            result.forEach(p => {

                let image = null;

                if (p.json_metadata && p.json_metadata.image) {
                    image = getValidImage(p.json_metadata.image);
                }

                feed.addItem({
                    title: p.title,
                    id: p.permlink,
                    link: 'https://steemit.com/' + p.category + '/@' + p.author + '/' + p.permlink,
                    author: [
                        {
                            name: "@" + p.author,
                            link: 'https://steemit.com/@'+p.author
                        }
                    ],
                    date: (new Date(p.created)),
                    image
                });
            });

            feed.addCategory("Technologie");

            res.type("xml");
            res.send(feed.atom1())
        }
    });
});
router.get('/reblog/json/@:account', (req, res) => {
    let {account} = req.params;
    var query = {
        tag: account,
        limit: 25
    };

    let feed = new Feed({
        title: "Reblogs by @" + account,
        description: "Steemit reblogs from @" +account,
        id: "@" +account,
        link: "https://steemit.com/@" + account,
        image: "https://steemitimages.com/u/"+account+"/avatar",
        favicon: "https://steemit.com/images/favicons/favicon-32x32.png",
        copyright: "All rights reserved "+(new Date().getFullYear())+", @"+account,
        generator: "SteemFeed", // optional, default = 'Feed for Node.js'
        feedLinks: {
            rss: "https://steemfeed.com/reblog/rss/@"+account,
            atom: "https://steemfeed.com/reblog/atom/@" +account
        },
        author: {
            name: "SteemFeed",
            email: "contact@steemfeed.com",
            link: "https://steemfeed.com"
        }
    });

    steem.api.getDiscussionsByBlog(query, function (err, result) {
        if(err) {
            res.send("404")
        } else {
            result = result.map(p => {
                return {
                    title: p.title,
                    permlink: p.permlink,
                    category: p.category,
                    author: p.author,
                    created: p.created,
                    first_reblogged_on: p.first_reblogged_on,
                    json_metadata: JSON.parse(p.json_metadata)
                }
            });
            result = result.filter((p) => {
                return p.first_reblogged_on !== undefined
            });

            result.forEach(p => {

                let image = null;
                if (p.json_metadata && p.json_metadata.image) {
                    image = getValidImage(p.json_metadata.image);
                }

                console.log(image)

                feed.addItem({
                    title: p.title,
                    id: p.permlink,
                    link: 'https://steemit.com/' + p.category + '/@' + p.author + '/' + p.permlink,
                    author: [
                        {
                            name: "@" + p.author,
                            link: 'https://steemit.com/@'+p.author
                        }
                    ],
                    date: (new Date(p.created)),
                    image
                });
            });

            feed.addCategory("Technologie");

            res.json(JSON.parse(feed.json1()))
        }
    });
});

module.exports = router;
