'use strict';

const Promise = require('bluebird');
const Joi = module.exports.Joi = module.exports.joi = require('joi');
const coBody = require('co-body');

const _validate = Promise.promisify(Joi.validate, { context: Joi });

module.exports.validate = function (opts) {
  const _opts = Object.assign({
    failure: 400,
  }, opts);

  return async (ctx, next) => {
    if (_opts.type && coBody[_opts.type]) {
      this.request.body = await coBody[_opts.type](this);
    }
    try {
      if (_opts.body) {
        this.request.body = await _validate(this.request.body, _opts.body, _opts.options);
      }
      if (_opts.headers) {
        Object.assign(this.request.headers, await _validate(this.request.headers, _opts.headers, _opts.options));
      }
      if (_opts.query) {
        const query = await _validate(this.request.query, _opts.query, _opts.options);
        Object.defineProperty(this.request, 'query', { get() { return query } });
      }
      if (_opts.params) {
        this.params = await _validate(this.params, _opts.params, _opts.options);
      }
    } catch (e) {
      this.throw(_opts.failure, e);
    }
    await next();
  };
};
