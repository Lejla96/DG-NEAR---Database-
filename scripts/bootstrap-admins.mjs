import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.",
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const admins = ["martina@redi-ngo.eu", "lejla@redi-ngo.eu"];

for (const email of admins) {
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
    redirectTo: `${siteUrl}/login`,
    data: { role: "admin", full_name: email.split("@")[0] },
  });

  if (error) {
    console.error(`Failed to invite ${email}: ${error.message}`);
    continue;
  }

  console.log(`Invited ${email}.`);

  if (data.user?.id) {
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      email,
      full_name: email.split("@")[0],
      role: "admin",
    });

    if (profileError) {
      console.error(`Failed to upsert profile for ${email}: ${profileError.message}`);
    }
  }
}
