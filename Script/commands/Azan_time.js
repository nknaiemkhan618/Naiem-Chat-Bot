// azan.js
// Auto Azan & Qaza notification in ALL groups
// File: modules/commands/azan.js

const schedule = require("node-schedule");

module.exports.config = {
  name: "azan",
  version: "4.0.0",
  hasPermssion: 0,
  credits: "Akash + Customized by You",
  description: "প্রতিদিন আজানের সময় সব গ্রুপে অটো নোটিফিকেশন ও কাজার নোটিফিকেশন পাঠাবে",
  commandCategory: "Islamic",
  usages: "অটো রান",
  cooldowns: 5
};

let jobs = [];

module.exports.onLoad = async function({ api }) {
  // আজানের টাইম (বাংলাদেশ স্ট্যান্ডার্ড টাইম)
  const prayerTimes = {
    "ফজর": { start: "05:00", qaza: "05:52" },
    "যোহর": { start: "13:00", qaza: "14:58" },
    "আসর": { start: "16:15", qaza: "17:37" },
    "মাগরিব": { start: "17:44", qaza: "18:51" },
    "এশা": { start: "19:15", qaza: "04:37" }
  };

  for (let [prayer, times] of Object.entries(prayerTimes)) {
    // শুরু টাইমে আজানের মেসেজ
    let [startHour, startMinute] = times.start.split(":").map(Number);
    const startJob = schedule.scheduleJob({ hour: startHour, minute: startMinute, tz: "Asia/Dhaka" }, function () {
      const msg = 
`━━━━━━━━━━━━━━━━━
__আসসালামু আলাইকুম 🕌__

${prayer} এর নামাজের সময় হয়েছে, আপনারা সবাই নামাজ পড়তে যাবো ইন শা আল্লাহ্ 🤲
━━━━━━━━━━━━━━━━━`;

      for (const threadID of global.data.allThreadID) {
        api.sendMessage(msg, threadID);
      }
    });
    jobs.push(startJob);

    // কাজার সময়ে মেসেজ
    let [qazaHour, qazaMinute] = times.qaza.split(":").map(Number);
    const qazaJob = schedule.scheduleJob({ hour: qazaHour, minute: qazaMinute, tz: "Asia/Dhaka" }, function () {
      const msg = 
`━━━━━━━━━━━━━━━━━
__আসসালামু আলাইকুম 🕌__

${prayer} এর নামাজের সময় শেষ হয়ে গেছে। 
যারা নামাজ পড়েননি, তারা এখন কাজা নামাজ পড়ে নিবেন  🤲
━━━━━━━━━━━━━━━━━`;

      for (const threadID of global.data.allThreadID) {
        api.sendMessage(msg, threadID);
      }
    });
    jobs.push(qazaJob);
  }

  console.log("✅ আজান ও কাজার নোটিফিকেশন সিস্টেম চালু হয়েছে (সব গ্রুপে)।");
};

module.exports.run = async function() {
  // কোনো কমান্ড দরকার নেই, অটো চলবে
};
