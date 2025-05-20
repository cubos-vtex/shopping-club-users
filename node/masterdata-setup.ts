export const USER_ENTITY = 'shopping_club_user'
export const SCHEMA_VERSION = 'v0.0.1'
export const SCHEMAS = {
  user: {
    name: USER_ENTITY,
    // The body folows the JSON Schema for Master Data v2:
    // https://developers.vtex.com/docs/guides/working-with-json-schemas-in-master-data-v2
    body: {
      properties: {
        code: { type: 'string' },
        name: { type: 'string' },
        email: { type: 'string' },
      },
      required: ['code', 'name', 'email'],
      // All searchable fields must be in v-indexed.
      'v-indexed': ['code', 'name', 'email'],
      'v-immediate-indexing': true,
      'v-cache': false,
    },
  },
}

const INTERNAL_FIELDS = ['id', 'createdIn', 'lastInteractionIn']

export const USER_FIELDS = [
  ...INTERNAL_FIELDS,
  ...Object.keys(SCHEMAS.user.body.properties),
]
