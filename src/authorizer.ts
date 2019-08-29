import { parse } from 'url'
import { Context } from 'koa'
import { Enforcer } from 'casbin'
import * as debug from 'debug'

const casbinDebugger = debug('koa-casbin')

export class Authorizer {
  private enforcer: Enforcer

  constructor(enforcer: Enforcer) {
    this.enforcer = enforcer
  }

  getUserName(ctx: Context) {
    throw new Error('please implement this method!')
  }

  async checkPermission(ctx: Context) {
    const enforcer = this.enforcer
    const { originalUrl, method } = ctx
    const { pathname } = parse(originalUrl)
    const user = this.getUserName(ctx)
    const res = await enforcer.enforce(user, pathname, method)
    casbinDebugger(user, pathname, method)
    return res
  }
}
