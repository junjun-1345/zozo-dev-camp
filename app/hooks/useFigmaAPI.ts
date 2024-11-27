import { useState } from "react";
import {
  extractCommentedFrameIds,
  extractFileKeyFromUrl,
} from "../utils/helper";
import { FigmaFile, Comment } from "../types";

export default function useFigmaAPI(initialUrl: string) {
  const [url, setUrl] = useState(initialUrl); // URLの状態管理
  const [fileData, setFileData] = useState<FigmaFile | null>(null); // ファイルデータ
  const [selectedFrame, setSelectedFrame] = useState<string | null>(null); // 選択されたフレームのURL
  const [comments, setComments] = useState<Comment[]>([]); // 全てのコメント
  const [frameComments, setFrameComments] = useState<Comment[]>([]); // 選択されたフレームのコメント
  const [commentedFrameIds, setCommentedFrameIds] = useState<string[]>([]); // コメント付きフレームのID
  const [activeFrameId, setActiveFrameId] = useState<string | null>(null); // アクティブなフレームID
  const [loading, setLoading] = useState(false); // ローディング状態
  const [error, setError] = useState<string | null>(null); // エラー状態

  // Figma ファイルとコメントを取得
  const handleFetchFile = async () => {
    const fileKey = extractFileKeyFromUrl(url); // URLからファイルキーを抽出
    if (!fileKey) {
      setError("有効なFigmaファイルURLを入力してください"); // エラーを設定
      return;
    }

    setLoading(true);
    setError(null); // エラーをリセット
    try {
      // フレームデータを取得
      const fileResponse = await fetch(`/api/figma-files/${fileKey}/frames`);
      if (!fileResponse.ok) {
        throw new Error("ファイル情報の取得に失敗しました");
      }
      const frames = await fileResponse.json();

      // ファイルデータを更新
      setFileData({
        key: fileKey,
        name: "Figma File",
        lastModified: new Date().toISOString(),
        frames,
      });

      // コメントデータを取得
      const commentResponse = await fetch(
        `/api/figma-files/${fileKey}/comments`
      );
      if (!commentResponse.ok) {
        throw new Error("コメント情報の取得に失敗しました");
      }
      const comments = await commentResponse.json();

      // コメントデータを更新
      setComments(comments);
      setCommentedFrameIds(extractCommentedFrameIds(comments));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "未知のエラーが発生しました"
      );
    } finally {
      setLoading(false); // ローディング終了
    }
  };

  // フレーム選択処理
  const handleFrameSelection = (frame: { id: string }) => {
    setSelectedFrame(
      `https://www.figma.com/embed?embed_host=share&url=https://www.figma.com/file/${fileData?.key}?node-id=${frame.id}`
    );
    setActiveFrameId(frame.id);

    // フレーム固有のコメントをフィルタリング
    const frameSpecificComments = comments.filter(
      (comment) => comment.client_meta?.node_id === frame.id
    );
    setFrameComments(frameSpecificComments);
  };

  // コメントを特定のフレームに追加する関数
  const addCommentToFrame = async (frameId: string, message: string) => {
    if (!fileData) {
      setError("ファイルデータが読み込まれていません");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/figma-files/${fileData.key}/comments/add`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          // リクエストボディのフィールド名を'snake_case'に統一
          body: JSON.stringify({ node_id: frameId, message }),
        }
      );

      if (!response.ok) {
        throw new Error("コメントの追加に失敗しました");
      }

      const newComment = await response.json();
      setComments((prevComments) => [...prevComments, newComment]);

      if (activeFrameId === frameId) {
        setFrameComments((prevFrameComments) => [
          ...prevFrameComments,
          newComment,
        ]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "未知のエラーが発生しました"
      );
    } finally {
      setLoading(false);
    }
  };

  const onAddComment = (newComment: Comment) => {
    if (activeFrameId) {
      // コメントリストを更新
      setComments((prevComments) => [...prevComments, newComment]);

      // 選択中フレームのコメントも更新
      setFrameComments((prevFrameComments) => [
        ...prevFrameComments,
        newComment,
      ]);
    } else {
      setError("フレームが選択されていません。");
    }
  };

  return {
    url,
    setUrl, // URLの更新用関数
    fileData,
    selectedFrame,
    frameComments,
    commentedFrameIds,
    activeFrameId,
    loading,
    error, // エラー状態
    setError, // エラー状態を更新する関数
    handleFetchFile, // ファイル取得処理
    handleFrameSelection, // フレーム選択処理
    addCommentToFrame, // コメント追加関数
    onAddComment, // コメント追加関数
  };
}
