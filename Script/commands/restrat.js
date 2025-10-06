const chalk = require("chalk");
const moment = require("moment-timezone");
const { exec } = require("child_process");

module.exports.config = {
  name: "restart",
  version: "5.1.0",
  hasPermssion: 2,
  credits: "Nk Naiem Khan",
  description: "Ultimate cinematic live battery restart with spark animations and timer",
  commandCategory: "system",
  usages: "[restart bot]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID } = event;
  const botName = "Ashraful";

  // Initial startup message
  const startTime = moment().tz("Asia/Dhaka").format("hh:mm:ss A, DD MMM YYYY");
  const startMsg = `
⚡╔════════════════════════╗
🔋 ${botName} SYSTEM RESTARTING ⚡
╚════════════════════════╝

🕒 Time: ${startTime}
💬 Status: Initializing super cinematic restart...
`;
  await api.sendMessage(startMsg, threadID);
  console.clear();

  // Battery setup
  const totalLines = 10;
  let batteryLines = Array(totalLines).fill(`[⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜] 0% - ⚡ Charging...`);
  let batteryMsg = `🔋 ${botName} Restarting...\n✨╔════════ BATTERY STATUS ════════╗\n`;
  batteryMsg += batteryLines.join("\n") + `\n✨╚═══════════════════════════╝`;
  const sentMsg = await api.sendMessage(batteryMsg, threadID);

  // Live cinematic charging with burst + spark emojis
  const flashColors = ["🟩", "🟨", "🟧", "🟩"];
  const burstEmojis = ["⚡", "💥", "🔥", "✨", "💫", "🌟"];
  const sparkEmojis = ["⚡", "💨", "🔌", "💥"];

  for (let i = 0; i < totalLines; i++) {
    const percent = (i + 1) * 10;

    for (let flash of flashColors) {
      // Mini burst + spark animation
      const burst = Array(Math.floor(Math.random() * 3) + 1)
        .map(() => burstEmojis[Math.floor(Math.random() * burstEmojis.length)])
        .join("");
      const spark = sparkEmojis[Math.floor(Math.random() * sparkEmojis.length)];

      const bar = flash.repeat(i + 1) + "⬜".repeat(totalLines - (i + 1));
      const text = percent < 100 ? `${spark}${burst} Charging...` : "✅ Fully Charged!";
      const timer = moment().tz("Asia/Dhaka").format("hh:mm:ss A");

      batteryLines[i] = `[${bar}] ${percent}% - ${text} ⏱ ${timer}`;

      batteryMsg = `🔋 ${botName} Restarting...\n✨╔════════ BATTERY STATUS ════════╗\n`;
      batteryMsg += batteryLines.join("\n") + `\n✨╚═══════════════════════════╝`;

      // Live update single message
      await api.editMessage(sentMsg.messageID, batteryMsg);

      console.log(chalk.cyan(`[Line ${i + 1}] [${bar}] ${percent}% - ${text} ⏱ ${timer}`));
      await new Promise(resolve => setTimeout(resolve, 350));
    }
  }

  // Cinematic Power ON sequence
  const cinematicSequence = [
    "🔌 Power Restored...",
    "⚙️ Booting Core Modules...",
    "🚀 Activating AI Systems...",
    "🤖 Welcome Back, " + botName + "!",
    "🎉 Restart Successful! ✅\n💳 Credits: Nk Naiem Khan"
  ];

  for (const line of cinematicSequence) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(chalk.greenBright(line));
    await api.sendMessage(line, threadID);
  }

  // Auto Restart
  setTimeout(() => {
    api.sendMessage(`🎇 ${botName} is now ONLINE 🔥\n🕒 Time: ${moment().tz("Asia/Dhaka").format("hh:mm:ss A, DD MMM YYYY")}\n💳 Credits: Nk Naiem Khan`, threadID);
    console.log(chalk.greenBright("\n🎉 BOT FULLY ONLINE & READY TO RUN!\n"));

    exec("npm start", (error, stdout, stderr) => {
      if (error) console.error(chalk.red(`❌ Restart Failed: ${error.message}`));
      if (stderr) console.error(chalk.red(stderr));
      console.log(chalk.green(stdout));
    });

    process.exit(1);
  }, 1500);
};
