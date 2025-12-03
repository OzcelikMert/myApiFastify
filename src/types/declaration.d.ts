import { Session } from '@fastify/secure-session';
import { ISessionAuth } from './services/db/sessionAuth.service';
import { IUserGetParamService } from './services/db/user.service';
import { IUserModel } from './models/user.model';

declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';

declare module 'fastify' {
  export interface FastifyRequest {
    sessionAuth?: Session<ISessionAuth>;
    isFromAdminPanel: boolean;
    cachedAnyServiceResult?: any;
    cachedUserServiceResult?: IUserModel | null;
    isAuthenticated: boolean;
  }

  export interface FastifyReply {
    getResponseTime(): any;
  }
}
