'use strict';

const Joi = module.exports.Joi = module.exports.joi = require('joi');
const coBody = require('co-body');

function validateAsync(value, schema, options) {
    return new Promise(function (resolve, reject) {
        return Joi.validate(value, schema, options, function (err, val) {
            if (err) {
                return reject(err);
            }
            return resolve(val);
        });
    });
}

module.exports.validator = function (opts) {
    const _opts = Object.assign({
        failure: 400
    }, opts);
    return function * (next) {
        if (_opts.type && coBody[_opts.type]) {
            this.request.body = yield coBody[_opts.type](this);
        }
        try {
            if (_opts.body) {
                this.request.body = yield validateAsync(this.request.body, _opts.body, _opts.options);
            }
            if (_opts.headers) {
                this.request.headers = yield validateAsync(this.request.headers, _opts.headers, _opts.options)
            }
            if (_opts.query) {
                this.request.query = yield validateAsync(this.request.query, _opts.query, _opts.options)
            }
            if (_opts.params) {
                this.request.params = yield validateAsync(this.request.params, _opts.params, _opts.options)
            }
        } catch (e) {
            this.throw(_opts.failure, e);
        }
        yield next;
    };
};