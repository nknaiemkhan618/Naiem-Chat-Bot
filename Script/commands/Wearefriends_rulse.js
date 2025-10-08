const schedule = require('node-schedule');
const moment = require('moment-timezone');
const chalk = require('chalk');

module.exports.config = {
    name: 'autosent',
    version: '10.3.5',
    hasPermssion: 0,
    credits: 'NK NAIEM KHAN',
    description: 'Automatically sends We Are Friend’s Group Rules every hour (BD Time)',
    commandCategory: 'group messenger',
    usages: '[]',
    cooldowns: 3
};

// ==========================
// পুরো রুলস + আকর্ষণীয় যোগাযোগ বক্স
const fullMessage = `♥️আসসালামু আলাইকুম♥️
༺☆We Are  Friend's☆༻👇
👉গ্রুপের পক্ষ থেকে‌ আন্তরিক শুভেচ্ছা ও ভালোবাসা অবিরাম🥰

👉আমাদের ༺☆We Are Friend's☆༻ গ্রুপের কিছু রুলস আছে যেগুলো আমাদের মেনে চলা বাধ্যতামূলক 👇

(১)👉~গ্রুপে প্রতিদিন ২/৩ ঘন্টা⌚ কলে সময় দিতে হবে (দিতেই হবে 100% ) যেদিন সময় দিতে না পারবেন অবশ্যই এডমিনদের জানাবেন।
নয়তো কোনো এডমিন রিমুভ করলে কাউকে দোষ দিতে পারবেন না।👈👈

(২)👉~এডমিনের অনুমতি ছাড়া গ্রুপের কারো ইনবক্সে যাওয়া যাবে না🔕❌ (ছেলে মেয়ে উভয়)👇

(৩)👉~গ্রুপের name & profile কেউ চেঞ্জ করতে পারবে না❌ & গ্রুপে কেউ কারো সাথে কোনো বাজে আচরণ করা যাবে না❌ & কেউ কাউকে অপমান করে কথা বলা যাবে না❌
এরকম কোনো সমস্যা হলে অবশ্যই এডমিনদের জানাবেন & গ্রুপে মেম্বার এড করলে এডমিনদের সাথে আগে যোগাযোগ করবেন❤️🫰👇

(৪)👉~গ্রুপে কোনো ১৮+ ছবি বা ভিডিও দেওয়া যাবে না🔞 & খারাপ ইঙ্গিত দিয়ে কথা বলা যাবে না🔇❌

☞এবং এসএস টাইমে বাধ্যতা মূলক এক ঘন্টা সময় দিতে হবে 🥰

(৫)👉~এডমিনের কাছে না বলে গ্রুপ থেকে লিভ নিলে ২য় বার এড করা হবে না❌

(৬)👉~গ্রুপের এডমিনদের যথেষ্ট পরিমাণ সম্মান দিয়ে কথা বলবেন♥️ & কেউ কাউকে অপমান করে কথা বলা যাবে না❌

(৭)👉~আমাদের We are family বক্সে প্রতি সপ্তাহে ২ দিন শুক্রবার সুনিবার রাত ১০:০০মিনিট থেকে ১২:০০ মিনিট পর্যন্ত আড্ডা &মাস্তি হয় , সকলেই জয়েন থাকার চেষ্টা করবো ইন শা আল্লাহ্।

👉 আশাকরি সবাই নিয়ম মেনে চলবেন😊😊

🔰ভালোবাসা🔰অবিরাম🔰

♦️সর্বশেষ কথা গ্রুপে রিলেশন সম্পর্কিত কিছু নিয়ে সম্যসা হলে তাদেরকে বিনা: অনুমতিতে রিমুভ করা হবে🫰
👉ধন্যবাদ👈


╭─────────────────────────────╮
│ 🌟 💬 কোনো সমস্যা হলে যোগাযোগ করুন 💬 🌟 │
├─────────────────────────────┤
│ 🧑‍💻 এডমিনঃ 𝐍𝐊 𝐍𝐀𝐈𝐄𝐌 𝐊𝐇𝐀𝐍           │
│ 🌐 Facebook:                      │
│ https://www.facebook.com/profile.php?id=61581203436353 │
│ 📱 WhatsApp: 01908143017           │
╰─────────────────────────────╯

🔰শুভেচ্ছান্তে🔰
༺☆𝐖𝐞 𝐀𝐫𝐞 𝐅riend's☆༻🔰𝐀𝐝𝐦𝐢𝐧 𝐏𝐚𝐧𝐞𝐥🔰`;

// ==========================
// ২৪ ঘন্টা অটো মেসেজ (একই মেসেজ বারবার)
const messages = Array.from({ length: 24 }, () => ({
    message: () => fullMessage
}));

// ==========================
// Scheduler Function
module.exports.onLoad = ({ api }) => {
    console.log(chalk.bold.hex("#00c300")("============ AUTOSENT (FULL MESSAGE) LOADED ============"));

    messages.forEach((msgObj, index) => {
        const rule = new schedule.RecurrenceRule();
        rule.tz = 'Asia/Dhaka';
        rule.hour = index; // 0 থেকে 23 ঘন্টা
        rule.minute = 0;

        schedule.scheduleJob(rule, async () => {
            try {
                if (!global.data?.allThreadID || global.data.allThreadID.length === 0) return;
                
                for (const threadID of global.data.allThreadID) {
                    const msg = msgObj.message();
                    await api.sendMessage(msg, threadID);
                }

                console.log(chalk.hex("#00FFFF")(`✅ Sent Full Message at ${index}:00 BDT to all threads`));
            } catch (error) {
                console.error(chalk.red(`❌ Error sending message at ${index}:00 BDT:`), error);
            }
        });

        console.log(chalk.hex("#00FFFF")(`Scheduled (BDT): ${index}:00 => Full Message`));
    });
};

module.exports.run = () => {};
