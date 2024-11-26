"use client";

import { useEffect, useState } from "react";

interface Comment {
  id: string;
  message: string;
  user: { handle: string };
  created_at: string;
  resolved_at: string | null;
  client_meta?: { node_id: string }; // コメントによってはnode_idがない場合もある
}

export default function FigmaCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Figmaファイルのキー
  const fileKey = "HsNAn1JTvE8DACXGxW2eAJ"; // 実際のFigmaファイルキーを設定

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("/api/figma-comments");
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();

        // コメントデータをそのままセット
        setComments(data.comments);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, []);

  if (loading) return <p>コメントを取得中...</p>;
  if (error) return <p>エラーが発生しました: {error}</p>;

  return (
    <div style={{ display: "flex", flexDirection: "row", marginTop: "50px" }}>
      {/* コメントリスト */}
      <div
        style={{ width: "30%", padding: "10px", borderRight: "1px solid #ddd" }}
      >
        <h2>コメント一覧</h2>
        {comments.length > 0 ? (
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {comments.map((comment) => (
              <li
                key={comment.id}
                style={{
                  marginBottom: "10px",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "5px",
                  cursor: "pointer",
                  backgroundColor:
                    selectedNodeId === comment.client_meta?.node_id
                      ? "#f0f8ff"
                      : "#fff",
                }}
                onClick={() =>
                  setSelectedNodeId(comment.client_meta?.node_id || null)
                }
              >
                <p>
                  <strong>{comment.user.handle}</strong>: {comment.message}
                </p>
                <p>日時: {new Date(comment.created_at).toLocaleString()}</p>
                {comment.resolved_at && <p>解決済み</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p>コメントがありません。</p>
        )}
      </div>

      {/* Figma埋め込みビュー */}
      <div style={{ width: "70%", padding: "10px" }}>
        <h2>デザインビュー</h2>
        {selectedNodeId ? (
          <iframe
            style={{ width: "100%", height: "600px", border: "none" }}
            src={`https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/${fileKey}?node-id=${encodeURIComponent(
              selectedNodeId
            )}`}
            allowFullScreen
          ></iframe>
        ) : (
          <p>コメントを選択すると、対応するデザインがここに表示されます。</p>
        )}
      </div>
    </div>
  );
}
