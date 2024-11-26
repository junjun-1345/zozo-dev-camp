import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { fileKey: string } }
) {
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

  const response = await fetch(
    `https://api.figma.com/v1/files/${fileKey}/comments`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json(
      { error: "Failed to fetch comments", details: error },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data.comments); // コメントリストを返す
}
