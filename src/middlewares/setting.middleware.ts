import {FastifyReply, FastifyRequest} from 'fastify';
import {ApiResult} from "../library/api/result";
import {LogMiddleware} from "./log.middleware";
import {PermissionUtil} from "../utils/permission.util";
import {UserRoleId} from "../constants/userRoles";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import {ISettingPutSocialMediaSchema} from "../schemas/setting.schema";
import {SettingService} from "../services/setting.service";
import {SettingProjectionKeys} from "../constants/settingProjections";

const check = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

const checkPermissionForSocialMedia = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as ISettingPutSocialMediaSchema;

        let serviceResult = await SettingService.get({projection: SettingProjectionKeys.SocialMedia});

        if (serviceResult && !PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.SuperAdmin)) {
            if(
                reqData.body.socialMedia.length != serviceResult.socialMedia.length ||
                !reqData.body.socialMedia.every(reqElement => serviceResult?.socialMedia.some(serviceElement => reqElement._id == serviceElement._id))
            ){
                apiResult.status = false;
                apiResult.errorCode = ApiErrorCodes.noPerm;
                apiResult.statusCode = ApiStatusCodes.forbidden;
            }
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

export const SettingMiddleware = {
    check: check,
    checkPermissionForSocialMedia: checkPermissionForSocialMedia
};