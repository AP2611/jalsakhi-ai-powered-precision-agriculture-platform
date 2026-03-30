/**
 * JalSakhi — User Seed Script
 * Creates a test Farmer and a test Admin via the running Express API.
 *
 * Usage:
 *   node seed_users.js
 *   node seed_users.js --url http://localhost:3000   (custom base URL)
 */

const BASE_URL = (() => {
  const idx = process.argv.indexOf('--url');
  return idx !== -1 ? process.argv[idx + 1] : 'http://localhost:3000';
})();

const USERS = [
  {
    label: '🌾 Farmer',
    body: {
      name: 'Ramesh Patil',
      email: 'ramesh.farmer@jalsakhi.test',
      password: 'Farmer@1234',
      role: 'farmer',
      mobile: '9876543210',
      aadhar: '123456789012',
      gender: 'Male',
      state: 'Maharashtra',
      district: 'Pune',
      taluka: 'Haveli',
      village: 'Uruli Kanchan',
      farmSize: '3',
    },
  },
  {
    label: '👔 Admin',
    body: {
      name: 'Suresh Admin',
      email: 'suresh.admin@jalsakhi.test',
      password: 'Admin@1234',
      role: 'admin',
      mobile: '9123456780',
      gender: 'Male',
      state: 'Maharashtra',
      district: 'Nashik',
    },
  },
];

async function register(user) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user.body),
  });

  const data = await res.json();
  const ok = data.success;

  console.log(`\n${user.label} — ${ok ? '✅ Created' : '⚠️  ' + data.message}`);
  if (ok) {
    console.log(`  Email   : ${user.body.email}`);
    console.log(`  Password: ${user.body.password}`);
    console.log(`  Role    : ${user.body.role}`);
    console.log(`  UserId  : ${data.userId}`);
    console.log(`  Note    : An OTP verification email has been sent.`);
  }
  return data;
}

(async () => {
  console.log(`\n🌿 JalSakhi Seed Script`);
  console.log(`   Base URL: ${BASE_URL}\n`);
  console.log('─'.repeat(50));

  for (const user of USERS) {
    try {
      await register(user);
    } catch (err) {
      console.error(`\n${user.label} — ❌ Request failed: ${err.message}`);
      console.error('   Is the server running?');
    }
  }

  console.log('\n' + '─'.repeat(50));
  console.log('Done.\n');
})();
