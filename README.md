This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 機能

- 1. 質問トラッキング機能

  - 質問を入力すると、担当者を指定してトピックごとに質問がリストアップされる。
  - 質問のステータス（未回答、回答済み、再確認が必要）を管理。

- 2. デザインデータとのリンク
  - 質問や回答を特定の Figma ファイルやアートボードに紐づけて表示。
  - 該当箇所を簡単に参照可能。

## ユーザーストーリー

1. ユーザーが Figma ファイル URL を入力。
2. 入力されたファイルキーを使い、API からフレームリストを取得。
3. フレームリストを UI に表示し、選択したフレームを iframe で表示。
