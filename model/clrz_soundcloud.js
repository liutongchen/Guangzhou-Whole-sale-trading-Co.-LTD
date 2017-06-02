

var clrzSoundcloud = new Class({
    Implements: [Options,Events],
    options : {
        element:null
    },
    initialize : function(options){
        this.setOptions(options);
        this.sndlink = this.options.element;
        this.sndlink.setStyle('display','none');
        this.element = new Element('div',{
            'class':'sndplayer'
        });

        this.list_el = {};

        var track_url = this.options.element.getProperty('href');
        this.track_url = track_url;

        SC.get('/resolve', {
            url: track_url
        }, function(track) {

            this.track = track;

            SC.stream("/tracks/"+this.track.id,
            {
                autoPlay: false,
                whileplaying:function(){
                    this.element.fireEvent('whileplaying');
                    this.whileplaying();

                }.bind(this)
                ,
                onfinish:function(){
                    this.element.fireEvent('onfinish');
                    this.onfinish();

                }.bind(this)
                ,
                onpause:function(){
                    this.element.fireEvent('onpause');
                    this.onpause();

                }.bind(this)
                ,
                onload:function(success){

                    if(!success){

                        this.buffering();
                        return;
                    }


                    this.element.fireEvent('onload');
                    this.onload(success);

                }.bind(this)

            //               , ontimedcomments: function(comments){
            //                    console.log(comments[0].body);
            //                }


            },function(sndmngr){

                this.construct(sndmngr);
            }.bind(this));



        }.bind(this));
    },

    construct : function(sndmngr){

        this.element.store('snd',sndmngr);


        this.element.set('html','<div class="sndcld_player">'+
    	'<div class="timer">0.00 / 0.00</div>'+
    	'<div class="pause le_btn">pause</div>'+
    	'<div class="play le_btn">play</div>'+
    	'<a class="title track_link noasync le_btn" target="_blank" href="#"></a>'+
    	'<div class="timeline_container"><span class="timeline"></span></div>'+
    	'</div><div class="title"></div>')


    	/* --------------------------
            Elements
           ----------------------- */

    	/* Player */
    	this.list_el.bl_sndcld_player = this.element.getElements('.sndcld_player');

    	/* Timer */
    	this.list_el.bl_timer = this.element.getElements('.timer');

    	/* Btn Pause */
    	this.list_el.bl_pause = this.element.getElements('.pause');

    	/* Btn Play */
    	this.list_el.bl_play = this.element.getElements('.play');

    	/* Tracklinks */
    	this.list_el.bl_track_link = this.element.getElements('.track_link');

    	/* timeline */
    	this.list_el.bl_timeline_container = this.element.getElements('.timeline_container');
    	this.list_el.bl_timeline_time = this.element.getElements('.timeline');


    	/* Title */
    	this.list_el.bl_title = this.element.getElements('.title');


    	/* --------------------------
            Init events
           ----------------------- */

    	this.list_el.bl_timer.set('html','0.00 / '+this.mstomin(this.track.duration));
    	this.list_el.bl_title.set('html',this.sndlink.get('html'));
    	this.list_el.bl_track_link.setProperty('href',this.track.permalink_url);
        this.list_el.bl_play.addEvent('click',function(e){
            new Event(e).stop();

              this.element.sound('togglePause');

        }.bind(this));

        this.list_el.bl_pause.addEvent('click',function(e){
            new Event(e).stop();
            this.element.sound('pause');

        }.bind(this));


        this.list_el.bl_timeline_container.each(function(el,i){

            el.addEvent('click',function(e){
                new Event(e).stop();

                var tcpos = el.getPosition();
                var pos = (e.page.x-tcpos.x);
                var dur = el.getWidth();
                var percent = ((pos/dur)*100);
                var duration = sndmngr.duration;

                this.element.sound('setPosition',(duration*percent)/100);

            }.bind(this));



        }.bind(this));


        this.element.inject(this.sndlink,'after');
        this.sndlink.destroy();
    },


    // events
    whileplaying : function(){
        if(this.element.retrieve('snd').paused){
            this.element.removeClass('playing').addClass('pausing');

        }else{
            this.element.removeClass('pausing').addClass('playing');
        }

        var pos = this.element.retrieve('snd').position;
        var dur = this.element.retrieve('snd').duration;

        var percent = ((pos/dur)*100);


        this.list_el.bl_timeline_time.setStyles({
            'width':percent+'%'
            });

        // Timer affiché
        this.list_el.bl_timer.set('html',this.mstomin(this.element.retrieve('snd').position) + ' / ' + this.mstomin(this.element.retrieve('snd').duration));

    },
    onpause : function(){

        this.element.removeClass('playing').addClass('pausing');
    },
    onfinish : function(){

        this.element.removeClass('playing').addClass('pausing');
    },
    buffering : function(){

        this.element.addClass('buffering').removeClass('loaded');
    },
    onload : function(success){

        this.element.addClass('loaded').removeClass('buffering');
    },
    mstomin : function(duration){
        var retour = '';
        var nb_sec = Math.floor(duration/1000);
        var nb_min_brut = Math.floor(nb_sec/60);
        var nb_sec_brut = nb_sec - (nb_min_brut*60);
        if(nb_sec_brut < 10){
            nb_sec_brut = '0'+nb_sec_brut;
        }
        retour = nb_min_brut+'.'+nb_sec_brut;
        return retour;
    }




});

Element.implement({
    sound: function(cmd,options){

        if(!this.retrieve('snd'))
            return this;



        this.retrieve('snd')[cmd](options);
        return this;
    }



});


window.addEvent('beforegourl',function(){

    $$('.sndplayer').each(function(el,i){
        el.retrieve('snd').destruct();

    });

});


window.addEvent('domready',function(e){



    SC.initialize({
        client_id: '910875a6c4461efb152c847613579370'
    });


    $$('.snd').each(function(el,i){

        new clrzSoundcloud({
            element:el
        });
    });

});