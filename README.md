# Bot de Moderação Discord.js v14

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Discord.js](https://img.shields.io/badge/Discord.js-v14-blue.svg)](https://discord.js.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-orange.svg)]()

Bot de moderação completo e modular para Discord, desenvolvido em Node.js com discord.js v14.

## 🚀 Características

- **Slash Commands** com subcommands organizados por categoria
- **Sistema de permissões** configurável para staff
- **Painéis interativos** com botões e modais
- **Database interna** em JSON para persistência
- **AutoModeração** configurável
- **Modo de emergência** para situações críticas
- **Sistema de logs** completo
- **Anti-crash** robusto
- **Handlers** modulares para comandos e eventos

## 📋 Requisitos

- Node.js >= 18
- Discord.js v14
- Conta de bot no Discord

## ⚙️ Instalação

1. Clone este repositório
2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `config.json`:
```json
{
  "token": "SEU_TOKEN_AQUI",
  "clientId": "ID_DO_BOT_AQUI",
  "ownerId": "ID_DO_OWNER_AQUI",
  "status": {
    "text": "Moderando o servidor",
    "type": "WATCHING"
  },
  "colors": {
    "primary": "#5865F2",
    "success": "#57F287",
    "error": "#ED4245",
    "warning": "#FEE75C"
  }
}
```

4. Execute o bot:
```bash
npm start
```

## 🛠️ Comandos

### Owner
- `/staffperm` - Gerencia permissões de staff para outros usuários

### Staff
- `/panelstaff` - Abre painel de ações disponíveis baseado nas permissões
- `/automod` - Configura sistema de automoderação (Anti-Spam, Anti-Raid, Auto-Kick, Auto-Ban)
- `/configbot` - Configura nome, avatar e status do bot
- `/configcanais` - Configura canais de logs (bans públicos/privados, warns, geral)

### Público
- `/bans` - Mostra histórico de bans aplicados por um staff
- `/warns` - Mostra warns de um usuário específico

## 🗄️ Database

O bot utiliza arquivos JSON para armazenar dados:

- `warns.json` - Registros de warns por usuário
- `bans.json` - Histórico de bans
- `kicks.json` - Histórico de kicks
- `perms.json` - Permissões atribuídas via /staffperm
- `settings.json` - Configurações de bot, canais e automod
- `logs.json` - Logs detalhados de todas as ações

## 🔧 Funcionalidades

### Sistema de Permissões
- Controle granular de permissões por usuário
- Permissões disponíveis: kick, ban, unban, warn, mute, unmute, lock, unlock, castigo
- Apenas o owner pode gerenciar permissões
- Interface interativa com botões para ativar/desativar permissões

### AutoModeração
- **Anti-Spam**: Detecta spam baseado em threshold e timeframe configuráveis
- **Anti-Raid**: Detecta entrada em massa de usuários
- **Auto-Kick**: Expulsa automaticamente usuários com 3+ warns
- **Auto-Ban**: Bane automaticamente usuários com 5+ warns
- Configuração via painéis interativos

### Modo de Emergência
- Remove permissões de moderação de todos os membros abaixo do bot
- Remove permissões de bots
- Lock em todos os canais de texto
- Sistema anti-raid avançado
- Exclusivo do owner
- Confirmação antes da ativação

### Sistema de Logs
- Canais configuráveis para diferentes tipos de logs
- Logs de bans públicos e privados
- Logs de warns com contagem total
- Logs gerais para outras ações
- Logs de modo de emergência
- Sistema de logging centralizado

### Painéis Interativos
- Botões para todas as ações de moderação
- Modais para inserção de dados
- Select menus para configurações
- Navegação intuitiva entre painéis
- Feedback visual em tempo real

## 📁 Estrutura do Projeto

```
BotMod/
├── commands/
│   ├── owner/
│   │   └── staffperm.js
│   ├── staff/
│   │   ├── panelstaff.js
│   │   ├── automod.js
│   │   ├── configbot.js
│   │   └── configcanais.js
│   └── public/
│       ├── bans.js
│       └── warns.js
├── events/
│   ├── interactionCreate.js
│   ├── button.js
│   ├── modal.js
│   ├── messageCreate.js
│   ├── staffperm.js
│   ├── panelstaff.js
│   ├── automod.js
│   ├── configbot.js
│   ├── configcanais.js
│   ├── bans.js
│   └── warns.js
├── handlers/
│   ├── commandHandler.js
│   └── eventHandler.js
├── utils/
│   ├── database.js
│   └── logger.js
├── database/
│   ├── warns.json
│   ├── bans.json
│   ├── kicks.json
│   ├── perms.json
│   ├── settings.json
│   └── logs.json
├── config.json
├── index.js
├── package.json
└── README.md
```

## 🔒 Permissões Necessárias

O bot precisa das seguintes permissões no Discord:
- `KickMembers` - Para expulsar usuários
- `BanMembers` - Para banir usuários
- `ManageMessages` - Para gerenciar mensagens
- `ManageChannels` - Para trancar/destrancar canais
- `ManageRoles` - Para gerenciar cargos
- `ModerateMembers` - Para dar timeout
- `SendMessages` - Para enviar mensagens
- `UseSlashCommands` - Para usar slash commands

## 🚨 Modo de Emergência

O modo de emergência é uma funcionalidade crítica que:
1. Remove cargos de moderação de todos os membros
2. Remove cargos de bots
3. Tranca todos os canais de texto
4. Ativa sistema anti-raid avançado

**⚠️ ATENÇÃO**: Esta funcionalidade é irreversível e deve ser usada apenas em situações críticas.

## 📝 Logs

O sistema de logs registra:
- Todas as ações de moderação
- Staff responsável
- Usuário alvo
- Motivo
- Timestamp
- Canal onde foi executado
- Guild onde foi executado

## 🎨 Personalização

O bot pode ser personalizado através do `config.json`:
- Cores das embeds
- Status do bot
- Configurações padrão
- IDs do owner e bot

---

**Desenvolvido por IsJohn**
