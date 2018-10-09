'use strict';

const Joi = require('joi');
const presetSchema = require('./preset');

const keys = {
    name: Joi.string(),
    presets: Joi.array().items(presetSchema),
    disabledFeatures: Joi.array().items(Joi.object({ key: Joi.string(), val: Joi.array().items(Joi.string()) }))
};

const requiredKeys = ['name','presets'];
const optionalKeys = ['disabledFeatures'];

module.exports = Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys)
    .optionalKeys(optionalKeys);
