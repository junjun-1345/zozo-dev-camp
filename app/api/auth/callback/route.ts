import { NextRequest, NextResponse } from "next/server";
import axios, { AxiosResponse } from "axios";

interface TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  user_id: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // クエリパラメータを取得
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const returnedState = searchParams.get("state");

    if (!code) {
      return NextResponse.json(
        { error: "No authorization code provided" },
        { status: 400 }
      );
    }

    // クッキーから state を取得
    const cookies = req.headers.get("cookie") || "";
    const oauthState = cookies
      .split(";")
      .find((cookie) => cookie.trim().startsWith("oauth_state="))
      ?.split("=")[1];

    if (!oauthState || oauthState !== returnedState) {
      return NextResponse.json(
        { error: "Invalid state parameter" },
        { status: 400 }
      );
    }

    // クライアントIDとシークレットを Base64 エンコード
    const credentials = Buffer.from(
      `${process.env.FIGMA_CLIENT_ID}:${process.env.FIGMA_CLIENT_SECRET}`
    ).toString("base64");

    // リクエストボディを作成
    const requestBody = new URLSearchParams({
      redirect_uri: process.env.REDIRECT_URI!,
      code,
      grant_type: "authorization_code",
    });

    // デバッグ用ログ
    console.log("Request Body:", requestBody.toString());
    console.log("Authorization Header:", `Basic ${credentials}`);

    // トークン取得リクエスト
    const tokenResponse: AxiosResponse<TokenResponse> = await axios.post(
      "https://api.figma.com/v1/oauth/token",
      requestBody.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${credentials}`,
        },
      }
    );

    const { access_token, expires_in, refresh_token, user_id } =
      tokenResponse.data;

    // デバッグ用ログ
    console.log("Token Response:", tokenResponse.data);

    // 必要に応じてトークンをクッキーやセッションに保存
    return NextResponse.json({
      message: "Token successfully retrieved",
      accessToken: access_token,
      expiresIn: expires_in,
      refreshToken: refresh_token,
      userId: user_id,
    });
  } catch (error: unknown) {
    // エラーの型を詳細化
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error Response:", error.response.data);
      return NextResponse.json(
        { error: error.response.data || "Failed to fetch token" },
        { status: error.response.status }
      );
    }

    console.error("Unexpected error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
