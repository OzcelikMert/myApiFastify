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
import {GallerySchemaDeleteManyDocument, GallerySchemaGetManyDocument} from "../schemas/gallery.schema";
import {LogMiddleware} from "../middlewares/log.middleware";
import {GalleryService} from "../services/gallery.service";
import {PermissionUtil} from "../utils/permission.util";
import {UserRoleId} from "../constants/userRoles";
import {GalleryTypeId} from "../constants/galleryTypeId";

function getImageResult(name: string, stats: Stats) {
    return {
        name: name,
        sizeKB: Number(stats.size) / 1024,
        sizeMB: Number(stats.size) / (1024 * 1024),
        createdAt: stats.ctime,
    }
}

const getManyImage = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as GallerySchemaGetManyDocument;

        let gallery = await GalleryService.getMany({
            ...reqData.query,
            ...(!PermissionUtil.checkPermissionRoleRank(UserRoleId.Editor, req.sessionAuth.user!.roleId) ? {authorId: req.sessionAuth.user!.userId.toString()} : {})
        });

        const fileType = [".jpg", ".png", ".webp", ".gif", ".jpeg"];

        for (const item of gallery) {
            if(fileType.includes(path.extname(item.name))){
                fs.stat(path.resolve(Config.paths.uploads.images, item.name), (err, stats) => {
                    serviceResult.data.push({
                        ...item,
                        ...getImageResult(item.name, stats)
                    });
                })
            }
        }

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const addImage = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        function newName() {
            const timestamp = new Date().getStringWithMask(DateMask.UNIFIED_ALL);
            return `${timestamp}-${Math.randomCustom(1, 999999)}.webp`;
        }

        const upload: any = multer({
            storage: multer.memoryStorage(),
            fileFilter: (req, file, cb: any)=> {
                let ext = path.extname(file.originalname)?.replace(".", "");
                let filter = ["jpg", "jpeg", "png", "gif"];
                if(filter.includes(ext)) {
                    cb(null,true);
                } else {
                    cb('Only Images Are Allow', false);
                }
            }
        }).single("file");

        await new Promise<number>(resolve => {
            upload(req, reply, async function (err: any) {
                if(err) {
                    serviceResult.status = false;
                    serviceResult.errorCode = ApiErrorCodes.uploadError;
                    serviceResult.statusCode = ApiStatusCodes.badRequest;
                }

                try {
                    let name = newName();
                    while(fs.existsSync(path.resolve(Config.paths.uploads.images, newName()))) {
                        name = newName();
                    }

                    const file = await req.file();
                    if(file){
                        const buffer = await file.toBuffer();
                        let data = await sharp(buffer, {animated: true})
                            .webp({quality: 80, force: true, loop: 0})
                            .toBuffer();

                        await new Promise<number>(resolveCreate => {
                            fs.createWriteStream(path.resolve(Config.paths.uploads.images, name)).write(data, (error: any) => {
                                resolveCreate(0);
                            });
                        })

                        let insertedData = await GalleryService.add({
                            oldName: file.filename,
                            name: name,
                            authorId: req.sessionAuth.user!.userId,
                            typeId: GalleryTypeId.Image
                        });

                        let galleryItem = await GalleryService.getOne({
                            _id: insertedData._id.toString()
                        });

                        if(galleryItem){
                            fs.stat(path.resolve(Config.paths.uploads.images, name), (err, stats) => {
                                serviceResult.data.push({
                                    ...galleryItem,
                                    ...getImageResult(galleryItem!.name, stats)
                                });
                            })
                        }
                    }

                } catch (e) {
                    serviceResult.status = false;
                    serviceResult.errorCode = ApiErrorCodes.uploadError;
                    serviceResult.statusCode = ApiStatusCodes.badRequest;
                } finally {
                    resolve(0);
                }
            });
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteManyImage = async (req: FastifyRequest, reply: FastifyReply) => {
    await LogMiddleware.error(req, reply, async () => {
        let serviceResult = new ApiResult();

        const reqData = req as GallerySchemaDeleteManyDocument;

        let galleryItems = await GalleryService.getMany({
            _id: reqData.body._id
        });

        await new Promise(resolve => {
            galleryItems.forEach(galleryItem => {
                if (fs.existsSync(path.resolve(Config.paths.uploads.images, galleryItem.name))) {
                    fs.unlinkSync(path.resolve(Config.paths.uploads.images, galleryItem.name));
                    fs.close(0);
                    serviceResult.data.push(galleryItem.name);
                }
            })
            resolve(0);
        });

        await GalleryService.deleteMany({
            ...reqData.body
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export const GalleryController = {
    getManyImage: getManyImage,
    addImage: addImage,
    deleteManyImage: deleteManyImage
};