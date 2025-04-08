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


**🚀 Let's make Nigeria greener, one recycled item at a time!** 🌱♻️

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

  main: #0C4242',
      card: #0D4242',
      modal: #115254',
    ,
    text: 
      primary: #FFFFFF',
      secondary: #E0E0E0',
      accent: #FFC107',
#d7ccb6
#FFFDD0

## Pages/Fixes to do today
- Waste selector page:
 - The scan waste takes you to the camera and after that the model (which i will train and link later) decides what type of waste it is. Ask AI for more clarification and workflow for this with the model. After successful identification of the image let it take you to the next page.
 - If its being clicked manually, let the submit for verification button take them to the second page (wasteSchedule.tsx).
 - Sub page (wasteSchedule.tsx file) in the features folder: this is the page with the full details of what you want to type of waste to be recycled (as it was selected/scanned on the waste selector page), weight of the waste, more important features and info needed here,  with the maps of drop-up locations, etc etc, then a button saying submit waste. And after a successful submission, it takes them to the waste history page.
 - Another sub page to see current transactions named waste history page in the features folder where they can see their waste transcations (the ones that have been successfully transferred, the ones that are still waiting to be transferred, and the one that were unsuccessful for different reasons.) and there should be a back to home button as well. there should be an small calender icon somewhere on the home page that links here.

## Pages/Fixes for future
- Choose a logo and then update the color scheme according to that logo.
- Check for other fonts and choose one.

- Need new pages as babies to the main page
   - Claim rewards page
   - Post on community page
   - Post blog article on education page.
   - Edit profile page
   - Settings page

- Customize the not found page to have ecobuddy stuff on it.

- Add a referrals page where there's a referral code and how many people they've referred. For every referral you get 300 points. This would be a profile page link to the page.

- AI for chatbot, for newspaper/blog, and for image recognizer(will train a model for this one).

- On home page: add leaderboard in between the additional features and quick actions menu. The leaderboard would have 2 sections, one showing the game points, and the second one would show the kg of waste donated for recycling already.

- On home page: The hello john thats first seen should say welcome {name}. the name that was entered in the create account file and this name should be saved in the database so that it displays when the person logis in again.

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

## 🚀 Getting Started
1. Open your VSCode, Open a folder (create a new on eand name it anything you want sha that maybe Technovation)
2. Once the folder is open, open the terminal, control + `, or just find it in the run (you'll see different sections on top named file, edit, run, help, view, just check I think view or smt till you see terminal, then open it)
3. Now once your terminal is open, everything underneath would be typed into the terminal accordingly. 

### Prerequisites
- Before you begin, ensure you have the following installed:

1. [Node.js](https://nodejs.org/) (v14 or higher) Run this in your terminal 

```bash
node --v
```

- this command should bring out number like this 23.01.0 or smt like that sha. So the first number is the version which should be 23 or 24 since I saw what you downloaded 

2. [npm](https://www.npmjs.com/) (comes with Node.js)
```bash
npm --v
```

- same with npm here. It should be around the same as node version number.

4. Expo CLI: After you've confirmed node is properly installed, run this next in your terminal

  ```bash
   npm install -g expo-cli
   ```

5. [Git](https://git-scm.com/)
- To be sure git is installed, on the left side panel, you'll see a bunch of icons. You're currently in the top one named folder. Check the second/third one the one that says git lens and check if it's connected or if it says install git on windows. if its connected then git bash is installed properly but if it still says install git for windows, it's most likely not properly installed. Although, if you're sure everything installed properly, exit VSCode and open it again. Sometimes VSCode needs to be reloaded.

6. Download Expo Go from android play store.

- After all these above are done and successful, run this in the terminal as well. You can do all of this in the same terminal.

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ewa-edun/EcoBuddy.git
```

- then once it successfully cloned, run this:

```bash
   cd EcoBuddy
   ```

- Run this to install node modules, it's a big package but you need it to make sure the app runs smoothly and successfully.

2. **Install Dependencies**
   ```bash
   npm install
   ```

- After node modules are successfully installed, install these one after the other in the same terminal.

3. **Install Additional Required Packages**
   ```bash
   # UI and Icon Libraries
   npm install lucide-react-native
   npm install @expo/vector-icons
   
   # Navigation and Routing
   npm install expo-router
   npm install @react-navigation/native
   npm install @react-navigation/stack
   
   # UI Components
   npm install react-native-safe-area-context
   npm install react-native-screens
   
   # Layout and Styling
   npm install react-native-reanimated
   ```

- SKIP THIS NUMBER 4 STEP. I'VE NOT ADDED ANY FUCTIONALITIES YET SO ITS SAFE TO SKIP THIS RIGHT NOW.

4. **Environment Setup**
   Create a `.env` file in the root directory with the following variables:
   ```
   FIREBASE_API_KEY=your_firebase_api_key
   FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   FIREBASE_PROJECT_ID=your_firebase_project_id
   FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   FIREBASE_APP_ID=your_firebase_app_id
   GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   GEMINI_API_KEY=your_gemini_api_key
   ```

- Once everything is successfully installed, run this command in your terminal. Once you start this that means the app would start running.

5. **Start the Development Server**
   ```bash
   npx expo start
   ```

6. **Running the App**
   
   - **On Physical Device:**
     - Install the Expo Go app from the App Store or Play Store
     - Scan the QR code shown in the terminal with your device's camera.
A QR code will come up in the terminal after you run number 5 command. Scan it and let the app load on your phone.


-By now, you should be able to see the app on your phone with no issues.

7. When you're done checking the app and you want to exit, click control + c to exit the app testing. and if you want to u. it again at a later time start from number 5 again.

### Common Issues and Solutions

1. **Metro Bundler Issues**
   ```bash
   # Clear Metro bundler cache
   npx expo start -c
   ```

2. **Dependency Issues**
   ```bash
   # Remove node_modules and reinstall
   rm -rf node_modules
   npm install
   ```


### Additional Resources
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Maps Platform](https://developers.google.com/maps/documentation)


**Happy coding! 🌱♻️**



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