import React from "react";
import { Frame } from "../types";

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
        flex: "0 0 200px",
        overflowY: "scroll",
        maxHeight: "500px",
        borderRight: "1px solid #CCC",
        paddingRight: "10px",
      }}
    >
      <h3>フレーム一覧</h3>
      {frames.map((frame) => (
        <button
          key={frame.id}
          onClick={() => onSelect(frame)}
          style={{
            display: "block",
            width: "100%",
            padding: "10px",
            marginBottom: "5px",
            textAlign: "left",
            backgroundColor: activeFrameId === frame.id ? "#007BFF" : "#FFF",
            color: activeFrameId === frame.id ? "#FFF" : "#000",
            border:
              activeFrameId === frame.id
                ? "2px solid #0056b3"
                : "1px solid #CCC",
            borderRadius: "5px",
            cursor: "pointer",
            position: "relative",
          }}
        >
          {frame.name}
          {commentedFrameIds.includes(frame.id) && (
            <span
              style={{
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                backgroundColor: "red",
                color: "white",
                padding: "2px 6px",
                borderRadius: "50%",
                fontSize: "12px",
                fontWeight: "bold",
              }}
            >
              !
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
