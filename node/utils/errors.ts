import { AuthenticationError, ForbiddenError, NotFoundError } from '@vtex/api'

export function throwNotFoundError(entity: string): never {
  throw new NotFoundError(`Document not found in entity ${entity}`)
}

export function throwAuthenticationError(): never {
  throw new AuthenticationError('store/not-authenticated-error')
}

export function throwForbiddenError(): never {
  throw new ForbiddenError('store/forbidden-error')
}
