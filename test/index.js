'use strict';

const test = require('ava');
const Koa = require('koa');
const compose = require('koa-compose');
const request = require('supertest');
const Router = require('koa-router');

const validator = require('../src/index');

const router = new Router();
const app = new Koa();

router.get('/:yolo/:yola/:huhu', function (ctx) {
  console.log('HELLO WORLD');
  ctx.body = 'YOLO';
});

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
  ctx => {
    ctx.assert(typeof ctx.params.number === 'number');
    ctx.assert(typeof ctx.params.string === 'string');
    ctx.assert(ctx.params.date instanceof Date);

    ['body', 'headers', 'query'].forEach(el => {
      ctx.assert(typeof ctx.request[el].number === 'number');
      ctx.assert(typeof ctx.request[el].string === 'string');
      ctx.assert(ctx.request[el].date instanceof Date);
    });

    this.status = 204;
  }
);

app.use(router.allowedMethods());
app.use(router.routes());

test('should work', () => {
  return request(require('http').createServer(app.callback()))
    .post('/12/hello/2013-03-01T01:10:00?number=12&string=hello&date=2013-03-01T01:10:00')
    .expect(200);
});

test('should work', () =>
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
