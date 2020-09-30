'use strict'

const { parseMultipartData, sanitizeEntity } = require('strapi-utils')

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */
  //   async find(ctx) {
  //     console.log('cttttx', ctx.query)
  //     let entities
  //     if (ctx.query._q) {
  //       entities = await strapi.services.channel.search(ctx.query)
  //       strapi.emitToAllUsers(`if ${entities}`)
  //     } else {
  //       entities = await strapi.services.channel.find(ctx.query)
  //       strapi.emitToAllUsers(`else ${JSON.stringify(entities)}`)
  //     }
  //     return entities.map((entity) =>
  //       sanitizeEntity(entity, { model: strapi.models.channel })
  //     )
  //   },
  //   async create(ctx) {
  //     console.log('kepanggil gak')
  //     let entity
  //     if (ctx.is('multipart')) {
  //       const { data, files } = parseMultipartData(ctx)
  //       entity = await strapi.services.channel.create(data, { files })
  //     } else {
  //       entity = await strapi.services.channel.create(ctx.request.body)
  //       strapi.emitToAllUsers(`else ${JSON.stringify(entities)}`)
  //     }
  //     return sanitizeEntity(entity, { model: strapi.models.channel })
  //   },
}
