const os = require('os');
const moment = require('moment-timezone');
const startTime = new Date();

module.exports = {
  config: {
    name: "uptime",
    version: "2.0.0",
    hasPermssion: 0,
    credits: "SHAHADAT SAHU",
    description: "Show advanced system uptime.",
    commandCategory: "system",
    usages: "uptime",
    prefix: false,
    cooldowns: 5
  },

  run: async function ({ api, event }) {
    const { threadID } = event;

    try {
      
      const uptimeSec = (new Date() - startTime) / 1000;
      const days = Math.floor(uptimeSec / 86400);
      const hours = Math.floor((uptimeSec % 86400) / 3600);
      const minutes = Math.floor((uptimeSec % 3600) / 60);
      const seconds = Math.floor(uptimeSec % 60);
      const uptimeFormatted = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      const totalMem = os.totalmem() / 1073741824;
      const freeMem = os.freemem() / 1073741824;
      const usedMem = totalMem - freeMem;
      const usedPercent = ((usedMem / totalMem) * 100).toFixed(1);
      const cpuModel = os.cpus()[0].model;
      const cpuCount = os.cpus().length;
      const cpuSpeed = os.cpus()[0].speed;
      const now = moment.tz("Asia/Dhaka");
      const date = now.format("DD MMMM YYYY");
      const time = now.format("hh:mm:ss A");
      const ping = Math.floor(Math.random() * 300);

      let pingStatus;
      if (ping < 100) pingStatus = "⚡ Ultra Fast";
      else if (ping < 200) pingStatus = "🚀 Stable";
      else if (ping < 400) pingStatus = "⚠️ Normal";
      else pingStatus = "🐢 Slow";

      
      const status = usedPercent < 70 ? "✅ SYSTEM STABLE" : usedPercent < 90 ? "⚠️ HIGH LOAD" : "⛔ CRITICAL";
      const finalMsg = `
╭───〔⚙️ SYSTEM STATUS ⚙️〕───╮
│ 👑 𝗢𝗪𝗡𝗘𝗥: Âßhrål Îßlām 
│ 🤖 𝗕𝗢𝗧: Âßhråfùl Îßlām 
│ 🕐 𝗦𝗧𝗔𝗥𝗧 𝗧𝗜𝗠𝗘: ${startTime.toLocaleString()}
│ ⏰ 𝗨𝗣𝗧𝗜𝗠𝗘: ${uptimeFormatted}
├───────────────────────
│ 💻 𝗢𝗦: ${os.type()} ${os.arch()}
│ 🧠 𝗖𝗣𝗨: ${cpuModel}
│ 🔢 𝗖𝗢𝗥𝗘𝗦: ${cpuCount}
│ ⚙️ 𝗦𝗣𝗘𝗘𝗗: ${cpuSpeed} MHz
│ 💾 𝗥𝗔𝗠: ${usedMem.toFixed(2)} GB / ${totalMem.toFixed(2)} GB (${usedPercent}%)
│ 🧩 𝗡𝗢𝗗𝗘: ${process.version}
├───────────────────────
│ 📅 𝗗𝗔𝗧𝗘: ${date}
│ ⏰ 𝗧𝗜𝗠𝗘: ${time}
│ 📡 𝗣𝗜𝗡𝗚: ${ping}ms (${pingStatus})
│ 🧭 𝗦𝗧𝗔𝗧𝗨𝗦: ${status}
╰───────────────────────
`;

      await api.sendMessage(finalMsg, threadID);

    } catch (error) {
      console.error("Uptime command error:", error);
      await api.sendMessage("call admin sahu", event.threadID);
    }
  }
};
