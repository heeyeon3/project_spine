var app;    // PIXI JS APPLICATION

let grayscale ;                         // GRAY SCALE


let click_count =0

let test = []
var touch_range = 0;
var ex_touch_range = -1;
let touch_ticker;

// 세로모드
var isportrait = false;
var touch_ratio = 1;


$(function () {
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

        }


        app = new PIXI.Application({
            view: canvas,
            width: width,
            height: height,
            resolution : 3,
            autoDensity : true,
            antialias : true
        });
        touch_ratio = 3;


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
        .add('touch_game',     '/ticto/spine/Touch/Spine/Game_0.json')
        .add('touch_gamebg',       '/ticto/spine/Touch/Spine/GameBg_0.json')
        .add('touch_uitoucohbar', '/ticto/spine/Touch/Spine/UITouchBar_2.json')
        .add('touch_tutorial', '/ticto/spine/Touch/Spine/TouchTutorial.json')
        .add('common_start', '/ticto/spine/WISC/common/Spine/Start.json')
        .add('common_heart', 'spine/WISC/common/Spine/UIHeart.json')

        .add('grey_scale', 'grey_scale.png')
        .add('UIBox_01', 'spine/WISC/common/UIBox_02.png')
        .add('UIPause', 'spine/WISC/common/UIPause.png')
        .add('UISound', 'spine/WISC/common/UISound.png')
        .add('UITouchBar_1', '/ticto/spine/Touch/Sprite/UITouchBar_1.png')

        .add('Touch_StartMusic', '/ticto/sound/bgm/1Touch_StartMusic.wav')
        .add('Touch_Hwiiig', '/ticto/sound/etc/Touch_Hwiiig.wav')
        .add('Touch_Quang', '/ticto/sound/etc/Touch_Quang.wav')
        .add('Game_Count01', '/ticto/sound/etc/Game_Count01.mp3')
        .add('Game_Count02', '/ticto/sound/etc/Game_Count02.mp3')
        .add('Game_pop', '/ticto/sound/interactive/Game_pop.wav');
        
    app.loader.load(onAssetsLoaded);


    app.stage.interactive = true;
    app.stage.buttonMode = true;

    function onAssetsLoaded(loader, res) {
        $("#loading").hide();
        $("#container").show();

        let bgm = PIXI.sound.Sound.from(res.Touch_StartMusic);
        bgm.play({loop : true});

        let Touch_Hwiiig = PIXI.sound.Sound.from(res.Touch_Hwiiig);
        let Touch_Quang = PIXI.sound.Sound.from(res.Touch_Quang);
        let Game_Count01 = PIXI.sound.Sound.from(res.Game_Count01);
        let Game_Count02 = PIXI.sound.Sound.from(res.Game_Count02);
        let Game_pop = PIXI.sound.Sound.from(res.Game_pop);
        
        // grey scale
        grayscale = PIXI.Sprite.from(res.grey_scale.texture);
        grayscale.position.y = 0;
        grayscale.position.x = 0;
        grayscale.width = width;
        grayscale.height = height;
        grayscale.scale.set(scale);
        

        // HEART, SOUND, TEXTBOX, PAUSE
        let common_heart1 = new PIXI.spine.Spine(res.common_heart.spineData);
        common_heart1.x = width * 0.05;
        common_heart1.y = height * 0.19;
        common_heart1.zIndex = 100;
        common_heart1.scale.set(scale * 0.6);
        
        let common_heart2 = new PIXI.spine.Spine(res.common_heart.spineData);
        common_heart2.x = width * 0.1;
        common_heart2.y = height * 0.19;
        common_heart2.zIndex = 100;
        common_heart2.scale.set(scale * 0.6);

        let UIBox_text = new PIXI.Text("땅 속에 있는 친구를 구해주세요!",{
            fill : 0x000000,
            fontSize : "40px",
            fontWeight : "Bold",
            fontFamily: "Noto Sans KR"
        })

        UIBox_text.x = width * 0.12;
        UIBox_text.y = height * 0.06;
        UIBox_text.zIndex = 111;
        UIBox_text.scale.set(scale);

        let UIBox_01 = PIXI.Sprite.from(res.UIBox_01.texture);
        UIBox_01.position.x = width * 0.1;
        UIBox_01.position.y = height * 0.03;
        UIBox_01.zIndex = 100;
        UIBox_01.scale.set(scale*0.5, scale*0.45);

        let UIPause = PIXI.Sprite.from(res.UIPause.texture);
        UIPause.position.x = width * 0.91;
        UIPause.position.y = height * 0.03;
        UIPause.zIndex = 100;
        UIPause.scale.set(scale);

        let UISound = PIXI.Sprite.from(res.UISound.texture);
        UISound.position.x = width * 0.02;
        UISound.position.y = height * 0.03;
        UISound.zIndex = 100;
        UISound.scale.set(scale);

        let tutorial = new PIXI.spine.Spine(res.touch_tutorial.spineData);

        tutorial.x = width*0.5;
        tutorial.y = height*0.5;
        tutorial.scale.set(scale);

        app.stage.addChild(tutorial)


        let Take_01 = tutorial.state.addAnimation(0, 'Take_01', false, 0);

        let Take_01_time = Take_01.animationEnd*0;

        console.log(tutorial.skeleton.data)

        tutorial.state.addListener({
            event: function (track, event) {
                console.log("Event on track " + track.trackIndex + ": ");
                console.log(event.stringValue);
                if(event.stringValue == "0"){
                    console.log("0");
                } else if(event.stringValue == "CrockJump"){
                    console.log("CrockJump");
                } else if(event.stringValue == "DMCGS-06"){
                    Touch_Hwiiig.play();
                    console.log("DMCGS-06");
                } else if(event.stringValue == "DM-CGS-10"){
                    Touch_Quang.play({
                        volume : 10,
                    });
                    console.log("DM-CGS-10");
                }
            }
        });

        setTimeout(() => {
            app.stage.removeChild(tutorial)


            let background = new PIXI.spine.Spine(res.touch_gamebg.spineData);

            background.x = width*0.5;
            background.y = height*0.5;
            background.scale.set(scale);


            background.state.addAnimation(0, 'Idle', true, 0);


            app.stage.addChild(background)
            app.stage.addChild(pullnopull)


            let tutorial_tap = new PIXI.spine.Spine(res.touch_tutorial.spineData);

            tutorial_tap.x = width*0.5;
            tutorial_tap.y = height*0.5;
            tutorial_tap.scale.set(scale);
            app.stage.addChild(grayscale);
            
            app.stage.addChild(tutorial_tap)

            let Tap = tutorial_tap.state.addAnimation(0, 'Tap', false, 0);
            let Tap_time = Tap.animationEnd * 0

            setTimeout(() => {

                app.stage.removeChild(tutorial_tap)

                

                touchticker()
                btn_click()
                


            }, Tap_time*1000);
            
        }, Take_01_time*1000);

        


        

        //fish
        let pullnopull = new PIXI.spine.Spine(res.touch_game.spineData);

        pullnopull.x = width*0.45;
        pullnopull.y = height*0.75;
        pullnopull.scale.set(scale*0.87);

        pullnopull.state.addAnimation(0, 'Idle', true, 0);


        let touchbar = new PIXI.spine.Spine(res.touch_uitoucohbar.spineData);

        touchbar.x = width*0.5;
        touchbar.y = height*0.9;
        touchbar.scale.set(scale);


        touchbar.state.addAnimation(0, 'Click', false, 0);


     
        let totalvalue = 0

        function touchgame(){
            
            $('#mycanvas').on("pointerdown", function(){
                touchbar.state.addAnimation(0, 'Click', false, 0);
                pullnopull.state.clearTracks();

                console.log(totalvalue);
                // (0 ~ 1.5)
                console.log("CLICKCLICKCLICK")
                
                Game_pop.play({
                    volume : 20
                });
                touch_ticker.stop();

                
                totalvalue += 1.5
                touchscale = totalvalue*0.1
                console.log(touchscale, totalvalue)
                if(totalvalue>=10){
                    console.log("emfdj")
                    click_touchbar.scale.set(scale, scale);
                    pullnopull.state.addListener({
                        complete : function (track, event) {
                            console.log("Event on track " + track.trackIndex + ": ");
                            console.log(track.animation.name);
                            

                            if(track.animation.name == "Pull_Success"){
                                console.log("susususus")
                                pullnopull.state.setAnimation(animationindex, 'Pull_Success_Idle', true);
                            } else if(track.animation.name == "Pull_Success_Idle"){
                                window.location.href = "/ticto/gonogo";
                            } else if(track.animation.name == "NoPull_04"){
                                pullnopull.state.clearTracks();
                                pullnopull.state.setAnimation(animationindex, 'Pull_Success', false, 0);
                            }
                        }
                    });


                }else{
                    
                    click_touchbar.scale.set(scale*touchscale, scale);
                    touchtickerStart()
                }
                
                
            })
        }

        let animationindex = 0
        function animationlist(){
            console.log(ex_touch_range, touch_range, animationindex)
            if(ex_touch_range < touch_range){
                // pullnopull.state.clearTracks();
                console.log("UPUPUPUPUP")
                if(totalvalue<=1.5 && 0 <= totalvalue){
                    pullnopull.state.addAnimation(animationindex, 'Pull_00', true);
                }else if(totalvalue<=3 && 1.5 < totalvalue){
                    pullnopull.state.addAnimation(animationindex, 'Pull_01', true);
                }else if(totalvalue<=4.5 && 3 < totalvalue){
                    pullnopull.state.addAnimation(animationindex, 'Pull_02', true)
                }else if(totalvalue<=6 && 4.5 < totalvalue){
                    pullnopull.state.addAnimation(animationindex, 'Pull_03', true);
                }else if(totalvalue<=7.5 && 6 < totalvalue){
                    pullnopull.state.addAnimation(animationindex, 'Pull_04', true);
                }

                
                ex_touch_range = touch_range;
            } else if (ex_touch_range > touch_range){
                // pullnopull.state.clearTracks();
                animationindex++;
                console.log("DOWNDOWNDOWN")
                if(totalvalue<=1.5 && 0 < totalvalue){
                    pullnopull.state.addAnimation(animationindex, 'NoPull_00', true);
                }else if(totalvalue<=3 && 1.5 < totalvalue){
                    pullnopull.state.addAnimation(animationindex, 'NoPull_01', true);
                }else if(totalvalue<=4.5 && 3 < totalvalue){
                    pullnopull.state.addAnimation(animationindex, 'NoPull_02', true);
                }else if(totalvalue<=6 && 4.5 < totalvalue){
                    pullnopull.state.addAnimation(animationindex, 'NoPull_03', true);
                }else if(totalvalue<=7.5 && 6 < totalvalue){
                    pullnopull.state.addAnimation(animationindex, 'NoPull_04', true);
                }
                ex_touch_range = touch_range;
            }

            return;
        }

       


        let click_touchbar = PIXI.Sprite.from('/ticto/spine/Touch/Sprite/UITouchBar_1.png');

        click_touchbar.x = width*0.239;
        click_touchbar.y = height*0.8711;
     
        click_touchbar.scale.set(scale*0, scale); 
       


        
   

        function touchticker(){
            
            touch_ticker = new PIXI.Ticker
            touch_ticker.autoStart = false;

            app.animationUpdate = function () {
       
                
                position =+ 0.01;
            
                totalvalue -= position

                touchscale = totalvalue*0.1
                click_touchbar.scale.set(scale*touchscale, scale);

                if(totalvalue<=0){
                    touch_ticker.stop();
                }else if(totalvalue>=10){
                    touch_ticker.stop();
                }


                

                if(totalvalue<1.5 && 0 < totalvalue){
                    touch_range = 0;
                }else if(totalvalue<3 && 1.5 < totalvalue){
                    touch_range = 1;
                }else if(totalvalue<4.5 && 3 < totalvalue){
                    touch_range = 3;
                }else if(totalvalue<6 && 4.5 < totalvalue){
                    touch_range = 4;
                }else if(totalvalue<7.5 && 6 < totalvalue){
                    touch_range = 5;
                }
                if(ex_touch_range > touch_range){
                    animationlist();
                }
                ex_touch_range = touch_range;
            }

            touch_ticker.add(app.animationUpdate);
        }
        
       

        function touchtickerStart(){

            position = 0
            touch_ticker.start();
            // touchgame()

        }


        function btn_click(){

            console.log("들어옴")
            
            app.stage.addChild(common_heart1);
            app.stage.addChild(common_heart2);

            app.stage.addChild(UIBox_01)
            app.stage.addChild(UIBox_text)
            app.stage.addChild(UIPause)
            app.stage.addChild(UISound)

            common_heart1.state.addAnimation(0, 'Full', true);
            common_heart2.state.addAnimation(0, 'Full', true);

            let start = new PIXI.spine.Spine(res.common_start.spineData);

            start.x = width/2
            start.y = height/2 
            start.scale.set(scale);
            app.stage.addChild(start);

            let blue_btn = start.state.addAnimation(0, 'Ready2', true, 0);

            $('#mycanvas').one("pointerdown", function(){
                app.stage.removeChild(start)

                let start_count = new PIXI.spine.Spine(res.common_start.spineData);

                start_count.x = width/2
                start_count.y = height/2 
                start_count.scale.set(scale);
                app.stage.addChild(start_count);

                Game_Count01.play();
                let count =start_count.state.addAnimation(1, 'Count_01', false, 0);
                start_count.state.addAnimation(1, 'Count_02', false, 0);
                start_count.state.addAnimation(1, 'Count_03', false, 0);
                start_count.state.addAnimation(1, 'Count_04', false, 0);

                var start_sound_cnt = 0;
                start_count.state.addListener({
                    start: function (track, event) {
                        console.log(start_sound_cnt)
                        if(start_sound_cnt ==2){
                            Game_Count02.play();
                        }else {
                            Game_Count01.play();
                        }
                        start_sound_cnt++;
                    }
                });


                count_time = count.animationEnd
                setTimeout(() => {
                    touchgame()
                    app.stage.addChild(touchbar)
                    app.stage.addChild(click_touchbar)
                    app.stage.removeChild(grayscale);
                }, count_time*4*1000);

                
            })
        }


        app.start();
    }


})




