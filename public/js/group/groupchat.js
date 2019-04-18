//client side socket io 

$(document).ready(function(){
    var socket = io();

    var room = $('#groupName').val();
    var sender = $('#sender').val();

    socket.on('connect',()=>{  //listen for connect event
        console.log('Yea! User connected')

        //to emit the joint events
        var params = {
            room: room
        }
        socket.emit('joint',params,function(){
            console.log('User has joined this channel');
        })
    })

    socket.on('newMessage',function(data){
        console.log(data.text)
        console.log(data.room)
    })


    $('#message-form').on('submit',function(e){
        e.preventDefault()

        var msg = $('#msg').val()

        //emit message and other parameter is data
        socket.emit('createMessage',{
            text: msg,
            room: room,
            sender: sender
        },function(){ //acknowlegment 
            $('#msg').val(''); // clear the textarea
        }) 
    })

})