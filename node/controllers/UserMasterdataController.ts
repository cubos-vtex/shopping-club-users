import { UserInputError } from '@vtex/api'

import { SCHEMAS, USER_ENTITY, USER_FIELDS } from '../masterdata-setup'
import { BaseMasterdataController } from './base/BaseMasterdataController'

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export class UserMasterdataController extends BaseMasterdataController<User> {
  constructor(ctx: Context) {
    super(ctx, USER_ENTITY, USER_FIELDS)
  }

  private async getUserFields(requiredFields?: string[]) {
    return this.getBodyFields<User>(requiredFields)
  }

  private getIdParam() {
    return this.getPathParam('id')
  }

  public async get() {
    const id = this.getIdParam()

    return this.getDocument(id)
  }

  public async create() {
    const { required } = SCHEMAS.user.body
    const fields = await this.getUserFields(required)

    const missingFields: string[] = []

    Object.entries(fields).forEach(([key, value]) => {
      if (!value.trim()) {
        missingFields.push(key)
      }
    })

    if (missingFields.length) {
      throw new UserInputError(
        `Missing required fields: ${missingFields.join(', ')}`
      )
    }

    if (!EMAIL_REGEX.test(fields.email)) {
      throw new UserInputError(`Invalid email: ${fields.email}`)
    }

    const existing = await this.getByEmail(fields.email).catch(() => null)

    if (existing) {
      throw new UserInputError(`User with email ${fields.email} already exists`)
    }

    return this.createDocument(fields)
  }

  public async update() {
    const user = await this.get()
    const fields = await this.getUserFields()
    const newFields = { ...user, ...fields }

    await this.updatePartialDocument(user.id, newFields)

    return newFields
  }

  public async delete() {
    const toBeDeleted = await this.get()

    await this.deleteDocument(toBeDeleted.id)

    return toBeDeleted
  }

  public async search() {
    const {
      sort = 'createdIn desc',
      pagination,
    } = this.getMasterdataSearchQuery()

    const conditions: string[] = []
    const { search, email } = this.getQueryStringParams([
      'search',
      'email',
    ] as const)

    const searchWithWildcards = search
      ?.trim()
      ?.replace(/["*]/g, '')
      ?.split(/\s+/)
      .join('*')

    if (searchWithWildcards) {
      conditions.push(
        `(name="*${searchWithWildcards}*" OR email="*${searchWithWildcards}*")`
      )
    }

    if (email) {
      conditions.push(`email="${email}"`)
    }

    const where = conditions.join(' AND ')

    return this.searchDocumentsWithPaginationInfo(pagination, where, sort)
  }

  public async getByEmail(email: string) {
    return this.getFirstResult(`email="${email}"`)
  }
}
