# Print Card A4

[![Deploy to GitHub Pages](https://github.com/ishinvin/print-card/actions/workflows/deploy.yml/badge.svg)](https://github.com/ishinvin/print-card/actions/workflows/deploy.yml)

A small browser tool for laying out a front/back card pair (ID card size by
default) on an A4 sheet, ready to print or export as an image.

Live at <https://ishinvin.github.io/print-card/>.

## Features

- Upload a front and back image, crop each to the card's aspect ratio
- Adjustable card width, height, and corner radius (mm)
- Row or column pairing, with top/center/bottom alignment
- Configurable sheet margin, card gap, and optional crop marks
- Print directly (`window.print`) or save the sheet as a PNG
- Installable as a PWA for offline use

## Development

```sh
pnpm install
pnpm dev
```

## Scripts

| Command        | Description                       |
| -------------- | --------------------------------- |
| `pnpm dev`     | Start the Vite dev server         |
| `pnpm build`   | Build for production              |
| `pnpm preview` | Preview the production build      |
| `pnpm lint`    | Lint with ESLint                  |
| `pnpm format`  | Format the codebase with Prettier |

Built with Vue 3 (`<script setup>`) and Vite.
