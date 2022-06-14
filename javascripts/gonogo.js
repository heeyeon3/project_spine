// GONOGO 
// 

var pause_interval;

var app;    // PIXI JS APPLICATION

let grayscale ;                         // GRAY SCALE

// 세로모드
var isportrait = false;
var touch_ratio = 1;

// 생선 움직이는 티커
let Istutorial = true;        

// 물고기 속도
// let fish_time = 1.3;        // 1.3초
let fish_time = [1.2, 1.19, 1.18, 1.17, 1.16, 1.15, 1.14, 1.13, 1.12, 1.11, 1.1, 1.09, 1.08, 1.07, 1.06, 1.05, 1.04, 1.03, 1.02, 1.01, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];        // 1.3초
// 물고기 등장시간
let fish_duration = 0.5;        // 0.5초

// 실행 수
let loop_len = 0

//튜토리얼 성공 회수
let success_count = 0
let practice_ani_index = 0 //연습게임 에니메이션 인덱스

// fist type/ 표적 물고기 = 0, 비표적A 물고기 = 1, 비표적B 물고기 = 2 
let fish_type = 0

// 문제들 (1표적 0 비표적 -> 1이면 노란물고기 0이면 빨간 물고기)
// 1 : 표적, 0 : 비표적a, 2 : 비표적 b
// ooooxa - oxb - ooxa - ooooxb - oooxb - xa (o:표적, xa: 비표적 A, xb: 비표적 B)
// 11110 - 12   - 110  - 11112  - 1112  - 0
// oooxb - ooxa - ooxb (o:표적, xa: 비표적 A, xb: 비표적 B)
// 1112  - 110  - 112
let quest_list = [1,1,1,1,0,1,2,1,1,0,1,1,1,1,2,1,1,1,2,0,1,1,1,2,1,1,0,1,1,2]
let questIndex = 0

//튜토리얼 실패시
let tutorial_fail = false

var Fish_ticker;            // Tutorial ticker
let Target_ticker;             // Targer 노랑물고기 ticker
let NonTargetA_ticker;        // 비표적a 노랑물고기 ticker
let NonTargetB_ticker;        // 비표적b 빨강물고기 ticker

let total_round = 0;
var fail_count = 0;                     // 연속 2번 틀릴 시 게임 END

let test = []

var canvas ;
var width = 0;
var height = 0;
var scale = width/1920; 

// 데이터모음
// phoneNum : 01000000000               
// name : TEST
// taskId : 0                       
// gngNumOfCorrTar : 15
// gngNumOfCorrNonTar : 5
// gngNumOfWrongTar : 0
// gngNumOfWrongNonTar : 0
// gngNumOfAnticipantResponseNonTar : 0
// gngNumOfAnticipantResponseTar : 0
// gngMaxCnsctvSuccessCount : 20
// gngResponseTimeList : [{"isTarget": true, "isCorrect": true, "responseTime": 0.4350000321865082}, {"isTarget": true, "isCorrect": true, "responseTime": 0.43400001525878906}, {"isTarget": true, "isCorrect": true, "responseTime": 0.4680000245571137}, {"isTarget": true, "isCorrect": true, "responseTime": 0.5010000467300415}, {"isTarget": true, "isCorrect": true, "responseTime": 0.4670000076293946}, {"isTarget": false, "isCorrect": true, "responseTime": -1}, {"isTarget": true, "isCorrect": true, "responseTime": 0.5020000338554382}, {"isTarget": true, "isCorrect": true, "responseTime": 0.4020000100135803}, {"isTarget": true, "isCorrect": true, "responseTime": 0.3680000305175781}, {"isTarget": false, "isCorrect": true, "responseTime": -1}, {"isTarget": true, "isCorrect": true, "responseTime": 0.5010000467300415}, {"isTarget": false, "isCorrect": true, "responseTime": -1}, {"isTarget": true, "isCorrect": true, "responseTime": 0.534000039100647}, {"isTarget": true, "isCorrect": true, "responseTime": 0.5670000314712524}, {"isTarget": false, "isCorrect": true, "responseTime": -1}, {"isTarget": true, "isCorrect": true, "responseTime": 0.5020000338554382}, {"isTarget": true, "isCorrect": true, "responseTime": 0.4350000321865082}, {"isTarget": true, "isCorrect": true, "responseTime": 0.4680000245571137}, {"isTarget": true, "isCorrect": true, "responseTime": 0.4010000228881836}, {"isTarget": false, "isCorrect": true, "responseTime": -1}]
// gngPerformanceTime : 120.019
// logdate : 2022-01-27 17:20:53.740

var start_time,end_time;
var gngPerformanceTime;

var round_start_time, round_end_time;
var round_total_time;

var EX_gngMaxCnsctvSuccessCount = 0
var gngNumOfCorrTar = 0; 
var gngNumOfCorrNonTar = 0; 
var gngNumOfWrongTar = 0; 
var gngNumOfWrongNonTar = 0;
var gngNumOfCorrNonTarB = 0;
var gngNumOfWrongNonTarB = 0;
var gngNumOfAnticipantResponseNonTar = 0; 
var gngNumOfAnticipantResponseTar = 0; 
var gngMaxCnsctvSuccessCount = 0;
var gngResponseTimeList = [];

// URLSearchParams 객체
var url = new URL(window.location.href);
const urlParams = url.searchParams;
console.log("urlParams : ", urlParams);

// URLSearchParams.get()
const uuid =    urlParams.get('uuid');
console.log("uuid : ", uuid);

$(function () {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent)

    canvas = document.getElementById('mycanvas')
    const container = document.getElementById('container')
    width = 0;
    height = 0;
    scale = width/1920; 
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
        .add('common_start',      '/ticto/spine/WISC/common/Spine/Start.json')
        .add('common_OXE',        '/ticto/spine/WISC/common/Spine/OXEffect.json')
        .add('common_handclick',  '/ticto/spine/WISC/common/Spine/HandClickEffect.json')
        .add('gonogo_bg',         '/ticto/spine/GoNoGo/Bg/GameBg1.json')
        .add('gonogo_tutorial',   '/ticto/spine/GoNoGo/Tutorial/GoNoGoTutorial.json')
        .add('gonogo_effect',     '/ticto/spine/GoNoGo/Effect/Game1Effect.json')
        .add('gonogo_start',      '/ticto/spine/GoNoGo/CommonEffect/Start.json')
        .add('gonogo_fish',       '/ticto/spine/GoNoGo/Fish/Fish.json')
        .add('gonogo_rucro',      '/ticto/spine/GoNoGo/CommonEffect/RuCroEffect.json')
        .add('common_heart',      '/ticto/spine/WISC/common/Spine/UIHeart.json')
        .add('practicemode',      '/ticto/spine/PracticeMode/UIPracticeSpine/UIPractice.json')

        .add('grey_scale',        '/ticto/grey_scale.png')
        .add('UIPlayBtn',         '/ticto/UIPlayBtn.png')
        .add('UIBox_01',          '/ticto/spine/WISC/common/UIBox_02.png')
        // .add('UIPause',           'spine/WISC/common/UIPause.png')
        .add('UISound',           '/ticto/spine/WISC/common/UISound.png')
        .add('UIPracticeMode',    '/ticto/spine/PracticeMode/UIPracticeMode.png')

        .add('Touch_StartMusic',  '/ticto/sound/bgm/1Touch_StartMusic.wav')
        .add('Gonogo_StartMusic', '/ticto/sound/bgm/2Gonogo_StartMusic.wav')
        .add('Gonogo_Fishing',    '/ticto/sound/etc/Gonogo_Fishing.wav')
        .add('Game_Count01',      '/ticto/sound/etc/Game_Count01.mp3')
        .add('Game_Count02',      '/ticto/sound/etc/Game_Count02.mp3')
        .add('Game_Right',        '/ticto/sound/interactive/Game_Right.wav')
        .add('Game_Wrong',        '/ticto/sound/interactive/Game_Wrong.wav')


        .add('story_2',            '/ticto/sound/Story/2_YouSaveMe.mp3')
        .add('story_3',            '/ticto/sound/Story/3_ImZzakkak.mp3')
        .add('story_4',            '/ticto/sound/Story/4_ImRuddy.mp3')
        .add('story_5',            '/ticto/sound/Story/5_SpaceTravel.mp3')
        .add('story_6',            '/ticto/sound/Story/6_WhatShallWeDo.mp3')
        .add('story_7',            '/ticto/sound/Story/7_IWillHelpYou.mp3')

        .add('game_01',            '/ticto/sound/Gonogo/0Gonogo_ForHungryRuddy.mp3')
        .add('game_02',            '/ticto/sound/Gonogo/1Gonogo_YellowFishGoTry.mp3')
        .add('game_03',            '/ticto/sound/Gonogo/2Gonogo_DontEatRedFish.mp3')
        .add('game_04',            '/ticto/sound/Gonogo/3Gonogo_DontTouchRedFish.mp3')
        .add('game_05',            '/ticto/sound/Gonogo/4Gonogo_TryMoreFish.mp3')

        .add('Gonogo_Catchstrape',            '/ticto/sound/Gonogo/Gonogo_Catchstrape.mp3')
        .add('Gonogo_DonteatOthers',            '/ticto/sound/Gonogo/Gonogo_DonteatOthers.mp3')
        .add('Gonogo_TouchFast',            '/ticto/sound/Gonogo/Gonogo_TouchFast.mp3')
        .add('Gonogo_DonTouchOthers',            '/ticto/sound/Gonogo/Gonogo_DonTouchOthers.mp3')
        
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
        
        .add('Gonogo_ForHungryRuddy',        '/ticto/sound/Gonogo/0Gonogo_ForHungryRuddy.mp3')
        .add('Hungry',        '/ticto/sound/cutscene/Hungry.wav')
        .add('SlideUp',        '/ticto/sound/cutscene/SlideUp.wav')
        .load(onAssetsLoaded);
 



    app.stage.interactive = true;
    app.stage.buttonMode = true;
    app.stage.sortableChildren = true;

    function onAssetsLoaded(loader, res) {
        $("#loading").hide();
        $("#container").show();

        let bgm = PIXI.sound.Sound.from(res.Gonogo_StartMusic);
        let bgm1 = PIXI.sound.Sound.from(res.Touch_StartMusic);

        let story_2 = PIXI.sound.Sound.from(res.story_2);
        let story_3 = PIXI.sound.Sound.from(res.story_3);
        let story_4 = PIXI.sound.Sound.from(res.story_4);
        let story_5 = PIXI.sound.Sound.from(res.story_5);
        let story_6 = PIXI.sound.Sound.from(res.story_6);
        let story_7 = PIXI.sound.Sound.from(res.story_7);

        let game_01 = PIXI.sound.Sound.from(res.game_01);
        let game_02 = PIXI.sound.Sound.from(res.game_02);
        let game_03 = PIXI.sound.Sound.from(res.game_03);
        let game_04 = PIXI.sound.Sound.from(res.game_04);
        let game_05 = PIXI.sound.Sound.from(res.game_05);

        let Gonogo_Catchstrape = PIXI.sound.Sound.from(res.Gonogo_Catchstrape);
        let Gonogo_DonteatOthers = PIXI.sound.Sound.from(res.Gonogo_DonteatOthers);
        let Gonogo_TouchFast = PIXI.sound.Sound.from(res.Gonogo_TouchFast);
        let Gonogo_DonTouchOthers = PIXI.sound.Sound.from(res.Gonogo_DonTouchOthers);

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

        let Gonogo_Fishing = PIXI.sound.Sound.from(res.Gonogo_Fishing);
        let Game_Right = PIXI.sound.Sound.from(res.Game_Right);
        let Game_Wrong = PIXI.sound.Sound.from(res.Game_Wrong);
        let Game_Count01 = PIXI.sound.Sound.from(res.Game_Count01);
        let Game_Count02 = PIXI.sound.Sound.from(res.Game_Count02);

        let Hungry = PIXI.sound.Sound.from(res.Hungry);
        let SlideUp = PIXI.sound.Sound.from(res.SlideUp);

        let Gonogo_ForHungryRuddy = PIXI.sound.Sound.from(res.Gonogo_ForHungryRuddy);

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

        let common_heart3 = new PIXI.spine.Spine(res.common_heart.spineData);
        common_heart3.x = width * 0.15;
        common_heart3.y = height * 0.19;
        common_heart3.zIndex = 100;
        common_heart3.scale.set(scale * 0.6);

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

        let practice03 = new PIXI.spine.Spine(res.practicemode.spineData);
        practice03.x = width * 0.205;
        practice03.y = height * 0.19;
        practice03.zIndex = 100;
        practice03.scale.set(scale*0.85);

        let practice04 = new PIXI.spine.Spine(res.practicemode.spineData);
        practice04.x = width * 0.24;
        practice04.y = height * 0.19;
        practice04.zIndex = 100;
        practice04.scale.set(scale*0.85);

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

        


        let UIBox_text = new PIXI.Text("줄무늬 물고기가 나오면 화면을 빨리 눌러요!",{
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
        

        //fish
        let fish = new PIXI.spine.Spine(res.gonogo_fish.spineData);

        fish.x = width*2;
        fish.y = height*2;
        fish.scale.set(scale * 0.8);


        //본게임 노랑물고기
        let fish_target = new PIXI.spine.Spine(res.gonogo_fish.spineData);

        fish_target.x = width*2;
        fish_target.y = height*2;
        fish_target.scale.set(scale * 0.8);

            //본게임 탈락1 물고기
        let fish_Nontarget1 = new PIXI.spine.Spine(res.gonogo_fish.spineData);

        fish_Nontarget1.x = width*2;
        fish_Nontarget1.y = height*2;
        fish_Nontarget1.scale.set(scale * 0.8);

        //본게임 탈락2 물고기
        let fish_Nontarget2 = new PIXI.spine.Spine(res.gonogo_fish.spineData);

        fish_Nontarget2.x = width*2;
        fish_Nontarget2.y = height*2;
        fish_Nontarget2.scale.set(scale * 0.8);
        // fish_Nontarget2.state.setAnimation(0,'Fish3_Idle', true,0);
        
        let tutorial = new PIXI.spine.Spine(res.gonogo_tutorial.spineData);

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
                    app.stage.removeChild(grayscale);
                    app.stage.removeChild(UIPlayBtn);
                    game_start()
                }
            });
        }, 50);


        function game_start(){
            $('#mycanvas').unbind('pointerdown');
            bgm1.play({
                loop : true
            });
            let take01 = tutorial.state.addAnimation(0, 'Take_01', false);
            
            let take01_time = take01.animationEnd;

            tutorial.state.addListener({
                event: function (track, event) {
                    console.log("Event on track " + track.trackIndex + ": ");
                    console.log(event.stringValue);
                    if(event.stringValue == "2"){
                        story_2.play({
                            volume : 15
                        });
                    } else if(event.stringValue == "3"){
                        story_3.play({
                            volume : 15
                        });
                    } else if(event.stringValue == "4"){
                        story_4.play({
                            volume : 15
                        });
                    } else if(event.stringValue == "5"){
                        story_5.play({
                            volume : 15
                        });
                    } else if(event.stringValue == "6"){
                        story_6.play({
                            volume : 15
                        });
                    } else if(event.stringValue == "7"){
                        story_7.play({
                            volume : 15
                        });
                    } else if(event.stringValue == "Hungry"){
                        // console.log("CrockJump");
                        Hungry.play()
                    } else if(event.stringValue == "SlideUp"){
                        // console.log("CrockJump");
                        SlideUp.play()
                    } 
                }
            });

            setTimeout(() => {
                bgm1.stop();
                bgm.play({
                    loop : true
                });

                app.stage.removeChild(tutorial)
                
                

                //background
                let background = new PIXI.spine.Spine(res.gonogo_bg.spineData);

                background.x = width/2
                background.y = height/2
                background.scale.set(scale);
                app.stage.addChild(background);

                background.state.addAnimation(0, 'Idle', true, 0);
                app.stage.addChild(grayscale);

                game_01.play({
                    volume : 15,
                    complete : function(){
                        game_start01();
                    }
                });
            }, take01_time * 1000);
        }

        function game_start01(){
            // fish click int
            let movefish_click = new PIXI.spine.Spine(res.gonogo_tutorial.spineData);

            movefish_click.x = width/2
            movefish_click.y = height/2
            movefish_click.scale.set(scale);
            app.stage.addChild(movefish_click);

            let click = movefish_click.state.addAnimation(0, 'Click', false, 0);
            let click_time = click.animationEnd 
            // game_02.play({
            //     volume : 15
            // });

            movefish_click.state.addListener({
                event: function (track, event) {
                    console.log("Event on track " + track.trackIndex + ": ");
                    console.log(event.stringValue);
                    if(event.stringValue == "Gonogo_Catchstrape"){
                        Gonogo_Catchstrape.play({
                            volume : 15
                        });
                    } else if(event.stringValue == "Gonogo_DonteatOthers"){
                        Gonogo_DonteatOthers.play({
                            volume : 15
                        });
                    } else if(event.stringValue == "Gonogo_TouchFast"){
                        Gonogo_TouchFast.play({
                            volume : 15
                        });
                    } else if(event.stringValue == "Gonogo_DonTouchOthers"){
                        Gonogo_DonTouchOthers.play({
                            volume : 15
                        });
                    } 
                }
            });
            
            setTimeout(() => {
                

                blue_btn_click();
                // fishticker();
                TargetTicker();
                NonTarget1_Ticker();
                NonTarget2_Ticker();
            }, click_time * 1000);
        }

        let position = 0
            
        // START BTN
        function blue_btn_click(){
            fish_target.state.clearTracks();
            fish_Nontarget1.state.clearTracks();
            fish_Nontarget2.state.clearTracks();

            let start = new PIXI.spine.Spine(res.common_start.spineData);
            start.x = width/2
            start.y = height/2 
            start.scale.set(scale);

            // 튜토리얼에는 파랑버튼
            if(Istutorial){
                app.stage.addChild(start);

                let blue_btn = start.state.addAnimation(2, 'Ready2', true, 0);

                console.log("tutorial start")
                app.stage.addChild(practice01)
                app.stage.addChild(practice02)
                app.stage.addChild(practice03)
                app.stage.addChild(practice04)
                app.stage.addChild(practice_text)
                app.stage.addChild(UIPracticeMode)

                practice01.state.addAnimation(practice_ani_index, 'Appear', false);
                practice02.state.addAnimation(practice_ani_index, 'Appear', false);
                practice03.state.addAnimation(practice_ani_index, 'Appear', false);
                practice04.state.addAnimation(practice_ani_index, 'Appear', false);
                practice_ani_index +=1
                

                app.stage.addChild(UIBox_01)
                app.stage.addChild(UIBox_text)
                // app.stage.addChild(UIPause)
                app.stage.addChild(UISound)

                bluebtn_sound.play({
                    volume : 15,
                    complete : function(){
                        btn_click();
                    }
                })

            // 본게임에는 빨강버튼
            }else{
                UIBox_text.text = '줄무늬 물고기가 나오면 화면을 빨리 눌러요!'
                // game_05.play({
                    // volume : 15,

                    // complete : function(){
                        app.stage.addChild(start);
                        // 본게임은 빨강버튼
                        let blue_btn = start.state.addAnimation(2, 'Ready', true, 0);
                        redbtn_sound.play({
                            volume : 15,
                            complete : function(){
                                btn_click();
                            }
                        })
                    // }
                // })
            }
            
            // 파랑, 빨강버튼 클릭
            function btn_click(){
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

                    if(start.x + 206.5*scale*1 > x && start.x - 206.5*scale*1< x && start.y+ 160 * scale*2> y && start.y - 160 * scale*0.3 < y){
                        $('#mycanvas').unbind('pointerdown');
                        app.stage.removeChild(start)

                        let start_count = new PIXI.spine.Spine(res.common_start.spineData);

                        start_count.x = width/2
                        start_count.y = height/2 
                        start_count.scale.set(scale);
                        app.stage.addChild(start_count);

                        let count = start_count.state.addAnimation(7, 'Count_01', false, 0);
                        let count_time = count.animationEnd
        
                        Game_Count01.play();

                        start_count.state.addAnimation(7, 'Count_02', false, 0);
                        start_count.state.addAnimation(7, 'Count_03', false, 0);
                        start_count.state.addAnimation(7, 'Count_04', false, 0);

                        // Start Count Sound Play
                        var start_sound_cnt = 0;
                        start_count.state.addListener({
                            start: function (track, event) {
                                if(start_sound_cnt == 2){
                                    Game_Count02.play();
                                }else {
                                    Game_Count01.play();
                                }
                                start_sound_cnt++;
                            }
                        });

                        setTimeout(() => {
                            console.log("BLUE END!!!");
                            app.stage.removeChild(grayscale);

                            if(!Istutorial){
                                // DATA : 전체 게임 시간 체크 시작!!!!
                                start_time = new Date();
                            }

                            setTimeout(() => {
                                if(Istutorial){
                                    // 튜토리얼 게임 시작
                                    fishtickerStart()
                                }else{
                                    // 본 게임 시작
                                    fishtickerStart_NT()
                                }
                            }, fish_duration*1000);
                            
                            

                        }, (count_time*4)*1000);
                    }

                })
            }
        }

        
        let fish_ani_index = 0

        // 튜토리얼 시작
        function fishtickerStart(){
            position = 0;
            console.log("fishtickerStart : ", fish_type);

            $('#mycanvas').unbind('pointerdown')
    
            fish_ani_index += 1
            if(fish_type == 0 && success_count == 0){
                practice01.state.addAnimation(practice_ani_index, 'Appear', false);
                practice02.state.addAnimation(practice_ani_index, 'Appear', false);
                practice03.state.addAnimation(practice_ani_index, 'Appear', false);
                practice04.state.addAnimation(practice_ani_index, 'Appear', false);

                fish_target.state.addAnimation(fish_ani_index,'Fish1_Idle', true,0);
                Target_ticker.start();
            }else if(fish_type == 0 && success_count != 0){
                fish_target.state.addAnimation(fish_ani_index,'Fish1_Idle', true,0);
                Target_ticker.start();
            }else if(fish_type == 1){
                fish_Nontarget1.state.addAnimation(fish_ani_index,'Fish2_Idle', true,0);
                NonTargetA_ticker.start();        
            }else if(fish_type == 2){
                fish_Nontarget2.state.addAnimation(fish_ani_index,'Fish3_Idle', true,0);
                NonTargetB_ticker.start();        
            }
            fishClickNonClick()
        }

        // 튜토리얼 게임플레이
        function fishClickNonClick(){
            console.log("fishClickNonClick");
            loop_len += 1;
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
                if(UISound.x + UISound.width > x && UISound.x < x && UISound.y + UISound.height > y && UISound.y < y){
                    console.log("SOUND BTN!");
                    if(fish_type == 0){
                        game_02.stop();
                        game_02.play({volume : 15});
                    } else if(fish_type == 1){
                        game_03.stop();
                        game_03.play({volume : 15});
                    }
                    
                } else {
                    console.log("!! 클릭 !!");
                    $('#mycanvas').unbind('pointerdown');
                    Gonogo_Fishing.play();
                    fish_ani_index += 1;

                    if(fish_type == 0){
                        console.log("타겟 클릭");
                        Target_ticker.stop();
                        let Fish1_Click = fish_target.state.addAnimation(fish_ani_index, 'Fish1_Click', false, 0);
                        let fish_click_time = Fish1_Click.animationEnd
                        setTimeout(() => {

                            let effect = new PIXI.spine.Spine(res.gonogo_effect.spineData);
                            effect.x = width* 0.3
                            effect.y = height * 0.5
                            effect.scale.set(scale * 0.8);
                            
                            app.stage.addChild(effect);
                            Game_Right.play();

                            let Fish1_Success = effect.state.addAnimation(3, 'Fish1_Success', false)
                            let Fish1_Success_time = Fish1_Success.animationEnd
        
                            setTimeout(() => {
                                app.stage.removeChild(effect)
                                success_count += 1
                                practice_ani_index +=1 

                                console.log(success_count)
                                if(success_count == 1){
                                    practice04.state.addAnimation(practice_ani_index, 'Clear', false);
                                }else if(success_count == 2){
                                    practice03.state.addAnimation(practice_ani_index, 'Clear', false);
                                }else if(success_count == 3){
                                    practice02.state.addAnimation(practice_ani_index, 'Clear', false);
                                }else if(success_count == 4){
                                    practice01.state.addAnimation(practice_ani_index, 'Clear', false);
                                }

                                setTimeout(() => {
                                    fish_target.y = height * 2;
                                    fish_target.x = width * 2;
                                    console.log(fish_target.x, fish_target.y)
                                    if(success_count >= 4){
                                        GreatGoodFail();
                                    }else{
                                        fish_type = 1;
                                        fishtickerStart()
                                    }
                                }, (fish_duration) * 1000)

                            }, (Fish1_Success_time) * 1000)
                            
                        }, fish_click_time *1000);
                    } else if(fish_type == 1){
                        console.log("논타겟 A 클릭");
                        NonTargetA_ticker.stop();
                        let Fish2_Click = fish_Nontarget1.state.addAnimation(fish_ani_index, 'Fish2_Click', false, 0);
                        let fish_click_time = Fish2_Click.animationEnd
                        setTimeout(() => {

                            let effect = new PIXI.spine.Spine(res.gonogo_effect.spineData);
                            effect.x = width* 0.3
                            effect.y = height * 0.5
                            effect.scale.set(scale * 0.8);
                            
                            app.stage.addChild(effect);
                            Game_Wrong.play();

                            let Fish2_Fail = effect.state.addAnimation(3, 'Fish2_Fail', false)
                            let Fish2_Fail_time = Fish2_Fail.animationEnd
        
                            setTimeout(() => {
                                app.stage.removeChild(effect)

                                practice_ani_index +=1 
                                setTimeout(() => {
                                    fish_Nontarget1.y = height * 2;
                                    fish_Nontarget1.x = width * 2;
                                    tutorial_fail = true;
                                    GreatGoodFail();
                                    // fishtickerStart()
                                }, (fish_duration) * 1000)

                            }, (Fish2_Fail_time) * 1000)
                            
                        }, fish_click_time *1000);
                    }  else if(fish_type == 2){
                        console.log("논타겟 B 클릭");
                        NonTargetB_ticker.stop();
                        let Fish3_Click = fish_Nontarget2.state.addAnimation(fish_ani_index, 'Fish3_Click', false, 0);
                        let fish_click_time = Fish3_Click.animationEnd
                        setTimeout(() => {

                            let effect = new PIXI.spine.Spine(res.gonogo_effect.spineData);
                            effect.x = width* 0.3
                            effect.y = height * 0.5
                            effect.scale.set(scale * 0.8);
                            
                            app.stage.addChild(effect);
                            Game_Wrong.play();

                            let Fish3_Fail = effect.state.addAnimation(3, 'Fish3_Fail', false)
                            let Fish3_Fail_time = Fish3_Fail.animationEnd
        
                            setTimeout(() => {
                                app.stage.removeChild(effect)

                                practice_ani_index +=1 
                                setTimeout(() => {
                                    fish_Nontarget2.y = height * 2;
                                    fish_Nontarget2.x = width * 2;
                                    tutorial_fail = true;
                                    GreatGoodFail()
                                }, (fish_duration) * 1000)

                            }, (Fish3_Fail_time) * 1000)
                            
                        }, fish_click_time *1000);
                    }
                }
                
            })
        }
        
        // TUTORIAL에만 들어옴 - 결과 (루디, 째깍이 리액션)
        function GreatGoodFail(type){
            console.log("GreatGoodFail")
            const randomNum = Math.floor(Math.random() * 3 + 1);

            app.stage.addChild(grayscale);
            let rucro = new PIXI.spine.Spine(res.gonogo_rucro.spineData);

            rucro.x = width * 0.5
            rucro.y = height * 0.5
            rucro.scale.set(scale);
            app.stage.addChild(rucro);

            // 튜토리얼 한번에 완료! GREAT!!
            if(loop_len == 4 && tutorial_fail == false){
                let Great = rucro.state.addAnimation(4, 'Great', false, 0)
                let Great_time = Great.animationEnd
                if(randomNum == 1){
                    Great_01.play({volume : 15});
                } else if(randomNum == 2){
                    Great_02.play({volume : 15});
                } else if(randomNum == 3){
                    Great_03.play({volume : 15});
                }
                success_count = 0

                setTimeout(() => {
                    app.stage.removeChild(rucro);
                    // 튜토리얼 종료! 빨강 물고기도 끝!!
                    app.stage.removeChild(practice01)
                    app.stage.removeChild(practice02)
                    app.stage.removeChild(practice03)
                    app.stage.removeChild(practice04)
                    app.stage.removeChild(practice_text)
                    app.stage.removeChild(UIPracticeMode)

                    // heart animation
                    common_heart1.state.addAnimation(0, 'Full', false);
                    common_heart2.state.addAnimation(0, 'Full', false);
                    common_heart3.state.addAnimation(0, 'Full', false);

                    app.stage.addChild(common_heart1);
                    app.stage.addChild(common_heart2);
                    app.stage.addChild(common_heart3);

                    Istutorial = false
                    blue_btn_click();
                }, Great_time*1000);

            // 튜토리얼 몇번 틀리고 완료! GOOD!!
            }else if(loop_len > 4 && tutorial_fail == false){
                if(randomNum == 1){
                    Good_01.play({volume : 15});
                } else if(randomNum == 2){
                    Good_02.play({volume : 15});
                } else if(randomNum == 3){
                    Good_03.play({volume : 15});
                }
                let Good = rucro.state.addAnimation(4, 'Good', false, 0)
                let Good_time = Good.animationEnd

                success_count = 0

                setTimeout(() => {
                    app.stage.removeChild(rucro);
                    
                    app.stage.removeChild(practice01);
                    app.stage.removeChild(practice02);
                    app.stage.removeChild(practice03);
                    app.stage.removeChild(practice04);
                    app.stage.removeChild(practice_text);
                    app.stage.removeChild(UIPracticeMode);

                    // heart animation
                    common_heart1.state.addAnimation(0, 'Full', false);
                    common_heart2.state.addAnimation(0, 'Full', false);
                    common_heart3.state.addAnimation(0, 'Full', false);
                    app.stage.addChild(common_heart1);
                    app.stage.addChild(common_heart2);
                    app.stage.addChild(common_heart3);

                    Istutorial = false
                    blue_btn_click();
                }, Good_time*1000);

            // 튜토리얼 틀림!!!!
            }else if(tutorial_fail == true){
                success_count = 0;
                fish_type = 0;

                if(randomNum == 1){
                    Retry_01.play({volume : 15});
                } else if(randomNum == 2){
                    Retry_02.play({volume : 15});
                } else if(randomNum == 3){
                    Retry_03.play({volume : 15});
                }

                let Fail = rucro.state.addAnimation(4, 'Fail', false, 0)
                let Fail_time = Fail.animationEnd;

                tutorial_fail = false;
                setTimeout(() => {
                    app.stage.removeChild(rucro);
                    app.stage.removeChild(grayscale);
                    fishtickerStart();
                }, Fail_time*1000);
            }
        }


        // 애니메이션 인덱스 변경해줘야함!
        let fish_ani_index_NT1 = 0
        let fish_ani_index_NT0 = 0
        let fish_ani_index_NT2 = 0
        
        // 노랑 물고기 Ticker + Fail(안누르면 Fail이니깐)
        function TargetTicker(){
            
            Target_ticker = new PIXI.Ticker
            Target_ticker.autoStart = false;

            app.stage.addChild(fish_target)

            app.animationUpdateNT1= function () {

                if(position == 0){
                    round_start_time = new Date();
                    console.log(fish_time[questIndex])
                }
                fish_target.y = height * 0.5;
                position += 1;
                fish_target.x = 0;
                
                let set_time = fish_time[questIndex] * 1000 / 16.6;
                if (position < set_time) {
                    fish_target.x += (width + (fish.width * scale/2)) / set_time*position;
                } else {
                    // 시간 지났는데, 안누름 -- 실패!!

                    $('#mycanvas').unbind('pointerdown')
                    position = 0;
                    fish_target.y = height * 2
                    fish_target.x = width * 2
                    Target_ticker.stop();

                    let effect = new PIXI.spine.Spine(res.gonogo_effect.spineData);
                    effect.x = width* 0.3
                    effect.y = height * 0.5
                    effect.scale.set(scale * 0.8);

                    app.stage.addChild(effect);
                    
                    Game_Wrong.play();

                    let Fish1_Fail = effect.state.addAnimation(3, 'Fish1_Fail', false)
                    let Fish1_Fail_time = Fish1_Fail.animationEnd

                    if(Istutorial){
                        console.log("튜토리얼 - 타겟 실패");

                        setTimeout(() => {
                            app.stage.removeChild(effect)

                            practice_ani_index +=1 
                            setTimeout(() => {
                                fish_target.y = height * 2;
                                fish_target.x = width * 2;
                                tutorial_fail = true;
                                GreatGoodFail()
                            }, (fish_duration) * 1000)

                        }, (Fish1_Fail_time) * 1000)

                    }else{
                        // DATA 처리
                        round_end_time =  new Date();
                        round_total_time = -1;
                        console.log("본 - 타겟 실패", round_total_time);
                        gngNumOfWrongTar += 1;

                        // 현재 연속점수가 이전 연속점수보다 크거나 같으면 저장!
                        if(gngMaxCnsctvSuccessCount >= EX_gngMaxCnsctvSuccessCount){
                            EX_gngMaxCnsctvSuccessCount = gngMaxCnsctvSuccessCount;
                        }
                        gngMaxCnsctvSuccessCount = 0;

                        // gngResponseTimeList : [{"isTarget": true, "isCorrect": true, "responseTime": 0.4350000321865082},
                        gngResponseTimeList.push({"isTarget": true, "isCorrect": false, "responseTime": round_total_time});

                        questIndex += 1;
                        fail_count += 1;
                        if(fail_count == 1){
                            common_heart3.state.setAnimation(0, 'Full2Empty', false);
        
                            common_heart1.state.addAnimation(0, 'Full', true);
                            common_heart2.state.addAnimation(0, 'Full', true);
                            common_heart3.state.addAnimation(0, 'Empty', true);
        
                        }else if(fail_count == 2){
        
                            common_heart2.state.setAnimation(0, 'Full2Empty', false);
        
                            common_heart1.state.addAnimation(0, 'Full', true);
                            common_heart2.state.addAnimation(0, 'Empty', true);
                            common_heart3.state.addAnimation(0, 'Empty', true);

                        }else if(fail_count == 3){
        
                            common_heart1.state.setAnimation(0, 'Full2Empty', false);
        
                            common_heart1.state.addAnimation(0, 'Empty', true);
                            common_heart2.state.addAnimation(0, 'Empty', true);
                            common_heart3.state.addAnimation(0, 'Empty', true);
                        }

                        setTimeout(() => {
                            app.stage.removeChild(effect)
                            // app.stage.removeChild(fish)
                            setTimeout(() => {
                                fishtickerStart_NT()
                            }, (fish_duration) * 1000)
    
                        }, (Fish1_Fail_time) * 1000)
                    }
                }
            }
            Target_ticker.add(app.animationUpdateNT1);
        }



        // 논타겟 A 물고기 Ticker + Success (안누르면 Success니까)
        function NonTarget1_Ticker(){
            NonTargetA_ticker = new PIXI.Ticker
            NonTargetA_ticker.autoStart = false;
           
            app.stage.addChild(fish_Nontarget1)

            app.animationUpdateNT0= function () {
                if(position == 0){
                    round_start_time = new Date();
                    console.log(fish_time[questIndex])
                }
                fish_Nontarget1.y = height* 0.5
                position += 1;
                fish_Nontarget1.x = 0;
                
                let set_time = fish_time[questIndex] * 1000 / 16.6;
                if (position < set_time) {
                    fish_Nontarget1.x += (width + (fish.width * scale/2))/set_time*position;
                } else {
                    // 시간 지났는데, 안누름 -- 성공!
                    position = 0;
                    fish_Nontarget1.y = height * 2
                    fish_Nontarget1.x = width * 2
                    NonTargetA_ticker.stop();
         

                    let effect = new PIXI.spine.Spine(res.gonogo_effect.spineData);
                    effect.x = width* 0.3
                    effect.y = height * 0.5
                    effect.scale.set(scale * 0.8);

                    app.stage.addChild(effect);

                    $('#mycanvas').unbind('pointerdown')
                    Game_Right.play();

                    let Fish2_Success = effect.state.addAnimation(3, 'Fish2_Success', false)
                    let Fish2_Success_time = Fish2_Success.animationEnd

                    // DATA 처리
                    if(Istutorial){
                        // 튜토리얼
                        console.log("튜토리얼 - 논타겟 A 성공");
                        setTimeout(() => {
                            app.stage.removeChild(effect)
                            success_count += 1
                            if(success_count==1){
                                practice04.state.addAnimation(practice_ani_index, 'Clear', false);
                            }else if(success_count == 2){
                                practice03.state.addAnimation(practice_ani_index, 'Clear', false);
                            }else if(success_count == 3){
                                practice02.state.addAnimation(practice_ani_index, 'Clear', false);
                            }else if(success_count == 4){
                                practice01.state.addAnimation(practice_ani_index, 'Clear', false);
                            }

                            practice_ani_index +=1 
                            setTimeout(() => {
                                fish_Nontarget1.y = height * 2;
                                fish_Nontarget1.x = width * 2;
                                if(success_count >= 4){
                                    GreatGoodFail();
                                }else{
                                    fish_type = 2;
                                    fishtickerStart()
                                }
                            }, (fish_duration) * 1000)
    
                        }, (Fish2_Success_time) * 1000)

                    } else {
                        round_end_time =  new Date();
                        round_total_time = -1;
                        console.log("본 - 논타겟 A 성공", round_total_time);

                        gngNumOfCorrNonTar += 1;
                        
                        // 현재 연속점수가 이전 연속점수보다 크거나 같으면 저장!
                        gngMaxCnsctvSuccessCount += 1;

                        // gngResponseTimeList : [{"isTarget": true, "isCorrect": true, "responseTime": 0.4350000321865082},
                        gngResponseTimeList.push({"isTarget": false, "isCorrect": true, "responseTime": round_total_time});

                        questIndex +=1;

                        if(fail_count != 0){
                            fail_count = 0;
                            common_heart1.state.setAnimation(0, 'EmptyToFull', false);
                            common_heart2.state.setAnimation(0, 'EmptyToFull', false);
                            common_heart3.state.setAnimation(0, 'EmptyToFull', false);
                            
                            common_heart1.state.addAnimation(0, 'Full', true);
                            common_heart2.state.addAnimation(0, 'Full', true);
                            common_heart3.state.addAnimation(0, 'Full', true);
                        }

                        setTimeout(() => {
                            app.stage.removeChild(effect)
    
    
                            setTimeout(() => {
                                fishtickerStart_NT()
                            }, (fish_duration) * 1000)
    
                        }, (Fish2_Success_time) * 1000)
                    }
                }
            }
            NonTargetA_ticker.add(app.animationUpdateNT0);
        }


        // 논타겟 B 물고기 Ticker + Success (안누르면 Success니까)
        function NonTarget2_Ticker(){
            
            NonTargetB_ticker = new PIXI.Ticker
            NonTargetB_ticker.autoStart = false;

            app.stage.addChild(fish_Nontarget2)
            
            app.animationUpdateNT2 = function () {
                if(position == 0){
                    round_start_time = new Date();
                    console.log(fish_time[questIndex])
                }
                fish_Nontarget2.y = height* 0.5
                position += 1;
                fish_Nontarget2.x = 0;
                
                let set_time = fish_time[questIndex] * 1000 / 16.6;
                if (position < set_time) {
                    fish_Nontarget2.x += (width + (fish.width * scale/2))/set_time*position;
                } else {
                    // 시간 지났는데, 안누름 -- 성공!
                    position = 0;
                    fish_Nontarget2.y = height * 2
                    fish_Nontarget2.x = width * 2
                    NonTargetB_ticker.stop();
         

                    let effect = new PIXI.spine.Spine(res.gonogo_effect.spineData);
                    effect.x = width* 0.3
                    effect.y = height * 0.5
                    effect.scale.set(scale * 0.8);

                    app.stage.addChild(effect);

                    $('#mycanvas').unbind('pointerdown')
                    Game_Right.play();

                    let Fish3_Success = effect.state.addAnimation(3, 'Fish3_Success', false)
                    let Fish3_Success_time = Fish3_Success.animationEnd

                    // DATA 처리
                    if(Istutorial){
                        // 튜토리얼
                        console.log("튜토리얼 - 논타겟 B 성공");

                        setTimeout(() => {
                            app.stage.removeChild(effect)
                            success_count += 1
                            if(success_count==1){
                                practice04.state.addAnimation(practice_ani_index, 'Clear', false);
                            }else if(success_count == 2){
                                practice03.state.addAnimation(practice_ani_index, 'Clear', false);
                            }else if(success_count == 3){
                                practice02.state.addAnimation(practice_ani_index, 'Clear', false);
                            }else if(success_count == 4){
                                practice01.state.addAnimation(practice_ani_index, 'Clear', false);
                            }

                            practice_ani_index +=1 
                            setTimeout(() => {
                                fish_Nontarget2.y = height * 2;
                                fish_Nontarget2.x = width * 2;
                                if(success_count >= 4){
                                    GreatGoodFail();
                                }else{
                                    fish_type = 0;
                                    fishtickerStart()
                                }
                            }, (fish_duration) * 1000)
    
                        }, (Fish3_Success_time) * 1000)

                    } else {
                        // 본게임
                        round_end_time =  new Date();
                        round_total_time = -1;
                        console.log("본 - 논타겟 B 성공", round_total_time);

                        gngNumOfCorrNonTar += 1;
                        gngNumOfCorrNonTarB += 1;
                        // 현재 연속점수가 이전 연속점수보다 크거나 같으면 저장!
                        gngMaxCnsctvSuccessCount += 1;

                        // gngResponseTimeList : [{"isTarget": true, "isCorrect": true, "responseTime": 0.4350000321865082},
                        gngResponseTimeList.push({"isTarget": false, "isCorrect": true, "responseTime": round_total_time});

                        questIndex +=1;

                        if(fail_count != 0){
                            fail_count = 0;
                            common_heart1.state.setAnimation(0, 'EmptyToFull', false);
                            common_heart2.state.setAnimation(0, 'EmptyToFull', false);
                            common_heart3.state.setAnimation(0, 'EmptyToFull', false);
                            
                            common_heart1.state.addAnimation(0, 'Full', true);
                            common_heart2.state.addAnimation(0, 'Full', true);
                            common_heart3.state.addAnimation(0, 'Full', true);
                        }

                        setTimeout(() => {
                            app.stage.removeChild(effect)
    
    
                            setTimeout(() => {
                                fishtickerStart_NT()
                            }, (fish_duration) * 1000)
    
                        }, (Fish3_Success_time) * 1000)
                    }
                }
                

                
            }
            

            NonTargetB_ticker.add(app.animationUpdateNT2);
        }
        
      

    
        // 본게임 물고기 등장하게 해줌
        function fishtickerStart_NT(){
            console.log("fishtickerStart_NT")
            
            // app.stage.addChild(fish_NT)
            console.log("fishtickerStart_NT ININININ!!!!!")
            $('#mycanvas').unbind('pointerdown')
            position = 0;
            console.log("questIndex", questIndex);
            if(fail_count < 3){
                if(quest_list[questIndex] == 1){
                    fish_ani_index_NT1 += 1
                    console.log("타겟물고기")
                    fish_target.state.setAnimation(fish_ani_index_NT1,'Fish1_Idle', true,0);
                    Target_ticker.start();
                    fishClickNonClickNT1()
                    
                }else if(quest_list[questIndex] == 0){
                    fish_ani_index_NT0 += 1
                    console.log("논타겟 a 물고기")
                    fish_Nontarget1.state.setAnimation(fish_ani_index_NT0,'Fish2_Idle', true,0);
                    NonTargetA_ticker.start();
                    fishClickNonClickNT0()
                
                } else if(quest_list[questIndex] == 2){
                    fish_ani_index_NT2 += 1
                    console.log("논타겟 b 물고기")
                    fish_Nontarget2.state.setAnimation(fish_ani_index_NT2,'Fish3_Idle', true,0);
                    NonTargetB_ticker.start();
                    fishClickNonClickNT2()
                
                } else if(questIndex > 29){
                    console.log("GAMEEND!!");
                    game_end();
                }
            } else {
                console.log("GAMEEND!!");
                game_end();
            }
        }




        // 본게임 - 노랑물고기 - 클릭 !! - 정답
        function fishClickNonClickNT1(){
            console.log("fishClickNonClickNT1");
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

                if(UISound.x + UISound.width > x && UISound.x < x && UISound.y + UISound.height > y && UISound.y < y){
                    console.log("SOUND BTN!");
                    game_05.stop();
                    game_05.play({volume : 15});
                } else {
                    $('#mycanvas').unbind('pointerdown');
                    Gonogo_Fishing.play();

                    // fish_NT.state.setEmptyAnimation(fish_ani_index_NT, 1)

                    fish_ani_index_NT1 +=1
                    questIndex +=1
            
                    // console.log("노랑물고기", quest_list[questIndex])
                    Target_ticker.stop();
                    let Fish1_Click = fish_target.state.addAnimation(fish_ani_index_NT1, 'Fish1_Click', false, 0);
                    let fish_click_time = Fish1_Click.animationEnd

                    // 시간 안에 클릭!! -- 성공!
                    // DATA 처리
                    round_end_time =  new Date();
                    round_total_time = round_end_time - round_start_time;
                    console.log("노랑 성공", round_total_time/1000);

                    if(round_total_time <151){
                        gngNumOfAnticipantResponseTar += 1;
                    }
    
                    gngNumOfCorrTar += 1;
                    
                    // 현재 연속점수가 이전 연속점수보다 크거나 같으면 저장!
                    gngMaxCnsctvSuccessCount += 1;

                    // gngResponseTimeList : [{"isTarget": true, "isCorrect": true, "responseTime": 0.4350000321865082},
                    gngResponseTimeList.push({"isTarget": true, "isCorrect": true, "responseTime": round_total_time/1000});
                    
                    setTimeout(() => {
                        // app.stage.removeChild(fish_NT)
                        let effect = new PIXI.spine.Spine(res.gonogo_effect.spineData);
                        effect.x = width* 0.3
                        effect.y = height * 0.5
                        effect.scale.set(scale * 0.8);
                        app.stage.addChild(effect);
                        Game_Right.play();

                        let Fish1_Success = effect.state.addAnimation(3, 'Fish1_Success', false)
                        let Fish1_Success_time = Fish1_Success.animationEnd
                        if(fail_count != 0){
                            fail_count = 0;
                            common_heart1.state.setAnimation(0, 'EmptyToFull', false);
                            common_heart2.state.setAnimation(0, 'EmptyToFull', false);
                            common_heart3.state.setAnimation(0, 'EmptyToFull', false);
                            
                            common_heart1.state.addAnimation(0, 'Full', true);
                            common_heart2.state.addAnimation(0, 'Full', true);
                            common_heart3.state.addAnimation(0, 'Full', true);
                        }

                        setTimeout(() => {
                            fish_target.y = height*2
                            fish_target.x = width*2
                            app.stage.removeChild(effect)
                            setTimeout(() => {
                                fishtickerStart_NT()
                            }, (fish_duration) * 1000)
                        }, (Fish1_Success_time) * 1000)
                    }, fish_click_time *1000);
                }
            })    
        }


        // 본게임 -논타겟 a 물고기 - 클릭 !! - 오답!!
        function fishClickNonClickNT0(){
            console.log("fishClickNonClickNT0");

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

                if(UISound.x + UISound.width > x && UISound.x < x && UISound.y + UISound.height > y && UISound.y < y){
                    console.log("SOUND BTN!");
                    game_05.stop();
                    game_05.play({volume : 15});
                } else {
                    $('#mycanvas').unbind('pointerdown');
                    Gonogo_Fishing.play();
                    // fish_NT.state.setEmptyAnimation(fish_ani_index_NT, 1)
                    questIndex +=1
                    
                    
                    fish_ani_index_NT0 +=1
                
                    NonTargetA_ticker.stop();
                    let Fish0_Click = fish_Nontarget1.state.addAnimation(fish_ani_index_NT0, 'Fish2_Click', false, 0);
                    let Fish0_Click_time = Fish0_Click.animationEnd;

                    // 시간 안에 클릭!! -- 실패!
                    // DATA 처리
                    round_end_time =  new Date();
                    round_total_time = round_end_time - round_start_time;
                    console.log("논타겟 a 실패", round_total_time/1000);
    
                    if(round_total_time <151){
                        gngNumOfAnticipantResponseNonTar += 1;
                    }

                    gngNumOfWrongNonTar += 1;
                    
                    // 현재 연속점수가 이전 연속점수보다 크거나 같으면 저장!
                    // 현재 연속점수가 이전 연속점수보다 크거나 같으면 저장!
                    if(gngMaxCnsctvSuccessCount >= EX_gngMaxCnsctvSuccessCount){
                        EX_gngMaxCnsctvSuccessCount = gngMaxCnsctvSuccessCount;
                    }
                    gngMaxCnsctvSuccessCount = 0;

                    // gngResponseTimeList : [{"isTarget": true, "isCorrect": true, "responseTime": 0.4350000321865082},
                    gngResponseTimeList.push({"isTarget": false, "isCorrect": false, "responseTime": round_total_time/1000});
                    

                    
                    setTimeout(() => {
                        // app.stage.removeChild(fish_NT)
                        let effect = new PIXI.spine.Spine(res.gonogo_effect.spineData);
                        effect.x = width* 0.3
                        effect.y = height * 0.5
                        effect.scale.set(scale * 0.8);
                        app.stage.addChild(effect);
                        Game_Wrong.play();

                        let Fish2_Fail = effect.state.addAnimation(3, 'Fish2_Fail', false)
                        let Fish2_Fail_time = Fish2_Fail.animationEnd
                        fail_count += 1;
                        if(fail_count == 1){
                            common_heart3.state.setAnimation(0, 'Full2Empty', false);
        
                            common_heart1.state.addAnimation(0, 'Full', true);
                            common_heart2.state.addAnimation(0, 'Full', true);
                            common_heart3.state.addAnimation(0, 'Empty', true);
        
                        }else if(fail_count == 2){
        
                            common_heart2.state.setAnimation(0, 'Full2Empty', false);
        
                            common_heart1.state.addAnimation(0, 'Full', true);
                            common_heart2.state.addAnimation(0, 'Empty', true);
                            common_heart3.state.addAnimation(0, 'Empty', true);

                        }else if(fail_count == 3){
        
                            common_heart1.state.setAnimation(0, 'Full2Empty', false);
        
                            common_heart1.state.addAnimation(0, 'Empty', true);
                            common_heart2.state.addAnimation(0, 'Empty', true);
                            common_heart3.state.addAnimation(0, 'Empty', true);
                        }
                        setTimeout(() => {
                            fish_Nontarget1.y = height*2
                            fish_Nontarget1.x = width*2
                            app.stage.removeChild(effect)
                            setTimeout(() => {
                                fishtickerStart_NT()
                            }, (fish_duration) * 1000)
                            
                        }, (Fish2_Fail_time) * 1000)


                    }, Fish0_Click_time *1000);
                }
            })
        }

        // 본게임 -논타겟 B 물고기 - 클릭 !! - 오답!!
        function fishClickNonClickNT2(){
            console.log("fishClickNonClickNT2");

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

                if(UISound.x + UISound.width > x && UISound.x < x && UISound.y + UISound.height > y && UISound.y < y){
                    console.log("SOUND BTN!");
                    game_05.stop();
                    game_05.play({volume : 15});
                } else {
                    $('#mycanvas').unbind('pointerdown');
                    Gonogo_Fishing.play();
                    // fish_NT.state.setEmptyAnimation(fish_ani_index_NT, 1)
                    questIndex +=1
                    
                    
                    fish_ani_index_NT2 +=1
                
                    NonTargetB_ticker.stop();
                    let Fish3_Click = fish_Nontarget2.state.addAnimation(fish_ani_index_NT2, 'Fish3_Click', false, 0);
                    let Fish3_Click_time = Fish3_Click.animationEnd;

                    // 시간 안에 클릭!! -- 실패!
                    // DATA 처리
                    round_end_time =  new Date();
                    round_total_time = round_end_time - round_start_time;
                    console.log("논타겟 b 실패", round_total_time/1000);
    
                    if(round_total_time <151){
                        gngNumOfAnticipantResponseNonTar += 1;
                    }

                    gngNumOfWrongNonTar += 1;
                    gngNumOfWrongNonTarB += 1;
                    // 현재 연속점수가 이전 연속점수보다 크거나 같으면 저장!
                    // 현재 연속점수가 이전 연속점수보다 크거나 같으면 저장!
                    if(gngMaxCnsctvSuccessCount >= EX_gngMaxCnsctvSuccessCount){
                        EX_gngMaxCnsctvSuccessCount = gngMaxCnsctvSuccessCount;
                    }
                    gngMaxCnsctvSuccessCount = 0;

                    // gngResponseTimeList : [{"isTarget": true, "isCorrect": true, "responseTime": 0.4350000321865082},
                    gngResponseTimeList.push({"isTarget": false, "isCorrect": false, "responseTime": round_total_time/1000});
                    

                    
                    setTimeout(() => {
                        // app.stage.removeChild(fish_NT)
                        let effect = new PIXI.spine.Spine(res.gonogo_effect.spineData);
                        effect.x = width* 0.3
                        effect.y = height * 0.5
                        effect.scale.set(scale * 0.8);
                        app.stage.addChild(effect);
                        Game_Wrong.play();

                        let Fish3_Fail = effect.state.addAnimation(3, 'Fish3_Fail', false)
                        let Fish3_Fail_time = Fish3_Fail.animationEnd
                        fail_count += 1;
                        if(fail_count == 1){
                            common_heart3.state.setAnimation(0, 'Full2Empty', false);
        
                            common_heart1.state.addAnimation(0, 'Full', true);
                            common_heart2.state.addAnimation(0, 'Full', true);
                            common_heart3.state.addAnimation(0, 'Empty', true);
        
                        }else if(fail_count == 2){
        
                            common_heart2.state.setAnimation(0, 'Full2Empty', false);
        
                            common_heart1.state.addAnimation(0, 'Full', true);
                            common_heart2.state.addAnimation(0, 'Empty', true);
                            common_heart3.state.addAnimation(0, 'Empty', true);

                        }else if(fail_count == 3){
        
                            common_heart1.state.setAnimation(0, 'Full2Empty', false);
        
                            common_heart1.state.addAnimation(0, 'Empty', true);
                            common_heart2.state.addAnimation(0, 'Empty', true);
                            common_heart3.state.addAnimation(0, 'Empty', true);
                        }
                        setTimeout(() => {
                            fish_Nontarget2.y = height*2
                            fish_Nontarget2.x = width*2
                            app.stage.removeChild(effect)
                            setTimeout(() => {
                                fishtickerStart_NT()
                            }, (fish_duration) * 1000)
                            
                        }, (Fish3_Fail_time) * 1000)


                    }, Fish3_Click_time *1000);
                }
            })
        }






        app.start();
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

            } else{
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



function game_end(){
    // 총 플레이시간
    end_time = new Date();
    gngPerformanceTime = end_time - start_time;

    // 표적 정답 개수
    console.log("표적 정답개수 : ", gngNumOfCorrTar);

    // 비표적 정답 개수
    console.log("비표적 정답개수 : ", gngNumOfCorrNonTar);

    // 표적 오답 개수
    console.log("표적 오답개수 : ", gngNumOfWrongTar);

    // 비표적 오답 개수
    console.log("비표적 오답개수 : ", gngNumOfWrongNonTar);

    // 비표적 B 정답 개수
    console.log("비표적 B 정답개수 : ", gngNumOfCorrNonTarB);

    // 비표적 B 오답 개수
    console.log("비표적 B 오답개수 : ", gngNumOfWrongNonTarB);

    // 표적 터치 무시
    console.log("표적 터치무시 개수 : ", gngNumOfAnticipantResponseTar);

    // 비표적 터치 무시
    console.log("비표적 터치무시 개수 : ", gngNumOfAnticipantResponseNonTar);

    // 최대 연속 성공 값
    if(EX_gngMaxCnsctvSuccessCount >= gngMaxCnsctvSuccessCount){
        gngMaxCnsctvSuccessCount = EX_gngMaxCnsctvSuccessCount-1;
    } else {
        gngMaxCnsctvSuccessCount -= 1;
    }

    if(gngMaxCnsctvSuccessCount < 0){
        gngMaxCnsctvSuccessCount = 0;
    }

    console.log("연속 정답 개수 : ", gngMaxCnsctvSuccessCount);

    // 반응시간 및 상태리스트  
    console.log("전체 라운드 반응시간 리스트 : ", gngResponseTimeList);

    // 전체 게임 수행시간
    console.log("총 수행 시간 : ", gngPerformanceTime / 1000);

    var send_data = {
        "uuid" : uuid,
        "taskId" : 0,
        "gngNumOfCorrTar" : gngNumOfCorrTar,
        "gngNumOfCorrNonTar" : gngNumOfCorrNonTar,
        "gngNumOfWrongTar" : gngNumOfWrongTar,
        "gngNumOfWrongNonTar" : gngNumOfWrongNonTar,
        "gngNumOfWrongNonTarB" : gngNumOfWrongNonTarB,
        "gngNumOfCorrNonTarB" : gngNumOfCorrNonTarB,
        "gngNumOfAnticipantResponseNonTar" : gngNumOfAnticipantResponseNonTar,
        "gngNumOfAnticipantResponseTar" : gngNumOfAnticipantResponseTar,
        "gngMaxCnsctvSuccessCount" : gngMaxCnsctvSuccessCount,
        "gngResponseTimeList" : gngResponseTimeList,
        "gngPerformanceTime" : gngPerformanceTime / 1000
    }

    console.log(send_data);
    console.log(JSON.stringify(send_data));

//     $.ajax({
//         type: "POST",
//         url: "app/quantificationsave",
//         async : false,
//         data: JSON.stringify(send_data),
//         contentType : "application/json",
//         dataType: 'JSON',
//         beforeSend: function (xhr) {
//             xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
//         },
//         success : function(json) {
//             console.log(json);
//             // 게임종료
//             const container = document.getElementById('container');
//             container.removeChild(app.view);
            window.location.href = "/ticto/wisc?uuid="+uuid;
//         },
//         error: function(json){
//             console.log(json);
//         }
//     });
}

function sound_btn(type){
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
        console.log(x,y);
        console.log(UISound.x ,UISound.y);
        console.log(UISound.width ,UISound.height);
        if(UISound.x + UISound.width > x && UISound.x < x && UISound.y + UISound.height > y && UISound.y < y){
            console.log("SOUND BTN!");
        }
    });
}
