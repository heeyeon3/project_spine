var app;    // PIXI JS APPLICATION

let grayscale ;                         // GRAY SCALE

// 문제유형 마다 설명 처음은 컬러임으로 트루
let tutorial_color = true;
let tutorial_shape = false;

// 색깔, 모양 둘 다 끝 (튜토리얼 끝)
let tutorial_count = 0;

// 색깔 끝 or 모양 끝
let tutorialSC = 0;
let Istutorial = false;
// 0번 모양 1번 색
let quest_type =1;

// 0 초록 세모 1 파란 별
let quest_shape_type = 0

//문제 랜덤
// let quest_random = 0 

let tutorial_fail = false

//문제 인덱스
let quest_idx = 0
var isfirsttime = true;
//실패 카운트 연속 2번일 경우 확인하기 위함
let fail_count = 0

// 세로모드
var isportrait = false;
var touch_ratio = 1;

// TIME BAR
var time = 5;
let timer ;                             // 아래 TIME BAR 초록이미지
let timer_bg;                           // 아래 TIME BAR 배경이미지
let timer_text;                         // 아래 TIME TEXT ( 00:00 )
var code_timer;                         // TIME BAR setinterval

// TICKER 모음 ( IMAGE ANIMATION )
var timer_start;                        // 타이머 시간 TICKER
var timer_start_hide = false;           // 타이머 시간 true : (START) or false : (00:00)

var timer_show;                         // TIMER 등장, 사라짐 TICKER    
var timer_show_hide = false;            // 등장, 사라짐 true : (hide) or false : (show)

let practice_ani_index = 0;             // 연습게임 에니메이션 인덱스

// 데이터모음
// phoneNum : 01000000000               
// name : TEST
// taskId : 3                      
// dccsNumOfPerformedRound : 15
// dccsNumOfSuccessRound : 5
// dccsNumOfCrrctRuleSwitch : 0
// dccsMaxCnsctvSuccessCount : 0
// dccsPerformanceTime :  60.675
// dccsResponseTimeList : [{"isCorrect": true, "responseTime": 1.0350000858306885},  {"isCorrect": true, "responseTime": 0.4010000228881836},  {"isCorrect": true, "responseTime": 0.5350000262260437}, {"isCorrect": true, "responseTime": 0.43400001525878906}]

var start_time,end_time;
var dccsPerformanceTime;

var round_start_time, round_end_time;
var round_total_time;

var isswitch = false;

var dccsNumOfPerformedRound = 0; 
var dccsNumOfSuccessRound = 0; 
var dccsMaxCnsctvSuccessCount = 0; 
var EX_dccsMaxCnsctvSuccessCount = 0
var dccsNumOfCrrctRuleSwitch = 0; 
var dccsResponseTimeList = [];

let firsttime = false;

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
        .add('dccs_tutorial',   'spine/DCCS/Spine/dccsTutorial.json')
        .add('dccs_bg',         'spine/DCCS/Spine/DCCSBg.json')
        .add('dccs_eagle',      'spine/DCCS/Spine/DCCSEagle.json')
        .add('dccs_remote',     'spine/DCCS/Spine/Remote.json')
        .add('dccs_wineffect',  'spine/DCCS/Spine/DCCSWinEffect.json')
        .add('common_start',    'spine/WISC/common/Spine/Start.json')
        .add('common_OXE',      'spine/WISC/common/Spine/OXEffect.json')
        .add('common_handclick','spine/WISC/common/Spine/HandClickEffect.json')
        .add('gonogo_rucro',    'spine/WISC/common/Spine/RuCroEffect.json')
        .add('common_heart',    'spine/WISC/common/Spine/UIHeart.json')
        .add('practicemode',    'spine/PracticeMode/UIPracticeSpine/UIPractice.json')

        .add('grey_scale',      'grey_scale.png')
        .add('UIPlayBtn',       'UIPlayBtn.png')
        .add('UIBox_01',        'spine/WISC/common/UIBox_02.png')
        // .add('UIPause',         'spine/WISC/common/UIPause.png')
        .add('UISound',         'spine/WISC/common/UISound.png')
        .add('Color',           'spine/DCCS/Sprite/Color.png')
        .add('Form',            'spine/DCCS/Sprite/Form.png')
        .add('DCCSStar',        'spine/DCCS/Sprite/DCCSStar.png')
        .add('DCCSTriangle',    'spine/DCCS/Sprite/DCCSTriangle.png')
        .add('DCCSTime_01',     'spine/DCCS/Sprite/DCCSTime_01.png')
        .add('DCCSTime_02',     'spine/DCCS/Sprite/DCCSTime_02.png')
        .add('UIPracticeMode',  'spine/PracticeMode/UIPracticeMode.png')

        .add('DCCS_Music1',     '/ticto/sound/bgm/6DCCS_Music1.wav')
        .add('DCCS_Music2',     '/ticto/sound/bgm/7DCCS_Music2.wav')
        .add('DCCS_Horn',       '/ticto/sound/etc/DCCS_Horn.wav')
        .add('Game_Count01',    '/ticto/sound/etc/Game_Count01.mp3')
        .add('Game_Count02',    '/ticto/sound/etc/Game_Count02.mp3')
        .add('Game_Right',      '/ticto/sound/interactive/Game_Right.wav')
        .add('Game_Wrong',      '/ticto/sound/interactive/Game_Wrong.wav')
        .add('Game_pop',        '/ticto/sound/interactive/Game_pop.wav')

        .add('story_19',            '/ticto/sound/Story/19_NowLetsGo.mp3')
        .add('story_20',            '/ticto/sound/Story/20_WowSpaceship.mp3')
        .add('story_21',            '/ticto/sound/Story/21_ManyTraffic.mp3')
        .add('story_22',            '/ticto/sound/Story/22_LookPolice.mp3')
        .add('story_23',            '/ticto/sound/Story/23_WeHelpHim.mp3')

        .add('game_01',            '/ticto/sound/DCCS/0DCCS_HelpPolice.mp3')
        .add('game_02',            '/ticto/sound/DCCS/1DCCS_PoliceSayColor.mp3')
        .add('game_03',            '/ticto/sound/DCCS/2DCCS_Color.mp3')
        .add('game_04',            '/ticto/sound/DCCS/3DCCS_PoliceSayShape.mp3')
        .add('game_05',            '/ticto/sound/DCCS/4DCCS_Shape.mp3')
        .add('game_06',            '/ticto/sound/DCCS/5DCCS_HearPolice.mp3')
        
        .add('bluebtn_sound',      '/ticto/sound/System/2System_PickBlueButton.mp3')
        .add('redbtn_sound',       '/ticto/sound/System/3System_PickRedButton.mp3')
        .add('Great_01',           '/ticto/sound/System/4System_YouBest.mp3')
        .add('Great_02',           '/ticto/sound/System/5System_YouGood.mp3')
        .add('Great_03',           '/ticto/sound/System/6System_YouBest.mp3')
        .add('Good_01',            '/ticto/sound/System/7System_Good.mp3')
        .add('Good_02',            '/ticto/sound/System/8System_Cool.mp3')
        .add('Good_03',            '/ticto/sound/System/9System_Wow.mp3')
        .add('Retry_01',           '/ticto/sound/System/10System_TryAgain.mp3')
        .add('Retry_02',           '/ticto/sound/System/11System_FightingAgain.mp3')
        .add('Retry_03',           '/ticto/sound/System/12System_CandoIt.mp3')

        .add('Traffic',           '/ticto/sound/cutscene/Traffic.wav')
        .add('TransitionBell',           '/ticto/sound/cutscene/TransitionBell.wav')
        .load(onAssetsLoaded);
 


    app.stage.interactive = true;
    app.stage.buttonMode = true;
    app.stage.sortableChildren = true;

    function onAssetsLoaded(loader, res) {
        $("#loading").hide();
        $("#container").show();

        let bgm1 = PIXI.sound.Sound.from(res.DCCS_Music1);
        let bgm2 = PIXI.sound.Sound.from(res.DCCS_Music2);
        let DCCS_Horn = PIXI.sound.Sound.from(res.DCCS_Horn);
        let Game_Right = PIXI.sound.Sound.from(res.Game_Right);
        let Game_Wrong = PIXI.sound.Sound.from(res.Game_Wrong);
        let Game_Count01 = PIXI.sound.Sound.from(res.Game_Count01);
        let Game_Count02 = PIXI.sound.Sound.from(res.Game_Count02);
        let Game_pop = PIXI.sound.Sound.from(res.Game_pop);

        let story_19 = PIXI.sound.Sound.from(res.story_19);
        let story_20 = PIXI.sound.Sound.from(res.story_20);
        let story_21 = PIXI.sound.Sound.from(res.story_21);
        let story_22 = PIXI.sound.Sound.from(res.story_22);
        let story_23 = PIXI.sound.Sound.from(res.story_23);

        let game_01 = PIXI.sound.Sound.from(res.game_01);
        let game_02 = PIXI.sound.Sound.from(res.game_02);
        let game_03 = PIXI.sound.Sound.from(res.game_03);
        let game_04 = PIXI.sound.Sound.from(res.game_04);
        let game_05 = PIXI.sound.Sound.from(res.game_05);
        let game_06 = PIXI.sound.Sound.from(res.game_06);

        let bluebtn_sound = PIXI.sound.Sound.from(res.bluebtn_sound);
        let redbtn_sound = PIXI.sound.Sound.from(res.redbtn_sound);

        let Great_01 = PIXI.sound.Sound.from(res.Great_01);
        let Great_02 = PIXI.sound.Sound.from(res.Great_02);
        let Great_03 = PIXI.sound.Sound.from(res.Great_03);
        let Good_01 = PIXI.sound.Sound.from(res.Good_01);
        let Good_02 = PIXI.sound.Sound.from(res.Good_02);
        let Good_03 = PIXI.sound.Sound.from(res.Good_03);
        let Retry_01 = PIXI.sound.Sound.from(res.Retry_01);
        let Retry_02 = PIXI.sound.Sound.from(res.Retry_02);
        let Retry_03 = PIXI.sound.Sound.from(res.Retry_03);

        let Traffic = PIXI.sound.Sound.from(res.Traffic);
        let TransitionBell = PIXI.sound.Sound.from(res.TransitionBell);


        let wineffect = new PIXI.spine.Spine(res.dccs_wineffect.spineData);

        wineffect.x = width * 2;
        wineffect.y = height * 2;
        wineffect.scale.set(scale);
        app.stage.addChild(wineffect);

        let rucro = new PIXI.spine.Spine(res.gonogo_rucro.spineData);
        rucro.scale.set(scale);
        rucro.x = width * 2;
        rucro.y = height * 2;
        rucro.scale.set(scale);
        app.stage.addChild(rucro);


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


        //practice
        let practice01 = new PIXI.spine.Spine(res.practicemode.spineData);
        practice01.x = width * 0.135;
        practice01.y = height * 0.19;
        practice01.zIndex = 100;
        practice01.scale.set(scale*0.85);

        let practice02 = new PIXI.spine.Spine(res.practicemode.spineData);
        practice02.x = width * 0.17;
        practice02.y = height * 0.19;
        practice02.zIndex = 100;
        practice02.scale.set(scale*0.85);

        let practice_text = new PIXI.Text("연습하기",{
            fill : '#3294e2',
            fontSize : "50px",
            fontWeight : "Bold",
            fontFamily: "Noto Sans KR",
            trim : true,
            stroke : "#FFFFFF",
            strokeThickness : 5
        })
        practice_text.x = width * 0.02;
        practice_text.y = height * 0.166;
        practice_text.zIndex = 100;
        practice_text.scale.set(scale);

        let UIPracticeMode = PIXI.Sprite.from(res.UIPracticeMode.texture);
        UIPracticeMode.position.x = 0;
        UIPracticeMode.position.y = 0;
        UIPracticeMode.zIndex = 100;
        UIPracticeMode.scale.set(scale);




        let UIBox_text = new PIXI.Text("경찰아저씨가 색깔이라고 하면 같은 색깔의 버튼을 누르세요!",{
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

        // let UIPause = PIXI.Sprite.from(res.UIPause.texture);
        // UIPause.position.x = width * 0.91;
        // UIPause.position.y = height * 0.03;
        // UIPause.zIndex = 100;
        // UIPause.scale.set(scale);

        let UISound = PIXI.Sprite.from(res.UISound.texture);
        UISound.position.x = width * 0.02;
        UISound.position.y = height * 0.03;
        UISound.zIndex = 100;
        UISound.scale.set(scale);

        let background = new PIXI.spine.Spine(res.dccs_bg.spineData);
                    
        let remoteLeft = new PIXI.spine.Spine(res.dccs_remote.spineData);  //왼쪽 리모콘
        let remoteRight = new PIXI.spine.Spine(res.dccs_remote.spineData);  //오른쪽 리모콘
                    
        let eagle = new PIXI.spine.Spine(res.dccs_eagle.spineData); // 문제내는 독수리

        let color_text = new PIXI.Text("색깔",{
            fill : 0xFFFFFF,
            fontSize : "100px",
            fontFamily: "Noto Sans KR"
        })

        color_text.x = width * 2
        color_text.y = height * 2
        color_text.scale.set(scale);
       
 

        let color_img = PIXI.Sprite.from(res.Color.texture);
        
        // color_img.scale.set(scale);
        // app.stage.addChild(color_img)
        color_img.x = width * 2
        color_img.y = height * 2
        color_img.scale.set(scale);
        


        let shape_text = new PIXI.Text("모양",{
            fill : 0xFFFFFF,
            fontSize : "100px",
            fontFamily: "Noto Sans KR"
        })
       
        shape_text.x = width * 2
        shape_text.y = height * 2
        shape_text.scale.set(scale);
        
 

        let shape_img = PIXI.Sprite.from(res.Form.texture);
        
        // color_img.scale.set(scale);
        // app.stage.addChild(color_img)
        shape_img.x = width * 2
        shape_img.y = height * 2
        shape_img.scale.set(scale);
        


        let shape_star = PIXI.Sprite.from(res.DCCSStar.texture);
        shape_star.x = width * 2
        shape_star.y = height * 2
        shape_star.scale.set(scale);
        

        let shape_triangle = PIXI.Sprite.from(res.DCCSTriangle.texture);
        shape_triangle.x = width * 2
        shape_triangle.y = height * 2
        shape_triangle.scale.set(scale);



        let handclick = new PIXI.spine.Spine(res.common_handclick.spineData);
        console.log(handclick.skeleton.data)
        

        //tutorial take01
        let tutorial = new PIXI.spine.Spine(res.dccs_tutorial.spineData);

        tutorial.x = width/2
        tutorial.y = height/2
        tutorial.scale.set(scale);
        app.stage.addChild(tutorial);

        let take01 = tutorial.state.addAnimation(0, 'Take_01', false);
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
                    console.log("GAME START!")
                    app.stage.removeChild(grayscale);
                    app.stage.removeChild(UIPlayBtn);
                    game_start()
                }
            });
        }, 50);


        function game_start(){
            bgm1.play({loop : true});

            $('#mycanvas').unbind('pointerdown');
            let take01 = tutorial.state.addAnimation(0, 'Take_01', false);

            let take01_time = take01.animationEnd;

            tutorial.state.addListener({
                event: function (track, event) {
                    console.log("Event on track " + track.trackIndex + ": ");
                    console.log(event.stringValue);
                    if(event.stringValue == "TransitionBell"){
                        TransitionBell.play();
                    } else if(event.stringValue == "Traffic"){
                        DCCS_Horn.play();
                    } else if(event.stringValue == "19"){
                        story_19.play();
                    } else if(event.stringValue == "20"){
                        story_20.play();
                    } else if(event.stringValue == "21"){
                        story_21.play();
                    } else if(event.stringValue == "22"){
                        story_22.play();
                    } else if(event.stringValue == "23"){
                        story_23.play(); 
                    } else if(event.stringValue == "Traffic"){
                        Traffic.play();
                    } 
                }
            });

            setTimeout(() => {
                bgm1.stop();
                bgm2.play({loop : true});

                app.stage.removeChild(tutorial)

                //background
                
                app.stage.addChild(grayscale);
                background.x = width/2
                background.y = height/2
                background.scale.set(scale);
                app.stage.addChild(background);

                background.state.addAnimation(0, 'Idle', true, 0);

                

                remoteLeft.x = width * 0.15
                remoteLeft.y = height * 0.85
                remoteLeft.scale.set(scale);
                app.stage.addChild(remoteLeft);

                remoteLeft.state.addAnimation(0, 'Triangle_Idle', false, 0);
                // remoteLeft.state.addAnimation(0, 'Star_Click', false, 0);


                remoteRight.x = width * 0.85
                remoteRight.y = height * 0.85
                remoteRight.scale.set(scale);
                app.stage.addChild(remoteRight);

                remoteRight.state.addAnimation(0, 'Star_Idle', false, 0);


                eagle.x = width/2
                eagle.y = height/2
                eagle.scale.set(scale);
                app.stage.addChild(eagle);

                app.stage.addChild(color_text)
                app.stage.addChild(shape_triangle)
                app.stage.addChild(shape_star)
                app.stage.addChild(shape_img)
                app.stage.addChild(shape_text)
                app.stage.addChild(color_img)
                app.stage.addChild(grayscale);

                game_01.play({
                    complete : function(){
                        eaglequest()
                    }
                });
                
                
            }, take01_time*1000);
        }

        
        function eaglequest(){
            app.stage.removeChild(grayscale);
            
            eagle.state.setAnimation(1, 'Idle', false, 0);
            eagle.state.addAnimation(1, 'Up', false, 0);
            eagle.state.addAnimation(1, 'Talk', false, 0);
            // eagle.state.addAnimation(1, 'Quiz', false, 0);
        }


        eagle.state.addListener({
            complete : function(e){
                if(e.animation.name == 'Up'){
                    console.log("tutorialSC",tutorialSC, tutorial_count)
                    if(quest_type == 0){
                        //모양 문제
                        console.log("firsttime", firsttime)
                        game_05.play(); 

               
                        shape_text.x = width * 0.453
                        shape_text.y = height * 0.21
                        shape_img.x = width * 0.4
                        shape_img.y = height * 0.34

                    }else if(quest_type == 1){
                        // 색 문제
                        console.log("firsttime", firsttime)
                        game_03.play();

                    
                        color_text.x = width * 0.453
                        color_text.y = height * 0.21
                        color_img.x = width * 0.4
                        color_img.y = height * 0.34
                    }
                    
                }else if(e.animation.name == 'Talk'){
                    
                    color_text.x = width * 2
                    shape_text.x = width * 2
         
                    color_img.x = width * 2
                    shape_img.x = width * 2

                    color_text.y = height * 2
                    shape_text.y = height * 2
         
                    color_img.y = height * 2
                    shape_img.y = height * 2

                    wineffect.x = width * 0.5;
                    wineffect.y = height * 0.325;
                    wineffect.zIndex = 100;
                    let Change = wineffect.state.setAnimation(0, 'Change', false, 0);
                    let Change_time = Change.animationEnd

                    setTimeout(() => {
                        round_start_time = new Date();
                        wineffect.state.setAnimation(0, 'NoImg', false, 0);
                        console.log("!!!")
                        
                        if(quest_shape_type == 0){
                            
                            shape_star.x = width * 0.433
                            shape_star.y = height * 0.2
                            if(tutorial_color){
                                console.log("tutorialSC",tutorialSC)
                                eagle.state.addAnimation(1, 'Quiz', false, 0);
                                handclick.x = width * 0.15
                                handclick.y = height * 0.895
                                handclick.scale.set(scale);
                                app.stage.addChild(handclick);
        
                                var handclick_ani = handclick.state.addAnimation(0, 'Click', true, 0 );
                                var handclick_time = handclick_ani.animationEnd
                                game_02.play()
                                setTimeout(() => {
                                    app.stage.removeChild(handclick);
                                    tutorialEx()
                                    
                                }, (handclick_time)*1000);
                                
                            }else if(tutorial_shape){
                                eagle.state.addAnimation(1, 'Quiz', false, 0);
                                handclick.x = width * 0.85
                                handclick.y = height * 0.895
                                handclick.scale.set(scale);
                                app.stage.addChild(handclick);
        
                                var handclick1_ani = handclick.state.addAnimation(0, 'Click', true, 0 );
                                var handclick1_time = handclick1_ani.animationEnd
                                game_04.play()
                                setTimeout(() => {
                                    app.stage.removeChild(handclick);
                                    tutorialEx()
                                }, (handclick1_time)*1000);
                                
                            }else if(tutorial_count<2){
                                eagle.state.addAnimation(1, 'Quiz', false, 0);
                                answerClick()
                            }else if(tutorial_count==2){
                                eagle.state.addAnimation(1, 'Quiz', false, 0);
                                timer_set();
                                answerClickNT()
                            }
                        }else if(quest_shape_type == 1){
                    
                            shape_triangle.x = width * 0.43
                            shape_triangle.y = height * 0.21


                            eagle.state.addAnimation(1, 'Quiz', false, 0);

                            if(tutorial_count<2){
                                answerClick()
                            }else if(tutorial_count ==2){
                                timer_set();
                                answerClickNT()
                            }
                        }
                        

                        
                    }, Change_time*1000 );
                    
                }else if(e.animation.name == 'Success'){
                    $('#mycanvas').unbind("pointerdown")
                    tutorial_quest()

                    if( tutorialSC == 2){
                        GreatGoodFail()
                    }else if(tutorial_count ==2){
                        questNT()
                    }
                    
                }else if(e.animation.name == 'Fail'){
                    $('#mycanvas').unbind("pointerdown")
                    
                    // GreatGoodFail()

                    if(fail_count > 1){
                        game_end();
                    } else{
                        if( tutorial_count < 2){
                            tutorial_quest()
                            GreatGoodFail()
                        }else if(tutorial_count ==2){
                            questNT()
                        }
                    }
                    
                    
                    
                }
   
               

            }
        });


        function tutorialEx(){
                if(tutorial_color){
                    
                    let Success = eagle.state.addAnimation(1, 'Down', false, 0);
                    let Success_time  = Success.animationEnd
                    
                    $('#mycanvas').unbind("pointerdown")
                    // tutorial_color = false;
                    shape_star.x = width * 2
                    shape_star.y = height * 2
                    shape_triangle.y = height * 2
                    shape_triangle.x = width * 2
                    setTimeout(() => {
                        isfirsttime = true;
                        UIBox_text.text = "경찰아저씨가 색깔이라고 하면 같은 색깔의 버튼을 누르세요!";
                        app.stage.removeChild(UIBox_01)
                        app.stage.removeChild(UIBox_text)
                        // app.stage.removeChild(UIPause)
                        app.stage.removeChild(UISound)

                        

                        blue_btn_click()
                    }, 50);

                }else if(tutorial_shape){
                    
                    let Success = eagle.state.addAnimation(1, 'Down', false, 0);
                    let Success_time  = Success.animationEnd
                    tutorial_shape = false;
                    $('#mycanvas').unbind("pointerdown")
                    shape_star.x = width * 2
                    shape_star.y = height * 2
                    shape_triangle.y = height * 2
                    shape_triangle.x = width * 2
                    setTimeout(() => {
                        isfirsttime = true;
                        // firsttime = true;
                        blue_btn_click()
                    }, 50);
                        
                }
            
        }

        

        function tutorial_quest(){
            console.log("TUTORIAL");
            console.log(tutorial_color,tutorial_shape, isfirsttime)
            quest_shape_type = Math.floor(Math.random()*2)
        }

        // 튜토리얼 용 !! 정답 클릭!! 
        function answerClick(){
            $('#mycanvas').on('pointerdown', function(e){
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

                if(remoteLeft.x+418*scale*0.5 > x && remoteLeft.x-418*scale*0.5 < x && remoteLeft.y+339*scale*0.5 > y && remoteLeft.y-339*scale *0.5< y ){
                    Game_pop.play();
                    remoteLeft.state.addAnimation(1, 'Triangle_Click', false, 0);
                    $('#mycanvas').unbind("pointerdown")

                    if((quest_type == 0 && quest_shape_type ==0)|| (quest_type == 1 && quest_shape_type ==1)){
                        //0번 머양 문제
                        Game_Wrong.play();
                        eagle.state.addAnimation(1, 'Fail', false, 0);
                        background.state.addAnimation(1, 'Fail', false, 0);
                        background.state.addAnimation(1, 'Idle', true, 0);
                        tutorial_fail = true
                        shape_star.x = width * 2
                        shape_star.y = height * 2
                        shape_triangle.y = height * 2
                        shape_triangle.x = width * 2
                        
                    }else if((quest_type == 0 && quest_shape_type ==1)|| (quest_type == 1 && quest_shape_type ==0)){

                        Game_Right.play();
                        eagle.state.addAnimation(1, 'Success', false, 0);
                        

                        // set up the mixes!
                        background.stateData.setMix('LeftSuccess', 'Idle', 0.1);
                        // play animation
                        background.state.setAnimation(0, 'LeftSuccess', false);
                        background.state.addAnimation(0, 'Idle', true, 0);


                        tutorialSC += 1
                        if(tutorialSC==1){practice02.state.addAnimation(practice_ani_index, 'Clear', false);}else if(tutorialSC == 2){practice01.state.addAnimation(practice_ani_index, 'Clear', false);}
                        practice_ani_index +=1 

                        // setTimeout(() => {
                            shape_star.x = width * 2
                            shape_star.y = height * 2
                            shape_triangle.y = height * 2
                            shape_triangle.x = width * 2
                        // }, 50);
                        if(tutorialSC <2){
                            tutorial_quest()
                            eaglequest()
                        }
               
                    }
                }else if(remoteRight.x+418*scale*0.5 > x && remoteRight.x-418*scale*0.5 < x && remoteRight.y+339*scale*0.5 > y && remoteRight.y-339*scale *0.5< y){
                    Game_pop.play();

                    remoteRight.state.addAnimation(0, 'Star_Click', false, 0);
                    $('#mycanvas').unbind("pointerdown");
      
                    if((quest_type == 0 && quest_shape_type ==0)|| (quest_type == 1 && quest_shape_type ==1)){
                        eagle.state.addAnimation(1, 'Success', false, 0);
                        Game_Right.play();
                        // set up the mixes!
                        background.stateData.setMix('RightSuccess', 'Idle', 0.1);
                        // play animation
                        background.state.setAnimation(0, 'RightSuccess', false);
                        background.state.addAnimation(0, 'Idle', true, 0);

                        tutorialSC += 1
                        if(tutorialSC==1){practice02.state.addAnimation(practice_ani_index, 'Clear', false);}else if(tutorialSC == 2){practice01.state.addAnimation(practice_ani_index, 'Clear', false); }
                        practice_ani_index +=1 
                        // setTimeout(() => {
                            shape_star.x = width * 2
                            shape_star.y = height * 2
                            shape_triangle.y = height * 2
                            shape_triangle.x = width * 2
                        // }, 50);
                        if(tutorialSC <2){
                            tutorial_quest()
                            eaglequest()
                        }
                        
                       
                    }else if((quest_type == 0 && quest_shape_type ==1)|| (quest_type == 1 && quest_shape_type ==0)){

                        Game_Wrong.play();

                        eagle.state.addAnimation(1, 'Fail', false, 0);
                        background.state.addAnimation(1, 'Fail', false, 0);
                        background.state.addAnimation(1, 'Idle', true, 0);
                        tutorial_fail = true
                        // setTimeout(() => {
                            shape_star.x = width * 2
                            shape_star.y = height * 2
                            shape_triangle.y = height * 2
                            shape_triangle.x = width * 2
                        // }, 50);
                        
                        
                    }
                } else if(UISound.x + UISound.width > x && UISound.x < x && UISound.y + UISound.height > y && UISound.y < y){
                    console.log("SOUND BTN!");
                    if(tutorial_count == 0){
                        game_02.stop();
                        game_02.play();
                    } else if(tutorial_count == 1){
                        game_04.stop();
                        game_04.play();
                    }
                }
            })
        }


        function GreatGoodFail(){
            const randomNum = Math.floor(Math.random() * 3 + 1);

            // let rucro = new PIXI.spine.Spine(res.gonogo_rucro.spineData);
            // rucro.scale.set(scale);

            rucro.x = width * 0.5
            rucro.y = height * 0.5
            rucro.zIndex = 95;
            grayscale.zIndex = 90;
            app.stage.addChild(grayscale);
            // app.stage.addChild(rucro);
            


            if(tutorialSC == 2){
                let Good = rucro.state.setAnimation(4, 'Good', false, 0)
                let Good_time = Good.animationEnd
                if(randomNum == 1){
                    Good_01.play();
                } else if(randomNum == 2){
                    Good_02.play();
                } else if(randomNum == 3){
                    Good_03.play();
                }

                tutorial_count +=1

                if(tutorial_count <2){
                    setTimeout(() => {
                        // rucro.state.addAnimation(4, 'NoImg', false, 0)

                        // app.stage.removeChild(rucro);
                        tutorial_shape = true
                        quest_shape_type = 0
                        quest_type = 0
                        tutorialSC = 0
                        eaglequest()
                        app.stage.removeChild(grayscale);
                        UIBox_text.text = "경찰아저씨가 모양이라고 하면 같은 모양의 버튼을 누르세요!";
                        app.stage.removeChild(common_heart1);
                        app.stage.removeChild(common_heart2);
                        app.stage.removeChild(UIBox_01)
                        app.stage.removeChild(UIBox_text)
                        // app.stage.removeChild(UIPause)
                        app.stage.removeChild(UISound)

                        app.stage.removeChild(practice01)
                        app.stage.removeChild(practice02)
                        app.stage.removeChild(practice_text)
                        app.stage.removeChild(UIPracticeMode)
                    }, Good_time*1000);
                }else if(tutorial_count == 2){
                    setTimeout(() => {
                        Istutorial = false;
                        app.stage.removeChild(rucro);
                        app.stage.removeChild(grayscale);

                        UIBox_text.text = "경찰아저씨의 말을 잘 듣고 같은 모양이나 같은 색깔을 찾아요!";
                        app.stage.removeChild(common_heart1);
                        app.stage.removeChild(common_heart2);
                        app.stage.removeChild(UIBox_01)
                        app.stage.removeChild(UIBox_text)
                        // app.stage.removeChild(UIPause)
                        app.stage.removeChild(UISound)

                        app.stage.removeChild(practice01)
                        app.stage.removeChild(practice02)
                        app.stage.removeChild(practice_text)
                        app.stage.removeChild(UIPracticeMode)

                        blue_btn_click()
                        // eaglequest()
                    }, Good_time*1000);
                }


                


            }else if(tutorial_fail){
                if(randomNum == 1){
                    Retry_01.play();
                } else if(randomNum == 2){
                    Retry_02.play();
                } else if(randomNum == 3){
                    Retry_03.play();
                }
                let Fail = rucro.state.addAnimation(4, 'Fail', false, 0)
                let Fail_time = Fail.animationEnd
                tutorial_fail = false
                setTimeout(() => {
                    // app.stage.removeChild(rucro);
                    // rucro.state.addAnimation(4, 'NoImg', false, 0)

                    app.stage.removeChild(grayscale);
                    eaglequest()
                }, Fail_time*1000);
            }



           

        }





        function blue_btn_click(){
            app.stage.addChild(grayscale);
            let start = new PIXI.spine.Spine(res.common_start.spineData);

            start.x = width/2
            start.y = height/2 
            start.scale.set(scale);
            start.zIndex = 91;

            
            // app.stage.addChild(common_heart1);
            // app.stage.addChild(common_heart2);
            app.stage.addChild(UIBox_01)
            app.stage.addChild(UIBox_text)
            // app.stage.addChild(UIPause)
            app.stage.addChild(UISound)

            // common_heart1.state.addAnimation(0, 'Full', true);
            // common_heart2.state.addAnimation(0, 'Full', true);

            

            if(tutorial_count < 2){
                app.stage.addChild(start);

                app.stage.addChild(practice01)
                app.stage.addChild(practice02)
                app.stage.addChild(practice_text)
                app.stage.addChild(UIPracticeMode)

                practice01.state.addAnimation(practice_ani_index, 'Appear', false);
                practice02.state.addAnimation(practice_ani_index, 'Appear', false);
                practice_ani_index +=1
                
                let blue_btn = start.state.addAnimation(2, 'Ready2', false, 0);
                let blue_btn_time = blue_btn.animationEnd
                start.state.addAnimation(2, 'Ready2', true, 0);
                
                bluebtn_sound.play({
                    complete : function(){
                        $('#mycanvas').on("pointerdown", function(e){


                            var bound = canvas.getBoundingClientRect();
                            let x, y;
                            if(isportrait){
                                // 세로모드 ( 강제로 회전 )
                                console.log("bound LEFT, TOP : ", bound.left, bound.top);
                                console.log("bound width, height : ", bound.width, bound.height);
                                console.log("canvas width, height : ", canvas.width, canvas.height);
                                console.log(e.clientX, e.clientY);
                                y = canvas.height / touch_ratio - ((e.clientX - bound.left) * (canvas.height / bound.width)) / touch_ratio;
                                x = (e.clientY - bound.top) * (canvas.width / bound.height) / touch_ratio;
                            } else {
                                x = (e.clientX - bound.left) * (canvas.width / bound.width) / touch_ratio;
                                y = (e.clientY - bound.top) * (canvas.height / bound.height) / touch_ratio;
                            } 
                            console.log(x,y)
                            console.log(start.x, start.y)
                            console.log(start.width*scale, start.height*scale)
            
                            if(start.x + 206.5*scale*1 > x && start.x - 206.5*scale*1< x && start.y+ 160 * scale*2> y && start.y - 160 * scale*0.3 < y){
                                console.log("GAME START!");
                                $('#mycanvas').unbind('pointerdown');
                                app.stage.removeChild(start)
        
                                let start_count = new PIXI.spine.Spine(res.common_start.spineData);
                                start_count.zIndex = 92;
                                start_count.x = width/2
                                start_count.y = height/2 
                                start_count.scale.set(scale);
                                app.stage.addChild(start_count);
        
                                let count = start_count.state.addAnimation(7, 'Count_01', false, 0);
                                let count_time = count.animationEnd
                                start_count.state.addAnimation(7, 'Count_02', false, 0);
                                start_count.state.addAnimation(7, 'Count_03', false, 0);
                                start_count.state.addAnimation(7, 'Count_04', false, 0);
        
                                Game_Count01.play();
        
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
                                
                                setTimeout(() => {
                                    console.log("tutorial_color", tutorial_color)
                                    // if(tutorial_color){
                                    //     // game_02.play()
                                       
                                    // }else{
                                    //     game_04.play()
                                    // }
                                    // firsttime = true

                                    tutorial_color = false
                                    tutorial_quest()
                                    eaglequest()
                                    app.stage.removeChild(grayscale);

                                    
                                }, count_time*4*1000);
                            }
                        })
                    }
                })
                
            }else{
                app.stage.removeChild(practice01)
                app.stage.removeChild(practice02)
                app.stage.removeChild(practice_text)
                app.stage.removeChild(UIPracticeMode)

                app.stage.addChild(common_heart1);
                app.stage.addChild(common_heart2);
                common_heart1.state.addAnimation(0, 'Full', true);
                common_heart2.state.addAnimation(0, 'Full', true);
                

                game_06.play({
                    complete : function(){
                        app.stage.addChild(start);
                        let blue_btn = start.state.addAnimation(2, 'Ready', false, 0);
                        let blue_btn_time = blue_btn.animationEnd
                        start.state.addAnimation(2, 'Ready', true, 0);

                        redbtn_sound.play({
                            complete : function(){
                                $('#mycanvas').one("pointerdown", function(){
                                    app.stage.removeChild(start)
                    
                                    let start_count = new PIXI.spine.Spine(res.common_start.spineData);
                                    start_count.zIndex = 92;
                                    start_count.x = width/2
                                    start_count.y = height/2 
                                    start_count.scale.set(scale);
                                    app.stage.addChild(start_count);
                    
                                    let count = start_count.state.addAnimation(7, 'Count_01', false, 0);
                                    let count_time = count.animationEnd
                                    start_count.state.addAnimation(7, 'Count_02', false, 0);
                                    start_count.state.addAnimation(7, 'Count_03', false, 0);
                                    start_count.state.addAnimation(7, 'Count_04', false, 0);
                    
                                    Game_Count01.play();
                    
                                    var start_sound_cnt = 0;
                                    start_count.state.addListener({
                                        start: function (track, event) {
                                            console.log(start_sound_cnt)
                                            if(start_sound_cnt == 2){
                                                Game_Count02.play();
                                            }else {
                                                Game_Count01.play();
                                            }
                                            start_sound_cnt++;
                                        }
                                    });
                    
                                    setTimeout(() => {
                                        firsttime = true
                                        questNT()
                                        start_time = new Date();
                                        app.stage.removeChild(grayscale);
                                        // game_02.play({
                                        //     complete : function(){
                                        //         eaglequest()
                                        //     }
                                        // });
                                    }, count_time*4*1000);
                    
                    
                                    })
                            }
                        })
                    }
                })
            }                       
        }

        
        //본게임
        function questNT(){
            // 문제타입 quest_idx
            if(quest_idx > 15){
                game_end();
            } else {
                if(quest_idx == 0){
                    console.log("isfirsttime")
                }
                let quest = [0,0,0,1,1,1,0,1,1,0,1,0,0,1,0,1]
                quest_type = quest[quest_idx]
                quest_shape_type = Math.floor(Math.random()*2)
                // console.log("문제 타입",quest_shape_type, "모양 타입", quest_shape_type)
                // DATA!
                dccsNumOfPerformedRound += 1;
                if(quest_idx > 0 && quest[quest_idx] != quest[quest_idx-1]){
                    isswitch = true;
                }else{
                    isswitch = false;
                }

                eaglequest();
                quest_idx +=1;
            }
        }


        // TIMER 시간 설정 (00:00 or 120)
        function timer_set(){
            timer_start = new PIXI.Ticker;
            timer_start.autoStart = false;

            timer_bg = PIXI.Sprite.from(res.DCCSTime_01.texture);
            timer_bg.x = width * 0.29;
            timer_bg.y = height * 0.9;
            timer_bg.scale.set(scale);

            timer = PIXI.Sprite.from(res.DCCSTime_02.texture);
            timer.x = width * 0.29;
            timer.y = height * 0.9;
            timer.scale.set(scale);


            timer_text = new PIXI.Text("00 : 05",{
                fill : 0xFFFFFF,
                fontSize : "60px",
                fontFamily: "Noto Sans KR"
            })
            timer_text.x = width * 0.45
            timer_text.y = height * 0.9
            timer_text.scale.set(scale);
            
            if(!Istutorial){
                app.stage.addChild(timer_bg);
                app.stage.addChild(timer);
                app.stage.addChild(timer_text);
                
                time = 5;
                var sec = time%60;
                var ts = sec;
                if(ts < 10){
                ts = "0" + sec;
                }
                var settime = "00 : " + ts;
                timer_text.text = settime
                time--;
                code_timer = setInterval(function(){    
                    var sec = time%60;
                    var ts = sec;
                    if(ts < 10){
                    ts = "0" + sec;
                    }
                    var settime = "00 : " + ts;
                    timer_text.text = settime
                    time--;
                    if(time < 0){
                        Game_Wrong.play();
                        // var dccsNumOfPerformedRound = 0; 
                        // var dccsNumOfSuccessRound = 0; 
                        // var dccsMaxCnsctvSuccessCount = 0; 
                        // var EX_dccsMaxCnsctvSuccessCount = 0
                        // var dccsNumOfCrrctRuleSwitch = 0; 
                        // var dccsResponseTimeList = [];
                        dccsMaxCnsctvSuccessCount += 1;
                        if(dccsMaxCnsctvSuccessCount >= EX_dccsMaxCnsctvSuccessCount){
                            EX_dccsMaxCnsctvSuccessCount = dccsMaxCnsctvSuccessCount;
                        }
                        console.log(dccsMaxCnsctvSuccessCount, EX_dccsMaxCnsctvSuccessCount);

                        dccsMaxCnsctvSuccessCount = 0;
                        dccsResponseTimeList.push({"isCorrect": false, "responseTime": -1});
                        console.log("실패 : " ,{"isCorrect": false, "responseTime": -1});

                        clearInterval(code_timer);
                        hide_position = 0;
                        timer_start.stop();
                        app.stage.removeChild(timer_bg);
                        app.stage.removeChild(timer);
                        app.stage.removeChild(timer_text);
                        $('#mycanvas').unbind("pointerdown")
                        
                        eagle.state.addAnimation(1, 'Fail', false, 0);
                        background.state.addAnimation(1, 'Fail', false, 0);
                        background.state.addAnimation(1, 'Idle', true, 0);
                        tutorial_fail = true
                        fail_count += 1

                        if(fail_count == 1){
                            common_heart2.state.setAnimation(0, 'Full2Empty', false);
        
                            common_heart1.state.addAnimation(0, 'Full', true);
                            common_heart2.state.addAnimation(0, 'Empty', true);
        
                        }else if(fail_count == 2){
        
                            common_heart1.state.setAnimation(0, 'Full2Empty', false);
        
                            common_heart1.state.addAnimation(0, 'Empty', true);
                            common_heart2.state.addAnimation(0, 'Empty', true);
                        }

                        
                        // setTimeout(() => {
                            shape_star.x = width * 2
                            shape_star.y = height * 2
                            shape_triangle.y = height * 2
                            shape_triangle.x = width * 2
                        // }, 50);
                    }
                }, 1000);
                timer_start.start();
            }
            
            

            let hide_position = 0

            app.animationUpdate = function () {
                var animation_speed = 5 * 1000 / 16.6;    // 5초
                if (hide_position <= (animation_speed)) {
                    
                    // timer.width = timer.width * (1 - (1 / animation_speed * hide_position ));
                    timer.scale.set(scale * (1 - (1 / (animation_speed) * hide_position )), scale);
                    hide_position += 1;
                    

                } else {
                    // console.log("IF")

                    hide_position = 0;
                    timer_start.stop();
                }
                
            }
            
            timer_start.add(app.animationUpdate);
        }


        // 본게임 용 !! 정답 클릭!! 
        function answerClickNT(){
            // console.log("quest_type", quest_type, "quest_shape_type", quest_shape_type)
            $('#mycanvas').on('pointerdown', function(e){
                round_end_time = new Date();
                round_total_time = round_end_time - round_start_time;
                
                var bound = canvas.getBoundingClientRect();

                let x, y;
                if(isportrait){
                    // 세로모드 ( 강제로 회전 )
                    console.log("bound LEFT, TOP : ", bound.left, bound.top);
                    console.log("bound width, height : ", bound.width, bound.height);
                    console.log("canvas width, height : ", canvas.width, canvas.height);
                    console.log(e.clientX, e.clientY);
                    y = canvas.height / touch_ratio - ((e.clientX - bound.left) * (canvas.height / bound.width)) / touch_ratio;
                    x = (e.clientY - bound.top) * (canvas.width / bound.height) / touch_ratio;
                } else {
                    x = (e.clientX - bound.left) * (canvas.width / bound.width) / touch_ratio;
                    y = (e.clientY - bound.top) * (canvas.height / bound.height) / touch_ratio;
                }

                if(remoteLeft.x+418*scale*0.5 > x && remoteLeft.x-418*scale*0.5 < x && remoteLeft.y+339*scale*0.5 > y && remoteLeft.y-339*scale *0.5< y ){
                    clearInterval(code_timer);
                    hide_position = 0;
                    timer_start.stop();
                    app.stage.removeChild(timer_bg);
                    app.stage.removeChild(timer);
                    app.stage.removeChild(timer_text);
                    // console.log("left click")
                    remoteLeft.state.addAnimation(1, 'Triangle_Click', false, 0);
                    $('#mycanvas').unbind("pointerdown")

                    // 오답!!
                    if((quest_type == 0 && quest_shape_type ==0)|| (quest_type == 1 && quest_shape_type ==1)){
                        //0번 모양 문제 - 틀림
                        $('#mycanvas').unbind("pointerdown");

                        // var dccsNumOfPerformedRound = 0; 
                        // var dccsNumOfSuccessRound = 0; 
                        // var dccsMaxCnsctvSuccessCount = 0; 
                        // var EX_dccsMaxCnsctvSuccessCount = 0
                        // var dccsNumOfCrrctRuleSwitch = 0; 
                        // var dccsResponseTimeList = [];
                        if(dccsMaxCnsctvSuccessCount >= EX_dccsMaxCnsctvSuccessCount){
                            EX_dccsMaxCnsctvSuccessCount = dccsMaxCnsctvSuccessCount;
                        }
                        console.log(dccsMaxCnsctvSuccessCount, EX_dccsMaxCnsctvSuccessCount);

                        dccsMaxCnsctvSuccessCount = 0;
                        dccsResponseTimeList.push({"isCorrect": false, "responseTime": round_total_time/1000});
                        console.log("실패 : " ,{"isCorrect": false, "responseTime": round_total_time/1000});

                        Game_Wrong.play();

                        eagle.state.addAnimation(1, 'Fail', false, 0);
                        background.state.addAnimation(1, 'Fail', false, 0);
                        background.state.addAnimation(1, 'Idle', true, 0);
                        tutorial_fail = true
                        fail_count += 1

                        if(fail_count == 1){
                            common_heart2.state.setAnimation(0, 'Full2Empty', false);
        
                            common_heart1.state.addAnimation(0, 'Full', true);
                            common_heart2.state.addAnimation(0, 'Empty', true);
        
                        }else if(fail_count == 2){
        
                            common_heart1.state.setAnimation(0, 'Full2Empty', false);
        
                            common_heart1.state.addAnimation(0, 'Empty', true);
                            common_heart2.state.addAnimation(0, 'Empty', true);
                        }

                        // setTimeout(() => {
                            shape_star.x = width * 2
                            shape_star.y = height * 2
                            shape_triangle.y = height * 2
                            shape_triangle.x = width * 2
                        // }, 50);


                    // 정답!!
                    }else if((quest_type == 0 && quest_shape_type ==1)|| (quest_type == 1 && quest_shape_type ==0)){
                        // var dccsNumOfPerformedRound = 0; 
                        // var dccsNumOfSuccessRound = 0; 
                        // var dccsMaxCnsctvSuccessCount = 0; 
                        // var EX_dccsMaxCnsctvSuccessCount = 0
                        // var dccsNumOfCrrctRuleSwitch = 0; 
                        // var dccsResponseTimeList = [];
                        dccsNumOfSuccessRound += 1;
                        dccsMaxCnsctvSuccessCount += 1;
                        if(isswitch){
                            dccsNumOfCrrctRuleSwitch += 1;
                        }
                        console.log(dccsMaxCnsctvSuccessCount, EX_dccsMaxCnsctvSuccessCount);

                        dccsResponseTimeList.push({"isCorrect": true, "responseTime": round_total_time/1000})
                        console.log("성공 : " ,{"isCorrect": true, "responseTime": round_total_time/1000});

                        eagle.state.addAnimation(1, 'Success', false, 0);
                        Game_Right.play();

                        // set up the mixes!
                        background.stateData.setMix('LeftSuccess', 'Idle', 0.1);
                        // play animation
                        background.state.setAnimation(0, 'LeftSuccess', false);
                        background.state.addAnimation(0, 'Idle', true, 0);

                        tutorialSC += 1

                        if(fail_count != 0){
                            fail_count = 0

                            common_heart1.state.setAnimation(0, 'EmptyToFull', false);
                            common_heart2.state.setAnimation(0, 'EmptyToFull', false);
                            
                            common_heart1.state.addAnimation(0, 'Full', true);
                            common_heart2.state.addAnimation(0, 'Full', true);
                        }
                        
                        
                        // remoteLeft.state.addAnimation(0, 'Triangle_Idle', false, 0);
                        // setTimeout(() => {
                            shape_star.x = width * 2
                            shape_star.y = height * 2
                            shape_triangle.y = height * 2
                            shape_triangle.x = width * 2
                        // }, 50);
                 
                    }
                }else if(remoteRight.x+418*scale*0.5 > x && remoteRight.x-418*scale*0.5 < x && remoteRight.y+339*scale*0.5 > y && remoteRight.y-339*scale *0.5< y){
                    clearInterval(code_timer);
                    hide_position = 0;
                    timer_start.stop();
                    app.stage.removeChild(timer_bg);
                    app.stage.removeChild(timer);
                    app.stage.removeChild(timer_text);
                    // console.log("right click")
                    remoteRight.state.addAnimation(0, 'Star_Click', false, 0);
                    $('#mycanvas').unbind("pointerdown")

                    // 정답!! 
                    if((quest_type == 0 && quest_shape_type ==0)|| (quest_type == 1 && quest_shape_type ==1)){
                        eagle.state.addAnimation(1, 'Success', false, 0);

                        // var dccsNumOfPerformedRound = 0; 
                        // var dccsNumOfSuccessRound = 0; 
                        // var dccsMaxCnsctvSuccessCount = 0; 
                        // var EX_dccsMaxCnsctvSuccessCount = 0
                        // var dccsNumOfCrrctRuleSwitch = 0; 
                        // var dccsResponseTimeList = [];
                        dccsNumOfSuccessRound += 1;
                        dccsMaxCnsctvSuccessCount += 1;
                        if(isswitch){
                            dccsNumOfCrrctRuleSwitch += 1;
                        }
                        console.log(dccsMaxCnsctvSuccessCount, EX_dccsMaxCnsctvSuccessCount);

                        dccsResponseTimeList.push({"isCorrect": true, "responseTime": round_total_time/1000})
                        console.log("성공 : " ,{"isCorrect": true, "responseTime": round_total_time/1000});

                        Game_Right.play();

                        // set up the mixes!
                        background.stateData.setMix('RightSuccess', 'Idle', 0.1);
                        // play animation
                        background.state.setAnimation(0, 'RightSuccess', false);
                        background.state.addAnimation(0, 'Idle', true, 0);

                        tutorialSC += 1
                        if(fail_count != 0){
                            fail_count = 0

                            common_heart1.state.setAnimation(0, 'EmptyToFull', false);
                            common_heart2.state.setAnimation(0, 'EmptyToFull', false);
                            
                            common_heart1.state.addAnimation(0, 'Full', true);
                            common_heart2.state.addAnimation(0, 'Full', true);
                        }
                        // setTimeout(() => {
                            shape_star.x = width * 2
                            shape_star.y = height * 2
                            shape_triangle.y = height * 2
                            shape_triangle.x = width * 2
                        // }, 50);
                     
                        
                    // 오답!! 
                    }else if((quest_type == 0 && quest_shape_type ==1)|| (quest_type == 1 && quest_shape_type ==0)){
                        Game_Wrong.play();

                        // var dccsNumOfPerformedRound = 0; 
                        // var dccsNumOfSuccessRound = 0; 
                        // var dccsMaxCnsctvSuccessCount = 0; 
                        // var EX_dccsMaxCnsctvSuccessCount = 0
                        // var dccsNumOfCrrctRuleSwitch = 0; 
                        // var dccsResponseTimeList = [];
                        if(dccsMaxCnsctvSuccessCount >= EX_dccsMaxCnsctvSuccessCount){
                            EX_dccsMaxCnsctvSuccessCount = dccsMaxCnsctvSuccessCount;
                        }
                        console.log(dccsMaxCnsctvSuccessCount, EX_dccsMaxCnsctvSuccessCount);
                        dccsMaxCnsctvSuccessCount = 0;
                        dccsResponseTimeList.push({"isCorrect": false, "responseTime": round_total_time/1000});
                        console.log("실패 : " ,{"isCorrect": false, "responseTime": round_total_time/1000});


                        eagle.state.addAnimation(1, 'Fail', false, 0);
                        background.state.addAnimation(1, 'Fail', false, 0);
                        background.state.addAnimation(1, 'Idle', true, 0);
                        tutorial_fail = true

                        fail_count += 1
                        if(fail_count == 1){
                            common_heart2.state.setAnimation(0, 'Full2Empty', false);
        
                            common_heart1.state.addAnimation(0, 'Full', true);
                            common_heart2.state.addAnimation(0, 'Empty', true);
        
                        }else if(fail_count == 2){
        
                            common_heart1.state.setAnimation(0, 'Full2Empty', false);
        
                            common_heart1.state.addAnimation(0, 'Empty', true);
                            common_heart2.state.addAnimation(0, 'Empty', true);
                        }
                       
                        // setTimeout(() => {
                            shape_star.x = width * 2
                            shape_star.y = height * 2
                            shape_triangle.y = height * 2
                            shape_triangle.x = width * 2
                        // }, 50);
                        
                        
                    }
                }else if(UISound.x + UISound.width > x && UISound.x < x && UISound.y + UISound.height > y && UISound.y < y){
                    console.log("SOUND BTN!");
                    game_06.stop();
                    game_06.play();
                }
            })
        }



        app.start();

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
    
    }


})



function game_end(){
    end_time = new Date();
    dccsPerformanceTime = end_time - start_time;

    console.log("총 수행 라운드 : ", dccsNumOfPerformedRound, dccsResponseTimeList.length);
    console.log("총 정답 라운드 : ", dccsNumOfSuccessRound);

    // 최대 연속 성공 값

    if(EX_dccsMaxCnsctvSuccessCount >= dccsMaxCnsctvSuccessCount){
        dccsMaxCnsctvSuccessCount = EX_dccsMaxCnsctvSuccessCount;
    }
    // } else {
    //     dccsMaxCnsctvSuccessCount -= 1;
    // }

    // if(dccsMaxCnsctvSuccessCount < 0){
    //     dccsMaxCnsctvSuccessCount = 0;
    // }
    console.log("연속 정답 개수 : ", dccsMaxCnsctvSuccessCount);
    console.log("룰스위치 정답 개수 : ", dccsNumOfCrrctRuleSwitch);
    console.log("전체 라운드 반응시간 리스트 : ", dccsResponseTimeList);
    console.log("총 수행 시간 : ", dccsPerformanceTime / 1000);

    var send_data = {
        "phoneNum" : "01030727270",
        "name" : "이준구",
        "taskId" : 7,                   
        "dccsNumOfPerformedRound" : dccsNumOfPerformedRound,
        "dccsNumOfSuccessRound" : dccsNumOfSuccessRound,
        "dccsNumOfCrrctRuleSwitch" : dccsNumOfCrrctRuleSwitch,
        "dccsMaxCnsctvSuccessCount" :dccsMaxCnsctvSuccessCount,
        "dccsResponseTimeList" : dccsResponseTimeList,
        "dccsPerformanceTime" : dccsPerformanceTime / 1000
    };

    console.log(send_data);
    console.log(JSON.stringify(send_data));

    $.ajax({
        type: "POST",
        url: "http://3.36.135.103:3002/quantificationsave",
        async : false,
        data: JSON.stringify(send_data),
        contentType : "application/json",
        dataType: 'JSON',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
        },
        success : function(json) {
            console.log(json);
            // 게임종료
            const container = document.getElementById('container');
            container.removeChild(app.view);
            window.location.href = "/ticto/end";
        },
        error: function(json){
            console.log(json);
        }
    });
}
