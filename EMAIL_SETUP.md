# Email Confirmation Setup Guide

## Overview

The app now sends automatic email confirmations when:
1. **Someone registers** → Sends registration confirmation with payment instructions
2. **Admin marks payment as paid** → Sends payment confirmation

## Setup (5 minutes)

### Step 1: Sign Up for Resend

1. Go to **https://resend.com**
2. Click **"Sign Up"** (free tier: 3,000 emails/month, 100 emails/day)
3. Verify your email

### Step 2: Get Your API Key

1. After logging in, go to **API Keys** in dashboard
2. Click **"Create API Key"**
3. Name it: `whiskey-club`
4. Copy the API key (starts with `re_`)

### Step 3: Verify Your Domain (Important!)

#### Option A: Use Resend's Test Domain (Quick Start)
- Resend provides `onboarding@resend.dev` for testing
- Emails will work but may go to spam
- **Good for testing only**

#### Option B: Verify Your Own Domain (Production)
1. Go to **Domains** in Resend dashboard
2. Click **"Add Domain"**
3. Enter your domain (e.g., `redheadwhiskey.com`)
4. Add the DNS records Resend provides to your domain
5. Wait for verification (usually 5-10 minutes)

### Step 4: Add Environment Variables

#### Local Development (.env.local)

Add these to your `.env.local` file:

```bash
# Resend API Key
RESEND_API_KEY=re_your_api_key_here

# Email "From" address
EMAIL_FROM=Redhead Whiskey <events@redheadwhiskey.com>
# Or use test domain:
# EMAIL_FROM=Redhead Whiskey <onboarding@resend.dev>
```

#### Vercel Production

1. Go to **Vercel Dashboard** → Your Project
2. Go to **Settings** → **Environment Variables**
3. Add these variables:
   - `RESEND_API_KEY` = `re_your_api_key_here`
   - `EMAIL_FROM` = `Redhead Whiskey <events@yourdomain.com>`
4. Click **"Save"**
5. Redeploy your app

### Step 5: Test It!

1. Go to your site
2. Register for an event
3. Check your email inbox
4. You should receive a beautifully formatted confirmation email! ✅

## Email Templates

### Registration Confirmation Email

Sent immediately after registration includes:
- ✅ Event details (title, date, time)
- ✅ Number of tickets
- ✅ Total amount
- ✅ Zelle payment instructions
- ✅ Payment memo/note with registration ID
- ✅ Beautiful branded HTML design

### Payment Confirmation Email

Sent when admin marks payment as "Paid":
- ✅ Payment confirmed message
- ✅ Event details reminder
- ✅ "See you there" message

## Customization

### Change Email Design

Edit `/lib/email.ts`:
- Update HTML templates
- Change colors (currently using #C6A667 for Redhead Whiskey gold)
- Add your logo
- Modify text

### Change Sender Name

Update `EMAIL_FROM` environment variable:
```bash
EMAIL_FROM=Your Name <your-email@yourdomain.com>
```

## Troubleshooting

### Emails Not Sending

1. **Check API Key**
   - Make sure `RESEND_API_KEY` is set in environment variables
   - Key starts with `re_`

2. **Check Terminal Logs**
   ```
   Sending registration confirmation email to: user@example.com
   Registration email sent successfully: abc123
   ```

3. **Check Resend Dashboard**
   - Go to **Logs** to see sent emails
   - Check for errors

### Emails Going to Spam

- Verify your own domain (don't use test domain)
- Add SPF, DKIM records properly
- Warm up your domain by sending gradually

### Rate Limits

Free tier limits:
- **100 emails/day**
- **3,000 emails/month**

For more, upgrade to paid plan ($20/month for 50k emails).

## What Happens If Email Fails?

- Registration still succeeds ✅
- Error is logged but user can still complete registration
- Admin should manually follow up
- Check terminal logs for email errors

## Production Checklist

- [ ] Resend account created
- [ ] API key generated
- [ ] Domain verified (or using test domain for now)
- [ ] Environment variables set in Vercel
- [ ] Test email sent successfully
- [ ] Emails arriving in inbox (not spam)
- [ ] Payment confirmation tested

## Free Tier Limits

Resend free tier:
- ✅ 3,000 emails/month
- ✅ 100 emails/day  
- ✅ All features included
- ✅ Email analytics
- ✅ Email logs

Perfect for getting started!

## Support

- **Resend Docs**: https://resend.com/docs
- **Resend Support**: support@resend.com
- **Rate Limit Issues**: Upgrade plan or space out events

Enjoy your automatic email confirmations! 📧✨

