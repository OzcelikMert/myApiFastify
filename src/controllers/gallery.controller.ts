import {FastifyReply, FastifyRequest} from 'fastify';
import {DateMask} from "../library/variable"
import {ApiResult} from "../library/api/result";
import {ApiErrorCodes} from "../library/api/errorCodes";
import {ApiStatusCodes} from "../library/api/statusCodes";
import fs, {Stats} from "fs";
import {Config} from "../config";
import path from "path";
import sharp from "sharp";
import multer from "fastify-multer";
import {IGalleryDeleteManySchema, IGalleryGetManySchema} from "../schemas/gallery.schema";
import {LogMiddleware} from "../middlewares/log.middleware";
import {GalleryService} from "../services/gallery.service";
import {PermissionUtil} from "../utils/permission.util";
import {UserRoleId} from "../constants/userRoles";
import {GalleryTypeId} from "../constants/galleryTypeId";
import {IGalleryGetResultService, IGalleryImageProperties} from "../types/services/gallery.service";

const upload: any = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb: any) => {
        let ext = path.extname(file.originalname)?.replace(".", "");
        let filter = ["jpg", "jpeg", "png", "gif"];
        if (filter.includes(ext)) {
            cb(null, true);
        } else {
            cb('Only Images Are Allow', false);
        }
    }
}).single("image");

async function getImageProperties(name: string) {
    return new Promise<IGalleryImageProperties>(resolve => {
        fs.stat(path.resolve(Config.paths.uploads.images, name), (err, stats) => {
            resolve({
                sizeKB: Number(stats.size) / 1024,
                sizeMB: Number(stats.size) / (1024 * 1024),
            });
        })
    });
}

const getManyImage = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<(IGalleryGetResultService & IGalleryImageProperties)[]>();
        serviceResult.data = [];

        const reqData = req as IGalleryGetManySchema;

        let gallery = await GalleryService.getMany({
            ...reqData.query,
            ...(!PermissionUtil.checkPermissionRoleRank(req.sessionAuth!.user!.roleId, UserRoleId.Editor) ? {authorId: req.sessionAuth!.user!.userId.toString()} : {})
        });

        for (const item of gallery) {
            serviceResult.data?.push({
                ...item,
                ...(await getImageProperties(item.name))
            });
        }

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const addImage = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<(IGalleryGetResultService & IGalleryImageProperties)[]>();
        serviceResult.data = [];

        function newName() {
            const timestamp = new Date().getStringWithMask(DateMask.UNIFIED_ALL);
            return `${timestamp}-${Math.randomCustom(1, 999999)}.webp`;
        }

        upload(req, reply, async function (err: any) {
            if (err) {
                console.log(err);
                serviceResult.status = false;
                serviceResult.errorCode = ApiErrorCodes.uploadError;
                serviceResult.statusCode = ApiStatusCodes.badRequest;
                serviceResult.message = JSON.stringify(err);
            }

            try {
                let name = newName();
                while (fs.existsSync(path.resolve(Config.paths.uploads.images, newName()))) {
                    name = newName();
                }

                const file = (req as any).file;
                if (file) {
                    const buffer = file.buffer;
                    let data = await sharp(buffer, {animated: true})
                        .webp({quality: 80, force: true, loop: 0})
                        .toBuffer();

                    await new Promise<number>(resolveCreate => {
                        fs.createWriteStream(path.resolve(Config.paths.uploads.images, name)).write(data, (error: any) => {
                            resolveCreate(0);
                        });
                    })

                    let insertedData = await GalleryService.add({
                        oldName: file.originalname,
                        name: name,
                        authorId: req.sessionAuth!.user!.userId,
                        typeId: GalleryTypeId.Image
                    });

                    if(insertedData){
                        let image = await GalleryService.getOne({_id: insertedData._id.toString()});

                        if (image) {
                            serviceResult.data?.push({
                                ...image,
                                ...(await getImageProperties(insertedData.name))
                            });
                        }
                    }
                }

            } catch (e) {
                serviceResult.status = false;
                serviceResult.errorCode = ApiErrorCodes.uploadError;
                serviceResult.statusCode = ApiStatusCodes.badRequest;
                serviceResult.message = JSON.stringify(e);
                console.log(e)
            }
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteManyImage = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult<string[]>();
        serviceResult.data = [];

        const reqData = req as IGalleryDeleteManySchema;

        let galleryItems = await GalleryService.getMany({
            _id: reqData.body._id
        });

        await new Promise(resolve => {
            galleryItems.forEach(galleryItem => {
                if (fs.existsSync(path.resolve(Config.paths.uploads.images, galleryItem.name))) {
                    fs.unlinkSync(path.resolve(Config.paths.uploads.images, galleryItem.name));
                    fs.close(0);
                    serviceResult.data?.push(galleryItem.name);
                }
            })
            resolve(0);
        });

        await GalleryService.deleteMany({
            ...reqData.body
        });

        await reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export const GalleryController = {
    getManyImage: getManyImage,
    addImage: addImage,
    deleteManyImage: deleteManyImage
};