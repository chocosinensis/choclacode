'use strict'

const db = require('../database')
const agent = require('../agent')

beforeAll(async () => {
  require('../../app/helpers/functions').dotenv('.env.test')
  await db.connect()
})
afterAll(async () => await db.close())

beforeEach(async () => await db.clear())

describe('POST /auth/signup', () => {
  let user

  beforeEach(() => {
    user = {
      username: 'test',
      email: 'test@saqib.ml',
      password: 'test_test_bro_test',
    }
  })

  it('should create a new user', (done) =>
    agent
      .post('/auth/signup')
      .send(user)
      .expect(201)
      .then((res) => {
        expect(res.body.user).toBeTruthy()
        done()
      }))

  it('should not create a user with invalid fields', async () => {
    user.email = ''
    const res = await agent.post('/auth/signup').send(user).expect(400)
    expect(res.body.user).toBeUndefined()
    expect(res.body.errors).toHaveProperty('email')
  })

  it('should send back a cookie', async (done) => {
    const res = await agent.post('/auth/signup').send(user)
    expect(res.body.user).toBeTruthy()

    const req = agent.get('/dashboard')
    req.cookies = res.headers['set-cookie'].pop().split(';')[0]

    req.end((err, res) => {
      if (err) return done(err)

      expect(res.status).toBe(200)
      done()
    })
  })
})

describe('POST /auth/login', () => {
  let user

  beforeEach(async () => {
    user = {
      username: 'test',
      password: 'test_test_bro_test',
    }

    await agent.post('/auth/signup').send({
      ...user,
      email: 'test@saqib.ml',
    })
    await agent.get('/auth/logout')
  })

  it('should login successfully', async (done) => {
    const res = await agent.post('/auth/login').send(user)
    expect(res.body.user).toBeTruthy()

    const req = agent.get('/dashboard')
    req.cookies = res.headers['set-cookie'].pop().split(';')[0]

    req.end((err, res) => {
      if (err) return done(err)

      expect(res.status).toBe(200)
      done()
    })
  })

  it('should not login with wrong creds', async () => {
    user.username = 'nottest'
    user.password = 'wrong_password'

    const res = await agent.post('/auth/login').send(user).expect(400)
    expect(res.body.user).toBeUndefined()
    expect(res.body.errors).toHaveProperty('username')
  })
})

describe('/auth/account', () => {
  describe('PUT /auth/account', () => {
    let req, user

    beforeEach(async () => {
      req = agent.put('/auth/account')
      user = {
        username: 'test',
        password: 'test_test_bro_test',
      }

      const res = await agent.post('/auth/signup').send({
        ...user,
        email: 'test@saqib.ml',
      })
      req.cookies = res.headers['set-cookie'].pop().split(';')[0]
    })

    it('should successfully change the password', async () => {
      const res = await req
        .send({
          current: user.password,
          newPass: 'testing_just_test',
        })
        .expect(200)

      expect(res.body.user).toBeTruthy()
      await agent.get('/auth/logout')

      await agent.post('/auth/login').send(user).expect(400)
      await agent
        .post('/auth/login')
        .send({ username: user.username, password: 'testing_just_test' })
        .expect(200)
    })

    it('should not change the password without cookie', async () => {
      req.cookies = 'VANDALISED COOKIE'
      await req
        .send({
          current: user.password,
          newPass: 'testing_just_test',
        })
        .expect(302)
    })

    it('should not change the password with wrong creds', async () => {
      const res = await req
        .send({
          current: 'VANDALISED PASSWORD',
          newPass: 'testing_just_test',
        })
        .expect(400)
      expect(res.body.errors).toHaveProperty('password')
    })
  })

  // describe('PUT /auth/account/image', () => {
  //   let req, user, cookies

  //   beforeEach(async () => {
  //     req = agent.put('/auth/account/image')
  //     user = {
  //       username: 'test',
  //       password: 'test_test_bro_test',
  //     }

  //     const res = await agent.post('/auth/signup').send({
  //       ...user,
  //       email: 'test@saqib.ml',
  //     })
  //     cookies = res.headers['set-cookie'].pop().split(';')[0]
  //   })

  //   it('should change the profile image with actual image', () => {})

  //   it('should change profile image with url', async () => {
  //     const res = await req
  //       .send({ image: '/public/assets/img/logo/avatar.png' })
  //       .expect(200)
  //     expect(res.body.image).toBe('/public/assets/img/logo/avatar.png')
  //   })
  // })

  describe('DELETE /auth/account', () => {
    let req, user

    beforeEach(async () => {
      req = agent.delete('/auth/account')
      user = {
        username: 'test',
        password: 'test_test_bro_test',
      }

      const res = await agent.post('/auth/signup').send({
        ...user,
        email: 'test@saqib.ml',
      })
      req.cookies = res.headers['set-cookie'].pop().split(';')[0]
    })

    it('should remove the user successfully', async () => {
      const res = await req
        .send({
          email: 'test@saqib.ml',
          password: user.password,
        })
        .expect(200)
      expect(res.body.user).toBeTruthy()
    })

    it('should not remove the user without cookie', async () => {
      req.cookies = 'VANDALISED COOKIE'
      await req
        .send({
          email: 'test@saqib.ml',
          password: user.password,
        })
        .expect(302)
    })

    it('should not remove the user with wrong creds', async () => {
      const res = await req
        .send({ email: 'invalid@email.com', password: 'VANDALISED PASSWORD' })
        .expect(400)
      expect(res.body.errors).toHaveProperty('email')
    })
  })
})
