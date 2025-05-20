import { checkSchemas, setResponseMetadata, setupControllers } from '.'

function generateHandler(handler: Handler) {
  return async function genericHandler(ctx: Context, next?: NextFn) {
    await handler(ctx)
    await next?.()
  }
}

export function createHandlers(handlers: Handler[]) {
  return [
    setupControllers,
    ...handlers.map(generateHandler),
    setResponseMetadata,
  ]
}

export function createMasterdataHandlers(handlers: Handler[]) {
  return createHandlers([checkSchemas, ...handlers])
}
