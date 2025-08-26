const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('panelstaff')
        .setDescription('Abre o painel de staff')
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
    
    async execute(interaction) {
        const panelstaffEvent = interaction.client.events.get('panelstaff');
        if (panelstaffEvent) {
            await panelstaffEvent.execute(interaction);
        }
    }
};
