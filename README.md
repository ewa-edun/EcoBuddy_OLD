# EcoBuddy

## 🌍 Overview
**EcoBuddy** is a recycling app designed to encourage Nigerians to sort and recycle waste in exchange for points, which can be converted into phone data. By leveraging AI, gamification, and community-driven initiatives, EcoBuddy promotes sustainability and waste management.

In a world full of apps, EcoBuddy stands out as a beacon of accessibility and inclusivity.EcoBuddy is designed with YOU in mind. Whether you're a tech-savvy or someone who's just getting started with smartphones, our app makes recycling as easy as a tap of your finger! No jargon just simple steps to make a big difference. In addition  we’ve created a unique platform that connects local scrap collectors, known as "mallams" here in Nigeria with users looking to recycle. 
By empowering mallams and integrating them into our ecosystem, EcoBuddy fosters a sense of community and collaboration. 

And here’s where it gets even more exciting! EcoBuddy doesn’t just link individuals to recycling centers. it also connects individuals to each other. For example, imagine a fashion designer who has leftover fabric from a stunning outfit she no longer needs this fabric  and it catches the eye of a local artist looking for materials to create unique clothing items. Through EcoBuddy, they connect, and the artist can purchase the fabric to give it a new life

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
| **Mr. Adeniyi Ogunbanjo** | Team Mentor/Coordinator |

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

### **9️⃣ AI Chatbots**
- AI chatbots for users to interact with and ask questions.

### **🔟 Games**
 Game page to have 4 games and have same point system to not complicate things (each game gives 100 points max).

  - Game 1: **Trash Sort Challenge**
      - Users must quickly drag and drop different waste items (plastic, metal, glass, paper) into the correct recycling bins before time runs out.
      - 10 items, 1:30/2 minutes. 10 point each
      - Incorrect sorting results in a small point deduction and once the timer is over, it shows their points before the timer ran out.

  - Game 2:**Wordle Eco Edition**
     - Like the wordle game but the words are eco related.
     - Points: 5 tries, 100 points automatically and -20 points for each miss, 1:30/2 minutes.

  - Game 3:**Recycle Match**
      - A puzzle game where users match three or more of the same recyclable items (like candy crush but with waste items).
      - 5 matches, 20 points each, 3 minutes.

  - Game 4:Eco Quiz Show
      - A trivia game with questions on recycling, waste management, and sustainability (questions genreated by ai).
      - 10 Questions, 10 point each, 2 minutes.

---
## 🛠️ Tech Stack

### **📱 Frontend**
- **React Native (Expo)** – Cross-platform (Android and iOS) mobile app development
- **React Navigation** – Smooth navigation between pages.

### **☁️ Backend & Database**
- **Firebase Authentication** – Authentication using email and password.
- **Firebase Firestore** – Database for real-time data sync.
- **Supabase storage** - For image storing.

### **🤖 AI & Machine Learning**
- **Teachable Machine** – AI-powered item recognition
- **Gemini API** – Chatbot integration

### **📍 GPS & Maps**
- **Google Maps API** – Locating recycling centers
- **Geolocation API** – Tracks user location for navigation

### **💰 Payments & Rewards**
- **Flutterwave API** – Handles point-to-cash conversions 
- **RevenueCat** for Subscription payment also submit to the revenuecat hackathon
- **Telecom API** – Converts points to phone data

### **🔗 Additional Future APIs**
- **Twilio** – For SMS notifications and reminders
- **Google Cloud Vision** – Image processing for waste sorting

---
## Datasets Used:
   - This dataset has 15,150 images from 12 different classes of household garbage; paper, cardboard, biological, metal, plastic, green-glass, brown-glass, white-glass, clothes, shoes, batteries, and trash. 
   [Garbage classification dataset 1](https://www.kaggle.com/datasets/mostafaabla/garbage-classification)

   - The dataset features 10 distinct classes of garbage with a total of 19,762 images, distributed as follows: Metal: 1020, Glass: 3061, Biological: 997, Paper: 1680, Battery: 944, Trash: 947, Cardboard: 1825, Shoes: 1977, Clothes: 5327, Plastic: 1984
    [Garbage classification dataset 2](https://www.kaggle.com/datasets/sumn2u/garbage-classification-v2)

   - Tyres 1857 imgs .good and bad tyres: 
   [Tyre Dataset](https://www.kaggle.com/datasets/rpjinu/tyre-faultfindy?select=Faultfindy)

   - e-waste dataset 3000 img: PCB (Printed Circuit Board), Player, Battery, Microwave, Mobile, Mouse, Printer, Television, Washing Machine, Keyboard
    [E-Waste Dataset](https://www.kaggle.com/datasets/akshat103/e-waste-image-dataset)

 TOTAL: 38,784 IMAGES


MODEL 1. Shoes, tyres, trash, organic waste
MODEL 2. Paper & Cardboard, plastic, glass, E-Waste
MODEL 3. Metal and Clothes

---
## Points and Conversion Rates
"Paper & Cardboard" points: 30
"Plastic Bottles & Containers", points: 35 
"Glass Bottles & Jars", points: 50
"Metal Cans & Scraps", points: 65
"Electronic Waste", points: 50
"Clothes & Textiles", points: 30
"Tyres", points: 75
"Organic Waste", points: 15
"Shoes", points: 45
"Non-Recyclable & Trash", points: 0

ALL THESE POINTS ARE PER KILOGRAM FOR EACH WASTE.

Referrals: 300 points for the reffered and referee
Each game session totals 100 points

DAILY DATA TYPE
50 points = 45 mb          35 NAIRA
100 points = 95 mb         80 NAIRA
150 points = 140 mb        115 NAIRA
200 points = 190 mb        160 NAIRA
250 points = 235 mb        195 NAIRA
300 points = 290 mb        240 NAIRA
350 points = 330 mb        275 NAIRA
400 points = 380 mb        320 NAIRA
450 points = 425 mb        355 NAIRA
500 points = 495 mb        400 NAIRA

WEEKLY DATA TYPE
600 to 900 points are times 2 of their halves. {600 points is 2 times 300 points for reward.}
600 points = 580 mb        480 NAIRA
700 points = 660 mb        550 NAIRA
800 points = 760 mb        640 NAIRA
900 points = 850 mb        710 NAIRA
950 points = 900 points    750 NAIRA
1000 points = 1100 mb      900 NAIRA
---

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
   
   npm install react react-native expo
   npm install lucide-react-native
   npm install @expo/vector-icons
   npm install react-native-svg
   npm install expo-router
   npm install @react-navigation/native
   npm install @react-navigation/stack
   npm install react-native-safe-area-context
   npm install react-native-screens
   npm install react-native-reanimated
   npm install react-native-gesture-handler
   npm install firebase
   npm install @react-native-firebase/app
   npm install @react-native-firebase/firestore
   npm install axios
   npm install react-native-dotenv
   npm install expo-constants
   npm install expo-location
   npm install expo-permissions
   npm install expo-camera
   npm install expo-image-picker
   npm install @react-native-async-storage/async-storage
   npm install @react-native-community/datetimepicker
   npm install @react-native-picker/picker
   npm install react-native-svg
   npm install jest
   npm install @testing-library/react-native
   
   ```

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

- By now, you should be able to see the app on your phone with no issues.

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
**Brought to you by Team MECA**
