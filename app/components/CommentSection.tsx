import React from "react";
import { Comment } from "../types";
import { parseMessage } from "../utils/helper";

type CommentSectionProps = {
  frameComments: Comment[];
};

// ラベルごとの色を設定する関数
const getLabelColor = (label: string) => {
  const colors = [
    "#FF5733", // レッド系
    "#33FF57", // グリーン系
    "#3357FF", // ブルー系
    "#FF33A1", // ピンク系
    "#FFC733", // イエロー系
  ];
  const hash = [...label].reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
};

export default function CommentSection({ frameComments }: CommentSectionProps) {
  // コメントをラベルごとに分類
  const sortedComments = frameComments
    .map((comment) => {
      const { label, content } = parseMessage(comment.message);
      return { ...comment, label, content };
    })
    .sort((a, b) => (a.label || "").localeCompare(b.label || ""));

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
                  backgroundColor: getLabelColor(comment.label), // ラベルごとの色
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
            <p style={{ fontSize: "12px", color: "#999", textAlign: "right" }}>
              {new Date(comment.createdAt).toLocaleString()}
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
