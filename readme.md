## 简介
这是一个基于 Expo 和 Next.js 构建的跨平台应用，支持移动端和 Web 端开发。该应用使用 Redux 来管理状态，Axios 处理 API 请求，React Navigation 处理页面路由。


## 项目开发管理 (Permission required)
https://github.com/users/lyraai/projects/1


## 安装指南

### 1. 环境要求
确保你的开发环境中已经安装了以下工具：
- **Node.js**：版本 >= 16.x（兼容 Expo 和 Next.js）
- **Yarn**：建议使用 Yarn 来管理依赖。
- **Expo CLI**：可以使用 `npx expo` 来启动 Expo 开发环境。
- **Xcode**（仅限 iOS 开发）：如果你计划在 iOS 设备上进行开发，需要安装 [Xcode]

### 2. 安装步骤

#### 1. 克隆仓库

使用以下命令克隆项目仓库到本地：

```bash
git clone https://github.com/lyraai/semo
cd 
```

#### 2. 安装依赖

项目使用 `yarn` 来安装依赖包。运行以下命令：

```bash
yarn install
```

#### 3. 配置环境变量

根据项目需求，你可能需要在根目录下创建 `.env` 文件。将 `NEXT_PUBLIC_API_URL` 变量设置为后端 API 的基础 URL。

```bash
NEXT_PUBLIC_API_URL=https://your-backend-url
```

#### 4. 启动开发服务器

使用 `npx expo start` 来启动移动端开发服务器，并通过 Expo Go 应用在移动设备上查看效果：

```bash
# 使用 Expo 启动开发环境
npx expo start
```



### 4. 常见问题

#### 1. 依赖问题
如果遇到与 `babel-loader` 或 `webpack` 相关的兼容性问题，请检查以下配置文件：
- `babel.config.js`
- `next.config.js`

确保 `react-native-web`、`expo` 和其他相关库的版本是兼容的。

#### 2. 依赖问题处理

在运行 `yarn install` 过程中，若出现依赖冲突或兼容性问题，可以通过以下命令强制重新解决依赖关系：

```bash
yarn install --force
```

### 5. 依赖和版本管理

#### 主要依赖：
以下是本项目使用的主要依赖库及其版本：

```json
"dependencies": {
  "axios": "^0.21.1",
  "expo": "^45.0.0",
  "next": "^12.0.7",
  "react": "17.0.2",
  "react-dom": "17.0.2",
  "react-native": "^0.64.3",
  "react-native-web": "^0.17.5",
  "redux": "^4.1.0",
  "react-redux": "^7.2.4",
  "react-navigation": "^4.0.10",
  "react-native-elements": "^3.4.2",
  "react-native-svg": "^12.1.1"
}
```

#### 版本说明：
- **Expo**：版本 `^45.0.0`，用于构建移动应用。
- **Next.js**：版本 `^12.0.7`，用于服务端渲染和静态站点生成。
- **React Native**：版本 `^0.64.3`，提供跨平台开发支持。
- **react-native-web**：确保组件能够在 Web 端和移动端之间无缝切换。

#### 依赖问题处理：
在运行 `yarn install` 过程中，若出现依赖冲突或兼容性问题，可以通过以下命令强制重新解决依赖关系：

```bash
yarn install --force
```

###
本地测试：
第一次需要development build
```bash
npx expo run:ios
```

```bash
npx expo run:android
```

Testfight 打包发布
```bash
eas login
```

```bash
eas build --platform ios --profile testflight
```

