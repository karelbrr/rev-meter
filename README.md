# [IN PROGRESS]

# Rev Meter

## Overview

Rev Meter is a React Native mobile application built with Expo and Expo Router. It simulates a premium, modern digital vehicle dashboard (instrument cluster) directly on your device. Designed with a sleek, dark aesthetic and neon-like accents, it provides a high-quality gauge interface.

## Features

- **Dynamic Rev Gauge:** A beautifully styled tachometer simulating engine RPM with gradient accents.
- **Speed & Temperature Monitors:** Clear digital readouts for current speed (km/h) and engine temperature (°C).
- **Gear Selector:** An interactive-looking gear indicator (P-R-N-D-S) with active state highlighting.
- **Premium UI:** Dark mode by default, featuring high-contrast text, sleek typography, and drop shadows for a realistic, glass-like depth.

## Technology Stack

- **Framework:** [React Native](https://reactnative.dev/)
- **Build Tool / Routing:** [Expo](https://expo.dev/) & Expo Router
- **Styling:** React Native StyleSheet
- **Icons & Effects:** `expo-symbols`, `expo-glass-effect`

## Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (LTS recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- Expo CLI or Expo Go app on your physical device for testing

## Installation

1. Clone the repository (if applicable) and navigate to the project directory:

   ```bash
   cd rev-meter
   ```

2. Install the project dependencies:
   ```bash
   npm install
   ```

## Running Locally

To start the development server, run:

```bash
npm start
```

_(or `npm run start`)_

This will open the Expo Metro bundler in your terminal. From there, you can:

- Press `i` to run on an iOS Simulator.
- Press `a` to run on an Android Emulator.
- Press `w` to run on the web (if configured).
- Scan the QR code with your phone's camera (iOS) or the Expo Go app (Android) to test on a physical device.

## Project Structure

```text
rev-meter/
├── src/
│   └── app/
│       ├── _layout.tsx      # Main Expo Router layout configuration
│       ├── index.tsx        # Home screen containing the digital dashboard UI
│       └── explore.tsx      # Additional screens
├── assets/                  # Images, fonts, and other static assets
├── package.json             # Project metadata and dependencies
└── app.json                 # Expo configuration
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.
