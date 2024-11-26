import { Comment } from "../types";

export const extractCommentedFrameIds = (comments: Comment[]): string[] => {
  return comments
    .map((comment) => comment.client_meta?.node_id)
    .filter((id): id is string => !!id); // IDが存在する場合のみ返す
};

export const extractFileKeyFromUrl = (url: string): string | null => {
  const match = url.match(/(?:file|design)\/([a-zA-Z0-9]+)\//);
  return match ? match[1] : null;
};

// コメントメッセージをラベルと本文に分割するヘルパー関数
export const parseMessage = (message: string) => {
  const labelMatch = message.match(/#(\S+)/); // #からスペースまでを取得
  const label = labelMatch ? labelMatch[1] : null; // ラベル部分 (#を除く)
  const content = labelMatch
    ? message.replace(labelMatch[0], "").trim()
    : message; // ラベルを除いた本文
  return { label, content };
};

// コメントをラベルごとに分類
const sortedComments = frameComments
  .map((comment) => {
    const { label, content } = parseMessage(comment.message);
    return { ...comment, label, content };
  })
  .sort((a, b) => (a.label || "").localeCompare(b.label || "")); // ラベルでソート
