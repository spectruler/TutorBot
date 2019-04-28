//client side socket io 

$(document).ready(function(){
    var socket = io();

    var room = $('#groupName').val();
    var sender = $('#sender').val();

    var channelId = $('#channelId').val()

    socket.on('connect',()=>{  //listen for connect event
        console.log('Yea! User connected')

        //to emit the joint events
        var params = {
            room: room,
            name: sender,
            channelId: channelId
        }
        socket.emit('joint',params,function(){
            console.log('User has joined this channel');
        })
    })

    socket.on('userList',function(users){
        var ol = $('<ol></ol>');

        for(var i = 0;i < users.length;i++){
            ol.append('<p><a id="val" data-toggle="modal" data-target="#myModal">'+users[i]+'</a></p>')
        }

        //adding event delegation
        $(document).on('click','#val',function(){
            
            $('#name').text('@'+$(this).text()) //text method for elements
            $('#receiverName').val($(this).text()) //val for input fields
        })

        $('#numValue').text('('+ users.length+')');

        $('#users').html(ol);
    })

    socket.on('newMessage',function(data){
        var template = $('#message-template').html();
        //use mustache to append that 
        var msg = Mustache.render(template,{
            text: data.text,
            sender: data.from
        })
        $('#messages').append(msg)

    })


    $('#message-form').on('submit',function(e){
        e.preventDefault()

        var msg = $('#msg').val()

        //emit message and other parameter is data
        socket.emit('createMessage',{
            text: msg,
            room: room,
            sender: sender,
            channelId: channelId
        },function(){ //acknowlegment 
            $('#msg').val(''); // clear the textarea
        }) 

        $.ajax({
            url: "/question/"+channelId+"/"+room,
            type: "POST",
            data:{
                message: msg,
                group: room,
                channelId: channelId
            },
            success: function(){
                $('#msg').val('')
            }
        })

    })

})