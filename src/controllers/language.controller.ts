import { FastifyRequest, FastifyReply } from 'fastify';
import { ApiResult } from '@library/api/result';
import {
  ILanguageGetWithIdSchema,
  ILanguageGetManySchema,
  ILanguagePostSchema,
  ILanguagePutWithIdSchema,
  ILanguagePutRankWithIdSchema,
  ILanguageGetDefaultSchema,
} from '@schemas/language.schema';
import { LanguageService } from '@services/db/language.service';
import { LogMiddleware } from '@middlewares/log.middleware';
import fs from 'fs';
import { Config } from '@configs/index';
import path from 'path';
import { ILanguageModel } from 'types/models/language.model';
import { PathUtil } from '@utils/path.util';

const getWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<ILanguageModel>();

    const reqData = req as ILanguageGetWithIdSchema;

    apiResult.data = await LanguageService.get({
      ...reqData.params,
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const getDefault = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<ILanguageModel>();

    const reqData = req as ILanguageGetDefaultSchema;

    apiResult.data = await LanguageService.get({ isDefault: true });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const getMany = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<ILanguageModel[]>();

    const reqData = req as ILanguageGetManySchema;

    apiResult.data = await LanguageService.getMany({
      ...reqData.query,
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const getFlags = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<string[]>();
    apiResult.data = [];

    const fileType = ['.jpg', '.png', '.webp', '.gif', '.jpeg'];

    await new Promise((resolve) => {
      fs.readdir(PathUtil.getUploadPaths().Flags, (err, images) => {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          if (fs.existsSync(path.resolve(PathUtil.getUploadPaths().Flags, image))) {
            if (fileType.includes(path.extname(image))) {
              apiResult.data?.push(image);
            }
          }
        }
        resolve(0);
      });
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const add = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult<ILanguageModel>();

    const reqData = req as ILanguagePostSchema;

    apiResult.data = await LanguageService.add({
      ...reqData.body,
      authorId: req.sessionAuth!.user!.userId.toString(),
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as ILanguagePutWithIdSchema;

    await LanguageService.update({
      ...reqData.params,
      ...reqData.body,
      lastAuthorId: req.sessionAuth!.user!.userId.toString(),
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

const updateRankWithId = async (req: FastifyRequest, reply: FastifyReply) => {
  await LogMiddleware.error(req, reply, async () => {
    const apiResult = new ApiResult();

    const reqData = req as ILanguagePutRankWithIdSchema;

    await LanguageService.updateRank({
      ...reqData.params,
      ...reqData.body,
    });

    await reply.status(apiResult.getStatusCode).send(apiResult);
  });
};

export const LanguageController = {
  getWithId: getWithId,
  getDefault: getDefault,
  getMany: getMany,
  getFlags: getFlags,
  add: add,
  updateWithId: updateWithId,
  updateRankWithId: updateRankWithId,
};
