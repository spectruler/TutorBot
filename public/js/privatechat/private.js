$(document).ready(function(){
    var socket = io()

    var paramOne = $.deparam(window.location.pathname)   
    var newParam = paramOne.split('-')
    var username = newParam[0];
    $('#receiver_name').text(username)
    swap(newParam,0,1)
    var paramTwo = newParam[0]+'-'+newParam[1]

    socket.on('connect',()=>{
        var params = {
            room1: paramOne,
            room2: paramTwo
        }

        socket.emit('join privatemsg',params)

        socket.on('message display',function(){
            $('#reload').load(location.href + ' #reload');
    
        })
    })

    socket.on('new message',(data)=>{
        var template = $('#message-template').html();
        var msg = Mustache.render(template,{
            text: data.text,
            sender: data.from
        })
        $('#messages').append(msg)
    })

    $('#message_form').on('submit',function(e){
        e.preventDefault()

        var msg = $('#msg').val()
        var sender = $('#name-user').val()

        if(msg.trim().length > 0){ //trim spaces
            socket.emit('private message',{
                text: msg,
                sender: sender,
                room: paramOne
            },function(){
                $('#msg').val('') //clearing input field
            })
        }

    })

    $('#send-message').on('click',()=>{
        var msg = $('#msg').val()
        $.ajax({
            url: "/private/chat/"+paramOne,
            type: 'POST',
            data:{
                msg: msg
            },
            success: function(){
                $('#msg').val()
            }
        })
    })
})

function swap(input,val1,val2){
    var temp = input[val1];
    input[val1] = input[val2]
    input[val2] = temp
}