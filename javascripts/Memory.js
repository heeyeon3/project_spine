var app;    // PIXI JS APPLICATION

// 공통 UI
var common_heart1;                      // 목숨 1번
var common_heart2;                      // 목숨 2번
var common_heart3;                      // 목숨 3번

let grayscale ;                         // GRAY SCALE
var isfirsttime = true;

var tools_list = [];


// 세로모드
var isportrait = false;
var touch_ratio = 1;
// 문제 
var obj_list = [];                          // 전체 OBJ LIST
var answer_list = [];                       // 전체 ANSWER LIST - 라운드별로 추출해서 넣어줌
var answer_idx_list = [];                   // 전체 ANSWER INDEX LIST - 라운드별로 추출해서 넣어줌
var question_list = [];                     // 전체 QUESTION LIST - 라운드별로 추출해서 넣어줌


// 문제 출제    
let round_question = [[1,3], [2,4], [2,6], [3,5], [3,6], [3,8], [4,10], [5,10], [6,12], [7,12]]     // 전체 [답,문제] (max 10)
let round_idx = 0;                      // 전체 [답,문제] 갯수 (max 9)
let now_round_question = []             // 실제 플레이 [답,문제] 갯수 (max 20)
let now_round_idx = 0;                  // 현재 라운드 (max 19)

let toollist_66 = false;


// TICKER 모음 ( IMAGE ANIMATION )
var answerUp_ticker;                      // 문제 출제 TICKER (째깍이 손, 종이, 문제)
let answerUpDown = false;           // 

var Bag_ticker;
let tickerbag = true;


// 튜토리얼 본게임 분기
let Istutorial = true;                  // TUTORIAL 분기
let tutorial_succes_count = 0;          // TUTORIAL 끝나는 조건
let tutorial_question = [[1,2], [1,3]]; // TUTORIAL 문제 
let tutorial_idx = 0;

let practice_ani_index = 0;             // 연습게임 에니메이션 인덱스

// ROUND FINISH
let round_finish = false;

// 본게임
let total_round = 0;
var fail_count = 0;                     // 연속 2번 틀릴 시 게임 END

let box_click_weight = 0;

// 데이터모음
// phoneNum : 01000000000               
// name : TEST
// taskId : 2                      
// pmNumOfPerformedRound : 15
// pmNumOfSuccessRound : 5
// pmMaxCnsctvSuccessCount : 0
// pmPerformanceTime :  60.675
// pmResponseTimeList : [{"isCorrect": true, "responseTime": 1.0350000858306885},  {"isCorrect": true, "responseTime": 0.4010000228881836},  {"isCorrect": true, "responseTime": 0.5350000262260437}, {"isCorrect": true, "responseTime": 0.43400001525878906}]
// pmRoundAnsUserCorrect:[{"performedDataList": [{"answerCount": 1, "currentUserAnswerCount": 1}]}, {"performedDataList": [{"answerCount": 2, "currentUserAnswerCount": 2}]}, {"performedDataList": [{"answerCount": 3, "currentUserAnswerCount": 1}, {"answerCount": 3, "currentUserAnswerCount": 1}]}, {"performedDataList": []}, {"performedDataList": []}, {"performedDataList": []}, {"performedDataList": []}]]

var start_time,end_time;
var pmPerformanceTime;

var round_start_time, round_end_time;
var round_total_time;

var EX_pmMaxCnsctvSuccessCount = 0
var pmNumOfPerformedRound = 0; 
var pmNumOfSuccessRound = 0; 
var pmMaxCnsctvSuccessCount = 0; 
var pmResponseTimeList = [];
var pmRoundAnsUserCorrect = [];
var performedDataList = [];


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
    // container.sortableChildren = true;

    // load spine data
    app.loader
        .add('memory_tutorial', 'spine/Memory/Spine/MemoryTutorial.json')
        .add('common_start',    'spine/WISC/common/Spine/Start.json')
        .add('memory_obj',      'spine/Memory/Spine/MemoryObj.json')
        .add('common_rucro',    'spine/WISC/common/Spine/RuCroEffect.json')
        .add('memory_bag',      'spine/Memory/Spine/MemoryBagEffect.json')
        .add('common_heart',    'spine/WISC/common/Spine/UIHeart.json')
        .add('practicemode',    'spine/PracticeMode/UIPracticeSpine/UIPractice.json')

        .add('grey_scale',      'grey_scale.png')
        .add('UIPlayBtn',       'UIPlayBtn.png')
        .add('UIBox_01',        'spine/WISC/common/UIBox_02.png')
        // .add('UIPause',         'spine/WISC/common/UIPause.png')
        .add('UISound',         'spine/WISC/common/UISound.png')
        .add('MemoryBox_01',    'spine/Memory/Sprite/MemoryBox_01.png')
        .add('MemoryBox_02',    'spine/Memory/Sprite/MemoryBox_02.png')
        .add('MemoryBg',        'spine/Memory/Sprite/MemoryBg.png')
        .add('MemoryNote',      'spine/Memory/Sprite/MemoryNote.png')
        .add('CrockArm',        'spine/Memory/Sprite/CrockArm.png')
        .add('MemoryBag',       'spine/Memory/Sprite/MemoryBag.png')
        .add('UIPracticeMode',  'spine/PracticeMode/UIPracticeMode.png')

        .add('PictureMemory_Music1', '/ticto/sound/bgm/4PictureMemory_Music1.wav')
        .add('PictureMemory_Music2', '/ticto/sound/bgm/5PictureMemory_Music2.wav')
        .add('PictureMemory_Shiq', '/ticto/sound/etc/PictureMemory_Shiq.wav')
        .add('Game_Count01', '/ticto/sound/etc/Game_Count01.mp3')
        .add('Game_Count02', '/ticto/sound/etc/Game_Count02.mp3')
        .add('Game_Right', '/ticto/sound/interactive/Game_Right.wav')
        .add('Game_Wrong', '/ticto/sound/interactive/Game_Wrong.wav')
        .add('Game_pop', '/ticto/sound/interactive/Game_pop.wav')

        .add('story_12',            '/ticto/sound/Story/12_ItsDone.mp3')
        .add('story_13',            '/ticto/sound/Story/13_JjakkakThank.mp3')
        .add('story_14',            '/ticto/sound/Story/14_HeyRuddy.mp3')
        .add('story_15',            '/ticto/sound/Story/15_IFollowYou.mp3')
        .add('story_16',            '/ticto/sound/Story/16_WhatUniverse.mp3')
        .add('story_17',            '/ticto/sound/Story/17_SureNewFriend.mp3')
        .add('story_18',            '/ticto/sound/Story/18_ThankYou.mp3')

        .add('game_01',            '/ticto/sound/PictureMemory/0PictureMemory_PackForSpaceTravel.mp3')
        .add('game_02',            '/ticto/sound/PictureMemory/1PictureMemory_RememberAndPick.mp3')
        .add('game_03',            '/ticto/sound/PictureMemory/2PictureMemory_Remember.mp3')
        .add('game_04',            '/ticto/sound/PictureMemory/3PictureMemory_RememberPick.mp3')
        .add('game_05',            '/ticto/sound/PictureMemory/4PictureMemory_RememberThingAndPick.mp3')
        
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

        .add('RocketSuccess',           '/ticto/sound/cutscene/RocketSuccess.wav')
        .load(onAssetsLoaded);

    app.stage.interactive = true;
    app.stage.buttonMode = true;
    app.stage.sortableChildren = true;

    function onAssetsLoaded(loader, res) {
        $("#loading").hide();
        $("#container").show();

        let bgm1 = PIXI.sound.Sound.from(res.PictureMemory_Music1);
        let bgm2 = PIXI.sound.Sound.from(res.PictureMemory_Music2);
        let PictureMemory_Shiq = PIXI.sound.Sound.from(res.PictureMemory_Shiq);
        let Game_Right = PIXI.sound.Sound.from(res.Game_Right);
        let Game_Wrong = PIXI.sound.Sound.from(res.Game_Wrong);
        let Game_Count01 = PIXI.sound.Sound.from(res.Game_Count01);
        let Game_Count02 = PIXI.sound.Sound.from(res.Game_Count02);
        let Game_pop = PIXI.sound.Sound.from(res.Game_pop);

        let story_12 = PIXI.sound.Sound.from(res.story_12);
        let story_13 = PIXI.sound.Sound.from(res.story_13);
        let story_14 = PIXI.sound.Sound.from(res.story_14);
        let story_15 = PIXI.sound.Sound.from(res.story_15);
        let story_16 = PIXI.sound.Sound.from(res.story_16);
        let story_17 = PIXI.sound.Sound.from(res.story_17);
        let story_18 = PIXI.sound.Sound.from(res.story_18);


        let game_01 = PIXI.sound.Sound.from(res.game_01);
        let game_02 = PIXI.sound.Sound.from(res.game_02);
        let game_03 = PIXI.sound.Sound.from(res.game_03);
        let game_04 = PIXI.sound.Sound.from(res.game_04);
        let game_05 = PIXI.sound.Sound.from(res.game_05);

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

        let RocketSuccess = PIXI.sound.Sound.from(res.RocketSuccess);

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
 
        

        let UIBox_text = new PIXI.Text("물건을 기억하고 골라주세요!",{
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


        // 문제들
        let Quest01 = new PIXI.spine.Spine(res.memory_obj.spineData);
        let Quest02 = new PIXI.spine.Spine(res.memory_obj.spineData);
        let Quest03 = new PIXI.spine.Spine(res.memory_obj.spineData);
        let Quest04 = new PIXI.spine.Spine(res.memory_obj.spineData);
        let Quest05 = new PIXI.spine.Spine(res.memory_obj.spineData);
        let Quest06 = new PIXI.spine.Spine(res.memory_obj.spineData);
        let Quest07 = new PIXI.spine.Spine(res.memory_obj.spineData);

        //box칸 문제들
        let Box01_obj = new PIXI.spine.Spine(res.memory_obj.spineData);
        let Box02_obj = new PIXI.spine.Spine(res.memory_obj.spineData);
        let Box03_obj = new PIXI.spine.Spine(res.memory_obj.spineData);
        let Box04_obj = new PIXI.spine.Spine(res.memory_obj.spineData);
        let Box05_obj = new PIXI.spine.Spine(res.memory_obj.spineData);
        let Box06_obj = new PIXI.spine.Spine(res.memory_obj.spineData);
        let Box07_obj = new PIXI.spine.Spine(res.memory_obj.spineData);
        let Box08_obj = new PIXI.spine.Spine(res.memory_obj.spineData);
        let Box09_obj = new PIXI.spine.Spine(res.memory_obj.spineData);
        let Box10_obj = new PIXI.spine.Spine(res.memory_obj.spineData);
        let Box11_obj = new PIXI.spine.Spine(res.memory_obj.spineData);
        let Box12_obj = new PIXI.spine.Spine(res.memory_obj.spineData);



        let box01_click_img = PIXI.Sprite.from(res.MemoryBox_02.texture);
        let box02_click_img = PIXI.Sprite.from(res.MemoryBox_02.texture);
        let box03_click_img = PIXI.Sprite.from(res.MemoryBox_02.texture);
        let box04_click_img = PIXI.Sprite.from(res.MemoryBox_02.texture);
        let box05_click_img = PIXI.Sprite.from(res.MemoryBox_02.texture);
        let box06_click_img = PIXI.Sprite.from(res.MemoryBox_02.texture);
        let box07_click_img = PIXI.Sprite.from(res.MemoryBox_02.texture);
        let box08_click_img = PIXI.Sprite.from(res.MemoryBox_02.texture);
        let box09_click_img = PIXI.Sprite.from(res.MemoryBox_02.texture);
        let box10_click_img = PIXI.Sprite.from(res.MemoryBox_02.texture);
        let box11_click_img = PIXI.Sprite.from(res.MemoryBox_02.texture);
        let box12_click_img = PIXI.Sprite.from(res.MemoryBox_02.texture);

        box01_click_img.x = width*2
        box02_click_img.x = width*2
        box03_click_img.x = width*2
        box04_click_img.x = width*2
        box05_click_img.x = width*2
        box06_click_img.x = width*2
        box07_click_img.x = width*2
        box08_click_img.x = width*2
        box09_click_img.x = width*2
        box10_click_img.x = width*2
        box11_click_img.x = width*2
        box12_click_img.x = width*2
        // box01_click.x = height*2




        // 전체 OBJ LIST 가져오기
        objLisj();                      

        let memory_bag = new PIXI.spine.Spine(res.memory_bag.spineData);
                    
                    

        //tutorial take01
        let tutorial = new PIXI.spine.Spine(res.memory_tutorial.spineData);
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
                    console.log("GAME START!");
                    app.stage.removeChild(grayscale);
                    app.stage.removeChild(UIPlayBtn);
                    game_start()
                }
            });
        }, 50);


        function game_start(){
            $('#mycanvas').unbind('pointerdown');
            let take01 = tutorial.state.addAnimation(0, 'Take_01', false);
            let take01_time = take01.animationEnd;
            bgm1.play({loop : true});


            tutorial.state.addListener({
                event: function (track, event) {
                    console.log("Event on track " + track.trackIndex + ": ");
                    console.log(event.stringValue);
                    if(event.stringValue == "12"){
                        bgm1.stop();
                        bgm2.play({loop : true});
                        story_12.play();
                    } else if(event.stringValue == "13"){
                        story_13.play();
                    } else if(event.stringValue == "14"){
                        story_14.play();
                    } else if(event.stringValue == "15"){
                        story_15.play();
                    } else if(event.stringValue == "16"){
                        story_16.play();
                    } else if(event.stringValue == "17"){
                        story_17.play();
                    } else if(event.stringValue == "18"){
                        story_18.play();
                    } else if(event.stringValue == "RocketSuccess"){
                        RocketSuccess.play();
                    } 
                }
            });

            setTimeout(() => {
                app.stage.removeChild(tutorial);
                
                //tutorial clickanswer
                let background = PIXI.Sprite.from(res.MemoryBg.texture);
                background.position.y = 0;
                background.position.x = 0;
                background.scale.set(scale/1.37,scale);
                app.stage.addChild(background);
                app.stage.addChild(grayscale);

                game_01.play({
                    complete : function(){
                        game_start01();
                    }
                });
                
            }, take01_time*1000);
        }

        function game_start01(){
            app.stage.removeChild(grayscale);

            let tu_click = new PIXI.spine.Spine(res.memory_tutorial.spineData);
                tu_click.x = width/2
                tu_click.y = height/2
                tu_click.scale.set(scale);
                app.stage.addChild(tu_click);

                let ClickAnswer = tu_click.state.addAnimation(0, 'ClickAnswer', false);
                let ClickAnswer_time = ClickAnswer.animationEnd;
                game_02.play();

                setTimeout(() => {
                    app.stage.removeChild(tu_click);
                    btn_click("blue");
                }, ClickAnswer_time*1000);          
        }

        function btn_click(type){
            app.stage.addChild(grayscale);

            if(type == "blue"){
                // app.stage.addChild(common_heart1);
                // app.stage.addChild(common_heart2);
                app.stage.addChild(UIBox_01)
                app.stage.addChild(UIBox_text)
                // app.stage.addChild(UIPause)
                app.stage.addChild(UISound)

                // common_heart1.state.addAnimation(0, 'Full', true);
                // common_heart2.state.addAnimation(0, 'Full', true);


                app.stage.addChild(practice01)
                app.stage.addChild(practice02)
                app.stage.addChild(practice_text)
                app.stage.addChild(UIPracticeMode)

                practice01.state.addAnimation(practice_ani_index, 'Appear', false);
                practice02.state.addAnimation(practice_ani_index, 'Appear', false);
                practice_ani_index +=1
            }

            let start = new PIXI.spine.Spine(res.common_start.spineData);

            start.x = width/2
            start.y = height/2 
            start.scale.set(scale);

            if(type == "blue"){
                app.stage.addChild(start);

                let blue_btn = start.state.addAnimation(2, 'Ready2', false, 0);
                let blue_btn_time = blue_btn.animationEnd
                start.state.addAnimation(2, 'Ready2', true, 0);
                bluebtn_sound.play({
                    complete : function(){
                        btn_click();
                    }
                })
            } else{

                app.stage.removeChild(practice01)
                app.stage.removeChild(practice02)
                app.stage.removeChild(practice_text)
                app.stage.removeChild(UIPracticeMode)

                app.stage.addChild(common_heart1);
                app.stage.addChild(common_heart2);


                common_heart1.state.addAnimation(0, 'Full', true);
                common_heart2.state.addAnimation(0, 'Full', true);
                
                game_05.play({
                    complete : function(){
                        app.stage.addChild(start);
                        let red_btn = start.state.addAnimation(2, 'Ready', false, 0);
                        start.state.addAnimation(2, 'Ready', true, 0);
                        redbtn_sound.play({
                            complete : function(){
                                btn_click();
                            }
                        })
                    }
                })

                
            }


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
                        console.log("GAME START!");
                        $('#mycanvas').unbind('pointerdown');
                        app.stage.removeChild(start)

                        let start_count = new PIXI.spine.Spine(res.common_start.spineData);

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
                                if(start_sound_cnt ==2){
                                    Game_Count02.play();
                                }else {
                                    Game_Count01.play();
                                }
                                start_sound_cnt++;
                            }
                        });
                        
                        setTimeout(() => {
                            app.stage.removeChild(grayscale);
                            var show_time = 0;
                            if(type == "blue"){
                                show_time = 2500;
                                now_round_question.push(tutorial_question[tutorial_idx]);
                                if(isfirsttime){
                                    // game_02.play();
                                    isfirsttime = false;
                                }
                                
                            } else {
                                // 튜토리얼 끝 초기화!
                                show_time = 4500;
                                answer_list = [];
                                answer_idx_list = [];
                                question_list = [];
                                now_round_question = [];
                                now_round_idx = 0;
                                now_round_question.push(round_question[round_idx]);
                                start_time = new Date();
                            }

                            getlist(now_round_question[now_round_idx][0], now_round_question[now_round_idx][1]);    // 문제, 답 출제.
                            questObjList();
                            answerObjList();

                            // 정답올라옴
                            answerUp();
                            answerUpStart();
                            PictureMemory_Shiq.play({
                                volume : 30
                            });
                            if(type != "blue" && isfirsttime){
                                isfirsttime = false;
                            } else if(type != "blue" && !isfirsttime){
                                game_03.play();
                            }
                            // 가방올라옴
                            BagMove();

                            setTimeout(() => {
                                // 정답내려감
                                answerUpStart(); 
                            }, show_time);
                            
                            

                        }, count_time*4*1000);
                    }                

                })
            }
        }

        
        function answerUp(){
            

            answerUp_ticker = new PIXI.Ticker
            answerUp_ticker.autoStart = false;

            let MemoryNote = PIXI.Sprite.from(res.MemoryNote.texture);
            
            MemoryNote.x = width*0.16;
            MemoryNote.y = height*0.13;
            MemoryNote.scale.set(scale);
            app.stage.addChild(MemoryNote);

            let CrokArm = PIXI.Sprite.from(res.CrockArm.texture);
            CrokArm.x = width * 0.675;
            CrokArm.y = height * 0.57;
        
            CrokArm.scale.set(scale);
            app.stage.addChild(CrokArm);

            Quest01.x = width*0.5
            Quest02.x = width*0.5
            Quest03.x = width*0.5
            Quest04.x = width*0.5
            Quest05.x = width*0.5
            Quest06.x = width*0.5
            Quest07.x = width*0.5

            Quest01.y = height*2
            Quest02.y = height*2
            Quest03.y = height*2
            Quest04.y = height*2
            Quest05.y = height*2
            Quest06.y = height*2
            Quest07.y = height*2
            
            Quest01.scale.set(scale);
            Quest02.scale.set(scale);
            Quest03.scale.set(scale);
            Quest04.scale.set(scale);
            Quest05.scale.set(scale);
            Quest06.scale.set(scale);
            Quest07.scale.set(scale);

            //문제들
            app.stage.addChild(Quest01)
            app.stage.addChild(Quest02)
            app.stage.addChild(Quest03)
            app.stage.addChild(Quest04)
            app.stage.addChild(Quest05)
            app.stage.addChild(Quest06)
            app.stage.addChild(Quest07)

            

            let position = 0
            let tick_len = 0.2 * 1000 / 16.6;               // 0.2초 수정
            
            app.animationUpdate = function () {
       
                

                if (position <= tick_len) {
                    if(answerUpDown){
                        MemoryNote.y = height * 0.1 + height / tick_len * position
                        CrokArm.y = height * 655  + height / tick_len * position

                   
                        // 문제 출제 갯수 (정답 갯수)
                        switch(now_round_question[now_round_idx][0]){
                            case 1:
                                Quest01.y = height * 0.5 + height / tick_len * position ;
                                
                                if(position == tick_len){Quest01.y = height*2}
                                break;

                            case 2:
                                Quest01.x = width * 0.425
                                Quest02.x = width * 0.575

                                Quest01.y = height * 0.5 + height / tick_len * position ;
                                Quest02.y = height * 0.5 + height / tick_len * position ;

                                if(position == tick_len){Quest01.y = height*2; Quest02.y = height*2;}
                                break;

                            case 3:
                                
                                Quest01.x = width * 0.35
                                Quest02.x = width * 0.5
                                Quest03.x = width * 0.65

                                Quest01.y = height * 0.5 + height / tick_len * position ;
                                Quest02.y = height * 0.5 + height / tick_len * position ;
                                Quest03.y = height * 0.5 + height / tick_len * position ;

                            
                                if(position == tick_len){Quest01.y = height*2; Quest02.y = height*2; Quest03.y = height*2;}
                                break;

                            case 4:
                                Quest01.x = width * 0.425
                                Quest02.x = width * 0.575
                                Quest03.x = width * 0.425
                                Quest04.x = width * 0.575

                                Quest01.y = height * 0.375 + height / tick_len * position ;
                                Quest02.y = height * 0.375 + height / tick_len * position ;
                                Quest03.y = height * 0.625 + height / tick_len * position ;
                                Quest04.y = height * 0.625 + height / tick_len * position ;

                            
                                if(position == tick_len){Quest01.y = height*2; Quest02.y = height*2; Quest03.y = height*2; Quest04.y = height*2;}
                                break;

                            case 5:
                                Quest01.x = width * 0.35
                                Quest02.x = width * 0.5
                                Quest03.x = width * 0.65
                                Quest04.x = width * 0.425
                                Quest05.x = width * 0.575

                                Quest01.y = height * 0.375 + height / tick_len * position ;
                                Quest02.y = height * 0.375 + height / tick_len * position ;
                                Quest03.y = height * 0.375 + height / tick_len * position ;
                                Quest04.y = height * 0.625 + height / tick_len * position ;
                                Quest05.y = height * 0.625 + height / tick_len * position ;

                        
                                if(position == tick_len){Quest01.y = height*2; Quest02.y = height*2; Quest03.y = height*2; Quest04.y = height*2; Quest05.y = height*2;}
                                break;


                            case 6:
                                Quest01.x = width*0.35
                                Quest02.x = width*0.5
                                Quest03.x = width*0.65
                                Quest04.x = width*0.35
                                Quest05.x = width*0.5
                                Quest06.x = width*0.65

                                Quest01.y = height * 0.375 + height / tick_len * position ;
                                Quest02.y = height * 0.375 + height / tick_len * position ;
                                Quest03.y = height * 0.375 + height / tick_len * position ;
                                Quest04.y = height * 0.625 + height / tick_len * position ;
                                Quest05.y = height * 0.625 + height / tick_len * position ;
                                Quest06.y = height * 0.625 + height / tick_len * position ;
                        
                        
                                if(position == tick_len){Quest01.y = height*2; Quest02.y = height*2; Quest03.y = height*2; Quest04.y = height*2; Quest05.y = height*2; Quest06.y = Quest06*2;}
                                break;

                            case 7:
                                Quest01.x = width*0.275
                                Quest02.x = width*0.425
                                Quest03.x = width*0.575
                                Quest04.x = width*0.725
                                Quest05.x = width*0.35
                                Quest06.x = width*0.5
                                Quest07.x = width*0.65

                                Quest01.y = height * 0.375 + height / tick_len * position ;
                                Quest02.y = height * 0.375 + height / tick_len * position ;
                                Quest03.y = height * 0.375 + height / tick_len * position ;
                                Quest04.y = height * 0.375 + height / tick_len * position ;
                                Quest05.y = height * 0.625 + height / tick_len * position ;
                                Quest06.y = height * 0.625 + height / tick_len * position ;
                                Quest07.y = height * 0.625 + height / tick_len * position ;


                                if(position == tick_len){Quest01.y = height*2; Quest02.y = height*2; Quest03.y = height*2; Quest04.y = height*2; Quest05.y = height*2; Quest06.y = Quest06*2; Quest07.y = height*2;}
                                break;
                            }


                        
                    }else{
                        MemoryNote.y = height*0.1 + height / tick_len * (tick_len-position) ;
                        CrokArm.y = height * 0.655 + height / tick_len * (tick_len-position); 
                   

                        switch(now_round_question[now_round_idx][0]){
                            case 1:
                                Quest01.y = height * 0.5 + height / tick_len * (tick_len-position) ;
                                Quest01.scale.set(scale*1.5);
                                break;

                            case 2:
                                Quest01.x = width * 0.425
                                Quest02.x = width * 0.575

                                Quest01.y = height * 0.5 + height / tick_len * (tick_len-position) ;
                                Quest02.y = height * 0.5 + height / tick_len * (tick_len-position) ;

                                Quest01.scale.set(scale*1.5);
                                Quest02.scale.set(scale*1.5);
                                break;

                            case 3:
                                Quest01.x = width * 0.35
                                Quest02.x = width * 0.5
                                Quest03.x = width * 0.65

                                Quest01.y = height * 0.5 + height / tick_len * (tick_len-position) ;
                                Quest02.y = height * 0.5 + height / tick_len * (tick_len-position) ;
                                Quest03.y = height * 0.5 + height / tick_len * (tick_len-position) ;

                                Quest01.scale.set(scale*1.4);
                                Quest02.scale.set(scale*1.4);
                                Quest03.scale.set(scale*1.4);
                                
                                break;

                            case 4:
                                Quest01.x = width * 0.425
                                Quest02.x = width * 0.575
                                Quest03.x = width * 0.425
                                Quest04.x = width * 0.575


                                Quest01.y = height * 0.375 + height / tick_len * (tick_len-position) ;
                                Quest02.y = height * 0.375 + height / tick_len * (tick_len-position) ;
                                Quest03.y = height * 0.625 + height / tick_len * (tick_len-position) ;
                                Quest04.y = height * 0.625 + height / tick_len * (tick_len-position) ;

                                Quest01.scale.set(scale*1.35);
                                Quest02.scale.set(scale*1.35);
                                Quest03.scale.set(scale*1.35);
                                Quest04.scale.set(scale*1.35);
                                

                                break;

                            case 5:
                                Quest01.x = width * 0.35
                                Quest02.x = width * 0.5
                                Quest03.x = width * 0.65
                                Quest04.x = width * 0.425
                                Quest05.x = width * 0.575

                                Quest01.y = height * 0.375 + height / tick_len * (tick_len-position) ;
                                Quest02.y = height * 0.375 + height / tick_len * (tick_len-position) ;
                                Quest03.y = height * 0.375 + height / tick_len * (tick_len-position) ;
                                Quest04.y = height * 0.625 + height / tick_len * (tick_len-position) ;
                                Quest05.y = height * 0.625 + height / tick_len * (tick_len-position) ;

                                Quest01.scale.set(scale*1.3);
                                Quest02.scale.set(scale*1.3);
                                Quest03.scale.set(scale*1.3);
                                Quest04.scale.set(scale*1.3);
                                Quest05.scale.set(scale*1.3);

                                break;
                       

                            case 6:
                                Quest01.x = width*0.35
                                Quest02.x = width*0.5
                                Quest03.x = width*0.65
                                Quest04.x = width*0.35
                                Quest05.x = width*0.5
                                Quest06.x = width*0.65
                        
                        

                                Quest01.y = height * 0.375 + height / tick_len * (tick_len-position) ;
                                Quest02.y = height * 0.375 + height / tick_len * (tick_len-position) ;
                                Quest03.y = height * 0.375 + height / tick_len * (tick_len-position) ;
                                Quest04.y = height * 0.625 + height / tick_len * (tick_len-position) ;
                                Quest05.y = height * 0.625 + height / tick_len * (tick_len-position) ;
                                Quest06.y = height * 0.625 + height / tick_len * (tick_len-position) ;

                                Quest01.scale.set(scale*1.35);
                                Quest02.scale.set(scale*1.35);
                                Quest03.scale.set(scale*1.35);
                                Quest04.scale.set(scale*1.35);
                                Quest05.scale.set(scale*1.35);
                                Quest06.scale.set(scale*1.35);

                            
                                break;

                            case 7:
                                Quest01.x = width*0.275
                                Quest02.x = width*0.425
                                Quest03.x = width*0.575
                                Quest04.x = width*0.725
                                Quest05.x = width*0.35
                                Quest06.x = width*0.5
                                Quest07.x = width*0.65

                                Quest01.y = height * 0.375 + height / tick_len * (tick_len-position) ;
                                Quest02.y = height * 0.375 + height / tick_len * (tick_len-position) ;
                                Quest03.y = height * 0.375 + height / tick_len * (tick_len-position) ;
                                Quest04.y = height * 0.375 + height / tick_len * (tick_len-position) ;
                                Quest05.y = height * 0.625 + height / tick_len * (tick_len-position) ;
                                Quest06.y = height * 0.625 + height / tick_len * (tick_len-position) ;
                                Quest07.y = height * 0.625 + height / tick_len * (tick_len-position) ;
                                
                                Quest01.scale.set(scale*1.28);
                                Quest02.scale.set(scale*1.28);
                                Quest03.scale.set(scale*1.28);
                                Quest04.scale.set(scale*1.28);
                                Quest05.scale.set(scale*1.28);
                                Quest06.scale.set(scale*1.28);
                                Quest07.scale.set(scale*1.28);
                                break;
                        }
                    }
                    
                    position += 1;

                } else {
                    if(answerUpDown){
                        answerUpDown = false
                        tickerbagStart()
                        if(!Istutorial){
                            game_04.play();
                        }
                    }else{
                        answerUpDown = true
                        if(!Istutorial && !isfirsttime){
                            game_03.play();
                        }
                        
                    }
                    position = 0;
                    answerUp_ticker.stop();
  
                }
            }
           

            answerUp_ticker.add(app.animationUpdate);
        }
        
        function answerUpStart(){

            answerUp_ticker.start();

        }

        function objLisj(){
            let MemoryObj = new PIXI.spine.Spine(res.memory_obj.spineData);
            obj_list = [];
            for(i=0; i<MemoryObj.skeleton.data.skins.length; i++){
                // animation_var.push(tools00.skeleton.data.animations[i].name);
                obj_list.push(MemoryObj.skeleton.data.skins[i].name);
            }
            obj_list.splice(0, 1);
        }


        // 가방 show / hide
        function BagMove(){

            Bag_ticker = new PIXI.Ticker
            Bag_ticker.autoStart = false;

            let bag = PIXI.Sprite.from(res.MemoryBag.texture);
            bag.y = height;
            bag.x = width;
            
            // bag.y = height*0.08;
            // bag.x = width*0.16;
            bag.scale.set(scale);
            app.stage.addChild(bag);

            //box칸 문제들
            let box01 = PIXI.Sprite.from(res.MemoryBox_01.texture);
            let box02 = PIXI.Sprite.from(res.MemoryBox_01.texture);
            let box03 = PIXI.Sprite.from(res.MemoryBox_01.texture);
            let box04 = PIXI.Sprite.from(res.MemoryBox_01.texture);
            let box05 = PIXI.Sprite.from(res.MemoryBox_01.texture);
            let box06 = PIXI.Sprite.from(res.MemoryBox_01.texture);
            let box07 = PIXI.Sprite.from(res.MemoryBox_01.texture);
            let box08 = PIXI.Sprite.from(res.MemoryBox_01.texture);
            let box09 = PIXI.Sprite.from(res.MemoryBox_01.texture);
            let box10 = PIXI.Sprite.from(res.MemoryBox_01.texture);
            let box11 = PIXI.Sprite.from(res.MemoryBox_01.texture);
            let box12 = PIXI.Sprite.from(res.MemoryBox_01.texture);

            

            box01.x = width;
            box02.x = width;
            box03.x = width;
            box04.x = width;
            box05.x = width;
            box06.x = width;
            box07.x = width;
            box08.x = width;
            box09.x = width;
            box10.x = width;
            box11.x = width;
            box12.x = width;

            box01.y = height;
            box02.y = height;
            box03.y = height;
            box04.y = height;
            box05.y = height;
            box06.y = height;
            box07.y = height;
            box08.y = height;
            box09.y = height;
            box10.y = height;
            box11.y = height;
            box12.y = height;


            app.stage.addChild(box01);
            app.stage.addChild(box02);
            app.stage.addChild(box03);
            app.stage.addChild(box04);
            app.stage.addChild(box05);
            app.stage.addChild(box06);
            app.stage.addChild(box07);
            app.stage.addChild(box08);
            app.stage.addChild(box09);
            app.stage.addChild(box10);
            app.stage.addChild(box11);
            app.stage.addChild(box12);

            app.stage.addChild(box01_click_img);
            app.stage.addChild(box02_click_img);
            app.stage.addChild(box03_click_img);
            app.stage.addChild(box04_click_img);
            app.stage.addChild(box05_click_img);
            app.stage.addChild(box06_click_img);
            app.stage.addChild(box07_click_img);
            app.stage.addChild(box08_click_img);
            app.stage.addChild(box09_click_img);
            app.stage.addChild(box10_click_img);
            app.stage.addChild(box11_click_img);
            app.stage.addChild(box12_click_img);

            //문제 리스트
            
            Box01_obj.x = width;
            Box02_obj.x = width;
            Box03_obj.x = width;
            Box04_obj.x = width;
            Box05_obj.x = width;
            Box06_obj.x = width;
            Box07_obj.x = width;
            Box08_obj.x = width;
            Box09_obj.x = width;
            Box10_obj.x = width;
            Box11_obj.x = width;
            Box12_obj.x = width;

            Box01_obj.y = height*2;
            Box02_obj.y = height*2;
            Box03_obj.y = height*2;
            Box04_obj.y = height*2;
            Box05_obj.y = height*2;
            Box06_obj.y = height*2;
            Box07_obj.y = height*2;
            Box08_obj.y = height*2;
            Box09_obj.y = height*2;
            Box10_obj.y = height*2;
            Box11_obj.y = height*2;
            Box12_obj.y = height*2;


            app.stage.addChild(Box01_obj);
            app.stage.addChild(Box02_obj);
            app.stage.addChild(Box03_obj);
            app.stage.addChild(Box04_obj);
            app.stage.addChild(Box05_obj);
            app.stage.addChild(Box06_obj);
            app.stage.addChild(Box07_obj);
            app.stage.addChild(Box08_obj);
            app.stage.addChild(Box09_obj);
            app.stage.addChild(Box10_obj);
            app.stage.addChild(Box11_obj);
            app.stage.addChild(Box12_obj);

            
            

            // 가방 위 뚜껑
            memory_bag.x = width * 2;
            memory_bag.y = height * 2;
            memory_bag.scale.set(scale);
            app.stage.addChild(memory_bag);
            memory_bag.state.addAnimation(0, "Idle", false, 0);


            let position = 0;
            let tick_len = 0.3 * 1000 / 16.6;       // 0.3초 등장
            
            app.animationleft = function () {
                bag.y = height*0.03;
              
                if (position <= tick_len) {
                    if(tickerbag){

                        box01_click_img.x = width*2
                        box02_click_img.x = width*2
                        box03_click_img.x = width*2
                        box04_click_img.x = width*2
                        box05_click_img.x = width*2
                        box06_click_img.x = width*2
                        box07_click_img.x = width*2
                        box08_click_img.x = width*2
                        box09_click_img.x = width*2
                        box10_click_img.x = width*2
                        box11_click_img.x = width*2
                        box12_click_img.x = width*2
                        
                        box01_click_img.y = height*2
                        box02_click_img.y = height*2
                        box03_click_img.y = height*2
                        box04_click_img.y = height*2
                        box05_click_img.y = height*2
                        box06_click_img.y = height*2
                        box07_click_img.y = height*2
                        box08_click_img.y = height*2
                        box09_click_img.y = height*2
                        box10_click_img.y = height*2
                        box11_click_img.y = height*2
                        box12_click_img.y = height*2

                        switch(now_round_question[now_round_idx][1]){
                            case 2:
                                box01.x = width * 0.29 + width / tick_len * (tick_len-position) ;
                                box02.x = width * 0.51 + width / tick_len * (tick_len-position) ;

                             
                                box_click_weight =  width / tick_len * (tick_len-position)
                                Box01_obj.x = width * 0.39 + width / tick_len * (tick_len-position) ;
                                Box02_obj.x = width * 0.61+ width / tick_len * (tick_len-position) ;
    
                                box01.y = height * 0.38;
                                box02.y = height * 0.38;
    
                                Box01_obj.y = height * 0.555;
                                Box02_obj.y = height * 0.555;
                                
                                
                                box01.scale.set(scale*3, scale*3);
                                box02.scale.set(scale*3, scale*3);

                                box01_click_img.scale.set(scale*3, scale*3);
                                box02_click_img.scale.set(scale*3, scale*3);
    
                                Box01_obj.scale.set(scale*1.5);
                                Box02_obj.scale.set(scale*1.5);
    
                            break;
    
                            case 3:
                                box01.x = width * 0.225 + width / tick_len * (tick_len-position) ;
                                box02.x = width * 0.415 + width / tick_len * (tick_len-position) ;
                                box03.x = width * 0.605 + width / tick_len * (tick_len-position) ;
                                box01.y = height * 0.4;
                                box02.y = height * 0.4;
                                box03.y = height * 0.4;
                                box01.scale.set(scale*3*(8/9), scale*3*(8/9));
                                box02.scale.set(scale*3*(8/9), scale*3*(8/9));
                                box03.scale.set(scale*3*(8/9), scale*3*(8/9));
                             
                                Box01_obj.x = width * 0.315 + width / tick_len * (tick_len-position) ;
                                Box02_obj.x = width * 0.5+ width / tick_len * (tick_len-position)
                                Box03_obj.x = width * 0.695+ width / tick_len * (tick_len-position)
       
                                Box01_obj.y = height * 0.555
                                Box02_obj.y = height * 0.555
                                Box03_obj.y = height * 0.555
    
                                Box01_obj.scale.set(scale*1.4);
                                Box02_obj.scale.set(scale*1.4);
                                Box03_obj.scale.set(scale*1.4);

                                box01_click_img.scale.set(scale*3*(8/9), scale*3*(8/9));
                                box02_click_img.scale.set(scale*3*(8/9), scale*3*(8/9));
                                box03_click_img.scale.set(scale*3*(8/9), scale*3*(8/9));

                                box_click_weight = width / tick_len * (tick_len-position)
    
                            break;
    
                            case 4:
                                box01.x = width * 0.325 + width / tick_len * (tick_len-position) ;
                                box02.x = width * 0.5 + width / tick_len * (tick_len-position) ;
                                box03.x = width * 0.325 + width / tick_len * (tick_len-position) ;
                                box04.x = width * 0.5 + width / tick_len * (tick_len-position) ;
            
                                box01.y = height * 0.25;
                                box02.y = height * 0.25;
                                box03.y = height * 0.56;
                                box04.y = height * 0.56;
                                
                                box01.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box02.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box03.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box04.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));

                                box01_click_img.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box02_click_img.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box03_click_img.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box04_click_img.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
    
                                Box01_obj.x = width * 0.415 + width / tick_len * (tick_len-position);
                                Box02_obj.x = width * 0.59 + width / tick_len * (tick_len-position);
                                Box03_obj.x = width * 0.415 + width / tick_len * (tick_len-position);
                                Box04_obj.x = width * 0.59 + width / tick_len * (tick_len-position);
                               
    
                                Box01_obj.y = height * 0.4
                                Box02_obj.y = height * 0.4
                                Box03_obj.y = height * 0.705
                                Box04_obj.y = height * 0.705
    
                                Box01_obj.scale.set(scale*1.3);
                                Box02_obj.scale.set(scale*1.3);
                                Box03_obj.scale.set(scale*1.3);
                                Box04_obj.scale.set(scale*1.3);

                                box_click_weight = width / tick_len * (tick_len-position)
                               
                            break;
    
                            case 5:
                                box01.x = width * 0.245 + width / tick_len * (tick_len-position);
                                box02.x = width * 0.4205 + width / tick_len * (tick_len-position);
                                box03.x = width * 0.595 + width / tick_len * (tick_len-position);
                                box04.x = width * 0.33 + width / tick_len * (tick_len-position);
                                box05.x = width * 0.505 + width / tick_len * (tick_len-position);
    
                                box01.y = height * 0.25;
                                box02.y = height * 0.25;
                                box03.y = height * 0.25;
                                box04.y = height * 0.56;
                                box05.y = height * 0.56;
                                
                                box01.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box02.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box03.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box04.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box05.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));

                                box01_click_img.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box02_click_img.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box03_click_img.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box04_click_img.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box05_click_img.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
    
                                Box01_obj.x = width * 0.33 + width / tick_len * (tick_len-position);
                                Box02_obj.x = width * 0.505 + width / tick_len * (tick_len-position);
                                Box03_obj.x = width * 0.68 + width / tick_len * (tick_len-position);
                                Box04_obj.x = width * 0.415 + width / tick_len * (tick_len-position);
                                Box05_obj.x = width * 0.59 + width / tick_len * (tick_len-position);
    
                                Box01_obj.y = height * 0.4
                                Box02_obj.y = height * 0.4
                                Box03_obj.y = height * 0.4
                                Box04_obj.y = height * 0.705
                                Box05_obj.y = height * 0.705
    
                                Box01_obj.scale.set(scale*1.3);
                                Box02_obj.scale.set(scale*1.3);
                                Box03_obj.scale.set(scale*1.3);
                                Box04_obj.scale.set(scale*1.3);
                                Box05_obj.scale.set(scale*1.3);

                                box_click_weight = width / tick_len * (tick_len-position)
                            break;
    
                            case 6:
                                box01.x = width * 0.245 + width / tick_len * (tick_len-position);
                                box02.x = width * 0.4205 + width / tick_len * (tick_len-position);
                                box03.x = width * 0.595 + width / tick_len * (tick_len-position);
                                box04.x = width * 0.245 + width / tick_len * (tick_len-position);
                                box05.x = width * 0.4205 + width / tick_len * (tick_len-position);
                                box06.x = width * 0.595 + width / tick_len * (tick_len-position);
    
                                box01.y = height * 0.25;
                                box02.y = height * 0.25;
                                box03.y = height * 0.25;
                                box04.y = height * 0.56;
                                box05.y = height * 0.56;
                                box06.y = height * 0.56;
                                
                                box01.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box02.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box03.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box04.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box05.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box06.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));

                                box01_click_img.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box02_click_img.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box03_click_img.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box04_click_img.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box05_click_img.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
                                box06_click_img.scale.set(scale*3*(7.5/9), scale*3*(7.5/9));
    
                                Box01_obj.x = width * 0.33 + width / tick_len * (tick_len-position);
                                Box02_obj.x = width * 0.505 + width / tick_len * (tick_len-position);
                                Box03_obj.x = width * 0.68 + width / tick_len * (tick_len-position);
                                Box04_obj.x = width * 0.33 + width / tick_len * (tick_len-position);
                                Box05_obj.x = width * 0.505 + width / tick_len * (tick_len-position);
                                Box06_obj.x = width * 0.68 + width / tick_len * (tick_len-position);
    
                                Box01_obj.y = height * 0.4
                                Box02_obj.y = height * 0.4
                                Box03_obj.y = height * 0.4
                                Box04_obj.y = height * 0.705
                                Box05_obj.y = height * 0.705
                                Box06_obj.y = height * 0.705
    
                                Box01_obj.scale.set(scale*1.3);
                                Box02_obj.scale.set(scale*1.3);
                                Box03_obj.scale.set(scale*1.3);
                                Box04_obj.scale.set(scale*1.3);
                                Box05_obj.scale.set(scale*1.3);
                                Box06_obj.scale.set(scale*1.3);

                                box_click_weight = width / tick_len * (tick_len-position)
                            break;
    
                            case 8:
                                box01.x = width * 0.205 + width / tick_len * (tick_len-position);
                                box02.x = width * 0.355 + width / tick_len * (tick_len-position);
                                box03.x = width * 0.505 + width / tick_len * (tick_len-position);
                                box04.x = width * 0.6555 + width / tick_len * (tick_len-position);
                                box05.x = width * 0.205 + width / tick_len * (tick_len-position);
                                box06.x = width * 0.355 + width / tick_len * (tick_len-position);
                                box07.x = width * 0.505 + width / tick_len * (tick_len-position);
                                box08.x = width * 0.6555 + width / tick_len * (tick_len-position);
    
                                box01.y = height * 0.29;
                                box02.y = height * 0.29;
                                box03.y = height * 0.29;
                                box04.y = height * 0.29;
                                box05.y = height * 0.57;
                                box06.y = height * 0.57;
                                box07.y = height * 0.57;
                                box08.y = height * 0.57;
                                
                                box01.scale.set(scale*3*(6.5/9), scale*3*(6.5/9));
                                box02.scale.set(scale*3*(6.5/9), scale*3*(6.5/9));
                                box03.scale.set(scale*3*(6.5/9), scale*3*(6.5/9));
                                box04.scale.set(scale*3*(6.5/9), scale*3*(6.5/9));
                                box05.scale.set(scale*3*(6.5/9), scale*3*(6.5/9));
                                box06.scale.set(scale*3*(6.5/9), scale*3*(6.5/9));
                                box07.scale.set(scale*3*(6.5/9), scale*3*(6.5/9));
                                box08.scale.set(scale*3*(6.5/9), scale*3*(6.5/9));

                                box01_click_img.scale.set(scale*3*(6.5/9), scale*3*(6.5/9));
                                box02_click_img.scale.set(scale*3*(6.5/9), scale*3*(6.5/9));
                                box03_click_img.scale.set(scale*3*(6.5/9), scale*3*(6.5/9));
                                box04_click_img.scale.set(scale*3*(6.5/9), scale*3*(6.5/9));
                                box05_click_img.scale.set(scale*3*(6.5/9), scale*3*(6.5/9));
                                box06_click_img.scale.set(scale*3*(6.5/9), scale*3*(6.5/9));
                                box07_click_img.scale.set(scale*3*(6.5/9), scale*3*(6.5/9));
                                box08_click_img.scale.set(scale*3*(6.5/9), scale*3*(6.5/9));
    
                                Box01_obj.x = width * 0.28 + width / tick_len * (tick_len-position);
                                Box02_obj.x = width * 0.43 + width / tick_len * (tick_len-position);
                                Box03_obj.x = width * 0.58 + width / tick_len * (tick_len-position);
                                Box04_obj.x = width * 0.73 + width / tick_len * (tick_len-position);
                                Box05_obj.x = width * 0.28 + width / tick_len * (tick_len-position);
                                Box06_obj.x = width * 0.43 + width / tick_len * (tick_len-position);
                                Box07_obj.x = width * 0.58 + width / tick_len * (tick_len-position);
                                Box08_obj.x = width * 0.73 + width / tick_len * (tick_len-position);
    
                                Box01_obj.y = height * 0.415
                                Box02_obj.y = height * 0.415
                                Box03_obj.y = height * 0.415
                                Box04_obj.y = height * 0.415
                                Box05_obj.y = height * 0.7
                                Box06_obj.y = height * 0.7
                                Box07_obj.y = height * 0.7
                                Box08_obj.y = height * 0.7
    
                                Box01_obj.scale.set(scale*1.1);
                                Box02_obj.scale.set(scale*1.1);
                                Box03_obj.scale.set(scale*1.1);
                                Box04_obj.scale.set(scale*1.1);
                                Box05_obj.scale.set(scale*1.1);
                                Box06_obj.scale.set(scale*1.1);
                                Box07_obj.scale.set(scale*1.1);
                                Box08_obj.scale.set(scale*1.1);

                                box_click_weight = width / tick_len * (tick_len-position)
                            break;
    
                            case 10:
                                box01.x = width * 0.19 + width / tick_len * (tick_len-position);
                                box02.x = width * 0.31625 + width / tick_len * (tick_len-position);
                                box03.x = width * 0.4425 + width / tick_len * (tick_len-position);
                                box04.x = width * 0.56875 + width / tick_len * (tick_len-position);
                                box05.x = width * 0.695 + width / tick_len * (tick_len-position);
                                box06.x = width * 0.19 + width / tick_len * (tick_len-position);
                                box07.x = width * 0.31625 + width / tick_len * (tick_len-position);
                                box08.x = width * 0.4425 + width / tick_len * (tick_len-position);
                                box09.x = width * 0.56875 + width / tick_len * (tick_len-position);
                                box10.x = width * 0.695 + width / tick_len * (tick_len-position);
    
                                box01.y = height * 0.35;
                                box02.y = height * 0.35;
                                box03.y = height * 0.35;
                                box04.y = height * 0.35;
                                box05.y = height * 0.35;
                                box06.y = height * 0.57;
                                box07.y = height * 0.57;
                                box08.y = height * 0.57;
                                box09.y = height * 0.57;
                                box10.y = height * 0.57;
                                
                                box01.scale.set(scale*3*(5.25/9));
                                box02.scale.set(scale*3*(5.25/9));
                                box03.scale.set(scale*3*(5.25/9));
                                box04.scale.set(scale*3*(5.25/9));
                                box05.scale.set(scale*3*(5.25/9));
                                box06.scale.set(scale*3*(5.25/9));
                                box07.scale.set(scale*3*(5.25/9));
                                box08.scale.set(scale*3*(5.25/9));
                                box09.scale.set(scale*3*(5.25/9));
                                box10.scale.set(scale*3*(5.25/9));


                                box01_click_img.scale.set(scale*3*(5.25/9));
                                box02_click_img.scale.set(scale*3*(5.25/9));
                                box03_click_img.scale.set(scale*3*(5.25/9));
                                box04_click_img.scale.set(scale*3*(5.25/9));
                                box05_click_img.scale.set(scale*3*(5.25/9));
                                box06_click_img.scale.set(scale*3*(5.25/9));
                                box07_click_img.scale.set(scale*3*(5.25/9));
                                box08_click_img.scale.set(scale*3*(5.25/9));
                                box09_click_img.scale.set(scale*3*(5.25/9));
                                box10_click_img.scale.set(scale*3*(5.25/9));
    
                                Box01_obj.x = width * 0.25 + width / tick_len * (tick_len-position);
                                Box02_obj.x = width * 0.375 + width / tick_len * (tick_len-position);
                                Box03_obj.x = width * 0.5 + width / tick_len * (tick_len-position);
                                Box04_obj.x = width * 0.625 + width / tick_len * (tick_len-position);
                                Box05_obj.x = width * 0.755 + width / tick_len * (tick_len-position);
                                Box06_obj.x = width * 0.25 + width / tick_len * (tick_len-position);
                                Box07_obj.x = width * 0.375 + width / tick_len * (tick_len-position);
                                Box08_obj.x = width * 0.5 + width / tick_len * (tick_len-position);
                                Box09_obj.x = width * 0.625 + width / tick_len * (tick_len-position);
                                Box10_obj.x = width * 0.755 + width / tick_len * (tick_len-position);
                             
    
                                Box01_obj.y = height * 0.455
                                Box02_obj.y = height * 0.455
                                Box03_obj.y = height * 0.455
                                Box04_obj.y = height * 0.455
                                Box05_obj.y = height * 0.455
                                Box06_obj.y = height * 0.67
                                Box07_obj.y = height * 0.67
                                Box08_obj.y = height * 0.67
                                Box09_obj.y = height * 0.67
                                Box10_obj.y = height * 0.67
                                
    
                                Box01_obj.scale.set(scale*0.9);
                                Box02_obj.scale.set(scale*0.9);
                                Box03_obj.scale.set(scale*0.9);
                                Box04_obj.scale.set(scale*0.9);
                                Box05_obj.scale.set(scale*0.9);
                                Box06_obj.scale.set(scale*0.9);
                                Box07_obj.scale.set(scale*0.9);
                                Box08_obj.scale.set(scale*0.9);
                                Box09_obj.scale.set(scale*0.9);
                                Box10_obj.scale.set(scale*0.9);
                             
                                box_click_weight = width / tick_len * (tick_len-position)
    
                            break;
    
                            case 12:
                                box01.x = width * 0.245 + width / tick_len * (tick_len-position);
                                box02.x = width * 0.375 + width / tick_len * (tick_len-position);
                                box03.x = width * 0.505 + width / tick_len * (tick_len-position);
                                box04.x = width * 0.635 + width / tick_len * (tick_len-position);
                                box05.x = width * 0.245 + width / tick_len * (tick_len-position);
                                box06.x = width * 0.375 + width / tick_len * (tick_len-position);
                                box07.x = width * 0.505 + width / tick_len * (tick_len-position);
                                box08.x = width * 0.635 + width / tick_len * (tick_len-position);
                                box09.x = width * 0.245 + width / tick_len * (tick_len-position);
                                box10.x = width * 0.375 + width / tick_len * (tick_len-position);
                                box11.x = width * 0.505 + width / tick_len * (tick_len-position);
                                box12.x = width * 0.635 + width / tick_len * (tick_len-position);
                                
    
                                box01.y = height * 0.225;
                                box02.y = height * 0.225;
                                box03.y = height * 0.225;
                                box04.y = height * 0.225;
                                box05.y = height * 0.45;
                                box06.y = height * 0.45;
                                box07.y = height * 0.45;
                                box08.y = height * 0.45;
                                box09.y = height * 0.675;
                                box10.y = height * 0.675;
                                box11.y = height * 0.675;
                                box12.y = height * 0.675;
                                
                                box01.scale.set(scale*3*(5.25/9));
                                box02.scale.set(scale*3*(5.25/9));
                                box03.scale.set(scale*3*(5.25/9));
                                box04.scale.set(scale*3*(5.25/9));
                                box05.scale.set(scale*3*(5.25/9));
                                box06.scale.set(scale*3*(5.25/9));
                                box07.scale.set(scale*3*(5.25/9));
                                box08.scale.set(scale*3*(5.25/9));
                                box09.scale.set(scale*3*(5.25/9));
                                box10.scale.set(scale*3*(5.25/9));
                                box11.scale.set(scale*3*(5.25/9));
                                box12.scale.set(scale*3*(5.25/9));

                                box01_click_img.scale.set(scale*3*(5.25/9));
                                box02_click_img.scale.set(scale*3*(5.25/9));
                                box03_click_img.scale.set(scale*3*(5.25/9));
                                box04_click_img.scale.set(scale*3*(5.25/9));
                                box05_click_img.scale.set(scale*3*(5.25/9));
                                box06_click_img.scale.set(scale*3*(5.25/9));
                                box07_click_img.scale.set(scale*3*(5.25/9));
                                box08_click_img.scale.set(scale*3*(5.25/9));
                                box09_click_img.scale.set(scale*3*(5.25/9));
                                box10_click_img.scale.set(scale*3*(5.25/9));
                                box11_click_img.scale.set(scale*3*(5.25/9));
                                box12_click_img.scale.set(scale*3*(5.25/9));
    
                                Box01_obj.x = width * 0.305 + width / tick_len * (tick_len-position);
                                Box02_obj.x = width * 0.435 + width / tick_len * (tick_len-position);
                                Box03_obj.x = width * 0.565 + width / tick_len * (tick_len-position);
                                Box04_obj.x = width * 0.695 + width / tick_len * (tick_len-position);
                                Box05_obj.x = width * 0.305 + width / tick_len * (tick_len-position);
                                Box06_obj.x = width * 0.435 + width / tick_len * (tick_len-position);
                                Box07_obj.x = width * 0.565 + width / tick_len * (tick_len-position);
                                Box08_obj.x = width * 0.695 + width / tick_len * (tick_len-position);
                                Box09_obj.x = width * 0.305 + width / tick_len * (tick_len-position);
                                Box10_obj.x = width * 0.4335 + width / tick_len * (tick_len-position);
                                Box11_obj.x = width * 0.565 + width / tick_len * (tick_len-position);
                                Box12_obj.x = width * 0.695 + width / tick_len * (tick_len-position);
    
                                Box01_obj.y = height * 0.325
                                Box02_obj.y = height * 0.325
                                Box03_obj.y = height * 0.325
                                Box04_obj.y = height * 0.325
                                Box05_obj.y = height * 0.55
                                Box06_obj.y = height * 0.55
                                Box07_obj.y = height * 0.55
                                Box08_obj.y = height * 0.55
                                Box09_obj.y = height * 0.775
                                Box10_obj.y = height * 0.775
                                Box11_obj.y = height * 0.775
                                Box12_obj.y = height * 0.775
    
                                Box01_obj.scale.set(scale*0.9);
                                Box02_obj.scale.set(scale*0.9);
                                Box03_obj.scale.set(scale*0.9);
                                Box04_obj.scale.set(scale*0.9);
                                Box05_obj.scale.set(scale*0.9);
                                Box06_obj.scale.set(scale*0.9);
                                Box07_obj.scale.set(scale*0.9);
                                Box08_obj.scale.set(scale*0.9);
                                Box09_obj.scale.set(scale*0.9);
                                Box10_obj.scale.set(scale*0.9);
                                Box11_obj.scale.set(scale*0.9);
                                Box12_obj.scale.set(scale*0.9);

                                box_click_weight = width / tick_len * (tick_len-position)
                            break;
    
    
                        }
    

                        bag.x = width * 0.155 + width / tick_len * (tick_len-position);

                        memory_bag.x = width * 0.5
                        memory_bag.y = height * 0.556
                        memory_bag.x = width * 0.5 + width / tick_len * (tick_len-position);

                    }else{

                        bag.x = width * 0.155 - width / tick_len * position;
                        memory_bag.x = width * 0.5 - width / tick_len * position;
              


                        switch(now_round_question[now_round_idx][1]){
                            case 2:
                                box01.x = width * 0.29 - width / tick_len * position;
                                box02.x = width * 0.51 - width / tick_len * position;

                                box01_click_img.x = width * 0.29 - width / tick_len * position;
                                box02_click_img.x = width * 0.51 - width / tick_len * position;
                             
                                Box01_obj.x = width * 0.39 - width / tick_len * position;
                                Box02_obj.x = width * 0.61 - width / tick_len * position;
    
                          
                            break;
    
                            case 3:
                                box01.x = width * 0.225 - width / tick_len * position;
                                box02.x = width * 0.415 - width / tick_len * position;
                                box03.x = width * 0.605 - width / tick_len * position;
                             
                                box01_click_img.x = width * 0.225 - width / tick_len * position;
                                box02_click_img.x = width * 0.415 - width / tick_len * position;
                                box03_click_img.x = width * 0.605 - width / tick_len * position;
                             
                                Box01_obj.x = width * 0.315 - width / tick_len * position;
                                Box02_obj.x = width * 0.5 - width / tick_len * position;
                                Box03_obj.x = width * 0.695 - width / tick_len * position;
       
    
                            break;
    
                            case 4:
                                box01.x = width * 0.325 - width / tick_len * position;
                                box02.x = width * 0.5 - width / tick_len * position;
                                box03.x = width * 0.325 - width / tick_len * position;
                                box04.x = width * 0.5 - width / tick_len * position;


                                box01_click_img.x = width * 0.325 - width / tick_len * position;
                                box02_click_img.x = width * 0.5 - width / tick_len * position;
                                box03_click_img.x = width * 0.325 - width / tick_len * position;
                                box04_click_img.x = width * 0.5 - width / tick_len * position;
            
    
                                Box01_obj.x = width * 0.415 - width / tick_len * position;
                                Box02_obj.x = width * 0.59 - width / tick_len * position;
                                Box03_obj.x = width * 0.415 - width / tick_len * position;
                                Box04_obj.x = width * 0.59 - width / tick_len * position;
                               
                               
                            break;
    
                            case 5:
                                box01.x = width * 0.245 - width / tick_len * position;
                                box02.x = width * 0.4205 - width / tick_len * position;
                                box03.x = width * 0.595 - width / tick_len * position;
                                box04.x = width * 0.33 - width / tick_len * position;
                                box05.x = width * 0.505 - width / tick_len * position;


                                box01_click_img.x = width * 0.245 - width / tick_len * position;
                                box02_click_img.x = width * 0.4205 - width / tick_len * position;
                                box03_click_img.x = width * 0.595 - width / tick_len * position;
                                box04_click_img.x = width * 0.33 - width / tick_len * position;
                                box05_click_img.x = width * 0.505 - width / tick_len * position;
    
    
                                Box01_obj.x = width * 0.33 - width / tick_len * position;
                                Box02_obj.x = width * 0.505 - width / tick_len * position;
                                Box03_obj.x = width * 0.68 - width / tick_len * position;
                                Box04_obj.x = width * 0.415 - width / tick_len * position;
                                Box05_obj.x = width * 0.59 - width / tick_len * position;
    
                             
                            break;
    
    
    
                            case 6:
                                box01.x = width * 0.245 - width / tick_len * position;
                                box02.x = width * 0.4205 - width / tick_len * position;
                                box03.x = width * 0.595 - width / tick_len * position;
                                box04.x = width * 0.245 - width / tick_len * position;
                                box05.x = width * 0.4205 - width / tick_len * position;
                                box06.x = width * 0.595 - width / tick_len * position;


                                box01_click_img.x = width * 0.245 - width / tick_len * position;
                                box02_click_img.x = width * 0.4205 - width / tick_len * position;
                                box03_click_img.x = width * 0.595 - width / tick_len * position;
                                box04_click_img.x = width * 0.245 - width / tick_len * position;
                                box05_click_img.x = width * 0.4205 - width / tick_len * position;
                                box06_click_img.x = width * 0.595 - width / tick_len * position;
    
    
                                Box01_obj.x = width * 0.33 - width / tick_len * position;
                                Box02_obj.x = width * 0.505 - width / tick_len * position;
                                Box03_obj.x = width * 0.68 - width / tick_len * position;
                                Box04_obj.x = width * 0.33 - width / tick_len * position;
                                Box05_obj.x = width * 0.505 - width / tick_len * position;
                                Box06_obj.x = width * 0.68 - width / tick_len * position;
    
    
                            break;
    
                            case 8:
                             
                                box01.x = width * 0.205 - width / tick_len * position;
                                box02.x = width * 0.355 - width / tick_len * position;
                                box03.x = width * 0.505 - width / tick_len * position;
                                box04.x = width * 0.6555 - width / tick_len * position;
                                box05.x = width * 0.205 - width / tick_len * position;
                                box06.x = width * 0.355 - width / tick_len * position;
                                box07.x = width * 0.505 - width / tick_len * position;
                                box08.x = width * 0.6555 - width / tick_len * position;

                                box01_click_img.x = width * 0.205 - width / tick_len * position;
                                box02_click_img.x = width * 0.355 - width / tick_len * position;
                                box03_click_img.x = width * 0.505 - width / tick_len * position;
                                box04_click_img.x = width * 0.6555 - width / tick_len * position;
                                box05_click_img.x = width * 0.205 - width / tick_len * position;
                                box06_click_img.x = width * 0.355 - width / tick_len * position;
                                box07_click_img.x = width * 0.505 - width / tick_len * position;
                                box08_click_img.x = width * 0.6555 - width / tick_len * position;
    
                                Box01_obj.x = width * 0.28 - width / tick_len * position;
                                Box02_obj.x = width * 0.43 - width / tick_len * position;
                                Box03_obj.x = width * 0.58 - width / tick_len * position;
                                Box04_obj.x = width * 0.73 - width / tick_len * position;
                                Box05_obj.x = width * 0.28 - width / tick_len * position;
                                Box06_obj.x = width * 0.43 - width / tick_len * position;
                                Box07_obj.x = width * 0.58 - width / tick_len * position;
                                Box08_obj.x = width * 0.73 - width / tick_len * position;
                            break;
    
                            case 10:
                                box01.x = width * 0.19 - width / tick_len * position;
                                box02.x = width * 0.31625 - width / tick_len * position;
                                box03.x = width * 0.4425 - width / tick_len * position;
                                box04.x = width * 0.56875 - width / tick_len * position;
                                box05.x = width * 0.695 - width / tick_len * position;
                                box06.x = width * 0.19 - width / tick_len * position;
                                box07.x = width * 0.31625 - width / tick_len * position;
                                box08.x = width * 0.4425 - width / tick_len * position;
                                box09.x = width * 0.56875 - width / tick_len * position;
                                box10.x = width * 0.695 - width / tick_len * position;

                                box01_click_img.x = width * 0.19 - width / tick_len * position;
                                box02_click_img.x = width * 0.31625 - width / tick_len * position;
                                box03_click_img.x = width * 0.4425 - width / tick_len * position;
                                box04_click_img.x = width * 0.56875 - width / tick_len * position;
                                box05_click_img.x = width * 0.695 - width / tick_len * position;
                                box06_click_img.x = width * 0.19 - width / tick_len * position;
                                box07_click_img.x = width * 0.31625 - width / tick_len * position;
                                box08_click_img.x = width * 0.4425 - width / tick_len * position;
                                box09_click_img.x = width * 0.56875 - width / tick_len * position;
                                box10_click_img.x = width * 0.695 - width / tick_len * position;
    
                                Box01_obj.x = width * 0.25 - width / tick_len * position;
                                Box02_obj.x = width * 0.375 - width / tick_len * position;
                                Box03_obj.x = width * 0.5 - width / tick_len * position;
                                Box04_obj.x = width * 0.625  - width / tick_len * position;
                                Box05_obj.x = width * 0.755 - width / tick_len * position;
                                Box06_obj.x = width * 0.25 - width / tick_len * position;
                                Box07_obj.x = width * 0.375 - width / tick_len * position;
                                Box08_obj.x = width * 0.5 - width / tick_len * position;
                                Box09_obj.x = width * 0.625 - width / tick_len * position;
                                Box10_obj.x = width * 0.755 - width / tick_len * position;
                             
                             
    
                            break;
    
                            case 12:
                                box01.x = width * 0.245 - width / tick_len * position;
                                box02.x = width * 0.375 - width / tick_len * position;
                                box03.x = width * 0.505 - width / tick_len * position;
                                box04.x = width * 0.635 - width / tick_len * position;
                                box05.x = width * 0.245 - width / tick_len * position;
                                box06.x = width * 0.375 - width / tick_len * position;
                                box07.x = width * 0.505 - width / tick_len * position;
                                box08.x = width * 0.635 - width / tick_len * position;
                                box09.x = width * 0.245 - width / tick_len * position;
                                box10.x = width * 0.375 - width / tick_len * position;
                                box11.x = width * 0.505 - width / tick_len * position;
                                box12.x = width * 0.635 - width / tick_len * position;

                                box01_click_img.x = width * 0.245 - width / tick_len * position;
                                box02_click_img.x = width * 0.375 - width / tick_len * position;
                                box03_click_img.x = width * 0.505 - width / tick_len * position;
                                box04_click_img.x = width * 0.635 - width / tick_len * position;
                                box05_click_img.x = width * 0.245 - width / tick_len * position;
                                box06_click_img.x = width * 0.375 - width / tick_len * position;
                                box07_click_img.x = width * 0.505 - width / tick_len * position;
                                box08_click_img.x = width * 0.635 - width / tick_len * position;
                                box09_click_img.x = width * 0.245 - width / tick_len * position;
                                box10_click_img.x = width * 0.375 - width / tick_len * position;
                                box11_click_img.x = width * 0.505 - width / tick_len * position;
                                box12_click_img.x = width * 0.635 - width / tick_len * position;
                                
    
                            
                                Box01_obj.x = width * 0.305 - width / tick_len * position;
                                Box02_obj.x = width * 0.435 - width / tick_len * position;
                                Box03_obj.x = width * 0.565 - width / tick_len * position;
                                Box04_obj.x = width * 0.695 - width / tick_len * position;
                                Box05_obj.x = width * 0.305 - width / tick_len * position;
                                Box06_obj.x = width * 0.435 - width / tick_len * position;
                                Box07_obj.x = width * 0.565 - width / tick_len * position;
                                Box08_obj.x = width * 0.695 - width / tick_len * position;
                                Box09_obj.x = width * 0.305 - width / tick_len * position;
                                Box10_obj.x = width * 0.4335 - width / tick_len * position;
                                Box11_obj.x = width * 0.565 - width / tick_len * position;
                                Box12_obj.x = width * 0.695 - width / tick_len * position;
    
                            break;
                        }
                    }

                    position += 1;

                } else {
                    const randomNum = Math.floor(Math.random() * 3 + 1);

                    let rucro = new PIXI.spine.Spine(res.common_rucro.spineData);
                    rucro.scale.set(scale);
                    rucro.x = width/2
                    rucro.y = height/2
                    let Great_time = 0;

                    if(tickerbag){
                        if(!Istutorial){ 
                            console.log("ROUNSTART!")
                            round_start_time = new Date();
                            pmNumOfPerformedRound += 1;
                        }
                        tickerbag = false
                        boxobjClick();
                    }else{
                        tickerbag = true;
                        now_round_idx++;
                        if(fail_count == 0){
                            if(Istutorial){                                                              // 튜토리얼 정답
                                // console.log("튜토리얼 정답!!")
                                app.stage.addChild(grayscale);
                                app.stage.addChild(rucro);
                                let Great = rucro.state.addAnimation(0, 'Great', false, 0);
                                Great_time = Great.animationEnd
                                if(randomNum == 1){
                                    Great_01.play();
                                } else if(randomNum == 2){
                                    Great_02.play();
                                } else if(randomNum == 3){
                                    Great_03.play();
                                }
                                tutorial_idx++;
                                now_round_question.push(tutorial_question[tutorial_idx]);

                                tutorial_succes_count += 1;
                                if(tutorial_succes_count==1){practice02.state.addAnimation(practice_ani_index, 'Clear', false);}else if(tutorial_succes_count == 2){practice01.state.addAnimation(practice_ani_index, 'Clear', false);}
                                practice_ani_index +=1 

                                
                                if(tutorial_idx < 2){
                                    getlist(now_round_question[now_round_idx][0], now_round_question[now_round_idx][1]); 
                                }
                            } else {                                                                 // 본게임 정답
                                
                                if(round_idx > 8){
                                    // 게임엔드
                                    console.log("게임엔드!")
                                    game_end();
                            
                                    return;
                                }
                                round_idx++;
                                now_round_question.push(round_question[round_idx]);
                                getlist(now_round_question[now_round_idx][0], now_round_question[now_round_idx][1]); 

                            }
                        } else if(fail_count == 2 && !Istutorial){
                            game_end();
                            
                            return
                        }  else {
                            if(Istutorial){                                                                                 // 튜토리얼 오답
                                now_round_idx--;
                                // console.log("튜토리얼 오답!!")
                                app.stage.addChild(grayscale);
                                app.stage.addChild(rucro);
                                let Fail = rucro.state.addAnimation(0, 'Fail', false, 0);
                                Great_time = Fail.animationEnd
                                if(randomNum == 1){
                                    Retry_01.play();
                                } else if(randomNum == 2){
                                    Retry_02.play();
                                } else if(randomNum == 3){
                                    Retry_03.play();
                                }

                            } else {                                                                                        // 본게임 오답

                                now_round_question.push(round_question[round_idx]);
                                getlist(now_round_question[now_round_idx][0], now_round_question[now_round_idx][1]); 

                            }
                        }

                        if(tutorial_idx > 1 && Istutorial){                         // 튜토리얼 엔드
                            // console.log("튜토리얼 끝!!")
                            setTimeout(() => {
                                app.stage.removeChild(rucro);
                                app.stage.removeChild(grayscale);
                                Istutorial = false;
                                isfirsttime = true;
                                btn_click("red");
                            }, (Great_time-0.3)*1000);

                        } else if(Istutorial){                                      // 튜토리얼 중
                            setTimeout(() => {
                                // console.log("튜토리얼 진행중!!")
                                app.stage.removeChild(rucro);
                                app.stage.removeChild(grayscale);
                                memory_bag.state.addAnimation(0, "Idle", false, 0);
                                questObjList();
                                answerObjList();
                                answerUpStart();
                                PictureMemory_Shiq.play({
                                    volume : 20
                                });
                                setTimeout(() => {
                                    // 정답내려감
                                    answerUpStart(); 
                                }, 2500);
                            }, (Great_time-0.3)*1000);
                        } else {                                                    // 본게임
                            // console.log("본 게임입니다!!")
                            memory_bag.state.addAnimation(0, "Idle", false, 0);
                            questObjList();
                            answerObjList();
                            answerUpStart();
                            PictureMemory_Shiq.play({
                                volume : 30
                            });
                            setTimeout(() => {
                                // 정답내려감
                                answerUpStart(); 
                            }, 4500);
                        }

                        
                    }
              
                    
                    position = 0;
                    Bag_ticker.stop();          
                }
            }
            Bag_ticker.add(app.animationleft);
        }
        
        function tickerbagStart(){
            // console.log("가방시작")
            // DATA : roundstart!
            
            Bag_ticker.start();
        }

        
        // 정답리스트 -- 랜덤이  들어가야 할 자리!!
        function answerObjList(){
            // ['Ball', 'Banana', 'Bear', 'Book', 'Camera', 'Cap', 'Car', 'Compass', 
            // 'Cup', 'Guitar', 'LunchBox', 'Palette', 'Pencil', 'Picture', 'Robot', 
            // 'Shoes', 'Sunglasses', 'Toothbrush', 'Toy', 'Umbrella']

            var quest_list = [
                Quest01,
                Quest02,
                Quest03,
                Quest04,
                Quest05,
                Quest06,
                Quest07,
            ]

            for(var i=0; i < answer_list[now_round_idx].length; i++){
                quest_list[i].skeleton.setSkinByName(answer_list[now_round_idx][i]);
                quest_list[i].state.addAnimation(0, 'Idle', false, 0);
            }
        }


        ///여기서 문제 받아와서 넣어주세요오오
        function questObjList(){
            // ['Ball', 'Banana', 'Bear', 'Book', 'Camera', 'Cap', 'Car', 'Compass', 
            // 'Cup', 'Guitar', 'LunchBox', 'Palette', 'Pencil', 'Picture', 'Robot', 
            // 'Shoes', 'Sunglasses', 'Toothbrush', 'Toy', 'Umbrella']

            // 문제들
            var boxobj_list = [
                Box01_obj,
                Box02_obj,
                Box03_obj,
                Box04_obj,
                Box05_obj,
                Box06_obj,
                Box07_obj,
                Box08_obj,
                Box09_obj,
                Box10_obj,
                Box11_obj,
                Box12_obj,
            ]

            

            for(var i=0; i < question_list[now_round_idx].length; i++){
                boxobj_list[i].skeleton.setSkinByName(question_list[now_round_idx][i]);
                boxobj_list[i].state.addAnimation(0, 'Idle', false, 0);
            }
        }


        // 클릭시 체크박스
        function boxobjClick(){

            let click_count = 0; 
            let answer_check_idx_list = [];         // 정답 체크

            //box 클릭 여부
            let box01_click = false;   
            let box02_click = false;   
            let box03_click = false;
            let box04_click = false;
            let box05_click = false;
            let box06_click = false;
            let box07_click = false;
            let box08_click = false;
            let box09_click = false;
            let box10_click = false;
            let box11_click = false;
            let box12_click = false;
            
            $('#mycanvas').on("pointerdown", function(e){
                Game_pop.play();
                //2개일뗴 클릭좌표
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
                    if(Istutorial){
                        game_02.stop();
                        game_02.play();
                    }else{
                        game_05.stop();
                        game_05.play();
                    }
                }

                switch(now_round_question[now_round_idx][1]){
                    case 2 :
                        if(Box01_obj.x + 230*scale*0.7 > x && Box01_obj.x - 230*scale*0.7 < x && Box01_obj.y+ 230 * scale*0.7 > y && Box01_obj.y - 230 * scale*0.7 < y){
                            // console.log("111")
                            if(box01_click){
                                Box01_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box01_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(0), 1)

          
                                box01_click_img.x = width * 2;
                                box01_click_img.y = height * 2;
                               
    
                            }else{
                                Box01_obj.state.addAnimation(0, 'Click', false, 0);
                                box01_click = true
                                click_count += 1
                                answer_check_idx_list.push(0)

                                box01_click_img.x = width * 0.29 + box_click_weight;
                                box01_click_img.y = height * 0.38;
                           
    
                               
                            }
                        }else if(Box02_obj.x + 230*scale*0.7 > x && Box02_obj.x - 230*scale*0.7 < x && Box02_obj.y+ 230 * scale*0.7 > y && Box02_obj.y - 230 * scale*0.7 < y){
                            // console.log("222")
                        
                            if(box02_click){
                                Box02_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box02_click = false;
                                click_count -= 1;
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(1), 1);

                                box02_click_img.x = width * 2;
                                box02_click_img.y = height * 2;
                            }else{
                                Box02_obj.state.addAnimation(0, 'Click', false, 0);
                                box02_click = true;
                                click_count += 1;
                                answer_check_idx_list.push(1);

                                box02_click_img.x = width * 0.51 + box_click_weight;
                                box02_click_img.y = height * 0.38;
                            }
                        }
                        break;

                    case 3:
                        if(Box01_obj.x + 230*scale*0.7 > x && Box01_obj.x - 230*scale*0.7 < x && Box01_obj.y+ 230 * scale*0.7 > y && Box01_obj.y - 230 * scale*0.7 < y){
                            // console.log("111")
                            if(box01_click){
                                Box01_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box01_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(0), 1)

                              
                                box01_click_img.x = width *2;          
                                box01_click_img.y = height *2;
                                
                                
                            }else{
                                Box01_obj.state.addAnimation(0, 'Click', false, 0);
                                box01_click = true
                                click_count += 1
                                answer_check_idx_list.push(0)

                                box01_click_img.x = width * 0.225 + box_click_weight;
                                box01_click_img.y = height * 0.4;

                                
                           
                            }
                            
                        }else if(Box02_obj.x + 230*scale*0.7 > x && Box02_obj.x - 230*scale*0.7 < x && Box02_obj.y+ 230 * scale*0.7 > y && Box02_obj.y - 230 * scale*0.7 < y){
                            // console.log("222")
                        
                            if(box02_click){
                                Box02_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box02_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(1), 1)

                                box02_click_img.x = width *2;          
                                box02_click_img.y = height *2;
                            }else{
                                Box02_obj.state.addAnimation(0, 'Click', false, 0);
                                box02_click = true
                                click_count += 1
                                answer_check_idx_list.push(1)

                                box02_click_img.x = width * 0.415 + box_click_weight;
                                box02_click_img.y = height * 0.4;
                            }
                        }else if(Box03_obj.x + 230*scale*0.7 > x && Box03_obj.x - 230*scale*0.7 < x && Box03_obj.y+ 230 * scale*0.7 > y && Box03_obj.y - 230 * scale*0.7 < y){
                            // console.log("222")
                        
                            if(box03_click){
                                Box03_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box03_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(2), 1)

                                box03_click_img.x = width *2;          
                                box03_click_img.y = height *2;
                            }else{
                                Box03_obj.state.addAnimation(0, 'Click', false, 0);
                                box03_click = true
                                click_count += 1
                                answer_check_idx_list.push(2)

                                box03_click_img.x = width * 0.605 + box_click_weight;
                                box03_click_img.y = height * 0.4;
                            }
                        }

                        break;

                    case 4:
                        if(Box01_obj.x + 230*scale*0.62 > x && Box01_obj.x - 230*scale*0.62 < x && Box01_obj.y+ 230 * scale*0.62 > y && Box01_obj.y - 230 * scale*0.62 < y){
                            // console.log("111")
                            if(box01_click){
                                Box01_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box01_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(0), 1)


                                box01_click_img.x = width *2;            
                                box01_click_img.y = height*2;
                                
                               
                            }else{
                                Box01_obj.state.addAnimation(0, 'Click', false, 0);
                                box01_click = true
                                click_count += 1
                                answer_check_idx_list.push(0)

                                box01_click_img.x = width * 0.325 + box_click_weight;
                                box01_click_img.y = height * 0.25;
                                
                            }
                            
                        }else if(Box02_obj.x + 230*scale*0.62 > x && Box02_obj.x - 230*scale*0.62 < x && Box02_obj.y+ 230 * scale*0.62 > y && Box02_obj.y - 230 * scale*0.62 < y){
                            // console.log("222")
                        
                            if(box02_click){
                                Box02_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box02_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(1), 1)

                                box02_click_img.x = width *2;            
                                box02_click_img.y = height*2;
                            }else{
                                Box02_obj.state.addAnimation(0, 'Click', false, 0);
                                box02_click = true
                                click_count += 1
                                answer_check_idx_list.push(1)

                                box02_click_img.x = width * 0.5  + box_click_weight;
                                box02_click_img.y = height * 0.25;
                                
                            }
                        }else if(Box03_obj.x + 230*scale*0.62 > x && Box03_obj.x - 230*scale*0.62 < x && Box03_obj.y+ 230 * scale*0.62 > y && Box03_obj.y - 230 * scale*0.62 < y){
                            // console.log("333")
                        
                            if(box03_click){
                                Box03_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box03_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(2), 1)
                                
                                box03_click_img.x = width *2;            
                                box03_click_img.y = height*2;
                            }else{
                                Box03_obj.state.addAnimation(0, 'Click', false, 0);
                                box03_click = true
                                click_count += 1
                                answer_check_idx_list.push(2)

                                
                                box03_click_img.x = width * 0.325  + box_click_weight;
                                box03_click_img.y = height * 0.56;
                            }
                        }else if(Box04_obj.x + 230*scale*0.62 > x && Box04_obj.x - 230*scale*0.62 < x && Box04_obj.y+ 230 * scale*0.62 > y && Box04_obj.y - 230 * scale*0.62 < y){
                            // console.log("444")
                        
                            if(box04_click){
                                Box04_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box04_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(3), 1)

                                box04_click_img.x = width *2;            
                                box04_click_img.y = height*2;

                                
                            }else{
                                Box04_obj.state.addAnimation(0, 'Click', false, 0);
                                box04_click = true
                                click_count += 1
                                answer_check_idx_list.push(3)

                                box04_click_img.x = width * 0.5 + box_click_weight ;
                                box04_click_img.y = height * 0.56;
                               
                            }
                        }
                        break;

                    case 5:
                    
                        if(Box01_obj.x + 230*scale*0.62 > x && Box01_obj.x - 230*scale*0.62 < x && Box01_obj.y+ 230 * scale*0.62 > y && Box01_obj.y - 230 * scale*0.62 < y){
                            // console.log("111")
                            if(box01_click){
                                Box01_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box01_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(0), 1)
                                box01_click_img.x = width * 2
                                box01_click_img.y = height *2;
                            }else{
                                Box01_obj.state.addAnimation(0, 'Click', false, 0);
                                box01_click = true
                                click_count += 1
                                answer_check_idx_list.push(0)

                                box01_click_img.x = width * 0.245 + box_click_weight
                                box01_click_img.y = height * 0.25;
                            }
                            
                        }else if(Box02_obj.x + 230*scale*0.62 > x && Box02_obj.x - 230*scale*0.62 < x && Box02_obj.y+ 230 * scale*0.62 > y && Box02_obj.y - 230 * scale*0.62 < y){
                            // console.log("222")
                        
                            if(box02_click){
                                Box02_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box02_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(1), 1)

                                box02_click_img.x = width * 2
                                box02_click_img.y = height *2;
                            }else{
                                Box02_obj.state.addAnimation(0, 'Click', false, 0);
                                box02_click = true
                                click_count += 1
                                answer_check_idx_list.push(1)

                                box02_click_img.x = width * 0.4205 + box_click_weight
                                box02_click_img.y = height * 0.25;
                            }
                        }else if(Box03_obj.x + 230*scale*0.62 > x && Box03_obj.x - 230*scale*0.62 < x && Box03_obj.y+ 230 * scale*0.62 > y && Box03_obj.y - 230 * scale*0.62 < y){
                            // console.log("333")
                        
                            if(box03_click){
                                Box03_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box03_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(2), 1)

                                box03_click_img.x = width * 2
                                box03_click_img.y = height * 2;
                            }else{
                                Box03_obj.state.addAnimation(0, 'Click', false, 0);
                                box03_click = true
                                click_count += 1
                                answer_check_idx_list.push(2)

                                box03_click_img.x = width * 0.595  + box_click_weight
                                box03_click_img.y = height * 0.25;
                            }
                        }else if(Box04_obj.x + 230*scale*0.62 > x && Box04_obj.x - 230*scale*0.62 < x && Box04_obj.y+ 230 * scale*0.62 > y && Box04_obj.y - 230 * scale*0.62 < y){
                            // console.log("444")
                        
                            if(box04_click){
                                Box04_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box04_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(3), 1)

                                box04_click_img.x = width * 2
                                box04_click_img.y = height * 2;
                            }else{
                                Box04_obj.state.addAnimation(0, 'Click', false, 0);
                                box04_click = true
                                click_count += 1
                                answer_check_idx_list.push(3)
                                box04_click_img.x = width * 0.33 + box_click_weight
                                box04_click_img.y = height * 0.56;
                            }
                        }else if(Box05_obj.x + 230*scale*0.62 > x && Box05_obj.x - 230*scale*0.62 < x && Box05_obj.y+ 230 * scale*0.62 > y && Box05_obj.y - 230 * scale*0.62 < y){
                            // console.log("555")
                        
                            if(box05_click){
                                Box05_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box05_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(4), 1)

                                box05_click_img.x = width * 2
                                box05_click_img.y = height * 2;
                            }else{
                                Box05_obj.state.addAnimation(0, 'Click', false, 0);
                                box05_click = true
                                click_count += 1
                                answer_check_idx_list.push(4)

                                box05_click_img.x = width * 0.505 + box_click_weight;
                                box05_click_img.y = height * 0.56; 
                            }
                        }

                        break;

                    case 6:
                        
                        if(Box01_obj.x + 230*scale*0.62 > x && Box01_obj.x - 230*scale*0.62 < x && Box01_obj.y+ 230 * scale*0.62 > y && Box01_obj.y - 230 * scale*0.62 < y){
                            // console.log("111")
                            if(box01_click){
                                Box01_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box01_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(0), 1)
                                box01_click_img.x = width * 2
                                box01_click_img.y = height * 2;
                            }else{
                                Box01_obj.state.addAnimation(0, 'Click', false, 0);
                                box01_click = true
                                click_count += 1
                                answer_check_idx_list.push(0)

                                box01_click_img.x = width * 0.245 + box_click_weight
                                box01_click_img.y = height * 0.25;
                            }
                            
                        }else if(Box02_obj.x + 230*scale*0.62 > x && Box02_obj.x - 230*scale*0.62 < x && Box02_obj.y+ 230 * scale*0.62 > y && Box02_obj.y - 230 * scale*0.62 < y){
                            // console.log("222")
                        
                            if(box02_click){
                                Box02_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box02_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(1), 1)
                                box02_click_img.x = width * 2
                                box02_click_img.y = height * 2;
                            }else{
                                Box02_obj.state.addAnimation(0, 'Click', false, 0);
                                box02_click = true
                                click_count += 1
                                answer_check_idx_list.push(1)

                                box02_click_img.x = width * 0.4205 + box_click_weight
                                box02_click_img.y = height * 0.25;
                            }
                        }else if(Box03_obj.x + 230*scale*0.62 > x && Box03_obj.x - 230*scale*0.62 < x && Box03_obj.y+ 230 * scale*0.62 > y && Box03_obj.y - 230 * scale*0.62 < y){
                            // console.log("333")
                        
                            if(box03_click){
                                Box03_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box03_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(2), 1)
                                box03_click_img.x = width * 2
                                box03_click_img.y = height * 2;
                            }else{
                                Box03_obj.state.addAnimation(0, 'Click', false, 0);
                                box03_click = true
                                click_count += 1
                                answer_check_idx_list.push(2)

                                box03_click_img.x = width * 0.595 + box_click_weight
                                box03_click_img.y = height * 0.25;
                            }
                        }else if(Box04_obj.x + 230*scale*0.62 > x && Box04_obj.x - 230*scale*0.62 < x && Box04_obj.y+ 230 * scale*0.62 > y && Box04_obj.y - 230 * scale*0.62 < y){
                            // console.log("444")
                        
                            if(box04_click){
                                Box04_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box04_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(3), 1)

                                box04_click_img.x = width * 2
                                box04_click_img.y = height * 2;
                            }else{
                                Box04_obj.state.addAnimation(0, 'Click', false, 0);
                                box04_click = true
                                click_count += 1
                                answer_check_idx_list.push(3)

                                box04_click_img.x = width * 0.245 + box_click_weight
                                box04_click_img.y = height * 0.56;
                            }
                        }else if(Box05_obj.x + 230*scale*0.62 > x && Box05_obj.x - 230*scale*0.62 < x && Box05_obj.y+ 230 * scale*0.62 > y && Box05_obj.y - 230 * scale*0.62 < y){
                            // console.log("555")
                        
                            if(box05_click){
                                Box05_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box05_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(4), 1)
                                box05_click_img.x = width * 2
                                box05_click_img.y = height * 2;
                            }else{
                                Box05_obj.state.addAnimation(0, 'Click', false, 0);
                                box05_click = true
                                click_count += 1
                                answer_check_idx_list.push(4)
                                box05_click_img.x = width * 0.4205 + box_click_weight 
                                box05_click_img.y = height * 0.56;
                            }
                        }else if(Box06_obj.x + 230*scale*0.62 > x && Box06_obj.x - 230*scale*0.62 < x && Box06_obj.y+ 230 * scale*0.62 > y && Box06_obj.y - 230 * scale*0.62 < y){
                            // console.log("666")
                        
                            if(box06_click){
                                Box06_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box06_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(5), 1)
                                box06_click_img.x = width * 2;
                                box06_click_img.y = height * 2;
                            }else{
                                Box06_obj.state.addAnimation(0, 'Click', false, 0);
                                box06_click = true
                                click_count += 1
                                answer_check_idx_list.push(5)
                                box06_click_img.x = width * 0.595 + box_click_weight
                                box06_click_img.y = height * 0.56;
                            }
                        }
                        break;

                    case 8:
                        if(Box01_obj.x + 230*scale*0.5 > x && Box01_obj.x - 230*scale*0.5 < x && Box01_obj.y+ 230 * scale*0.5 > y && Box01_obj.y - 230 * scale*0.5 < y){
                            // console.log("111")
                            if(box01_click){
                                Box01_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box01_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(0), 1)

                                box01_click_img.x = width * 2;
                                box01_click_img.y = height * 2;
                            }else{
                                Box01_obj.state.addAnimation(0, 'Click', false, 0);
                                box01_click = true
                                click_count += 1
                                answer_check_idx_list.push(0)

                                box01_click_img.x = width * 0.205 + box_click_weight;
                                box01_click_img.y = height * 0.29;
                            }
                            
                        }else if(Box02_obj.x + 230*scale*0.5 > x && Box02_obj.x - 230*scale*0.5 < x && Box02_obj.y+ 230 * scale*0.5 > y && Box02_obj.y - 230 * scale*0.5 < y){
                            // console.log("222")
                        
                            if(box02_click){
                                Box02_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box02_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(1), 1)

                                box02_click_img.x = width * 2;
                                box02_click_img.y = height * 2;
                            }else{
                                Box02_obj.state.addAnimation(0, 'Click', false, 0);
                                box02_click = true
                                click_count += 1
                                answer_check_idx_list.push(1)

                                box02_click_img.x = width * 0.355 + box_click_weight;
                                box02_click_img.y = height * 0.29;
                            }
                        }else if(Box03_obj.x + 230*scale*0.5 > x && Box03_obj.x - 230*scale*0.5 < x && Box03_obj.y+ 230 * scale*0.5 > y && Box03_obj.y - 230 * scale*0.5 < y){
                            // console.log("333")
                        
                            if(box03_click){
                                Box03_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box03_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(2), 1)

                                box03_click_img.x = width * 2;
                                box03_click_img.y = height * 2;
                            }else{
                                Box03_obj.state.addAnimation(0, 'Click', false, 0);
                                box03_click = true
                                click_count += 1
                                answer_check_idx_list.push(2)

                                box03_click_img.x = width * 0.505 + box_click_weight;
                                box03_click_img.y = height * 0.29;
                            }
                        }else if(Box04_obj.x + 230*scale*0.5 > x && Box04_obj.x - 230*scale*0.5 < x && Box04_obj.y+ 230 * scale*0.5 > y && Box04_obj.y - 230 * scale*0.5 < y){
                            // console.log("444")
                        
                            if(box04_click){
                                Box04_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box04_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(3), 1)

                                box04_click_img.x = width * 2;
                                box04_click_img.y = height * 2;
                            }else{
                                Box04_obj.state.addAnimation(0, 'Click', false, 0);
                                box04_click = true
                                click_count += 1
                                answer_check_idx_list.push(3)

                                box04_click_img.x = width * 0.6555 + box_click_weight;
                                box04_click_img.y = height * 0.29;
                            }
                        }else if(Box05_obj.x + 230*scale*0.5 > x && Box05_obj.x - 230*scale*0.5 < x && Box05_obj.y+ 230 * scale*0.5 > y && Box05_obj.y - 230 * scale*0.5 < y){
                            // console.log("555")
                        
                            if(box05_click){
                                Box05_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box05_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(4), 1)

                                box05_click_img.x = width * 2;
                                box05_click_img.y = height * 2;
                            }else{
                                Box05_obj.state.addAnimation(0, 'Click', false, 0);
                                box05_click = true
                                click_count += 1
                                answer_check_idx_list.push(4)

                                box05_click_img.x = width * 0.205 + box_click_weight;
                                box05_click_img.y = height * 0.57;
                            }
                        }else if(Box06_obj.x + 230*scale*0.5 > x && Box06_obj.x - 230*scale*0.5 < x && Box06_obj.y+ 230 * scale*0.5 > y && Box06_obj.y - 230 * scale*0.5 < y){
                            // console.log("666")
                        
                            if(box06_click){
                                Box06_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box06_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(5), 1)

                                box06_click_img.x = width * 2;
                                box06_click_img.y = height * 2;
                            }else{
                                Box06_obj.state.addAnimation(0, 'Click', false, 0);
                                box06_click = true
                                click_count += 1
                                answer_check_idx_list.push(5)

                                box06_click_img.x = width * 0.355 + box_click_weight
                                box06_click_img.y = height * 0.57;
                            }
                        }else if(Box07_obj.x + 230*scale*0.5 > x && Box07_obj.x - 230*scale*0.5 < x && Box07_obj.y+ 230 * scale*0.5 > y && Box07_obj.y - 230 * scale*0.5 < y){
                            // console.log("777")
                        
                            if(box07_click){
                                Box07_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box07_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(6), 1)

                                box07_click_img.x = width * 2;
                                box07_click_img.y = height * 2;
                            }else{
                                Box07_obj.state.addAnimation(0, 'Click', false, 0);
                                box07_click = true
                                click_count += 1
                                answer_check_idx_list.push(6)

                                box07_click_img.x = width * 0.505 + box_click_weight;
                                box07_click_img.y = height * 0.57;
                            }
                        }else if(Box08_obj.x + 230*scale*0.5 > x && Box08_obj.x - 230*scale*0.5 < x && Box08_obj.y+ 230 * scale*0.5 > y && Box08_obj.y - 230 * scale*0.5 < y){
                            // console.log("888")
                        
                            if(box08_click){
                                Box08_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box08_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(7), 1)

                                box08_click_img.x = width * 2;
                                box08_click_img.y = height * 2;
                            }else{
                                Box08_obj.state.addAnimation(0, 'Click', false, 0);
                                box08_click = true
                                click_count += 1
                                answer_check_idx_list.push(7)

                                box08_click_img.x = width * 0.6555 + box_click_weight;
                                box08_click_img.y = height * 0.57;
                            }
                        }
                        break;

                        case 10:
                
                            if(Box01_obj.x + 230*scale*0.45 > x && Box01_obj.x - 230*scale*0.45 < x && Box01_obj.y+ 230 * scale*0.45 > y && Box01_obj.y - 230 * scale*0.45 < y){
                                // console.log("111")
                                if(box01_click){
                                    Box01_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box01_click = false;
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(0), 1)

                                    box01_click_img.x = width * 2;
                                    box01_click_img.y = height * 2;
                                    
                                }else{
                                    Box01_obj.state.addAnimation(0, 'Click', false, 0);
                                    box01_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(0)

                                    box01_click_img.x = width * 0.19 + box_click_weight; 
                                    box01_click_img.y = height * 0.35;
                                }
                                
                            }else if(Box02_obj.x + 230*scale*0.45 > x && Box02_obj.x - 230*scale*0.45 < x && Box02_obj.y+ 230 * scale*0.45 > y && Box02_obj.y - 230 * scale*0.45 < y){
                                // console.log("222")
                            
                                if(box02_click){
                                    Box02_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box02_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(1), 1)

                                    box02_click_img.x = width * 2;
                                    box02_click_img.y = height * 2;

                                }else{
                                    Box02_obj.state.addAnimation(0, 'Click', false, 0);
                                    box02_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(1)

                                    box02_click_img.x = width * 0.31625 + box_click_weight;
                                    box02_click_img.y = height * 0.35;
                                }
                            }else if(Box03_obj.x + 230*scale*0.45 > x && Box03_obj.x - 230*scale*0.45 < x && Box03_obj.y+ 230 * scale*0.45 > y && Box03_obj.y - 230 * scale*0.45 < y){
                                // console.log("333")
                            
                                if(box03_click){
                                    Box03_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box03_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(2), 1)

                                    box03_click_img.x = width * 2;
                                    box03_click_img.y = height * 2;
                                    
                                }else{
                                    Box03_obj.state.addAnimation(0, 'Click', false, 0);
                                    box03_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(2)

                                    box03_click_img.x = width * 0.4425 + box_click_weight; 
                                    box03_click_img.y = height * 0.35;
                                }
                            }else if(Box04_obj.x + 230*scale*0.45 > x && Box04_obj.x - 230*scale*0.45 < x && Box04_obj.y+ 230 * scale*0.45 > y && Box04_obj.y - 230 * scale*0.45 < y){
                                // console.log("444")
                            
                                if(box04_click){
                                    Box04_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box04_click = false;
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(3), 1)
                                    box04_click_img.x = width * 2;
                                    box04_click_img.y = height * 2;
                                }else{
                                    Box04_obj.state.addAnimation(0, 'Click', false, 0);
                                    box04_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(3)
                                    box04_click_img.x = width * 0.56875 + box_click_weight;

                                    box04_click_img.y = height * 0.35;
                                }
                            }else if(Box05_obj.x + 230*scale*0.45 > x && Box05_obj.x - 230*scale*0.45 < x && Box05_obj.y+ 230 * scale*0.45 > y && Box05_obj.y - 230 * scale*0.45 < y){
                                // console.log("555")
                            
                                if(box05_click){
                                    Box05_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box05_click = false;
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(4), 1)
                                    box05_click_img.x = width * 2;
                                    box05_click_img.y = height * 2;
                                }else{
                                    Box05_obj.state.addAnimation(0, 'Click', false, 0);
                                    box05_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(4)

                                    box05_click_img.x = width * 0.695 + box_click_weight;
                                    box05_click_img.y = height * 0.35;
                                }
                            }else if(Box06_obj.x + 230*scale*0.45 > x && Box06_obj.x - 230*scale*0.45 < x && Box06_obj.y+ 230 * scale*0.45 > y && Box06_obj.y - 230 * scale*0.45 < y){
                                // console.log("666")
                            
                                if(box06_click){
                                    Box06_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box06_click = false;
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(5), 1)
                                    box06_click_img.x = width * 2;
                                    box06_click_img.y = height * 2;
                                }else{
                                    Box06_obj.state.addAnimation(0, 'Click', false, 0);
                                    box06_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(5)

                                    box06_click_img.x = width * 0.19 + box_click_weight;
                                    box06_click_img.y = height * 0.57;
                                    
                                }
                            }else if(Box07_obj.x + 230*scale*0.45 > x && Box07_obj.x - 230*scale*0.45 < x && Box07_obj.y+ 230 * scale*0.45 > y && Box07_obj.y - 230 * scale*0.45 < y){
                                // console.log("777")
                            
                                if(box07_click){
                                    Box07_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box07_click = false;
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(6), 1)
                                    box07_click_img.x = width * 2;
                                    box07_click_img.y = height * 2;
                                }else{
                                    Box07_obj.state.addAnimation(0, 'Click', false, 0);
                                    box07_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(6)
                                    box07_click_img.x = width * 0.31625 + box_click_weight;
                                    box07_click_img.y = height * 0.57;
                                }
                            }else if(Box08_obj.x + 230*scale*0.45 > x && Box08_obj.x - 230*scale*0.45 < x && Box08_obj.y+ 230 * scale*0.45 > y && Box08_obj.y - 230 * scale*0.45 < y){
                                // console.log("888")
                            
                                if(box08_click){
                                    Box08_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box08_click = false;
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(7), 1)
                                    box08_click_img.x = width * 2;
                                    box08_click_img.y = height * 2;
                                }else{
                                    Box08_obj.state.addAnimation(0, 'Click', false, 0);
                                    box08_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(7)
                                    box08_click_img.x = width * 0.4425 + box_click_weight;
                                    box08_click_img.y = height * 0.57;
                                }
                            }else if(Box09_obj.x + 230*scale*0.45 > x && Box09_obj.x - 230*scale*0.45 < x && Box09_obj.y+ 230 * scale*0.45 > y && Box09_obj.y - 230 * scale*0.45 < y){
                                // console.log("999")
                            
                                if(box09_click){
                                    Box09_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box09_click = false;
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(8), 1)
                                    box09_click_img.x = width * 2;
                                    box09_click_img.y = height * 2;
                                }else{
                                    Box09_obj.state.addAnimation(0, 'Click', false, 0);
                                    box09_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(8)
                                    box09_click_img.x = width * 0.56875 + box_click_weight; 
                                    box09_click_img.y = height * 0.57;
                                }
                            }else if(Box10_obj.x + 230*scale*0.45 > x && Box10_obj.x - 230*scale*0.45 < x && Box10_obj.y+ 230 * scale*0.45 > y && Box10_obj.y - 230 * scale*0.45 < y){
                                // console.log("101010")
                            
                                if(box10_click){
                                    Box10_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box10_click = false;
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(9), 1)
                                    box10_click_img.x = width * 2;
                                    box10_click_img.y = height * 2;
                                }else{
                                    Box10_obj.state.addAnimation(0, 'Click', false, 0);
                                    box10_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(9)
                                    box10_click_img.x = width * 0.695 + box_click_weight; 
                                    box10_click_img.y = height * 0.57;
                                }
                            }
                            break;

                        case 12:
                            if(Box01_obj.x + 230*scale*0.5 > x && Box01_obj.x - 230*scale*0.5 < x && Box01_obj.y+ 230 * scale*0.5 > y && Box01_obj.y - 230 * scale*0.5 < y){
                                // console.log("111")
                                if(box01_click){
                                    Box01_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box01_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(0), 1)

                                    box01_click_img.x = width * 2;
                                    box01_click_img.y = height * 2;
                                }else{
                                    Box01_obj.state.addAnimation(0, 'Click', false, 0);
                                    box01_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(0)

                                    box01_click_img.x = width * 0.245 + box_click_weight;
                                    box01_click_img.y = height * 0.225;
                                }
                                
                            }else if(Box02_obj.x + 230*scale*0.5 > x && Box02_obj.x - 230*scale*0.5 < x && Box02_obj.y+ 230 * scale*0.5 > y && Box02_obj.y - 230 * scale*0.5 < y){
                                // console.log("222")
                            
                                if(box02_click){
                                    Box02_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box02_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(1), 1)

                                    box02_click_img.x = width * 2;
                                    box02_click_img.y = height * 2;
                                }else{
                                    Box02_obj.state.addAnimation(0, 'Click', false, 0);
                                    box02_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(1)

                                    box02_click_img.x = width * 0.375 + box_click_weight; 
                                    box02_click_img.y = height * 0.225 
                                }
                            }else if(Box03_obj.x + 230*scale*0.5 > x && Box03_obj.x - 230*scale*0.5 < x && Box03_obj.y+ 230 * scale*0.5 > y && Box03_obj.y - 230 * scale*0.5 < y){
                                // console.log("333")
                            
                                if(box03_click){
                                    Box03_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box03_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(2), 1)

                                    box03_click_img.x = width * 2;
                                    box03_click_img.y = height * 2;
                                }else{
                                    Box03_obj.state.addAnimation(0, 'Click', false, 0);
                                    box03_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(2)

                                    box03_click_img.x = width * 0.505 + box_click_weight;
                                    box03_click_img.y = height * 0.225;
                                }
                            }else if(Box04_obj.x + 230*scale*0.5 > x && Box04_obj.x - 230*scale*0.5 < x && Box04_obj.y+ 230 * scale*0.5 > y && Box04_obj.y - 230 * scale*0.5 < y){
                                // console.log("444")
                            
                                if(box04_click){
                                    Box04_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box04_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(3), 1)

                                    box04_click_img.x = width * 2;
                                    box04_click_img.y = height * 2;
                                }else{
                                    Box04_obj.state.addAnimation(0, 'Click', false, 0);
                                    box04_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(3)

                                    box04_click_img.x = width * 0.635 + box_click_weight;
                                    box04_click_img.y = height * 0.225;
                                }
                            }else if(Box05_obj.x + 230*scale*0.5 > x && Box05_obj.x - 230*scale*0.5 < x && Box05_obj.y+ 230 * scale*0.5 > y && Box05_obj.y - 230 * scale*0.5 < y){
                                // console.log("555")
                            
                                if(box05_click){
                                    Box05_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box05_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(4), 1)

                                    box05_click_img.x = width * 2;
                                    box05_click_img.y = height * 2;
                                }else{
                                    Box05_obj.state.addAnimation(0, 'Click', false, 0);
                                    box05_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(4)

                                    box05_click_img.x = width * 0.245 + box_click_weight;
                                    box05_click_img.y = height * 0.45;
                                }
                            }else if(Box06_obj.x + 230*scale*0.5 > x && Box06_obj.x - 230*scale*0.5 < x && Box06_obj.y+ 230 * scale*0.5 > y && Box06_obj.y - 230 * scale*0.5 < y){
                                // console.log("666")
                            
                                if(box06_click){
                                    Box06_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box06_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(5), 1)

                                    box06_click_img.x = width * 2;
                                    box06_click_img.y = height * 2;
                                }else{
                                    Box06_obj.state.addAnimation(0, 'Click', false, 0);
                                    box06_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(5)

                                    box06_click_img.x = width * 0.375 + box_click_weight; 
                                    box06_click_img.y = height * 0.45;
                                }
                            }else if(Box07_obj.x + 230*scale*0.5 > x && Box07_obj.x - 230*scale*0.5 < x && Box07_obj.y+ 230 * scale*0.5 > y && Box07_obj.y - 230 * scale*0.5 < y){
                                // console.log("777")
                            
                                if(box07_click){
                                    Box07_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box07_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(6), 1)

                                    box07_click_img.x = width * 2;
                                    box07_click_img.y = height * 2;
                                }else{
                                    Box07_obj.state.addAnimation(0, 'Click', false, 0);
                                    box07_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(6)

                                    box07_click_img.x = width * 0.505 + box_click_weight; 
                                    box07_click_img.y = height * 0.45;
                                }
                            }else if(Box08_obj.x + 230*scale*0.5 > x && Box08_obj.x - 230*scale*0.5 < x && Box08_obj.y+ 230 * scale*0.5 > y && Box08_obj.y - 230 * scale*0.5 < y){
                                // console.log("888")
                            
                                if(box08_click){
                                    Box08_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box08_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(7), 1)

                                    box08_click_img.x = width * 2;
                                    box08_click_img.y = height * 2;
                                }else{
                                    Box08_obj.state.addAnimation(0, 'Click', false, 0);
                                    box08_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(7)

                                    box08_click_img.x = width * 0.635 + box_click_weight;
                                    box08_click_img.y = height * 0.45;
                                }
                            }else if(Box09_obj.x + 230*scale*0.5 > x && Box09_obj.x - 230*scale*0.5 < x && Box09_obj.y+ 230 * scale*0.5 > y && Box09_obj.y - 230 * scale*0.5 < y){
                                // console.log("999")
                            
                                if(box09_click){
                                    Box09_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box09_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(8), 1)

                                    box09_click_img.x = width * 2;
                                    box09_click_img.y = height * 2;
                                }else{
                                    Box09_obj.state.addAnimation(0, 'Click', false, 0);
                                    box09_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(8)

                                    box09_click_img.x = width * 0.245 + box_click_weight;
                                    box09_click_img.y = height * 0.675;
                                }
                            }else if(Box10_obj.x + 230*scale*0.5 > x && Box10_obj.x - 230*scale*0.5 < x && Box10_obj.y+ 230 * scale*0.5 > y && Box10_obj.y - 230 * scale*0.5 < y){
                                // console.log("101010")
                            
                                if(box10_click){
                                    Box10_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box10_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(9), 1)

                                    box10_click_img.x = width * 2;
                                    box10_click_img.y = height * 2;
                                }else{
                                    Box10_obj.state.addAnimation(0, 'Click', false, 0);
                                    box10_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(9)

                                    box10_click_img.x = width * 0.375 + box_click_weight;
                                    box10_click_img.y = height * 0.675;
                                }
                            }else if(Box11_obj.x + 230*scale*0.5 > x && Box11_obj.x - 230*scale*0.5 < x && Box11_obj.y+ 230 * scale*0.5 > y && Box11_obj.y - 230 * scale*0.5 < y){
                                // console.log("111111")
                            
                                if(box11_click){
                                    Box11_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box11_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(10), 1)

                                    box11_click_img.x = width * 2;
                                    box11_click_img.y = height * 2;
                                }else{
                                    Box11_obj.state.addAnimation(0, 'Click', false, 0);
                                    box11_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(10)

                                    box11_click_img.x = width * 0.505 + box_click_weight;
                                    box11_click_img.y = height * 0.675;
                                }
                            }else if(Box12_obj.x + 230*scale*0.5 > x && Box12_obj.x - 230*scale*0.5 < x && Box12_obj.y+ 230 * scale*0.5 > y && Box12_obj.y - 230 * scale*0.5 < y){
                                // console.log("121212")
                            
                                if(box12_click){
                                    Box12_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box12_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(11), 1)

                                    box12_click_img.x = width * 2;
                                    box12_click_img.y = height * 2;
                                }else{
                                    Box12_obj.state.addAnimation(0, 'Click', false, 0);
                                    box12_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(11)

                                    box12_click_img.x = width * 0.635 + box_click_weight;
                                    box12_click_img.y = height * 0.675;
                                }
                            }
                            break;
                }

                if(click_count == now_round_question[now_round_idx][0] ){
                    $('#mycanvas').unbind('pointerdown');
                    round_end_time =  new Date();
                    memory_bag.x = width * 0.5;
                    memory_bag.y = height * 0.556;

                    // 정답비교
                    let try_answer_count = 0;
                    for (var i = 0; i < answer_check_idx_list.length; i++) {
                        // Check if we have nested arrays
                        if (answer_idx_list[now_round_idx].indexOf(answer_check_idx_list[i]) == -1) {
                        } else { 
                            try_answer_count += 1;
                        }           
                    }       
                    console.log("정답 갯수 : " + now_round_question[now_round_idx][0], " 맞춘 개수 : " + try_answer_count);
                    // pmRoundAnsUserCorrect:[{"performedDataList": [{"answerCount": 1, "currentUserAnswerCount": 1}]}

                    if(now_round_question[now_round_idx] == now_round_question[now_round_idx-1]){
                        console.log("재도전!!")
                    }
                    if(try_answer_count == now_round_question[now_round_idx][0]){
                        // console.log("답답")
                        let Success = memory_bag.state.addAnimation(0, 'Success', false, 0);
                        let Success_time = Success.animationEnd;
                        Game_Right.play();
                        if(fail_count != 0){
                            fail_count = 0;
                            if(!Istutorial){
                                common_heart1.state.setAnimation(0, 'EmptyToFull', false);
                                common_heart2.state.setAnimation(0, 'EmptyToFull', false);
                                
                                common_heart1.state.addAnimation(0, 'Full', true);
                                common_heart2.state.addAnimation(0, 'Full', true);
                            }
                        }
                        if(!Istutorial){
                            round_end_time = new Date();
                            round_total_time = round_end_time - round_start_time;
                            pmMaxCnsctvSuccessCount += 1;
                            pmNumOfSuccessRound += 1;
                            console.log(pmMaxCnsctvSuccessCount, EX_pmMaxCnsctvSuccessCount)

                            pmResponseTimeList.push({"isCorrect": true, "responseTime": round_total_time/1000});
                            console.log("성공! ", {"isCorrect": true, "responseTime": round_total_time/1000});

                            performedDataList.push({"answerCount": now_round_question[now_round_idx][0], "currentUserAnswerCount": try_answer_count});
                            pmRoundAnsUserCorrect.push({"performedDataList":performedDataList});
                            performedDataList = [];
                        }

                        setTimeout(() => {
                            tickerbagStart();
                        }, Success_time*1000);
                    }else{
                        // console.log("틀틀")
                        Game_Wrong.play();

                        let fail = memory_bag.state.addAnimation(0, 'Fail', false, 0);
                        let fail_time = fail.animationEnd;
                        fail_count += 1;

                        if(!Istutorial){
                            round_end_time = new Date();
                            round_total_time = round_end_time - round_start_time;
                            // 현재 연속점수가 이전 연속점수보다 크거나 같으면 저장!
                            if(pmMaxCnsctvSuccessCount >= EX_pmMaxCnsctvSuccessCount){
                                EX_pmMaxCnsctvSuccessCount = pmMaxCnsctvSuccessCount;
                            }
                            console.log(pmMaxCnsctvSuccessCount, EX_pmMaxCnsctvSuccessCount)
                            pmMaxCnsctvSuccessCount = 0;
                            pmResponseTimeList.push({"isCorrect": false, "responseTime": round_total_time/1000});
                            console.log("실패! ", {"isCorrect": false, "responseTime": round_total_time/1000});

                            if(fail_count == 1 && !Istutorial){
                                performedDataList.push({"answerCount": now_round_question[now_round_idx][0], "currentUserAnswerCount": try_answer_count});
    
                                common_heart2.state.setAnimation(0, 'Full2Empty', false);
            
                                common_heart1.state.addAnimation(0, 'Full', true);
                                common_heart2.state.addAnimation(0, 'Empty', true);
            
                            }else if(fail_count == 2 && !Istutorial){
                                if(now_round_question[now_round_idx] == now_round_question[now_round_idx-1]){
                                    console.log("재도전!! - PUSH")
                                    performedDataList.push({"answerCount": now_round_question[now_round_idx][0], "currentUserAnswerCount": try_answer_count});
                                    pmRoundAnsUserCorrect.push({"performedDataList":performedDataList});
                                    performedDataList = [];
                                }
            
                                common_heart1.state.setAnimation(0, 'Full2Empty', false);
            
                                common_heart1.state.addAnimation(0, 'Empty', true);
                                common_heart2.state.addAnimation(0, 'Empty', true);
                            }

                        }
                        

                        setTimeout(() => {
                            tickerbagStart();
                        }, fail_time*1000);
                    }
                }
            })
        }



        app.start();
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

function getlist(n, k){
    // console.log(n,k)

    // 라운드 ANSWER LIST 
    var round_answer_list = new Array(n);
   
    // 라운드 ANSWER INDEX LIST 
    var round_answer_idx_list = new Array();

    // 라운드 QUESTION LIST 
    var round_question_list = new Array(k);

    var obj_list_duplicate = [...obj_list];     // 배열 복사


    // ANSWER LIST 만들기
    for (var i=0; i < k; i++) {
        // console.log(obj_list_duplicate.length);
        const random = Math.floor(Math.random() * obj_list_duplicate.length);
        var answer = obj_list_duplicate[random];
        // console.log(answer);

        // 정답 만들기
        if(i == 0){
            round_question_list[i] = answer;
            obj_list_duplicate.splice(random, 1);
        } else if(round_question_list.indexOf(answer) == -1){
            round_question_list[i] = answer;
            obj_list_duplicate.splice(random, 1);
        } else {
            obj_list_duplicate.splice(random, 1);
            const new_random = Math.floor(Math.random() * obj_list_duplicate.length);
            var new_answer = obj_list_duplicate[new_random];
            // console.log(new_answer);
            round_question_list[i] = new_answer;
        } 
    }

    // 정답 인덱스 만들기
    var j = 0;
    while (j < n) {
        let num_random = Math.floor(Math.random() * k);
        if (round_answer_idx_list.indexOf(num_random) == -1) {
            round_answer_idx_list.push(num_random);
            j++;
        }
    }


    // ANSWER LIST 만들기
    for (var w=0; w < n; w++) {
        round_answer_list[w] = round_question_list[round_answer_idx_list[w]]
    }

    answer_list.push(round_answer_list);
    answer_idx_list.push(round_answer_idx_list);
    question_list.push(round_question_list);

    // console.log("OBJ LIST : ", obj_list);
    // console.log("ROUND ANSWER LIST : ", round_answer_list);
    // console.log("ROUND ANSWER INDEX LIST : ", round_answer_idx_list);
    // console.log("ROUND QUEST INDEX LIST : ", round_question_list);
}




function game_end(){
    // 총 플레이시간
    end_time = new Date();
    pmPerformanceTime = end_time - start_time;

    // var pmPerformanceTime;
    
    // var EX_pmMaxCnsctvSuccessCount = 0
    // var pmNumOfPerformedRound = 0; 
    // var pmNumOfSuccessRound = 0; 
    // var pmMaxCnsctvSuccessCount = 0; 
    // var pmResponseTimeList = [];
    // var pmRoundAnsUserCorrect = [];
    // var performedDataList = [];
    
    // alert("게임이 종료되었습니다.");
    console.log("총 수행 라운드 : ", pmNumOfPerformedRound, pmResponseTimeList.length, pmRoundAnsUserCorrect.length);
    console.log("총 정답 라운드 : ", pmNumOfSuccessRound);

    // 최대 연속 성공 값
    if(EX_pmMaxCnsctvSuccessCount >= pmMaxCnsctvSuccessCount){
        pmMaxCnsctvSuccessCount = EX_pmMaxCnsctvSuccessCount;
    }
    //  else {
    //     pmMaxCnsctvSuccessCount -= 1;
    // }

    // if(pmMaxCnsctvSuccessCount < 0){
    //     pmMaxCnsctvSuccessCount = 0;
    // }

    console.log("연속 정답 개수 : ", pmMaxCnsctvSuccessCount);
    console.log("전체 라운드 반응시간 리스트 : ", pmResponseTimeList);
    console.log("전체 라운드 맞춘개수 리스트 : ", pmRoundAnsUserCorrect);
    console.log("총 수행 시간 : ", pmPerformanceTime / 1000);


    var send_data = {
        "phoneNum" : "01030727270",
        "name" : "이준구",
        "taskId" : 6,                   
        "pmNumOfPerformedRound" : pmNumOfPerformedRound,
        "pmNumOfSuccessRound" : pmNumOfSuccessRound,
        "pmMaxCnsctvSuccessCount" : pmMaxCnsctvSuccessCount,
        "pmResponseTimeList" : pmResponseTimeList,
        "pmPerformanceTime" : pmPerformanceTime / 1000,
        "pmRoundAnsUserCorrect": pmRoundAnsUserCorrect
    }

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
            window.location.href = "/ticto/dccs";
        },
        error: function(json){
            console.log(json);
        }
    });
}