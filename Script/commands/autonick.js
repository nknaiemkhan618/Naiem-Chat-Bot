// modules/commands/autonick.js

const fs = require("fs");
const path = require("path");

const dataFile = path.join(__dirname, "cache", "nicknames.json");

// nicknames.json না থাকলে তৈরি
if (!fs.existsSync(dataFile)) {
  fs.writeFileSync(dataFile, JSON.stringify({}, null, 2));
}

function loadData() {
  return JSON.parse(fs.readFileSync(dataFile));
}

function saveData(data) {
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2));
}

module.exports.config = {
  name: "autonick",
  version: "1.0.0",
  hasPermssion: 1, // শুধু এডমিন ব্যবহার করতে পারবে
  credits: "NK NAIEM KHAN",
  description: "শুধু এডমিন nickname change করতে পারবে।",
  commandCategory: "group",
  usages: "/autonick on | off",
  cooldowns: 5
};

module.exports.handleEvent = async ({ api, event }) => {
  try {
    const { threadID, logMessageData, author, logMessageType } = event;

    // শুধু nickname change ইভেন্ট ধরতে হবে
    if (logMessageType !== "log:user-nickname") return;

    let data = loadData();
    if (!data[threadID] || !data[threadID].enabled) return; // যদি গ্রুপে ফিচার চালু না থাকে

    const userID = logMessageData.participant_id;
    const newNickname = logMessageData.nickname || "";

    const threadInfo = await api.getThreadInfo(threadID);
    const adminIDs = threadInfo.adminIDs.map(item => item.id);

    if (adminIDs.includes(author)) {
      // এডমিন নতুন নাম দিলে সেট সেভ হবে
      data[threadID].nicknames[userID] = newNickname;
      saveData(data);
      return api.sendMessage(`✅ এডমিন nickname সেট করেছেন: ${newNickname || "(খালি)"}`, threadID);
    } else {
      // নন-এডমিন change করলে restore
      const oldNickname = data[threadID].nicknames[userID] || "";
      await api.changeNickname(oldNickname, threadID, userID);
      return api.sendMessage(`⚠️ শুধুমাত্র এডমিন nickname পরিবর্তন করতে পারবে!\n❌ আপনার পরিবর্তন restore হয়েছে।`, threadID);
    }
  } catch (e) {
    console.error("AutoNick error:", e);
  }
};

module.exports.run = async ({ api, event, args }) => {
  let data = loadData();
  if (!data[event.threadID]) {
    data[event.threadID] = { enabled: false, nicknames: {} };
  }

  if (args[0] === "on") {
    data[event.threadID].enabled = true;
    saveData(data);
    return api.sendMessage("✅ AutoNick সিস্টেম চালু হয়েছে! এখন শুধু এডমিন nickname change করতে পারবে।", event.threadID);
  } else if (args[0] === "off") {
    data[event.threadID].enabled = false;
    saveData(data);
    return api.sendMessage("❌ AutoNick সিস্টেম বন্ধ করা হয়েছে।", event.threadID);
  } else {
    return api.sendMessage("ℹ️ ব্যবহার: /autonick on | off", event.threadID);
  }
};
