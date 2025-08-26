const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('automod')
        .setDescription('Configura o sistema de automoderação')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    
    async execute(interaction) {
        const automodEvent = interaction.client.events.get('automod');
        if (automodEvent) {
            await automodEvent.execute(interaction);
        }
    }
};
