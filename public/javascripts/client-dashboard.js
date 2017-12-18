/**
 * Created by sid on 1/5/17.
 */
$(document).ready(function() {
    $('.manage_page').click(function(event) {
        event.preventDefault();
        $(this).text('Processing..');
        $.post(
            "/view/page/",
            { page_id: $(this).attr("data-page-id"),
              page_token: $(this).attr("data-page-token"),
              user_token: $('#pages-list').attr("data-token")
            },
            function(data) {
                //$('#stage').html(data);
                console.log(data);
            }
        );
    });
});