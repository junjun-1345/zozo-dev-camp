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
