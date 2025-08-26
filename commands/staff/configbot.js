const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('configbot')
        .setDescription('Configura o bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const configbotEvent = interaction.client.events.get('configbot');
        if (configbotEvent) {
            await configbotEvent.execute(interaction);
        }
    }
};
