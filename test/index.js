'use strict';

const koa = require('koa');
const request = require('supertest');
const Router = require('koa-router');

const validator = require('../index');

const router = new Router();
const app = koa();

router.post('/:number/:string/:date',
  validator.validate({
    type: 'json',
    params: {
      number: validator.Joi.number().required(),
      string: validator.Joi.string().required(),
      date: validator.Joi.date().required()
    },
    body: {
      number: validator.Joi.number().required(),
      string: validator.Joi.string().required(),
      date: validator.Joi.date().required()
    },
    headers: validator.Joi.object({
      number: validator.Joi.number().required(),
      string: validator.Joi.string().required(),
      date: validator.Joi.date().required()
    }).options({ allowUnknown: true }),
    query: {
      number: validator.Joi.number().required(),
      string: validator.Joi.string().required(),
      date: validator.Joi.date().required()
    }
  }),
  function * () {
    this.assert(typeof this.params.number === 'number');
    this.assert(typeof this.params.string === 'string');
    this.assert(this.params.date instanceof Date);

    ['body', 'headers', 'query'].forEach(el => {
      this.assert(typeof this.request[el].number === 'number');
      this.assert(typeof this.request[el].string === 'string');
      this.assert(this.request[el].date instanceof Date);
    });

    this.status = 204;
  }
);

app.use(router.allowedMethods());
app.use(router.routes());

describe('Test suite', () => {
  it('should work', () =>
    request(require('http').createServer(app.callback()))
      .post('/12/hello/2013-03-01T01:10:00?number=12&string=hello&date=2013-03-01T01:10:00')
      .set('number', 12)
      .set('string', 'hello')
      .set('date', new Date())
      .send({
        number: 12,
        string: 'hello',
        date: new Date()
      })
      .expect(204)
  );
});