/**
 * Created by sid on 1/5/17.
 */
var config = {
    host: '', // Not required
    port: process.env.PORT || 3000,

    fb:{
        app:{
            client_id:      'YOUR CLIENT ID',
            client_secret:  'YOUR CLIENT SECRET',
            scope:          'email, publish_actions, user_location, user_photos, user_videos, user_posts, user_friends,user_status, user_about_me, ads_management, pages_messaging, read_page_mailboxes, ads_read, rsvp_event, business_management, pages_messaging_phone_number, user_events, manage_pages, pages_messaging_subscriptions, user_managed_groups, pages_manage_cta, pages_show_list, pages_manage_instant_articles, publish_pages, user_actions.books, user_actions.music, user_actions.video, user_actions.fitness, user_actions.news, read_audience_network_insights, read_custom_friendlists, read_insights',
            redirect_uri:   'http://localhost:3000/authorize',
            app_secret:'YOUR APP_SECRET'
        },

        graph:{
            version: "2.8"
        }
    }
};

module.exports = config;