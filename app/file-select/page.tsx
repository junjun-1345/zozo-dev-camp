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
  const [activeFrameId, setActiveFrameId] = useState<string | null>(null); // 選択中のフレーム
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

  const handleFrameSelection = (frame: Frame) => {
    setSelectedFrame(
      `https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/${fileData?.key}?node-id=${frame.id}`
    );
    setActiveFrameId(frame.id);
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
          onChange={(e) => setUrl(e.target.value)}
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
      </div>

      {error && (
        <p style={{ color: "red", marginTop: "10px", textAlign: "center" }}>
          <strong>{error}</strong>
        </p>
      )}

      {fileData && (
        <div
          style={{
            marginTop: "20px",
            padding: "20px",
            border: "1px solid #CCC",
            borderRadius: "5px",
          }}
        >
          <h2 style={{ textAlign: "center" }}>フレーム選択</h2>
          <div
            style={{
              display: "flex",
              overflowX: "auto",
              borderBottom: "2px solid #CCC",
              marginBottom: "20px",
            }}
          >
            {frames.map((frame) => (
              <button
                key={frame.id}
                onClick={() => handleFrameSelection(frame)}
                style={{
                  flex: "0 0 auto",
                  padding: "10px 20px",
                  margin: "5px",
                  backgroundColor:
                    activeFrameId === frame.id ? "#007BFF" : "#FFF",
                  color: activeFrameId === frame.id ? "#FFF" : "#000",
                  border:
                    activeFrameId === frame.id
                      ? "2px solid #0056b3"
                      : "1px solid #CCC",
                  borderRadius: "5px",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                {frame.name}
              </button>
            ))}
          </div>

          {selectedFrame && (
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
          )}
        </div>
      )}
    </div>
  );
}
