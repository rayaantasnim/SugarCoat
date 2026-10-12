<div align="center">

# SugarCoat AI 🍬
### *"Reality is harsh. SugarCoat makes it sweet."*

<p align="center">
  <a href="https://ai.google.dev">
    <img src="https://img.shields.io/badge/Powered%20by-Gemini%20Flash-8B5CF6?style=for-the-badge&logo=google&logoColor=white" alt="Powered by Gemini"/>
  </a>
  <a href="https://developer.mozilla.org">
    <img src="https://img.shields.io/badge/Architecture-Serverless%20Client--Side-EC4899?style=for-the-badge&logo=html5&logoColor=white" alt="Architecture"/>
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img src="https://img.shields.io/badge/License-MIT-06B6D4?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="License"/>
  </a>
</p>

</div>

---

<img src="https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=1600" width="100%" style="border-radius:12px;" alt="Cyberpunk Neon Aesthetic Banner">

---

## 🌟 1. Project Manifesto & Aesthetic Identity

**SugarCoat** is an ultra-premium, dark-themed, sarcastic AI-powered companion web application designed as an **"Ego Sanctuary."** Built entirely for the browser without requiring a heavy backend server, it takes everyday awkward blunders, failures, or confessions typed by the user and re-writes them into massive, hilariously over-the-top, sovereign-grade milestones.

### Design Tokens & Color Palette
* **Base Canvas:** Deep slate matte background (`#0F172A`) shifting dynamically into fixed midnight purple/neon-pink space meshes (`linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #2D122D 100%)`).
* **Typography:** Pure modern Grotesque font family with high-contrast font weights.
* **Glow Auras:** Interactive elements emit a vibrant candy neon pink glow aura (`#EC4899`) via frosted glassmorphic card boundaries (`backdrop-filter: blur(12px)`).
* **Alert & Emergency Accents:** Deep crimson neon borders (`#EF4444`) reserved for system guardrail triggers.

---

## 🏛️ 2. The 7-Page Architecture Blueprint

The application is engineered as a fully responsive, mobile-first ecosystem (90% fluid boundary lock) functioning via static `.html` file routing.

<details>
<summary><b>📂 Expand to Explore the Complete 7-Page Layout Structure</b></summary>

### 1. Home (`index.html`)
* **Hero Section:** High-impact Pexels heroic layout banner featuring dynamic glowing typography.
* **Live Wall of Shame:** An infinite horizontal scrolling ticker feed broadcasting community confessions.
* **Metric Tracker Grid:** A 3-column live fake metric tracker displaying global sugar-coated statistics.
* **Split Comparison Module:** Side-by-side visual comparison showing *Harsh Reality 📉* vs. *SugarCoated Truth 👑*.
* **Ego Overload Meter:** Interactive electronic pulsing gauge simulation tracking user ego levels.
* **Mini-Chatbox Input:** Quick-fire text input routing cache cleanly into the main bot view.

### 2. ChatBOT (`chatbot.html`)
* **Primary Interaction Engine:** Dual-state UI canvas that smoothly transitions the central chatbox down to a sticky-bottom element upon prompt execution.
* **Conversational Interface:** Glassmorphic multi-turn conversational window.
* **Token Counter:** Floating live counter panel (`__/10 Free Tokens`).

### 3. Why SugarCoat? (`why.html`)
* **Philosophical Deep-Dive:** Comprehensive breakdown of core development pillars.
* **Biochemical Logic:** Explains the mock cortisol-overwriting logic of sweet lies.
* **Data Flow Architecture:** Client-side local data storage and privacy documentation.
* **Gamified Ranks:** Official progression framework detailing our 5 distinct user ranks.

### 4. Hall of Fame (`history.html`)
* **Chronological Archive:** Time-stamped dropdown rows holding historical user logs.
* **Performance Analytics:** Live neon performance trend line chart built using Chart.js.
* **Behavioral Insights:** Dynamic analytical insights derived from user confession patterns.
* **Quick Actions:** Top-right floating CTA button `[ Start Fresh 🍬 ]`.

### 5. Legendary Profile (`profile.html`)
* **Identification Module:** Custom profile management interface.
* **File Uplink:** Hidden file input utilizing pure browser `FileReader()` to serialize user images into Base64 Data URL strings stored in state.
* **Title Registry:** Custom input fields for user titles and monikers.
* **Backup Tool:** Local client data Export/Import utility formatting files cleanly as `sugarcoat_backup.json`.

### 6. Rules & Regulations (`rules.html`)
* **Structural Boundaries:** Bounded inside dark-red accent neon sheets (`border: 2px solid #EF4444`).
* **AI Operations:** Transparency report on generative processing limits.
* **Token Exceptions:** Guidelines detailing why small-talk greetings consume 0 tokens.
* **Safety Protocols:** Explicit behavioral boundaries and emergency stop conditions.

### 7. The FAQ Station (`faq.html`)
* **Interactive Accordion:** Over 50+ sarcastic, pre-written questions and answers inside a customized JavaScript exclusive single-open accordion engine.
* **Viewport Tracking:** Automated screen-centering viewport tracking.
* **Celebratory Effects:** Full-screen Confetti Blasts 🎉 powered by the `canvas-confetti` library.

</details>

---

<img src="https://images.pexels.com/photos/7130498/pexels-photo-7130498.jpeg?auto=compress&cs=tinysrgb&w=1600" width="100%" style="border-radius:12px;" alt="Cyberpunk Glassmorphism UI">

---

## ⚙️ 3. Core Algorithmic Engines & Rules

<details>
<summary><b>🧠 Expand to Review Underlying Client-Side Logic & SDK Integrations</b></summary>

### The Smart Quota Filter
* Enforces a strict `localStorage` token lock capped at **10 requests per day**.
* Basic greetings or identity queries (e.g., *"Hello"*, *"What can you do?"*, *"Bye"*) are intercepted by a client-side keyword array.
* The bot responds with hyper-sarcastic welcomes while completely freezing the daily counter badge, consuming **0 tokens**.
* Quota is decremented by exactly `1` point only when genuine actions or blunders are submitted.

### The GenAI Context SDK Loop
* Operates strictly via the official `@google/generative-ai` SDK loaded via jsDelivr CDN.
* Rejects disconnected singular prompt queries and instead initializes native Gemini `startChat()` multi-turn conversational session mode, ensuring responses build dynamically on previous contexts in real-time.

### The Context Visual Canvas & Audio Sync
* Valid actions trigger background model calls that return a single dominant theme keyword.
* The frontend pushes this token to the Pexels API to pull a cinematic moving/video-type background picture using a **1.5-second crossfade transition**.
* Text outputs are printed character-by-character paired with an audio array ticking through a randomized pool of mechanical keyboard key-press sounds (`Tick-Tick`), culminating in a loud retro victory chime the millisecond the 5-6 line block fully renders.

### The Severe Safety Red-Lines Guardrail
* If an input confession matches severe real-world harms (Murder, Assault, Theft, Self-Harm), the backend script triggers an emergency visual reset back to the default linear gradient view, locks the token counter, cancels typing delays, and prints an immediate, rigid **Action Blocked** response.

</details>

---

## 📊 4. Client-Side Data Schemas (`localStorage`)

To maintain a completely serverless architecture, all user logs, session states, and profile backups persist entirely within browser storage. Below are the structural JSON schemas used across the application.

### Session History Schema (`sugarcoat_history.json`)
```json
{
  "version": "1.0.0",
  "lastSynced": "2026-10-11T23:48:00Z",
  "userProfile": {
    "username": "SovereignLegend",
    "userTitle": "Grand Architect of Excuses",
    "avatarBase64": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
    "dailyTokensRemaining": 7
  },
  "confessionLogs": [
    {
      "id": "sc_log_99281",
      "timestamp": "2026-10-11T22:15:30Z",
      "harshReality": "I accidentally replied 'Love you too' to my boss's automated status update.",
      "sugarCoatedTruth": "You have successfully established absolute psychological dominance over corporate hierarchy, bending robotic protocols into emotional submission.",
      "themeKeyword": "neon cyberpunk corporate",
      "tokensConsumed": 1
    }
  ]
}