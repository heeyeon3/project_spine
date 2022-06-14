// 세로모드
var isportrait = false;
var touch_ratio = 1;


$(function(){
    const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)

    const canvas = document.getElementById('mycanvas')
    const container = document.getElementById('container')
    var width = 0;
    var height = 0;
    var scale = width/1920; 
    if(isMobile){
        width  = $("html").width();
        height = width * 0.5625;
        scale = width/1920; 

        if(height > $("html").height()){
            height = $("html").height();
            width = height / 0.5625;
            scale = width/1920; 
        }

        // 강제로 세로로 - 모바일
        if($('html').width() < $('html').height() && $('html').width() < 720){
            isportrait = true;
            console.log("세로고정");
            $("body").css("transform", "rotate(90deg)");

            width  = $('html').height();
            height = width * 0.5625;
            scale = width/1920; 
            console.log(width, height, scale)

            if(height > $('html').width()){
                height = $('html').width();
                width = height / 0.5625;
                scale = width/1920; 
                console.log("IN!!",width, height, scale)
            }
            $("#loading").css("width", width);
            $("#loading").css("height", height);
        
            $("#loading").css("margin-top", ($("html").height() - width) / 2 + "px"  );
            $("#container").css("margin-top", ($("html").height() - width) / 2 + "px"  );

        }else{
            $("#loading").css("margin-left", ($("html").width() - width) / 2 + "px"  );

        }


        app = new PIXI.Application({
            view: canvas,
            width: width,
            height: height,
            resolution : 2,
            autoDensity : true,
            antialias : true
        });
        touch_ratio = 2;


    } else {
        width  = window.innerWidth;
        height = width * 0.5625;
        scale = width/1920; 

        if(height > window.innerHeight){
            height = window.innerHeight;
            width = height / 0.5625;
            scale = width/1920; 
        }
        $("#loading").css("margin-left", ($("html").width() - width) / 2 + "px"  );
        app = new PIXI.Application({
            view: canvas,
            width: width,
            height: height,
            resolution : 1,
            autoDensity : true,
            antialias : true
        });

    }
    $("#loading").css("width", width);
    $("#loading").css("height", height);

    console.log($("html").width());
    console.log($("html").height());
    
    console.log(width, height, scale);
    console.log($('body').width());
    console.log($('body').height());
    
    container.appendChild(app.view);

    // load spine data
    app.loader
        .add('Ending', '/ticto/spine/Ending/Ending.json')

        .add('grey_scale',      'grey_scale.png')
        .add('UIPlayBtn',       'UIPlayBtn.png')

        .add('DCCS_Music2',     '/ticto/sound/bgm/7DCCS_Music2.wav')

        .add('story_24',            '/ticto/sound/Story/24_NowLoadOpen.mp3')
        .add('story_25',            '/ticto/sound/Story/25_HoldonJjakkak.mp3')
        .add('story_26',            '/ticto/sound/Story/26_SpaceTravelStart.mp3')
        .add('story_27',            '/ticto/sound/Story/27_RuddyJjakkakAdventure.mp3')
        .load(onAssetsLoaded);
 


    app.stage.interactive = true;
    app.stage.buttonMode = true;

    function onAssetsLoaded(loader, res){
        $("#loading").hide();
        $("#container").show();
        //tutorial take01
        let tutorial = new PIXI.spine.Spine(res.Ending.spineData);

        let bgm = PIXI.sound.Sound.from(res.DCCS_Music2);

        let story_24 = PIXI.sound.Sound.from(res.story_24);
        let story_25 = PIXI.sound.Sound.from(res.story_25);
        let story_26 = PIXI.sound.Sound.from(res.story_26);
        let story_27 = PIXI.sound.Sound.from(res.story_27);

        // grey scale
        grayscale = PIXI.Sprite.from(res.grey_scale.texture);
        grayscale.position.y = 0;
        grayscale.position.x = 0;
        grayscale.width = width;
        grayscale.height = height;
        grayscale.scale.set(scale);


         // UIPlayBtn scale
         let UIPlayBtn = PIXI.Sprite.from(res.UIPlayBtn.texture);
         UIPlayBtn.position.x = width * 0.5 - (UIPlayBtn.width * scale)/2;
         UIPlayBtn.position.y = height * 0.5- (UIPlayBtn.height * scale)/2;
         UIPlayBtn.scale.set(scale);



        tutorial.x = width/2
        tutorial.y = height/2
        tutorial.scale.set(scale);
        app.stage.addChild(tutorial);
        console.log(tutorial.skeleton.data)

        let take01 = tutorial.state.addAnimation(0, 'Ending', false);
        setTimeout(() => {
            tutorial.state.clearTracks();
            app.stage.addChild(grayscale);
            app.stage.addChild(UIPlayBtn);
            $('#mycanvas').on("pointerdown", function(e){
                var bound = canvas.getBoundingClientRect();
                let x, y;
                if(isportrait){
                    // 세로모드 ( 강제로 회전 )
                    y = canvas.height / touch_ratio - ((e.clientX - bound.left) * (canvas.height / bound.width)) / touch_ratio;
                    x = (e.clientY - bound.top) * (canvas.width / bound.height) / touch_ratio;
                } else {
                    x = (e.clientX - bound.left) * (canvas.width / bound.width) / touch_ratio;
                    y = (e.clientY - bound.top) * (canvas.height / bound.height) / touch_ratio;
                } 
                if(UIPlayBtn.x + UIPlayBtn.width > x && UIPlayBtn.x < x && UIPlayBtn.y + UIPlayBtn.height > y && UIPlayBtn.y < y){
                    app.stage.removeChild(grayscale);
                    app.stage.removeChild(UIPlayBtn);
                    game_start()
                }
            });
        }, 50);

        function game_start(){
            let take01 = tutorial.state.addAnimation(0, 'Ending', false);

            bgm.play({loop : true});

            let take01_time = take01.animationEnd;

            tutorial.state.addListener({
                event: function (track, event) {
                    console.log("Event on track " + track.trackIndex + ": ");
                    console.log(event.stringValue);
                    if(event.stringValue == "24"){
                        story_24.play();
                    } else if(event.stringValue == "25"){
                        story_25.play();
                    } else if(event.stringValue == "26"){
                        story_26.play();
                    } else if(event.stringValue == "27"){
                        story_27.play();
                    } 
                }
            });

        setTimeout(() => {

        }, take01_time*1000);
        }
    }

    window.addEventListener('resize', function(){
        console.log("RESIZE!");
        const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)
        console.log("isMobile!", isMobile);

        $("body").css("transform", "");
        $("#container").css({"margin-top" : "0px"});
        $("#loading").css("margin", "0px");

        const canvas = document.getElementById('mycanvas')
        const container = document.getElementById('container')
        var width = 0;
        var height = 0;
        var scale = width/1920; 
        if(isMobile){
            isportrait = false;
            touch_ratio = 2;
            console.log($("html").height());
            $('html').css('position', 'fixed');
            width  = $("html").width();
            height = width * 0.5625;
            scale = width/1920; 
            console.log($("html").height());

            if(height > $("html").height()){
                height = $("html").height();
                width = height / 0.5625;
                scale = width/1920; 
            }

            // 강제로 세로로 - 모바일
            if($('html').width() < $('html').height() && $('html').width() < 720){
                console.log("세로고정!")
                isportrait = true;
                $("body").css("transform", "rotate(90deg)");

                width  = $('html').height();
                height = width * 0.5625;
                scale = width/1920; 

                if(height > $('html').width()){
                    height = $('html').width();
                    width = height / 0.5625;
                    scale = width/1920; 
                }
                $("#loading").css("width", width);
                $("#loading").css("height", height);
            
                $("#loading").css("margin-top", ($("html").height() - width) / 2 + "px"  );
                $("#container").css("margin-top", ($("html").height() - width) / 2 + "px"  );

            }else{
                $("#loading").css("margin-left", ($("html").width() - width) / 2 + "px"  );

            }
        } else {
            isportrait = false;
            $('html').css('position', 'fixed');
            width  = window.innerWidth;
            height = width * 0.5625;
            scale = width/1920; 

            if(height > window.innerHeight){
                height = window.innerHeight;
                width = height / 0.5625;
                scale = width/1920; 
            }
            $("#loading").css("margin-left", ($("html").width() - width) / 2 + "px"  );
            $("#loading").css({"margin-top" : "0px"});
            $("#container").css({"margin-top" : "0px"});

            // $("#container").css("margin-top", 0 + "px");
        }

        $("#loading").css("width", width);
        $("#loading").css("height", height);


        // $("canvas").attr('width', width)
        // $("canvas").attr('height', height)
        $("canvas").css('width', width)
        $("canvas").css('height', height)
        // app.width = width;
        // app.height = height;
        app.scale = (scale);
    })

})