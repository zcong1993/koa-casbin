import * as request from 'supertest'
import { Server } from 'http'
import { newEnforcer } from 'casbin'

import { authz } from '../src'
import { createApp, injectRoutes, MyAuthorizer } from './fixture'

type testData = [Server, string, string, number]

let server: Server

afterEach(() => {
  server.close()
})

const test = async (
  server: Server,
  path: string,
  user: string,
  expectStatus: number
) => {
  const res = await request(server)
    .get(path)
    .set('user', user)

  expect(res.status).toEqual(expectStatus)
}

const createDefaultApp = () => {
  const app = createApp()

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

  injectRoutes(app)

  return app
}

it('should work well', async () => {
  const app = createDefaultApp()
  server = app.listen()

  const testDatas: testData[] = [
    [server, '/resource1', '', 403],
    [server, '/resource1', 'user1', 200],
    [server, '/resource1', 'user2', 200],
    [server, '/resource2', 'user3', 200],
    [server, '/users/user4/resource', 'user4', 200],
    [server, '/users/user4/resource2', 'user4', 403]
  ]

  for (const fixture of testDatas) {
    await test(...fixture)
  }
})
