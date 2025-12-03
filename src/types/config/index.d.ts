import { WebSocket } from "@fastify/websocket";

export interface IOnlineUser {
  ip: string;
  _id: string;
  createdAt: Date;
  connection: WebSocket
}

export interface IConfig {
  passwordSalt: string;
  publicFolders: string[][];
  visitorCount: number;
  onlineUsers: IOnlineUser[];
  defaultLangId: string;
}
