const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');
const db = require('../utils/database.js');
const Logger = require('../utils/logger.js');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;
        if (!message.guild) return;

        const settings = db.getSettings();
        
        if (settings.automod.antispam.enabled) {
            await handleAntiSpam(message, settings);
        }
        
        if (settings.automod.antiraid.enabled) {
            await handleAntiRaid(message, settings);
        }
    }
};

const userMessageCounts = new Map();
const userWarnCounts = new Map();

async function handleAntiSpam(message, settings) {
    const userId = message.author.id;
    const now = Date.now();
    const timeWindow = 10000;
    
    if (!userMessageCounts.has(userId)) {
        userMessageCounts.set(userId, []);
    }
    
    const userMessages = userMessageCounts.get(userId);
    userMessages.push(now);
    
    const recentMessages = userMessages.filter(time => now - time < timeWindow);
    userMessageCounts.set(userId, recentMessages);
    
    if (recentMessages.length > 5) {
        const warns = userWarnCounts.get(userId) || 0;
        userWarnCounts.set(userId, warns + 1);
        
        try {
            await message.member.timeout(300000, 'Anti-Spam: Muitas mensagens em pouco tempo');
            
            const embed = new EmbedBuilder()
                .setTitle('🔇 Usuário Silenciado (Anti-Spam)')
                .setColor(config.colors.warning)
                .setDescription(`**${message.author.username}** foi silenciado por spam.`)
                .addFields(
                    { name: 'Motivo', value: 'Anti-Spam: Muitas mensagens em pouco tempo', inline: true },
                    { name: 'Duração', value: '5 minutos', inline: true }
                )
                .setFooter({ text: 'By IsJohn' });
            
            await message.channel.send({ embeds: [embed] });
            await Logger.logAction({ user: message.author, guild: message.guild, channel: message.channel }, 'mute', message.author, 'Anti-Spam: Muitas mensagens em pouco tempo', { duration: '5 minutos' });
            
            if (warns + 1 >= 3 && settings.automod.autokick.enabled) {
                await message.member.kick('Auto-Kick: Muitos avisos de spam');
                await message.channel.send(`**${message.author.username}** foi expulso automaticamente por muitos avisos de spam.`);
                await Logger.logAction({ user: message.author, guild: message.guild, channel: message.channel }, 'kick', message.author, 'Auto-Kick: Muitos avisos de spam');
            }
            
            if (warns + 1 >= 5 && settings.automod.autoban.enabled) {
                await message.member.ban({ reason: 'Auto-Ban: Muitos avisos de spam' });
                await message.channel.send(`**${message.author.username}** foi banido automaticamente por muitos avisos de spam.`);
                await Logger.logAction({ user: message.author, guild: message.guild, channel: message.channel }, 'ban', message.author, 'Auto-Ban: Muitos avisos de spam');
            }
        } catch (error) {
            console.error('Erro no anti-spam:', error);
        }
    }
}

async function handleAntiRaid(message, settings) {
    const guild = message.guild;
    const now = Date.now();
    const timeWindow = 5000;
    
    const recentJoins = guild.members.cache.filter(member => 
        now - member.joinedTimestamp < timeWindow
    );
    
    if (recentJoins.size > 10) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('🚨 Possível Raid Detectado')
                .setColor(config.colors.error)
                .setDescription(`Detectado possível raid! ${recentJoins.size} usuários entraram nos últimos 5 segundos.`)
                .setFooter({ text: 'By IsJohn' });
            
            await message.channel.send({ embeds: [embed] });
            
            for (const [, member] of recentJoins) {
                try {
                    await member.kick('Anti-Raid: Muitos usuários entrando simultaneamente');
                } catch (error) {
                    console.error(`Erro ao expulsar ${member.user.username}:`, error);
                }
            }
            
            await Logger.logAction({ user: message.author, guild: message.guild, channel: message.channel }, 'kick', { id: 'raid', username: 'Raid Prevention' }, 'Anti-Raid: Muitos usuários entrando simultaneamente');
        } catch (error) {
            console.error('Erro no anti-raid:', error);
        }
    }
}
