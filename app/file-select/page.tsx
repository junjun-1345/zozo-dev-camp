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
  client_meta: {
    node_id?: string;
  };
  user: {
    handle: string;
  };
  createdAt: string;
};

export default function FigmaFile() {
  const [url, setUrl] = useState("");
  const [fileData, setFileData] = useState<FigmaFile | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [frameComments, setFrameComments] = useState<Comment[]>([]); // 選択フレームのコメント
  const [commentedFrameIds, setCommentedFrameIds] = useState<string[]>([]); // コメント付きフレームID
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
      const fileResponse = await fetch(`/api/figma-files/${fileKey}/frames`);
      const fileData = await fileResponse.json();

      if (!fileResponse.ok) {
        setError("ファイル情報の取得に失敗しました");
        return;
      }

      const frames = fileData.map((frame: { id: string; name: string }) => ({
        id: frame.id,
        name: frame.name,
      }));

      setFileData({
        key: fileKey,
        name: "Figma File",
        lastModified: new Date().toISOString(),
        frames,
      });

      const commentResponse = await fetch(
        `/api/figma-files/${fileKey}/comments`
      );
      const commentData = await commentResponse.json();

      if (!commentResponse.ok) {
        setError("コメント情報の取得に失敗しました");
        return;
      }

      setComments(commentData);

      // コメント付きフレームIDを抽出
      const frameIdsWithComments = commentData
        .map((comment: Comment) => comment.client_meta?.node_id)
        .filter((id: string | undefined) => id); // IDが存在する場合のみ
      setCommentedFrameIds(frameIdsWithComments);
    } catch (error) {
      console.error("Fetch Error:", error);
      setError("データの取得中にエラーが発生しました");
    } finally {
      setLoading(false);
    }
  };

  const handleFrameSelection = (frame: Frame) => {
    setSelectedFrame(
      `https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/${fileData?.key}?node-id=${frame.id}`
    );
    setActiveFrameId(frame.id);

    // 選択されたフレームのコメントをフィルタ
    const frameSpecificComments = comments.filter(
      (comment) => comment.client_meta?.node_id === frame.id
    );
    setFrameComments(frameSpecificComments); // 選択されたフレームのコメントだけ表示
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
          {/* フレーム一覧 */}
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

          {/* フレーム表示 */}
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

          {/* コメントエリア */}
          <div
            style={{
              flex: "1",
              maxHeight: "500px",
              overflowY: "scroll",
              border: "1px solid #CCC",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <h3>コメント</h3>
            {frameComments.length > 0 ? (
              frameComments.map((comment) => (
                <div
                  key={comment.id}
                  style={{
                    border: "1px solid #CCC",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "5px",
                  }}
                >
                  <p>
                    <strong>{comment.user.handle}</strong>: {comment.message}
                  </p>
                  <p style={{ fontSize: "12px", color: "#666" }}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p>このフレームにはコメントがありません。</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
