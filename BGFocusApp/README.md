# 🚀 BGFocus - AI-Powered Personal Productivity Assistant

A modern, futuristic, and stylish React Native app built with Expo that combines beautiful UI design with AI-powered productivity features. BGFocus helps you stay focused, organized, and productive with intelligent task management, focus sessions, and personalized insights.

## ✨ Features

### 🎨 **Modern Design**
- **Dark Mode by Default** - Sleek dark theme with neon accent colors (teal, yellow, turquoise)
- **Glassmorphism Effects** - Beautiful blurred backgrounds and glass-like cards
- **Smooth Animations** - React Native Reanimated for fluid transitions and micro-interactions
- **Gradient Backgrounds** - Stunning gradient overlays and neon glows
- **Responsive Design** - Optimized for all screen sizes

### 🏠 **Smart Dashboard**
- Real-time productivity metrics and statistics
- Quick access to all features with beautiful cards
- Personalized greetings based on time of day
- Animated progress indicators and status updates

### 🤖 **AI Task Manager**
- Intelligent task prioritization and deadline suggestions
- Smart categorization and tagging system
- AI-powered task breakdown recommendations
- Visual priority indicators with color coding
- Filter and search functionality

### ⏰ **Focus Timer (Pomodoro)**
- Beautiful circular progress animation
- Customizable work and break sessions
- Session tracking and productivity statistics
- Haptic feedback for better user experience
- Breathing animations during focus sessions

### 📱 **Onboarding Experience**
- Stunning splash screen with glowing logo animation
- Interactive onboarding with smooth page transitions
- Brand introduction and feature highlights
- Swipeable cards with gradient backgrounds

### 🎯 **Key Highlights**
- **Component-based Architecture** - Modular and reusable components
- **TypeScript Support** - Type-safe development
- **NativeWind Integration** - Tailwind CSS for React Native
- **AsyncStorage** - Local data persistence
- **Haptic Feedback** - Enhanced user interaction
- **Glassmorphism UI** - Modern glass-like design elements

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: React Navigation Stack
- **Animations**: React Native Reanimated
- **Icons**: Expo Vector Icons (Ionicons)
- **Gradients**: Expo Linear Gradient
- **Blur Effects**: Expo Blur
- **Storage**: AsyncStorage
- **Haptics**: Expo Haptics
- **Status Bar**: Expo Status Bar

## 📱 Screenshots & Features

### Splash Screen
- Animated BGFocus logo with glowing effects
- Rotating gradient background
- Floating particles animation
- Progress bar with smooth transitions

### Onboarding
- 3 swipeable screens with gradient backgrounds
- Smooth page transitions and animations
- Interactive elements and call-to-action buttons
- Brand introduction and feature highlights

### Home Dashboard
- Personalized greeting based on time
- Productivity stats cards with gradients
- Quick action buttons for main features
- Today's tasks preview with priority indicators

### Focus Timer
- Large circular progress indicator
- Work/break session switching
- Session statistics and tracking
- Breathing animations and haptic feedback

### Task Management
- Smart task filtering (All, Pending, In Progress, Completed)
- Priority-based color coding
- AI suggestions for task breakdown
- Beautiful glassmorphism cards

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd BGFocusApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   
   # For web
   npm run web
   ```

## 📁 Project Structure

```
BGFocusApp/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── SplashScreen.tsx
│   │   └── GlassCard.tsx
│   ├── screens/             # Main app screens
│   │   ├── OnboardingScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── FocusScreen.tsx
│   │   └── TasksScreen.tsx
│   ├── constants/           # App constants and styling
│   │   ├── colors.ts
│   │   └── spacing.ts
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   └── utils/               # Utility functions
├── assets/                  # Images and icons
├── App.tsx                  # Main app component
├── global.css              # Tailwind CSS styles
├── tailwind.config.js      # Tailwind configuration
└── package.json            # Dependencies
```

## 🎨 Design System

### Colors
- **Primary**: #00D4AA (Teal)
- **Secondary**: #FFD700 (Yellow)
- **Accent**: #40E0D0 (Turquoise)
- **Background**: #0A0A0A (Dark)
- **Surface**: #1A1A1A (Dark Surface)
- **Text**: #FFFFFF (White)

### Gradients
- Primary: Teal to Turquoise
- Secondary: Yellow to Orange
- Accent: Turquoise to Teal
- Dark: Black to Dark Gray
- Glass: Semi-transparent white

### Typography
- **Headers**: Bold, 24-32px
- **Body**: Regular, 14-16px
- **Captions**: Medium, 12px
- **Monospace**: Timer displays

### Components
- **Glassmorphism Cards**: Blurred backgrounds with borders
- **Gradient Buttons**: Smooth color transitions
- **Circular Progress**: Animated focus timers
- **Floating Particles**: Background animations

## 🔧 Customization

### Themes
The app uses a dark theme by default with neon accent colors. All colors are defined in `src/constants/colors.ts` and can be easily customized.

### Animations
All animations use React Native Reanimated and can be customized in the component files. The app includes:
- Fade in/out animations
- Scale transitions
- Slide animations
- Rotating gradients
- Breathing effects

### Components
All UI components are modular and can be easily customized or extended. The `GlassCard` component provides a consistent glassmorphism effect throughout the app.

## 📈 Future Enhancements

- [ ] Real AI integration (OpenAI/Claude API)
- [ ] Push notifications for task reminders
- [ ] Data synchronization across devices
- [ ] Team collaboration features
- [ ] Advanced analytics with charts
- [ ] Custom themes and personalization
- [ ] Widget support for home screen
- [ ] Apple Watch integration
- [ ] Voice input for tasks and notes
- [ ] Calendar integration
- [ ] Productivity insights and reports

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- React Native community for the excellent framework
- Expo team for the amazing development tools
- Ionicons for the beautiful icon set
- Tailwind CSS for the utility-first styling approach
- All contributors and testers

---

**Made with ❤️ and ☕ by the BGFocus Team**

*Transform your productivity with AI-powered focus and organization.*