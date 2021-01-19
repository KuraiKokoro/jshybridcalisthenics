/* jshint esversion: 8 */

require('dotenv').config();
const Discord = require("discord.js");
const {Menu} = require('discord.js-menu');
const nconf = require('nconf');
const ytsr = require('ytsr');
const ig = require('scraper-instagram');
// Load Token / Prefix from .env file
token = process.env.token;
prefix = process.env.prefix;
igToken = process.env.ig_token;
// Load Config.json file
nconf.use('file', { file: './config.json'});
nconf.load();

const igClient = new ig();
let latestPost;






const client = new Discord.Client();

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    
    // Get Latest instagram post from Profile
    let lastIGPost = await igClient.getProfile("hybrid.calisthenics").then((result) => {
        return result.lastPosts[0];
    });

    // Get latest instagram post from Profil
    setInterval(async () => {
        let newPost = await igClient.getProfile("rognordic").then((result) => {
            return result.lastPosts[0];
        });
        if (newPost.shortcode != lastIGPost.shortcode){
            lastIGPost = newPost;
            IGnewPost(newPost);
        }



    }, 18000);
});

client.on('message', async (msg) => {
    if (!msg.content.startsWith(prefix) || msg.author.bot ) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    // check ping
    if ( command === "ping" ) {
        let pingEmbed = new Discord.MessageEmbed({
            title: "Ping Stats",
            fields: [{name: "API Ping", value: `${Math.round(client.ws.ping)}ms` }]
        });
        msg.channel.send(pingEmbed);
    }

    // search videos command
    if ( command === "search" ) {
        const query = args.join(" ");
        searchEmbed.setDescription = "Searching";
        var embedMessage = await msg.channel.send(searchEmbed);


        ytSearch(query).then((result) => { 
            if (result == null) {
                resultEmbed = new Discord.MessageEmbed()
                    .setColor("#FF0000")
                    .setTitle("Failed")
                    .setTimestamp()
                    .setFooter('Bot created by AdrianH#5605');
            } else { 
            arrofEmbeds = [];
            for ( let x in result ){
                let msgEmbed = {
                    name: x,
                    content: new Discord.MessageEmbed({
                        color: "#00FF00",
                        title: result[x].title,
                        description: result[x].description,
                        author: result[x].author.name,
                        url: result[x].url,
                        footer: { text: "Bot created by AdrianH#5665" },
                        fields: { name: "Uploaded", value: result[x].uploadedAt }
                    }).setImage(result[x].thumbnails[0].url),
                    
                    reactions: {
                        '⬅': 'previous',
                        '➡': 'next',
                        '⛔': 'stop',
                        '1️⃣': 'first'
                    }
                };
                arrofEmbeds.push(msgEmbed);
            }
            let resultMenu = new Menu(msg.channel, msg.author.id, arrofEmbeds);
                embedMessage.delete();
                resultMenu.start();
                
            }        
        });
    }
    // set announcement channel
    if ( command === "setann" ){
        nconf.set('announcementChannel', msg.channel.id);
    }

    if ( command === "instagram" ){
        igClient.getProfile("hybrid.calisthenics").then((profile) => {
                console.log(profile);
                igEmbed = new Discord.MessageEmbed({
                    title: "Hybrid.Calisthenics",
                    description: profile.lastPosts[0].caption,
                    url: `http://instagram.com/p/${profile.lastPosts[0].shortcode}`
                }).setImage(profile.lastPosts[0].thumbnail);

                msg.channel.send(igEmbed);
            }
        ).catch((err) => console.log(err));
        
    }

});

const IGnewPost = (post) => {
    announcementChannel = client.channels.cache.get(nconf.get('announcementChannel'));
    const newPostEmbed = new Discord.MessageEmbed({
        title: "View post on Instagram",
        description: post.caption,
        url: `http://instagram.com/p/${post.shortcode}`
    }).setImage(post.thumbnail);

    announcementChannel.send(newPostEmbed);
};


const ytSearch = async (query) => {
    let x = await ytsr(`"Hybrid Calisthenics" ${query}`).then((result) => {
        let results = [];
        for ( let item of result.items) {
            if (item.type == "video" && item.author.url == 'https://www.youtube.com/channel/UCeJFgNahi--FKs0oJyeRDEw'){
            results.push(item);
            }
        }
        return results;
    });
    return x;
};





let searchEmbed = new Discord.MessageEmbed()
    .setColor("#7851A9")
    .setTitle("Searching...")
    .setFooter('Bot created by AdrianH#5605');


(async () => {
    console.log('Starting Bot...');
    igClient.authBySessionId(igToken)
        .then(account => console.log(account))
        .catch(err => console.log(err));
    client.login(token);

}) ();

setInterval(() => {
    console.log("Bot still running.");
    nconf.save(function (err) {
        if (err) {
          console.error(err.message);
          return;
        }
      });
  }, 1000);
