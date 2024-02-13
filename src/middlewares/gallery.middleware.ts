import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import {LogMiddleware} from "./log.middleware";
import {UserRoleId} from "../constants/userRoles";
import {GalleryService} from "../services/gallery.service";
import {IGalleryDeleteManySchema} from "../schemas/gallery.schema";
import {PermissionUtil} from "../utils/permission.util";

const checkManyIsAuthor = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as IGalleryDeleteManySchema;

        if (!PermissionUtil.checkPermissionRoleRank(UserRoleId.Editor, req.sessionAuth.user!.roleId)) {
            let gallery = await GalleryService.getMany({
                name: reqData.body._id
            });

            if (gallery) {
                for (const item of gallery) {
                    if (item.authorId.toString() != req.sessionAuth.user?.userId.toString()) {
                        serviceResult.status = false;
                        serviceResult.errorCode = ApiErrorCodes.noPerm;
                        serviceResult.statusCode = ApiStatusCodes.forbidden;
                        break;
                    }
                }
            }
        }

        if (!serviceResult.status) {
            reply.status(serviceResult.statusCode).send(serviceResult)
        }
    });
}

export const GalleryMiddleware = {
    checkManyIsAuthor: checkManyIsAuthor,
};