import React, { useState } from "react";
import { Comment } from "../types";
import { parseMessage } from "../utils/helper";

type CommentSectionProps = {
  frameComments: Comment[];
  onAddCommentToFrame: (frameId: string, message: string) => Promise<void>;
  activeFrameId: string | null; // 選択中のフレームID
};

export default function CommentSection({
  frameComments,
  onAddCommentToFrame,
  activeFrameId,
}: CommentSectionProps) {
  const [commentText, setCommentText] = useState(""); // コメント本文
  const [labelText, setLabelText] = useState(""); // ラベル
  const [loading, setLoading] = useState(false); // コメント送信中の状態管理

  const handleAddComment = async () => {
    if (!commentText.trim()) {
      alert("コメント内容を入力してください。");
      return;
    }

    if (!activeFrameId) {
      alert("フレームが選択されていません。");
      return;
    }

    const message = labelText ? `#${labelText} ${commentText}` : commentText;

    setLoading(true);
    try {
      await onAddCommentToFrame(activeFrameId, message); // Figma APIに送信
      setCommentText(""); // 入力欄をクリア
      setLabelText(""); // ラベル欄をクリア
    } catch (error) {
      console.error("コメントの追加に失敗しました:", error);
      alert("コメントの追加に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  const sortedComments = frameComments
    .map((comment) => {
      const { label, content } = parseMessage(comment.message);
      return { ...comment, label, content };
    })
    .sort((a, b) => (a.label || "").localeCompare(b.label || "")); // ラベルでソート

  const getLabelColor = (label: string) => {
    const colors = ["#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#FFC733"];
    const hash = [...label].reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div
      style={{
        flex: "1",
        maxHeight: "100%",
        overflowY: "auto",
        padding: "10px",
        backgroundColor: "#f9f9f9",
        borderRadius: "5px",
      }}
    >
      <h3 style={{ marginBottom: "20px", fontSize: "18px", color: "#333" }}>
        コメント
      </h3>

      {/* コメント追加フォーム */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="ラベル（任意）"
          value={labelText}
          onChange={(e) => setLabelText(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            fontSize: "14px",
            border: "1px solid #CCC",
            borderRadius: "5px",
          }}
        />
        <textarea
          placeholder="コメントを入力してください"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          style={{
            width: "100%",
            height: "80px",
            padding: "10px",
            fontSize: "14px",
            border: "1px solid #CCC",
            borderRadius: "5px",
            marginBottom: "10px",
          }}
        />
        <button
          onClick={handleAddComment}
          disabled={loading}
          style={{
            padding: "10px 20px",
            backgroundColor: loading ? "#ccc" : "#007BFF",
            color: "#FFF",
            fontSize: "14px",
            border: "none",
            borderRadius: "5px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "送信中..." : "コメントを追加"}
        </button>
      </div>

      {/* コメントリスト */}
      {sortedComments.length > 0 ? (
        sortedComments.map((comment) => (
          <div
            key={comment.id}
            style={{
              backgroundColor: "#fff",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <p
              style={{
                marginBottom: "8px",
                fontSize: "16px",
                fontWeight: "bold",
                color: "#007BFF",
              }}
            >
              {comment.user.handle}
            </p>
            {comment.label && (
              <span
                style={{
                  display: "inline-block",
                  backgroundColor: getLabelColor(comment.label),
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: "bold",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  marginBottom: "8px",
                }}
              >
                {comment.label}
              </span>
            )}
            <p
              style={{
                marginBottom: "8px",
                fontSize: "14px",
                color: "#555",
                lineHeight: "1.5",
              }}
            >
              {comment.content}
            </p>
          </div>
        ))
      ) : (
        <p style={{ textAlign: "center", color: "#666", fontSize: "14px" }}>
          このフレームにはコメントがありません。
        </p>
      )}
    </div>
  );
}
