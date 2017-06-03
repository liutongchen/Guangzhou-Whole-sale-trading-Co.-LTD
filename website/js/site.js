(function(){
    $(".nav-item").on("click", function() {
        $(".nav-item.active").removeClass("active");
        $(this).addClass("active");
    });

     $("#theCarousel").carousel();

     $("#compIntroCarousel").carousel();

     $('.carousel').carousel();

     $('.carousel-control.left').click(function() {
  $('#myCarousel').carousel('prev');
});

$('.carousel-control.right').click(function() {
  $('#myCarousel').carousel('next');
});
})()
