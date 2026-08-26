import fs from "fs";

const envContent = fs.readFileSync(".env.local", "utf8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map((line) => {
      const idx = line.indexOf("=");
      return [line.slice(0, idx).trim(), line.slice(idx + 1).trim()];
    })
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const email = process.argv[2];
const password = process.argv[3];
const fullName = process.argv[4] || "Sales Rep";
const role = process.argv[5] || "DSR";
const salesArea = process.argv[6] || "Bandung";

if (!email || !password) {
  console.log("Usage: node scripts/create_user.mjs <email> <password> [fullName] [role] [salesArea]");
  console.log('Example: node scripts/create_user.mjs "andi@gmail.com" "Rahasia123" "Andi" "DSR" "Cikarang"');
  process.exit(0);
}

async function createUser() {
  console.log(`Creating user: ${email} (${fullName} - ${role} ${salesArea})...`);

  // 1. Create user in auth.users
  const authRes = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName,
      },
    }),
  });

  const authData = await authRes.json();

  if (!authRes.ok) {
    console.error("Failed to create auth user:", authData);
    process.exit(1);
  }

  const userId = authData.id;
  console.log(`Auth user created successfully! ID: ${userId}`);

  // Small delay for DB trigger to complete
  await new Promise((r) => setTimeout(r, 500));

  // 2. Upsert profile in public.profiles
  const profileRes = await fetch(`${supabaseUrl}/rest/v1/profiles?id=eq.${userId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      full_name: fullName,
      role: role,
      sales_area: salesArea,
      is_active: true,
      updated_at: new Date().toISOString(),
    }),
  });

  const profileData = await profileRes.json();

  console.log("Profile successfully created and linked!");
  console.log("Profile details:", JSON.stringify(profileData, null, 2));
  console.log(`\nAkun siap digunakan untuk login!\nEmail: ${email}\nPassword: ${password}\n`);
}

createUser();
