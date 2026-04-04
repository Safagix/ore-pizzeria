const crypto = require('crypto');

const expectedHashes = {
    'cashier': '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4',
    'chef': '9af15b336e6a9619928537df30b2e6a2376569fcf9d7e773eccede65606529a0',
    'admin': '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9',
    'service': '0ffe1abd1a08215353c233d6e009613e95eec4253832a761af28ff37ac5a150c'
};

const rawPins = {
    'cashier': '1234',
    'chef': '0000',
    'admin': 'admin123',
    'service': '1111'
};

let allGood = true;

for (const [role, pin] of Object.entries(rawPins)) {
    const hash = crypto.createHash('sha256').update(pin).digest('hex');
    if (hash === expectedHashes[role]) {
        console.log(`✅ ${role}: PIN "${pin}" matches hash ${hash.substring(0, 8)}...`);
    } else {
        console.error(`❌ ${role}: PIN "${pin}" does NOT match hash! Expected ${expectedHashes[role]}, got ${hash}`);
        allGood = false;
    }
}

process.exit(allGood ? 0 : 1);
