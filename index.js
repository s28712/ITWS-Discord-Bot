// Load environment variables from .env file
const dotenv = require("dotenv")
dotenv.config()

// Import Discord Node Module
const Discord = require("discord.js");

/** The prefix that commands use. */
const commandPrefix = ".";

// Define Roles with id's
/** Role names matched to role IDs */
const roles = {
    Class21: "735896289711095938",
    Class22: "735896105660842055",
    Class23: "735896180084572210",
    Class24: "735896243393265754",
    Intro: "749708912021733396"
}

/** List of role names */
const roleListMessage = '**Roles**\n' + Object.keys(roles).join("\n")

/** Message to send for the help command */
const helpMessage = [
    '**List of commands:**',
    '-----------------',
    `\`${commandPrefix}help\` - bring up this prompt`,
    `\`${commandPrefix}role roleName\` - add yourself to a role (use \`${commandPrefix}role list\` to recive a direct message with a list of all of the roles`
].join("\n")

/** Bot object */
const bot = new Discord.Client();

bot.once("ready", () => {
    console.log(`Bot is ready with command prefix ${commandPrefix}`);
});

bot.on("message", (message) => {
    // Ignore non-commands
    if (!message.content.startsWith(commandPrefix)) return;

    // Divide input into parts
    // Command will be the first part and args will be the arguments
    // e.g. "!role ITWS" -> command="!role", args=["ITWS"]
    let [command, ...args] = message.content.split(" ");

    // Remove command prefix
    command = command.replace(commandPrefix, "");

    // Help command
    if (command === "help") {
        message.channel.send(helpMessage);
    }

    // Role command
    else if (command === "role") {
        const desiredRoleName = args[0]

        if (desiredRoleName == "list") {
            // List all roles
            message.member.send(roleListMessage);
        } else if (desiredRoleName in roles) {
            // User chose a valid role
            message.member.roles.add(roles[desiredRoleName])
        } else {
            // User chose an invalid role
            message.channel.send("That's not a valid role!");
        }
    }

    // Add command
    else if (command == "add") {
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
