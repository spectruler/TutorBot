$(document).ready(function(){
    $(document).on('click','#val',function(){
        $('#name').text('@'+$(this).children("span").text()) //text method for elements
        $('#receiverName').val($(this).children("span").text()) //val for input fields
    })

})
