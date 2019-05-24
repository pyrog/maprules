'use strict';

const Joi = require('@hapi/joi');
const presetElementSchema = require('./presetElementSchema');

const keys = { 
    preset: presetElementSchema 
};

const requiredKeys = ['preset'];

module.exports =  Joi
    .object()
    .keys(keys)
    .requiredKeys(requiredKeys);