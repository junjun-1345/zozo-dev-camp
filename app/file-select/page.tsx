"use client";

import { useState } from "react";
import Image from "next/image";

type FigmaFile = {
  key: string;
  name: string;
  lastModified: string;
  thumbnailUrl?: string;
};

export default function FigmaFile() {
  const [url, setUrl] = useState("");
  const [fileData, setFileData] = useState<FigmaFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetchFile = async () => {
    const match = url.match(/(?:file|design)\/([a-zA-Z0-9]+)\//); // 「file」または「design」に対応
    if (!match) {
      setError("有効なFigmaファイルURLを入力してください");
      return;
    }

    const fileKey = match[1]; // 抽出されたファイルキー

    setLoading(true);
    setError(null); // エラーをリセット

    try {
      const response = await fetch(`/api/figma-files/${fileKey}`);
      const data = await response.json();

      if (response.ok) {
        setFileData(data);
      } else {
        setError(`エラー: ${data.error || "ファイル情報の取得に失敗しました"}`);
      }
    } catch {
      setError("ファイル情報の取得中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Figmaファイル情報取得</h1>
      <input
        type="text"
        placeholder="FigmaファイルURLを入力"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginBottom: "10px",
          fontSize: "16px",
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
          cursor: "pointer",
        }}
        disabled={loading}
      >
        {loading ? "取得中..." : "ファイル情報を取得"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          <strong>{error}</strong>
        </p>
      )}

      {fileData && (
        <div
          style={{
            marginTop: "20px",
            border: "1px solid #CCC",
            padding: "20px",
          }}
        >
          <h2>ファイル情報</h2>
          <p>
            <strong>名前:</strong> {fileData.name}
          </p>
          <p>
            <strong>最終更新日:</strong>{" "}
            {new Date(fileData.lastModified).toLocaleString()}
          </p>
          {fileData.thumbnailUrl && (
            <>
              <p>
                <strong>サムネイル:</strong>
              </p>
              <Image
                src={fileData.thumbnailUrl}
                alt={fileData.name}
                layout="responsive"
                width={500}
                height={500}
                style={{ maxWidth: "100%", border: "1px solid #CCC" }}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
