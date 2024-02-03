import {FastifyRequest, FastifyReply} from 'fastify';
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import logMiddleware from "./log.middleware";
import {UserRoleId} from "../constants/userRoles";
import galleryService from "../services/gallery.service";
import {GallerySchemaDeleteManyDocument} from "../schemas/gallery.schema";
import permissionUtil from "../utils/permission.util";

const checkManyIsAuthor = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        let reqData = req as GallerySchemaDeleteManyDocument;

        if (!permissionUtil.checkPermissionRoleRank(UserRoleId.Editor, req.sessionAuth.user!.roleId)) {
            let gallery = await galleryService.getMany({
                name: reqData.body.name
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

export default {
    checkManyIsAuthor: checkManyIsAuthor,
};