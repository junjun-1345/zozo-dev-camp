"use client";

import { useState } from "react";
import FrameList from "./FrameList";
import FrameDisplay from "./FrameDisplay";
import CommentSection from "./CommentSection";
import useFigmaAPI from "../hooks/useFigmaAPI";

export default function FigmaFile() {
  const [url, setUrl] = useState(""); // URLの状態管理
  const {
    fileData,
    selectedFrame,
    frameComments,
    commentedFrameIds,
    activeFrameId,
    handleFetchFile,
    handleFrameSelection,
    setUrl: updateApiUrl, // API側のURL更新
    loading,
    error, // エラー状態
  } = useFigmaAPI(url);

  const handleInputChange = (value: string) => {
    setUrl(value); // URLのローカル状態を更新
    updateApiUrl(value); // APIのURLを更新
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Figmaファイル情報取得
      </h1>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <input
          type="text"
          placeholder="FigmaファイルURLを入力"
          value={url}
          onChange={(e) => handleInputChange(e.target.value)} // 状態更新
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
            fontSize: "16px",
            border: "1px solid #CCC",
            borderRadius: "5px",
          }}
        />
        <button
          onClick={handleFetchFile}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "16px",
            backgroundColor: "#007BFF",
            color: "#FFF",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          disabled={loading}
        >
          {loading ? "取得中..." : "ファイル情報を取得"}
        </button>
        {error && (
          <p
            style={{
              marginTop: "10px",
              color: "red",
              textAlign: "center",
            }}
          >
            {error}
          </p>
        )}
      </div>

      {fileData && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #CCC",
            borderRadius: "5px",
            display: "flex",
            gap: "20px",
            alignItems: "flex-start",
          }}
        >
          <FrameList
            frames={fileData.frames}
            activeFrameId={activeFrameId}
            commentedFrameIds={commentedFrameIds}
            onSelect={handleFrameSelection}
          />
          <FrameDisplay selectedFrame={selectedFrame} />
          <CommentSection frameComments={frameComments} />
        </div>
      )}
    </div>
  );
}
