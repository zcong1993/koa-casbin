import * as Koa from 'koa'
import * as Router from 'koa-router'
import { newEnforcer } from 'casbin'
import { authz, Authorizer } from '../src'

const app = new Koa()

const r = new Router()

const handler: Router.IMiddleware = ctx => {
  ctx.body = {
    href: ctx.href
  }
}

function authMiddleware(): Koa.Middleware {
  return async (ctx, next) => {
    ctx.user = ctx.header.user || 'default'

    await next()
  }
}

class MyAuthorizer extends Authorizer {
  getUserName(ctx: Koa.Context) {
    return ctx.user
  }
}

app.use(authMiddleware())
app.use(
  authz({
    newEnforcer: async () => {
      const enforcer = await newEnforcer(
        `${__dirname}/authz_model.conf`,
        `${__dirname}/authz_policy.csv`
      )
      return enforcer
    },
    authorizer: MyAuthorizer
  })
)

r.get('/', handler)
r.all('/test', handler)
r.all('/test2', handler)

app.use(r.routes()).use(r.allowedMethods())

export { app }
