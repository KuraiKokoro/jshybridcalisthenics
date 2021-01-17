/* jshint esversion: 8 */

const Discord = require("discord.js");

const client = new Discord.client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', (msg) => {
    if (msg.content === 'ping'){
        msg.reply('pong');
    }
});


import {token} from './.token';
client.login(token);

