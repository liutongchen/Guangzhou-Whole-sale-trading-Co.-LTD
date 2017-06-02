$(document.html).addClass('js').removeClass('no-js');


window.addEvent('load',function(){
    
     $$('[data-altsrc]').each(function(el){
            var altsrc = JSON.decode(el.get('data-altsrc'));    
    
      var defaultimg = altsrc[0];
            el.getParent('.prefetch').setStyles({'background-image':'url('+defaultimg+')'});
     });
    
});

window.addEvent('domready', function (j) {

    new CLRZiOS($(document.body));
    
    // Optimisation du submit du formulaire de contact
    if($('formcontact') && $('submitcontact')){
        $('formcontact').addEvent('submit',function(e){
            $('submitcontact').set('value','Envoi en cours').disabled = 1;
        });
    }

    initajax();

    singlepagination();

	// Classes navigateur en JS
    clrz_body_class();

    // Push du contenu/menu
    shrink_content();
    
    // Navigation afficher masquer
    deploy_nav();

    // infinite scroll
    infinitescroll();

    // Afficher / Masquer Formulaire de contact
    show_hide_form();
    
   
    
    if($('map_canvas'))
        launch_map_contact();
        
    (function(){
        $$('.single-share').each(function(el){
            if(twttr) twttr.widgets.load();
            if(FB) FB.XFBML.parse();
        })
    }).delay(10);
    
});

function show_hide_form(){
    if($('hide-cc-form') && $('show-cc-form') && $('hide-cc-form')){
        $('show-cc-form').addEvent('click',function(){
            $('cc-form').addClass('active');
        });
        $('hide-cc-form').addEvent('click',function(){
            $('cc-form').removeClass('active');
        });
    }
}