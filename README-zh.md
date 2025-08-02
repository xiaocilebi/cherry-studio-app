# 🍒 欢迎来到 Cherry Studio App

[English](./README.md) | 中文

🍒 Cherry Studio App —— Cherry Studio 的官方移动版本，将强大的 LLMs(AI 大语言模型) 交互带到您的 iOS 和 Android 设备。

🌟 **支持项目:** [赞助](https://github.com/CherryHQ/cherry-studio/blob/main/docs/sponsor.md) | 给仓库点个 Star!

## ✨ 主要特性

- **多 LLM 提供商支持**: (逐步集成) OpenAI, Gemini, Anthropic 等。
- **AI 助手 & 对话**: 访问预设助手，进行流畅的多模型对话。
- **移动优化**: 专为 iOS/Android 设计，支持浅色/深色主题。
- **核心工具**: 会话管理，历史搜索，数据迁移。

## 🛠️ 技术栈

- **框架**: Expo React Native
- **包管理器**: Yarn
- **UI**: Tamagui
- **路由**: React Navigation
- **状态管理**: Redux Toolkit

## 🚀 开发

1. **克隆仓库**

   ```bash
    git clone https://github.com/CherryHQ/cherry-studio-app.git
   ```

2. **进入目录**

   ```bash
    cd cherry-studio-app
   ```

3. **安装依赖**

   ```bash
     yarn install
   ```

4. **生成数据库**

```bash
npx drizzle-kit generate
```

5. **启动应用**

   ```bash
     yarn ios
     yarn android
   ```

在输出中，您将找到在不同目标上运行应用程序的选项：

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), 一个用于尝试使用 Expo 进行应用程序开发的有限沙盒

您可以通过编辑 src 目录中的文件来开始开发。

## 了解更多

要了解更多关于使用 Expo 开发项目的信息，请查看以下资源：

- [Expo 文档](https://docs.expo.dev/): 学习基础知识，或通过我们的[指南](https://docs.expo.dev/guides)深入了解高级主题。
- [学习 Expo 教程](https://docs.expo.dev/tutorial/introduction/): 按照循序渐进的教程，您将创建一个可以在 Android、iOS 和 Web 上运行的项目。
