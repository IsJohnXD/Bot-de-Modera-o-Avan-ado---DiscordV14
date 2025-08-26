const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');
const db = require('../utils/database.js');

module.exports = {
    name: 'automod',
    async execute(interaction) {
        const settings = db.getSettings();
        const automod = settings.automod;

        const embed = new EmbedBuilder()
            .setTitle('Configuração de AutoModeração')
            .setColor(config.colors.primary)
            .setDescription('Configure as opções de automoderação')
            .addFields(
                { name: 'Anti-Spam', value: automod.antispam.enabled ? '🟢 Ativado' : '🔴 Desativado', inline: true },
                { name: 'Anti-Raid', value: automod.antiraid.enabled ? '🟢 Ativado' : '🔴 Desativado', inline: true },
                { name: 'Auto-Kick', value: automod.autokick.enabled ? '🟢 Ativado' : '🔴 Desativado', inline: true },
                { name: 'Auto-Ban', value: automod.autoban.enabled ? '🟢 Ativado' : '🔴 Desativado', inline: true }
            )
            .setFooter({ text: 'By IsJohn' });

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('automod_antispam')
                    .setLabel('Anti-Spam')
                    .setStyle(automod.antispam.enabled ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('automod_antiraid')
                    .setLabel('Anti-Raid')
                    .setStyle(automod.antiraid.enabled ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('automod_autokick')
                    .setLabel('Auto-Kick')
                    .setStyle(automod.autokick.enabled ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('automod_autoban')
                    .setLabel('Auto-Ban')
                    .setStyle(automod.autoban.enabled ? ButtonStyle.Success : ButtonStyle.Danger)
            );

        const backButton = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('automod_back')
                    .setLabel('◀ Voltar')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({ embeds: [embed], components: [buttons, backButton] });
    }
};
