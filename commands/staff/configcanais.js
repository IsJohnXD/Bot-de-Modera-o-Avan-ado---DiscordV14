const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('configcanais')
        .setDescription('Configura canais de logs')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const configcanaisEvent = interaction.client.events.get('configcanais');
        if (configcanaisEvent) {
            await configcanaisEvent.execute(interaction);
        }
    }
};
