/* jshint esversion: 8 */

const Discord = require("discord.js");
const {prefix, token} = require("./config.json");
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
        ytDlSearch(query).then((result) => { 
            if (result == null) {
                console.log(`No Result for ${query}`);
            } else { msg.channel.send(result);
            
            }        
        });
    }

});


const ytDlSearch = async (query) => {
    let x = await ytsr(`"Hybrid Calisthenics" ${query}`).then((result) => {
        let results = [];
        console.log(result);
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
    .setTitle("Search Results")
    .setFooter('Created by AdrianH#5605');



client.login(token);


