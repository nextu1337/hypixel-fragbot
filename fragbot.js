const mc = require('minecraft-protocol');
const fetch = require('node-fetch')
const EventEmitter = require('events');
const removeRankPrefix = username=>username.replace(/^\[.*\] /, "");
const partyInviteGetUsername = msg=>removeRankPrefix(msg.split("\n")[1].split(" has invited you to join their party!")[0]) || false;
function messageJoin(message)
{
    let toreturn = message?.text;
    if(!message?.extra>0) return toreturn;
    for(let i in message?.extra)
        toreturn += message?.extra[i]?.text;
    return toreturn;
}

function sendToWebhook(webhook,message)
{
    if(!webhook) return false;
    fetch(webhook,{method: 'post',headers: {'Content-Type': 'application/json',},body:JSON.stringify({content:message})});
}

function log(...args)
{
    let wh = args.shift();
    
    // I should probably put something here
    console.log(args.join("\n"));
    sendToWebhook(wh,args.join("\n"))
}

class FragBot extends EventEmitter  {
    constructor(config)
    {
       super();
       this.username = config.username;
       this.wh = config.webhook;
       this.log = message => log(this.wh,message);
       this.config = config;
       this.queue = [];
       this.current = null;

        this.client = mc.createClient({host: "mc.hypixel.net",version:"1.18.2",port: 25565,username: config.email,password: config.password,auth: config.auth});
        this.client.on("connect",()=>{
            this.emit("connect");
            this.log(this.#tm(this.messages.join))
        })
        this.client.on("end",()=>{
            this.emit("end");
            this.log(this.#tm(this.messages.end));
        })
        this.client.on("chat",(packet)=>{
            this.emit("chat",packet);
            this.#chatHandler(packet);
        })
        this.client.on("packet",this.emit)
        this.messages = {
            "join": "Successfully connected to the server as %s",
            "end": "%s was kicked from the server",
            "invite": "%i invited %s to the party. His position in queue is %p",
            "joined": "%s joined %i's party",
            "disband": "%i didn't join the dungeons in time. L",
            "dungeons": "%i joined the dungeons. Leaving the party...",
            "disbanded": "%i disbanded the party.",
            "limbo": "%s got sent to the Limbo. It's fully safe now"
        }

    }

    #tm = message => message.replace(/%s/gm,this.username).replace(/%p/,this.queue.length)

    #joinNextParty() {
        this.current = null
        this.queue.shift();
        if (this.queue.length == 0) return;
        setTimeout(() => {
            this.client.write('chat', {message: "/p accept " + this.queue[0]});
            this.current = this.queue[0];
            this.log(this.#tm(this.messages.joined).replace(/%i/gm,this.queue[0]));
        }, 500);
        setTimeout(()=>{
            if (this.current != this.queue?.[0]) return;
            this.log(this.#tm(this.messages.disband).replace(/%i/gm,this.queue[0]));
            this.client.write('chat', {message: "/p leave"});
            return this.#joinNextParty();
        }, 7500);
        
    }

    #chatHandler(packet)
    {
        let msg = messageJoin(JSON.parse(packet.message))
        if(msg=="You are AFK. Move around to return from AFK.")
        {
            this.emit("limbo");
            this.log(this.#tm(this.messages["limbo"]));
        }
            
        if(msg.includes(" has invited you to join their party!"))
        {
            let username = partyInviteGetUsername(msg);
            if(this.config.blacklisted.includes(username)) return;
            if(username.includes(" ")) return;
            if(this.queue.includes(username)) return; // Theoretically shouldn't happen
            this.queue.push(username);
            this.emit("queued",username,this.queue.length)
            this.log(this.#tm(this.messages.invite).replace(/%i/gm,username))
            if (this.queue.length != 1) return; // Stop if queue isn't empty, after this line bot joins the party
            this.client.write('chat', {message: "/p accept " + username});
            this.log(this.#tm(this.messages.joined).replace(/%i/gm,username));
            setTimeout(() => {
                if (this.current != username) return;
                this.log(this.#tm(this.messages.disband).replace(/%i/gm,this.queue[0]));
                this.client.write('chat',{message: "/p leave"})
                return this.#joinNextParty();
            }, 7500);
            this.current = this.queue[0];
        }
        
        if (msg.includes((this.current || "-") + " entered The ")) { // Will change this.current to - if it's null to avoid errors, "- entered The " should not be true
            this.log(this.#tm(this.messages.dungeons).replace(/%i/gm,this.current));
            this.client.write('chat', {message: "/p leave"});
            this.emit("dungeons",this.current);
            return this.#joinNextParty();
        }

        if (msg.includes("The party was disbanded because all invites expired and the party was empty") || msg.includes((this.current || "-") + " has disbanded the party!")) {
            this.emit("disbanded",this.queue[0]);
            this.log(this.#tm(this.messages.disbanded).replace(/%i/gm,this.queue[0]));
            return this.#joinNextParty();
        }

        if(msg.startsWith("The party invite from"))
        {
            let username = removeRankPrefix(msg.split("invite from ")[1].split(" has expired")[0])
            let index = this.queue.indexOf(username);
            return index>-1?this.queue.splice(index,1):false;
        }

    }

    setMessage(event,message)
    {
        if(!(event in this.messages)) return false;
        this.messages[event] = message;
        return true;
    }
}

module.exports = FragBot;
