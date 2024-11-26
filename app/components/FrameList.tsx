import React from "react";
import { Frame } from "../types";
import { FaCommentDots } from "react-icons/fa"; // コメントアイコンをインポート

type FrameListProps = {
  frames: Frame[];
  activeFrameId: string | null;
  commentedFrameIds: string[];
  onSelect: (frame: Frame) => void;
};

export default function FrameList({
  frames,
  activeFrameId,
  commentedFrameIds,
  onSelect,
}: FrameListProps) {
  return (
    <div
      style={{
        flex: "0 0 250px", // 幅を広げる
        overflowY: "auto", // スクロール可能にする
        height: "100%", // 親要素に基づいて高さを調整
        padding: "10px",
        backgroundColor: "#f9f9f9",
        boxShadow: "2px 0 4px rgba(0, 0, 0, 0.1)", // 右側に軽い影を追加
      }}
    >
      <h3 style={{ marginBottom: "20px", fontSize: "18px", color: "#333" }}>
        フレーム一覧
      </h3>
      {frames.map((frame) => (
        <button
          key={frame.id}
          onClick={() => onSelect(frame)}
          style={{
            display: "block",
            width: "100%",
            padding: "15px",
            marginBottom: "10px",
            textAlign: "left",
            backgroundColor: activeFrameId === frame.id ? "#007BFF" : "#FFF",
            color: activeFrameId === frame.id ? "#FFF" : "#000",
            border: "none",
            borderRadius: "8px",
            boxShadow:
              activeFrameId === frame.id
                ? "0 2px 4px rgba(0, 0, 0, 0.2)"
                : "0 1px 3px rgba(0, 0, 0, 0.1)",
            cursor: "pointer",
            position: "relative",
            transition: "all 0.3s ease",
          }}
        >
          {frame.name}
          {commentedFrameIds.includes(frame.id) && (
            <FaCommentDots
              style={{
                position: "absolute",
                top: "50%",
                right: "15px",
                transform: "translateY(-50%)",
                color: "#888", // 弱い色に変更
                fontSize: "16px",
              }}
            />
          )}
        </button>
      ))}
    </div>
  );
}
