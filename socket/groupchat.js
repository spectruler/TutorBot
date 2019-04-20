module.exports = function(io,Users){

    const users = new Users()

    io.on('connection',(socket)=>{ //server on 
        console.log('User connected')

        socket.on('joint',(params,callback)=>{
            //socket.join allows a socket to connect to the particular channel
            socket.join(params.room) 

            users.AddUserData(socket.id,params.name,params.room)
            //in socket.to() sender of the event will not see the msg hence used io.to
            io.to(params.room).emit('userList',users.GetUsersList(params.room)) 

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

        socket.on('disconnect',()=>{
            var user = users.RemoveUser(socket.id)

            if(user){
                io.to(user.room).emit('userList',users.GetUsersList(user.room))
            }

        })

    })
}