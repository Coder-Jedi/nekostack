# Supabase Setup Guide for NekoStack

This guide will help you set up Supabase for NekoStack authentication and user data management.

---

## Step 1: Create Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in the details:
   - **Name**: NekoStack
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier (perfect for MVP)
5. Click "Create new project"
6. Wait 2-3 minutes for project to be ready

---

## Step 2: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (starts with `eyJ...`)
   - **service_role** key (starts with `eyJ...`) - Keep this secret!

---

## Step 3: Set Up Environment Variables

1. Copy the example env file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in your Supabase credentials in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. Generate NextAuth secret:
   ```bash
   openssl rand -base64 32
   ```
   
   Add it to `.env.local`:
   ```bash
   NEXTAUTH_SECRET=your_generated_secret_here
   NEXTAUTH_URL=http://localhost:3000
   ```

---

## Step 4: Run Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the contents of `src/lib/supabase/schema.sql`
4. Paste into the SQL editor
5. Click "Run" to execute the schema
6. Verify tables were created in **Database** → **Tables**

You should see these tables:
- `profiles`
- `user_preferences`
- `subscriptions`
- `usage_tracking`
- `favorites`
- `user_files`
- `recent_activity`

---

## Step 5: Set Up Storage Buckets

1. Go to **Storage** in Supabase dashboard
2. Create three buckets:

### Avatars Bucket (Public)
- Name: `avatars`
- Public: ✅ Yes
- File size limit: 2MB
- Allowed MIME types: `image/*`

### Documents Bucket (Private)
- Name: `documents`
- Public: ❌ No
- File size limit: 10MB
- Allowed MIME types: `application/pdf, image/*, application/msword, application/vnd.openxmlformats-officedocument.*`

### Exports Bucket (Private)
- Name: `exports`
- Public: ❌ No
- File size limit: 50MB
- Allowed MIME types: `application/json, text/csv, application/zip, application/pdf`

---

## Step 6: Configure Authentication Providers

### Email Authentication (Default)
Already enabled! No configuration needed.

### Google OAuth (Optional)
1. Go to **Authentication** → **Providers** → **Google**
2. Enable Google provider
3. Add your Google OAuth credentials:
   - Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Add to `.env.local`:
   ```bash
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

### GitHub OAuth (Optional)
1. Go to **Authentication** → **Providers** → **GitHub**
2. Enable GitHub provider
3. Add your GitHub OAuth credentials:
   - Get credentials from [GitHub Developer Settings](https://github.com/settings/developers)
   - Create OAuth App
   - Add authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`
4. Add to `.env.local`:
   ```bash
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   ```

---

## Step 7: Configure Email Templates (Optional)

1. Go to **Authentication** → **Email Templates**
2. Customize the templates for:
   - Confirm signup
   - Invite user
   - Magic Link
   - Change Email Address
   - Reset Password

---

## Step 8: Test the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Try signing up with email
3. Check Supabase dashboard:
   - **Authentication** → **Users** (should see new user)
   - **Database** → **Table Editor** → **profiles** (should see profile created)
   - **Database** → **Table Editor** → **user_preferences** (should see preferences)
   - **Database** → **Table Editor** → **subscriptions** (should see free tier subscription)

---

## Verification Checklist

- [ ] Supabase project created
- [ ] Environment variables set in `.env.local`
- [ ] Database schema executed successfully
- [ ] All 7 tables visible in Table Editor
- [ ] Storage buckets created (avatars, documents, exports)
- [ ] Email authentication enabled
- [ ] OAuth providers configured (optional)
- [ ] Test user signup works
- [ ] Profile automatically created on signup
- [ ] Default preferences and subscription created

---

## Troubleshooting

### "Invalid API key" error
- Check that your `.env.local` has the correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart your dev server after changing env variables

### Tables not created
- Make sure you ran the entire `schema.sql` file
- Check for SQL errors in the Supabase SQL Editor
- Verify you have proper permissions

### RLS policies blocking access
- Check that Row Level Security policies are set up correctly
- Verify user is authenticated before accessing data
- Check Supabase logs for policy violations

### Storage upload fails
- Verify bucket exists and has correct permissions
- Check file size limits
- Verify MIME type is allowed

---

## Next Steps

Once Supabase is set up:
1. ✅ Supabase configured
2. ⏳ Implement NextAuth.js integration
3. ⏳ Create auth API routes
4. ⏳ Build sign-in/sign-up UI
5. ⏳ Replace mock auth with real auth
6. ⏳ Test complete auth flow

---

## Useful Links

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Guide](https://supabase.com/docs/guides/storage)

---

**Status**: Ready for implementation 🚀  
**Estimated Time**: 30-45 minutes for complete setup
