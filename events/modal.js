const { EmbedBuilder } = require('discord.js');
const config = require('../config.json');
const db = require('../utils/database.js');
const Logger = require('../utils/logger.js');

module.exports = {
    name: 'modal',
    async execute(interaction) {
        const customId = interaction.customId;

        if (customId.startsWith('modal_kick')) {
            await handleKickModal(interaction);
        } else if (customId.startsWith('modal_ban')) {
            await handleBanModal(interaction);
        } else if (customId.startsWith('modal_warn')) {
            await handleWarnModal(interaction);
        } else if (customId.startsWith('modal_mute')) {
            await handleMuteModal(interaction);
        } else if (customId.startsWith('modal_unban')) {
            await handleUnbanModal(interaction);
        } else if (customId.startsWith('modal_unmute')) {
            await handleUnmuteModal(interaction);
        } else if (customId.startsWith('modal_lock')) {
            await handleLockModal(interaction);
        } else if (customId.startsWith('modal_unlock')) {
            await handleUnlockModal(interaction);
        } else if (customId.startsWith('modal_castigo')) {
            await handleCastigoModal(interaction);
        } else if (customId.startsWith('modal_configbot_')) {
            await handleConfigBotModal(interaction, customId);
        } else if (customId.startsWith('modal_configcanais_')) {
            await handleConfigCanaisModal(interaction, customId);
        } else if (customId === 'modal_configbot_status_text') {
            await handleConfigBotStatusTextModal(interaction);
        }
    }
};

async function handleKickModal(interaction) {
    try {
        if (!interaction.isModalSubmit()) {
            return;
        }

        const perms = db.getPerms();
        const userPerms = perms[interaction.user.id] || {};
        
        if (!userPerms.kick) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Sem Permissão')
                .setColor(config.colors.error)
                .setDescription('Você não tem permissão para expulsar usuários.')
                .setFooter({ text: 'By IsJohn' });
            
            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const userId = interaction.fields.getTextInputValue('user_id');
        const reason = interaction.fields.getTextInputValue('reason');

        if (!userId || !reason) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Dados Inválidos')
                .setColor(config.colors.error)
                .setDescription('Por favor, preencha todos os campos corretamente.')
                .setFooter({ text: 'By IsJohn' });

            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const member = await interaction.guild.members.fetch(userId);
        await member.kick(reason);

        const kicks = db.getKicks();
        kicks[userId] = {
            userId: userId,
            userName: member.user.username,
            staffId: interaction.user.id,
            staffName: interaction.user.username,
            reason: reason,
            timestamp: Date.now()
        };
        db.setKicks(kicks);

        const embed = new EmbedBuilder()
            .setTitle('✅ Usuário Expulso')
            .setColor(config.colors.success)
            .setDescription(`**${member.user.username}** foi expulso com sucesso.`)
            .addFields(
                { name: 'Motivo', value: reason, inline: true },
                { name: 'Staff', value: interaction.user.username, inline: true }
            )
            .setFooter({ text: 'By IsJohn' });

        await interaction.reply({ embeds: [embed] });
        
        try {
            await Logger.logAction(interaction, 'kick', member.user, reason);
        } catch (logError) {
            console.error('Erro ao enviar log:', logError);
        }
    } catch (error) {
        console.error('Erro no handleKickModal:', error);
        
        let errorMessage = 'Não foi possível expulsar o usuário.';
        if (error.code === 10062) {
            errorMessage = 'A interação expirou. Tente novamente.';
        } else if (error.code === 10013) {
            errorMessage = 'Usuário não encontrado ou ID inválido.';
        } else if (error.code === 50013) {
            errorMessage = 'Não tenho permissão para expulsar este usuário.';
        }

        const embed = new EmbedBuilder()
            .setTitle('❌ Erro ao Expulsar')
            .setColor(config.colors.error)
            .setDescription(errorMessage)
            .setFooter({ text: 'By IsJohn' });

        try {
            await interaction.reply({ embeds: [embed], flags: 64 });
        } catch (replyError) {
            console.error('Erro ao enviar resposta:', replyError);
        }
    }
}

async function handleBanModal(interaction) {
    try {
        if (!interaction.isModalSubmit()) {
            return;
        }

        const perms = db.getPerms();
        const userPerms = perms[interaction.user.id] || {};
        
        if (!userPerms.ban) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Sem Permissão')
                .setColor(config.colors.error)
                .setDescription('Você não tem permissão para banir usuários.')
                .setFooter({ text: 'By IsJohn' });
            
            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const userId = interaction.fields.getTextInputValue('user_id');
        const reason = interaction.fields.getTextInputValue('reason');

        if (!userId || !reason) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Dados Inválidos')
                .setColor(config.colors.error)
                .setDescription('Por favor, preencha todos os campos corretamente.')
                .setFooter({ text: 'By IsJohn' });

            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const member = await interaction.guild.members.fetch(userId);
        await member.ban({ reason: reason });

        const bans = db.getBans();
        bans[userId] = {
            userId: userId,
            userName: member.user.username,
            staffId: interaction.user.id,
            staffName: interaction.user.username,
            reason: reason,
            timestamp: Date.now()
        };
        db.setBans(bans);

        const embed = new EmbedBuilder()
            .setTitle('✅ Usuário Banido')
            .setColor(config.colors.success)
            .setDescription(`**${member.user.username}** foi banido com sucesso.`)
            .addFields(
                { name: 'Motivo', value: reason, inline: true },
                { name: 'Staff', value: interaction.user.username, inline: true }
            )
            .setFooter({ text: 'By IsJohn' });

        await interaction.reply({ embeds: [embed] });
        
        try {
            await Logger.logAction(interaction, 'ban', member.user, reason);
        } catch (logError) {
            console.error('Erro ao enviar log:', logError);
        }
    } catch (error) {
        console.error('Erro no handleBanModal:', error);
        
        let errorMessage = 'Não foi possível banir o usuário.';
        if (error.code === 10062) {
            errorMessage = 'A interação expirou. Tente novamente.';
        } else if (error.code === 10013) {
            errorMessage = 'Usuário não encontrado ou ID inválido.';
        } else if (error.code === 50013) {
            errorMessage = 'Não tenho permissão para banir este usuário.';
        }

        const embed = new EmbedBuilder()
            .setTitle('❌ Erro ao Banir')
            .setColor(config.colors.error)
            .setDescription(errorMessage)
            .setFooter({ text: 'By IsJohn' });

        try {
            await interaction.reply({ embeds: [embed], flags: 64 });
        } catch (replyError) {
            console.error('Erro ao enviar resposta:', replyError);
        }
    }
}

async function handleWarnModal(interaction) {
    try {
        if (!interaction.isModalSubmit()) {
            return;
        }

        const perms = db.getPerms();
        const userPerms = perms[interaction.user.id] || {};
        
        if (!userPerms.warn) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Sem Permissão')
                .setColor(config.colors.error)
                .setDescription('Você não tem permissão para advertir usuários.')
                .setFooter({ text: 'By IsJohn' });
            
            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const userId = interaction.fields.getTextInputValue('user_id');
        const reason = interaction.fields.getTextInputValue('reason');

        if (!userId || !reason) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Dados Inválidos')
                .setColor(config.colors.error)
                .setDescription('Por favor, preencha todos os campos corretamente.')
                .setFooter({ text: 'By IsJohn' });

            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const user = await interaction.client.users.fetch(userId);
        const warns = db.getWarns();
        
        if (!warns[userId]) {
            warns[userId] = [];
        }

        warns[userId].push({
            staffId: interaction.user.id,
            staffName: interaction.user.username,
            reason: reason,
            timestamp: Date.now()
        });

        db.setWarns(warns);

        const embed = new EmbedBuilder()
            .setTitle('⚠️ Usuário Advertido')
            .setColor(config.colors.warning)
            .setDescription(`**${user.username}** recebeu um aviso.`)
            .addFields(
                { name: 'Motivo', value: reason, inline: true },
                { name: 'Staff', value: interaction.user.username, inline: true },
                { name: 'Total de Warns', value: warns[userId].length.toString(), inline: true }
            )
            .setFooter({ text: 'By IsJohn' });

        await interaction.reply({ embeds: [embed] });
        
        try {
            await Logger.logAction(interaction, 'warn', user, reason, { totalWarns: warns[userId].length });
        } catch (logError) {
            console.error('Erro ao enviar log:', logError);
        }
    } catch (error) {
        console.error('Erro no handleWarnModal:', error);
        
        let errorMessage = 'Não foi possível advertir o usuário.';
        if (error.code === 10062) {
            errorMessage = 'A interação expirou. Tente novamente.';
        } else if (error.code === 10013) {
            errorMessage = 'Usuário não encontrado ou ID inválido.';
        }

        const embed = new EmbedBuilder()
            .setTitle('❌ Erro ao Advertir')
            .setColor(config.colors.error)
            .setDescription(errorMessage)
            .setFooter({ text: 'By IsJohn' });

        try {
            await interaction.reply({ embeds: [embed], flags: 64 });
        } catch (replyError) {
            console.error('Erro ao enviar resposta:', replyError);
        }
    }
}

async function handleMuteModal(interaction) {
    try {
        if (!interaction.isModalSubmit()) {
            return;
        }

        const perms = db.getPerms();
        const userPerms = perms[interaction.user.id] || {};
        
        if (!userPerms.mute) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Sem Permissão')
                .setColor(config.colors.error)
                .setDescription('Você não tem permissão para silenciar usuários.')
                .setFooter({ text: 'By IsJohn' });
            
            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const userId = interaction.fields.getTextInputValue('user_id');
        const reason = interaction.fields.getTextInputValue('reason');

        if (!userId || !reason) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Dados Inválidos')
                .setColor(config.colors.error)
                .setDescription('Por favor, preencha todos os campos corretamente.')
                .setFooter({ text: 'By IsJohn' });

            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const member = await interaction.guild.members.fetch(userId);
        await member.timeout(300000, reason);

        const embed = new EmbedBuilder()
            .setTitle('🔇 Usuário Silenciado')
            .setColor(config.colors.success)
            .setDescription(`**${member.user.username}** foi silenciado por 5 minutos.`)
            .addFields(
                { name: 'Motivo', value: reason, inline: true },
                { name: 'Staff', value: interaction.user.username, inline: true }
            )
            .setFooter({ text: 'By IsJohn' });

        await interaction.reply({ embeds: [embed] });
        
        try {
            await Logger.logAction(interaction, 'mute', member.user, reason, { duration: '5 minutos' });
        } catch (logError) {
            console.error('Erro ao enviar log:', logError);
        }
    } catch (error) {
        console.error('Erro no handleMuteModal:', error);
        
        let errorMessage = 'Não foi possível silenciar o usuário.';
        if (error.code === 10062) {
            errorMessage = 'A interação expirou. Tente novamente.';
        } else if (error.code === 10013) {
            errorMessage = 'Usuário não encontrado ou ID inválido.';
        } else if (error.code === 50013) {
            errorMessage = 'Não tenho permissão para silenciar este usuário.';
        }

        const embed = new EmbedBuilder()
            .setTitle('❌ Erro ao Silenciar')
            .setColor(config.colors.error)
            .setDescription(errorMessage)
            .setFooter({ text: 'By IsJohn' });

        try {
            await interaction.reply({ embeds: [embed], flags: 64 });
        } catch (replyError) {
            console.error('Erro ao enviar resposta:', replyError);
        }
    }
}

async function handleUnbanModal(interaction) {
    try {
        if (!interaction.isModalSubmit()) {
            return;
        }

        const perms = db.getPerms();
        const userPerms = perms[interaction.user.id] || {};
        
        if (!userPerms.unban) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Sem Permissão')
                .setColor(config.colors.error)
                .setDescription('Você não tem permissão para desbanir usuários.')
                .setFooter({ text: 'By IsJohn' });
            
            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const userId = interaction.fields.getTextInputValue('user_id');
        const reason = interaction.fields.getTextInputValue('reason');

        if (!userId || !reason) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Dados Inválidos')
                .setColor(config.colors.error)
                .setDescription('Por favor, preencha todos os campos corretamente.')
                .setFooter({ text: 'By IsJohn' });

            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        await interaction.guild.members.unban(userId, reason);

        const embed = new EmbedBuilder()
            .setTitle('✅ Usuário Desbanido')
            .setColor(config.colors.success)
            .setDescription(`Usuário com ID **${userId}** foi desbanido com sucesso.`)
            .addFields(
                { name: 'Motivo', value: reason, inline: true },
                { name: 'Staff', value: interaction.user.username, inline: true }
            )
            .setFooter({ text: 'By IsJohn' });

        await interaction.reply({ embeds: [embed] });
        
        try {
            await Logger.logAction(interaction, 'unban', { id: userId, username: `ID: ${userId}` }, reason);
        } catch (logError) {
            console.error('Erro ao enviar log:', logError);
        }
    } catch (error) {
        console.error('Erro no handleUnbanModal:', error);
        
        let errorMessage = 'Não foi possível desbanir o usuário.';
        if (error.code === 10062) {
            errorMessage = 'A interação expirou. Tente novamente.';
        } else if (error.code === 10026) {
            errorMessage = 'Usuário não está banido.';
        } else if (error.code === 50013) {
            errorMessage = 'Não tenho permissão para desbanir usuários.';
        }

        const embed = new EmbedBuilder()
            .setTitle('❌ Erro ao Desbanir')
            .setColor(config.colors.error)
            .setDescription(errorMessage)
            .setFooter({ text: 'By IsJohn' });

        try {
            await interaction.reply({ embeds: [embed], flags: 64 });
        } catch (replyError) {
            console.error('Erro ao enviar resposta:', replyError);
        }
    }
}

async function handleUnmuteModal(interaction) {
    try {
        if (!interaction.isModalSubmit()) {
            return;
        }

        const perms = db.getPerms();
        const userPerms = perms[interaction.user.id] || {};
        
        if (!userPerms.unmute) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Sem Permissão')
                .setColor(config.colors.error)
                .setDescription('Você não tem permissão para desmutar usuários.')
                .setFooter({ text: 'By IsJohn' });
            
            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const userId = interaction.fields.getTextInputValue('user_id');
        const reason = interaction.fields.getTextInputValue('reason');

        if (!userId || !reason) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Dados Inválidos')
                .setColor(config.colors.error)
                .setDescription('Por favor, preencha todos os campos corretamente.')
                .setFooter({ text: 'By IsJohn' });

            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const member = await interaction.guild.members.fetch(userId);
        await member.timeout(null, reason);

        const embed = new EmbedBuilder()
            .setTitle('🔊 Usuário Desmutado')
            .setColor(config.colors.success)
            .setDescription(`**${member.user.username}** foi desmutado com sucesso.`)
            .addFields(
                { name: 'Motivo', value: reason, inline: true },
                { name: 'Staff', value: interaction.user.username, inline: true }
            )
            .setFooter({ text: 'By IsJohn' });

        await interaction.reply({ embeds: [embed] });
        
        try {
            await Logger.logAction(interaction, 'unmute', member.user, reason);
        } catch (logError) {
            console.error('Erro ao enviar log:', logError);
        }
    } catch (error) {
        console.error('Erro no handleUnmuteModal:', error);
        
        let errorMessage = 'Não foi possível desmutar o usuário.';
        if (error.code === 10062) {
            errorMessage = 'A interação expirou. Tente novamente.';
        } else if (error.code === 10013) {
            errorMessage = 'Usuário não encontrado ou ID inválido.';
        } else if (error.code === 50013) {
            errorMessage = 'Não tenho permissão para desmutar este usuário.';
        }

        const embed = new EmbedBuilder()
            .setTitle('❌ Erro ao Desmutar')
            .setColor(config.colors.error)
            .setDescription(errorMessage)
            .setFooter({ text: 'By IsJohn' });

        try {
            await interaction.reply({ embeds: [embed], flags: 64 });
        } catch (replyError) {
            console.error('Erro ao enviar resposta:', replyError);
        }
    }
}

async function handleLockModal(interaction) {
    try {
        if (!interaction.isModalSubmit()) {
            return;
        }

        const perms = db.getPerms();
        const userPerms = perms[interaction.user.id] || {};
        
        if (!userPerms.lock) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Sem Permissão')
                .setColor(config.colors.error)
                .setDescription('Você não tem permissão para trancar canais.')
                .setFooter({ text: 'By IsJohn' });
            
            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const channelId = interaction.fields.getTextInputValue('user_id');
        const reason = interaction.fields.getTextInputValue('reason');

        if (!channelId || !reason) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Dados Inválidos')
                .setColor(config.colors.error)
                .setDescription('Por favor, preencha todos os campos corretamente.')
                .setFooter({ text: 'By IsJohn' });

            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const channel = await interaction.guild.channels.fetch(channelId);
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            SendMessages: false,
            AddReactions: false,
            CreatePublicThreads: false
        });

        const embed = new EmbedBuilder()
            .setTitle('🔒 Canal Trancado')
            .setColor(config.colors.success)
            .setDescription(`**${channel.name}** foi trancado com sucesso.`)
            .addFields(
                { name: 'Motivo', value: reason, inline: true },
                { name: 'Staff', value: interaction.user.username, inline: true }
            )
            .setFooter({ text: 'By IsJohn' });

        await interaction.reply({ embeds: [embed] });
        
        try {
            await Logger.logAction(interaction, 'lock', channel, reason);
        } catch (logError) {
            console.error('Erro ao enviar log:', logError);
        }
    } catch (error) {
        console.error('Erro no handleLockModal:', error);
        
        let errorMessage = 'Não foi possível trancar o canal.';
        if (error.code === 10062) {
            errorMessage = 'A interação expirou. Tente novamente.';
        } else if (error.code === 10003) {
            errorMessage = 'Canal não encontrado ou ID inválido.';
        } else if (error.code === 50013) {
            errorMessage = 'Não tenho permissão para trancar este canal.';
        }

        const embed = new EmbedBuilder()
            .setTitle('❌ Erro ao Trancar Canal')
            .setColor(config.colors.error)
            .setDescription(errorMessage)
            .setFooter({ text: 'By IsJohn' });

        try {
            await interaction.reply({ embeds: [embed], flags: 64 });
        } catch (replyError) {
            console.error('Erro ao enviar resposta:', replyError);
        }
    }
}

async function handleUnlockModal(interaction) {
    try {
        if (!interaction.isModalSubmit()) {
            return;
        }

        const perms = db.getPerms();
        const userPerms = perms[interaction.user.id] || {};
        
        if (!userPerms.unlock) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Sem Permissão')
                .setColor(config.colors.error)
                .setDescription('Você não tem permissão para destrancar canais.')
                .setFooter({ text: 'By IsJohn' });
            
            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const channelId = interaction.fields.getTextInputValue('user_id');
        const reason = interaction.fields.getTextInputValue('reason');

        if (!channelId || !reason) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Dados Inválidos')
                .setColor(config.colors.error)
                .setDescription('Por favor, preencha todos os campos corretamente.')
                .setFooter({ text: 'By IsJohn' });

            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const channel = await interaction.guild.channels.fetch(channelId);
        await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
            SendMessages: null,
            AddReactions: null,
            CreatePublicThreads: null
        });

        const embed = new EmbedBuilder()
            .setTitle('🔓 Canal Destrancado')
            .setColor(config.colors.success)
            .setDescription(`**${channel.name}** foi destrancado com sucesso.`)
            .addFields(
                { name: 'Motivo', value: reason, inline: true },
                { name: 'Staff', value: interaction.user.username, inline: true }
            )
            .setFooter({ text: 'By IsJohn' });

        await interaction.reply({ embeds: [embed] });
        
        try {
            await Logger.logAction(interaction, 'unlock', channel, reason);
        } catch (logError) {
            console.error('Erro ao enviar log:', logError);
        }
    } catch (error) {
        console.error('Erro no handleUnlockModal:', error);
        
        let errorMessage = 'Não foi possível destrancar o canal.';
        if (error.code === 10062) {
            errorMessage = 'A interação expirou. Tente novamente.';
        } else if (error.code === 10003) {
            errorMessage = 'Canal não encontrado ou ID inválido.';
        } else if (error.code === 50013) {
            errorMessage = 'Não tenho permissão para destrancar este canal.';
        }

        const embed = new EmbedBuilder()
            .setTitle('❌ Erro ao Destrancar Canal')
            .setColor(config.colors.error)
            .setDescription(errorMessage)
            .setFooter({ text: 'By IsJohn' });

        try {
            await interaction.reply({ embeds: [embed], flags: 64 });
        } catch (replyError) {
            console.error('Erro ao enviar resposta:', replyError);
        }
    }
}

async function handleCastigoModal(interaction) {
    try {
        if (!interaction.isModalSubmit()) {
            return;
        }

        const perms = db.getPerms();
        const userPerms = perms[interaction.user.id] || {};
        
        if (!userPerms.castigo) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Sem Permissão')
                .setColor(config.colors.error)
                .setDescription('Você não tem permissão para castigar usuários.')
                .setFooter({ text: 'By IsJohn' });
            
            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const userId = interaction.fields.getTextInputValue('user_id');
        const reason = interaction.fields.getTextInputValue('reason');

        if (!userId || !reason) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Dados Inválidos')
                .setColor(config.colors.error)
                .setDescription('Por favor, preencha todos os campos corretamente.')
                .setFooter({ text: 'By IsJohn' });

            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const member = await interaction.guild.members.fetch(userId);
        await member.timeout(3600000, reason);

        const embed = new EmbedBuilder()
            .setTitle('⏰ Usuário Castigado')
            .setColor(config.colors.warning)
            .setDescription(`**${member.user.username}** foi castigado por 1 hora.`)
            .addFields(
                { name: 'Motivo', value: reason, inline: true },
                { name: 'Staff', value: interaction.user.username, inline: true }
            )
            .setFooter({ text: 'By IsJohn' });

        await interaction.reply({ embeds: [embed] });
        
        try {
            await Logger.logAction(interaction, 'castigo', member.user, reason, { duration: '1 hora' });
        } catch (logError) {
            console.error('Erro ao enviar log:', logError);
        }
    } catch (error) {
        console.error('Erro no handleCastigoModal:', error);
        
        let errorMessage = 'Não foi possível castigar o usuário.';
        if (error.code === 10062) {
            errorMessage = 'A interação expirou. Tente novamente.';
        } else if (error.code === 10013) {
            errorMessage = 'Usuário não encontrado ou ID inválido.';
        } else if (error.code === 50013) {
            errorMessage = 'Não tenho permissão para castigar este usuário.';
        }

        const embed = new EmbedBuilder()
            .setTitle('❌ Erro ao Castigar')
            .setColor(config.colors.error)
            .setDescription(errorMessage)
            .setFooter({ text: 'By IsJohn' });

        try {
            await interaction.reply({ embeds: [embed], flags: 64 });
        } catch (replyError) {
            console.error('Erro ao enviar resposta:', replyError);
        }
    }
}

async function handleConfigBotModal(interaction, customId) {
    const [, , setting] = customId.split('_');
    const settings = db.getSettings();

    if (setting === 'name') {
        const value = interaction.fields.getTextInputValue('value');
        settings.bot.name = value;
        await interaction.client.user.setUsername(value);
        
        db.setSettings(settings);

        const embed = new EmbedBuilder()
            .setTitle('✅ Configuração Atualizada')
            .setColor(config.colors.success)
            .setDescription(`Nome foi atualizado para: **${value}**`)
            .setFooter({ text: 'By IsJohn' });

        await interaction.reply({ embeds: [embed] });
    } else if (setting === 'avatar') {
        const avatarUrl = interaction.fields.getTextInputValue('avatar_url');
        
        try {
            await interaction.client.user.setAvatar(avatarUrl);
            settings.bot.avatar = avatarUrl;
            db.setSettings(settings);

            const embed = new EmbedBuilder()
                .setTitle('✅ Avatar Atualizado')
                .setColor(config.colors.success)
                .setDescription('Avatar do bot foi atualizado com sucesso!')
                .setFooter({ text: 'By IsJohn' });

            await interaction.reply({ embeds: [embed] });
        } catch (error) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Erro ao Atualizar Avatar')
                .setColor(config.colors.error)
                .setDescription('Não foi possível atualizar o avatar. Verifique se a URL é válida.')
                .setFooter({ text: 'By IsJohn' });

            await interaction.reply({ embeds: [embed], flags: 64 });
        }
    }
}

async function handleConfigBotStatusTextModal(interaction) {
    const statusText = interaction.fields.getTextInputValue('status_text');
    const settings = db.getSettings();
    
    settings.bot.status.text = statusText;
    db.setSettings(settings);
    
    try {
        await interaction.client.user.setActivity(statusText, { type: settings.bot.status.type });
        
        const embed = new EmbedBuilder()
            .setTitle('✅ Status Atualizado')
            .setColor(config.colors.success)
            .setDescription(`Status foi atualizado para: **${statusText}** (${settings.bot.status.type})`)
            .setFooter({ text: 'By IsJohn' });

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        const embed = new EmbedBuilder()
            .setTitle('❌ Erro ao Atualizar Status')
            .setColor(config.colors.error)
            .setDescription('Não foi possível atualizar o status.')
            .setFooter({ text: 'By IsJohn' });

        await interaction.reply({ embeds: [embed], flags: 64 });
    }
}

async function handleConfigCanaisModal(interaction, customId) {
    try {
        const channelType = customId.replace('modal_configcanais_', '');
        const channelId = interaction.fields.getTextInputValue('channel_id');
        const settings = db.getSettings();

        if (!channelId) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Erro na Configuração')
                .setColor(config.colors.error)
                .setDescription('ID do canal não foi fornecido.')
                .setFooter({ text: 'By IsJohn' });

            return await interaction.reply({ embeds: [embed], flags: 64 });
        }

        const channel = await interaction.guild.channels.fetch(channelId);
        settings.channels.logs[channelType] = channelId;
        db.setSettings(settings);

        const embed = new EmbedBuilder()
            .setTitle('✅ Canal Configurado')
            .setColor(config.colors.success)
            .setDescription(`Canal ${channelType.replace('_', ' ')} configurado para: ${channel}`)
            .setFooter({ text: 'By IsJohn' });

        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.error('Erro no handleConfigCanaisModal:', error);
        const embed = new EmbedBuilder()
            .setTitle('❌ Erro na Configuração')
            .setColor(config.colors.error)
            .setDescription('Canal não encontrado ou ID inválido.')
            .setFooter({ text: 'By IsJohn' });

        await interaction.reply({ embeds: [embed], flags: 64 });
    }
}
