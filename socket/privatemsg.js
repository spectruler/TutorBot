module.exports = function(io){

    io.on('connection',(socket)=>{

        socket.on('join privatemsg',(pm)=>{
            socket.join(pm.room1); //both users will join that event
            socket.join(pm.room2)
        })

        socket.on('private message',(msg,callback)=>{
            io.to(msg.room).emit('new message',{
                text: msg.text,
                sender: msg.sender
            })

            io.emit('message display',{})

            callback()
        })

        socket.on("refresh",()=>{
            io.emit('new fresh',{});
        })

    })

}