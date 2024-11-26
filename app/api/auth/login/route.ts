import { NextResponse } from "next/server";

export async function GET() {
  const state = Math.random().toString(36).substring(2); // CSRF防止のためのランダムな state 値

  // リダイレクト用URLを作成
  const figmaAuthURL = `https://www.figma.com/oauth?client_id=${process.env.FIGMA_CLIENT_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=file_read&response_type=code&state=${state}`;

  // state をクッキーに保存
  return NextResponse.redirect(figmaAuthURL, {
    headers: {
      "Set-Cookie": `oauth_state=${state}; HttpOnly; Path=/; Secure;`,
    },
  });
}
