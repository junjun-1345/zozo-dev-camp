import { NextResponse } from "next/server";

export async function GET() {
  // トップページまたはログインページにリダイレクトするURL
  const redirectURL = "/";

  // クッキーを削除してログアウト処理を行う
  return NextResponse.redirect(redirectURL, {
    headers: {
      "Set-Cookie": [
        "access_token=; Max-Age=0; Path=/; HttpOnly; Secure;",
        "refresh_token=; Max-Age=0; Path=/; HttpOnly; Secure;",
        "oauth_state=; Max-Age=0; Path=/; HttpOnly; Secure;",
      ].join(", "),
    },
  });
}
