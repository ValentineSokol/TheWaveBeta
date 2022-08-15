const GoogleStrategy = require('passport-google-oauth20').Strategy;
const VKontakteStrategy = require('passport-vkontakte').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;


const commonScope = ['profile', 'email'];
module.exports = [
    {
        name: 'google',
        strategy: GoogleStrategy,
        scope: commonScope
    },
    {
        name: 'vkontakte',
        strategy: VKontakteStrategy,
        scope: commonScope
    },
    {
        name: 'facebook',
        strategy: FacebookStrategy,
        options: {
            profileFields: ['id', 'emails', 'name']
        },
        scope: ['email', 'user_photos']
    },
];