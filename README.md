# hypixel-fragbot
Simple FragBot for Hypixel SkyBlock.<br><br>

# Requirements
- node.js
- npm
- second minecraft account (can be alt)
<br>

# Important
Your second minecraft account CAN'T have Dungeons unlocked (under Combat Level 5)<br>
Otherwise the account will get teleported to the dungeons and I have a feeling it may get banned. (minecraft-protocol simulates a minecraft client and doesn't simulate minecraft's gravity meaning the bot will probably be flying)<br>

# Installation
To install required modules for the fragbot run install.bat file and wait for npm to install everything
<br>

# Configuration
To configure the fragbot, simply open config.json and set email and password.<br>
If you still haven't migrated your account to Microsoft, make sure to change 
`"auth": "microsoft"` to `"auth":"mojang"`<br>
`webhook` field is where you wanna put your discord webhook link.<br>
If you don't want webhooks to be sent to your server, just set `webhook` to `null` without the quotation marks<br>
In the end your file shoud look something like this
```json
{
    "email": "example@gmail.com",
    "password": "P4$$w0rd",
    "auth": "microsoft",
    "webhook": "https://discord.com/api/webhooks/XXXXXXXXXXX/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
}
```

# Running
Now that everything is set up, run the bot using start.bat file<br>
If for whatever reason the start file doesn't work for you, start the bot by running fragbot.js<br>

# Kinda useless information
If you want to change messages sent to the webhook, open fragbot.js file with code editor and change messages inside hylib.log functions.<br>
HyLib is the name of the library as I had no idea what to name it and because the bot is all about hypixel skyblock I decided to name it HyLib<br>
<br>
Modules used in the making of this bot:
```
minecraft-protocol
node-fetch@2.6.5
```
## The fragbot was created for educational purposes. I do not take responsibility if for whatever reason your account got banned (which shouldn't happen, after the bot gets sent to Limbo it should stay there)
