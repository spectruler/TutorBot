module.exports = function(io){

    io.on('connection',(socket)=>{ //server on 
        console.log('User connected')

        socket.on('joint',(params,callback)=>{
            //socket.join allows a socket to connect to the particular channel
            socket.join(params.room) 

            callback()
        });

        //socket.on due to get msg from particular socket
        socket.on('createMessage',(message,callback)=>{
            console.log(message)
            //emit msg for all connected users
            io.to(message.room).emit('newMessage',{ //emitting message to particular group
                text: message.text,
                room: message.room,
                from: message.sender
            }); 
            callback() //for clearing the textarea
        })

    })
}