"use client";

import { useState } from "react";

type FigmaFile = {
  key: string;
  name: string;
  lastModified: string;
  thumbnailUrl?: string;
};

type Frame = {
  id: string;
  name: string;
};

export default function FigmaFile() {
  const [url, setUrl] = useState("");
  const [fileData, setFileData] = useState<FigmaFile | null>(null);
  const [frames, setFrames] = useState<Frame[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
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
        setFileData({ key: fileKey, ...data });
        await fetchFrames(fileKey); // フレームを取得
      } else {
        setError(`エラー: ${data.error || "ファイル情報の取得に失敗しました"}`);
      }
    } catch {
      setError("ファイル情報の取得中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const fetchFrames = async (fileKey: string) => {
    try {
      const response = await fetch(`/api/figma-files/${fileKey}`);
      const data = await response.json();

      if (response.ok) {
        setFrames(data);
      } else {
        setError("フレーム情報の取得に失敗しました");
      }
    } catch {
      setError("フレーム情報の取得中にエラーが発生しました");
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
          <h2 style={{ marginTop: "20px" }}>フレーム選択</h2>
          <ul>
            {frames.map((frame) => (
              <li key={frame.id}>
                <button
                  onClick={() =>
                    setSelectedFrame(
                      `https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/${fileData.key}?node-id=${frame.id}`
                    )
                  }
                >
                  {frame.name}
                </button>
              </li>
            ))}
          </ul>

          {selectedFrame && (
            <iframe
              src={selectedFrame}
              style={{
                width: "100%",
                height: "500px",
                border: "none",
                marginTop: "20px",
              }}
              allowFullScreen
            ></iframe>
          )}
        </div>
      )}
    </div>
  );
}
