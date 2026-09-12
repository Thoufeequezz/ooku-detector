# 💀 OOKU DETECTOR

### Chat normally. AI will judge you.

**OOKU DETECTOR** is a real-time multiplayer chat application that uses AI to detect playful roasting, sarcasm, and counter-roasting in Malayalam, Manglish, and English — then turns every roast into a live comedy event.

> **No login. No profiles. No complicated setup. Just enter a room, chat with your friends, and let AI judge the damage. 💀**

---

## 🎯 What is Ooku?

In Kerala college culture, **"Ooku"** is playful teasing, roasting, or making fun of your friends.

The problem?

A normal chat app doesn't know when a message is just a normal conversation and when someone has absolutely destroyed their friend. 😂

**OOKU DETECTOR does.**

It watches the conversation, understands the context, detects Ooku using AI, calculates the damage, and broadcasts the reaction to everyone in the room.

---

# 🔥 How It Works

```text
┌──────────────────────┐
│     CREATE ROOM      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     SHARE CODE       │
│       KMEA482        │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────┐
│       MULTIPLAYER CHAT       │
│                              │
│  Adil      Suhail   Thoufeek │
└──────────────┬───────────────┘
               │
               ▼
       ┌───────────────┐
       │   GEMINI AI   │
       │ OOKU DETECTOR │
       └───────┬───────┘
               │
        ┌──────┴──────┐
        ▼             ▼
     NORMAL         OOKU 💀
                      │
                      ▼
              ┌──────────────┐
              │ DAMAGE SCORE │
              └──────┬───────┘
                     │
            ┌────────┴────────┐
            ▼                 ▼
       💥 ANIMATION       🏆 LEADERBOARD
            │
            ▼
       🔊 OOKU AUDIO
```

---

# ✨ Key Features

### 💬 Real-Time Multiplayer

Create a room and share the room code with your friends.

Everyone inside the same room sees:

- Every message
- New participants
- Ooku detections
- Damage
- Combos
- Leaderboard changes
- Audio reactions

Powered by **Supabase Realtime**.

---

### 🤖 AI-Powered Ooku Detection

The AI classifies messages into:

```text
NORMAL
OOKU
COUNTER_OOKU
```

It considers:

- Conversation context
- Malayalam
- Manglish
- English
- Slang
- Sarcasm
- Teasing
- Roasting
- Counter-roasting
- Intensity

It does **not** simply detect bad words.

For example:

```text
"eda evideya?"

→ NORMAL
```

But:

```text
"ninte coding kandittu calculator polum resign cheyyum 💀"

→ OOKU
```

And:

```text
"nee thanne alle innale fail aayath 😂"

→ COUNTER_OOKU
```

---

# 🧠 Context-Aware Detection

One of the important design decisions is that **not every insult is Ooku**.

The system uses the surrounding conversation to understand intent.

### Example

```text
Adil:
Njan innu exam pass aakum 😎

Thoufeek:
Nee padichittundo?

Adil:
Youtube kandirunnu 😂

Thoufeek:
Aah best preparation aanu 💀
```

The final message is understood in context as playful sarcasm.

---

# 💀 Ooku Damage System

Every detected Ooku receives an AI-generated intensity score from **1–10**.

| Intensity | Damage | Reaction |
|---|---:|---|
| 1–3 | +10 | 😏 LIGHT OOKU |
| 4–6 | +25 | 🔥 DIRECT HIT |
| 7–8 | +50 | 💀 HEAVY OOKU |
| 9–10 | +100 | ☠️ CRITICAL OOKU |

Counter attacks can receive a bonus.

```text
🔥 COUNTER ATTACK

+15 BONUS DAMAGE
```

---

# 🔥 Combo System

Repeated successful Ooku attacks create combos.

```text
🔥 OOKU COMBO x2

🔥 OOKU COMBO x3

🔥 OOKU COMBO x5

🔥🔥🔥 OOKU COMBO x10
```

High combos trigger additional visual effects.

```text
💀 FRIENDSHIP CRITICAL
```

---

# 🏆 Live Ooku Leaderboard

The room has a live leaderboard showing who is doing the most damage.

```text
💀 LIVE OOKU LEADERBOARD

🥇 Adil        450 DMG   🔥 x5
🥈 Thoufeek    325 DMG   💀 x3
🥉 Suhail      180 DMG   😂 x2
4️⃣ Farhan       75 DMG   😏 x1
```

The leaderboard updates instantly whenever an Ooku event occurs.

Rank changes can trigger animations and celebration effects.

---

# 🔊 Gemini Voice

OOKU DETECTOR can read chat messages aloud using **Gemini Text-to-Speech**.

### Important:

Gemini reads **only the original message**.

It does not add:

- Names
- Commentary
- Reactions
- Explanations
- Translations

Example:

```text
User message:

"eda nee evideya"
```

Gemini voice reads the same message.

If the message is detected as Ooku, the Ooku reaction is handled separately.

```text
MESSAGE
   ↓
GEMINI TTS
   ↓
ORIGINAL MESSAGE AUDIO
   ↓
OOKU DETECTION
   ↓
IF OOKU → REACTION AUDIO
```

---

# 🔊 Ooku Reaction Audio

Detected Ooku events can trigger separate comedy audio effects.

Different intensity levels can have different sounds:

```text
LIGHT
😏 light reaction

MEDIUM
🔥 direct hit

HEAVY
💀 heavy damage

CRITICAL
☠️ critical reaction

COUNTER
🔥 counter attack
```

Each client can play the reaction locally while only the Ooku event itself is synchronized through Supabase.

---

# 😂 Comedy-First UI

The interface is designed to feel more like a **game + meme culture + chat app** than a traditional SaaS product.

### Visual Style

```text
Background     #080812
Surface        #11111F
Secondary      #19192B

Purple        #8B5CF6
Pink          #EC4899
Cyan          #22D3EE

Damage        #FF3B5C
Online        #22C55E

Text          #F8FAFC
Muted         #94A3B8
```

---

# 💥 Real-Time Animations

Normal messages appear smoothly.

Ooku events are much more dramatic.

### Normal Message

```text
Fade
  ↓
Slide
  ↓
Appear
```

### Ooku

```text
Message Shake
      ↓
Impact Flash
      ↓
Scale Animation
      ↓
💀 😂 🔥 💥 Floating Emojis
      ↓
+50 DAMAGE
      ↓
Leaderboard Update
```

High-intensity Ooku can trigger a larger screen reaction.

```text
💀💥 OOKU DETECTED 💥💀

CRITICAL OOKU

+100 DAMAGE

☠️ FRIENDSHIP CRITICAL
```

---

# 👀 Funny Typing Indicators

Instead of the boring:

> "Adil is typing..."

OOKU DETECTOR can randomly display:

```text
Adil is cooking... 👀

Adil is loading a comeback...

Adil is choosing violence...

Adil is typing something he'll regret...

Adil has entered attack mode...

Adil is thinking... dangerous.
```

---

# 🤨 AI Referee

Small random system messages make the room feel alive.

```text
👀 AI referee is watching...

📝 Interesting choice of words.

🤨 We need to investigate this friendship.

🔥 Things are escalating.

💀 Nobody asked for that.
```

---

# 📊 End-of-Chat Report

When the room creator ends the session, the application generates a comedy report.

Possible awards:

```text
👑 OOKU KING

💀 MOST ROASTED

🔥 BIGGEST HIT

😂 COMEBACK KING

☠️ FRIENDSHIP DESTROYER
```

### Friendship Diagnosis

```text
YOUR FRIENDSHIP DIAGNOSIS

💀 SEVERE OOKU SYNDROME

You insult each other constantly,
counter-attack immediately,
and somehow still call each other friends.

100% fictional diagnosis.
We are not doctors. 😂
```

---

# 🏗️ Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React |
| Build Tool | Vite |
| Styling | CSS |
| Animation | Framer Motion / CSS |
| Backend | Supabase |
| Database | PostgreSQL |
| Realtime | Supabase Realtime |
| Server Functions | Supabase Edge Functions |
| AI | Google Gemini |
| TTS | Gemini TTS |
| Deployment | Vercel |
| Mobile | Responsive Web / PWA |

---

# 🗄️ Database Architecture

## `rooms`

Stores chat rooms.

```text
id
room_code
created_by_participant
created_at
is_active
ended_at
```

## `room_members`

Tracks temporary participants.

```text
id
room_id
participant_id
name
joined_at
last_seen_at
is_active
```

## `messages`

Stores chat messages.

```text
id
room_id
participant_id
sender_name
message
created_at
```

## `ooku_events`

Stores AI detection results.

```text
id
room_id
message_id
participant_id
sender_name
target_name
type
intensity
confidence
damage
created_at
```

---

# 🔐 Security Architecture

Gemini API credentials should never be exposed in the browser.

The architecture is:

```text
                 FRONTEND
                    │
                    ▼
             SUPABASE EDGE
                FUNCTION
                    │
                    ▼
              GEMINI API
```

The frontend only receives the required result.

### Never commit:

```text
GEMINI_API_KEY
```

to GitHub.

---

# 📁 Project Structure

```text
ooku-detector/
│
├── public/
│   ├── sounds/
│   │   └── ooku/
│   │       ├── light-1.mp3
│   │       ├── medium-1.mp3
│   │       ├── heavy-1.mp3
│   │       └── critical-1.mp3
│   │
│   └── icons/
│
├── src/
│   ├── components/
│   │   ├── ChatRoom.jsx
│   │   ├── MessageBubble.jsx
│   │   ├── OokuOverlay.jsx
│   │   ├── Leaderboard.jsx
│   │   └── RoomAudioControl.jsx
│   │
│   ├── data/
│   │   └── ookuDataset.js
│   │
│   ├── services/
│   │   ├── geminiTTS.js
│   │   ├── ookuAudio.js
│   │   └── ookuClassifier.js
│   │
│   ├── utils/
│   │   └── ookuFallback.js
│   │
│   ├── pages/
│   ├── App.jsx
│   └── main.jsx
│
├── supabase/
│   └── functions/
│       └── gemini-tts/
│
├── package.json
└── README.md
```

---

# 🚀 Installation

## Clone the repository

```bash
git clone https://github.com/Thoufeeqquezz/ooku-detector.git
```

```bash
cd ooku-detector
```

## Install dependencies

```bash
npm install
```

---

# ⚙️ Environment Variables

Create a `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Keep server-side Gemini credentials inside your Supabase Edge Function environment.

---

# ▶️ Run Locally

```bash
npm run dev
```

Open the Vite development URL shown in the terminal.

---

# 🏗️ Production Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# 🌐 Deployment

The frontend can be deployed using **Vercel**.

Basic deployment flow:

```text
GitHub
   ↓
Vercel
   ↓
npm run build
   ↓
dist/
   ↓
LIVE WEB APP
```

Supabase handles the backend, database, realtime messaging and Edge Functions.

---

# 📱 Mobile Support

OOKU DETECTOR is designed with a mobile-first interface.

The application supports:

- Responsive layouts
- Large touch targets
- Mobile keyboard handling
- Fixed chat composer
- Safe-area spacing
- No horizontal scrolling
- PWA installation
- Android home-screen usage

Example:

```text
Phone
  ↓
Open Ooku Detector
  ↓
Add to Home Screen
  ↓
💀 OOKU DETECTOR
```

---

# 🧪 Multiplayer Testing

Open the application in multiple browsers/devices.

Example:

```text
DEVICE 1
Thoufeek
Room: KMEA482

DEVICE 2
Adil
Room: KMEA482

DEVICE 3
Suhail
Room: KMEA482

DEVICE 4
Farhan
Room: KMEA482
```

Test:

- [ ] All users receive messages
- [ ] Names are displayed correctly
- [ ] Messages stay ordered
- [ ] New members appear
- [ ] Ooku detection appears for everyone
- [ ] Damage updates correctly
- [ ] Leaderboard updates in real time
- [ ] Gemini voice plays correctly
- [ ] Ooku reaction audio plays correctly
- [ ] Duplicate events are prevented
- [ ] Room isolation works correctly
- [ ] Mobile layout works correctly

---

# 🧠 Ooku Dataset

The project includes a curated Ooku dataset used as examples for AI classification.

Categories include:

```text
NORMAL
GENERAL_ROAST
APPEARANCE
CODING
COLLEGE
ATTENDANCE
STUDIES
FOOD
FRIENDSHIP
MONEY
GAMING
SPORTS
SLEEP
LATE_REPLY
COUNTER_ROAST
SARCASM
```

The dataset contains examples in:

- Malayalam
- Manglish
- English
- College slang
- Casual friend-group language
- Short messages
- Long messages
- Sarcastic messages
- Emoji-heavy messages

Relevant examples can be provided to Gemini as few-shot context instead of sending the entire dataset for every message.

---

# 🛡️ Responsible AI

OOKU DETECTOR is designed for **playful friend-group interaction**, not harassment.

The classifier should avoid triggering comedy reactions for:

- Serious threats
- Hate speech
- Targeted harassment
- Dangerous content
- Non-comedic abuse

The goal is:

> **Be funny, not harmful.**

---

# 🎯 Why We Built It

Chat applications are everywhere.

AI assistants are everywhere.

Leaderboards are everywhere.

So we asked:

### What happens when AI becomes the referee of your friend group?

The result is completely unnecessary.

And that's exactly why it's fun.

---

# 💡 The Technical Challenge

The interesting part isn't simply detecting an insult.

The real challenge is understanding:

> **"Was that actually Ooku?"**

That requires understanding:

**Language + Context + Culture + Intent + Timing**

Especially when the conversation mixes:

```text
Malayalam
+
Manglish
+
English
+
Slang
+
Sarcasm
+
Emojis
+
Friendship
```

That's what makes the project interesting beyond a simple keyword detector.

---

# 🏆 What Makes OOKU DETECTOR Different?

### Traditional Chat

```text
Message
   ↓
Message appears
```

### OOKU DETECTOR

```text
Message
   ↓
Real-time delivery
   ↓
Context analysis
   ↓
AI classification
   ↓
Intensity scoring
   ↓
Damage calculation
   ↓
Combo detection
   ↓
Animation
   ↓
Audio reaction
   ↓
Leaderboard update
```

One message becomes an **interactive event**.

---

# 🛣️ Future Possibilities

Possible future versions could include:

- Better Malayalam/Manglish understanding
- More advanced contextual classification
- Custom Ooku reaction packs
- Custom room themes
- Team-vs-team Ooku battles
- Tournament mode
- Ooku replay
- Session highlights
- More awards
- More audio packs
- Community-created reaction packs

The MVP intentionally stays focused on the core experience.

---

# ⚠️ Disclaimer

OOKU DETECTOR is an entertainment project.

All:

- Scores
- Rankings
- Damage
- Diagnoses
- Awards
- Ooku classifications

are intended for fun.

The "friendship diagnosis" is completely fictional.

**We are not doctors. 😂**

---

# 👨‍💻 Creator

## Thoufeek & Abhijith 

Computer Science & Engineering

Built as an experimental project exploring:

**AI × Real-Time Systems × Voice × Gamification × Social Interaction**

---

# 💀 The Entire Product in One Line

> **A multiplayer chat where AI watches your friends roast each other and turns every successful Ooku into a live game event.**

---

# 🔥 OOKU DETECTOR

### Chat normally.

### AI will judge you.

## 💀
