function IsNumeric(valeur) {
    return (valeur - 0) == valeur && valeur.length > 0;
}

function clrz_body_class() {
    bod = document.body.className.split(' ');
    var nav = navigator.userAgent.toLowerCase();

    // Detect capacities
    if (window.Touch && !$(document.body).hasClass('is_touchscreen')) bod.push('is_touchscreen');

    // Detect FFx
    if(nav.match(/firefox/gi) && !$(document.body).hasClass('is_firefox')) bod.push('is_firefox');

    // Detect Webkit
    if(nav.match(/AppleWebKit/gi) && !$(document.body).hasClass('is_webkit')) bod.push('is_webkit');

    // Detect Chrome
    if(nav.match(/Chrome/gi) && !$(document.body).hasClass('is_chrome')) bod.push('is_chrome');

    // Detect Opera
    if(nav.match(/opera/gi) && !$(document.body).hasClass('is_opera')) bod.push('is_opera');

    // Detect iOS
    if((nav.match(/ipod/gi) || nav.match(/iphone/gi) || nav.match(/ipad/gi)) && !$(document.body).hasClass('is_ios')) bod.push('is_ios');
    if(nav.match(/ipod/gi) && !$(document.body).hasClass('is_ipod')) bod.push('is_ipod');
    if(nav.match(/iphone/gi) && !$(document.body).hasClass('is_iphone')) bod.push('is_iphone');
    if(nav.match(/ipad/gi) && !$(document.body).hasClass('is_ipad')) bod.push('is_ipad');

    document.body.className = bod.join(' ');
}


function clrz_placeholder(input){
    if (!input || input.getProperty('placeholder') == '' || ("placeholder" in document.createElement("input"))) return null;
    var placeholder = input.getProperty('placeholder');
    input.erase('placeholder');

    if(input.tagName == 'TEXTAREA')
        input.setProperty('value', input.get('html'));

    var is_password = (input.type == 'password');
    if(is_password) input.setProperty('type', 'text');

    if(input.getProperty('value') == '')
        input.setProperty('value', placeholder).addClass('defaultvalue');

    input.addEvents({
        'focus':function(e){
            if(input.getProperty('value') == placeholder){
                input.setProperty('value', '');
                input.removeClass('defaultvalue');
                if(is_password) input.setProperty('type', 'password');
            }
        },
        'blur':function(e){
            if(input.getProperty('value') == ''){
                input.addClass('defaultvalue');
                if(is_password) input.setProperty('type', 'text');
                input.setProperty('value', placeholder);
            }
        }
    });
}


/* ANCRE */
function initSmoothScroll(linkancre) {
    $$(linkancre).each(function(el,i){
        el.addEvents({
            'click': function(e){
                e.stop();
                var target = el.getProperty('href');
                var divToScrollTo = target.split('#')[1];
                if($(divToScrollTo)){
                    new Fx.Scroll(window, {
                        duration: 700
                    }).toElement($(divToScrollTo));
                }
            }
        });
    });
}


function deploy_nav(){
    if($('btn-menu') && $('nav')) {
        var classcurrent = 'active';
        $('btn-menu').removeEvents('click').addEvent('click',function(e){
            if(e)
                e.preventDefault();

            if($('nav').hasClass(classcurrent)) {
                $('nav').removeClass(classcurrent);
                this.removeClass(classcurrent);
            }
            else {
                $('nav').addClass(classcurrent);
                this.addClass(classcurrent);
            }
        });
    }
}

function shrink_content(){
    $$('#main-menu .shrink_content a.noasync').removeEvents().addEvents({
        'click':function(e){
            e.stop();
            if($(document.body).hasClass('shrink_content'))
                $(document.body).removeClass('shrink_content');
            else{
                $(document.body).addClass('shrink_content');
                $$('#webcontent').addClass('pagesubmenu');
            }

            if(!$(document.body).hasClass('lt_ie9')){
                goToUrl(this.getProperty('href'));
            }
        }
    });
}

function singlepagination(){
    $$('.pagination-single li a.le_btn').addEvents({
        'click':function(e){
            if(this.hasClass('next-link-single'))
                $(document.body).addClass('nextsingle');
        }
    });
}


var CLRZiOS = new Class({
    initialize : function(cible){
        this.cible = cible;
        this.setDeviceKind();
        if(this.DeviceKind){
            this.addEvents();
            this.addActions();
        }
    },
    addActions : function(){
        // Zoom des typos
        this.cible.setStyles({
            '-webkit-text-size-adjust':'none'
        });

        // Masquage de la barre d'adresse si possible
        setTimeout(function(){
            window.scrollTo(0,1);
        },50);
    },
    addEvents : function(){
        var mthis = this;

        mthis.setOrientationDir();
        mthis.setOrientationKind();

        window.addEvent('orientationchange',function(){
            mthis.setOrientationDir();
            mthis.setOrientationKind();
        });
    },
    setViewport : function(dir){
        if(dir != 'height') dir = 'width';
        var meta_viewport = $$('meta[name=viewport]');
        if(meta_viewport[0]) {
            meta_viewport.set('content','width=device-'+dir+', initial-scale=1.0')
        }
    },
    setDeviceKind : function(){
        var user_agent = navigator.userAgent.toLowerCase();
        this.DeviceKind  = false;
        if(user_agent.match(/ipad/gi)){
            this.DeviceKind = 'ipad';
        }
        if(user_agent.match(/ipod/gi)){
            this.DeviceKind = 'ipod';
        }
        if(user_agent.match(/iphone/gi)){
            this.DeviceKind = 'iphone';
        }
    },
    setOrientationDir : function(){
        var orientation_dir = '';
        switch(window.orientation){
            case 0:
                orientation_dir = "orientation-normal";
                break;

            case -90:
                orientation_dir = "orientation-right";
                break;

            case 90:
                orientation_dir = "orientation-left";
                break;

            case 180:
                orientation_dir = "orientation-flipped";
                break;
        }

        this.cible.removeClass('orientation-normal');
        this.cible.removeClass('orientation-right');
        this.cible.removeClass('orientation-left');
        this.cible.removeClass('orientation-flipped');

        this.orientation_dir = orientation_dir;

        this.cible.addClass(orientation_dir);
    },
    setOrientationKind : function(){
        var orientation_status = '';
        var viewport_dir = '';
        switch(window.orientation){
            case 0:
            case 180:
                orientation_status = "orientation-vertical";
                break;

            case 90:
            case -90:
                orientation_status = "orientation-horizontal";
                viewport_dir = 'height';
                break;
        }

        this.cible.removeClass('orientation-vertical');
        this.cible.removeClass('orientation-horizontal');

        // this.setViewport(viewport_dir);

        this.orientation_status = orientation_status;

        this.cible.addClass(orientation_status);
    }
});


function launch_map_contact(){

    var styles = [
    {
        featureType: "administrative",
        elementType: "all",
        stylers: [{
            saturation: -100
        }]
    },
    {
        featureType: "landscape",
        elementType: "all",
        stylers: [{
            saturation: -100
        }]
    },
    {
        featureType: "poi",
        elementType: "all",
        stylers: [{
            saturation: -100
        }]
    },
    {
        featureType: "road",
        elementType: "all",
        stylers: [{
            saturation: -100
        }]
    },
    {
        featureType: "water",
        elementType: "all",
        stylers: [{
            saturation: 100
        }]
    }
    ];
    var styledMap = new google.maps.StyledMapType(styles,  {
        name: "Styled Map"
    });
    var myLatlng = new google.maps.LatLng(48.8794876, 2.3292929);
    var map = new google.maps.Map(document.getElementById('map_canvas'), {
        zoom: 14,
        center: myLatlng,
        disableDefaultUI: true,
        scrollwheel: false,
        mapTypeControl: false
    });
    var beachMarker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        icon: clrz_wp_template_url+'/images/pages/cursor.png'
    });

    $('map_canvas').addEvent('mouseleave',function(){
        map.setCenter(myLatlng);
        map.setZoom(14);
    });

    window.addEvent('resize',function(){
        map.setCenter(myLatlng);
        map.setZoom(14);
    });

    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');
}


function shuffle(a)
{
    var j = 0;
    var valI = '';
    var valJ = valI;
    var l = a.length - 1;
    while(l > -1)
    {
        j = Math.floor(Math.random() * l);
        valI = a[l];
        valJ = a[j];
        a[l] = valJ;
        a[j] = valI;
        l = l - 1;
    }
    return a;
}



function infinitescroll(){

    window.removeEvents('scroll');
    if($('nextpage') && $('navinews') && $('listnews')){
        window.addEvents({
            'scroll':function(){
                if($('navinews')){
                    var poslink = $('navinews').getCoordinates().top-$(document.body).getHeight()-100;
                    var bodyheight = $(document.body).getScroll().y;
                    if($('nextpage') && !$(document.body).hasClass('chargepagination')){
                        if(bodyheight>poslink){
                            $(document.body).addClass('chargepagination');
                            var urlrequest=$('nextpage').getProperty('href');
                            new Request({
                                url: urlrequest,
                                'onSuccess':function(responseHTML){
                                    $(document.body).removeClass('chargepagination');
                                    var initlist = $('listnews');
                                    var initnavi = $('navinews');
                                    if(responseHTML!=''){
                                        var newelement = new Element('div').setStyles({'display':'none'}).inject($(document.body)).set('html',responseHTML );
                                        if(newelement.getElements('#listnews')[0]){
                                            initlist.set('html', initlist.get('html')+newelement.getElements('#listnews')[0].get('html'));
                                            if( newelement.getElements('#navinews')[0]){
                                                initnavi.set('html', newelement.getElements('#navinews')[0].get('html'));
                                                window.fireEvent('scroll');
                                            }else
                                                initnavi.destroy();
                                        }else
                                            initnavi.destroy();
                                        newelement.destroy();
                                    }
                                }
                            }).send('ajaxpagi=1');
                        }
                    }
                }
            }
        });
        window.fireEvent('scroll');

    }

}

function setdataaltsrc(el){
    responsive_images_background = shuffle(responsive_images_background);
    var newdataalt = '';
    if(responsive_images_background[0] && responsive_images_background[0]!=el.getProperty('data-altsrc')){
        newdataalt = responsive_images_background[0];
    }else if(responsive_images_background[1] && responsive_images_background[1]!=el.getProperty('data-altsrc')){
        newdataalt = responsive_images_background[1];
    }else{
        newdataalt = responsive_images_background[2];
    }
    el.setProperty('data-altsrc', JSON.encode(newdataalt));
}