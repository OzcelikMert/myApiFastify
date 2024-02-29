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
        let apiResult = new ApiResult();

        let reqData = req as IGalleryDeleteManySchema;

        if (!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor)) {
            let gallery = await GalleryService.getMany({
                name: reqData.body._id
            });

            if (gallery) {
                for (const item of gallery) {
                    if (item.authorId._id.toString() != req.sessionAuth!.user?.userId.toString()) {
                        apiResult.status = false;
                        apiResult.errorCode = ApiErrorCodes.noPerm;
                        apiResult.statusCode = ApiStatusCodes.forbidden;
                        break;
                    }
                }
            }
        }

        if (!apiResult.status) {
            await reply.status(apiResult.statusCode).send(apiResult)
        }
    });
}

export const GalleryMiddleware = {
    checkManyIsAuthor: checkManyIsAuthor,
};