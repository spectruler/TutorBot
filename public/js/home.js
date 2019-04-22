$(document).ready(function(){

    $('#favorite').on('submit',function(e){
        e.preventDefault()
        var id = $('#id').val()
        var tag = $('#tag').val()
        var question = $('#club_Name').val()

        $.ajax({
            url: "/",
            type: 'POST',
            data:{
                id:id,
                question:question,
                tag:tag
            },
            success: function(){
                console.log(question)
            }
        })

    })

    

 
})