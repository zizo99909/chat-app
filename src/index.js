const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage,generateLocationMessage} = require('./utils/messages')
const {addUser,removeUser,getUser,getUsersInRoom}=require('./utils/users')
const { addRoom, getRooms, removeRoom } = require('./utils/rooms')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port =process.env.PORT|| 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))



io.on('connection',(socket)=>{
    console.log('New websocket connection')

   
     
     socket.on('join',(options,callback)=>{
        const {error , user}= addUser({id:socket.id,...options})
 
        if(error){
          return callback(error)
        } 
         addRoom(user.room)
         socket.join(user.room)

         socket.emit('message',generateMessage('Admin','Welcome!'))
         socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined!`))
         io.to(user.room).emit('roomData',{
             room:user.room,
             users:getUsersInRoom(user.room)
         })
         callback()
     })

     socket.on('getActiveRooms',()=>{
        socket.emit('activeRooms',getRooms())
    })

    socket.on('sendMessage',(message , callback)=>{
        const user = getUser(socket.id)
        const filter = new Filter()
        filter.addWords('hell')
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback('Delivered!')
    })

    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
       if(user){
        io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left!`))

        removeRoom(user.room)

        io.to(user.room).emit('roomData',{
            room:user.room,
            users :getUsersInRoom(user.room)
        })   

    }
    
    })

    socket.on('sendLocation',(coordinates,callback)=>{
        const user=getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`))
        callback()
    })
   
 

})

server.listen(port,()=>{
    console.log(`Server is up on port ${port}!`)
})

