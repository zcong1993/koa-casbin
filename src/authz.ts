import { Enforcer } from 'casbin'
import { Middleware } from 'koa'
import * as debug from 'debug'

import { Authorizer } from './authorizer'

const casbinDebugger = debug('koa-casbin')

let enforcerInstance: Enforcer
let authzorizerInstance: Authorizer

export interface CasbinOptions {
  newEnforcer: () => Promise<Enforcer>
  authorizer: typeof Authorizer
}

export function authz(options: CasbinOptions): Middleware {
  return async (ctx, next) => {
    const { newEnforcer, authorizer } = options
    if (!enforcerInstance) {
      casbinDebugger('init Enforcer instance')
      enforcerInstance = await newEnforcer()
      if (!(enforcerInstance instanceof Enforcer)) {
        throw new Error('Invalid enforcer')
      }
    }
    const enforcer = enforcerInstance

    if (!authzorizerInstance) {
      casbinDebugger('init Authorizer instance')
      authzorizerInstance = new authorizer(enforcer)
      if (!(authzorizerInstance instanceof Authorizer)) {
        throw new Error('Please extends BasicAuthorizer class')
      }
    }

    const authzorizer = authzorizerInstance

    if (!(await authzorizer.checkPermission(ctx))) {
      ctx.status = 403
      return
    }
    await next()
  }
}
