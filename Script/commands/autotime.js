const schedule = require('node-schedule');
const moment = require('moment-timezone');
const chalk = require('chalk');

module.exports.config = {
    name: 'autosent',
    version: '10.0.2',
    hasPermssion: 0,
    credits: 'NK NAIEM KHAN',
    description: 'Automatically sends Islamic messages every hour with time & date (BD Time)',
    commandCategory: 'group messenger',
    usages: '[]',
    cooldowns: 3
};

// ২৪ ঘণ্টার জন্য ২৪টা আলাদা উক্তি
const quotes = [
    "🕋 প্রতিটি কাজ আল্লাহর জন্য করুন..!\n✨ হাসুন, ভালো উদ্দীপনা ছড়িয়ে দিন..!\n📿 নামাজ, দোয়া ও ভালো কাজ—এগুলোই জীবনের শক্তি..!",
    "🌸 ধৈর্য ধরুন, আল্লাহ ধৈর্যশীলদের ভালোবাসেন..!",
    "🤲 দোয়া হলো মুমিনের শক্তি..!",
    "☪️ নামাজ হলো জান্নাতের চাবি..!",
    "🕌 ফজর হলো বরকতের শুরু..!",
    "🌼 অভিভাবকের দোয়া জান্নাতের টিকিট..!",
    "💖 কারো প্রতি অহংকার করবেন না..!",
    "📖 কোরআন পড়ুন, জীবনে শান্তি আসবে..!",
    "🕊️ ক্ষমা করতে শিখুন..!",
    "💎 হালাল রিজিকই আসল বরকত..!",
    "☝️ আল্লাহ ছাড়া কারো উপর নির্ভর করবেন না..!",
    "🌺 দান করলে সম্পদ বাড়ে, কমে না..!",
    "🕌 জুমার দিনে দরুদ পাঠাতে ভুলবেন না..!",
    "🌙 তাহাজ্জুদে দোয়া কবুল হয়..!",
    "💞 ভাইয়ের প্রতি সদাচরণ করুন..!",
    "🕋 তওবা করুন, আল্লাহ ভালোবাসেন..!",
    "🫶 অন্যকে সাহায্য করলে আল্লাহও সাহায্য করবেন..!",
    "🌸 সন্তানের জন্য দোয়া করুন..!",
    "🌟 সত্য কথা বলুন, মিথ্যা থেকে দূরে থাকুন..!",
    "💐 ছোটদের প্রতি স্নেহশীল হোন..!",
    "🌼 বড়দের প্রতি শ্রদ্ধাশীল হোন..!",
    "🕊️ সালাম ছড়ান, ভালোবাসা ছড়ান..!",
    "☀️ সকালে বিসমিল্লাহ দিয়ে দিন শুরু করুন..!",
    "🌏 দুনিয়া সাময়িক, আখিরাত স্থায়ী..!"
];

// প্রতি ঘণ্টায় কোন quote যাবে সেটা অটো সেট
const messages = Array.from({ length: 24 }, (_, i) => {
    let timeLabel = moment().hour(i).minute(0).format("h:00 A");
    return {
        time: timeLabel,
        message: (now) => {
            let date = moment(now).tz("Asia/Dhaka");
            return (
`╔═❖═❖═❖═❖═❖═❖═╗  
 ⏰ 𝗧𝗜𝗠𝗘 & 𝗗𝗔𝗧𝗘 ⏰   
 ╚═❖═❖═❖═❖═❖═❖═╝
    ╔═✪═🕒═✪═╗
    🕰️ 𝐓𝐢𝐦𝐞: ${date.format("h:mm A")}
    ╚════════╝
📅 𝐃𝐚𝐭𝐞: ${date.format("D")}  
📛 𝐃𝐚𝐲: ${date.format("dddd")}  
🗓️ 𝐌𝐨𝐧𝐭𝐡: ${date.format("MMMM")}  
📆 𝐘𝐞𝐚𝐫: ${date.format("YYYY")}  
━━━━━━━━━━━━━━━━━━

${quotes[i]}

━━━━━━━━━━━━━━━━━━  
👑 𝐁𝐨𝐭 𝐎𝐰𝐧𝐞𝐫 ➠ NK NAIEM KHAN  

🌟 𝐂𝐫𝐞𝐚𝐭𝗼𝐫 ━ NK NAIEM KHAN 🌟  
━━━━━━━━━━━━━━━━━━`);
        }
    };
});

module.exports.onLoad = ({ api }) => {
    console.log(chalk.bold.hex("#00c300")("============ AUTOSENT COMMAND LOADED (BD TIME) ============"));

    messages.forEach(({ time, message }, index) => {
        const [hour, minute, period] = time.split(/[: ]/);
        let hour24 = parseInt(hour, 10);
        if (period === 'PM' && hour !== '12') {
            hour24 += 12;
        } else if (period === 'AM' && hour === '12') {
            hour24 = 0;
        }

        const rule = new schedule.RecurrenceRule();
        rule.tz = 'Asia/Dhaka';
        rule.hour = hour24;
        rule.minute = parseInt(minute, 10);

        schedule.scheduleJob(rule, () => {
            if (!global.data?.allThreadID) return;
            global.data.allThreadID.forEach(threadID => {
                const msg = message(new Date());
                api.sendMessage(msg, threadID, (error) => {
                    if (error) {
                        console.error(`Failed to send message to ${threadID}:`, error);
                    }
                });
            });
        });

        console.log(chalk.hex("#00FFFF")(`Scheduled (BDT): ${time} => Quote #${index + 1}`));
    });
};

module.exports.run = () => {};
