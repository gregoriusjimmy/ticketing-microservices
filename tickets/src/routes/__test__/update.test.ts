import request from 'supertest'
import { app } from '../../app'
import mongoose from 'mongoose'
import { createCookie } from '../../test/auth-helper'
import { natsWrapper } from '../../nats-wrapper'

it('returns a 404 if the provided id does not exist', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put('/api/tickets/')
    .set('Cookie', createCookie())
    .send({ title: 'asda', price: 20 })
    .expect(404)
})
it('returns a 401 if the user is not authenticated', async () => {
  const id = new mongoose.Types.ObjectId().toHexString()
  await request(app)
    .put('/api/tickets/')

    .expect(404)
})
it('returns a 404 if the user does not own the ticket', async () => {
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', createCookie())
    .send({ title: 'asda', price: 20 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', createCookie())
    .send({ title: 'awdawd', price: 100 })
    .expect(401)
})

it('returns a 404 if the user provides an invalid title or price', async () => {
  const cookie = createCookie()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'asda', price: 20 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: '', price: 100 })
    .expect(400)

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'valid title', price: -10 })
    .expect(400)
})

it('update the ticket provided valid inputs', async () => {
  const cookie = createCookie()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'asda', price: 20 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new title', price: 100 })
    .expect(200)

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()

  expect(ticketResponse.body.title).toEqual('new title')
  expect(ticketResponse.body.price).toEqual(100)
})

it('publishes an event', async () => {
  const cookie = createCookie()
  const response = await request(app)
    .post('/api/tickets')
    .set('Cookie', cookie)
    .send({ title: 'asda', price: 20 })

  await request(app)
    .put(`/api/tickets/${response.body.id}`)
    .set('Cookie', cookie)
    .send({ title: 'new title', price: 100 })
    .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})
