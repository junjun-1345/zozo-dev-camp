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

  const response = await fetch(`https://api.figma.com/v1/files/${fileKey}`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!response.ok) {
    const error = await response.json();
    return NextResponse.json(
      { error: "Failed to fetch frames", details: error },
      { status: response.status }
    );
  }

  const data = await response.json();

  const frames = data.document.children[0].children
    .filter((node: { type: string }) => node.type === "FRAME")
    .map((frame: { id: string; name: string }) => ({
      id: frame.id,
      name: frame.name,
    }));

  return NextResponse.json(frames);
}
