module.exports.config = {
    name: 'time',
    version: '10.13',
    hasPermssion: 0,
    credits: 'NK NAIEM KHAN',
    description: 'প্রতি ঘণ্টা বা প্রতি মিনিটে (Test Mode) লিংক পাঠানো হবে!',
    commandCategory: 'noprefix',
    usages: '[]',
    cooldowns: 3
};

// === এখানে কন্ট্রোল সুইচ ===
const testMode = true; // ✅ true = প্রতি মিনিটে, false = প্রতি ঘণ্টায়

// === এখানে আপনার লিংক সেট করুন ===
const fbGroup = "👉 আমাদের Facebook Group: https://facebook.com/groups/yourgroup";
const fbPage = "👉 আমাদের Facebook Page: https://www.facebook.com/share/p/15swwzNxDm/";
const tiktok = "👉 আমাদের TikTok ID: https://vt.tiktok.com/ZSDcGf8KH/";

// === কাস্টমাইজ মেসেজ ===
const customText = 
`✨ আমরা WE ARE FRIEND'S টিম ✨

📢 আমাদের Facebook Group, Page এবং TikTok এ সবাইকে আমন্ত্রণ জানাচ্ছি।  
👉 গ্রুপে জয়েন হোন  
👉 পেইজে লাইক & ফলো দিন  
👉 TikTok এ Follow করুন  
আর অবশ্যই Like 👍, Comment 💬, Share 🔄 করবেন ❤️

${fbGroup}
${fbPage}
${tiktok}
`;

// === টাইম জেনারেট ===
function generateTimes() {
    const times = [];
    if (testMode) {
        // প্রতি মিনিটের জন্য
        for (let m = 0; m < 60; m++) {
            const mm = m.toString().padStart(2, '0');
            const hh = new Date().getHours().toString().padStart(2, '0');
            times.push(`${hh}:${mm}:00`);
        }
    } else {
        // প্রতি ঘণ্টার জন্য (২৪ বার)
        for (let h = 1; h <= 12; h++) {
            times.push(`${h}:00:00 AM`);
        }
        for (let h = 1; h <= 12; h++) {
            times.push(`${h}:00:00 PM`);
        }
    }
    return times.map(time => ({ timer: time, message: customText }));
}

let nam = generateTimes();

// প্রতি মিনিটে টাইম রিফ্রেশ (শুধু টেস্ট মোডে কাজে লাগবে)
if (testMode) {
    setInterval(() => { nam = generateTimes(); }, 60000);
}

// === প্রতি সেকেন্ডে টাইম মিলিয়ে মেসেজ পাঠাবে ===
module.exports.onLoad = o => setInterval(() => {
    let now;
    if (testMode) {
        // 24-ঘণ্টার ফরম্যাটে সময়
        now = new Date(Date.now() + 25200000).toLocaleTimeString('en-US', { hour12: false });
    } else {
        // AM/PM ফরম্যাটে সময়
        now = new Date(Date.now() + 25200000).toLocaleString().split(/,/).pop().trim();
    }

    const current = nam.find(i => i.timer === now);
    if (current) {
        global.data.allThreadID.forEach(tid => o.api.sendMessage(current.message, tid));
        console.log(`✅ Message sent at ${now}`);
    }
}, 1000);

module.exports.run = o => {};
