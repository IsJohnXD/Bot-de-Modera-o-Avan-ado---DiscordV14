const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');
const db = require('../utils/database.js');

module.exports = {
    name: 'bans',
    async execute(interaction) {
        const staff = interaction.options.getUser('staff');
        const bans = db.getBans();
        
        let banCount = 0;
        let banList = [];
        
        if (staff) {
            Object.values(bans).forEach(ban => {
                if (ban.staffId === staff.id) {
                    banCount++;
                    banList.push(`**${ban.userName}** - ${ban.reason} (${new Date(ban.timestamp).toLocaleDateString()})`);
                }
            });
        } else {
            banCount = Object.keys(bans).length;
            banList = Object.values(bans).slice(0, 10).map(ban => 
                `**${ban.userName}** por **${ban.staffName}** - ${ban.reason} (${new Date(ban.timestamp).toLocaleDateString()})`
            );
        }

        const embed = new EmbedBuilder()
            .setTitle('Histórico de Bans')
            .setColor(config.colors.primary)
            .setDescription(staff ? `Bans aplicados por ${staff.username}` : 'Últimos bans aplicados')
            .addFields(
                { name: 'Total de Bans', value: banCount.toString(), inline: true }
            )
            .setFooter({ text: 'By IsJohn' });

        if (banList.length > 0) {
            embed.addFields({
                name: 'Bans Recentes',
                value: banList.join('\n'),
                inline: false
            });
        } else {
            embed.addFields({
                name: 'Bans',
                value: 'Nenhum ban encontrado',
                inline: false
            });
        }

        await interaction.reply({ embeds: [embed] });
    }
};
