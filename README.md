# EcoBuddy

## 🌍 Overview
**EcoBuddy** is an eco-friendly recycling app designed to encourage Nigerians to sort and recycle waste in exchange for points, which can be converted into phone data. By leveraging AI, gamification, and community-driven initiatives, EcoBuddy promotes sustainability and waste management.

### **🌱 Problem Statement**
Nigeria faces poor recycling and sustainability efforts, leading to flooding, diseases, and environmental degradation. EcoBuddy aims to tackle this by providing an engaging and rewarding platform for users to participate in recycling.

### **🎯 Goals (Aligned with UN SDGs)**
EcoBuddy supports:
- **SDG 6**: Clean Water and Sanitation
- **SDG 11**: Sustainable Cities and Communities
- **SDG 13**: Climate Action

---

## 🏆 Team M.E.C.A
| **Member** | **Role** |
|------------|---------------------------|
| **Ewa** | Chief Technology Officer (CTO) & Lead UI/UX Designer (Oversees app development, coding, and user interface design.)|
| **Aderoju** | Chief Marketing Officer (CMO) (Leads market research, user engagement strategies, and promotional campaigns.)|
| **Mosope** | Chief Financial Officer (CFO) (Handles financial planning, revenue models, and investor relations.)|
| **Chidinma** | Chief Creative Officer (CCO) & Presentation Lead (Manages branding, app design direction, documentation, and team presentations.)|
| **Mr. Adeniyi** | Team Mentor/Coordinator |

---

## 🔥 Features

### **1️⃣ Recycling Locator**
- Built-in GPS helps users locate the nearest recycling centers.
- Facilitates home and community cleanup efforts.
- Encourages easier and more accessible waste disposal.

### **2️⃣ Item Recognition**
- AI-powered scanner detects whether an item is recyclable.
- Provides storage and disposal guidance via text and video.
- Ideal for individuals and students working on recycling projects.

### **3️⃣ Gamification & Leaderboard**
- Users earn points for correctly sorting and dropping off waste.
- Compete on a leaderboard to showcase sustainability efforts.
- Points can be converted into phone data and cash rewards.

### **4️⃣ AI-driven Newsletter & Blog**
- Keeps users updated on recycling laws, trends, and best practices.
- AI curates relevant articles, tips, and industry updates.
- Helps users stay informed on environmental issues.

### **5️⃣ Social Sharing & Collaboration**
- Users can share milestones, achievements, and recycling tips.
- Community-driven discussions and support.
- Encourages a sense of collective environmental responsibility.

### **6️⃣ Recycling Market**
- Platform for artisans and professionals to donate, trade, or sell recyclables.
- Encourages upcycling and repurposing waste.
- Connects users to a circular economy.

### **7️⃣ Charity Donations**
- Users can donate gently used items to charities.
- Reduces landfill waste while helping those in need.

### **8️⃣ Mobile Kiosk (For Offline Users)**
- Local scrap collectors (mallams) can register as agents.
- Kiosks allow internet-free participation in recycling efforts.
- Strengthens local recycling ecosystems.

### **9️⃣AI Chatbots**
- AI chatbots for users to interact with and ask questions.
---

## 🛠️ Tech Stack

### **📱 Frontend**
- **React Native (Expo)** – Cross-platform mobile app development
- **React Navigation** – Smooth navigation between pages
- **React Native Paper** – UI component library for material design

### **☁️ Backend & Database**
- **Firebase** – Authentication and database for real-time data sync.
- **Cloud Storage** – Stores user images and documents
- **Firebase Firestore** – For Leaderboard data.

### **🤖 AI & Machine Learning**
- **TensorFlow.js** – AI-powered item recognition
- **Gemini API** – Chatbot integration

### **📍 GPS & Maps**
- **Google Maps API** – Locating recycling centers
- **Geolocation API** – Tracks user location for navigation

### **💰 Payments & Rewards**
- **Flutterwave API** – Handles point-to-cash conversions
- **Telecom API** – Converts points to phone data

### **🔗 Additional Future APIs**
- **Twilio** – For SMS notifications and reminders
- **Google Cloud Vision** – Image processing for waste sorting

---

## 🎨 UI/UX Design & Color Scheme

### **🌿 Primary Colors (Eco & Nature)**
- **Green ( #4CAF50)** – Sustainability, recycling (buttons, highlights)
- **Blue ( #2196F3)** – Cleanliness, trust (backgrounds, headers)

### **🧑‍💻 Secondary Colors (Contrast & Energy)**
- **Yellow ( #FFC107)** – Warmth, excitement (notifications, badges, CTAs)
- **White ( #FFFFFF)** – Clean, minimal (backgrounds, readability)

### **♻️ Accent Colors (Modern & Engaging)**
- **Gray ( #E0E0E0 / #757575)** – Neutral tones (text, dividers)
- **Brown ( #8D6E63)** – Earthy waste management elements


---

## 💡 Nearest Future Improvements
- Develop a web version for desktop users.

## 💡 Future Improvements
- Partner with telecom providers for broader reward options.
- Add IOT support for Smart Home Integration
     - Users with smart home devices can sync them with EcoBuddy.
     - AI-driven waste monitoring and feedback on recycling habits.


**🚀 Let’s make Nigeria greener, one recycled item at a time!** 🌱♻️

## Pages
- Onboarding screen
- Registration screen
- Home
- Game
- User profile
- Help\FAQ
- AI Chatbot
- Waste Selector
- Eco Points and rewards page
- Recycling educational page with ai generated newsletter and human blogs articles.
- Community post and engagement.

## Pages/Fixes to do today
- On home page: 
  - The hello john thats first seen should say welcome {name}. the name that was entered in the create account file and this name should be saved in the database so that it displays when the person logis in again.

- On the chatbot: when I type in the chat, the box goes down and out of the screen. fix that.

## Pages/Fixes for future
- Need 6 new pages as babies to the main page
   - Waste pick up schedule page
   - Claim rewards page
   - Post on community page
   - Post blog article on education page.
   - Edit profile page
   - Settings page

- Customize the not found page to have ecobuddy stuff on it.
- AI for chatbot, for newspaper/blog, and for image recognizer(might have to train a model for this one).
- On home page: add leaderboard in between the additional features and quick actions menu. The leaderboard would have 2 sections, one showing the game points, and the second one would show the kg of waste donated for recycling already.
- Game page to have 4 games and have same point system to not complicate things (each game gives 100 points max).

  - Game 1: **Trash Sort Challenge**
      - Users must quickly drag and drop different waste items (plastic, metal, glass, paper) into the correct recycling bins before time runs out.
      - 10 items, 2 minutes. 10 point each
      - Incorrect sorting results in a small point deduction and once the timer is over, it shows their points before the timer ran out.

  - Game 2:**Memory Match: Eco Edition**
     - Classic memory card game where users flip cards to match recyclable items (pairs of plastic, paper, etc.). 5 matches 10 cards.
     - Points: +20 per match, 3 minutes.

  - Game 3:**Recycle Match**
      - A puzzle game where users match three or more of the same recyclable items (like candy crush but with waste items).
      - 5 matches, 20 points each

  - Game 4:Eco Quiz Show
      - A trivia game with questions on recycling, waste management, and sustainability (questions genreated by ai).
      - 10 Questions, 10 point each.

-On community, add better active chalenges where users can gain points as well.







├── components/                      # Reusable UI components
│   ├── NavBar.tsx                   # Custom tab bar
│   ├── WasteScanner.tsx             # Item recognition
│   ├── MapView.tsx                  # Recycling locator
│   └── ...                          # (Other components)
│
├── constants/                       # Config/static data
│   ├── colors.ts                    # Color scheme (#4CAF50, etc.)
│   └── firebase.ts                  # Firebase config (API keys)
│
├── hooks/                           # Custom hooks
│   ├── useAuth.ts                   # Auth state (Firebase)
│   └── useLocation.ts               # GPS logic
│
├── lib/                             # Utilities/3rd-party integrations
│   ├── firebase/                    # Firebase services
│   │   ├── auth.ts                  # Auth functions
│   │   ├── firestore.ts             # DB (user points, leaderboard)
│   │   └── storage.ts               # Image uploads (e.g., waste scans)
│   │
│   ├── gemini/                      # AI (Gemini API)
│   │   └── chatbot.ts               # Chatbot logic
│   │
│   └── maps.ts                      # Google Maps API helpers