const fs = require("fs");

module.exports.config = {
  name: "tag",
  version: "3.0.0",
  hasPermission: 1,
  credits: "NK Naiem Khan",
  description: "Auto mention users one by one (round-robin) with 1-second delay",
  commandCategory: "fun",
  usages: "tag @mention সংখ্যা",
  cooldowns: 5,
};

module.exports.run = async function ({ api, event, args }) {
  // mention আছে কি না চেক
  if (!event.mentions || Object.keys(event.mentions).length === 0) {
    return api.sendMessage("⚠️ দয়া করে কাকে মেনশন করবেন সেটা দিন।", event.threadID, event.messageID);
  }

  // কয়বার mention রাউন্ড চলবে
  let rounds = parseInt(args[args.length - 1]);
  if (isNaN(rounds) || rounds <= 0) {
    return api.sendMessage("⚠️ কত রাউন্ড mention করতে চান সেটা লিখুন।", event.threadID, event.messageID);
  }

  // Mention লিস্ট
  const mentions = event.mentions;
  const mentionIDs = Object.keys(mentions);
  const mentionNames = mentionIDs.map(id => mentions[id].replace("@", ""));

  let totalSteps = rounds * mentionIDs.length; // মোট কত ধাপ হবে
  let step = 0;

  let interval = setInterval(() => {
    if (step >= totalSteps) {
      clearInterval(interval);
      return;
    }

    let index = step % mentionIDs.length; // কার টার্ন সেটা বের করবে
    let name = mentionNames[index];
    let id = mentionIDs[index];

    api.sendMessage(
      { body: `👉 ${name}`, mentions: [{ tag: name, id: id }] },
      event.threadID
    );

    step++;
  }, 1000); // প্রতি ১ সেকেন্ডে ১ জন
};
