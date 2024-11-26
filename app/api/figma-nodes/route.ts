import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest): Promise<NextResponse> {
  console.log("ノード");
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

  // TODO: 動的に変更
  const fileKey = "HsNAn1JTvE8DACXGxW2eAJ"; // 表示したいFigmaファイルのキーを設定

  try {
    // Figma APIでファイル情報を取得
    const fileResponse = await axios.get(
      `https://api.figma.com/v1/files/${fileKey}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // 結果をコンソールに出力
    // console.log("File Response:", fileResponse.data);

    const result = getMatchingNodes(fileResponse.data, "ホーム_デフォルト");
    console.log("Matching Nodes:", result);

    const { document } = fileResponse.data;
    const nodes = extractPrototypeNodes(document);

    return NextResponse.json({ nodes });
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.error("Error Response:", error.response.data);
      return NextResponse.json(
        { error: error.response.data || "Failed to fetch prototype nodes" },
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

// 再帰的にプロトタイプノードを抽出する関数
interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

function extractPrototypeNodes(node: FigmaNode): FigmaNode[] {
  const nodes: FigmaNode[] = [];

  // プロトタイプに関係するノードを収集
  // if (node.type === "FRAME" || node.type === "COMPONENT") {
  if (node.type === "FRAME") {
    nodes.push({
      id: node.id,
      name: node.name,
      type: node.type,
    });
  }

  // 子ノードがある場合、再帰的に収集
  if (node.children) {
    for (const child of node.children) {
      nodes.push(...extractPrototypeNodes(child));
    }
  }

  return nodes;
}

function getMatchingNodes(
  nodes: { document: FigmaNode }, // 型を調整
  targetName: string
) {
  console.log("Nodes Input:", nodes);
  console.log("Target Name:", targetName);

  // ルートノード（例えば `document`）を指定
  const rootNode = nodes.document;

  if (!rootNode) {
    console.error("Root node is missing in the provided nodes");
    return [];
  }

  // 再帰的にターゲットノードを取得
  const matchingNodes = getMatchingNodesRecursive(rootNode, targetName);

  console.log("Matching Nodes:", matchingNodes);

  return matchingNodes;
}

function getMatchingNodesRecursive(
  node: FigmaNode,
  targetName: string
): FigmaNode[] {
  const matchingNodes: FigmaNode[] = [];

  // 現在のノードがターゲット名と一致する場合、結果に追加
  if (node.name === targetName) {
    matchingNodes.push(node);
  }

  // 子ノードを再帰的に探索
  if (node.children && Array.isArray(node.children)) {
    for (const child of node.children) {
      matchingNodes.push(...getMatchingNodesRecursive(child, targetName));
    }
  }

  return matchingNodes;
}
