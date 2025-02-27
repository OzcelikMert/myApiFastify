export interface IOnlineUser {
  ip: string;
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IConfig {
  passwordSalt: string;
  publicFolders: string[][];
  viewers: Omit<IOnlineUser, '_id'>[];
  onlineUsers: IOnlineUser[];
  paths: {
    root: string;
    uploads: {
      images: string;
      flags: string;
      video: string;
      static: string;
    };
  };
  defaultLangId: string;
}
