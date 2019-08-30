import * as Koa from 'koa'
import * as Router from 'koa-router'
import { Authorizer } from '../src'

function authMiddleware(): Koa.Middleware {
  return async (ctx, next) => {
    ctx.user = ctx.header.user || 'default'

    await next()
  }
}

const handler: Router.IMiddleware = ctx => {
  ctx.body = {
    href: ctx.href
  }
}

export const createApp = () => {
  const app = new Koa()
  app.use(authMiddleware)

  return app
}

export const injectRoutes = (app: Koa) => {
  const r = new Router()

  r.all('/resource1', handler)
  r.all('/resource2', handler)
  r.all('/user/:id/resource', handler)

  return app.use(r.routes()).use(r.allowedMethods())
}

export class MyAuthorizer extends Authorizer {
  getUserName(ctx: Koa.Context) {
    return ctx.user
  }
}
