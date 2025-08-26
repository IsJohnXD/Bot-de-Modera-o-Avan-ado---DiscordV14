const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder } = require('discord.js');
const config = require('../config.json');
const db = require('../utils/database.js');

module.exports = {
    name: 'configbot',
    async execute(interaction) {
        const settings = db.getSettings();
        const botSettings = settings.bot;

        const embed = new EmbedBuilder()
            .setTitle('Configuração do Bot')
            .setColor(config.colors.primary)
            .setDescription('Configure as opções do bot')
            .addFields(
                { name: 'Nome', value: botSettings.name || 'Não configurado', inline: true },
                { name: 'Avatar', value: botSettings.avatar ? 'Configurado' : 'Não configurado', inline: true },
                { name: 'Status', value: `${botSettings.status.text || 'Não configurado'} (${botSettings.status.type || 'WATCHING'})`, inline: true }
            )
            .setFooter({ text: 'By IsJohn' });

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('configbot_name')
                    .setLabel('Nome')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('configbot_avatar')
                    .setLabel('Avatar')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('configbot_status')
                    .setLabel('Status')
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.reply({ embeds: [embed], components: [buttons] });
    }
};
