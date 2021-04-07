const request = require('supertest')

const app = require('../../app')
const db = require('../database')

const agent = request.agent(app)
const lorem =
  'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis, ut. Sequi quae numquam iure cupiditate recusandae, quos modi sunt iste!'
const user = {
  username: 'test',
  email: 'test@saqib.ml',
  password: 'test_bro_just_test',
}

let article, authRes, cookies

beforeAll(async () => {
  require('../../app/helpers/functions').dotenv('.env.test')
  await db.connect()
})
afterAll(async () => await db.close())

beforeEach(async () => {
  await db.clear()
  article = {
    title: 'Lorem Ipsum',
    body: lorem,
    slug: 'lorem-ipsum',
  }
  authRes = await agent.post('/auth/signup').send(user)
  cookies = authRes.headers['set-cookie'].pop().split(';')[0]
})

describe('POST /articles/create', () => {
  let req
  beforeEach(() => {
    req = agent.post('/articles/create')
    req.cookies = cookies
  })

  it('should create an article', async () => {
    const res = await req.send(article).expect(201)
    expect(res.body.article).toBeTruthy()
  })

  it('should not create an article with invalid cookie', async () => {
    req.cookies = 'VANDALISED COOKIE'
    await req.send(article).expect(302)
  })

  it('should not create an article with invalid fields', async () => {
    article.body = lorem.substr(0, 10)
    const res = await req.send(article).expect(400)
    expect(res.body.article).toBeUndefined()
    expect(res.body.errors).toHaveProperty('body')
  })
})

describe('PUT /articles/:slug/edit', () => {
  let req, payload

  beforeEach(async () => {
    await agent.post('/articles/create').send(article)
    payload = {
      title: 'Lorem Wimpsum',
      body: lorem,
    }
    req = agent.put(`/articles/${article.slug}/edit`)
    req.cookies = cookies
  })

  it('should edit article successfully', async () => {
    const res = await req.send(payload).expect(200)
    expect(res.body.article).toBeTruthy()
  })

  it('should not edit article with invalid cookie', async () => {
    req.cookies = 'VANDALISED COOKIE'
    await req.send(payload).expect(302)
  })

  it("should not edit other user's article", async () => {
    const authRes = await agent.post('/auth/signup').send({
      username: 'test2',
      email: 'test2@saqib.ml',
      password: 'test_bro_just_test',
    })

    req.cookies = authRes.headers['set-cookie'].pop().split(';')[0]
    await req.send(payload).expect(400)
  })

  it('should not edit article with invalid fields', async () => {
    payload = {
      title: 'Lo',
      body: lorem.substr(0, 10),
    }

    const res = await agent
      .put(`/articles/${article.slug}/edit`)
      .send(payload)
      .expect(400)
    expect(res.body.article).toBeUndefined()
    expect(res.body.errors).toHaveProperty('title')
  })
})

describe('DELETE /articles/:slug/delete', () => {
  beforeEach(async () => await agent.post('/articles/create').send(article))

  it('should properly delete the article', () =>
    agent.delete(`/articles/${article.slug}/delete`).expect(200))
})

describe('POST /articles/:slug/like', () => {
  let req
  beforeEach(async () => {
    await agent.post('/articles/create').send(article)
    req = agent.post(`/articles/${article.slug}/like`)
    req.cookies = cookies
  })

  it('should give a like', async () => {
    const res = await req.expect(201)
    expect(res.body.likes).toMatchObject([{ likedBy: { name: user.username } }])
  })

  it('should not like without a valid cookie', async () => {
    req.cookies = 'VANDALISED COOKIE'
    await req.expect(302)
  })

  it('should remove the like', async () => {
    await req.expect(201)
    const res = await agent.post(`/articles/${article.slug}/like`).expect(200)
    expect(res.body.likes).not.toMatchObject([
      { likedBy: { name: user.username } },
    ])
  })
})
