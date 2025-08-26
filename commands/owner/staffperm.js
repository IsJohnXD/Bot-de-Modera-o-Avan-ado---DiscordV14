const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('staffperm')
        .setDescription('Gerencia permissões de staff')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário para gerenciar permissões')
                .setRequired(true))
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    
    async execute(interaction) {
        const staffpermEvent = interaction.client.events.get('staffperm');
        if (staffpermEvent) {
            await staffpermEvent.execute(interaction);
        }
    }
};
