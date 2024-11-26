"use client";

import { useState } from "react";
import FrameList from "./FrameList";
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
    setUrl: updateApiUrl,
    loading,
    error,
  } = useFigmaAPI(url);

  const handleInputChange = (value: string) => {
    setUrl(value);
    updateApiUrl(value);
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ヘッダー */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          backgroundColor: "#f8f9fa",
          padding: "10px 20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
          Figmaファイル情報取得
        </h1>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <input
            type="text"
            placeholder="FigmaファイルURLを入力"
            value={url}
            onChange={(e) => handleInputChange(e.target.value)}
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
      </header>

      {/* コンテンツ */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* フレームリスト */}
        {fileData && (
          <div
            style={{
              width: "250px", // 幅を広げました
              overflowY: "auto",
              padding: "10px",
              backgroundColor: "#f1f1f1",
            }}
          >
            <FrameList
              frames={fileData.frames}
              activeFrameId={activeFrameId}
              commentedFrameIds={commentedFrameIds}
              onSelect={handleFrameSelection}
            />
          </div>
        )}

        {/* Figma画面 */}
        <div style={{ flex: 1, height: "100%", overflow: "hidden" }}>
          {selectedFrame ? (
            <iframe
              src={selectedFrame}
              style={{
                width: "100%",
                height: "100%", // 縦いっぱいに表示
                border: "none", // 枠線を削除
              }}
              allowFullScreen
            ></iframe>
          ) : (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              フレームを選択してください
            </p>
          )}
        </div>

        {/* コメントセクション */}
        {fileData && (
          <div
            style={{
              width: "350px", // 幅を広げました
              overflowY: "auto",
              padding: "10px",
              backgroundColor: "#f1f1f1",
            }}
          >
            <CommentSection frameComments={frameComments} />
          </div>
        )}
      </div>
    </div>
  );
}
