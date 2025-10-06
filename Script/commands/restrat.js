/**
 * ==========================================================
 * ⚡ CINEMATIC BATTERY RESTART SYSTEM
 * 🧠 Developer: 𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️
 * ==========================================================
 * 📦 Version : 5.0.0
 * 👑 Permission : Admin Only
 * 💬 Description : Battery Charging Animation + Cinematic Power ON
 * ==========================================================
 */

const chalk = require("chalk");
const moment = require("moment-timezone");
const { exec } = require("child_process");

module.exports.config = {
  name: "restart",
  version: "5.0.0",
  hasPermssion: 2,
  credits: "Nk Naiem Khan",
  description: "Restart bot with cinematic battery animation",
  commandCategory: "system",
  usages: "[restart bot]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID } = event;
  const time = moment().tz("Asia/Dhaka").format("hh:mm:ss A, DD MMM YYYY");
  const botName = "Nk Naiem Khan";

  const startMsg = `
╔════════════════════════════════╗
🔋 ${botName} SYSTEM RESTARTING ⚡
╚════════════════════════════════╝

🕒 Time: ${time}
💬 Status: Charging core modules...
  `;

  api.sendMessage(startMsg, threadID, async () => {
    console.clear();
    console.log(chalk.yellow.bold("============================================"));
    console.log(chalk.cyan.bold(`🚀 ${botName} Restart Command Executed`));
    console.log(chalk.green(`🕒 Time: ${time}`));
    console.log(chalk.yellow.bold("============================================\n"));

    // Charging animation (10% ➜ 100%)
    let totalBars = 10;
    for (let i = 1; i <= totalBars; i++) {
      let percent = i * 10;
      let bar = "■".repeat(i) + "□".repeat(totalBars - i);
      let text = percent < 100 ? "⚡ Charging..." : "✅ Fully Charged!";
      let msg = `🔋 ${botName} Restarting...\n[${bar}] ${percent}%\n${text}`;

      console.log(chalk.cyan(`[${bar}] ${percent}% - ${text}`));
      api.sendMessage(msg, threadID);

      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Cinematic Power ON Effect
    const finalSequence = [
      "🔌 Power Restored...",
      "⚙️ System Booting...",
      "🚀 Activating Core Modules...",
      "🤖 Welcome Back, " + botName + "!",
      "✅ Restart Successful!"
    ];

    for (const line of finalSequence) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(chalk.greenBright(line));
      api.sendMessage(line, threadID);
    }

    // Auto Restart
    setTimeout(() => {
      api.sendMessage(`🎉 ${botName} is now ONLINE ✅\n🕒 Time: ${time}`, threadID);
      console.log(chalk.greenBright("\n🎉 BOT FULLY ONLINE & READY TO RUN!\n"));

      exec("npm start", (error, stdout, stderr) => {
        if (error) {
          console.error(chalk.red(`❌ Restart Failed: ${error.message}`));
          return;
        }
        if (stderr) console.error(chalk.red(stderr));
        console.log(chalk.green(stdout));
      });

      process.exit(1);
    }, 1500);
  });
};
