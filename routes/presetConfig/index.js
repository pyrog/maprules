'use strict';

const uuidSchema = require('../../schemas/components').uuid;
const presetConfigSchema = require('../../schemas/presetConfig');
const Boom = require('@hapi/boom');
const db = require('../../connection');
const ensureExtant = require('../../handlers/helpers').ensureExtant;
const uuid4 = require('uuid/v4');



module.exports = {
    get: {
        method: 'GET',
        options: { auth: 'false' },
        path: '/config/{id}',
        config: {
            handler: async function(r, h) {
                try {
                    const uuid = r.params.id;
                    await ensureExtant(uuid);

                    const query = await db.select('preset').from('presets').where({id: uuid});
                    const config = JSON.parse(query[0].preset);
                    return h.response(config).code(200);
                } catch (error) {
                    return error;

                }
            },
            validate: { params: { id: uuidSchema } },
            response: { schema: presetConfigSchema }
        }
    },
    put: {
        method: 'PUT',
        path: '/config/{id}',
        config: {
            handler: async function (r, h) {
                try {
                    const id = r.params.id;
                    await ensureExtant(id);

                    const presets = r.payload;

                    await db.raw(`UPDATE presets SET preset = json('${JSON.stringify(presets)}') WHERE id = '${id}'`);
                    return h.response({ update: 'successful' }).code(200);

                } catch (error) {
                    return error;
                }

            },
            validate: {
                payload: presetConfigSchema,
                params: { id: uuidSchema },
                failAction: async (request, h, err) => err
            },
            cors: { origin: ['*'], additionalHeaders: ['cache-control', 'x-request-with'] }
        }
    },
    post: {
        method: 'POST',
        path: '/config',
        config: {
            handler: async function(r, h) {
                try {
                    const token = getToken(r.headers.authorization);
                    const presets = r.payload;
                    const uuid = uuid4();

                    await db('presets').insert({
                        id: uuid,
                        preset: JSON.stringify(presets),
                        user_id: token.id
                    });
                    return h.response({ upload: 'successful', id: uuid }).code(200);
                } catch (error) {
                    return Boom.badImplementation(error.message);
                }
            },
            cors: { origin: ['*'], additionalHeaders: ['cache-control', 'x-request-with'] },
            validate: {
                payload: presetConfigSchema,
                failAction: async (request, h, err) => err
            }
        }
    }
};