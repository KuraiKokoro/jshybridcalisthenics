/* jshint esversion: 8 */

require('dotenv').config();
token = process.env.token;
prefix = process.env.prefix;



const Discord = require("discord.js");
const {Menu} = require('discord.js-menu');


const ytsr = require('ytsr');


const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (msg) => {
    if (!msg.content.startsWith(prefix) || msg.author.bot ) return;

    const args = msg.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if ( command === "ping" ) {
        msg.channel.send("Pong...");
    }

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
                    .setFooter('This Bot was created by AdrianH#5605');
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
                        footer: { text: "Bot Created by AdrianH#5665" },
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
  }, 1000);
