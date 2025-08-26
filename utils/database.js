const fs = require('fs');
const path = require('path');

class Database {
    constructor() {
        this.dbPath = path.join(__dirname, '..', 'database');
    }

    readFile(filename) {
        const filePath = path.join(this.dbPath, filename);
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            return {};
        }
    }

    writeFile(filename, data) {
        const filePath = path.join(this.dbPath, filename);
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            return true;
        } catch (error) {
            console.error(`Erro ao escrever arquivo ${filename}:`, error);
            return false;
        }
    }

    getWarns() {
        return this.readFile('warns.json');
    }

    setWarns(data) {
        return this.writeFile('warns.json', data);
    }

    getBans() {
        return this.readFile('bans.json');
    }

    setBans(data) {
        return this.writeFile('bans.json', data);
    }

    getKicks() {
        return this.readFile('kicks.json');
    }

    setKicks(data) {
        return this.writeFile('kicks.json', data);
    }

    getPerms() {
        return this.readFile('perms.json');
    }

    setPerms(data) {
        return this.writeFile('perms.json', data);
    }

    getSettings() {
        const settings = this.readFile('settings.json');
        
        if (!settings.bot) {
            settings.bot = {
                name: "Bot Mod",
                avatar: null,
                status: {
                    text: "Mod Top",
                    type: "STREAMING"
                }
            };
        }
        
        if (!settings.channels) {
            settings.channels = {
                logs: {
                    bans_public: null,
                    bans_private: null,
                    warns: null,
                    general: null
                }
            };
        } else if (!settings.channels.logs) {
            settings.channels.logs = {
                bans_public: null,
                bans_private: null,
                warns: null,
                general: null
            };
        }
        
        if (!settings.automod) {
            settings.automod = {
                antispam: {
                    enabled: true,
                    threshold: 5,
                    timeframe: 10000
                },
                antiraid: {
                    enabled: true,
                    threshold: 10,
                    timeframe: 5000
                },
                autokick: {
                    enabled: true,
                    warn_threshold: 3
                },
                autoban: {
                    enabled: true,
                    warn_threshold: 5
                }
            };
        }
        
        if (settings.emergencyMode === undefined) {
            settings.emergencyMode = false;
        }
        
        return settings;
    }

    setSettings(data) {
        return this.writeFile('settings.json', data);
    }

    addLog(type, data) {
        const logs = this.readFile('logs.json');
        if (!logs[type]) {
            logs[type] = [];
        }
        
        const logEntry = {
            ...data,
            timestamp: Date.now(),
            date: new Date().toISOString()
        };
        
        logs[type].push(logEntry);
        
        if (logs[type].length > 1000) {
            logs[type] = logs[type].slice(-1000);
        }
        
        return this.writeFile('logs.json', logs);
    }

    getLogs(type) {
        const logs = this.readFile('logs.json');
        return logs[type] || [];
    }
}

module.exports = new Database();
