const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, StringSelectMenuBuilder } = require('discord.js');
const config = require('../config.json');
const db = require('../utils/database.js');
const Logger = require('../utils/logger.js');

module.exports = {
    name: 'button',
    async execute(interaction) {
        const customId = interaction.customId;

        if (customId.startsWith('perm_')) {
            await handlePermButton(interaction, customId);
        } else if (customId.startsWith('action_')) {
            await handleActionButton(interaction, customId);
        } else if (customId.startsWith('automod_')) {
            await handleAutomodButton(interaction, customId);
        } else if (customId.startsWith('configbot_')) {
            await handleConfigBotButton(interaction, customId);
        } else if (customId.startsWith('configcanais_')) {
            await handleConfigCanaisButton(interaction, customId);
        } else if (customId === 'emergency_activate') {
            await handleEmergencyButton(interaction);
        } else if (customId === 'emergency_confirm_yes') {
            await handleEmergencyConfirmYes(interaction);
        } else if (customId === 'emergency_confirm_no') {
            await handleEmergencyConfirmNo(interaction);
        } else if (customId === 'status_type_select' || interaction.isStringSelectMenu()) {
            await handleStatusTypeSelect(interaction);
        }
    }
};

async function handlePermButton(interaction, customId) {
    if (interaction.user.id !== config.ownerId) {
        return await interaction.reply({ content: 'Apenas o owner pode alterar permissões.', flags: 64 });
    }

    const parts = customId.split('_');
    const perm = parts[1];
    const userId = parts.slice(2).join('_');
    const perms = db.getPerms();
    
    if (!perms[userId]) {
        perms[userId] = {
            kick: false, ban: false, unban: false, warn: false,
            mute: false, unmute: false, lock: false, unlock: false, castigo: false
        };
    }

    perms[userId][perm] = !perms[userId][perm];
    db.setPerms(perms);

    const user = await interaction.client.users.fetch(userId);
    const embed = new EmbedBuilder()
        .setTitle(`Permissões de ${user.username}`)
        .setThumbnail(user.displayAvatarURL())
        .setColor(config.colors.primary)
        .setDescription('Clique nos botões para alternar permissões')
        .addFields(
            { name: 'Kick', value: perms[userId].kick ? '🟢' : '🔴', inline: true },
            { name: 'Ban', value: perms[userId].ban ? '🟢' : '🔴', inline: true },
            { name: 'Unban', value: perms[userId].unban ? '🟢' : '🔴', inline: true },
            { name: 'Warn', value: perms[userId].warn ? '🟢' : '🔴', inline: true },
            { name: 'Mute', value: perms[userId].mute ? '🟢' : '🔴', inline: true },
            { name: 'Unmute', value: perms[userId].unmute ? '🟢' : '🔴', inline: true },
            { name: 'Lock', value: perms[userId].lock ? '🟢' : '🔴', inline: true },
            { name: 'Unlock', value: perms[userId].unlock ? '🟢' : '🔴', inline: true },
            { name: 'Castigo', value: perms[userId].castigo ? '🟢' : '🔴', inline: true }
        )
        .setFooter({ text: 'By IsJohn' });

    const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`perm_kick_${userId}`)
                .setLabel('Kick')
                .setStyle(perms[userId].kick ? ButtonStyle.Success : ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`perm_ban_${userId}`)
                .setLabel('Ban')
                .setStyle(perms[userId].ban ? ButtonStyle.Success : ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`perm_unban_${userId}`)
                .setLabel('Unban')
                .setStyle(perms[userId].unban ? ButtonStyle.Success : ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`perm_warn_${userId}`)
                .setLabel('Warn')
                .setStyle(perms[userId].warn ? ButtonStyle.Success : ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`perm_mute_${userId}`)
                .setLabel('Mute')
                .setStyle(perms[userId].mute ? ButtonStyle.Success : ButtonStyle.Danger)
        );

    const buttons2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`perm_unmute_${userId}`)
                .setLabel('Unmute')
                .setStyle(perms[userId].unmute ? ButtonStyle.Success : ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`perm_lock_${userId}`)
                .setLabel('Lock')
                .setStyle(perms[userId].lock ? ButtonStyle.Success : ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`perm_unlock_${userId}`)
                .setLabel('Unlock')
                .setStyle(perms[userId].unlock ? ButtonStyle.Success : ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId(`perm_castigo_${userId}`)
                .setLabel('Castigo')
                .setStyle(perms[userId].castigo ? ButtonStyle.Success : ButtonStyle.Danger)
        );

    await interaction.update({ embeds: [embed], components: [buttons, buttons2] });
}

async function handleActionButton(interaction, customId) {
    const [, action] = customId.split('_');
    
    const perms = db.getPerms();
    const userPerms = perms[interaction.user.id] || {};
    
    if (!userPerms[action]) {
        const embed = new EmbedBuilder()
            .setTitle('❌ Sem Permissão')
            .setColor(config.colors.error)
            .setDescription(`Você não tem permissão para executar a ação: **${action}**`)
            .setFooter({ text: 'By IsJohn' });
        
        return await interaction.reply({ embeds: [embed], flags: 64 });
    }
    
    const modal = new ModalBuilder()
        .setCustomId(`modal_${action}`)
        .setTitle(`${action.charAt(0).toUpperCase() + action.slice(1)} Usuário`);

    let inputLabel = 'ID do Usuário';
    if (action === 'lock' || action === 'unlock') {
        inputLabel = 'ID do Canal';
    }

    const userInput = new TextInputBuilder()
        .setCustomId('user_id')
        .setLabel(inputLabel)
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const reasonInput = new TextInputBuilder()
        .setCustomId('reason')
        .setLabel('Motivo')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

    const firstActionRow = new ActionRowBuilder().addComponents(userInput);
    const secondActionRow = new ActionRowBuilder().addComponents(reasonInput);

    modal.addComponents(firstActionRow, secondActionRow);
    await interaction.showModal(modal);
}

async function handleAutomodButton(interaction, customId) {
    const [, setting] = customId.split('_');
    const settings = db.getSettings();
    
    if (setting === 'back') {
        const embed = new EmbedBuilder()
            .setTitle('Configuração de AutoModeração')
            .setColor(config.colors.primary)
            .setDescription('Configure as opções de automoderação')
            .setFooter({ text: 'By IsJohn' });
        
        await interaction.update({ embeds: [embed] });
        return;
    }

    settings.automod[setting].enabled = !settings.automod[setting].enabled;
    db.setSettings(settings);

    const embed = new EmbedBuilder()
        .setTitle('Configuração de AutoModeração')
        .setColor(config.colors.primary)
        .setDescription('Configure as opções de automoderação')
        .addFields(
            { name: 'Anti-Spam', value: settings.automod.antispam.enabled ? '🟢 Ativado' : '🔴 Desativado', inline: true },
            { name: 'Anti-Raid', value: settings.automod.antiraid.enabled ? '🟢 Ativado' : '🔴 Desativado', inline: true },
            { name: 'Auto-Kick', value: settings.automod.autokick.enabled ? '🟢 Ativado' : '🔴 Desativado', inline: true },
            { name: 'Auto-Ban', value: settings.automod.autoban.enabled ? '🟢 Ativado' : '🔴 Desativado', inline: true }
        )
        .setFooter({ text: 'By IsJohn' });

    const buttons = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('automod_antispam')
                .setLabel('Anti-Spam')
                .setStyle(settings.automod.antispam.enabled ? ButtonStyle.Success : ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('automod_antiraid')
                .setLabel('Anti-Raid')
                .setStyle(settings.automod.antiraid.enabled ? ButtonStyle.Success : ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('automod_autokick')
                .setLabel('Auto-Kick')
                .setStyle(settings.automod.autokick.enabled ? ButtonStyle.Success : ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('automod_autoban')
                .setLabel('Auto-Ban')
                .setStyle(settings.automod.autoban.enabled ? ButtonStyle.Success : ButtonStyle.Danger)
        );

    const backButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('automod_back')
                .setLabel('◀ Voltar')
                .setStyle(ButtonStyle.Secondary)
        );

    await interaction.update({ embeds: [embed], components: [buttons, backButton] });
}

async function handleConfigBotButton(interaction, customId) {
    const [, setting] = customId.split('_');
    
    if (setting === 'avatar') {
        const embed = new EmbedBuilder()
            .setTitle('📸 Configurar Avatar')
            .setColor(config.colors.primary)
            .setDescription('Envie uma nova imagem no chat para definir como avatar do bot.')
            .addFields(
                { name: 'Como fazer', value: '1. Envie uma imagem no chat\n2. Clique com botão direito na imagem\n3. Selecione "Copiar link da imagem"\n4. Cole o link aqui', inline: false }
            )
            .setFooter({ text: 'By IsJohn' });

        const modal = new ModalBuilder()
            .setCustomId('modal_configbot_avatar')
            .setTitle('Configurar Avatar');

        const input = new TextInputBuilder()
            .setCustomId('avatar_url')
            .setLabel('URL da Imagem')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('https://exemplo.com/imagem.png')
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(input);
        modal.addComponents(actionRow);
        
        await interaction.reply({ embeds: [embed], flags: 64 });
        await interaction.followUp({ content: 'Agora abra o modal para inserir a URL da imagem:', flags: 64 });
        await interaction.showModal(modal);
        return;
    }
    
    if (setting === 'status') {
        const embed = new EmbedBuilder()
            .setTitle('⚙️ Configurar Status')
            .setColor(config.colors.primary)
            .setDescription('Selecione o tipo de status e depois digite o texto')
            .setFooter({ text: 'By IsJohn' });

        const statusSelect = new StringSelectMenuBuilder()
            .setCustomId('status_type_select')
            .setPlaceholder('Selecione o tipo de status')
            .addOptions([
                {
                    label: 'Jogando',
                    description: 'Mostra "Jogando [texto]"',
                    value: 'PLAYING'
                },
                {
                    label: 'Transmitindo',
                    description: 'Mostra "Transmitindo [texto]"',
                    value: 'STREAMING'
                },
                {
                    label: 'Ouvindo',
                    description: 'Mostra "Ouvindo [texto]"',
                    value: 'LISTENING'
                },
                {
                    label: 'Assistindo',
                    description: 'Mostra "Assistindo [texto]"',
                    value: 'WATCHING'
                },
                {
                    label: 'Competindo',
                    description: 'Mostra "Competindo em [texto]"',
                    value: 'COMPETING'
                }
            ]);

        const selectRow = new ActionRowBuilder().addComponents(statusSelect);
        
        await interaction.reply({ embeds: [embed], components: [selectRow] });
        return;
    }
    
    const modal = new ModalBuilder()
        .setCustomId(`modal_configbot_${setting}`)
        .setTitle(`Configurar ${setting.charAt(0).toUpperCase() + setting.slice(1)}`);

    const input = new TextInputBuilder()
        .setCustomId('value')
        .setLabel(`Novo ${setting}`)
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

    const actionRow = new ActionRowBuilder().addComponents(input);
    modal.addComponents(actionRow);
    await interaction.showModal(modal);
}

async function handleConfigCanaisButton(interaction, customId) {
    try {
        const channelType = customId.replace('configcanais_', '');
        
        if (!channelType) {
            const embed = new EmbedBuilder()
                .setTitle('❌ Erro')
                .setColor(config.colors.error)
                .setDescription('Tipo de canal não especificado.')
                .setFooter({ text: 'By IsJohn' });
            
            return await interaction.reply({ embeds: [embed], flags: 64 });
        }
        
        const modal = new ModalBuilder()
            .setCustomId(`modal_configcanais_${channelType}`)
            .setTitle(`Configurar Canal ${channelType.replace('_', ' ')}`);

        const input = new TextInputBuilder()
            .setCustomId('channel_id')
            .setLabel('ID do Canal')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(input);
        modal.addComponents(actionRow);
        await interaction.showModal(modal);
    } catch (error) {
        console.error('Erro no handleConfigCanaisButton:', error);
        const embed = new EmbedBuilder()
            .setTitle('❌ Erro')
            .setColor(config.colors.error)
            .setDescription('Ocorreu um erro ao abrir o modal.')
            .setFooter({ text: 'By IsJohn' });
        
        await interaction.reply({ embeds: [embed], flags: 64 });
    }
}

async function handleEmergencyButton(interaction) {
    if (interaction.user.id !== config.ownerId) {
        return await interaction.reply({ content: 'Apenas o owner pode ativar o modo de emergência.', flags: 64 });
    }

    const settings = db.getSettings();
    const emergencyMode = settings.emergencyMode || false;

    if (emergencyMode) {
        const embed = new EmbedBuilder()
            .setTitle('🔄 Desativando Modo de Emergência')
            .setColor(config.colors.primary)
            .setDescription('Restaurando permissões...')
            .setFooter({ text: 'By IsJohn' });

        await interaction.reply({ embeds: [embed] });
        await disableEmergencyMode(interaction);
    } else {
        const embed = new EmbedBuilder()
            .setTitle('🚨 Confirmação de Emergência')
            .setColor(config.colors.error)
            .setDescription('**ATENÇÃO!** Você está prestes a ativar o modo de emergência.\n\n**Isso irá:**\n• Remover cargos de moderação de todos os membros\n• Trancar todos os canais de texto\n• Remover cargos de bots\n\n**Tem certeza que deseja continuar?**')
            .setFooter({ text: 'By IsJohn' });

        const confirmRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('emergency_confirm_yes')
                    .setLabel('✅ Sim, Ativar')
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('emergency_confirm_no')
                    .setLabel('❌ Cancelar')
                    .setStyle(ButtonStyle.Secondary)
            );

        await interaction.reply({ embeds: [embed], components: [confirmRow], flags: 64 });
    }
}

async function enableEmergencyMode(interaction) {
    const embed = new EmbedBuilder()
        .setTitle('🚨 Modo de Emergência Ativado')
        .setColor(config.colors.error)
        .setDescription('Executando medidas de segurança avançadas...')
        .setFooter({ text: 'By IsJohn' });

    await interaction.followUp({ embeds: [embed] });

    try {
        const guild = interaction.guild;
        const botMember = guild.members.me;
        const botHighestRole = botMember.roles.highest;
        
        let membersModified = 0;
        let channelsLocked = 0;
        let botsRemoved = 0;

        const members = guild.members.cache.filter(member => 
            member.roles.highest.position < botHighestRole.position &&
            !member.user.bot &&
            member.id !== botMember.id
        );

        for (const [, member] of members) {
            try {
                const moderationRoles = member.roles.cache.filter(role => 
                    role.permissions.has('KickMembers') ||
                    role.permissions.has('BanMembers') ||
                    role.permissions.has('ManageMessages') ||
                    role.permissions.has('ManageChannels') ||
                    role.permissions.has('ManageGuild') ||
                    role.permissions.has('Administrator') ||
                    role.permissions.has('ModerateMembers')
                );
                
                if (moderationRoles.size > 0) {
                    await member.roles.remove(moderationRoles);
                    membersModified++;
                }
            } catch (error) {
                console.error(`Erro ao remover cargos do membro ${member.user.username}:`, error);
            }
        }

        const channels = guild.channels.cache.filter(channel => 
            channel.type === 0 && 
            channel.permissionsFor(botMember).has('ManageChannels')
        );

        for (const [, channel] of channels) {
            try {
                await channel.permissionOverwrites.edit(guild.roles.everyone, {
                    SendMessages: false,
                    AddReactions: false,
                    CreatePublicThreads: false,
                    CreatePrivateThreads: false,
                    SendMessagesInThreads: false,
                    UseExternalEmojis: false,
                    UseExternalStickers: false,
                    AttachFiles: false,
                    EmbedLinks: false
                });
                channelsLocked++;
            } catch (error) {
                console.error(`Erro ao trancar canal ${channel.name}:`, error);
            }
        }

        const bots = guild.members.cache.filter(member => 
            member.user.bot && 
            member.id !== botMember.id &&
            member.roles.highest.position < botHighestRole.position
        );

        for (const [, bot] of bots) {
            try {
                const nonManagedRoles = bot.roles.cache.filter(role => !role.managed && role.id !== guild.id);
                if (nonManagedRoles.size > 0) {
                    await bot.roles.remove(nonManagedRoles);
                    botsRemoved++;
                }
            } catch (error) {
                console.error(`Erro ao remover roles do bot ${bot.user.username}:`, error);
            }
        }

        const settings = db.getSettings();
        settings.emergencyMode = true;
        db.setSettings(settings);

        await Logger.logEmergencyMode(interaction);

        const successEmbed = new EmbedBuilder()
            .setTitle('✅ Modo de Emergência Ativado')
            .setColor(config.colors.success)
            .setDescription('Todas as medidas de segurança foram aplicadas com sucesso.')
            .addFields(
                { name: 'Membros Modificados', value: membersModified.toString(), inline: true },
                { name: 'Canais Trancados', value: channelsLocked.toString(), inline: true },
                { name: 'Bots Removidos', value: botsRemoved.toString(), inline: true }
            )
            .setFooter({ text: 'By IsJohn' });

        await interaction.followUp({ embeds: [successEmbed] });
    } catch (error) {
        console.error('Erro no modo de emergência:', error);
        const errorEmbed = new EmbedBuilder()
            .setTitle('❌ Erro no Modo de Emergência')
            .setColor(config.colors.error)
            .setDescription('Ocorreu um erro ao executar as medidas de segurança.')
            .setFooter({ text: 'By IsJohn' });

        await interaction.followUp({ embeds: [errorEmbed] });
    }
}

async function disableEmergencyMode(interaction) {

    try {
        const guild = interaction.guild;
        const botMember = guild.members.me;
        const botHighestRole = botMember.roles.highest;
        
        let rolesRestored = 0;
        let channelsUnlocked = 0;

        const roles = guild.roles.cache.filter(role => 
            role.position < botHighestRole.position && 
            role.managed === false &&
            role.id !== guild.id
        );

        for (const [, role] of roles) {
            try {
                const newPerms = role.permissions.add([
                    'SendMessages', 'AddReactions', 'CreatePublicThreads', 
                    'CreatePrivateThreads', 'SendMessagesInThreads', 'UseExternalEmojis',
                    'UseExternalStickers', 'AttachFiles', 'EmbedLinks'
                ]);
                await role.setPermissions(newPerms);
                rolesRestored++;
            } catch (error) {
                console.error(`Erro ao restaurar role ${role.name}:`, error);
            }
        }

        const channels = guild.channels.cache.filter(channel => 
            channel.type === 0 && 
            channel.permissionsFor(botMember).has('ManageChannels')
        );

        for (const [, channel] of channels) {
            try {
                await channel.permissionOverwrites.edit(guild.roles.everyone, {
                    SendMessages: null,
                    AddReactions: null,
                    CreatePublicThreads: null,
                    CreatePrivateThreads: null,
                    SendMessagesInThreads: null,
                    UseExternalEmojis: null,
                    UseExternalStickers: null,
                    AttachFiles: null,
                    EmbedLinks: null
                });
                channelsUnlocked++;
            } catch (error) {
                console.error(`Erro ao destrancar canal ${channel.name}:`, error);
            }
        }

        const settings = db.getSettings();
        settings.emergencyMode = false;
        db.setSettings(settings);

        const successEmbed = new EmbedBuilder()
            .setTitle('✅ Modo de Emergência Desativado')
            .setColor(config.colors.success)
            .setDescription('Todas as permissões foram restauradas.')
            .addFields(
                { name: 'Cargos Restaurados', value: rolesRestored.toString(), inline: true },
                { name: 'Canais Destrancados', value: channelsUnlocked.toString(), inline: true }
            )
            .setFooter({ text: 'By IsJohn' });

        await interaction.followUp({ embeds: [successEmbed] });
    } catch (error) {
        console.error('Erro ao desativar modo de emergência:', error);
        const errorEmbed = new EmbedBuilder()
            .setTitle('❌ Erro ao Desativar Modo de Emergência')
            .setColor(config.colors.error)
            .setDescription('Ocorreu um erro ao restaurar as permissões.')
            .setFooter({ text: 'By IsJohn' });

        await interaction.followUp({ embeds: [errorEmbed] });
    }
}

async function handleEmergencyConfirmYes(interaction) {
    if (interaction.user.id !== config.ownerId) {
        return await interaction.reply({ content: 'Apenas o owner pode ativar o modo de emergência.', flags: 64 });
    }

    await interaction.update({ content: 'Ativando modo de emergência...', components: [] });
    await enableEmergencyMode(interaction);
}

async function handleEmergencyConfirmNo(interaction) {
    const embed = new EmbedBuilder()
        .setTitle('❌ Operação Cancelada')
        .setColor(config.colors.primary)
        .setDescription('Modo de emergência não foi ativado.')
        .setFooter({ text: 'By IsJohn' });

    await interaction.update({ embeds: [embed], components: [] });
}

async function handleStatusTypeSelect(interaction) {
    try {
        const selectedType = interaction.values[0];
        const settings = db.getSettings();
        
        settings.bot.status.type = selectedType;
        db.setSettings(settings);
        
        const modal = new ModalBuilder()
            .setCustomId('modal_configbot_status_text')
            .setTitle('Configurar Texto do Status');

        const input = new TextInputBuilder()
            .setCustomId('status_text')
            .setLabel('Texto do Status')
            .setStyle(TextInputStyle.Short)
            .setPlaceholder('Digite o texto do status')
            .setRequired(true);

        const actionRow = new ActionRowBuilder().addComponents(input);
        modal.addComponents(actionRow);
        
        await interaction.update({ content: `Tipo de status definido como: ${selectedType}`, flags: 64 });
        await interaction.showModal(modal);
    } catch (error) {
        console.error('Erro no handleStatusTypeSelect:', error);
        await interaction.update({ content: 'Erro ao configurar status. Tente novamente.', flags: 64 });
    }
}
