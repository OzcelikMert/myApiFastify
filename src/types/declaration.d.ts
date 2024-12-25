import { Session } from '@fastify/secure-session';
import { ISessionAuthResultService } from './services/sessionAuth.service';

declare module '*.png';
declare module '*.svg';
declare module '*.jpeg';
declare module '*.jpg';

declare module 'fastify' {
  export interface FastifyRequest {
    sessionAuth?: Session<ISessionAuthResultService>;
    isFromAdminPanel: boolean;
    cachedServiceResult?: any;
  }

  export interface FastifyReply {
    getResponseTime(): any;
  }
}
