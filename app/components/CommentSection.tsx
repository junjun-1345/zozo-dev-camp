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
        maxHeight: "500px",
        overflowY: "scroll",
        border: "1px solid #CCC",
        borderRadius: "5px",
        padding: "10px",
      }}
    >
      <h3>コメント</h3>
      {frameComments.length > 0 ? (
        frameComments.map((comment) => (
          <div
            key={comment.id}
            style={{
              border: "1px solid #CCC",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
          >
            <p>
              <strong>{comment.user.handle}</strong>: {comment.message}
            </p>
            <p style={{ fontSize: "12px", color: "#666" }}>
              {new Date(comment.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <p>このフレームにはコメントがありません。</p>
      )}
    </div>
  );
}
