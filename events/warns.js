const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');
const db = require('../utils/database.js');

module.exports = {
    name: 'warns',
    async execute(interaction) {
        const user = interaction.options.getUser('usuario');
        const warns = db.getWarns();
        const userWarns = warns[user.id] || [];

        const embed = new EmbedBuilder()
            .setTitle(`Warns de ${user.username}`)
            .setThumbnail(user.displayAvatarURL())
            .setColor(config.colors.warning)
            .setDescription(`Total de warns: **${userWarns.length}**`)
            .setFooter({ text: 'By IsJohn' });

        if (userWarns.length > 0) {
            const warnList = userWarns.slice(0, 10).map((warn, index) => 
                `**${index + 1}.** ${warn.reason} - por **${warn.staffName}** (${new Date(warn.timestamp).toLocaleDateString()})`
            );
            
            embed.addFields({
                name: 'Warns Recentes',
                value: warnList.join('\n'),
                inline: false
            });
        } else {
            embed.addFields({
                name: 'Warns',
                value: 'Este usuário não possui warns',
                inline: false
            });
        }

        await interaction.reply({ embeds: [embed] });
    }
};
