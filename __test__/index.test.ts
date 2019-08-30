import * as request from 'supertest'
import { newEnforcer } from 'casbin'

import { authz } from '../src'
import { createApp, injectRoutes, MyAuthorizer } from './fixture'

const createDefaultApp = () => {
  const app = createApp()

  // app.use(authz({
  //   newEnforcer: async () => {
  //     const enforcer = await newEnforcer(
  //       `${__dirname}/authz_model.conf`,
  //       `${__dirname}/authz_policy.csv`
  //     )
  //     return enforcer
  //   },
  //   authorizer: MyAuthorizer
  // }))

  return injectRoutes(app)
}

it('should work well', async () => {
  const app = createDefaultApp()
  const server = app.listen()

  const res = await request(server).get('/resource1')

  expect(res.status).toEqual(200)
  console.log(res.body)
})
