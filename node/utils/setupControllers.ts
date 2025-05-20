import { AppSettingsController, UserMasterdataController } from '../controllers'

export async function setupControllers(ctx: Context, next?: NextFn) {
  ctx.state = {
    ...ctx.state,
    appSettingsController: new AppSettingsController(ctx),
    userMasterdataController: new UserMasterdataController(ctx),
  }

  await next?.()
}
