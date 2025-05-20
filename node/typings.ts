import type { RecorderState, ServiceContext } from '@vtex/api'

import type { Clients } from './clients'
import type {
  AppSettingsController,
  UserMasterdataController,
} from './controllers'

declare global {
  type Context = ServiceContext<
    Clients,
    RecorderState & {
      storeUserEmail?: string
      appSettingsController: AppSettingsController
      userMasterdataController: UserMasterdataController
    }
  >

  type NextFn = () => Promise<void>

  type Handler = (ctx: Context, next?: NextFn) => Promise<void>

  type AppSettings = { schemaHash: string }

  type MasterdataInternalFields = {
    id: string
    createdIn: string
    lastInteractionIn: string
  }

  type User = MasterdataInternalFields & {
    code: string
    name: string
    email: string
  }
}
