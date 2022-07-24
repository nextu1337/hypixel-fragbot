const mc = require('minecraft-protocol');
const config = require("./config.json")
const HyLib = require('./library');
var a = "------------------------------------------------";
var hylib = new HyLib(config.webhook);
var client = mc.createClient({
    host: "mc.hypixel.net",
    port: 25565,
    username: config.email,
    password: config.password,
    auth: config.auth
});

let queue = [];
let currentParty = null;

function joinNextParty() {
    currentParty = null;
    queue.shift();
    if (queue.length == 0) return;
    setTimeout(() => {
        client.write('chat', {message: "/p accept " + queue[0]});
        hylib.log(a,"joined "+ queue[0] + "'s party",a);
    }, 500);
    setTimeout(function() {
        if (currentParty != queue[0]) return;
        hylib.log(a,username + " didn't join dungeons in time",a);
        client.write('chat', {message: "/p leave"});
        return joinNextParty();
    }, 7500);
}

client.on('chat', function(packet) {
    let msg = hylib.messageJoin(JSON.parse(packet.message));
    if (msg.includes("has invited you to join their party!")) {
        let username = hylib.partyInviteGetUsername(msg);
        if (queue.includes(username)) return hylib.log(a,username + " tried to queue twice",a);
        queue.push(username);
        hylib.log(a,username + " queued, position in queue: " + queue.length,a);
        if (queue.length != 1) return;
        client.write('chat', {
            message: "/p accept " + username
        });
        setTimeout(function() {
            if (currentParty != username) return;
            hylib.log(a,username + " didn't join the dungeons in time",a);
            client.write('chat', {
                message: "/p leave"
            });
            return joinNextParty();
        }, 7500);
        return currentParty = username;
    }
    if (msg.includes((currentParty || "-") + " entered The ")) {
        hylib.log(a,currentParty + " joined the dungeons",a);
        client.write('chat', {message: "/p leave"});
        return joinNextParty();
    }
    if (msg.includes("The party was disbanded because all invites expired and the party was empty") || msg.includes((currentParty || "-") + " has disbanded the party!")) {
        hylib.log(a,currentParty + " disbanded the party (why?)",a);
        return joinNextParty();
    }

});