
var CLRZResponsiveImages = new Class({
	initialize : function(){
		this.initOptions();
		this.getWindowSize();
        this.getElements();
	},
	initOptions : function(){
	    this.opt = {
		    scrwidth : 0
		};
        
        
        
	},
	getWindowSize : function(){
	    // On recupere la largeur de l'écran
        if (parseInt(navigator.appVersion)>3 && screen) {
            this.opt.scrwidth = screen.width;
        }
	},
        
        getResponsize : function(el,altsrc){
            
            var altsrc = JSON.decode(el.get('data-altsrc'));
            var newSize = 0;
            // On récupère la taille alternative la plus grande possible
            for(size in altsrc){
                tsize = parseInt(size);
                if(tsize > newSize && tsize <= this.opt.scrwidth){
                    newSize = tsize;
                }
            }
            return newSize;
        },
        
	getElements : function(){
        var mthis = this, opt = this.opt, scrwidth = this.opt.scrwidth;
        // Pour chaque élément avec un data-altsrc
        $$('[data-altsrc]').each(function(el){
            var altsrc = JSON.decode(el.get('data-altsrc'));    
            
            var newSize=this.getResponsize(el);
            
            var myImage = Asset.image(altsrc[newSize], {
                
               
                onLoad: function(){
                    
                    el.fireEvent('imageloaded');
                    // On charge cette taille
                    if(el.tagName == 'IMG') {
                        el.set('src',altsrc[newSize]);
                    }
                    else if(el.tagName == 'NOSCRIPT') {
                        // On crée un élément image
                        var img = new Element('img');
                        img.set('src',altsrc[newSize]);
                        img.inject(el, 'before');
                    }
                    else {
                        el.setStyles({
                            'background-image':'url('+altsrc[newSize]+')'
                        });
                    }  
                    
                }
            });
            
            
        }.bind(this));
    }
});

window.addEvent('domready',function(){
    if(!$(document.body).hasClass('responsiveon') && $$('.block-background')[0]){
        $(document.body).addClass('responsiveon');
//        setdataaltsrc($$('.block-background')[0]);
        new CLRZResponsiveImages();
    }
});

/* 
<img data-altsrc="{480:'http://placekitten.com/480/480',720:'http://placekitten.com/720/720',1910:'http://placekitten.com/1500/1500'}" src="http://placekitten.com/102/102" />
<noscript data-altsrc="{480:'http://placekitten.com/480/480',720:'http://placekitten.com/720/720',1910:'http://placekitten.com/1500/1500'}" >
    <img src="http://placekitten.com/102/102" />
</noscript>
 */