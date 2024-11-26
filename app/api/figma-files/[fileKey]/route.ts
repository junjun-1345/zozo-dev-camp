import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { fileKey: string } }
) {
  // 非同期で解決される params を明示的に取得
  const { fileKey } = await context.params;

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
  console.log("File Key:", fileKey); // デバッグ用

  const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  console.log("Figma API Response:", response.status, response.statusText); // デバッグ用

  if (!response.ok) {
    const error = await response.json();
    console.error("Figma API Error:", error); // エラー詳細をログ出力
    return NextResponse.json(
      { error: "Failed to fetch frames", details: error },
      { status: response.status }
    );
  }

  const data = await response.json();

  console.log("Fetched Figma API data:", JSON.stringify(data, null, 2)); // デバッグ用

  const frames = data.document.children[0].children
    .filter((node: { type: string }) => node.type === "FRAME")
    .map((frame: { id: string; name: string; thumbnailUrl: string }) => ({
      id: frame.id,
      name: frame.name,
      thumbnailUrl: frame.thumbnailUrl,
    }));

  return NextResponse.json(frames);
}
