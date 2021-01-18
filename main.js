/* jshint esversion: 8 */

require('dotenv').config();
const Discord = require("discord.js");
const {Menu} = require('discord.js-menu');
const nconf = require('nconf');


token = process.env.token;
prefix = process.env.prefix;


const ytsr = require('ytsr');

nconf.use('file', { file: './config.json'});
nconf.load();

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
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


        ytDlSearch(query).then((result) => { 
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
        nconf.set('announcementChannel', msg.channel.id );
    }

});


const ytDlSearch = async (query) => {
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



client.login(token);

setInterval(() => {
    console.log("Bot still running.");
    nconf.save(function (err) {
        if (err) {
          console.error(err.message);
          return;
        }
      });
  }, 1000);
