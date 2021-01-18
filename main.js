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
        searchEmbed.setDescription = "Searching";
        msg.channel.send(searchEmbed);


        ytDlSearch(query).then((result) => { 
            if (result == null) {
                console.log(`No Result for ${query}`);
            } else { 
                searchEmbed
                    .setAuthor = result[0].author.name
                    .setDescription = result[0].description
                    .setThumbnail = result[0].thumbnails[0].url;
                // msg.edit(searchEmbed); I need to change this.
                
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
    .setFooter('This Bot was created by AdrianH#5605');



client.login(token);


