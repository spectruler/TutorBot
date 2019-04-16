$(document).ready(function(){
    $('.upload-btn').on('click',function(){
        console.log('hello')
        $('#upload-input').click()

    })
    $('#upload-input').on('change',function(){
        console.log('hi')
        var uploadInput = $('#upload-input')
        
        if(uploadInput.val() != ''){
            var formData = new FormData()
            console.log('hello')
            formData.append('tutor[tutorImage]',uploadInput[0].files[0]);

            $.ajax({
                url: '/tutor/upload',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: function(){
                    uploadInputput.val('')
                }
            })
        }


    })
})