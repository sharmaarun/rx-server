
import { EntitySchema } from "@reactive/commons";
import { PluginClass, registerCoreEndpoint, registerEndpoint, ServerContext } from "@reactive/server";
import { hashSync } from "bcrypt";
import { isEmpty } from "class-validator";
import { AccessDeniedError, Role, UnauthorizedAccessError } from "../commons";
import { verify, decode, JwtPayload } from "jsonwebtoken";
import authController from "./apis/auth/controller";
import authRoutes from "./apis/auth/routes";
import roleController from "./apis/role/controller";
import roleRoutes from "./apis/role/routes";
import userController from "./apis/user/controller";
import userRoutes from "./apis/user/routes";
import * as userSchema from "./apis/user/schema.json";
import superUserController from "./apis/super-user/controller";
import superUserRoutes from "./apis/super-user/routes";
import * as superUserSchema from "./apis/super-user/schema.json";
import * as roleSchema from "./apis/role/schema.json";
import { apiPermissionsMatch, DefaultAuthenticatedRole, DefaultPublicRole } from "../commons/utils";
import { User } from "../commons/interfaces/user";

export type AuthManagerOptions = {
    hashRounds?: number,
    jsonSecret?: string
}

export default class AuthManager extends PluginClass<AuthManagerOptions> {
    public override options!: AuthManagerOptions;
    override async init(ctx: ServerContext, options: AuthManagerOptions) {
        this.ctx = ctx
        this.options = options

        // auth routes
        registerCoreEndpoint(ctx => ({
            name: "auth",
            routes: authRoutes(),
            controllers: authController(this.options)(),
        }))()

        // auth routes
        registerCoreEndpoint(ctx => ({
            name: "role",
            routes: roleRoutes(),
            controllers: roleController(),
            schema: roleSchema as EntitySchema
        }))()


        registerCoreEndpoint(ctx => ({
            name: "superuser",
            routes: superUserRoutes(),
            controllers: superUserController(),
            schema: superUserSchema as EntitySchema
        }))()

        // create user endpoint in the local project api directory

        if (!process.env["NODE_ENV"] || process.env["NODE_ENV"] === "development") {
            try {
                // try to generate the api in local fs
                await ctx.apiGen.generateAPI(userSchema as EntitySchema)
                // explorer routes
                registerEndpoint(ctx => ({
                    name: "user",
                    routes: userRoutes(),
                    controllers: userController(),
                    schema: userSchema as EntitySchema
                }))()
                await ctx.db.defineSchema(userSchema as any)
                ctx.logger.log("Generated user api...")
            } catch (e) {
                console.error(e.message)
            }
        }


        // initialize
        setTimeout(async () => {
            // add db hooks
            await this.addPasswordHooks(ctx, userSchema.name)
            await this.addPasswordHooks(ctx, superUserSchema.name)
            await this.addMiddlewares(ctx)

            // create default roles
            await this.createDefaultRoles()

        }, 500)
    }
    /**
     * Create default public and authenticated roles
     */
    public createDefaultRoles = async () => {
        // create if doesn't exist
        let exists = await this.ctx.query("role").findOne({ where: { name: { "eq": DefaultPublicRole.name } } })
        if (!exists) {
            await this.ctx.query("role").create(DefaultPublicRole)
            this.ctx.logger.debug("Generated default public role")
        }
        exists = await this.ctx.query("role").findOne({ where: { name: { "eq": DefaultAuthenticatedRole.name } } })
        if (!exists) {
            await this.ctx.query("role").create(DefaultAuthenticatedRole)
            this.ctx.logger.debug("Generated default authenticated role")
        }

    }

    public addMiddlewares = async (ctx: ServerContext) => {

        // add authorization middleware
        ctx.endpoints.addRequestMiddleware({
            endpointName: ".*",
            route: {
                path: ".*",
                method: ".*"
            },
            handler: async (ctx) => {
                if (ctx.route.path === "/login") return;
                if (ctx.route.path === "/register") return;

                // check if the requested api is open for public (i.e. exists in the default `public` role)
                const publicRole = await this.ctx.query("role").findOne({ where: { name: "public" } }) as Role
                let isPublic = false
                if (publicRole) {
                    for (let permission of publicRole.apiPermissions || []) {
                        isPublic = apiPermissionsMatch(permission, {
                            name: ctx.endpoint.name,
                            ...ctx.route
                        })
                        if (isPublic) break;
                    }
                }
                // if resource is open for public, stop checking for further access permissions
                if (isPublic) {
                    ctx.meta = {
                        ...(ctx.meta || {}),
                        isPublic
                    }
                    return;
                };


                //extract token
                const { authorization }: any = { ...(ctx.query || {}), ...(ctx.headers || {}) } || {}
                if (!authorization) throw new UnauthorizedAccessError(`Unauthorized access`)

                // verify
                try {
                    const valid = verify(authorization || "invalid", this.options.jsonSecret)
                    if (!valid) throw new UnauthorizedAccessError(`Unauthorized access`)
                } catch (e) {
                    throw new UnauthorizedAccessError(`Unauthorized access : ${e.message}`)
                }
                let user: any = {}
                try {
                    const { id, name, email } = decode(authorization) as JwtPayload
                    user = { id, name, email }
                } catch (e) {
                    throw new UnauthorizedAccessError(`Invalid token`)
                }
                ctx.user = user

            },
        })
        ctx.endpoints.addRequestMiddleware({
            endpointName: ".*",
            route: {
                method: ".*",
                path: ".*"
            },
            handler: async (ctx) => {
                if (ctx?.meta?.isPublic) return;
                // look if the user is super user (search in superusers entity)
                const superuser = await this.ctx.query<User>("superuser").findOne({
                    where: {
                        id: ctx.user?.id,
                        email: ctx.user?.email,
                    }
                })

                // if found, enable full access
                if (superuser) return;

                // if not a super user, continue checking for access and roles
                const user = await this.ctx.query<User>("user").findOne(
                    {
                        where: { id: ctx?.user?.id },
                        include: [{
                            association: "roles",
                            attributes: ["name", "apiPermissions"]
                        }]
                    }
                );
                if (!user) throw new UnauthorizedAccessError(`No such user exists. Unauthorized access`);

                // basic checks
                if (!user.isConfirmed) throw new UnauthorizedAccessError(`Account is not verified. Please check your email id and click on the verification link sent at the time of registration`)
                if (user.isBlocked) throw new UnauthorizedAccessError(`Account is Blocked`)

                // append the user to the request for accessibility by other middlewares down the line
                ctx.user = (user as any)?.dataValues || user;

                // check if the api being accessed is present in the user roles
                if (!user.roles || user.roles.length <= 0)
                    throw new AccessDeniedError(`Access denied for the requested resource`)

                // check if the user has access to the requested resource/api
                for (let role of user.roles) {
                    const exists = role.apiPermissions?.find(perm => {
                        return apiPermissionsMatch(perm, {
                            name: ctx.endpoint.name,
                            ...ctx.route
                        })
                    })
                    if (!exists) throw new AccessDeniedError(`Access denied for the requested resource`)
                }
            },
        })
    }

    /**
     * add db hooks for managing password fields
     */
    public addPasswordHooks = async (ctx: ServerContext, entityName: string) => {
        const userEntity = ctx.db.entities.find(e => e.schema.name === entityName)

        // remove password field from listing
        // TODO : should be a middleware to the endpoints
        // userEntity.addHook("afterFindOne", "auth-bc-1", ({ entity }, ms) => {
        //     if (ms && ms.password) {
        //         ms.password = ""
        //         delete ms.password
        //     }
        // })

        // remove password field from read
        // TODO : should be a middleware to the endpoints
        // userEntity.addHook("afterFindAll", "auth-bc-1", ({ entity }, ms) => {
        //     ms?.forEach?.(m => {
        //         if (m && m.password) {
        //             m.password = ""
        //             delete m.password
        //         }
        //     })
        // })

        // hash password before creating a new entry
        userEntity.addHook("beforeCreate", "auth-bc-1", ({ entity }, m) => {
            if (!isEmpty(m.password)) {
                m["password"] = hashSync(m?.password, 10)
            }
        })

        // hash password on update
        userEntity.addHook("beforeUpdate", "auth-bc-2", async ({ previous }, m) => {
            if (m["password"] && previous?.password !== m["password"]) {
                ctx.logger.debug("Updating password for user ", m["id"])
                m["password"] = hashSync(m["password"], 10)
            }
        })

        // hash password on upsert
        userEntity.addHook("beforeUpsert", "auth-bc-2", async ({ previous }, m) => {
            if (m["password"] && previous?.password !== m["password"]) {
                ctx.logger.debug("Updating password for user ", m["id"])
                m["password"] = hashSync(m["password"], 10)
            }
        })
    }
}