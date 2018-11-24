var express = require('express');
var router = express.Router();
let steem = require("steem");
let Feed = require("feed").Feed;

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
              content: post.body,
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
              content: post.body,
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
              content: post.body,
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

module.exports = router;
