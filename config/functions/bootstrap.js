'use strict'

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#bootstrap
 */

const users = []

const getUser = (id) => users.find((user) => user.id === id)

const getChannelUsers = (channel) =>
  users.filter((user) => user.channel === channel)

const addUser = ({ id, name, channel }) => {
  name = name.trim().toLowerCase()
  channel = channel.trim().toLowerCase()

  const existingUser = users.find(
    (user) => user.channel === channel && user.name === name
  )

  if (!name || !channel) {
    return { error: 'Username and channel are required.' }
  }
  if (existingUser) {
    return { error: 'Akun anda terhubung di device lain' }
  }

  const user = { id, name, channel }

  users.push(user)

  return { user }
}

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id)

  if (index !== -1) {
    return users.splice(index, 1)[0]
  }
}

module.exports = async () => {
  process.nextTick(() => {
    const socketIo = require('socket.io')
    const io = socketIo(strapi.server)
    io.on('connection', function (socket) {
      console.log('a user connected')

      socket.on('send message', (message, callback) => {
        const user = getUser(socket.id)

        io.to(user.channel).emit('message', { user: user.name, text: message })
        console.log(`${user.name} sent message: ${message}`)

        callback()
      })

      socket.on('join channel', ({ name, channel }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, channel })

        console.log(`${name} join ${channel}`)

        if (error) {
          return callback(error)
        }

        socket.join(user.channel)

        socket.emit('message', {
          user: 'admin',
          text: `${user.name}, welcome to channel ${user.channel}.`,
        })

        socket.broadcast
          .to(user.channel)
          .emit('message', { user: 'admin', text: `${user.name} is online!` })

        io.to(user.channel).emit('get channel info', {
          channel: user.channel,
          users: getChannelUsers(user.channel),
        })

        callback()
      })

      // listen for user diconnect
      socket.on('disconnect', () => {
        const user = removeUser(socket.id)

        if (user) {
          io.to(user.channel).emit('message', {
            user: 'Admin',
            text: `${user.name} has left.`,
          })
          io.to(user.channel).emit('get channel info', {
            channel: user.channel,
            users: getChannelUsers(user.channel),
          })
        }
      })
    })
    // const apa = await strapi.controllers.channel.find()
    // console.log('apa', apa)
    strapi.io = io // register socket io inside strapi main object to use it globally anywhere
    // strapi.emitToAllUsers = () => io.emit('test data', users)
  })
}
