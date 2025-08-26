const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');
const db = require('../utils/database.js');

module.exports = {
    name: 'panelstaff',
    async execute(interaction) {
        const perms = db.getPerms();
        const userPerms = perms[interaction.user.id] || {};
        
        const availableActions = [];
        if (userPerms.kick) availableActions.push('Kick');
        if (userPerms.ban) availableActions.push('Ban');
        if (userPerms.unban) availableActions.push('Unban');
        if (userPerms.warn) availableActions.push('Warn');
        if (userPerms.mute) availableActions.push('Mute');
        if (userPerms.unmute) availableActions.push('Unmute');
        if (userPerms.lock) availableActions.push('Lock');
        if (userPerms.unlock) availableActions.push('Unlock');
        if (userPerms.castigo) availableActions.push('Castigo');

        const embed = new EmbedBuilder()
            .setTitle('Painel de Staff')
            .setColor(config.colors.primary)
            .setDescription('Selecione uma ação disponível')
            .addFields(
                { name: 'Ações Disponíveis', value: availableActions.length > 0 ? availableActions.join(', ') : 'Nenhuma permissão', inline: false }
            )
            .setFooter({ text: 'By IsJohn' });

        if (availableActions.length === 0) {
            const noPermsEmbed = new EmbedBuilder()
                .setTitle('❌ Sem Permissões')
                .setColor(config.colors.error)
                .setDescription('Você não possui nenhuma permissão de staff configurada.')
                .addFields(
                    { name: 'Como obter permissões', value: 'Peça ao owner para configurar suas permissões usando `/staffperm`', inline: false }
                )
                .setFooter({ text: 'By IsJohn' });

            return await interaction.reply({ embeds: [noPermsEmbed], flags: 64 });
        }

        const buttons = [];
        
        if (userPerms.kick) {
            buttons.push(
                new ButtonBuilder()
                    .setCustomId('action_kick')
                    .setLabel('Kick')
                    .setStyle(ButtonStyle.Primary)
            );
        }
        
        if (userPerms.ban) {
            buttons.push(
                new ButtonBuilder()
                    .setCustomId('action_ban')
                    .setLabel('Ban')
                    .setStyle(ButtonStyle.Danger)
            );
        }
        
        if (userPerms.unban) {
            buttons.push(
                new ButtonBuilder()
                    .setCustomId('action_unban')
                    .setLabel('Unban')
                    .setStyle(ButtonStyle.Secondary)
            );
        }
        
        if (userPerms.warn) {
            buttons.push(
                new ButtonBuilder()
                    .setCustomId('action_warn')
                    .setLabel('Warn')
                    .setStyle(ButtonStyle.Secondary)
            );
        }
        
        if (userPerms.mute) {
            buttons.push(
                new ButtonBuilder()
                    .setCustomId('action_mute')
                    .setLabel('Mute')
                    .setStyle(ButtonStyle.Secondary)
            );
        }
        
        if (userPerms.unmute) {
            buttons.push(
                new ButtonBuilder()
                    .setCustomId('action_unmute')
                    .setLabel('Unmute')
                    .setStyle(ButtonStyle.Success)
            );
        }
        
        if (userPerms.lock) {
            buttons.push(
                new ButtonBuilder()
                    .setCustomId('action_lock')
                    .setLabel('Lock')
                    .setStyle(ButtonStyle.Danger)
            );
        }
        
        if (userPerms.unlock) {
            buttons.push(
                new ButtonBuilder()
                    .setCustomId('action_unlock')
                    .setLabel('Unlock')
                    .setStyle(ButtonStyle.Success)
            );
        }
        
        if (userPerms.castigo) {
            buttons.push(
                new ButtonBuilder()
                    .setCustomId('action_castigo')
                    .setLabel('Castigo')
                    .setStyle(ButtonStyle.Secondary)
            );
        }

        const components = [];
        
        if (buttons.length > 0) {
            for (let i = 0; i < buttons.length; i += 5) {
                const rowButtons = buttons.slice(i, i + 5);
                const actionRow = new ActionRowBuilder().addComponents(rowButtons);
                components.push(actionRow);
            }
        }
        
        if (interaction.user.id === config.ownerId) {
            const settings = db.getSettings();
            const emergencyMode = settings.emergencyMode || false;
            
            const emergencyRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId('emergency_activate')
                    .setLabel(emergencyMode ? '🟢 Emergency Mode (Ativo)' : '🚨 Emergency Mode')
                    .setStyle(emergencyMode ? ButtonStyle.Success : ButtonStyle.Danger)
            );
            components.push(emergencyRow);
        }

        await interaction.reply({ embeds: [embed], components: components });
    }
};
