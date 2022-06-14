var app;    // PIXI JS APPLICATION

// 공통 UI
var common_heart1;                      // 목숨 1번
var common_heart2;                      // 목숨 2번
var common_heart3;                      // 목숨 3번

let grayscale ;                         // GRAY SCALE


// 문제 정답
let toollist_66 = false                 // LIST 추출 분기 true : (추출 X) or false : (추출 O)
var tools_list = [];                    // 전체 TOOL LIST - 연속으로 같은 값
var answer_list = new Array(66);        // 전체 ANSWER LIST - 연속으로 같은 값 XXX (66 round)
var answer_idx_list = new Array(66);    // 전체 ANSWER INDEX LIST - 연속으로 같은 값 XXX (66 round)
var question_list = new Array(66);      // 전체 QUESTION LIST - 정답과 index를 결합한 5개씩 66배열 (66 round)

// 전역변수로 사용되는 SPINE
let crock ;                             // 루디, 째깍이 background

// TIME BAR
let timer ;                             // 아래 TIME BAR 초록이미지
let timer_bg;                           // 아래 TIME BAR 배경이미지
let timer_text;                         // 아래 TIME TEXT ( 00:00 )
var code_timer;                         // TIME BAR setinterval

// TICKER 모음 ( IMAGE ANIMATION )
var table_box_show;                     // 등장, 사라짐 TICKER
var table_box_hide = false;             // 등장, 사라짐 true : (hide) or false : (show)

var timer_start;                        // 타이머 시간 TICKER
var timer_start_hide = false;           // 타이머 시간 true : (START) or false : (00:00)

var timer_show;                         // TIMER 등장, 사라짐 TICKER    
var timer_show_hide = false;            // 등장, 사라짐 true : (hide) or false : (show)


// 튜토리얼 본게임 분기
let Istutorial = true;                  // TUTORIAL 분기
let tutorial_succes_count = 0;          // TUTORIAL 끝나는 조건


// 본게임
let total_round = 0;
var fail_count = 0;                     // 연속 3번 틀릴 시 게임 END

// 데이터모음
// rowNum : AI
// phoneNum : 01000000000               
// name : TEST
// taskId : 1                       
// ssNumOfPerformedRound : 66
// ssNumOfSuccessRound : 60
// ssMaxCnsctvSuccessCount : 42
// ssResponseTimeList : [{"isCorrect": true, "responseTime": 0.5350000262260437}, {"isCorrect": true, "responseTime": 0.5350000262260437}, ]
// ssPerformanceTime : 120.019
// logdate : 2022-01-27 17:20:53.740

var ssNumOfSuccessRound = 0;            // 정답라운드 횟수
var ssMaxCnsctvSuccessCountlist = [];   // 연속정답 리스트
var ssMaxCnsctvSuccessCount = 0;        // 최대연속정답
var start_time;                         // START 시간
var end_time;                           // END 시간
var ssResponseTimeList = [];            // 반응시간  [{"isCorrect": true, "responseTime": 0.5350000262260437}]
var ssPerformanceTime = 0;              // 전체 플레이시간
var round_start_time ;
var round_end_time ;


$(function () {

    const canvas = document.getElementById('mycanvas');
    const container = document.getElementById('container');

    // CANVAS 비율 1920 * 1080
    var width  = window.innerWidth;
    var height = width * 0.5625;
    var scale = width/1920; 

    // 스크롤 생기지 않게, 화면에 딱 맞게 수정.
    if(height > window.innerHeight){
        height = window.innerHeight;
        width = height / 0.5625;
        scale = width / 1920; 
    }

    // PIXI.JS 이용하여 CANVAS 생성
    app = new PIXI.Application({
        view: canvas,
        width: width,
        height: height,
    });
    
    container.appendChild(app.view);

    // load spine data
    app.loader
        .add('wisc_tutorial', 'spine/WISC/Spine/WISCTutorial.json')
        .add('wisc_crock', 'spine/WISC/Spine/WISCCrock.json')
        .add('common_start', 'spine/WISC/common/Spine/Start.json')
        .add('wisc_tools', 'spine/WISC/Spine/WISCTools.json')
        .add('common_OXE', 'spine/WISC/common/Spine/OXEffect.json')
        .add('common_rucro', 'spine/WISC/common/Spine/RuCroEffect.json')
        .add('common_heart', 'spine/WISC/common/Spine/UIHeart.json')

        .add('grey_scale', 'grey_scale.png')
        .add('WISCBg', 'spine/WISC/Sprite/WISCBg.png')
        .add('WISCTable', 'spine/WISC/Sprite/WISCTable.png')
        .add('UIWISCBox', 'spine/WISC/Sprite/UIWISCBox.png')
        .add('WISCTime_01', 'spine/WISC/Sprite/WISCTime_01.png')
        .add('WISCTime_02', 'spine/WISC/Sprite/WISCTime_02.png')
        .add('UIBox_01', 'spine/WISC/common/UIBox_02.png')
        .add('UIPause', 'spine/WISC/common/UIPause.png')
        .add('UISound', 'spine/WISC/common/UISound.png')
        .load(onAssetsLoaded);
 


    // CANVAS TOUCH 허용
    app.stage.interactive = true;
    app.stage.buttonMode = true;
    app.stage.sortableChildren = false;

    // SPINE DATA 로드 완료되면 시작.
    function onAssetsLoaded(loader, res) {

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
        common_heart1.zIndex = 106;
        common_heart1.scale.set(scale * 0.6);
        
        let common_heart2 = new PIXI.spine.Spine(res.common_heart.spineData);
        common_heart2.x = width * 0.1;
        common_heart2.y = height * 0.19;
        common_heart2.zIndex = 105;
        common_heart2.scale.set(scale * 0.6);

        let common_heart3 = new PIXI.spine.Spine(res.common_heart.spineData);
        common_heart3.x = width * 0.15;
        common_heart3.y = height * 0.19;
        common_heart3.zIndex = 104;
        common_heart3.scale.set(scale * 0.6);

        let UIBox_text = new PIXI.Text("째깍이가 말하는 물건을 빨리 터치하세요!",{
            fill : 0x000000,
            fontSize : "40px",
            fontWeight : "Bold"
        })
        UIBox_text.x = width * 0.12;
        UIBox_text.y = height * 0.06;
        UIBox_text.zIndex = 111;
        UIBox_text.scale.set(scale);

        let UIBox_01 = PIXI.Sprite.from(res.UIBox_01.texture);
        UIBox_01.position.x = width * 0.1;
        UIBox_01.position.y = height * 0.03;
        UIBox_01.zIndex = 101;
        UIBox_01.scale.set(scale*0.5, scale*0.45);

        let UIPause = PIXI.Sprite.from(res.UIPause.texture);
        UIPause.position.x = width * 0.91;
        UIPause.position.y = height * 0.03;
        UIPause.zIndex = 102;
        UIPause.scale.set(scale);

        let UISound = PIXI.Sprite.from(res.UISound.texture);
        UISound.position.x = width * 0.02;
        UISound.position.y = height * 0.03;
        UISound.zIndex = 103;
        UISound.scale.set(scale);

        //tutorial
        let tutorial = new PIXI.spine.Spine(res.wisc_tutorial.spineData);

        tutorial.x = width/2
        tutorial.y = height/2
        tutorial.scale.set(scale);
        app.stage.addChild(tutorial);

        let take01 = tutorial.state.addAnimation(0, 'Take_01', false);      // 튜토리얼 스타트
        let take01_time = take01.animationEnd * 0 

        let wait_time = 0

        setTimeout(() => {
            app.stage.removeChild(tutorial);

            let background = PIXI.Sprite.from(res.WISCBg.texture);
            background.position.y = 0;
            background.position.x = 0;
            background.scale.set(scale);
            app.stage.addChild(background);
            

            // 백그라운드 - 루디, 째깍이
            crock = new PIXI.spine.Spine(res.wisc_crock.spineData);

            crock.x = width/2.01
            crock.y = height/3
            crock.scale.set(scale);
            app.stage.addChild(crock);
            let NoBalloon = crock.state.addAnimation(0, 'NoBalloon', true);
            let NoBalloon_time = NoBalloon.animationEnd
            wait_time = NoBalloon_time
            // console.log("1", wait_time)


            // 튜토리얼 손가락 움직이기 - 루디, 째깍이
            let tu_ClickAnswer = new PIXI.spine.Spine(res.wisc_tutorial.spineData);

            tu_ClickAnswer.x = width/2
            tu_ClickAnswer.y = height/2
            tu_ClickAnswer.scale.set(scale);
            app.stage.addChild(tu_ClickAnswer);
            

            let ClickAnswer = tu_ClickAnswer.state.addAnimation(1, 'ClickAnswer', false, NoBalloon_time);
            let ClickAnswer_time = ClickAnswer.animationEnd


            wait_time += ClickAnswer_time
            // console.log("2", wait_time)


            setTimeout(() => {
                app.stage.removeChild(tu_ClickAnswer);
                btn_click("blue");
            }, wait_time * 1000);
                            
        }, take01_time*1000);


        function btn_click(type){
            app.stage.addChild(grayscale);

            if(type == "blue"){
                app.stage.addChild(common_heart1);
                app.stage.addChild(common_heart2);
                app.stage.addChild(common_heart3);

                app.stage.addChild(UIBox_01)
                app.stage.addChild(UIBox_text)
                app.stage.addChild(UIPause)
                app.stage.addChild(UISound)

                common_heart1.state.addAnimation(0, 'Full', true);
                common_heart2.state.addAnimation(0, 'Full', true);
                common_heart3.state.addAnimation(0, 'Full', true);
            }



            let start = new PIXI.spine.Spine(res.common_start.spineData);

            start.x = width/2
            start.y = height/2 
            start.scale.set(scale);
            app.stage.addChild(start);
            if(type == "blue"){
                let blue_btn = start.state.addAnimation(2, 'Ready2', false, 0);
                start.state.addAnimation(2, 'Ready2', true, 0);
            } else{
                let red_btn = start.state.addAnimation(2, 'Ready', false, 0);
                start.state.addAnimation(2, 'Ready', true, 0);
            }
            

            $('#mycanvas').one("pointerdown", function(){
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

                
                setTimeout(() => {
                    app.stage.removeChild(start_count);
                    app.stage.removeChild(grayscale);
                    rc_bg();
                    ticker_show();
                    timer_set();
                    timer_show_ticker();
                    boxList();
                    if(type == "red"){
                        start_time = new Date();
                    }
                }, count_time*4*1000);

            })
        }

        // 여기서부터 또 따로 움직입니다.


        // 본 게임 - 루디 째깍이 뒷 배경
        function rc_bg(){

            crock.x = width/2.01
            crock.y = height/3
            crock.scale.set(scale);
            
            crock.state.setAnimation(0, 'Idle', true, 0);
        }
        
        // 박스, 테이블 등장 애니메이션
        function ticker_show(){
            table_box_show = new PIXI.Ticker
            table_box_show.autoStart = false;

            let wsciTable = PIXI.Sprite.from(res.WISCTable.texture);
    
            wsciTable.x = width * 0.025;
            wsciTable.y = height * 0.45;
            wsciTable.scale.set(scale, scale);
            app.stage.addChild(wsciTable);

            let Box01 = PIXI.Sprite.from(res.UIWISCBox.texture);
            Box01.x = width * 0.065;
            Box01.y = height * 0.6;
            Box01.scale.set(scale*2.3);
            app.stage.addChild(Box01);

            let Box02 = PIXI.Sprite.from(res.UIWISCBox.texture);
            Box02.x = width * 0.24375;
            Box02.y = height * 0.6;
            Box02.scale.set(scale*2.3);
            app.stage.addChild(Box02);

            let Box03 = PIXI.Sprite.from(res.UIWISCBox.texture);
            Box03.x = width * 0.4225;
            Box03.y = height * 0.6;
            Box03.scale.set(scale*2.3);
            app.stage.addChild(Box03);

            let Box04 = PIXI.Sprite.from(res.UIWISCBox.texture);
            Box04.x = width * 0.60123;
            Box04.y = height * 0.6;
            Box04.scale.set(scale*2.3);
            app.stage.addChild(Box04);

            let Box05 = PIXI.Sprite.from(res.UIWISCBox.texture);
            Box05.x = width * 0.78;
            Box05.y = height * 0.6;
            Box05.scale.set(scale*2.3);
            app.stage.addChild(Box05);

            let show_position = 0
            let hide_position = 10

            app.animationUpdate = function () {
                
                if(table_box_hide){
                    if (hide_position >= 0) {
                        wsciTable.y = height * (1-(0.45 / 10 * hide_position ));
                        Box01.y = height * (1-(0.4 / 10 * hide_position ));
                        Box02.y = height * (1-(0.4 / 10 * hide_position ));
                        Box03.y = height * (1-(0.4 / 10 * hide_position ));
                        Box04.y = height * (1-(0.4 / 10 * hide_position ));
                        Box05.y = height * (1-(0.4 / 10 * hide_position ));
                        
                        hide_position -= 1;

                    } else {

                        hide_position = 10;
                        table_box_show.stop();
                        table_box_hide = false;
                    }
                }else {
                    if (show_position < 10) {
                        wsciTable.y = height * (1-(0.45 / 9 * show_position ));
                        Box01.y = height * (1-(0.4 / 9 * show_position ));
                        Box02.y = height * (1-(0.4 / 9 * show_position ));
                        Box03.y = height * (1-(0.4 / 9 * show_position ));
                        Box04.y = height * (1-(0.4 / 9 * show_position ));
                        Box05.y = height * (1-(0.4 / 9 * show_position ));
                        
                        show_position += 1;

                    } else {
                        show_position = 0;
                        table_box_show.stop();
                        table_box_hide = true;
                        toolsList()
                    }
                }
                
            }
            table_box_show.add(app.animationUpdate);
        }

        // TIMER 시간 설정 (00:00 or 120)
        function timer_set(){
            timer_start = new PIXI.Ticker;
            timer_start.autoStart = false;

            timer_bg = PIXI.Sprite.from(res.WISCTime_01.texture);
            timer_bg.x = width * 0.08;
            timer_bg.y = height * 0.9;
            timer_bg.scale.set(scale);

            timer = PIXI.Sprite.from(res.WISCTime_02.texture);
            timer.x = width * 0.08;
            timer.y = height * 0.9;
            timer.scale.set(scale);


            timer_text = new PIXI.Text("00 : 00",{
                fill : 0xFFFFFF,
                fontSize : "60px"
            })
            timer_text.x = width * 0.45
            timer_text.y = height * 0.9
            timer_text.scale.set(scale);
            
            if(!Istutorial){
                app.stage.addChild(timer_bg);
                app.stage.addChild(timer);
                app.stage.addChild(timer_text)
                
                var time = 120;
                code_timer = setInterval(function(){ 
                    // // console.log("SETINTERVAL")
                    var min = parseInt(time/60);
                    var sec = time%60;
                    var tm = min;
                    var ts = sec;
                    if(tm < 10){
                        tm = "0" + min;
                    }
                    if(ts < 10){
                    ts = "0" + sec;
                    }
                    var settime = tm + " : " + ts;
                    timer_text.text = settime
                    time--;
                    if(time < 0){
                        clearInterval(code_timer);
                    }
                }, 1000);
                timer_start.start();
            }
            
            

            let hide_position = 0

            app.animationUpdate = function () {
                
                var animation_speed = 120 * 1000 / 16.6;    // 120초
                if (hide_position <= (animation_speed*2)) {
                    
                    // timer.width = timer.width * (1 - (1 / animation_speed * hide_position ));
                    timer.scale.set(scale * (1 - (1 / (animation_speed*2) * hide_position )), scale);
                    hide_position += 1;
                    timer.scale.set(scale * (1 - (1 / (animation_speed*2) * hide_position )), scale);
                    
                    hide_position += 1;

                } else {
                    // console.log("IF")

                    hide_position = 0;
                    timer_start.stop();
                }
                
            }
            
            timer_start.add(app.animationUpdate);
        }



        


        // TIMER 등장 애니메이션
        function timer_show_ticker(){
            timer_show = new PIXI.Ticker
            timer_show.autoStart = false;

            let show_position = 0
            let hide_position = 10

            app.animationUpdate = function () {
               
                
                if(timer_show_hide){
                    if (hide_position >= 0) {
                        timer_bg.y = height * (1-(0.1 / 10 * hide_position ));
                        timer.y = height * (1-(0.1 / 10 * hide_position ));
                        timer_text.y = height * (1-(0.1 / 10 * hide_position ));
                        
                        hide_position -= 1;

                    } else {

                        hide_position = 10;
                        timer_show.stop();
                        timer_show_hide = false;
                    }
                }else {
                    if (show_position < 10) {
                        timer_bg.y = height * (1-(0.1 / 9 * show_position ));
                        timer.y = height * (1-(0.1 / 9 * show_position ));
                        timer_text.y = height * (1-(0.1 / 9 * show_position ));
                        
                        show_position += 1;
                    } else {
                        show_position = 0;
                        timer_show.stop();
                        timer_show_hide = true;
                    }
                }
                
            }
            timer_show.add(app.animationUpdate);
        }
        
        //  테이블 박스 재등장
        function boxList(){
            table_box_show.start();
            // timer_show.start();
        }

        
        
        function toolsList(){
            round_start_time = new Date();
            let tools00 = new PIXI.spine.Spine(res.wisc_tools.spineData);

            // 66개 리스트 만들기 - 튜토리얼에 한 번, 본게임에 한 번
            if(!toollist_66){
                toollist66();
                total_round = 27;
            }
            if(total_round == 66){
                game_end();
            }
            
            // // console.log(question_list)

            tools00.x = width/2;
            tools00.y = height/3.2;
            tools00.scale.set(scale);
            app.stage.addChild(tools00);

            tools00.state.addAnimation(0, answer_list[total_round]+'_Appear', false, 0);
            tools00.state.addAnimation(0, answer_list[total_round]+'_Idle', false, 0);

            let tools01 = new PIXI.spine.Spine(res.wisc_tools.spineData);

            tools01.x = width*0.14
            tools01.y = height*0.735
            tools01.scale.set(scale);
            app.stage.addChild(tools01);

            tools01.state.addAnimation(0, question_list[total_round][0]+'_Appear', false, 0);
            tools01.state.addAnimation(0, question_list[total_round][0]+'_Idle', false, 0);

            let tools02 = new PIXI.spine.Spine(res.wisc_tools.spineData);

            tools02.x = width*0.32
            tools02.y = height*0.735
            tools02.scale.set(scale);
            app.stage.addChild(tools02);

            tools02.state.addAnimation(0, question_list[total_round][1]+'_Appear', false, 0);
            tools02.state.addAnimation(0, question_list[total_round][1]+'_Idle', false, 0);

            let tools03 = new PIXI.spine.Spine(res.wisc_tools.spineData);

            tools03.x = width*0.5
            tools03.y = height*0.735
            tools03.scale.set(scale);
            app.stage.addChild(tools03);

            tools03.state.addAnimation(0, question_list[total_round][2]+'_Appear', false, 0);
            tools03.state.addAnimation(0, question_list[total_round][2]+'_Idle', false, 0);

            let tools04 = new PIXI.spine.Spine(res.wisc_tools.spineData);

            tools04.x = width*0.68
            tools04.y = height*0.735
            tools04.scale.set(scale);
            app.stage.addChild(tools04);

            tools04.state.addAnimation(0, question_list[total_round][3]+'_Appear', false, 0);
            tools04.state.addAnimation(0, question_list[total_round][3]+'_Idle', false, 0);

            let tools05 = new PIXI.spine.Spine(res.wisc_tools.spineData);

            tools05.x = width*0.86
            tools05.y = height*0.735
            tools05.scale.set(scale);
            app.stage.addChild(tools05);

            tools05.state.addAnimation(0, question_list[total_round][4]+'_Appear', false, 0);
            tools05.state.addAnimation(0, question_list[total_round][4]+'_Idle', false, 0);
            

            $('#mycanvas').on('pointerdown', function(e){
                round_end_time = new Date();
                // console.log(e.clientX , e.clientY )
                var bound = canvas.getBoundingClientRect();
                let x = (e.clientX - bound.left) * (canvas.width / bound.width);
                let y = (e.clientY - bound.top) * (canvas.height / bound.height);

                // ROTATE?
                // let y = (e.clientX - (bound.left/2)) * (canvas.width / bound.height);
                // let x = (e.clientY - bound.top) * (canvas.height / bound.width);
                let oxeffect = new PIXI.spine.Spine(res.common_OXE.spineData);

                oxeffect.scale.set(scale);
                var issuccess = false;
                                    
                if(tools01.x + 300*scale*0.5 > x && tools01.x - 300*scale*0.5 < x && tools01.y+ 300 * scale*0.5 > y && tools01.y - 300 * scale*0.5 < y){
                    $("#mycanvas").unbind("pointerdown");
                    // console.log("111111")
                    oxeffect.x = tools01.x
                    oxeffect.y = tools01.y 
                    app.stage.addChild(oxeffect);
                    if(answer_idx_list[total_round] == 0){
                        // console.log("정답") 
                        crock.state.setAnimation(0,'Success', false, 0);
                        tools01.state.addAnimation(0, question_list[total_round][0]+'_Success', false, 0);
                        tools02.state.addAnimation(0, question_list[total_round][1]+'_Disappear', false, 0);
                        tools03.state.addAnimation(0, question_list[total_round][2]+'_Disappear', false, 0);
                        tools04.state.addAnimation(0, question_list[total_round][3]+'_Disappear', false, 0);
                        tools05.state.addAnimation(0, question_list[total_round][4]+'_Disappear', false, 0);

                        if(Istutorial){
                            crock.state.addAnimation(0,'NoBalloon', true, 0);
                        }
                        oxeffect.state.addAnimation(0, 'Success', false, 0);

                        issuccess = true;
                    }else{
                        crock.state.setAnimation(0,'Fail', false, 0);

                        tools01.state.addAnimation(0, question_list[total_round][0]+'_Fail', false, 0);
                        tools02.state.addAnimation(0, question_list[total_round][1]+'_Disappear', false, 0);
                        tools03.state.addAnimation(0, question_list[total_round][2]+'_Disappear', false, 0);
                        tools04.state.addAnimation(0, question_list[total_round][3]+'_Disappear', false, 0);
                        tools05.state.addAnimation(0, question_list[total_round][4]+'_Disappear', false, 0);


                        if(Istutorial){
                            crock.state.addAnimation(0,'NoBalloon', true, 0);
                        }
                        oxeffect.state.addAnimation(0, 'Fail', false, 0);
                    }

                }else if(tools02.x + 300*scale*0.5 > x && tools02.x - 300*scale*0.5 < x && tools02.y+ 300 * scale*0.5 > y && tools02.y - 300 * scale*0.5 < y){
                    $("#mycanvas").unbind("pointerdown");
                    // console.log("22222")
                    oxeffect.x = tools02.x
                    oxeffect.y = tools02.y
                    app.stage.addChild(oxeffect);
                    if(answer_idx_list[total_round] == 1){
                        // console.log("정답") 
                        crock.state.setAnimation(0,'Success', false, 0);
                        tools02.state.addAnimation(0, question_list[total_round][1]+'_Success', false, 0);
                        tools01.state.addAnimation(0, question_list[total_round][0]+'_Disappear', false, 0);
                        tools03.state.addAnimation(0, question_list[total_round][2]+'_Disappear', false, 0);
                        tools04.state.addAnimation(0, question_list[total_round][3]+'_Disappear', false, 0);
                        tools05.state.addAnimation(0, question_list[total_round][4]+'_Disappear', false, 0);

                        
                        if(Istutorial){
                            crock.state.addAnimation(0,'NoBalloon', true, 0);
                        }
                        oxeffect.state.addAnimation(0, 'Success', false, 0);

                        issuccess = true;
                    }else{
                        crock.state.setAnimation(0,'Fail', false, 0);
                        tools02.state.addAnimation(0, question_list[total_round][1]+'_Fail', false, 0);
                        tools01.state.addAnimation(0, question_list[total_round][0]+'_Disappear', false, 0);
                        tools03.state.addAnimation(0, question_list[total_round][2]+'_Disappear', false, 0);
                        tools04.state.addAnimation(0, question_list[total_round][3]+'_Disappear', false, 0);
                        tools05.state.addAnimation(0, question_list[total_round][4]+'_Disappear', false, 0);


                        if(Istutorial){
                            crock.state.addAnimation(0,'NoBalloon', true, 0);
                        }
                        oxeffect.state.addAnimation(0, 'Fail', false, 0);
                    }

                }else if(tools03.x + 300*scale*0.5 > x && tools03.x - 300*scale*0.5 < x && tools03.y+ 300 * scale*0.5 > y && tools03.y - 300 * scale*0.5 < y){
                    $("#mycanvas").unbind("pointerdown");
                    // console.log("3333")
                    oxeffect.x = tools03.x
                    oxeffect.y = tools03.y
                    app.stage.addChild(oxeffect);
                    if(answer_idx_list[total_round] == 2){
                        // console.log("정답") 
                        crock.state.setAnimation(0,'Success', false, 0);
                        tools03.state.addAnimation(0, question_list[total_round][2]+'_Success', false, 0);
                        tools01.state.addAnimation(0, question_list[total_round][0]+'_Disappear', false, 0);
                        tools02.state.addAnimation(0, question_list[total_round][1]+'_Disappear', false, 0);
                        tools04.state.addAnimation(0, question_list[total_round][3]+'_Disappear', false, 0);
                        tools05.state.addAnimation(0, question_list[total_round][4]+'_Disappear', false, 0);
                        
                        if(Istutorial){
                            crock.state.addAnimation(0,'NoBalloon', true, 0);
                        }
                        oxeffect.state.addAnimation(0, 'Success', false, 0);

                        issuccess = true;
                    }else{
                        crock.state.setAnimation(0,'Fail', false, 0);
                        tools03.state.addAnimation(0, question_list[total_round][2]+'_Fail', false, 0);
                        tools01.state.addAnimation(0, question_list[total_round][0]+'_Disappear', false, 0);
                        tools02.state.addAnimation(0, question_list[total_round][1]+'_Disappear', false, 0);
                        tools04.state.addAnimation(0, question_list[total_round][3]+'_Disappear', false, 0);
                        tools05.state.addAnimation(0, question_list[total_round][4]+'_Disappear', false, 0);

                        if(Istutorial){
                            crock.state.addAnimation(0,'NoBalloon', true, 0);
                        }
                        oxeffect.state.addAnimation(0, 'Fail', false, 0);
                    }

                }else if(tools04.x + 300*scale*0.5 > x && tools04.x - 300*scale*0.5 < x && tools04.y+ 300 * scale*0.5 > y && tools04.y - 300 * scale*0.5 < y){
                    $("#mycanvas").unbind("pointerdown");
                    // console.log("4444")
                    oxeffect.x = tools04.x
                    oxeffect.y = tools04.y
                    app.stage.addChild(oxeffect);
                    if(answer_idx_list[total_round] == 3){
                        // console.log("정답") 
                        crock.state.setAnimation(0,'Success', false, 0);
                        tools04.state.addAnimation(0, question_list[total_round][3]+'_Success', false, 0);

                        tools01.state.addAnimation(0, question_list[total_round][0]+'_Disappear', false, 0);
                        tools02.state.addAnimation(0, question_list[total_round][1]+'_Disappear', false, 0);
                        tools03.state.addAnimation(0, question_list[total_round][2]+'_Disappear', false, 0);
                        tools05.state.addAnimation(0, question_list[total_round][4]+'_Disappear', false, 0);

                        
                        if(Istutorial){
                            crock.state.addAnimation(0,'NoBalloon', true, 0);
                        }
                        oxeffect.state.addAnimation(0, 'Success', false, 0);

                        issuccess = true;
                    }else{
                        crock.state.setAnimation(0,'Fail', false, 0);
                        tools04.state.addAnimation(0, question_list[total_round][3]+'_Fail', false, 0);

                        tools01.state.addAnimation(0, question_list[total_round][0]+'_Disappear', false, 0);
                        tools02.state.addAnimation(0, question_list[total_round][1]+'_Disappear', false, 0);
                        tools03.state.addAnimation(0, question_list[total_round][2]+'_Disappear', false, 0);
                        tools05.state.addAnimation(0, question_list[total_round][4]+'_Disappear', false, 0);


                        if(Istutorial){
                            crock.state.addAnimation(0,'NoBalloon', true, 0);
                        }
                        oxeffect.state.addAnimation(0, 'Fail', false, 0);
                    }

                }else if(tools05.x + 300*scale*0.5 > x && tools05.x - 300*scale*0.5 < x && tools05.y+ 300 * scale*0.5 > y && tools05.y - 300 * scale*0.5 < y){
                    $("#mycanvas").unbind("pointerdown");
                    // console.log("5555")
                    oxeffect.x = tools05.x
                    oxeffect.y = tools05.y
                    app.stage.addChild(oxeffect);
                    if(answer_idx_list[total_round] == 4){
                        // console.log("정답") 
                        crock.state.setAnimation(0,'Success', false, 0);
                        tools05.state.addAnimation(0, question_list[total_round][4]+'_Success', false, 0);

                        tools01.state.addAnimation(0, question_list[total_round][0]+'_Disappear', false, 0);
                        tools02.state.addAnimation(0, question_list[total_round][1]+'_Disappear', false, 0);
                        tools03.state.addAnimation(0, question_list[total_round][2]+'_Disappear', false, 0);
                        tools04.state.addAnimation(0, question_list[total_round][3]+'_Disappear', false, 0);
                        
                        if(Istutorial){
                            crock.state.addAnimation(0,'NoBalloon', true, 0);
                        }
                        oxeffect.state.addAnimation(0, 'Success', false, 0);

                        issuccess = true;
                    }else{
                        crock.state.setAnimation(0,'Fail', false, 0);
                        tools05.state.addAnimation(0, question_list[total_round][4]+'_Fail', false, 0); 

                        tools01.state.addAnimation(0, question_list[total_round][0]+'_Disappear', false, 0);
                        tools02.state.addAnimation(0, question_list[total_round][1]+'_Disappear', false, 0);
                        tools03.state.addAnimation(0, question_list[total_round][2]+'_Disappear', false, 0);
                        tools04.state.addAnimation(0, question_list[total_round][3]+'_Disappear', false, 0);

                        if(Istutorial){
                            crock.state.addAnimation(0,'NoBalloon', true, 0);
                        }
                        oxeffect.state.addAnimation(0, 'Fail', false, 0);
                    }

                }else {
                    // console.log("nnnnn")
                }

                oxeffect.state.addListener({
                    complete : function(){
                        // console.log("COMPLETE");
                        if(Istutorial){
                            // console.log("TUTORIAL!!!!")
                            table_box_hide = true;
                            table_box_show.start();
                            // timer_show_hide = true;
                            // timer_show.start();
                        } else{
                            total_round += 1;
                        }
                        app.stage.removeChild(tools00);
                        app.stage.removeChild(tools01);
                        app.stage.removeChild(tools02);
                        app.stage.removeChild(tools03);
                        app.stage.removeChild(tools04);
                        app.stage.removeChild(tools05);
                        
                        if(issuccess){
                            tutorial_succes_count += 1;
                            success();
                        } else {
                            fail();
                        }

                    }
                });

            })
        }

        // SPINE TOOLS 리스트 가져오기 
        function toollist66(){
            tools_list = [];
            let tools00 = new PIXI.spine.Spine(res.wisc_tools.spineData);

            // 전체 TOOLS LIST
            for (var key in tools00.skeleton.data.defaultSkin.attachments[1]) { 
                tools_list.push(key);
            }
            // // console.log(tools_list.length);
            // // console.log("CHECK TOOLS : ",tools_list);

            getlist();
        }
        
        // SUCCESS
        function success(){
            // console.log("succes")
            let rucro = new PIXI.spine.Spine(res.common_rucro.spineData);
            rucro.scale.set(scale);
            rucro.x = width/2;
            rucro.y = height/2;

            if(Istutorial && tutorial_succes_count < 2){                              // 튜토리얼 1번 성공
                app.stage.addChild(grayscale);
                app.stage.addChild(rucro);
                total_round += 1;
                let Great = rucro.state.addAnimation(0, 'Great', false, 0);
                let Great_time = Great.animationEnd

                setTimeout(() => {
                    crock.state.addAnimation(0,'Idle', true, 0);
                    app.stage.removeChild(rucro);
                    app.stage.removeChild(grayscale);
                    boxList()
                }, (Great_time-0.3)*1000);
            }else if(Istutorial && tutorial_succes_count == 2){                     // 튜토리얼 2번 성공 // 튜토리얼 끝!
                app.stage.addChild(grayscale);
                app.stage.addChild(rucro);

                let Great = rucro.state.addAnimation(0, 'Great', false, 0);
                let Great_time = Great.animationEnd
                
                setTimeout(() => {
                    // console.log("튜토리얼 앤드!")
                    total_round = 0;
                    // toollist_66 = false;
                    Istutorial = false;
                    crock.state.addAnimation(0,'NoBalloon', true, 0);
                    app.stage.removeChild(rucro);
                    app.stage.removeChild(grayscale);
                    btn_click("red");
                    // timer_set();
                    // timer_show_ticker();
                }, (Great_time-0.3)*1000);
            } else if(tutorial_succes_count > 2){                                   // 본게임!
                // console.log("본게임");
                
                var round_response_time = round_end_time - round_start_time;
                // console.log("라운드 반응시간(s) : ", round_response_time / 1000);
                ssResponseTimeList.push({"isCorrect": true, "responseTime": round_response_time / 1000})
                // console.log("전체 라운드 반응시간 리스트 : ", ssResponseTimeList);

                ssNumOfSuccessRound += 1;
                // console.log("총 정답 개수 : ", ssNumOfSuccessRound);
                ssMaxCnsctvSuccessCount += 1;
                // console.log("연속 정답 개수 : ", ssMaxCnsctvSuccessCount);


                Istutorial = false;
                fail_count = 0;
                common_heart1.state.setAnimation(0, 'EmptyToFull', false);
                common_heart2.state.setAnimation(0, 'EmptyToFull', false);
                common_heart3.state.setAnimation(0, 'EmptyToFull', false);
                
                common_heart1.state.addAnimation(0, 'Full', true);
                common_heart2.state.addAnimation(0, 'Full', true);
                common_heart3.state.addAnimation(0, 'Full', true);

                crock.state.addAnimation(0,'Idle', true, 0);
                app.stage.removeChild(rucro);
                toolsList()
            }
        }

        // FAIL
        function fail(){
            // console.log("fail")
            
            let rucro = new PIXI.spine.Spine(res.common_rucro.spineData);

            rucro.scale.set(scale);
            rucro.x = width/2
            rucro.y = height/2
            
            if(tutorial_succes_count >= 2){                                   // 본게임!
                // console.log("본게임");

                var round_response_time = round_end_time - round_start_time;
                // console.log("라운드 반응시간(s) : ", round_response_time / 1000);
                ssResponseTimeList.push({"isCorrect": false, "responseTime": round_response_time / 1000})
                // console.log("전체 라운드 반응시간 리스트 : ", ssResponseTimeList);

                // console.log("연속 정답 개수 실패 : ", ssMaxCnsctvSuccessCount);
                ssMaxCnsctvSuccessCountlist.push(ssMaxCnsctvSuccessCount);
                // console.log("연속 정답 리스트 : ", ssMaxCnsctvSuccessCountlist);
                ssMaxCnsctvSuccessCount = 0;
                // console.log("연속 정답 개수 실패 리셋 : ", ssMaxCnsctvSuccessCount);



                Istutorial = false;
                fail_count += 1;
                crock.state.addAnimation(0,'Idle', true, 0);
                app.stage.removeChild(rucro);
                // boxList();
                if(fail_count == 1){
                    console.log("HELLO 1")
                    common_heart3.state.setAnimation(0, 'Full2Empty', false);

                    common_heart1.state.addAnimation(0, 'Full', true);
                    common_heart2.state.addAnimation(0, 'Full', true);
                    common_heart3.state.addAnimation(0, 'Empty', true);
                    toolsList();

                }else if(fail_count == 2){
                    console.log("HELLO 2")

                    common_heart2.state.setAnimation(0, 'Full2Empty', false);

                    common_heart1.state.addAnimation(0, 'Full', true);
                    common_heart2.state.addAnimation(0, 'Empty', true);
                    common_heart3.state.addAnimation(0, 'Empty', true);
                    toolsList();
                }else if(fail_count > 2){
                    console.log("HELLO 3")

                    common_heart1.state.setAnimation(0, 'Full2Empty', false);

                    common_heart1.state.addAnimation(0, 'Empty', true);
                    common_heart2.state.addAnimation(0, 'Empty', true);
                    common_heart3.state.addAnimation(0, 'Empty', true);
                    game_end();
                } else {
                    toolsList();
                }
            } else {
                app.stage.addChild(grayscale);
                app.stage.addChild(rucro);

                let Fail = rucro.state.addAnimation(0, 'Fail', false, 0);
                let Fail_time = Fail.animationEnd

                setTimeout(() => {
                    crock.state.addAnimation(0,'Idle', true, 0);
                    app.stage.removeChild(rucro);
                    app.stage.removeChild(grayscale);
                    boxList()
                }, (Fail_time-0.3)*1000);
            }

            
        }

        


        app.start();
    }


})

function getlist(){

    answer_list = new Array(66);
    // 전체 ANSWER INDEX LIST - 연속으로 같은 값 XXX (66 round)
    answer_idx_list = new Array(66); 
    // 전체 QUESTION LIST - 정답과 index를 결합한 5개씩 66배열 (66 round)
    question_list = new Array(66);
    toollist_66 = true;

    // 전체 ANSWER LIST - 연속으로 같은 값 XXX (66 round)
     
    // // console.log(answer_list.length);
    for (var i=0; i < answer_list.length; i++) {

        var tools_list_duplicate = [...tools_list];                             // 배열 복사
        const random = Math.floor(Math.random() * tools_list_duplicate.length);
        var answer = tools_list_duplicate[random];

        if(i == 0){
            answer_list[i] = answer;
        } else if(answer_list[i-1] == answer){
            tools_list_duplicate.splice(random, 1);

            const new_random = Math.floor(Math.random() * tools_list_duplicate.length);
            var new_answer = tools_list_duplicate[new_random];
            answer_list[i] = new_answer;
        } else {
            answer_list[i] = answer;
        }
    }
    // // console.log(tools_list);

    // // console.log("CHECK ANSWER_LIST : ",answer_list);

    // 전체 ANSWER INDEX LIST - 연속으로 같은 값 XXX (66 round)
    var idx_count = [0,1,2,3,4];
    // // console.log(answer_idx_list.length);

    for (var i=0; i < answer_idx_list.length; i++) {
        var idx_count_duplicate = [...idx_count];                                   // 배열 복사
        const random = Math.floor(Math.random() * idx_count_duplicate.length);
        var answer = idx_count_duplicate[random];

        if(i == 0){
            answer_idx_list[i] = answer;
        } else if(answer_idx_list[i-1] == answer){
            idx_count_duplicate.splice(random, 1);

            const new_random = Math.floor(Math.random() * idx_count_duplicate.length);
            var new_answer = idx_count_duplicate[new_random];
            answer_idx_list[i] = new_answer;
        } else {
            answer_idx_list[i] = answer;
        }
    }

    // // console.log("CHECK ANSWER_INDEX_LIST : ",answer_idx_list);

    // 전체 QUESTION LIST - 정답과 index를 결합한 5개씩 66배열 (66 round)
    var question_idx_count = [0,1,2,3,4];
   

    for (var i=0; i < question_list.length; i++) {
        var question_list_array = new Array(5);
        var question_idx_count_duplicate = [...tools_list];        // 배열 복사
        
        var ans_index = question_idx_count_duplicate.indexOf(answer_list[i]);
        question_idx_count_duplicate.splice(ans_index, 1);

        for(var j=0; j < question_idx_count.length; j++){
            const random = Math.floor(Math.random() * question_idx_count_duplicate.length);
            var answer = question_idx_count_duplicate[random];

            

            if(j == answer_idx_list[i]){

                question_list_array[j] = answer_list[i];

            } else if(j == 0){

                question_list_array[j] = answer;
                
            } else if(question_list_array.indexOf(answer) == -1){

                question_list_array[j] = answer;

            } else {
                question_idx_count_duplicate.splice(random, 1);

                const new_random = Math.floor(Math.random() * question_idx_count_duplicate.length);
                var new_answer = question_idx_count_duplicate[new_random];
                question_list_array[j] = new_answer;
            }
        }
        // // console.log(question_list_array);
        question_list[i] = question_list_array;
    }

    // console.log("CHECK QUESTION_LIST : ",question_list);
}



function game_end(){
    timer_start.stop();
    table_box_show.stop();
    timer_show.stop();

    

    clearInterval(code_timer);
    end_time = new Date();
    ssPerformanceTime = end_time - start_time;

    // // console.log("총 수행 라운드 : ", total_round, ssResponseTimeList.length);
    // // console.log("총 정답 라운드 : ", ssNumOfSuccessRound);

    // // console.log("전체 라운드 반응시간 리스트 : ", ssResponseTimeList);
    // // console.log("연속 정답 리스트 : ", ssMaxCnsctvSuccessCountlist);
    // // console.log("연속 정답 개수 : ", ssMaxCnsctvSuccessCount);
    // // console.log("총 수행 시간 : ", ssPerformanceTime / 1000);

    const container = document.getElementById('container');
    container.removeChild(app.view);
}
