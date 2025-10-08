const schedule = require('node-schedule');
const chalk = require('chalk');

module.exports.config = {
    name: 'autosent',
    version: '10.4.0',
    hasPermssion: 0,
    credits: 'Nk Naiem Khan',
    description: 'Automatically sends group rules every hour (BD Time)',
    commandCategory: 'group messenger',
    usages: '[]',
    cooldowns: 3
};

// -----------------------------
// গ্রুপ রুলস
const rules = [
`♥️আসসালামু আলাইকুম♥️
༺☆We Are Friend's☆༻👇
👉গ্রুপের পক্ষ থেকে আন্তরিক শুভেচ্ছা ও ভালোবাসা অবিরাম🥰

👉আমাদের ༺☆We Are Friend's☆༻গ্রুপের কিছু রুলস আছে যেগুলো মেনে চলা বাধ্যতামূলক 👇

(১)~গ্রুপে প্রতিদিন ২/৩ ঘন্টা⌚ কলে সময় দিতে হবে (দিতেই হবে 100% ) যেদিন সময় দিতে না পারবেন অবশ্যই এডমিনদের জানাবেন।  
(২)~এডমিনের অনুমতি ছাড়া গ্রুপের কারো ইনবক্সে যাওয়া যাবে না🔕❌  
(৩)~গ্রুপের name & profile কেউ চেঞ্জ করতে পারবে না❌ & কেউ বাজে আচরণ বা অপমান করা যাবে না❌  
(৪)~গ্রুপে কোনো ১৮+ ছবি বা ভিডিও দেওয়া যাবে না🔞 & খারাপ ইঙ্গিত দিয়ে কথা বলা যাবে না🔇❌  
☞এসএস টাইমে বাধ্যতামূলক এক ঘন্টা সময় দিতে হবে 🥰  
(৫)~এডমিনের কাছে না বলে গ্রুপ থেকে লিভ নিলে ২য় বার এড করা হবে না❌  
(৬)~এডমিনদের যথেষ্ট সম্মান দিয়ে কথা বলবেন♥️ & কেউ কাউকে অপমান করতে পারবে না❌  
(৭) আমাদের We are family বক্সে প্রতি সপ্তাহে ২ দিন শুক্রবার শনিবার রাত ১০:০০টা থেকে ১২:০০ টা পর্যন্ত আড্ডা & মাস্তি। ইনশাআল্লাহ সবাই চেষ্টা করবে যোগ দিতে। 

🔰ভালোবাসা🔰অবিরাম🔰  
♦️সর্বশেষ কথা: গ্রুপে রিলেশন সম্পর্কিত সমস্যা হলে বিনা অনুমতিতে রিমুভ করা হবে🫰  
👉ধন্যবাদ👈`
];

// -----------------------------
// যোগাযোগের তথ্য (centered ASCII ঘর)
const contact = [
`╔════════════════════════════════════════╗
║        যে কোনো সমস্যার জন্য যোগাযোগ করুন       ║
╠════════════════════════════════════════╣
║ Nk Naiem Khan                           ║
║ Facebook: https://www.facebook.com/profile.php?id=61581203436353 ║
║ Whatsapp: 01908143017                  ║
╚════════════════════════════════════════╝`
];

// -----------------------------
// মেসেজ তৈরি
const messageTemplate = () => {
    return (
`${rules[0]}

💭 𝐂𝐎𝐍𝐓𝐀𝐂𝐓:
${contact[0]}

✨✨✨✨✨✨✨✨✨✨✨✨
🔰শুভেচ্ছান্তে🔰
༺☆We Are Friend's☆༻ 𝐀𝐝𝐦𝐢𝐧 𝐏𝐚𝐧𝐞𝐥
✨✨✨✨✨✨✨✨✨✨✨✨`
    );
};

// -----------------------------
// প্রতি ঘন্টায় schedule (BDT)
module.exports.onLoad = ({ api }) => {
    console.log(chalk.bold.hex("#00c300")("============ AUTOSENT COMMAND LOADED (BD TIME) ============"));

    const rule = new schedule.RecurrenceRule();
    rule.tz = 'Asia/Dhaka';
    rule.minute = 0; // প্রতি ঘন্টায় ঠিক 0 মিনিটে পাঠাবে
    rule.hour = new schedule.Range(0, 23); // রাত 12 থেকে 11 পর্যন্ত প্রতি ঘন্টায়

    schedule.scheduleJob(rule, () => {
        if (!global.data?.allThreadID) return;
        global.data.allThreadID.forEach(threadID => {
            const msg = messageTemplate();
            api.sendMessage(msg, threadID, (error) => {
                if (error) console.error(`Failed to send message to ${threadID}:`, error);
            });
        });
    });

    console.log(chalk.hex("#00FFFF")("Scheduled: Group rules with contact & jôg jôg will be sent every hour (BDT)."));
};

module.exports.run = () => {};
