# 🍒 Welcome to Cherry Studio App

English | [中文](./README-zh.md)

🍒 Cherry Studio App —— The official mobile version of Cherry Studio, bringing powerful LLMs (AI Large Language Models) interaction to your iOS and Android devices.

🌟 **Support Project:** [Sponsor](https://github.com/CherryHQ/cherry-studio/blob/main/docs/sponsor.md) | Give the repository a Star!

## ✨ Key Features

- **Multi-LLM Provider Support**: (Gradually integrating) OpenAI, Gemini, Anthropic, etc.
- **AI Assistants & Conversations**: Access preset assistants for smooth multi-model conversations.
- **Mobile Optimized**: Designed for iOS/Android, supports light/dark themes.
- **Core Tools**: Conversation management, history search, data migration.

## 🛠️ Tech Stack

- **Framework**: Expo React Native
- **Package Manager**: Yarn
- **UI**: Tamagui
- **Routing**: React Navigation
- **State Management**: Redux Toolkit

## 🚀 Development

1. **Clone Repository**

   ```bash
    git clone https://github.com/CherryHQ/cherry-studio-app.git
   ```

2. **Enter Directory**

   ```bash
    cd cherry-studio-app
   ```

3. **Install Dependencies**

   ```bash
     yarn install
   ```

4. **Generate Database**

```bash
npx drizzle-kit generate
```

5. **Start the app**

   ```bash
     yarn ios
     yarn android
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start development by editing files in the `src` directory.

## Learn More

To learn more about developing projects with Expo, check out the following resources:

- [Expo Documentation](https://docs.expo.dev/): Learn the basics, or dive deeper into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learning Expo Tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial and you'll create a project that can run on Android, iOS, and the web.
