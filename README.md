# koa-casbin

[![NPM version](https://img.shields.io/npm/v/@zcong/koa-casbin.svg?style=flat)](https://npmjs.com/package/@zcong/koa-casbin) [![NPM downloads](https://img.shields.io/npm/dm/@zcong/koa-casbin.svg?style=flat)](https://npmjs.com/package/@zcong/koa-casbin) [![CircleCI](https://circleci.com/gh/zcong1993/koa-casbin/tree/master.svg?style=shield)](https://circleci.com/gh/zcong1993/koa-casbin/tree/master) [![codecov](https://codecov.io/gh/zcong1993/koa-casbin/branch/master/graph/badge.svg)](https://codecov.io/gh/zcong1993/koa-casbin)

> casbin middleware for koa

## Install

```bash
$ npm i @zcong/koa-casbin --save
```

## Usage

### Use a customized authorizer

see [examples](./examples)

```ts
// app.ts
// ...
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
```

## License

MIT &copy; zcong1993
