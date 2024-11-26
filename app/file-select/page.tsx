"use client";

import { useState } from "react";

type FigmaFile = {
  key: string;
  name: string;
  lastModified: string;
  frames: Frame[];
};

type Frame = {
  id: string;
  name: string;
};

export default function FigmaFile() {
  const [url, setUrl] = useState("");
  const [fileData, setFileData] = useState<FigmaFile | null>(null);
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
        // フレーム情報を直接取得
        const frames = data.map((frame: { id: string; name: string }) => ({
          id: frame.id,
          name: frame.name,
        }));

        setFileData({
          key: fileKey,
          name: "Figma File",
          lastModified: new Date().toISOString(), // 仮の値を設定
          frames,
        });
      } else {
        setError(`エラー: ${data.error || "ファイル情報の取得に失敗しました"}`);
      }
    } catch (error) {
      console.error("Fetch Error:", error);
      setError("ファイル情報の取得中にエラーが発生しました");
    } finally {
      setLoading(false);
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
            display: "flex",
            gap: "20px",
          }}
        >
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
            {fileData.frames.map((frame) => (
              <button
                key={frame.id}
                onClick={() => handleFrameSelection(frame)}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px",
                  marginBottom: "5px",
                  textAlign: "left",
                  backgroundColor:
                    activeFrameId === frame.id ? "#007BFF" : "#FFF",
                  color: activeFrameId === frame.id ? "#FFF" : "#000",
                  border:
                    activeFrameId === frame.id
                      ? "2px solid #0056b3"
                      : "1px solid #CCC",
                  borderRadius: "5px",
                  cursor: "pointer",
                }}
              >
                {frame.name}
              </button>
            ))}
          </div>
          <div style={{ flex: "1" }}>
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
        </div>
      )}
    </div>
  );
}
