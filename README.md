# hypixel-fragbot
Simple FragBot Library for Hypixel SkyBlock.<br><br>
Put any suggestions in the `Issues` tab!


# Requirements
- node.js
- npm
- second minecraft account (can be alt)
<br>

# Important
- Your bot account should either not have dungeons unlocked or be in Limbo (AFK for long enough).
- In the config.json file, you can set the username to whatever you like. This value is only used for sending webhook notifications and logging purposes.

# Installation
To install the necessary modules for the fragbot, you need to run the `install.bat` file. This will initiate the installation process using `npm`, and you should wait until it finishes installing all the modules.

# Configuration
To set up the fragbot, you need to open the config.json file and update the email and password. If you haven't moved your account to Microsoft, change "auth": "microsoft" to "auth":"mojang".

For the webhook field, put the link to your Discord webhook where you want the notifications to go. If you don't want to receive notifications via webhook, set webhook to null, without the quotation marks.

After you've made these changes, your config.json file should look something like this.

NOTE: As of version 1.1, `blacklisted` field was changed into `whitelist` and so changed its behavior. If it's empty (like in the example), the `whitelist is turned off`. If it has 1 or more items (example: `"whitelist": ["player1","player2"]`) it will be on.
```json
{
    "username": "FragBot",
    "email": "example@gmail.com",
    "password": "P4$$w0rd",
    "auth": "microsoft",
    "webhook": "https://discord.com/api/webhooks/XXXXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "whitelist": []
}
```

# Running
Now that everything is set up, run the bot using start.bat file<br>
If for whatever reason the start file doesn't work for you, start the bot by running index.js<br>

# Examples
## Simplest way to implement the FragBot
##### (As of version 1.1, will work if account was migrated to `microsoft`)
config.json:
```json
{"email": "example@mail.com","password": "exampleP4SSword"}
```
node.js:
```js
new (require("./fragbot"))(require("./config.json"));
```
## Custom Messages
```js
const FragBot = require("./fragbot");
const config = require("./config.json");

let bot = new FragBot(config);
bot.setMessage("join", "Successfully connected to the server as %s")
bot.setMessage("end", "%s was kicked from the server")
/*
First argument can be:
- join, when fragbot joins the server
- end, when fragbot gets kicked
- invite, when fragbot gets invited to the party
- joined, when fragbot joins the party
- disband, when fragbot disbands the party (user didn't join the dungeons)
- dungeons, when user joins the dungeons
- disbanded, when user disbands the party
- limbo, when fragbot gets sent to the limbo
*/
```
## Event Listeners
```js
const FragBot = require("./fragbot");
const config = require("./config.json");

let bot = new FragBot(config);

bot.once("join",()=>{
    // FragBot joined the server
})

bot.once("end",()=>{
    // FragBot got kicked
})

bot.once("limbo",()=>{
    // FragBot was sent to the limbo
})

bot.on("queued",(username,position)=>{
    // username partied the fragbot
})

bot.on("dungeons",(username)=>{
    // username joined the dungeons
})

bot.on("disbanded",(username)=>{
    // username disbanded the party
    // to add him to the blacklist do
    // bot.config.blacklisted.push(username);
})
```
## Custom Logger
```js
const FragBot = require("./fragbot");
const config = require("./config.json");
let logs = [];
let bot = new FragBot(config);

function log(message)
{
    logs.push(message)
    console.log("["+new Date().toLocaleTimeString()+"] "+message)
}

bot.log = log
```
## Discord.js v12 bot
```js
const Discord = require('discord.js');
const client = new Discord.Client();
const FragBot = require("./fragbot");
const config = require("./config.json");
let fb = null;
client.on('message', msg => {
  if (msg.content === '.start') {
    if(fb != null) return;
    fb = new FragBot();
    msg.channel.send("FragBot has been started")
    fb.once("join",()=>{msg.channel.send(fb.username+" connected to hypixel")})
    fb.once("end",()=>{msg.channel.send(fb.username+" was kicked from hypixel");fb = null;})
    fb.once("limbo",()=>{msg.channel.send(fb.username+" was sent to limbo")});
    // cba to continue but you get the point
  }
});

client.login('token')
```
# Modules used
```
minecraft-protocol
node-fetch@2.6.5
```
## The fragbot was created for educational purposes. I do not take responsibility if for whatever reason your account got banned (which shouldn't happen, after the bot gets sent to limbo, it's safe)

### Credits to ChatGPT for helping me enhance README.md
