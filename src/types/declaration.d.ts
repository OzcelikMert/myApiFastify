import {SessionAuthDocument} from "./models/sessionAuth.model";
import {Session} from "@fastify/secure-session";

declare module "*.png";
declare module "*.svg";
declare module "*.jpeg";
declare module "*.jpg";

declare module 'fastify' {
    interface FastifyRequest {
        sessionAuth: Session<SessionAuthDocument>
    }
}