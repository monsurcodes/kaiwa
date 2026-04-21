# Kaiwa

> The best AniList experience on mobile. Not a web wrapper, not an afterthought — a native app built with modern React Native.

A feature-rich mobile application for AniList users to browse, search, and track anime and manga with a beautiful, intuitive interface.

## ✨ Features

- **Home & Trending** - Discover trending and popular anime and manga
- **Search** - Advanced search functionality for finding your favorite titles
- **Library** - View and manage your personal anime and manga collection
- **Profile** - Check your statistics, favorite characters, staff, and studios
- **Forum** - Community discussions and interactions
- **Beautiful UI** - Dark mode optimized, smooth animations, and responsive design
- **OAuth Integration** - Seamless AniList authentication

## 📥 Download

Download the latest APK build directly on your Android device:

[**⬇️ Download Latest APK**](https://github.com/monsurcodes/kaiwa/releases/latest)

- Go to [Releases](https://github.com/monsurcodes/kaiwa/releases)
- Download the latest `.apk` file
- Open the file on your Android device and tap Install
- Grant necessary permissions when prompted

## 🏗️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Navigation**: [Expo Router](https://docs.expo.dev/routing/introduction/)
- **GraphQL Client**: [URQL](https://formidable.com/open-source/urql/)
- **GraphQL Code Generation**: [GraphQL Code Generator](https://www.graphql-code-generator.com/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS for React Native)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Storage**: [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv)
- **Code Quality**: ESLint, Prettier, Husky, Commitlint
- **UI Components**: [Lucide React Native](https://lucide.dev/), [expo-image](https://docs.expo.dev/versions/latest/sdk/image/), [FlashList](https://shopify.github.io/flash-list/)

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Android Studio** (for Android development) or **Xcode** (for iOS development)
- AniList API access (handled through OAuth)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/monsurcodes/kaiwa.git
cd kaiwa
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration values. Key variables:

- AniList API endpoint (pre-configured)
- Any additional authentication tokens if needed

### 4. Generate GraphQL Types

Before running the app, generate TypeScript types from GraphQL queries:

```bash
npm run codegen
```

This command:

- Reads your GraphQL queries from `lib/graphql/queries/` and mutations
- Generates strongly-typed TypeScript interfaces in `lib/graphql/generated/`
- Ensures type safety across your GraphQL operations

### 5. Start Development

#### Android

```bash
npm run android
```

Or with Expo CLI:

```bash
expo start
# Press 'a' to open Android
```

#### iOS

```bash
npm run ios
```

## 🛠️ Available Scripts

```bash
# Development
npm start              # Start Expo dev server
npm run android        # Run on Android emulator/device
npm run ios            # Run on iOS simulator/device
npm run web            # Run on web

# Code Quality
npm run format         # Format code with Prettier
npm run format:check   # Check formatting without changing
npm run lint           # Run ESLint
npm run lint:fix       # Fix ESLint errors automatically

# GraphQL
npm run codegen        # Generate GraphQL types

# Git Hooks
npm run prepare        # Setup Husky git hooks
```

## 🔐 Authentication

The app uses **AniList OAuth 2.0** for authentication:

1. Users tap the login button
2. Browser opens AniList authorization page
3. After approval, callback redirects back to the app
4. Access token is stored securely using `react-native-mmkv`
5. All subsequent API requests include the token via URQL auth exchange

## 📊 GraphQL Queries

All GraphQL queries are located in `lib/graphql/queries/`. To add a new query:

1. Create a new file: `lib/graphql/queries/myQuery.ts`
2. Define your query using the `gql` function:

```typescript
import { gql } from "@/lib/graphql/generated";

export const MyQuery = gql(/* GraphQL */ `
   query GetMyData($id: Int!) {
      Media(id: $id) {
         id
         title {
            romaji
         }
      }
   }
`);
```

3. Run `npm run codegen` to generate types
4. Use the query in your component with `useQuery`

## 🎨 Styling

This project uses **NativeWind** (Tailwind CSS for React Native). Key points:

- Classes are applied via `className` prop on React Native components
- Responsive classes work similarly to web Tailwind
- Dark mode is configured in `tailwind.config.js`
- Custom colors are defined in theme configuration

Example:

```tsx
<View className="flex-1 items-center justify-center bg-slate-900">
   <Text className="text-lg font-semibold text-white">Hello</Text>
</View>
```

## 🔄 State Management

**Zustand** is used for global state management. Example:

```typescript
// In stores/authStore.ts
import { create } from "zustand";

interface AuthState {
   token: string | null;
   setToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
   token: null,
   setToken: (token) => set({ token }),
}));

// In a component
const token = useAuthStore((state) => state.token);
```

## 💾 Local Storage

The app uses **react-native-mmkv** for fast, encrypted local storage:

```typescript
import { MMKV } from "react-native-mmkv";

const storage = new MMKV();
storage.setString("key", "value");
const value = storage.getString("key");
```

## 📝 Code Quality Standards

- **Formatting**: Prettier (run `npm run format` before committing)
- **Linting**: ESLint with Expo config
- **Commits**: Commitlint enforces conventional commits via Husky
- **Pre-commit Hooks**: Automatically format and lint staged files

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and ensure code quality:
   ```bash
   npm run lint:fix
   npm run format
   ```
3. Commit with a conventional message:
   ```bash
   git commit -m "feat: add new feature"
   ```
4. Push and create a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Troubleshooting

### Metro bundler cache issues

```bash
expo start -c  # Clear cache and restart
```

### GraphQL types not updating

```bash
npm run codegen  # Regenerate types after modifying queries
```

### Permission errors on Android

Ensure you have the latest Android SDK and proper environment variables set in your Android Studio configuration.

### Build failures

- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Rebuild Expo: `expo prebuild --clean`

## 📞 Support

For issues, questions, or contributions, please open an issue or pull request on GitHub.

---

**Made with ❤️ for AniList enthusiasts**
