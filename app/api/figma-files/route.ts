import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const accessToken = req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!accessToken) {
    return NextResponse.json(
      { error: "Access token is required" },
      { status: 400 }
    );
  }

  try {
    const response = await axios.get(
      "https://api.figma.com/v1/files/<file_key>",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || "トークンの取得に失敗しました" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: "トークンの取得に失敗しました" },
      { status: 500 }
    );
  }
}
