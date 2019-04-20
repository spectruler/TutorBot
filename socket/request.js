module.exports = function(io){
    io.on('connection',(socket)=>{
        
        socket.on('joinRequest',(myRequest,callback)=>{
            socket.join(myRequest.sender);

            callback()
        })


        socket.on('tutorRequest',(friend,callback)=>{
            console.log(friend)
            io.to(friend.receiver).emit('newTutorRequest',{
                from: friend.sender,
                to: friend.receiver
            });
            callback();
        })

    });


}