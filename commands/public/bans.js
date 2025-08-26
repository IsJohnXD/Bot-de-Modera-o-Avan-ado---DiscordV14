const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bans')
        .setDescription('Mostra histórico de bans')
        .addUserOption(option =>
            option.setName('staff')
                .setDescription('Staff para verificar bans')
                .setRequired(false)),
    
    async execute(interaction) {
        const bansEvent = interaction.client.events.get('bans');
        if (bansEvent) {
            await bansEvent.execute(interaction);
        }
    }
};
