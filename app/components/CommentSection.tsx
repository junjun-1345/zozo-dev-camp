import React from "react";
import { Comment } from "../types";

type CommentSectionProps = {
  frameComments: Comment[];
};

export default function CommentSection({ frameComments }: CommentSectionProps) {
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
      {frameComments.length > 0 ? (
        frameComments.map((comment) => (
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
            <p
              style={{
                marginBottom: "8px",
                fontSize: "14px",
                color: "#555",
                lineHeight: "1.5",
              }}
            >
              {comment.message}
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
