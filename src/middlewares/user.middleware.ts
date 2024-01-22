import { FastifyRequest, FastifyReply } from 'fastify';
import {ErrorCodes, Result, StatusCodes} from "../library/api";
import userService from "../services/user.service";
import UserRoles from "../constants/userRoles";
import logMiddleware from "./log.middleware";
import {UserSchemaPutDocument, UserSchemaPutPasswordDocument} from "../schemas/user.schema";

export default {
    checkOne: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as UserSchemaPutDocument;

            let resData = await userService.getOne({
                _id: reqData.params._id
            });

            if (!resData) {
                serviceResult.status = false;
                serviceResult.errorCode = ErrorCodes.notFound;
                serviceResult.statusCode = StatusCodes.notFound;
            }

            if (!serviceResult.status) {
                reply.status(serviceResult.statusCode).send(serviceResult)
            }
        });
    },
    checkRoleRank: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as UserSchemaPutDocument;
            let userRoleId = 0;

            if (reqData.body.roleId) {
                userRoleId = reqData.body.roleId;
            } else if (reqData.params._id) {
                let user = await userService.getOne({
                    _id: reqData.params._id
                });
                if (user) {
                    userRoleId = user.roleId;
                }
            }

            if (userRoleId > 0) {
                let user = await userService.getOne({
                    _id: req.sessionAuth.user?.userId as string
                });

                if(user){
                    let sessionUserRole = UserRoles.findSingle("id", user.roleId);
                    let userRole = UserRoles.findSingle("id", userRoleId);

                    if(
                        (typeof sessionUserRole === "undefined" || typeof userRole === "undefined") ||
                        (userRole.rank >= sessionUserRole.rank)
                    ){
                        serviceResult.status = false;
                        serviceResult.errorCode = ErrorCodes.noPerm;
                        serviceResult.statusCode = StatusCodes.notFound;
                    }
                }
            }

            if (!serviceResult.status) {
                reply.status(serviceResult.statusCode).send(serviceResult)
            }
        });
    },
    checkAlreadyEmail: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as UserSchemaPutDocument;

            if (reqData.body.email) {
                let resData = await userService.getOne({
                    email: reqData.body.email,
                    ignoreUserId: reqData.params._id ? [reqData.params._id] : undefined
                });

                if (resData) {
                    serviceResult.status = false;
                    serviceResult.errorCode = ErrorCodes.alreadyData;
                    serviceResult.statusCode = StatusCodes.conflict;
                }
            }

            if (!serviceResult.status) {
                reply.status(serviceResult.statusCode).send(serviceResult)
            }
        });
    },
    checkPasswordWithSessionEmail: async (req: FastifyRequest, reply: FastifyReply) => {
        await logMiddleware.error(req, reply, async () => {
            let serviceResult = new Result();

            let reqData = req as UserSchemaPutPasswordDocument;

            let resData = await userService.getOne({
                email: req.sessionAuth.user?.email,
                password: reqData.body.password
            });

            if (!resData) {
                serviceResult.status = false;
                serviceResult.errorCode = ErrorCodes.notFound;
                serviceResult.statusCode = StatusCodes.notFound;
            }

            if (!serviceResult.status) {
                reply.status(serviceResult.statusCode).send(serviceResult)
            }
        });
    }
};