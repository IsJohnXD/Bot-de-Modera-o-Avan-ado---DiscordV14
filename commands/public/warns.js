const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warns')
        .setDescription('Mostra warns de um usuário')
        .addUserOption(option =>
            option.setName('usuario')
                .setDescription('Usuário para verificar warns')
                .setRequired(true)),
    
    async execute(interaction) {
        const warnsEvent = interaction.client.events.get('warns');
        if (warnsEvent) {
            await warnsEvent.execute(interaction);
        }
    }
};
