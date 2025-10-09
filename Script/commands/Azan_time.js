// azan.js
// Auto Azan & Qaza notification in ALL groups + Tahajjud & Jummah
// File: modules/commands/azan.js

const schedule = require("node-schedule");

module.exports.config = {
  name: "azan",
  version: "5.0.0",
  hasPermssion: 0,
  credits: "Âßhråfùl Îßlām",
  description: "প্রতিদিন আজানের সময় সব গ্রুপে অটো নোটিফিকেশন, কাজা, তাহাজ্জুদ ও শুক্রবারে জুমার আজান পাঠাবে",
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
    "এশা": { start: "19:15", qaza: "01:00" }
  };

  // তাহাজ্জুদের সময় (Custom)
  const tahajjudTime = { start: "02:00", qaza: "04:37" };

  // শুক্রবারের জন্য জুমা
  const jummahTime = { start: "12:30", qaza: "14:30" };

  // 🌙 তাহাজ্জুদ নামাজ
  let [tahajjudHour, tahajjudMinute] = tahajjudTime.start.split(":").map(Number);
  const tahajjudJob = schedule.scheduleJob({ hour: tahajjudHour, minute: tahajjudMinute, tz: "Asia/Dhaka" }, function () {
    const msg = 
`━━━━━━━━━━━━━━━━━
__আসসালামু আলাইকুম 🌙__

তাহাজ্জুদের বরকতময় সময় শুরু হয়েছে 🕋
এ সময় আল্লাহর রহমত নেমে আসে, উঠে যান নামাজে দাঁড়াতে 🙏
━━━━━━━━━━━━━━━━━`;
    for (const threadID of global.data.allThreadID) {
      api.sendMessage(msg, threadID);
    }
  });
  jobs.push(tahajjudJob);

  // তাহাজ্জুদের কাজা (সময় শেষ রিমাইন্ডার)
  let [tahajjudQazaHour, tahajjudQazaMinute] = tahajjudTime.qaza.split(":").map(Number);
  const tahajjudQazaJob = schedule.scheduleJob({ hour: tahajjudQazaHour, minute: tahajjudQazaMinute, tz: "Asia/Dhaka" }, function () {
    const msg = 
`━━━━━━━━━━━━━━━━━━━━━
__তাহাজ্জুদের সময় শেষ 🕰️__

এখন কেউ তাহাজ্জুদ এর নিয়ত বাঁধবো না, সকলেই ফজরের নামাজের প্রস্তুতি নিবো ইন শা আল্লাহ্ 🤲
━━━━━━━━━━━━━━━━━━━━━━`;
    for (const threadID of global.data.allThreadID) {
      api.sendMessage(msg, threadID);
    }
  });
  jobs.push(tahajjudQazaJob);

  // 📿 দৈনিক ৫ ওয়াক্ত আজান ও কাজা
  for (let [prayer, times] of Object.entries(prayerTimes)) {
    let [startHour, startMinute] = times.start.split(":").map(Number);
    const startJob = schedule.scheduleJob({ hour: startHour, minute: startMinute, tz: "Asia/Dhaka" }, function () {
      const msg = 
`━━━━━━━━━━━━━━━━━
__আসসালামু আলাইকুম 🕌__

${prayer} এর নামাজের সময় হয়েছে, সবাই নামাজ পড়ে ফেলবো ইন শা আল্লাহ্ 🤲
━━━━━━━━━━━━━━━━━`;
      for (const threadID of global.data.allThreadID) {
        api.sendMessage(msg, threadID);
      }
    });
    jobs.push(startJob);

    let [qazaHour, qazaMinute] = times.qaza.split(":").map(Number);
    const qazaJob = schedule.scheduleJob({ hour: qazaHour, minute: qazaMinute, tz: "Asia/Dhaka" }, function () {
      const msg = 
`━━━━━━━━━━━━━━━━━
__আসসালামু আলাইকুম 🕌__

${prayer} এর নামাজের সময় শেষ হয়ে গেছে।
যারা এখনো নামাজ পড়েননি, তারা এখন কাজা নামাজ আদায় করুন 🤲
━━━━━━━━━━━━━━━━━`;
      for (const threadID of global.data.allThreadID) {
        api.sendMessage(msg, threadID);
      }
    });
    jobs.push(qazaJob);
  }

  // 🕌 শুক্রবারে জুমার আজান (Friday only)
  let [jummahHour, jummahMinute] = jummahTime.start.split(":").map(Number);
  const jummahJob = schedule.scheduleJob({ dayOfWeek: 5, hour: jummahHour, minute: jummahMinute, tz: "Asia/Dhaka" }, function () {
    const msg = 
`━━━━━━━━━━━━━━━━━
__জুম্মার শুভেচ্ছা 🌿__

আজ শুক্রবার — রহমত ও বরকতের দিন ☪️  
জুমার নামাজের সময় হয়েছে, সবাই মসজিদে যান ইন শা আল্লাহ্ 🕌
━━━━━━━━━━━━━━━━━`;
    for (const threadID of global.data.allThreadID) {
      api.sendMessage(msg, threadID);
    }
  });
  jobs.push(jummahJob);

  // জুমার কাজা (যারা এখনো নামাজ পড়েননি)
  let [jummahQazaHour, jummahQazaMinute] = jummahTime.qaza.split(":").map(Number);
  const jummahQazaJob = schedule.scheduleJob({ dayOfWeek: 5, hour: jummahQazaHour, minute: jummahQazaMinute, tz: "Asia/Dhaka" }, function () {
    const msg = 
`━━━━━━━━━━━━━━━━━
__জুম্মার নামাজের সময় শেষ হয়েছে 🕰️__

যারা এখনো নামাজ পড়েননি, তারা কাজা জোহরের নামাজ আদায় করে নিন 🤲
━━━━━━━━━━━━━━━━━`;
    for (const threadID of global.data.allThreadID) {
      api.sendMessage(msg, threadID);
    }
  });
  jobs.push(jummahQazaJob);

  console.log("✅ আজান, কাজা, তাহাজ্জুদ ও জুমার নোটিফিকেশন সিস্টেম চালু হয়েছে (সব গ্রুপে)।");
};

module.exports.run = async function() {
  // কোনো কমান্ড দরকার নেই, অটো চলবে
};
