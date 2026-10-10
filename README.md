<p align="center">
  <img src="public/images/logo.png" alt="Sabha Logo" width="150" />
</p>

<h1 align="center">Sabha 📿</h1>

<p align="center">
  <a href="https://github.com/abutalebco/Sabha/releases">
    <img src="https://img.shields.io/github/v/release/abutalebco/Sabha?style=flat-square" alt="GitHub Release" />
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=abutalebco.Sabha">
    <img src="https://img.shields.io/visual-studio-marketplace/v/abutalebco.Sabha?style=flat-square" alt="Visual Studio Marketplace Version" />
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=abutalebco.Sabha">
    <img src="https://img.shields.io/visual-studio-marketplace/i/abutalebco.Sabha?style=flat-square" alt="Visual Studio Marketplace Installs" />
  </a>
  <a href="https://github.com/abutalebco/Sabha/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/abutalebco/Sabha?style=flat-square" alt="License" />
  </a>
</p>

A gamified **tasbih / tally counter** for your adhkar, right inside VS Code.
Make every build, test run and code review count.

## Features

- **Sidebar tasbih**: pick a zikr from the dropdown (22 common adhkar) and tap the big button.
- **Status bar counter**: shows the selected zikr and the current round (e.g. `🌱 سُبْحَانَ اللَّهِ  12/33`). Click it to count without opening the sidebar.
- **Keyboard shortcut**: `Ctrl+Alt+T` (`Cmd+Alt+T` on Mac) by default. Choose another preset in Settings, or pick *Custom* and assign any key.
- **Sessions**: each VS Code workspace/project is its own session with its own level. Everything also adds up to an **overall** level.
- **Duolingo-style levels**: 10 levels, each with its own badge and colour theme. The whole panel recolours as you level up.

  | Lv | Badge | Name | From |
  |---|---|---|---|
  | 1 | 🌱 | Seed | 0 |
  | 2 | 🌿 | Sprout | 33 |
  | 3 | 🌸 | Blossom | 100 |
  | 4 | 🔥 | Flame | 333 |
  | 5 | ⭐ | Star | 1,000 |
  | 6 | 🌙 | Moon | 3,333 |
  | 7 | 💎 | Diamond | 10,000 |
  | 8 | 🏮 | Lantern | 33,333 |
  | 9 | 👑 | Crown | 100,000 |
  | 10 | 🕌 | Legend | 333,333 |

- **Progress bars**
  - 📅 **Today**: today's count against your goal. By default the goal is *your own daily average*, so you compete with yourself.
  - 🗂️ **Session level** and 🌍 **Overall level**: how far you are from the next badge.
- **Statistics**: day streak, best streak, daily average, active days, best day, a last-7-days chart, your most recited adhkar and your top sessions.
- **Celebrations**: toasts and notifications when you complete a round, reach the daily goal or level up.

## Settings

| Setting | Default | Description |
|---|---|---|
| `Sabha.shortcut` | `ctrl+alt+t` | Shortcut preset for **Count (+1)**, or `custom`. |
| `Sabha.language` | `arabic` | `arabic`, `arabic-transliteration`, `arabic-english` or `english` (transliteration and meaning). |
| `Sabha.dailyGoal` | `0` | `0` = automatic (your daily average); any other number = a fixed goal. |
| `Sabha.showStatusBar` | `true` | Show the status bar counter. |
| `Sabha.notifications` | `true` | VS Code pop-ups for level-ups and daily goal. |

## Commands

- `Sabha: Count (+1)`
- `Sabha: Reset Round` (resets only the current round; your totals are never lost)
- `Sabha: Customize Count Shortcut`
- `Sabha: Open Settings`

## Privacy

All data stays on your machine in VS Code's extension storage. Nothing is sent anywhere.

## Development

```bash
npm install
npm run compile-web     # build
npm run watch-web       # rebuild on change
npm test                # unit tests in the web extension host
```

Press `F5` to launch an Extension Development Host.
