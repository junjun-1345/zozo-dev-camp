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
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>全コメント</h1>
      {comments.length > 0 ? (
        <ul style={{ textAlign: "left", margin: "0 auto", maxWidth: "600px" }}>
          {comments.map((comment) => (
            <li key={comment.id}>
              <p>
                <strong>{comment.user.handle}</strong>: {comment.message}
              </p>
              <p>日時: {new Date(comment.created_at).toLocaleString()}</p>
              {comment.client_meta?.node_id && (
                <p>ノードID: {comment.client_meta.node_id}</p>
              )}
              {comment.resolved_at && <p>解決済み</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p>コメントがありません。</p>
      )}
    </div>
  );
}
