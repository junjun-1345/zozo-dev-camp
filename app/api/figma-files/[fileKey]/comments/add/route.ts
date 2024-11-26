import { NextRequest, NextResponse } from "next/server";

export async function POST(
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

  const body = await req.json();
  const { node_id, message } = body;

  if (!node_id || !message) {
    return NextResponse.json(
      { error: "node_id and message are required" },
      { status: 400 }
    );
  }

  // client_metaの中にnode_offsetを含める
  const clientMeta = {
    node_id: node_id,
    node_offset: {
      x: 0, // 必要に応じて適切な値を設定
      y: 0, // 必要に応じて適切な値を設定
    },
  };

  const response = await fetch(
    `https://api.figma.com/v1/files/${fileKey}/comments`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_meta: clientMeta,
        message,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.json();
    console.error("Figma API Error:", error);
    return NextResponse.json(
      { error: "Failed to add comment", details: error },
      { status: response.status }
    );
  }

  const data = await response.json();
  return NextResponse.json(data); // 追加されたコメントデータを返す
}
