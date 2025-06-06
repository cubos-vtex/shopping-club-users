import type { Maybe } from '@vtex/api'
import { UserInputError } from '@vtex/api'
import type { PaginationArgs } from '@vtex/clients/build/clients/masterData/MasterDataEntity'

import { SCHEMA_VERSION } from '../../masterdata-setup'
import { throwNotFoundError } from '../../utils'
import { BaseController } from './BaseController'

const DEFAULT_PAGE = 1
const DEFAULT_PAGESIZE = 15

export class BaseMasterdataController<
  T extends MasterdataInternalFields
> extends BaseController {
  protected readonly schema = SCHEMA_VERSION
  protected readonly masterdata: Context['clients']['masterdata']
  protected readonly commonArgs = {
    dataEntity: this.dataEntity,
    schema: this.schema,
    fields: this.fields,
  }

  constructor(
    ctx: Context,
    protected readonly dataEntity: string,
    protected readonly fields: string[]
  ) {
    super(ctx)
    this.masterdata = ctx.clients.masterdata
    this.dataEntity = dataEntity
    this.fields = fields
  }

  protected async getDocument(id: string) {
    const entity = await this.masterdata.getDocument<Maybe<T>>({
      ...this.commonArgs,
      id,
    })

    if (!entity) {
      throwNotFoundError(this.dataEntity)
    }

    return entity
  }

  protected async createDocument(
    fields: Omit<T, keyof MasterdataInternalFields>
  ) {
    const { DocumentId } = await this.masterdata.createDocument({
      ...this.commonArgs,
      fields,
    })

    return this.getDocument(DocumentId)
  }

  protected async updatePartialDocument(id: string, fields: Partial<T>) {
    return this.masterdata.updatePartialDocument({
      ...this.commonArgs,
      id,
      fields,
    })
  }

  protected async deleteDocument(id: string) {
    return this.masterdata.deleteDocument({ ...this.commonArgs, id })
  }

  protected async searchDocumentsWithPaginationInfo(
    pagination: PaginationArgs,
    where?: string,
    sort?: string
  ) {
    return this.masterdata.searchDocumentsWithPaginationInfo<T>({
      ...this.commonArgs,
      pagination,
      where,
      sort,
    })
  }

  protected async getFirstResult(where?: string) {
    const results = await this.masterdata.searchDocumentsWithPaginationInfo<T>({
      ...this.commonArgs,
      pagination: { page: 1, pageSize: 1 },
      where,
    })

    const [firstResult] = results.data

    if (!firstResult) {
      throwNotFoundError(this.dataEntity)
    }

    return firstResult
  }

  protected getMasterdataSearchQuery() {
    const {
      where,
      sort,
      direction,
      page = String(DEFAULT_PAGE),
      pageSize = String(DEFAULT_PAGESIZE),
    } = this.getQueryStringParams([
      'where',
      'sort',
      'direction',
      'page',
      'pageSize',
    ] as const)

    if (!+page) {
      throw new UserInputError('Param page must be a number')
    }

    if (!+pageSize) {
      throw new UserInputError('Param pageSize must be a number')
    }

    return {
      ...(sort && direction && { sort: `${sort} ${direction}` }),
      where,
      pagination: { page: +page, pageSize: +pageSize },
    }
  }
}
