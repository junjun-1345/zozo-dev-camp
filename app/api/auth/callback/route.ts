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
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const returnedState = searchParams.get("state");

    if (!code) {
      return NextResponse.json(
        { error: "No authorization code provided" },
        { status: 400 }
      );
    }

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

    const credentials = Buffer.from(
      `${process.env.FIGMA_CLIENT_ID}:${process.env.FIGMA_CLIENT_SECRET}`
    ).toString("base64");

    const requestBody = new URLSearchParams({
      redirect_uri: process.env.REDIRECT_URI!,
      code,
      grant_type: "authorization_code",
    });

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

    const response = NextResponse.redirect(new URL("/", req.url));

    // クッキーにトークン情報を保存（Secure フラグや HttpOnly は適切に設定）
    response.cookies.set("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: expires_in,
    });
    response.cookies.set("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30日間
    });
    response.cookies.set("user_id", user_id, {
      httpOnly: false, // 必要ならフロントエンドでも利用可能に
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error: unknown) {
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
