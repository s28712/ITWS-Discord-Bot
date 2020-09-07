// Load environment variables from .env file
const dotenv = require('dotenv')
dotenv.config()

// Import Discord Node Module
const Discord = require("discord.js");

// Define Roles with 'id's
const Roles = [
    { 'name': 'Class21', 'id': '735896289711095938' },
    { 'name': 'Class22', 'id': '735896105660842055' },
    { 'name': 'Class23', 'id': '735896180084572210' },
    { 'name': 'Class24', 'id': '735896243393265754' },
    { 'name': "Intro", 'id': '749708912021733396' }
];

// Generate role list
let roles_name_list = [];
for (let i = 0; i < Roles.length; i++) {
    roles_name_list.push(Roles[i]['name']);
}

// Bot object
const bot = new Discord.Client();

bot.on('message', (message) => {
    // Div'id'e input into parts
    const parts = message.content.split(' ');

    // Help command
    if (parts[0] === "!help") {
        message.channel.send("**List of commands:** \n----------------------------\n`!help` - bring up this prompt\n`!role` <role> - add yourself to a role (use `!role list` to recive a direct message with a list of all of the roles)")
    }

    // Role command
    else if (parts[0] === "!role") {
        switch (parts[1]) {
            case Roles[0]['name'].toString():
                message.member.roles.add(Roles[0]['id']);
                message.member.send("Successfully added " + Roles[0]["name"]);
                break;
            case Roles[1]['name'].toString():
                message.member.roles.add(Roles[1]['id']);
                message.member.send("Successfully added " + Roles[1]["name"]);
                break;
            case Roles[2]['name'].toString():
                message.member.roles.add(Roles[2]['id']);
                message.member.send("Successfully added " + Roles[2]["name"]);
                break;
            case Roles[3]['name'].toString():
                message.member.roles.add(Roles[3]['id']);
                message.member.send("Successfully added " + Roles[3]["name"]);
                break;
            case Roles[4]['name'].toString():
                message.member.roles.add(Roles[4]['id']);
                message.member.send("Successfully added " + Roles[4]["name"]);
                break;
            case "list":
                message.member.send(roles_name_list);
                break;
            default:
                message.channel.send("Invalid input");
                break;
        }
    }

    else if(parts[0] == "!add") {
        console.log("Here ------------");
        message.channel.overwritePermissions([
            {
                id: message.member.id,
                deny: ['VIEW_CHANNEL'],
            },
            {
                id: message.member.id,
                allow: ['VIEW_CHANNEL'],
            },
        ]);
    }
});

// Bot login using key
bot.login(process.env.DISCORD_BOT_TOKEN);
