const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('./config.json');

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});

process.on('uncaughtExceptionMonitor', (error, origin) => {
    console.error('Uncaught Exception Monitor:', error, 'origin:', origin);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent
    ]
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.events = new Collection();

const handlersDir = path.join(__dirname, 'handlers');
const handlers = fs.readdirSync(handlersDir).filter(file => file.endsWith('.js'));

for (const file of handlers) {
    const handler = require(path.join(handlersDir, file));
    handler(client);
}

const eventsDir = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsDir).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const event = require(path.join(eventsDir, file));
    client.events.set(event.name, event);
}

client.once('ready', () => {
    console.log(`Bot online como ${client.user.tag}`);
    client.user.setActivity(config.status.text, { type: config.status.type });
});

client.on('error', (error) => {
    console.error('Client error:', error);
});

client.on('warn', (warning) => {
    console.warn('Client warning:', warning);
});

client.login(config.token);
