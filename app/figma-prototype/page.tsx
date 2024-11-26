"use client";

import { useEffect, useState } from "react";
import FigmaPrototypeEmbed from "../components/FigmaPrototypeEmbed";

interface Node {
  id: string;
  name: string;
  type: string;
}

export default function FigmaPrototypePage() {
  const [nodes] = useState<Node[]>([]);
  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const prototypeUrl =
    // "https://www.figma.com/proto/{file_key}/{prototype_name}?node-id={node_id}&scaling=scale-down&page-id={page_id}";
    "https://www.figma.com/proto/HsNAn1JTvE8DACXGxW2eAJ/FOREST%E3%82%A2%E3%83%97%E3%83%AA?node-id=261-1415&t=yAT8SZjEgCPdPzKP-1";

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await fetch("/api/figma-nodes");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    fetchNodes();

    // 定期的に現在のノードIDを取得（仮想的に管理）
    const intervalId = setInterval(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const nodeId = urlParams.get("node-id");
      setCurrentNodeId(nodeId);
    }, 1000); // 1秒ごとにチェック

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>Figma プロトタイプ</h1>
      <FigmaPrototypeEmbed
        prototypeUrl={prototypeUrl}
        width="100%"
        height="600px"
      />

      <div style={{ marginTop: "20px" }}>
        <h2>現在表示しているノードID</h2>
        <p>{currentNodeId || "取得中..."}</p>

        <h2>プロトタイプのノード一覧</h2>
        {error ? (
          <p>エラー: {error}</p>
        ) : nodes.length > 0 ? (
          <ul>
            {nodes.map((node) => (
              <li key={node.id}>
                {node.name} ({node.type}) - ID: {node.id}
              </li>
            ))}
          </ul>
        ) : (
          <p>ノード情報を取得中...</p>
        )}
      </div>
    </div>
  );
}
