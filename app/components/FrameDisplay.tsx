import React from "react";

type FrameDisplayProps = {
  selectedFrame: string | null;
};

export default function FrameDisplay({ selectedFrame }: FrameDisplayProps) {
  return (
    <div style={{ flex: "2" }}>
      {selectedFrame ? (
        <iframe
          src={selectedFrame}
          style={{
            width: "100%",
            height: "500px",
            border: "1px solid #CCC",
            borderRadius: "5px",
          }}
          allowFullScreen
        ></iframe>
      ) : (
        <p style={{ textAlign: "center" }}>フレームを選択してください</p>
      )}
    </div>
  );
}
