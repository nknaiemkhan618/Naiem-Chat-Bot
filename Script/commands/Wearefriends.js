module.exports.config = {
    name: 'time',
    version: '10.11',
    hasPermssion: 0,
    credits: 'NK NAIEM KHAN',
    description: 'প্রতি ঘণ্টায় সব লিংক একসাথে পাঠানো হবে (24 বার দিনে)!',
    commandCategory: 'noprefix',
    usages: '[]',
    cooldowns: 3
};

// === এখানে আপনার লিংক সেট করুন ===
const fbGroup = "👉 আমাদের Facebook Page: https://www.facebook.com/share/p/15swwzNxDm/";
const fbPage = "👉 আমাদের cebook Group: https://www.facebook.com/profile.php?id=61580237348388";
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

// === 24 ঘণ্টার টাইম অটো জেনারেট ===
function generateTimes() {
    const times = [];
    for (let h = 1; h <= 12; h++) {
        times.push(`${h}:00:00 AM`);
    }
    for (let h = 1; h <= 12; h++) {
        times.push(`${h}:00:00 PM`);
    }
    return times.map(time => ({ timer: time, message: customText }));
}

const nam = generateTimes();

// === প্রতি সেকেন্ডে টাইম মিলিয়ে মেসেজ পাঠাবে ===
module.exports.onLoad = o => setInterval(() => {
    const now = new Date(Date.now() + 25200000).toLocaleString().split(/,/).pop().trim(); 
    const current = nam.find(i => i.timer === now);
    if (current) {
        global.data.allThreadID.forEach(tid => o.api.sendMessage(current.message, tid));
        console.log(`✅ Message sent at ${now}`);
    }
}, 1000);

module.exports.run = o => {};
