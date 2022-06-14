// 세로모드
var isportrait = false;
var touch_ratio = 1;
var canvas ;
var width = 0;
var height = 0;
var scale = width/1920; 

$(function(){
    const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)

    canvas = document.getElementById('mycanvas')
    const container = document.getElementById('container')
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
        $("#loading").css("margin-left", ($("html").width() - width) / 2 + "px" );
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
        .add('gamestart', '/ticto/spine/gamestart/Spine/Notice.json')

        .add('LoginBg', '/ticto/spine/gamestart/UI/LoginBg.png')
        .add('BrandingLogo', '/ticto/spine/gamestart/UI/BrandingLogo.png')
        .add('UIYellowBtn', '/ticto/spine/gamestart/UI/UIYellowBtn.png')
        .add('UINoticeBox', '/ticto/spine/gamestart/UI/UINoticeBox.png')
        .add('UIDot_01', '/ticto/spine/gamestart/UI/UIDot_01.png')
        .add('UIDot_02', '/ticto/spine/gamestart/UI/UIDot_02.png')
        .add('UIArrow_02', '/ticto/spine/gamestart/UI/UIArrow_02.png')
        .add('UIArrow_01', '/ticto/spine/gamestart/UI/UIArrow_01.png')

        .add('PictureMemory_Music1', '/ticto/sound/bgm/4PictureMemory_Music1.wav')

        .load(onAssetsLoaded);

    app.stage.interactive = true;
    app.stage.buttonMode = true;

    function onAssetsLoaded(loader, res){

        $("#loading").hide();
        $("#container").show();

        let common_notice = new PIXI.spine.Spine(res.gamestart.spineData);

        console.log(common_notice.skeleton.data)
        
        let bgm1 = PIXI.sound.Sound.from(res.PictureMemory_Music1);
        bgm1.play({loop : true});

        let background = PIXI.Sprite.from(res.LoginBg.texture);
        background.y = 0;
        background.x = 0;
        background.scale.set(scale*0.73,scale);
        app.stage.addChild(background);

        let brandlogo = PIXI.Sprite.from(res.BrandingLogo.texture);
        brandlogo.y = height*0.15;
        brandlogo.x = width*0.21;
        brandlogo.width = brandlogo.width * scale*0.8
        brandlogo.height = brandlogo.height * scale*0.75
        // brandlogo.scale.set(scale*0.8,scale*0.75);
        app.stage.addChild(brandlogo);

        let UIYellowBtn = PIXI.Sprite.from(res.UIYellowBtn.texture);
        UIYellowBtn.y = height*0.7;
        UIYellowBtn.x = width*0.43;
        UIYellowBtn.scale.set(scale,scale);
        app.stage.addChild(UIYellowBtn);

        let start_btn = new PIXI.Text("시작하기",{
            fill : 0xFFFFFF,
            fontSize : "45px",
            fontFamily: "Noto Sans Bold"
            // fontFamily: "Noto Sans KR"
        })

        start_btn.x = width * 0.5 - (start_btn.width / 2 * scale);
        start_btn.y = height * 0.733;
        start_btn.scale.set(scale);
        app.stage.addChild(start_btn);


        let copyright = new PIXI.Text("STAR RUCKUS © 2021. eMotiv. All Rights Reserved.",{
            fill : 0xFFFFFF,
            fontSize : "30px",
            fontFamily: "Noto Sans Bold"
        })
        copyright.x = width * 0.5 - (copyright.width / 2 * scale);
        copyright.y = height * 0.92;
        copyright.scale.set(scale);
        app.stage.addChild(copyright);


        let gamestart = new PIXI.spine.Spine(res.gamestart.spineData);

        gamestart.x = width/2;
        gamestart.y = height/2;
        gamestart.scale.set(scale);

        // set up the mixes!
        gamestart.stateData.setMix('Child', 'Graph', 0.3);
        gamestart.stateData.setMix('Graph', 'Child', 0.3);
        
        gamestart.stateData.setMix('Mobile', '10Minute', 0.3);
        gamestart.stateData.setMix('10Minute', 'Mobile', 0.3);
        
        gamestart.stateData.setMix('10Minute', 'Sound', 0.3);
        gamestart.stateData.setMix('Sound', '10Minute', 0.3);

        gamestart.stateData.setMix('Sound', 'Child', 0.3);
        gamestart.stateData.setMix('Child', 'Sound', 0.3);


        start_btn_click();

        function start_btn_click(){
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
                if(x>width*0.43 && x<width*0.57 && y>height*0.7 && y<height*0.82){
                    $('#mycanvas').unbind("pointerdown")

                    let UINoticeBox = PIXI.Sprite.from(res.UINoticeBox.texture);
                    UINoticeBox.y = height*0.1;
                    UINoticeBox.x = width*0.11;
                    UINoticeBox.scale.set(scale,scale);
                    app.stage.addChild(UINoticeBox);

                    uidot_first()
                    app.stage.addChild(gamestart);
                    // pause_btn();

                }
            })
        }


        function uidot_first(){

            let UIDot_01 = PIXI.Sprite.from(res.UIDot_01.texture);
            UIDot_01.y = height*0.2;
            UIDot_01.x = width*0.39;
            UIDot_01.scale.set(scale*1.1);
            app.stage.addChild(UIDot_01);

            let UIDot_02 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_02.y = height*0.2;
            UIDot_02.x = width*0.44;
            UIDot_02.scale.set(scale*1.1);
            app.stage.addChild(UIDot_02);
          
            let UIDot_03 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_03.y = height*0.2;
            UIDot_03.x = width*0.49;
            UIDot_03.scale.set(scale*1.1);
            app.stage.addChild(UIDot_03);

            let UIDot_04 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_04.y = height*0.2;
            UIDot_04.x = width*0.54;
            UIDot_04.scale.set(scale*1.1);
            app.stage.addChild(UIDot_04);

            let UIDot_05 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_05.y = height*0.2;
            UIDot_05.x = width*0.59;
            UIDot_05.scale.set(scale*1.1);
            app.stage.addChild(UIDot_05);

            let leftarrow = PIXI.Sprite.from(res.UIArrow_02.texture);
            leftarrow.y = height*0.43;
            leftarrow.x = width*0.15;
            leftarrow.scale.set(scale*1.1);
            app.stage.addChild(leftarrow);

            let rightarrow = PIXI.Sprite.from(res.UIArrow_01.texture);
            rightarrow.y = height*0.55;
            rightarrow.x = width*0.85;
            rightarrow.rotation = 9.41;
            rightarrow.scale.set(scale*1.1);
            app.stage.addChild(rightarrow);


            // let gamestart_Sound = new PIXI.spine.Spine(res.gamestart.spineData);

            gamestart.x = width*0.5
            gamestart.y = height*0.53
            gamestart.scale.set(scale);
            // app.stage.addChild(gamestart_Sound);

            

            gamestart.state.setAnimation(0, "Mobile", true);

            let uinoticebox_text = new PIXI.Text("모바일 진행을 권장드립니다.",{
                fill : 0xFFFFFF,
                fontSize : "40px",
                fontFamily: "Noto Sans Bold"
            })
            uinoticebox_text.x = width * 0.5 - (uinoticebox_text.width / 2 * scale)
            uinoticebox_text.y = height * 0.7
            uinoticebox_text.scale.set(scale);
            app.stage.addChild(uinoticebox_text)

            let uinoticebox_text1 = new PIXI.Text("컴퓨터로 평가한 결과는 정확도가 떨어질 수 있습니다.",{
                fill : 0xFFFFFF,
                fontSize : "40px",
                fontFamily: "Noto Sans Bold"
            })
            uinoticebox_text1.x = width * 0.5 - (uinoticebox_text1.width / 2 * scale)
            uinoticebox_text1.y = height * 0.75
            uinoticebox_text1.scale.set(scale);
            app.stage.addChild(uinoticebox_text1)


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

                
                if(x<width*0.86 && x>width*0.785 && y>height*0.4 && y<height*0.62){
                    $('#mycanvas').unbind("pointerdown")
                    app.stage.removeChild(uinoticebox_text)
                    app.stage.removeChild(uinoticebox_text1)

                    // app.stage.removeChild(gamestart_Sound);
                    app.stage.removeChild(rightarrow);
                    app.stage.removeChild(leftarrow);
                    
                    app.stage.removeChild(UIDot_01);
                    app.stage.removeChild(UIDot_02);
                    app.stage.removeChild(UIDot_03);
                    app.stage.removeChild(UIDot_04);
                    app.stage.removeChild(UIDot_05);


                    
                    uidot_second()
                }
            })

            
        }

        function uidot_second(){
            let UIDot_01 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_01.y = height*0.2;
            UIDot_01.x = width*0.39;
            UIDot_01.scale.set(scale*1.1);
            app.stage.addChild(UIDot_01);

            let UIDot_02 = PIXI.Sprite.from(res.UIDot_01.texture);
            UIDot_02.y = height*0.2;
            UIDot_02.x = width*0.44;
            UIDot_02.scale.set(scale*1.1);
            app.stage.addChild(UIDot_02);
          
            let UIDot_03 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_03.y = height*0.2;
            UIDot_03.x = width*0.49;
            UIDot_03.scale.set(scale*1.1);
            app.stage.addChild(UIDot_03);

            let UIDot_04 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_04.y = height*0.2;
            UIDot_04.x = width*0.54;
            UIDot_04.scale.set(scale*1.1);
            app.stage.addChild(UIDot_04);

            let UIDot_05 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_05.y = height*0.2;
            UIDot_05.x = width*0.59;
            UIDot_05.scale.set(scale*1.1);
            app.stage.addChild(UIDot_05);

            let leftarrow = PIXI.Sprite.from(res.UIArrow_01.texture);
            leftarrow.y = height*0.43;
            leftarrow.x = width*0.15;
            leftarrow.scale.set(scale*1.1);
            app.stage.addChild(leftarrow);

            let rightarrow = PIXI.Sprite.from(res.UIArrow_01.texture);
            rightarrow.y = height*0.55;
            rightarrow.x = width*0.85;
            rightarrow.rotation = 9.41;
            rightarrow.scale.set(scale*1.1);
            app.stage.addChild(rightarrow);


            // let gamestart_Sound = new PIXI.spine.Spine(res.gamestart.spineData);

            // gamestart_Sound.x = width*0.5
            // gamestart_Sound.y = height*0.55
            // gamestart_Sound.scale.set(scale);
            // app.stage.addChild(gamestart_Sound);

            gamestart.state.setAnimation(0, "10Minute", true);

            let uinoticebox_text = new PIXI.Text("평가는 약 10분간 진행됩니다.",{
                fill : 0xFFFFFF,
                fontSize : "40px",
                fontFamily: "Noto Sans Bold"
            })
            uinoticebox_text.x = width * 0.5 - (uinoticebox_text.width / 2 * scale)
            uinoticebox_text.y = height * 0.7
            uinoticebox_text.scale.set(scale);
            app.stage.addChild(uinoticebox_text)

            let uinoticebox_text1 = new PIXI.Text("평가가 시작되면 중단하기 어려우니 집중할 수 있는 시간에 진행해 주세요.",{
                fill : 0xFFFFFF,
                fontSize : "40px",
                fontFamily: "Noto Sans Bold"
            })
            uinoticebox_text1.x = width * 0.5 - (uinoticebox_text1.width / 2 * scale)
            uinoticebox_text1.y = height * 0.75
            uinoticebox_text1.scale.set(scale);
            app.stage.addChild(uinoticebox_text1)

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

                
                if(x<width*0.215 && x>width*0.135 && y>height*0.4 && y<height*0.59){
                    $('#mycanvas').unbind("pointerdown")
                    app.stage.removeChild(uinoticebox_text)
                    app.stage.removeChild(uinoticebox_text1)

                    // app.stage.removeChild(gamestart_Sound);
                    app.stage.removeChild(rightarrow);
                    app.stage.removeChild(leftarrow);

                    app.stage.removeChild(UIDot_02);
                    app.stage.removeChild(UIDot_01);
                    app.stage.removeChild(UIDot_03);
                    
                    uidot_first()
                }

                if(x<width*0.86 && x>width*0.785 && y>height*0.4 && y<height*0.62){
                    $('#mycanvas').unbind("pointerdown")
                    app.stage.removeChild(uinoticebox_text)
                    app.stage.removeChild(uinoticebox_text1)

                    // app.stage.removeChild(gamestart_Sound);
                    app.stage.removeChild(rightarrow);
                    app.stage.removeChild(leftarrow);

                    app.stage.removeChild(UIDot_02);
                    app.stage.removeChild(UIDot_01);
                    app.stage.removeChild(UIDot_03);
                    app.stage.removeChild(UIDot_04);
                    app.stage.removeChild(UIDot_05);
                    
                    uidot_third()
                }
            })
        }

        function uidot_third(){
            let UIDot_01 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_01.y = height*0.2;
            UIDot_01.x = width*0.39;
            UIDot_01.scale.set(scale*1.1);
            app.stage.addChild(UIDot_01);

            let UIDot_02 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_02.y = height*0.2;
            UIDot_02.x = width*0.44;
            UIDot_02.scale.set(scale*1.1);
            app.stage.addChild(UIDot_02);
          
            let UIDot_03 = PIXI.Sprite.from(res.UIDot_01.texture);
            UIDot_03.y = height*0.2;
            UIDot_03.x = width*0.49;
            UIDot_03.scale.set(scale*1.1);
            app.stage.addChild(UIDot_03);

            let UIDot_04 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_04.y = height*0.2;
            UIDot_04.x = width*0.54;
            UIDot_04.scale.set(scale*1.1);
            app.stage.addChild(UIDot_04);

            let UIDot_05 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_05.y = height*0.2;
            UIDot_05.x = width*0.59;
            UIDot_05.scale.set(scale*1.1);
            app.stage.addChild(UIDot_05);


            gamestart.state.setAnimation(0, "Sound", true);

            let leftarrow = PIXI.Sprite.from(res.UIArrow_01.texture);
            leftarrow.y = height*0.43;
            leftarrow.x = width*0.15;
            leftarrow.scale.set(scale*1.1);
            app.stage.addChild(leftarrow);

            let rightarrow = PIXI.Sprite.from(res.UIArrow_01.texture);
            rightarrow.y = height*0.55;
            rightarrow.x = width*0.85;
            rightarrow.rotation = 9.41;
            rightarrow.scale.set(scale*1.1);
            app.stage.addChild(rightarrow);

            // let UIYellowBtn01 = PIXI.Sprite.from(res.UIYellowBtn.texture);
            // UIYellowBtn01.y = height*0.7;
            // UIYellowBtn01.x = width*0.43;
            // UIYellowBtn01.scale.set(scale,scale);
            // app.stage.addChild(UIYellowBtn01);

            let uinoticebox_text = new PIXI.Text("배경음악이 나오고 있나요?",{
                fill : 0xFFFFFF,
                fontSize : "40px",
                fontFamily: "Noto Sans Bold"
            })
            uinoticebox_text.x = width * 0.5 - (uinoticebox_text.width / 2 * scale)
            uinoticebox_text.y = height * 0.7
            uinoticebox_text.scale.set(scale);
            app.stage.addChild(uinoticebox_text)

            let uinoticebox_text1 = new PIXI.Text("볼륨을 켜고 적절히 조정해주세요.",{
                fill : 0xFFFFFF,
                fontSize : "40px",
                fontFamily: "Noto Sans Bold"
            })
            uinoticebox_text1.x = width * 0.5 - (uinoticebox_text1.width / 2 * scale)
            uinoticebox_text1.y = height * 0.75
            uinoticebox_text1.scale.set(scale);
            app.stage.addChild(uinoticebox_text1)

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

                if(x<width*0.215 && x>width*0.135 && y>height*0.4 && y<height*0.59){
                    $('#mycanvas').unbind("pointerdown")
                    app.stage.removeChild(uinoticebox_text)
                    app.stage.removeChild(uinoticebox_text1)
                    // app.stage.removeChild(gamestart_Sound);
                    app.stage.removeChild(rightarrow);
                    app.stage.removeChild(leftarrow);

                    app.stage.removeChild(UIDot_02);
                    app.stage.removeChild(UIDot_01);
                    app.stage.removeChild(UIDot_03);
                    app.stage.removeChild(UIDot_05);
                    app.stage.removeChild(UIDot_04);
                    
                    uidot_second()
                }

                if(x<width*0.86 && x>width*0.785 && y>height*0.4 && y<height*0.62){
                    $('#mycanvas').unbind("pointerdown")
                    app.stage.removeChild(uinoticebox_text)
                    app.stage.removeChild(uinoticebox_text1)
                    // app.stage.removeChild(gamestart_Sound);
                    app.stage.removeChild(rightarrow);
                    app.stage.removeChild(leftarrow);

                    app.stage.removeChild(UIDot_02);
                    app.stage.removeChild(UIDot_01);
                    app.stage.removeChild(UIDot_03);
                    app.stage.removeChild(UIDot_05);
                    app.stage.removeChild(UIDot_04);
                    
                    uidot_four()
                }
            })
        }

        function uidot_four(){
            let UIDot_01 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_01.y = height*0.2;
            UIDot_01.x = width*0.39;
            UIDot_01.scale.set(scale*1.1);
            app.stage.addChild(UIDot_01);

            let UIDot_02 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_02.y = height*0.2;
            UIDot_02.x = width*0.44;
            UIDot_02.scale.set(scale*1.1);
            app.stage.addChild(UIDot_02);
          
            let UIDot_03 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_03.y = height*0.2;
            UIDot_03.x = width*0.49;
            UIDot_03.scale.set(scale*1.1);
            app.stage.addChild(UIDot_03);

            let UIDot_04 = PIXI.Sprite.from(res.UIDot_01.texture);
            UIDot_04.y = height*0.2;
            UIDot_04.x = width*0.54;
            UIDot_04.scale.set(scale*1.1);
            app.stage.addChild(UIDot_04);

            let UIDot_05 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_05.y = height*0.2;
            UIDot_05.x = width*0.59;
            UIDot_05.scale.set(scale*1.1);
            app.stage.addChild(UIDot_05);


            gamestart.x = width*0.51
            gamestart.y = height*0.53
            gamestart.scale.set(scale);
            gamestart.state.setAnimation(0, "Child", true);

            let leftarrow = PIXI.Sprite.from(res.UIArrow_01.texture);
            leftarrow.y = height*0.43;
            leftarrow.x = width*0.15;
            leftarrow.scale.set(scale*1.1);
            app.stage.addChild(leftarrow);

            let rightarrow = PIXI.Sprite.from(res.UIArrow_01.texture);
            rightarrow.y = height*0.55;
            rightarrow.x = width*0.85;
            rightarrow.rotation = 9.41;
            rightarrow.scale.set(scale*1.1);
            app.stage.addChild(rightarrow);

            // let UIYellowBtn01 = PIXI.Sprite.from(res.UIYellowBtn.texture);
            // UIYellowBtn01.y = height*0.7;
            // UIYellowBtn01.x = width*0.43;
            // UIYellowBtn01.scale.set(scale,scale);
            // app.stage.addChild(UIYellowBtn01);

            let uinoticebox_text = new PIXI.Text("아이가 문제를 풀게 해주세요.",{
                fill : 0xFFFFFF,
                fontSize : "40px",
                fontFamily: "Noto Sans Bold"
            })
            uinoticebox_text.x = width * 0.5 - (uinoticebox_text.width / 2 * scale)
            uinoticebox_text.y = height * 0.7
            uinoticebox_text.scale.set(scale);
            app.stage.addChild(uinoticebox_text)

            let uinoticebox_text1 = new PIXI.Text("답을 알려주시면 정확한 결과를 얻을 수 없어요.",{
                fill : 0xFFFFFF,
                fontSize : "40px",
                fontFamily: "Noto Sans Bold"
            })
            uinoticebox_text1.x = width * 0.5 - (uinoticebox_text1.width / 2 * scale)
            uinoticebox_text1.y = height * 0.75
            uinoticebox_text1.scale.set(scale);
            app.stage.addChild(uinoticebox_text1)

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

                if(x<width*0.215 && x>width*0.135 && y>height*0.4 && y<height*0.59){
                    $('#mycanvas').unbind("pointerdown")
                    app.stage.removeChild(uinoticebox_text)
                    app.stage.removeChild(uinoticebox_text1)
                    // app.stage.removeChild(gamestart_Sound);
                    app.stage.removeChild(rightarrow);
                    app.stage.removeChild(leftarrow);

                    app.stage.removeChild(UIDot_02);
                    app.stage.removeChild(UIDot_01);
                    app.stage.removeChild(UIDot_03);
                    app.stage.removeChild(UIDot_04);
                    app.stage.removeChild(UIDot_05);
                    
                    uidot_third()
                }

                if(x<width*0.86 && x>width*0.785 && y>height*0.4 && y<height*0.62){
                    $('#mycanvas').unbind("pointerdown")
                    app.stage.removeChild(uinoticebox_text)
                    app.stage.removeChild(uinoticebox_text1)
                    // app.stage.removeChild(gamestart_Sound);
                    app.stage.removeChild(rightarrow);
                    app.stage.removeChild(leftarrow);

                    app.stage.removeChild(UIDot_02);
                    app.stage.removeChild(UIDot_01);
                    app.stage.removeChild(UIDot_03);
                    app.stage.removeChild(UIDot_04);
                    app.stage.removeChild(UIDot_05);
                    
                    uidot_five()
                }
            })
        }

        function uidot_five(){
            let UIDot_01 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_01.y = height*0.2;
            UIDot_01.x = width*0.39;
            UIDot_01.scale.set(scale*1.1);
            app.stage.addChild(UIDot_01);

            let UIDot_02 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_02.y = height*0.2;
            UIDot_02.x = width*0.44;
            UIDot_02.scale.set(scale*1.1);
            app.stage.addChild(UIDot_02);
          
            let UIDot_03 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_03.y = height*0.2;
            UIDot_03.x = width*0.49;
            UIDot_03.scale.set(scale*1.1);
            app.stage.addChild(UIDot_03);

            let UIDot_04 = PIXI.Sprite.from(res.UIDot_02.texture);
            UIDot_04.y = height*0.2;
            UIDot_04.x = width*0.54;
            UIDot_04.scale.set(scale*1.1);
            app.stage.addChild(UIDot_04);

            let UIDot_05 = PIXI.Sprite.from(res.UIDot_01.texture);
            UIDot_05.y = height*0.2;
            UIDot_05.x = width*0.59;
            UIDot_05.scale.set(scale*1.1);
            app.stage.addChild(UIDot_05);

            gamestart.state.setAnimation(0, "Graph", true);

            let leftarrow = PIXI.Sprite.from(res.UIArrow_01.texture);
            leftarrow.y = height*0.43;
            leftarrow.x = width*0.15;
            leftarrow.scale.set(scale*1.1);
            app.stage.addChild(leftarrow);

            let rightarrow = PIXI.Sprite.from(res.UIArrow_02.texture);
            rightarrow.y = height*0.55;
            rightarrow.x = width*0.85;
            rightarrow.rotation = 9.41;
            rightarrow.scale.set(scale*1.1);
            app.stage.addChild(rightarrow);

            let UIYellowBtn01 = PIXI.Sprite.from(res.UIYellowBtn.texture);
            UIYellowBtn01.y = height*0.7;
            UIYellowBtn01.x = width*0.43;
            UIYellowBtn01.scale.set(scale,scale);
            app.stage.addChild(UIYellowBtn01);

            let uinoticebox_text01 = new PIXI.Text("게임시작",{
                fill : 0xFFFFFF,
                fontSize : "40px",
                fontFamily: "Noto Sans Bord"
            })
            uinoticebox_text01.x = width * 0.5 - (uinoticebox_text01.width / 2 * scale)
            uinoticebox_text01.y = height * 0.735
            uinoticebox_text01.scale.set(scale);
            app.stage.addChild(uinoticebox_text01)

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

                if(x<width*0.215 && x>width*0.135 && y>height*0.4 && y<height*0.59){
                    $('#mycanvas').unbind("pointerdown")
                    app.stage.removeChild(uinoticebox_text01)
                    // app.stage.removeChild(gamestart_Sound);
                    app.stage.removeChild(rightarrow);
                    app.stage.removeChild(leftarrow);
                    app.stage.removeChild(UIYellowBtn01);

                    app.stage.removeChild(UIDot_02);
                    app.stage.removeChild(UIDot_01);
                    app.stage.removeChild(UIDot_03);
                    app.stage.removeChild(UIDot_04);
                    app.stage.removeChild(UIDot_05);
                    
                    uidot_four()
                }else if(x>width*0.43 && x<width*0.57 && y>height*0.7 && y<height*0.82){
                    window.location.href = "/ticto/touch";
                }
            })
        }

    }


    window.addEventListener('resize', function(){
        const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)

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
            $('html').css('position', 'fixed');
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



function pause_btn(){
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
        if(x<width*0.43 && x>width*0.57 && y<height*0.7 && y>height*0.82){

        }
    })
}