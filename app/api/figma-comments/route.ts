import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const cookies = req.headers.get("cookie") || "";
  const accessToken = cookies
    .split(";")
    .find((cookie) => cookie.trim().startsWith("access_token="))
    ?.split("=")[1];

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token is missing" },
      { status: 401 }
    );
  }

  const fileKey = "HsNAn1JTvE8DACXGxW2eAJ"; // 表示したいFigmaファイルのキーを設定

  try {
    // Figma APIでコメント情報を取得
    const commentsResponse = await axios.get(
      `https://api.figma.com/v1/files/${fileKey}/comments`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const comments = commentsResponse.data.comments;

    return NextResponse.json({ comments });
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error Response:", error.response.data);
      return NextResponse.json(
        { error: error.response.data || "Failed to fetch comments" },
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
