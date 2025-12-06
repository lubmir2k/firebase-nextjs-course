#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * Script to populate .env.local with Firebase service account credentials
 * Usage: node scripts/setup-firebase-env.cjs <path-to-service-account.json>
 */

const fs = require("fs");
const path = require("path");

const ENV_FILE = ".env.local";

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: node scripts/setup-firebase-env.js <path-to-service-account.json>");
    process.exit(1);
  }

  const jsonPath = args[0];

  if (!fs.existsSync(jsonPath)) {
    console.error(`Error: File not found: ${jsonPath}`);
    process.exit(1);
  }

  // Read service account JSON
  let serviceAccount;
  try {
    serviceAccount = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  } catch (err) {
    console.error(`Error: Failed to parse JSON file: ${err.message}`);
    process.exit(1);
  }

  // Validate required fields
  const requiredFields = ["project_id", "client_email", "private_key"];
  for (const field of requiredFields) {
    if (!serviceAccount[field]) {
      console.error(`Error: Missing required field "${field}" in service account JSON`);
      process.exit(1);
    }
  }

  const projectId = serviceAccount.project_id;
  const clientEmail = serviceAccount.client_email;
  // Keep \n as literal characters for .env file (code will parse them)
  const privateKey = serviceAccount.private_key;

  // Read existing .env.local or create template
  const envPath = path.join(process.cwd(), ENV_FILE);
  let envContent;

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf8");
  } else {
    envContent = `# Firebase Configuration
# Fill in your values from Firebase Console and Service Account JSON

# Client-side Firebase Config (get from Firebase Console -> Project Settings -> Your apps)
NEXT_PUBLIC_FIREBASE_API_KEY=""
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=""
NEXT_PUBLIC_FIREBASE_PROJECT_ID=""
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=""
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=""
NEXT_PUBLIC_FIREBASE_APP_ID=""

# Server-side Firebase Admin SDK (from service account JSON)
FIREBASE_PROJECT_ID=""
FIREBASE_CLIENT_EMAIL=""
FIREBASE_PRIVATE_KEY=""
`;
  }

  // Update environment variables
  const updates = {
    FIREBASE_PROJECT_ID: projectId,
    FIREBASE_CLIENT_EMAIL: clientEmail,
    FIREBASE_PRIVATE_KEY: privateKey,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: projectId,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: `${projectId}.firebaseapp.com`,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: `${projectId}.firebasestorage.app`,
  };

  for (const [key, value] of Object.entries(updates)) {
    const regex = new RegExp(`^${key}=.*$`, "m");
    const newLine = `${key}="${value}"`;

    if (regex.test(envContent)) {
      envContent = envContent.replace(regex, newLine);
    } else {
      envContent += `\n${newLine}`;
    }
  }

  // Write updated .env.local
  fs.writeFileSync(envPath, envContent);

  console.log(`✅ Updated ${ENV_FILE} with Firebase credentials`);
  console.log("");
  console.log("Populated:");
  console.log("  - FIREBASE_PROJECT_ID");
  console.log("  - FIREBASE_CLIENT_EMAIL");
  console.log("  - FIREBASE_PRIVATE_KEY");
  console.log("  - NEXT_PUBLIC_FIREBASE_PROJECT_ID");
  console.log("  - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN");
  console.log("  - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET");
  console.log("");
  console.log("⚠️  Still need from Firebase Console (Project Settings -> Your apps):");
  console.log("  - NEXT_PUBLIC_FIREBASE_API_KEY");
  console.log("  - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID");
  console.log("  - NEXT_PUBLIC_FIREBASE_APP_ID");
}

main();
