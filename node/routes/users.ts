import { method } from '@vtex/api'

import { createMasterdataHandlers } from '../utils'

async function searchUsers(ctx: Context) {
  ctx.body = await ctx.state.userMasterdataController.search()
}

async function createUser(ctx: Context) {
  ctx.body = await ctx.state.userMasterdataController.create()
}

export default method({
  GET: createMasterdataHandlers([searchUsers]),
  POST: createMasterdataHandlers([createUser]),
})
