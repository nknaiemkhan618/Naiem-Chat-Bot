const chalk = require("chalk");
const moment = require("moment-timezone");
const { exec } = require("child_process");

module.exports.config = {
  name: "restart",
  version: "5.3.0",
  hasPermssion: 2,
  credits: "Nk Naiem Khan",
  description: "Cinematic restart with all updates in a single message",
  commandCategory: "system",
  usages: "[restart bot]",
  cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
  const { threadID } = event;
  const botName = "না্ঁঈ্ঁমে্ঁর্ঁ ফে্ঁমা্ঁস্ঁ ব্ঁট্ঁ";

  const startTime = moment().tz("Asia/Dhaka").format("hh:mm:ss A, DD MMM YYYY");

  // Initial message
  let batteryLines = Array(10).fill("");
  let fullMessage = `
⚡╔════════════════════════╗
🔋 ${botName} SYSTEM RESTARTING ⚡
╚════════════════════════╝

🕒 Time: ${startTime}
💬 Status: Preparing restart sequence...
✨╔════════ BATTERY STATUS ════════╗
${batteryLines.join("\n")}
✨╚═══════════════════════════╝
`;

  const sentMsg = await api.sendMessage(fullMessage, threadID);

  // Update battery lines
  for (let i = 0; i < 10; i++) {
    const percent = (i + 1) * 10;
    const greenBars = "🟩".repeat(i + 1);
    const emptyBars = "⬜".repeat(10 - (i + 1));
    const bar = greenBars + emptyBars;
    const text = "RESTARTING...";
    const timer = moment().tz("Asia/Dhaka").format("hh:mm:ss A");

    batteryLines[i] = `[${bar}] ${percent}% - ${text} ⏱ ${timer}`;

    // Rebuild full message
    fullMessage = `
⚡╔════════════════════════╗
🔋 ${botName} SYSTEM RESTARTING ⚡
╚════════════════════════╝

🕒 Time: ${startTime}
💬 Status: Restart sequence running...
✨╔════════ BATTERY STATUS ════════╗
${batteryLines.join("\n")}
✨╚═══════════════════════════╝
`;

    // Edit the same message each time
    await api.editMessage(sentMsg.messageID, fullMessage);
    console.log(chalk.green(`[Line ${i + 1}] [${bar}] ${percent}% - ${text} ⏱ ${timer}`));

    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Cinematic Power ON sequence appended to same message
  const cinematicSequence = [
    "🔌 Power Restored...",
    "⚙️ Booting Core Modules...",
    "🚀 Activating AI Systems...",
    `🤖 Welcome Back, ${botName}!`,
    "🎉 Restart Successful! ✅",
    "💳 Credits: Nk Naiem Khan"
  ];

  for (let line of cinematicSequence) {
    fullMessage += `\n${line}`;
    await api.editMessage(sentMsg.messageID, fullMessage);
    console.log(chalk.greenBright(line));
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Final auto restart
  setTimeout(() => {
    exec("npm start", (error, stdout, stderr) => {
      if (error) console.error(chalk.red(`❌ Restart Failed: ${error.message}`));
      if (stderr) console.error(chalk.red(stderr));
      console.log(chalk.green(stdout));
    });

    console.log(chalk.greenBright("\n🎉 BOT FULLY ONLINE & READY TO RUN!\n"));
    process.exit(1);
  }, 1500);
};
