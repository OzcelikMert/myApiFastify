import {FastifyReply, FastifyRequest} from 'fastify';
import {ApiResult} from "../library/api/result";
import {LogMiddleware} from "./log.middleware";
import {PermissionUtil} from "../utils/permission.util";
import {UserRoleId} from "../constants/userRoles";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import {ISettingPutContactFormSchema, ISettingPutSocialMediaSchema} from "../schemas/setting.schema";
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
            let reqToCheck = reqData.body.socialMedia.map(item => ({
                _id: item._id,
                key: item.key,
                title: item.title,
            }))

            let serviceToCheck = serviceResult.socialMedia.map(item => ({
                _id: item._id,
                key: item.key,
                title: item.title,
            }))

            if (JSON.stringify(reqToCheck) != JSON.stringify(serviceToCheck)) {
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

const checkPermissionForContactForms = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let apiResult = new ApiResult();

        let reqData = req as ISettingPutContactFormSchema;

        let serviceResult = await SettingService.get({projection: SettingProjectionKeys.ContactForm});

        if (serviceResult && !PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.SuperAdmin)) {
            let reqToCheck = reqData.body.contactForms.map(item => ({
                _id: item._id,
                key: item.key,
            }))

            let serviceToCheck = serviceResult.contactForms.map(item => ({
                _id: item._id,
                key: item.key,
            }))

            if (JSON.stringify(reqToCheck) != JSON.stringify(serviceToCheck)) {
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
    checkPermissionForSocialMedia: checkPermissionForSocialMedia,
    checkPermissionForContactForms: checkPermissionForContactForms
};