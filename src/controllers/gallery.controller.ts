import {FastifyReply, FastifyRequest} from 'fastify';
import {DateMask} from "../library/variable"
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import fs, {Stats} from "fs";
import {Config} from "../config";
import path from "path";
import sharp from "sharp";
import multer from "fastify-multer";
import {GallerySchemaDeleteManyDocument, GallerySchemaGetManyDocument} from "../schemas/gallery.schema";
import logMiddleware from "../middlewares/log.middleware";
import galleryService from "../services/gallery.service";
import permissionUtil from "../utils/permission.util";
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
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        const reqData = req as GallerySchemaGetManyDocument;

        let gallery = await galleryService.getMany({
            ...reqData.query,
            ...(!permissionUtil.checkPermissionRoleRank(UserRoleId.Editor, req.sessionAuth.user!.roleId) ? {authorId: req.sessionAuth.user!.userId.toString()} : {})
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
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

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
                    serviceResult.errorCode = ErrorCodes.uploadError;
                    serviceResult.statusCode = StatusCodes.badRequest;
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

                        let insertedData = await galleryService.add({
                            oldName: file.filename,
                            name: name,
                            authorId: req.sessionAuth.user!.userId,
                            typeId: GalleryTypeId.Image
                        });

                        let galleryItem = await galleryService.getOne({
                            _id: insertedData._id.toString()
                        });

                        fs.stat(path.resolve(Config.paths.uploads.images, name), (err, stats) => {
                            serviceResult.data.push({
                                ...galleryItem,
                                ...getImageResult(galleryItem.name, stats)
                            });
                        })
                    }

                } catch (e) {
                    serviceResult.status = false;
                    serviceResult.errorCode = ErrorCodes.uploadError;
                    serviceResult.statusCode = StatusCodes.badRequest;
                } finally {
                    resolve(0);
                }
            });
        });

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

const deleteManyImage = async (req: FastifyRequest, reply: FastifyReply) => {
    await logMiddleware.error(req, reply, async () => {
        let serviceResult = new Result();

        const reqData = req as GallerySchemaDeleteManyDocument;

        await new Promise(resolve => {
            reqData.body.name?.forEach(image => {
                if (fs.existsSync(path.resolve(Config.paths.uploads.images, image))) {
                    fs.unlinkSync(path.resolve(Config.paths.uploads.images, image));
                    fs.close(0);
                    serviceResult.data.push(image);
                }
            })
            resolve(0);
        });

        await galleryService.deleteMany({
            name: reqData.body.name
        })

        reply.status(serviceResult.statusCode).send(serviceResult)
    });
}

export default {
    getManyImage: getManyImage,
    addImage: addImage,
    deleteManyImage: deleteManyImage
};