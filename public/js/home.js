$(document).ready(function(){


    $('#post').on('submit',(e)=>{
        e.preventDefault();
        const problem = {
            statement: $('#msg').val(),
            tag: $('#tagged').val()
        }
        console.log(problem)
        $.ajax({
            url: "/post",
            type: "post",
            data:{
                problem: problem
            },
            success: function(){
                console.log("Successfully Posted")
                $('#msg').val("")
            }
        })
        $('#repeat').load(location.href+' #repeat',function(){
            console.log("Loaded page auto")
        })
    })

    $(document).on('click','#delete_post',(e)=>{
        e.preventDefault();
        url =  e.target.name;
        $.ajax({
            url: url,
            type:"POST",
            data:{

            },
            success: function(){
                console.log('deleted post')
            }
        })
        $('#repeat').load(location.href+' #repeat',function(){
            console.log('load performed')
        });
    })

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