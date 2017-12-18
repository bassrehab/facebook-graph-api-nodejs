/**
 * Created by sid on 1/5/17.
 */
var express = require('express');
var router = express.Router();
var conf = require('../config/settings');
var graph = require('../controllers/facebook/index');
var controllers = require('../controllers');
var _ = require('underscore');


/* GET page details. */
router.get('/:pageID', function(req, res, next) {
    graph.setAppSecret(conf.fb.app.app_secret);

    sess = req.session;

    console.log('Generate View for Page');

    var page_id = req.params.pageID;
    console.log('Page ID requested:' + page_id);
    var user_token = sess.user_token;

    console.log('Pages Data in session:');
    console.log(sess.pages);




    if(current_page = _.find(sess.pages, function(page) {
        return page.id == page_id;
    })){
        console.log('Current Page details from Session');
        console.log(current_page.token + " | " + page_id + " | " + current_page.name);

        graph.setAppSecret(conf.fb.app.app_secret);
        graph.get("/"+page_id+"/posts?access_token="+current_page.token, function(err, publishedposts) {

            if(err){
                console.log(err);
                if(err.code == 190){
                    res.redirect('/authorize');
                }
                var pageObj = {
                    title: 'Error',
                    result: 'Error: Could not load the page posts. Try logging out and logging back in again.',
                    error: true,
                    user_token: null
                };
                res.render("view-page", pageObj);

            }
            else{

                graph.get("/"+page_id+"/promotable_posts?access_token="+current_page.token, function(err, promotableposts) {
                    if(err) {
                        console.log(err);
                        if (err.code == 190) {
                            res.redirect('/authorize');
                        }
                        pageObj = {
                            title: 'Error',
                            result: 'Error: Could not load the page posts. Try logging out and logging back in again.',
                            error: true,
                            user_token: null
                        };
                        res.render("view-page", pageObj);
                    }
                    else{
                        // Merge and prepare Unique Posts out of regular and unpublished posts

                        Array.prototype.push.apply(publishedposts.data,promotableposts.data);
                        console.log(_.uniq(publishedposts.data, 'id'));
                        var cleaned_posts = _.filter(_.uniq(publishedposts.data, 'id'), function(o) { return o.message; });


                        pageObj = {
                            title: 'Posts - ' + current_page.name,
                            page:JSON.stringify({
                                name: current_page.name,
                                id:page_id
                            }),
                            data:JSON.stringify(
                                _.map(cleaned_posts, function(post) {
                                    graph.get("/"+post.id+"/insights/post_impressions/lifetime?access_token="+current_page.token, function(err, views){
                                        console.log(err);
                                        console.log('view count');
                                        console.log(views.data[0].values[0].value);
                                        console.log(JSON.stringify(views));
                                        post.views = views.data[0].values[0].value;

                                    });
                                    console.log('Modified Post is:'+JSON.stringify(post));
                                    return post;
                                })
                            ), // remove duplicate posts


                            error: false
                        };
                        res.render("view-page", pageObj);
                        console.log('pageObj in view-page.js' + JSON.stringify(pageObj));

                    }
                });


            }

        });



    }
    else{
        // some error.
        pageObj = {
            title: 'Error',
            result: 'Error: Could not load the page posts. Try logging out and logging back in again.',
            error: true,
            user_token: null
        };

        res.render("view-page", pageObj);
    }
});


module.exports = router;
