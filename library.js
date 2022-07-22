const fetch = require("node-fetch")

class HyLib {

    constructor(webhook)
    {
        this.webhook = webhook;
    }

    removeRankPrefix = (username)=>username.replace(/^\[.*\] /, "");
    partyInviteGetUsername = (msg)=>this.removeRankPrefix(msg.split("\n")[1].split(" has invited you to join their party!")[0]) || false;
    messageJoin(message)
    {
        let toreturn = message?.text;
        if(!message?.extra>0) return toreturn;
        for(let i in message?.extra)
            toreturn += message?.extra[i]?.text;
        return toreturn;
    }

    sendToWebhook(webhook,message)
    {
        if(!webhook) return false;
        fetch(webhook,{method: 'post',headers: {'Content-Type': 'application/json',},body:JSON.stringify({content:message})});
    }

    log(...args)
    {
        // I should probably put something here
        console.log(args.join("\n"));
        this.sendToWebhook(this.webhook,args.join("\n"))
    }
}
module.exports = HyLib;
