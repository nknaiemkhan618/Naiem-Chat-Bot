// ==============================
// Config
// ==============================
module.exports.config = {
  name: "namaz",
  version: "0.0.6",
  hasPermission: 0x0,
  credits: "Âßhråfùl Îßlām",
  description: "Auto prayer time notification without npm",
  commandCategory: "time",
  usages: "",
  cooldowns: 0x5
};

// ==============================
// Local ৫ ওয়াক্ত নামাজের সময় (12 ঘণ্টা ফরম্যাট)
// ==============================
const prayerTimes = {
  Fajr:    { start: '04:39 AM', end: '05:52 AM' },
  Dhuhr:   { start: '11:50 PM', end: '03:58 PM' },
  Asr:     { start: '03:59 PM', end: '05:37 PM' },
  Maghrib: { start: '05:39 PM', end: '06:51 PM' },
  Isha:    { start: '06:52 PM', end: '04:37 AM' }
};

// ==============================
// 12 ঘণ্টা টাইমকে Date অবজেক্টে কনভার্ট
// ==============================
function parseTime(timeStr) {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'PM' && hours !== 12) hours += 12;
  if (modifier === 'AM' && hours === 12) hours = 0;

  const now = new Date();
  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0
  );
  return date;
}

// ==============================
// নামাজের শিডিউল সেটআপ
// ==============================
function schedulePrayer(prayerName, startTime, endTime, sendMessage) {
  const startDate = parseTime(startTime);
  const endDate = parseTime(endTime);

  // নামাজ শুরু
  const startTimeout = startDate - new Date();
  if (startTimeout > 0) {
    setTimeout(() => {
      const message = `
╔═❖═❖═❖═❖═❖═❖═❖═╗
   🕌 ${prayerName} নামাজের সময় হয়েছে
   ⏰ এখন সময়: ${startTime}
   🤲 সবাই ${prayerName} নামাজ পড়ে নিন
╚═❖═❖═❖═❖═❖═❖═❖═╝
BOT OWANER ÂẞHRÅFÙL ÎẞLĀM
`;
      console.log(message);
      sendMessage(message);
    }, startTimeout);
  }

  // নামাজ শেষ
  const endTimeout = endDate - new Date();
  if (endTimeout > 0) {
    setTimeout(() => {
      const message = `
╔═❖═❖═❖═❖═❖═❖═❖═╗
   🕰️ ${prayerName} নামাজের সময় শেষ হয়েছে
   ⏰ এখন সময়: ${endTime}
   ☪️ ${prayerName} নামাজ এখন কাজা পড়তে হবে
╚═❖═❖═❖═❖═❖═❖═❖═╝
BOT OWANER ÂẞHRÅFÙL ÎẞLĀM
`;
      console.log(message);
      sendMessage(message);
    }, endTimeout);
  }
}

// ==============================
// Run function for bot
// ==============================
module.exports.run = async function ({ api, event }) {
  const sendMessage = (msg) => api.sendMessage(msg, event.threadID);

  // শুরুতে মেসেজ
  const startMsg = `
╔═❖═❖═❖═❖═❖═❖═❖═╗
  📅 পাঁচ ওয়াক্ত নামাজ নোটিফিকেশন সিস্টেম চালু
  🕋 টাইম ফরম্যাট: 12 ঘণ্টা (AM/PM)
  🌙 লোকেশন: বাংলাদেশ
╚═❖═❖═❖═❖═❖═❖═❖═╝
BOT OWANER ÂẞHRÅFÙL ÎẞLĀM
`;
  console.log(startMsg);
  sendMessage(startMsg);

  // প্রতিটি নামাজের জন্য শিডিউল
  for (const [prayer, time] of Object.entries(prayerTimes)) {
    schedulePrayer(prayer, time.start, time.end, sendMessage);
  }
};
