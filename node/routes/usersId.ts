import { method } from '@vtex/api'

import { createMasterdataHandlers } from '../utils'

async function getUser(ctx: Context) {
  ctx.body = await ctx.state.userMasterdataController.get()
}

async function updateUser(ctx: Context) {
  ctx.body = await ctx.state.userMasterdataController.update()
}

async function deleteUser(ctx: Context) {
  ctx.body = await ctx.state.userMasterdataController.delete()
}

export default method({
  GET: createMasterdataHandlers([getUser]),
  PATCH: createMasterdataHandlers([updateUser]),
  DELETE: createMasterdataHandlers([deleteUser]),
})
