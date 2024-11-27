"use client";

import { useState, useEffect } from "react";
import FrameList from "./FrameList";
import CommentSection from "./CommentSection";
import useFigmaAPI from "../hooks/useFigmaAPI";
import Link from "next/link";

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
    addCommentToFrame,
    setUrl: updateApiUrl,
    loading,
    error,
    setError, // エラー状態を更新する関数
  } = useFigmaAPI(url);

  const handleInputChange = (value: string) => {
    setUrl(value);
    updateApiUrl(value);
  };

  // エラーを一定時間後に消す
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null); // エラーをリセット
      }, 5000); // 5秒後にエラーを消す

      return () => clearTimeout(timer); // クリーンアップ
    }
  }, [error, setError]);

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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* 左側のロゴやタイトル */}
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "bold" }}>
          Figmaファイル情報取得
        </h1>

        {/* 中央の入力フォームとボタン */}
        <div
          style={{
            flex: 1,
            maxWidth: "600px",
            margin: "0 20px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            placeholder="FigmaファイルURLを入力"
            value={url}
            onChange={(e) => handleInputChange(e.target.value)}
            style={{
              flex: 1,
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #CCC",
              borderRadius: "5px",
              marginRight: "10px",
            }}
          />
          <button
            onClick={handleFetchFile}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#007BFF",
              color: "#FFF",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            disabled={loading}
          >
            {loading ? "取得中..." : "取得"}
          </button>
        </div>

        {/* 右側のトップページに戻るボタン */}
        <Link
          href="/"
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            backgroundColor: "#6c757d",
            color: "#FFF",
            textDecoration: "none",
            borderRadius: "5px",
          }}
        >
          トップに戻る
        </Link>
      </header>

      {/* エラー表示 */}
      {error && (
        <div
          style={{
            backgroundColor: "#f8d7da",
            color: "#721c24",
            padding: "10px 20px",
            textAlign: "center",
            marginTop: "10px",
          }}
        >
          {error}
        </div>
      )}

      {/* コンテンツ */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* フレームリスト */}
        {fileData && (
          <div
            style={{
              width: "250px",
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
                height: "100%",
                border: "none",
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
              width: "350px",
              overflowY: "auto",
              padding: "10px",
              backgroundColor: "#f1f1f1",
            }}
          >
            <CommentSection
              frameComments={frameComments}
              onAddCommentToFrame={addCommentToFrame}
              activeFrameId={activeFrameId}
            />
          </div>
        )}
      </div>
    </div>
  );
}
