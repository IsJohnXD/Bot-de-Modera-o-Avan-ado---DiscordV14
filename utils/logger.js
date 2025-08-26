const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');
const db = require('./database.js');

class Logger {
    static async logAction(interaction, action, target, reason, extraData = {}) {
        const settings = db.getSettings();
        const logData = {
            action: action,
            target: {
                id: target.id || target,
                name: target.username || target.name || 'Desconhecido'
            },
            staff: {
                id: interaction.user.id,
                name: interaction.user.username
            },
            reason: reason,
            guild: {
                id: interaction.guild.id,
                name: interaction.guild.name
            },
            channel: {
                id: interaction.channel.id,
                name: interaction.channel.name
            },
            ...extraData
        };

        db.addLog(action.toLowerCase(), logData);

        await this.sendLogToChannel(interaction, action, logData, settings);
    }

    static async sendLogToChannel(interaction, action, logData, settings) {
        const embed = this.createLogEmbed(action, logData);
        
        let channelId = null;
        
        switch (action) {
            case 'ban':
                channelId = settings.channels.logs.bans_public;
                break;
            case 'kick':
            case 'warn':
            case 'mute':
            case 'unmute':
            case 'unban':
            case 'lock':
            case 'unlock':
            case 'castigo':
                channelId = settings.channels.logs.general;
                break;
        }

        if (channelId) {
            try {
                const channel = await interaction.guild.channels.fetch(channelId);
                await channel.send({ embeds: [embed] });
            } catch (error) {
                console.error(`Erro ao enviar log para canal ${channelId}:`, error);
            }
        }
    }

    static createLogEmbed(action, logData) {
        const actionConfig = {
            kick: { emoji: '👢', color: 0xFFA500, title: 'Usuário Expulso' },
            ban: { emoji: '🔨', color: 0xFF0000, title: 'Usuário Banido' },
            warn: { emoji: '⚠️', color: 0xFFA500, title: 'Usuário Advertido' },
            mute: { emoji: '🔇', color: 0xFFA500, title: 'Usuário Silenciado' },
            unmute: { emoji: '🔊', color: 0x00FF00, title: 'Usuário Desmutado' },
            unban: { emoji: '🔓', color: 0x00FF00, title: 'Usuário Desbanido' },
            lock: { emoji: '🔒', color: 0xFFA500, title: 'Canal Trancado' },
            unlock: { emoji: '🔓', color: 0x00FF00, title: 'Canal Destrancado' },
            castigo: { emoji: '⏰', color: 0xFFA500, title: 'Usuário Castigado' }
        };

        const actionData = actionConfig[action] || { emoji: '📝', color: 0x0099FF, title: 'Ação Executada' };

        const embed = new EmbedBuilder()
            .setTitle(`${actionData.emoji} ${actionData.title}`)
            .setColor(actionData.color)
            .setDescription(`**${logData.target.name}** (${logData.target.id})`)
            .addFields(
                { name: 'Staff', value: `${logData.staff.name} (${logData.staff.id})`, inline: true },
                { name: 'Canal', value: `${logData.channel.name}`, inline: true },
                { name: 'Motivo', value: logData.reason || 'Nenhum motivo especificado', inline: false }
            )
            .setTimestamp()
            .setFooter({ text: 'By IsJohn' });

        if (logData.duration) {
            embed.addFields({ name: 'Duração', value: logData.duration, inline: true });
        }

        return embed;
    }

    static async logEmergencyMode(interaction) {
        const settings = db.getSettings();
        const logData = {
            action: 'emergency_mode',
            staff: {
                id: interaction.user.id,
                name: interaction.user.username
            },
            guild: {
                id: interaction.guild.id,
                name: interaction.guild.name
            },
            timestamp: Date.now()
        };

        db.addLog('emergency', logData);

        const embed = new EmbedBuilder()
            .setTitle('🚨 Modo de Emergência Ativado')
            .setColor(config.colors.error)
            .setDescription('Medidas de segurança foram aplicadas no servidor')
            .addFields(
                { name: 'Staff', value: `${logData.staff.name} (${logData.staff.id})`, inline: true },
                { name: 'Servidor', value: logData.guild.name, inline: true }
            )
            .setTimestamp()
            .setFooter({ text: 'By IsJohn' });

        const channelId = settings.channels.logs.general;
        if (channelId) {
            try {
                const channel = await interaction.guild.channels.fetch(channelId);
                await channel.send({ embeds: [embed] });
            } catch (error) {
                console.error(`Erro ao enviar log de emergência:`, error);
            }
        }
    }
}

module.exports = Logger;
