import { ISessionAuthUser } from "types/services/db/sessionAuth.service";

export type IAuthLoginResultController = {
    tokenId?: string;
    statusId?: StatusId;
    banDateEnd?: Date;
    banComment?: string;
} & ISessionAuthUser;