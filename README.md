# Sovranly IP

Sovereign Intellectual Property Registry, Automated Royalty Distribution, and Zero-Trust Creator Control Center.

---

## 🌌 Core Vision & Project Identity

**Sovranly IP** is a revolutionary decentralized marketplace and management system designed to empower artists, musicians, writers, and software developers. By putting creators in complete control of their intellectual property (IP), the platform eliminates middle-tier exploitation through direct blockchain-backed licensing, automated real-time royalty distribution, and an unwavering **Zero Trust Architecture**.

Every session, metadata access, and transaction is continuously validated, ensuring complete privacy, authenticity, and immutable proof of ownership for creators worldwide.

---

## 🛠️ Key Capabilities & Features

### 1. Decoupled Tokenization & Registry
* **IP Metadata Tokenization**: Digital creations are registered with immutable properties (licensing schemas, ownership parameters, IPFS storage hashes).
* **Multi-Format Support**: Dedicated workflows for rich datasets, high-resolution artwork, audio tracks, and technical code repositories.

### 2. Intelligent Licensing Agreement Builder
* **Algorithmic Agreements**: Dynamic creation of contracts between creators and licensees.
* **Automated Royalties**: Built-in royalty logic specifying direct payment cuts and terms.
* **State Management**: Lifecycle states including active, terminated, or pending validation.

### 3. High-Fidelity Onboarding Voice Agent
* **Gemini-Powered Navigation**: Real-time voice-interactive chatbot built server-side on top of Google Gemini models.
* **Onboarding Guidance**: Guides creators through complex tokenization concepts, legal licensing frameworks, and wallet setups.

### 4. Zero-Trust Security & API Ecosystem
* **Token Verification Gate**: Authenticated with Firebase Auth. API routes perform secure token verification to block unauthorized calls.
* **Cryptographic Developer Console**: Provides a platform for developers to generate and rotate secure API keys (patterned: `sv_api_...`) to access platform endpoints programmatically.

---

## 💻 Tech Stack

* **Front-End Framework**: Next.js 15+ (App Router), TypeScript, Tailwind CSS
* **Animation & UI components**: `motion/react` (Framer Motion), shadcn/ui
* **Database & Auth**: Google Firebase (Firestore DB & Firebase Authentication)
* **API Integration**: `@google/genai` TypeScript SDK (Server-Side)
* **Build System**: Next.js production compiler with full Turbopack & ESM compatibility

---

## 🔒 Security Architecture (Zero-Trust)

To guarantee the integrity of high-value IP documents and transaction logs, **Sovranly IP** enforces a strict **Zero-Trust Security Model**:

1. **Continuous Verification**: There are no implicit trusted zones. Every single client call to `/api/*` requires an `Authorization: Bearer <ID_TOKEN>` header.
2. **Server-Side API Proxying**: No API keys (such as `GEMINI_API_KEY`) are ever exposed to the client. All generative AI or external requests are securely routed server-side.
3. **Firestore Security Locks**: Granular access controls are enforced at the database level (`firestore.rules`). Public reads and writes are strictly rejected; only authenticated requests matching user-owned records are authorized.

---

## ⚙️ Project Structure

```bash
├── app/                  # Next.js App Router (Pages, layouts, API routes)
│   ├── api/              # Secure Server-Side Proxies (chat, assets, developer, etc.)
│   ├── dashboard/        # Sovereign Creator Control Center
│   ├── onboarding/       # Interactive AI Voice Agent Portal
│   ├── wiki/             # Creative IP Manifesto & Platform documentation
│   ├── error.tsx         # Root error boundary for handling system faults
│   ├── globals.css       # Clean Tailwind CSS import configuration
│   └── layout.tsx        # Global theme template (Implicit dark mode)
├── components/           # Reusable UI widgets & functional sections
├── lib/                  # Utilities, Firebase wrappers, and Auth helper clients
├── firestore.rules       # Secure Firebase Firestore rules database policy
└── package.json          # Main scripts & dependencies manifest
```

---

## 🚀 Setup & Onboarding Guide

Follow these steps to run **Sovranly IP** locally, deploy to production, or audit its configurations.

### 1. Prerequisites
Ensure you have the following installed on your local workstation:
* **Node.js** (v18.0.0 or higher recommended)
* **npm** or **yarn**
* A Google Cloud or Firebase project with **Firestore Database** and **Authentication** enabled.

### 2. Environment Setup
Create a `.env` file in your root directory based on the `.env.example` file:

```env
# Google Gemini API key (Required for AI Voice Onboarding / Chat)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Public Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
```

Rename `firebase-applet-config.example.json` to `firebase-applet-config.json` and configure it with your project credentials:

```json
{
  "projectId": "your-firebase-project-id"
}
```

### 3. Installation
Install all base dependencies and dev dependencies:
```bash
npm install
```

### 4. Running the Development Server
Launch the Next.js local server on port `3000`:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to experience the platform.

### 5. Running the Linter
Ensure that code changes are fully compliant with syntax, TypeScript definitions, and modern React hooks guidelines:
```bash
npm run lint
```

### 6. Production Build
Prepare an optimized production bundle:
```bash
npm run build
```

To run the production-built application:
```bash
npm start
```

---

## 🗃️ Firebase Firestore Security Rules

To ensure active data safety, make sure the rules are deployed to your Firebase dashboard before sharing the workspace:

```bash
# Deploys rules defined in firestore.rules using Firebase CLI
firebase deploy --only firestore:rules
```

**Rule Summary**:
* All `assets`, `agreements`, `transactions`, and `messages` require active, authenticated credentials (`isSignedIn()`).
* Document writes are validated against structural helper schemas defined inside the Firestore rules file to prevent malicious data injections.

---

## 🛠️ Sandbox Developer Mode (Fallback Mode)

For internal development, sandbox preview environments, or testing when a live Firebase service is unavailable:
* The application will gracefully fallback to **Sandbox Preview Mode** using a standard local development JWT token (`sandbox-token-123`).
* This enables rapid front-end visual iteration without degrading security verification logic.

---

## 📄 License & Ownership

© 2026 Sovranly IP. All Rights Reserved. Built securely for the sovereign creator economy.
