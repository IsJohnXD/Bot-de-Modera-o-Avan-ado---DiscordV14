const { Events } = require('discord.js');
const config = require('../config.json');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (interaction.isChatInputCommand()) {
            const command = interaction.client.commands.get(interaction.commandName);
            if (!command) return;

            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(`Erro ao executar comando ${interaction.commandName}:`, error);
                const errorMessage = 'Houve um erro ao executar este comando.';
                
                if (interaction.replied || interaction.deferred) {
                    await interaction.followUp({ content: errorMessage, flags: 64 });
                } else {
                    await interaction.reply({ content: errorMessage, flags: 64 });
                }
            }
        } else if (interaction.isButton()) {
            const buttonEvent = interaction.client.events.get('button');
            if (buttonEvent) {
                await buttonEvent.execute(interaction);
            }
        } else if (interaction.isModalSubmit()) {
            const modalEvent = interaction.client.events.get('modal');
            if (modalEvent) {
                await modalEvent.execute(interaction);
            }
        } else if (interaction.isStringSelectMenu()) {
            const buttonEvent = interaction.client.events.get('button');
            if (buttonEvent) {
                await buttonEvent.execute(interaction);
            }
        }
    }
};
