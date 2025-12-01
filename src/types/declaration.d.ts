import { Session } from '@fastify/secure-session';
import { ISessionAuth } from './services/sessionAuth.service';

declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';

declare module 'fastify' {
  export interface FastifyRequest {
    sessionAuth?: Session<ISessionAuth>;
    isFromAdminPanel: boolean;
    cachedServiceResult?: any;
    isAuthenticated: boolean;
  }

  export interface FastifyReply {
    getResponseTime(): any;
  }
}
