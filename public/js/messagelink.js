$(document).ready(function(){
    var socket = io()

    var paramOne = $.deparam(window.location.pathname)   
    var newParam = paramOne.split('-')

    swap(newParam,0,1)
    var paramTwo = newParam[0]+'-'+newParam[1]

    socket.on('connect',()=>{
        var params = {
            room1: paramOne,
            room2: paramTwo
        }
        socket.emit('join privatemsg',params)
    })

    socket.on('new refresh',()=>{
        $('#reload').load(location.href,' #reload');
    })

    $(document).on('click','#messageLink',function(){ //using delegation
        var chatId = $(this).data().value; //getting value from data attr
        $.ajax({
            url: "/private/chat/"+paramOne,
            type: "POST",
            data: {
                chatId: chatId
            },
            success: function(){

            }
        })

        socket.emit('refresh',{})

    })

})

function swap(input,val1,val2){
    var temp = input[val1];
    input[val1] = input[val2]
    input[val2] = temp
}