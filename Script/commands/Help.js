const fs = require("fs-extra");
const request = require("request");
const path = require("path");

module.exports.config = {
    name: "help",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "SHAHADAT SAHU",
    description: "Shows all commands with details",
    commandCategory: "system",
    usages: "[command name/page number]",
    cooldowns: 5,
    envConfig: {
        autoUnsend: true,
        delayUnsend: 20
    }
};

module.exports.languages = {
    "en": {
        "moduleInfo": `╭━━━━━━━━━━━━━━━━╮
┃ ✨ 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐈𝐍𝐅𝐎 ✨
┣━━━━━━━━━━━┫
┃ 🔖 Name: %1
┃ 📄 Usage: %2
┃ 📜 Description: %3
┃ 🔑 Permission: %4
┃ 👨‍💻 Credit: %5
┃ 📂 Category: %6
┃ ⏳ Cooldown: %7s
┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: %8
┃ 🤖 Bot Name: %9
┃ 👑 Owner: 𝐀𝐒𝐇𝐑𝐀𝐅𝐔𝐋 𝐈𝐒𝐋𝐀𝐌
╰━━━━━━━━━━━━━━━━╯`,
        "helpList": "[ There are %1 commands. Use: \"%2help commandName\" to view more. ]",
        "user": "User",
        "adminGroup": "Admin Group",
        "adminBot": "Admin Bot"
    }
};

// এখানে আপনার ফোটো Imgur লিংক করে বসাবেন✅

const helpImages = [
    "https://i.imgur.com/aYSN2Ze.jpeg",
    "https://i.imgur.com/pUxP6Lx.jpeg",
    "https://i.imgur.com/wb6qhdL.jpeg",
    "https://i.imgur.com/gQnxRiO.jpeg"
];

function downloadImages(callback) {
    let files = [];
    let completed = 0;

    helpImages.forEach((url, i) => {  
        let filePath = path.join(__dirname, "cache", `help${i}.jpg`);  
        files.push(filePath);  
        request(url).pipe(fs.createWriteStream(filePath)).on("close", () => {  
            completed++;  
            if (completed === helpImages.length) callback(files);  
        });  
    });
}

module.exports.handleEvent = function ({ api, event, getText }) {
    const { commands } = global.client;
    const { threadID, messageID, body } = event;

    if (!body || typeof body === "undefined" || body.indexOf("help") != 0) return;  
    const splitBody = body.slice(body.indexOf("help")).trim().split(/\s+/);  
    if (splitBody.length < 2 || !commands.has(splitBody[1].toLowerCase())) return;  

    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};  
    const command = commands.get(splitBody[1].toLowerCase());  
    const prefix = threadSetting.PREFIX || global.config.PREFIX;  

    const detail = getText("moduleInfo",  
        command.config.name,  
        command.config.usages || "Not Provided",  
        command.config.description || "Not Provided",  
        command.config.hasPermssion,  
        command.config.credits || "Unknown",  
        command.config.commandCategory || "Unknown",  
        command.config.cooldowns || 0,  
        prefix,  
        global.config.BOTNAME || "আ্ঁশ্ঁরা্ঁফু্ঁল্ঁ এ্ঁর্ঁ ফে্ঁমা্ঁস্ঁ ব্ঁট্ঁ"  
    );  

    downloadImages(files => {  
        const attachments = files.map(f => fs.createReadStream(f));  
        api.sendMessage({ body: detail, attachment: attachments }, threadID, () => {  
            files.forEach(f => fs.unlinkSync(f));  
        }, messageID);  
    });
};

module.exports.run = function ({ api, event, args, getText }) {
    const { commands } = global.client;
    const { threadID, messageID } = event;

    const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};  
    const prefix = threadSetting.PREFIX || global.config.PREFIX;  

    if (args[0] && commands.has(args[0].toLowerCase())) {  
        const command = commands.get(args[0].toLowerCase());  

        const detailText = getText("moduleInfo",  
            command.config.name,  
            command.config.usages || "Not Provided",  
            command.config.description || "Not Provided",  
            command.config.hasPermssion,  
            command.config.credits || "Unknown",  
            command.config.commandCategory || "Unknown",  
            command.config.cooldowns || 0,  
            prefix,  
            global.config.BOTNAME || "আ্ঁশ্ঁরা্ঁফু্ঁল্ঁ এ্ঁর্ঁ ফে্ঁমা্ঁস্ঁ ব্ঁট্ঁ"  
        );  

        downloadImages(files => {  
            const attachments = files.map(f => fs.createReadStream(f));  
            api.sendMessage({ body: detailText, attachment: attachments }, threadID, () => {  
                files.forEach(f => fs.unlinkSync(f));  
            }, messageID);  
        });  
        return;  
    }  

    const arrayInfo = Array.from(commands.keys())
        .filter(cmdName => cmdName && cmdName.trim() !== "")
        .sort();  

    const page = Math.max(parseInt(args[0]) || 1, 1);  
    const numberOfOnePage = 20;  
    const totalPages = Math.ceil(arrayInfo.length / numberOfOnePage);  
    const start = numberOfOnePage * (page - 1);  
    const helpView = arrayInfo.slice(start, start + numberOfOnePage);  

    let msg = helpView.map(cmdName => `┃ ✪ ${cmdName}`).join("\n");

    const text = `╭━━━━━━━━━━━━━━━━╮
┃ 📜 𝐂𝐎𝐌𝐌𝐀𝐍𝐃 𝐋𝐈𝐒𝐓 📜
┣━━━━━━━━━━━━━━━┫
┃ 📄 Page: ${page}/${totalPages}
┃ 🧮 Total: ${arrayInfo.length}
┣━━━━━━━━━━━━━━━━┫
${msg}
┣━━━━━━━━━━━━━━━━┫
┃ ⚙ Prefix: ${prefix}
┃ 🤖 Bot Name: ${global.config.BOTNAME || "আ্ঁশ্ঁরা্ঁফু্ঁল্ঁ এ্ঁর্ঁ ফে্ঁমা্ঁস্ঁ ব্ঁট্ঁ"}
┃ 👑 Owner: 𝐀𝐒𝐇𝐑𝐀𝐅𝐔𝐋 𝐈𝐒𝐋𝐀𝐌�
╰━━━━━━━━━━━━━━━━╯`;

    downloadImages(files => {  
        const attachments = files.map(f => fs.createReadStream(f));  
        api.sendMessage({ body: text, attachment: attachments }, threadID, () => {  
            files.forEach(f => fs.unlinkSync(f));  
        }, messageID);  
    });  
};
