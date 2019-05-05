$(document).ready(function(){
    var socket = io();

    var room = $('#groupName').val()
    var sender = $('#sender').val()
    var channelId = $('channelId').val()

    socket.on('connect',()=>{
        var params = {
            sender: sender
        }
        socket.emit('joinRequest',params,function(){
            console.log('Joined')
        });
    });

    socket.on('newTutorRequest',(friend)=>{
        // load method is used to load data fr
        $('#reload').load(location.href + ' #reload');

        $(document).on('click','#accept_friend',function(){
            var senderId = $('#senderId').val()
            var senderName = $('#senderName').val()
    
            $.ajax({
                url: '/question/'+channelId+'/'+room,
                type:'POST',
                data:{
                    senderId:senderId,
                    senderName: senderName
                },
                success: function(){
                    $(this).parent().eq(1).remove();
                }
            })
            $('#reload').load(location.href + ' #reload');
        })
    
        $(document).on('click','#cancel_friend',function(){
            var user_Id = $('#user_Id').val()
            $.ajax({
                url: '/question/'+channelId+'/'+room,
                type:'POST',
                data:{
                    user_Id: user_Id
                },
                success: function(){
                    $(this).parent().eq(1).remove();
                }
            })
            $('#reload').load(location.href + ' #reload');
        })

    })

    $('#add_friend').on('submit',function(e){
        e.preventDefault()

        var receiverName = $('#receiverName').val()

        $.ajax({
            url:'/question/'+channelId+'/'+room,
            type: 'POST',
            data:{
                receiverName: receiverName
            },
            success: function(){
                //to show real time notification
                socket.emit('tutorRequest',{ 
                    receiver: receiverName,
                    sender: sender
                },function(){
                    console.log('Request Sent')
                })
            }
        })    

    })

    $('#accept_friend').on('click',function(){
        var senderId = $('#senderId').val()
        var senderName = $('#senderName').val()

        $.ajax({
            url: '/question/'+channelId+'/'+room,
            type:'POST',
            data:{
                senderId:senderId,
                senderName: senderName
            },
            success: function(){
                $(this).parent().eq(1).remove();
            }
        })

        $('#reload').load(location.href + ' #reload');

    })

    $('#cancel_friend').on('click',function(){
        var user_Id = $('#user_Id').val()
        $.ajax({
            url: '/question/'+channelId+'/'+room,
            type:'POST',
            data:{
                user_Id: user_Id
            },
            success: function(){
                $(this).parent().eq(1).remove();
            }
        })

        $('#reload').load(location.href + ' #reload');

    })



})