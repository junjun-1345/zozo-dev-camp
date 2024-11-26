export type FigmaFile = {
  key: string;
  name: string;
  lastModified: string;
  frames: Frame[];
};

export type Frame = {
  id: string;
  name: string;
};

export type ClientMeta = {
  node_id?: string;
};

export type Comment = {
  id: string;
  message: string;
  client_meta?: ClientMeta; // 修正: client_meta を追加
  user: {
    handle: string;
  };
  createdAt: string;
};
