/**
 * ==========================================================
 * 🔋 BATTERY STYLE AUTO RESTART COMMAND
 * 🧠 Developer: 𝐂𝐘𝐁𝐄𝐑 ☢️_𖣘 -𝐁𝐎𝐓 ⚠️ 𝑻𝑬𝑨𝑴_ ☢️
 * ==========================================================
 * 📦 Version : 3.5.0
 * 👑 Permission : Admin Only
 * 💬 Description : Restart bot with battery-style loading
 * ==========================================================
 */

const chalk = require("chalk");
const moment = require("moment-timezone");
const { exec } = require("child_process");

module.exports.config = {
  name: "restart",
  version: "3.5.0",
  hasPermssion: 2,
  credits: "Nk Naiem Khan",
  description: "Restart bot with stylish battery progress bar",
  commandCategory: "system",
  usages: "[restart bot]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID } = event;
  const time = moment().tz("Asia/Dhaka").format("hh:mm:ss A, DD MMM YYYY");
  const botName = global.config.BOTNAME || "CyberBot";

  const startMsg = `
╔════════════════════════╗
🔋 ${botName} SYSTEM REBOOTING
╚════════════════════════╝
🕒 Time: ${time}
💬 Status: Initializing...
`;

  api.sendMessage(startMsg, threadID, async () => {
    console.clear();
    console.log(chalk.yellow.bold("============================================"));
    console.log(chalk.cyan.bold(`🚀 ${botName} Restart Command Executed`));
    console.log(chalk.green(`🕒 Time: ${time}`));
    console.log(chalk.yellow.bold("============================================\n"));

    // Battery loading animation steps
    const progress = [
      { p: 10, bar: "■□□□□□□□□□", msg: "Starting..." },
      { p: 20, bar: "■■□□□□□□□□", msg: "Loading modules..." },
      { p: 30, bar: "■■■□□□□□□□", msg: "Checking system..." },
      { p: 40, bar: "■■■■□□□□□□", msg: "Saving session..." },
      { p: 50, bar: "■■■■■□□□□□", msg: "Optimizing memory..." },
      { p: 60, bar: "■■■■■■□□□□", msg: "Securing configs..." },
      { p: 70, bar: "■■■■■■■□□□", msg: "Updating runtime..." },
      { p: 80, bar: "■■■■■■■■□□", msg: "Encrypting cache..." },
      { p: 90, bar: "■■■■■■■■■□", msg: "Launching system..." },
      { p: 100, bar: "■■■■■■■■■■", msg: "✅ Restart Complete!" }
    ];

    // Show progress both in console & messenger
    for (let i = 0; i < progress.length; i++) {
      const { p, bar, msg } = progress[i];
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log(chalk.cyan(`[${bar}] ${p}% - ${msg}`));
      api.sendMessage(`⚡ ${botName} Restarting...\n[${bar}] ${p}%\n${msg}`, threadID);
    }

    // Final message
    setTimeout(() => {
      api.sendMessage(`🎉 ${botName} successfully restarted at ${time}`, threadID);
      console.log(chalk.greenBright("\n✅ BOT RESTARTED SUCCESSFULLY!\n"));

      // Auto restart
      exec("npm start", (error, stdout, stderr) => {
        if (error) {
          console.error(chalk.red(`❌ Restart Failed: ${error.message}`));
          return;
        }
        if (stderr) console.error(chalk.red(stderr));
        console.log(chalk.green(stdout));
      });
      process.exit(1);
    }, 2000);
  });
};
