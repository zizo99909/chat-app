const {getUsers} = require('./users') 

const rooms = []


const addRoom = (newRoom)=>{
    newRoom = newRoom.trim().toLowerCase()

    const isExistingRoom = rooms.find((room)=>room===newRoom)

    if(isExistingRoom){
        return Error ('This room exists')
    }



    rooms.push(newRoom)
    return newRoom
}


const removeRoom = (roomName)=>{
     const isUsersInRoom = getUsers().find(user => user.room === roomName)
     
     if(isUsersInRoom){
         return;
     }

     const index = rooms.findIndex((room)=> room===roomName)

     if(index !==-1){
        return rooms.splice(index,1)[0]
    }
} 

const getRooms = () => rooms

module.exports ={
    addRoom,
    removeRoom,
    getRooms
}