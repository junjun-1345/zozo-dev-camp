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

type Comment = {
  id: string;
  message: string;
  createdAt: string;
  resolved: boolean; // 解決済みか否か
  user: {
    handle: string;
    img_url: string;
  };
  client_meta: {
    node_id?: string;
  };
};

export default function FigmaFile() {
  const [url, setUrl] = useState("");
  const [fileData, setFileData] = useState<FigmaFile | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [activeFrameId, setActiveFrameId] = useState<string | null>(null);
  const [, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetchFile = async () => {
    const match = url.match(/(?:file|design)\/([a-zA-Z0-9]+)\//);
    if (!match) {
      setError("有効なFigmaファイルURLを入力してください");
      return;
    }

    const fileKey = match[1];
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/figma-files/${fileKey}/frames`);
      const data = await response.json();

      if (response.ok) {
        const frames = data.map((frame: { id: string; name: string }) => ({
          id: frame.id,
          name: frame.name,
        }));

        setFileData({
          key: fileKey,
          name: "Figma File",
          lastModified: new Date().toISOString(),
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

  const handleFrameSelection = async (frame: Frame) => {
    setSelectedFrame(
      `https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/${fileData?.key}?node-id=${frame.id}`
    );
    setActiveFrameId(frame.id);

    if (fileData) {
      try {
        const response = await fetch(
          `/api/figma-files/${fileData.key}/comments`
        );

        if (!response.ok) {
          const text = await response.text();
          console.error("Non-OK Response Text:", text);
          setError("コメントの取得に失敗しました");
          return;
        }

        let data;
        try {
          data = await response.json();
        } catch {
          const text = await response.text();
          console.error("Invalid JSON Response:", text);
          setError("レスポンスが無効です");
          return;
        }

        // フレームIDでコメントをフィルタ
        const frameComments = data.filter(
          (comment: Comment) => comment.client_meta?.node_id === frame.id
        );
        setComments(frameComments);
      } catch (fetchError) {
        console.error("Fetch Error:", fetchError);
        setError("コメントの取得中にエラーが発生しました");
      }
    }
  };

  const toggleResolved = (commentId: string) => {
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, resolved: !comment.resolved }
          : comment
      )
    );
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Figmaファイル情報取得
      </h1>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <input
          type="text"
          value={url || ""} // undefined ではなく空文字列を渡す
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
            {selectedFrame && (
              <iframe
                src={selectedFrame}
                style={{
                  width: "100%",
                  height: "300px",
                  border: "1px solid #CCC",
                  borderRadius: "5px",
                  marginBottom: "20px",
                }}
                allowFullScreen
              ></iframe>
            )}
          </div>

          <div
            style={{
              flex: "0 0 300px",
              overflowY: "scroll",
              maxHeight: "500px",
              borderLeft: "1px solid #CCC",
              paddingLeft: "10px",
            }}
          >
            <h3>コメント</h3>
            {comments.map((comment) => (
              <div
                key={comment.id}
                style={{
                  border: "1px solid #CCC",
                  padding: "10px",
                  marginBottom: "10px",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <input
                  type="checkbox"
                  checked={comment.resolved}
                  onChange={() => toggleResolved(comment.id)}
                />
                <div>
                  <p>
                    <strong>{comment.user.handle}</strong>: {comment.message}
                  </p>
                  <p style={{ fontSize: "12px", color: "#666" }}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
