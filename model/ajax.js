global_delay = 0;
window.addEvent('hashchange',function(hash){
    if(!$(document.body).hasClass('lt_ie9')){
        if(typeof(_gaq) !== 'undefined')
            _gaq.push(['_trackPageview',hash.replace('#!','')]);
        if(history.pushState)
            return;
        if(!$(document.body).hasClass('init')){
            goToUrl(document.location.href.replace('#!/',''));
        }else{
            $(document.body).removeClass('init');
        }
    }
});


// prev/next navigator
window.onpopstate = function(e) {
//        var newurl = e.state.path;
    if(!$(document.body).hasClass('lt_ie9') && (!$(document.body).hasClass('is_webkit') || $(document.body).hasClass('initwebkit'))){
        
        var newurl = document.location.href;
        
        
        if(newurl.indexOf(clrz_wp_site_url)==-1){
            document.location.href(newurl);
        }else{
          
            goToUrl(newurl, true);
        }
    }else{
        $(document.body).addClass('initwebkit');
    }
};


function initajax(){
    if(!$(document.body).hasClass('lt_ie9')){
        $(document.body).addEvent('click:relay(a)',function(e, el){
            is_spectre = true;
            if(el.hostname &&
            el.hostname != window.location.hostname &&
            el.hostname != 'spectre.feed.colorz.fr' &&
            el.hostname != 'spectre-agency.com' &&
            el.hostname != 'www.spectre-agency.com'){
                is_spectre = false;
            }
            if(!el.hasClass("noasync") && el.getProperty('href')!='' && el.getProperty('href')!='#' && is_spectre){
                if(e) e.stop();
                goToUrl(el.getProperty('href'));
            }
        });
    }
}


function goToUrl(_url, uncheckprev){

 
    
    if(document.location.href==_url && !uncheckprev)
        return;

    if(!uncheckprev)
        uncheckprev = false;

    if($(document.body).hasClass('loading') || _url=='' || (_url==document.location.href && uncheckprev==false))
        return;

    $(document.body).addClass('loading');

    if(history.pushState){
        if(uncheckprev==false)
            window.history.pushState({path:_url},'',_url);
    }else{
        var niceurl = '';
        if(_url==clrz_wp_site_url)
            niceurl='/#!/';
        else
            niceurl = '/#!/'+_url.replace(clrz_wp_site_url+'/','');

        document.location.href=niceurl.replace('#!//','#!/');
    }

    window.fireEvent('beforegourl');

    $$('.block-background').set('morph',{'duration':800}).morph({'opacity':0});
    var launch_delay = ($$('.block-background')) ? 800 : 0;
    (function(){

        new Request({
        'method':'post',
        'url':_url,
        'evalScripts':true,
        'onRequest':function(){
            initloader();
        },
        'onComplete':function(response){
            $$('title').set('text',clrz_wp_site_title);
            loadcontent(response);
        }
    }).send('ajax=1');


    }).delay(launch_delay);



}

function loadcontent(response){

    // on ajoute le contenu html dans une div qu'on supprimera
    initwebcontent = $('webcontent');
    newelementdestroy = new Element('div');
    newelementdestroy.setStyles({'position':'absolute','right':0,'bottom':0,'width':1,'height':1,'overflow':'hidden'}).inject($(document.body));
    newelementdestroy.set('html', response);
    $$('.block-background').set('morph',{'duration':1000}).setStyles({'opacity':0});

   responsive_images_background = shuffle(responsive_images_background);
    newelementdestroy.getElements('.block-background').each(function(el,i){
       responsive_images_background = shuffle(responsive_images_background);
//       var newdataalt = (responsive_images_background[0]) ? responsive_images_background[0] : responsive_images_background[1];

       var newdataalt = (responsive_images_background[i]) ? responsive_images_background[i] : responsive_images_background[1];


        el.setProperty('data-altsrc', JSON.encode(newdataalt));

        var defaultimg = newdataalt[0];
        el.getParent('.prefetch').setStyles({'background-image':'url('+defaultimg+')'});
        el.removeEvents('imageloaded').addEvent('imageloaded',function(e){

            var dd = (global_delay>0) ? global_delay+1300 : global_delay+1000;
            (function(){$$('.block-background').morph({'opacity':1});}).delay(dd);

        });

        new CLRZResponsiveImages();
    });




    // apres chargement de toutes les images
    var endloadimg = function(response){


        var delayanim = beforeloading();
        
        closeloader();
        (function(){

            // on charge la nouvelle nav à gauche
            if(newelementdestroy.getElements('#nav')[0])
                initwebcontent.getElements('#nav').set('html', newelementdestroy.getElements('#nav')[0].get('html'));
            shrink_content();

            if(newelementdestroy.getElements('.mainbloc')[0]){


                newelementdestroy.getElements('.mainbloc')[0].addClass('newblock');


                new Fx.Scroll(window, {
                    duration: 700
                }).toTop();


                var durationanim = 500;


                // ajout de toutes les class pendant les anims
                if(newelementdestroy.getElements('#webcontent')[0])
                    initwebcontent.setProperty('class', initwebcontent.getProperty('class')+' '+newelementdestroy.getElements('#webcontent')[0].getProperty('class'));

                var initmain = initwebcontent.getElements('.mainbloc')[0];
                var newmain = newelementdestroy.getElements('.mainbloc')[0];
                if(newelementdestroy.getElements('#webcontent')[0].hasClass('single')){
                    var initleft = parseInt(newmain.getStyle('left'));
                    if($(document.body).hasClass('nextsingle')){
                        newmain.setStyles({'left':-$('webcontent').getWidth(), 'right':$('webcontent').getWidth()});
                    }else{
                        newmain.setStyles({'left':$('webcontent').getWidth(), 'right':-$('webcontent').getWidth()});
                    }
                }else{
                    newmain.setStyles({'top':-newmain.getHeight(), 'bottom':$(document.body).getHeight()});
                }

                // affichage des element un par un
                newelementdestroy.getElements('.itemdisplay').addClass('anim');





                newmain.inject(initmain, 'after');
                initwebcontent.getElements('.mainbloc').set('morph', {duration: durationanim-200, transition: Fx.Transitions.Quint.easeInOut});
                initmain.setStyles({'z-index':10});
                newmain.setStyles({'z-index':20});
                if(newelementdestroy.getElements('#webcontent')[0].hasClass('single')){
                    // "slider" si transition entre deux singles
                    if($(document.body).hasClass('nextsingle')){
                        initmain.morph({'left':$('webcontent').getWidth(), 'right':-$('webcontent').getWidth()});
                    }else{
                        initmain.morph({'left':-$('webcontent').getWidth(), 'right':0});
                    }
                    newmain.morph({'left':initleft, 'right':0});

                }else{
                    // juste un morph sur l'opacity
                    initmain.morph({'top':$(document.body).getHeight(), 'bottom':-$(document.body).getHeight()});
                    newmain.morph({'top':0, 'bottom':0});
                }


                var delaydisplay = 500;
                newmain.getElements('.itemdisplay').each(function(el,i){
                    delaydisplay = delaydisplay+200;
                    (function(){
                        el.removeClass('anim');
                    }).delay(delaydisplay);
                });
                durationanim = durationanim+delaydisplay;

                (function(){
                    $(document.body).removeClass('shrink_content').removeClass('pagesubmenu');
                }).delay(durationanim/2);

                // delay pour laisser le temps à l'anim
                (function(){
                    // on supprime les class inutiles
                    initwebcontent.setProperty('class', newelementdestroy.getElements('#webcontent')[0].getProperty('class'));
                    newmain.removeProperty('style'); // on supprimer les styles inutiles

                    initmain.destroy();
                    endloading();
                    $(document.body).removeClass('nextsingle');
                    $$('.mainbloc').removeClass('newblock');


                }).delay(durationanim+50);

            }else{
                endloading();
            }
        }).delay(delayanim);

    }


    // on precharge les images du nouveau contenu
    if(newelementdestroy.getElements('img').length>0){
        var images = new Array();
        newelementdestroy.getElements('img').each(function(imgelem, iimg){
            images[iimg] = imgelem.getProperty('src');
        });
        new Asset.images(images, {
            onComplete: function() {
                endloadimg(response);
            }
        });
    }else{
        endloadimg(response);
    }
}





function beforeloading(){

    var enddelay = 0;

    var delaydisplay = 0;
    $('webcontent').getElements('.itemdisplay').each(function(el,i){
        delaydisplay = delaydisplay+200;
        enddelay = enddelay+400;
        (function(){
            el.addClass('anim');
        }).delay(delaydisplay);
    });

    global_delay = delaydisplay;



    if(enddelay>2000){
        //prevent too much item to display delay
        enddelay=2000;
    }



    return enddelay;
}


function endloading(){


    $(document.body).removeClass('loading');
    newelementdestroy.destroy();
    window.fireEvent('domready');

}







function initloader(){






    if(!$('theloader'))
        new Element('div', {'id':'theloader'}).set('html', '').inject($(document.body));
//    $('theloader').set('morph', {duration: 400, transition: Fx.Transitions.Quint.easeInOut});
//    $('theloader').morph({'top':$(document.body).getHeight()/2-$('theloader').getHeight()/2});
//    var widthloader = 80;
//    $('theloader').morph({'width':widthloader, 'height':widthloader, 'margin-top':-widthloader/2, 'margin-left':-widthloader/2});
    $('theloader').addClass('anim');
//    $('theloader').setStyles({'display':'block'});

    if($('btn-menu') && $('btn-menu').hasClass('active')){
        $('btn-menu').fireEvent('click');
    }


}


function closeloader(){
//    $('theloader').morph({'width':0, 'height':0, 'margin-top':0, 'margin-left':0});
    $('theloader').removeClass('anim');
//    $('theloader').morph({'top':$(document.body).getHeight()+$('theloader').getHeight()/2});
//        $('theloader').setStyles({'display':'none'});
//        $('theloader').setStyles({'top':-$('theloader').getHeight()});
}