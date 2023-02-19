import { Test, type TestingModule } from '@nestjs/testing'
import { type INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'

describe('Random Lunch End-to-End Tests', () => {
  let app: INestApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  test('/signup (POST)', async () => {
    return await request(app.getHttpServer())
      .post('/signup')
      .send({ name: 'Mike', team: 1 })
      .expect(201)
  })

  test('/results (GET)', async () => {
    return await request(app.getHttpServer())
      .get('/results')
      .expect(200)
  })

  test('Full End-to-End', async () => {
    const server = app.getHttpServer()
    await request(server)
      .post('/signup')
      .send({ name: 'One', team: 1 })
      .expect(201)

    await request(server)
      .post('/signup')
      .send({ name: 'Two', team: 2 })
      .expect(201)

    const res = await request(server)
      .get('/results')
      .expect(200)

    expect(res.body.score).toBe(0)
    expect(res.body.pairs.length).toBe(1)
  })
})
