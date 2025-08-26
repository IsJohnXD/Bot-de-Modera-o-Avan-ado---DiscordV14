const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');
const db = require('../utils/database.js');

module.exports = {
    name: 'configcanais',
    async execute(interaction) {
        const settings = db.getSettings();
        const channels = settings.channels.logs;

        const embed = new EmbedBuilder()
            .setTitle('Configuração de Canais')
            .setColor(config.colors.primary)
            .setDescription('Configure os canais de logs')
            .addFields(
                { name: 'Bans Públicos', value: channels.bans_public && channels.bans_public !== 'null' ? `<#${channels.bans_public}>` : 'Não configurado', inline: true },
                { name: 'Bans Privados', value: channels.bans_private && channels.bans_private !== 'null' ? `<#${channels.bans_private}>` : 'Não configurado', inline: true },
                { name: 'Warns', value: channels.warns && channels.warns !== 'null' ? `<#${channels.warns}>` : 'Não configurado', inline: true },
                { name: 'Geral', value: channels.general && channels.general !== 'null' ? `<#${channels.general}>` : 'Não configurado', inline: true }
            )
            .setFooter({ text: 'By IsJohn' });

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('configcanais_bans_public')
                    .setLabel('Bans Públicos')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('configcanais_bans_private')
                    .setLabel('Bans Privados')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('configcanais_warns')
                    .setLabel('Warns')
                    .setStyle(ButtonStyle.Primary),
                new ButtonBuilder()
                    .setCustomId('configcanais_general')
                    .setLabel('Geral')
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.reply({ embeds: [embed], components: [buttons] });
    }
};
