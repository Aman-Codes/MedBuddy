const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../../app');

const request = supertest(app);

describe('Index routes test', () => {
  beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await mongoose.connect(
      process.env.MONGODB_URL_TEST,
      { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true },
      (err) => {
        if (err) {
          console.error('Error occured ', err);
          process.exit(1);
        }
      }
    );
  });
  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('tests the /robots.txt route status code', async () => {
    const response = await supertest(app).get('/robots.txt');
    expect(response.status).toBe(200);
  });

  it('tests the /sitemap.xml route status code', async () => {
    const response = await supertest(app).get('/sitemap.xml');
    expect(response.status).toBe(200);
  });

  it('tests the / route status code', async () => {
    const response = await supertest(app).get('/');
    expect(response.status).toBe(200);
  });

  it('tests the /about route status code', async () => {
    const response = await supertest(app).get('/about');
    expect(response.status).toBe(200);
  });

  it('tests the /faq route status code', async () => {
    const response = await supertest(app).get('/faq');
    expect(response.status).toBe(200);
  });

  it('tests the /gallery route status code', async () => {
    const response = await supertest(app).get('/gallery');
    expect(response.status).toBe(200);
  });

  it('tests the /news route status code', async () => {
    const response = await supertest(app).get('/news');
    expect(response.status).toBe(200);
  });

  it('tests the /privacypolicy route status code', async () => {
    const response = await supertest(app).get('/privacypolicy');
    expect(response.status).toBe(200);
  });

  it('tests the /services route status code', async () => {
    const response = await supertest(app).get('/services');
    expect(response.status).toBe(200);
  });

  it('tests the /terms route status code', async () => {
    const response = await supertest(app).get('/terms');
    expect(response.status).toBe(200);
  });

  it('tests the /view2 route status code', async () => {
    const response = await supertest(app).get('/view2');
    expect(response.status).toBe(200);
  });
});
