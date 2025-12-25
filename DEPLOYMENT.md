# Vercel Deployment Guide

This guide documents how to deploy the Fire Homes Next.js application to Vercel with Firebase integration.

---

## Quick Reference

### Prerequisites Checklist
- [ ] Vercel account (free tier works)
- [ ] GitHub repository with your code
- [ ] Firebase project configured
- [ ] `.env.local` file with all environment variables

### Environment Variables Required
```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
ADMIN_EMAIL
```

### Deployment Steps (Summary)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add all environment variables
4. Click Deploy
5. Add Vercel domain to Firebase authorized domains

### Post-Deployment Checklist
- [ ] Verify deployment URL works
- [ ] Test authentication (login/signup)
- [ ] Verify Firebase connection
- [ ] Check admin functionality

---

## Detailed Guide

### Prerequisites

Before deploying, ensure you have:

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (GitHub OAuth recommended)
2. **GitHub Repository**: Your code pushed to GitHub
3. **Firebase Project**: A configured Firebase project with:
   - Authentication enabled (Email/Password provider)
   - Firestore Database set up
   - Service account credentials generated

### Step 1: Import Project to Vercel

1. Navigate to [vercel.com/new](https://vercel.com/new)
2. Under "Import Git Repository", you'll see your GitHub account
3. Find and select your repository (e.g., `firebase-nextjs-course`)
4. Click **Import**

Vercel will automatically detect that it's a Next.js project.

### Step 2: Configure Environment Variables

Before deploying, expand the **Environment Variables** section and add each variable:

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key | `AIzaSy...` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain | `your-project.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project ID | `your-project-id` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket URL | `your-project.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID | `123456789` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app ID | `1:123456789:web:abc123` |
| `FIREBASE_PROJECT_ID` | Project ID (server-side) | `your-project-id` |
| `FIREBASE_CLIENT_EMAIL` | Service account email | `firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com` |
| `FIREBASE_PRIVATE_KEY` | Service account private key | See note below |
| `ADMIN_EMAIL` | Admin user email | `admin@example.com` |

#### Important: FIREBASE_PRIVATE_KEY Format

The private key must include the full key with headers:

```
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASC...
...your key content...
-----END PRIVATE KEY-----
```

**Tips:**
- Copy the entire key from your service account JSON file
- Include the `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----` markers
- Vercel handles the newlines automatically

### Step 3: Deploy

1. After adding all environment variables, click the **Deploy** button
2. Wait for the build to complete (typically 1-3 minutes)
3. Once complete, you'll see your deployment URL (e.g., `your-project.vercel.app`)

### Step 4: Configure Firebase Authorized Domains

For Firebase Authentication to work on your Vercel domain, you must add it to the authorized domains list:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to **Authentication** → **Settings** tab
4. Scroll to **Authorized domains**
5. Click **Add domain**
6. Enter your Vercel domain: `your-project.vercel.app`
7. Click **Add**

Your domain should now appear in the list as a "Custom" domain.

---

## Troubleshooting

### Authentication Not Working

**Symptom:** Users can't log in or sign up on the deployed site.

**Solution:** Ensure your Vercel domain is added to Firebase's authorized domains (Step 4).

### Environment Variable Errors

**Symptom:** Build fails or app crashes with missing environment variable errors.

**Solutions:**
- Verify all 10 environment variables are set in Vercel
- Check for typos in variable names
- Ensure values don't have extra quotes or spaces

### FIREBASE_PRIVATE_KEY Issues

**Symptom:** Server-side Firebase Admin SDK errors.

**Solutions:**
- Ensure the key includes BEGIN/END markers
- Don't wrap the key in additional quotes
- If copying from JSON, the key should have `\n` characters which Vercel converts to actual newlines

### Build Failures

**Symptom:** Deployment fails during build.

**Solutions:**
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Test build locally with `npm run build`

---

## Additional Notes

### Automatic Deployments

Once connected, Vercel automatically deploys:
- **Production**: Every push to `main` branch
- **Preview**: Every push to other branches / pull requests

### Custom Domains

To add a custom domain:
1. Go to your project in Vercel dashboard
2. Click **Domains**
3. Add your domain and follow DNS configuration instructions
4. Remember to add the custom domain to Firebase authorized domains too!

### Preview Deployments

Preview deployments use the same environment variables by default. If you need different values for previews:
1. Go to Project Settings → Environment Variables
2. You can set variables for specific environments (Production, Preview, Development)

### Redeploying

To redeploy with updated environment variables:
1. Go to your project in Vercel
2. Navigate to **Deployments**
3. Click the three dots on the latest deployment
4. Select **Redeploy**

---

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Firebase Console](https://console.firebase.google.com)
- [Firebase Auth Authorized Domains](https://firebase.google.com/docs/auth/web/redirect-best-practices)
