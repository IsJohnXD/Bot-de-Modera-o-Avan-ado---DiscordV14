const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');
const db = require('../utils/database.js');

module.exports = {
    name: 'staffperm',
    async execute(interaction) {
        if (interaction.user.id !== config.ownerId) {
            return await interaction.reply({ content: 'Apenas o owner pode usar este comando.', flags: 64 });
        }

        const user = interaction.options.getUser('usuario');
        const member = await interaction.guild.members.fetch(user.id);
        const perms = db.getPerms();
        
        if (!perms[user.id]) {
            perms[user.id] = {
                kick: false,
                ban: false,
                unban: false,
                warn: false,
                mute: false,
                unmute: false,
                lock: false,
                unlock: false,
                castigo: false
            };
            db.setPerms(perms);
        }

        const embed = new EmbedBuilder()
            .setTitle(`Permissões de ${user.username}`)
            .setThumbnail(user.displayAvatarURL())
            .setColor(config.colors.primary)
            .setDescription('Clique nos botões para alternar permissões')
            .addFields(
                { name: 'Kick', value: perms[user.id].kick ? '🟢' : '🔴', inline: true },
                { name: 'Ban', value: perms[user.id].ban ? '🟢' : '🔴', inline: true },
                { name: 'Unban', value: perms[user.id].unban ? '🟢' : '🔴', inline: true },
                { name: 'Warn', value: perms[user.id].warn ? '🟢' : '🔴', inline: true },
                { name: 'Mute', value: perms[user.id].mute ? '🟢' : '🔴', inline: true },
                { name: 'Unmute', value: perms[user.id].unmute ? '🟢' : '🔴', inline: true },
                { name: 'Lock', value: perms[user.id].lock ? '🟢' : '🔴', inline: true },
                { name: 'Unlock', value: perms[user.id].unlock ? '🟢' : '🔴', inline: true },
                { name: 'Castigo', value: perms[user.id].castigo ? '🟢' : '🔴', inline: true }
            )
            .setFooter({ text: 'By IsJohn' });

        const buttons = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`perm_kick_${user.id}`)
                    .setLabel('Kick')
                    .setStyle(perms[user.id].kick ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`perm_ban_${user.id}`)
                    .setLabel('Ban')
                    .setStyle(perms[user.id].ban ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`perm_unban_${user.id}`)
                    .setLabel('Unban')
                    .setStyle(perms[user.id].unban ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`perm_warn_${user.id}`)
                    .setLabel('Warn')
                    .setStyle(perms[user.id].warn ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`perm_mute_${user.id}`)
                    .setLabel('Mute')
                    .setStyle(perms[user.id].mute ? ButtonStyle.Success : ButtonStyle.Danger)
            );

        const buttons2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(`perm_unmute_${user.id}`)
                    .setLabel('Unmute')
                    .setStyle(perms[user.id].unmute ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`perm_lock_${user.id}`)
                    .setLabel('Lock')
                    .setStyle(perms[user.id].lock ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`perm_unlock_${user.id}`)
                    .setLabel('Unlock')
                    .setStyle(perms[user.id].unlock ? ButtonStyle.Success : ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId(`perm_castigo_${user.id}`)
                    .setLabel('Castigo')
                    .setStyle(perms[user.id].castigo ? ButtonStyle.Success : ButtonStyle.Danger)
            );

        await interaction.reply({ embeds: [embed], components: [buttons, buttons2] });
    }
};
