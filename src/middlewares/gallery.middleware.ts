import {FastifyRequest, FastifyReply} from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import logMiddleware from "./log.middleware";
import {UserRoleId} from "../constants/userRoles";
import galleryService from "../services/gallery.service";
import {GallerySchemaDeleteManyDocument} from "../schemas/gallery.schema";
import permissionUtil from "../utils/permission.util";

export default {
    checkManyIsAuthor: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as GallerySchemaDeleteManyDocument;

            if (!permissionUtil.checkPermissionRoleRank(UserRoleId.Editor, req.sessionAuth.user!.roleId)) {
                let gallery = await galleryService.getMany({
                    name: reqData.body.name
                });

                if (gallery) {
                    for (const item of gallery) {
                        if (item.authorId.toString() != req.sessionAuth.user?.userId.toString()) {
                            serviceResult.status = false;
                            serviceResult.errorCode = ErrorCodes.noPerm;
                            serviceResult.statusCode = StatusCodes.forbidden;
                            break;
                        }
                    }
                }
            }

            if (!serviceResult.status) {
                reply.status(serviceResult.statusCode).send(serviceResult)
            }
        });
    },
};