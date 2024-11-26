import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
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

  console.log("Access Token:", accessToken); // デバッグ用

  const response = await fetch("https://api.figma.com/v1/me/files", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    console.error(
      "Failed to fetch files:",
      response.status,
      response.statusText
    );
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }

  const data = await response.json();

  // デバッグ用にレスポンス全体をログ出力
  console.log("Fetched Figma API data:", JSON.stringify(data, null, 2));

  return NextResponse.json(data.files);
}
