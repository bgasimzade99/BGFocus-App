# 🎯 BGFocus - Professional Focus Management Platform

<div align="center">
<img width="1137" height="574" alt="image" src="https://github.com/user-attachments/assets/605148c8-3ef6-4d93-8807-8b3928953a09" />


**A sophisticated React Native productivity app with professional UI/UX design, advanced task management, and comprehensive analytics.**

[![React Native](https://img.shields.io/badge/React%20Native-0.72-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-49.0-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## 🌟 Overview

BGFocus is a premium productivity application designed for professionals who demand sophisticated tools for focus management, task organization, and performance analytics. Built with modern React Native and featuring a stunning glassmorphic design, BGFocus combines beautiful aesthetics with powerful functionality.

### ✨ Key Highlights

- **🎨 Professional Design**: Sophisticated glassmorphic UI with dark theme
- **📊 Advanced Analytics**: Comprehensive performance tracking and insights
- **🎯 Focus Management**: Professional Pomodoro timer with session analytics
- **📋 Task Management**: Complete CRUD operations with priority management
- **👥 Team Collaboration**: Project management and team member coordination
- **🔐 Security Features**: Professional account management and security settings
- **📱 Responsive Design**: Optimized for all mobile devices

---

## 🚀 Features

### 🏠 **Professional Dashboard**
- **Real-time Analytics**: Live productivity metrics and performance indicators
- **User Profile Integration**: Professional user information display
- **Quick Actions**: Streamlined access to all core features
- **Performance Cards**: Beautiful glassmorphic cards with gradient accents
- **Dynamic Data**: Real-time updates and interactive elements

### 📋 **Advanced Task Management**
- **Smart Task Creation**: Add, edit, delete, and prioritize tasks
- **Category Management**: Organize tasks by categories and priorities
- **Progress Tracking**: Visual progress indicators and completion statistics
- **Task Analytics**: Detailed insights into task completion patterns
- **Priority System**: High, medium, and low priority with color coding

### ⏰ **Professional Focus Timer**
- **Pomodoro Technique**: 25-minute focus sessions with break intervals
- **Session Analytics**: Track focus time, sessions completed, and productivity metrics
- **Customizable Sessions**: Adjustable work and break durations
- **Visual Feedback**: Beautiful circular progress animations
- **Session History**: Comprehensive tracking of all focus sessions

### 📊 **Comprehensive Analytics**
- **Performance Dashboard**: Monthly, weekly, and daily analytics
- **Dynamic Charts**: Real-time data visualization with interactive charts
- **KPI Tracking**: Key performance indicators with trend analysis
- **Time Period Selection**: Today, This Week, This Month, This Year views
- **Export Capabilities**: Data export for external analysis

### 👥 **Project Management Suite**
- **Project Organization**: Create, manage, and track multiple projects
- **Team Collaboration**: Add and manage team members with roles
- **Project Analytics**: Detailed project performance metrics
- **File Management**: Upload, organize, and share project files
- **Progress Tracking**: Visual project completion indicators

### ⚙️ **Professional Settings**
- **Personal Information**: Comprehensive profile management with avatar selection
- **Notification Management**: Granular notification preferences
- **Subscription Management**: Premium feature access and billing
- **Security Settings**: Password management and security features
- **Account Management**: Professional account settings and preferences

### 🎨 **Sophisticated UI/UX**
- **Glassmorphic Design**: Modern glass-like effects with blur and transparency
- **Dark Theme**: Professional dark mode with sophisticated color palette
- **Smooth Animations**: Fluid transitions and micro-interactions
- **Custom Logo**: Animated focus-themed logo with brain wave effects
- **Professional Typography**: Clean, readable fonts with proper hierarchy

---

## 🛠️ Technology Stack

### **Core Technologies**
- **Framework**: React Native with Expo SDK 49
- **Language**: TypeScript 5.0
- **Styling**: StyleSheet with custom design system
- **Navigation**: Custom navigation with stack management
- **State Management**: React Hooks (useState, useEffect, useRef)

### **UI/UX Libraries**
- **Gradients**: Expo Linear Gradient
- **Icons**: Expo Vector Icons (Ionicons)
- **Animations**: React Native Animated API
- **Haptics**: Expo Haptics for tactile feedback
- **Storage**: AsyncStorage for data persistence

### **Development Tools**
- **Bundler**: Metro Bundler
- **Type Checking**: TypeScript compiler
- **Code Formatting**: Prettier
- **Linting**: ESLint
- **Package Manager**: npm

---

## 📱 Screenshots & Features

### 🎯 **Professional Header**
- **Animated Logo**: Custom focus-themed logo with pulsing animations
- **User Profile**: Professional user information display
- **Quick Actions**: Profile and settings access buttons
- **Brand Identity**: Clean typography with professional styling

### 🏠 **Home Dashboard**
- **Welcome Message**: Professional focus dashboard greeting
- **Progress Cards**: Today's progress with visual indicators
- **Task Management**: Quick task overview with add/remove functionality
- **AI Insights**: Performance analytics and recommendations

### ⏰ **Focus Timer**
- **Session Selector**: Professional session type selection
- **Circular Progress**: Beautiful animated timer display
- **Session Stats**: Focus time and session statistics
- **Control Buttons**: Play, pause, and skip functionality

### 📊 **Analytics Dashboard**
- **Performance Charts**: Dynamic monthly performance visualization
- **KPI Cards**: Key performance indicators with trends
- **Time Periods**: Today, This Week, This Month, This Year
- **Project Management**: Quick access to project tools

### ⚙️ **Settings Suite**
- **Personal Information**: Profile management with avatar selection
- **Notifications**: Granular notification preferences
- **Subscription**: Premium feature management
- **Security**: Password and security settings

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator
- Git

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/bgasimzade99/BGFocus-App.git
   cd BGFocus-App/BGFocusApp
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

### **Development Commands**
```bash
# Start development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web

# Clear cache and restart
npm start -- --clear
```

---

## 📁 Project Structure

```
BGFocusApp/
├── src/
│   ├── components/              # Reusable UI components
│   │   ├── AIAssistant.tsx     # AI chat interface
│   │   ├── AnimatedButton.tsx  # Custom animated buttons
│   │   ├── FocusTimer.tsx      # Focus timer component
│   │   ├── GlassCard.tsx       # Glassmorphic card component
│   │   ├── PremiumModal.tsx    # Professional modal component
│   │   ├── PremiumNavbar.tsx  # Navigation bar component
│   │   ├── PremiumTabBar.tsx  # Bottom tab bar
│   │   └── SplashScreen.tsx    # App splash screen
│   ├── screens/                # Main app screens
│   │   ├── AnalyticsScreen.tsx      # Analytics dashboard
│   │   ├── FocusScreen.tsx          # Focus timer screen
│   │   ├── HomeScreen.tsx           # Main dashboard
│   │   ├── InsightsScreen.tsx       # AI insights
│   │   ├── NotesScreen.tsx          # Notes management
│   │   ├── OnboardingScreen.tsx     # User onboarding
│   │   ├── TasksScreen.tsx          # Task management
│   │   ├── SettingsScreen.tsx       # Main settings
│   │   ├── PersonalInformationScreen.tsx  # Profile management
│   │   ├── NotificationsScreen.tsx       # Notification settings
│   │   ├── SubscriptionScreen.tsx        # Subscription management
│   │   ├── SecurityScreen.tsx           # Security settings
│   │   ├── ManageProjectsScreen.tsx      # Project management
│   │   ├── TeamMembersScreen.tsx        # Team collaboration
│   │   ├── ProjectAnalyticsScreen.tsx   # Project analytics
│   │   └── ProjectFilesScreen.tsx       # File management
│   ├── constants/               # App constants
│   │   ├── colors.ts            # Color palette
│   │   ├── spacing.ts           # Spacing system
│   │   └── theme.ts             # Theme configuration
│   ├── hooks/                   # Custom React hooks
│   │   └── useTheme.ts          # Theme management hook
│   └── types/                   # TypeScript definitions
│       └── index.ts             # Type definitions
├── assets/                      # Images and icons
│   ├── BGFocus icon.png         # App icon
│   ├── adaptive-icon.png        # Android adaptive icon
│   ├── favicon.png              # Web favicon
│   ├── icon.png                 # Default icon
│   └── splash-icon.png          # Splash screen icon
├── App.tsx                      # Main app component
├── app.json                     # Expo configuration
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.js           # Tailwind CSS config
├── babel.config.js              # Babel configuration
├── metro.config.js              # Metro bundler config
├── global.css                   # Global styles
├── README.md                    # This file
├── DEPLOYMENT.md                # Deployment guide
└── TROUBLESHOOTING.md           # Troubleshooting guide
```

---

## 🎨 Design System

### **Color Palette**
```typescript
// Primary Colors
Primary: '#6366F1'      // Indigo
Secondary: '#8B5CF6'    // Purple
Accent: '#10B981'        // Emerald
Success: '#059669'      // Green
Warning: '#F59E0B'      // Amber
Error: '#EF4444'        // Red

// Background Colors
Background: '#0A0A0A'   // Dark
Surface: '#1E1E1E'      // Dark Surface
SurfaceElevated: '#2A2A2A' // Elevated Surface
Border: '#27272A'       // Border

// Text Colors
Text: '#FFFFFF'         // White
TextSecondary: '#A1A1AA' // Gray
TextMuted: '#71717A'    // Muted Gray
```

### **Typography Scale**
```typescript
// Font Sizes
xs: 12px      // Small text
sm: 14px      // Body text
md: 16px      // Medium text
lg: 18px      // Large text
xl: 20px      // Extra large
2xl: 24px     // Headings
3xl: 32px     // Large headings

// Font Weights
light: '300'   // Light weight
regular: '400' // Regular weight
medium: '500'  // Medium weight
semibold: '600' // Semi-bold weight
bold: '700'    // Bold weight
```

### **Spacing System**
```typescript
// Spacing Scale
xs: 4px       // Extra small
sm: 8px       // Small
md: 16px      // Medium
lg: 24px      // Large
xl: 32px      // Extra large
2xl: 48px     // Double extra large
```

### **Component Styles**
- **Glassmorphism**: Blurred backgrounds with transparency
- **Gradients**: Smooth color transitions
- **Shadows**: Subtle elevation effects
- **Borders**: Rounded corners with consistent radius
- **Animations**: Smooth transitions and micro-interactions

---

## 🔧 Configuration

### **Environment Setup**
```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Install dependencies
npm install

# Start development server
npx expo start
```

### **App Configuration**
The app is configured through `app.json`:
```json
{
  "expo": {
    "name": "BGFocus",
    "slug": "bgfocus-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/BGFocus icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#0A0A0A"
    }
  }
}
```

---

## 📈 Performance & Analytics

### **Key Metrics Tracked**
- **Focus Sessions**: Time spent in focus mode
- **Task Completion**: Tasks completed per day/week/month
- **Productivity Score**: Overall productivity rating
- **Session Duration**: Average focus session length
- **Break Frequency**: Break patterns and timing

### **Analytics Features**
- **Real-time Updates**: Live data synchronization
- **Historical Data**: Past performance tracking
- **Trend Analysis**: Performance trend identification
- **Goal Setting**: Personal productivity goals
- **Achievement Tracking**: Milestone celebrations

---

## 🔐 Security & Privacy

### **Data Protection**
- **Local Storage**: All data stored locally using AsyncStorage
- **No External APIs**: No data sent to external servers
- **Privacy First**: User data remains on device
- **Secure Storage**: Encrypted local storage

### **Security Features**
- **Password Management**: Secure password handling
- **Session Management**: Secure user sessions
- **Data Validation**: Input validation and sanitization
- **Error Handling**: Comprehensive error management

---

## 🚀 Deployment

### **Expo Build**
```bash
# Build for Android
npx expo build:android

# Build for iOS
npx expo build:ios

# Build for web
npx expo build:web
```

### **App Store Deployment**
1. Configure app.json with proper bundle identifiers
2. Build production version
3. Submit to App Store Connect (iOS) or Google Play Console (Android)
4. Follow platform-specific deployment guidelines

---

## 🤝 Contributing

We welcome contributions to BGFocus! Please follow these guidelines:

### **Development Workflow**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes following the coding standards
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### **Coding Standards**
- Use TypeScript for all new code
- Follow the existing code style and patterns
- Add proper error handling
- Include comments for complex logic
- Test all new features

### **Pull Request Guidelines**
- Provide a clear description of changes
- Include screenshots for UI changes
- Ensure all tests pass
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **React Native Community** - For the excellent framework and ecosystem
- **Expo Team** - For the amazing development tools and platform
- **Ionicons** - For the beautiful and comprehensive icon set
- **Design Community** - For inspiration on glassmorphic design patterns
- **Open Source Contributors** - For the libraries and tools that made this possible

---

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs or request features](https://github.com/bgasimzade99/BGFocus-App/issues)
- **Documentation**: Check the [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues
- **Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions

---

<div align="center">

**Made with ❤️ and ☕ by the BGDev**

*Transform your productivity with professional focus management and advanced analytics.*

[![GitHub stars](https://img.shields.io/github/stars/bgasimzade99/BGFocus-App?style=social)](https://github.com/bgasimzade99/BGFocus-App)
[![GitHub forks](https://img.shields.io/github/forks/bgasimzade99/BGFocus-App?style=social)](https://github.com/bgasimzade99/BGFocus-App)

</div>
