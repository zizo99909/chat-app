const socket =io()

const activeRoomsTemplate = document.querySelector('#active-rooms-template').innerHTML

socket.emit('getActiveRooms')

socket.on('activeRooms',(rooms)=>{
    const html = Mustache.render(activeRoomsTemplate,{rooms})
    document.querySelector('#rooms').insertAdjacentHTML('beforeend',html)
})