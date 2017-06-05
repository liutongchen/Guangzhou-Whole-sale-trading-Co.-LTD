(function(){
    $(".nav-item").on("click", function() {
        $(".nav-item.active").removeClass("active");
        $(this).addClass("active");
    });

     $("#theCarousel").carousel();

     $("#compIntroCarousel").carousel();

    $(".modalBtn").on("click", function() {
        $(this).next(".myModal").modal("show");
    })     
})()
