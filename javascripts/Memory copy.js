var app;    // PIXI JS APPLICATION

// 공통 UI
var common_heart1;                      // 목숨 1번
var common_heart2;                      // 목숨 2번
var common_heart3;                      // 목숨 3번

let grayscale ;                         // GRAY SCALE


var tools_list = [];




// 문제 
var obj_list = [];                          // 전체 OBJ LIST
var answer_list = [];                       // 전체 ANSWER LIST - 라운드별로 추출해서 넣어줌
var answer_idx_list = [];                   // 전체 ANSWER INDEX LIST - 라운드별로 추출해서 넣어줌
var question_list = [];                     // 전체 QUESTION LIST - 라운드별로 추출해서 넣어줌




// 해당 QUESTION LIST
                    // 라운드별 클릭 수 (문제 수랑 같아지는 순간 round end)

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

// ROUND FINISH
let round_finish = false;

// 본게임
let total_round = 0;
var fail_count = 0;                     // 연속 2번 틀릴 시 게임 END


$(function () {

    const canvas = document.getElementById('mycanvas')
    const container = document.getElementById('container')

    var width  = window.innerWidth;
    var height = width * 0.5625;

    var scale = width/1920; 
    if(height > window.innerHeight){
        height = window.innerHeight;
        width = height / 0.5625;
        scale = width/1920; 
    }

    app = new PIXI.Application({
        view: canvas,
        width: width,
        height: height,
    });
    
    container.appendChild(app.view);

    // load spine data
    app.loader
        .add('memory_tutorial', 'spine/Memory/Spine/MemoryTutorial.json')
        .add('common_start', 'spine/WISC/common/Spine/Start.json')
        .add('memory_obj', 'spine/Memory/Spine/MemoryObj.json')
        .add('common_rucro', 'spine/WISC/common/Spine/RuCroEffect.json')
        .add('memory_bag', 'spine/Memory/Spine/MemoryBagEffect.json')
        .load(onAssetsLoaded);
 


    app.stage.interactive = true;
    app.stage.buttonMode = true;

    function onAssetsLoaded(loader, res) {

        // grey scale
        grayscale = PIXI.Sprite.from('grey_scale.png');
        grayscale.position.y = 0;
        grayscale.position.x = 0;
        grayscale.width = width;
        grayscale.height = height;
        grayscale.scale.set(scale);

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
        let take01_time = take01.animationEnd

        setTimeout(() => {
            app.stage.removeChild(tutorial);
            
            //tutorial clickanswer
            let background = PIXI.Sprite.from('spine/Memory/Sprite/MemoryBg.png');
            background.position.y = 0;
            background.position.x = 0;
            background.scale.set(scale/1.37,scale);
            app.stage.addChild(background);

            let tu_click = new PIXI.spine.Spine(res.memory_tutorial.spineData);
            tu_click.x = width/2
            tu_click.y = height/2
            tu_click.scale.set(scale);
            app.stage.addChild(tu_click);

            let ClickAnswer = tu_click.state.addAnimation(0, 'ClickAnswer', false);
            let ClickAnswer_time = ClickAnswer.animationEnd;

            setTimeout(() => {
                app.stage.removeChild(tu_click);
                btn_click("blue");
            }, ClickAnswer_time*1000);           
            
        }, take01_time*1000);


        function btn_click(type){
            app.stage.addChild(grayscale);
            let start = new PIXI.spine.Spine(res.common_start.spineData);

            start.x = width/2
            start.y = height/2 
            start.scale.set(scale);
            app.stage.addChild(start);

            if(type == "blue"){
                let blue_btn = start.state.addAnimation(2, 'Ready2', false, 0);
                let blue_btn_time = blue_btn.animationEnd
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
                    app.stage.removeChild(grayscale);

                    if(type == "blue"){
                        now_round_question.push(tutorial_question[tutorial_idx]);

                        
                    } else {
                        // 튜토리얼 끝 초기화!
                        // console.log("튜토리얼끝!")
                        answer_list = [];
                        answer_idx_list = [];
                        question_list = [];
                        now_round_question = [];
                        now_round_idx = 0;
                        now_round_question.push(round_question[round_idx]);
                    }

                    getlist(now_round_question[now_round_idx][0], now_round_question[now_round_idx][1]);    // 문제, 답 출제.
                    questObjList();
                    answerObjList();

                    // 정답올라옴
                    answerUp();
                    answerUpStart();

                    // 가방올라옴
                    BagMove();

                    setTimeout(() => {
                        // 정답내려감
                        // console.log("내려감")
                        answerUpStart(); 
                    }, 2500);
                    
                    

                }, count_time*4*1000);

                

    
                

            })
        }

        
        function answerUp(){
            answerUp_ticker = new PIXI.Ticker
            answerUp_ticker.autoStart = false;

            let MemoryNote = PIXI.Sprite.from('spine/Memory/Sprite/MemoryNote.png');
            
            MemoryNote.x = width*0.16;
            MemoryNote.y = height*0.13;
            MemoryNote.scale.set(scale);
            app.stage.addChild(MemoryNote);

            let CrokArm = PIXI.Sprite.from('spine/Memory/Sprite/CrockArm.png');
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
                        // // console.log("BOXLIST IF")
                        MemoryNote.y = height * 0.1 + height / tick_len * position
                        CrokArm.y = height * 655  + height / tick_len * position
                   
                        // 문제 출제 갯수 (정답 갯수)
                        switch(now_round_question[now_round_idx][0]){
                            case 1:
                                Quest01.y = height * 0.5 + height / tick_len * position ;
                                if(position == tick_len){Quest01.y = height*2}
                                break;

                            case 2:
                                Quest01.x = width * 0.45
                                Quest02.x = width * 0.55

                                Quest01.y = height * 0.5 + height / tick_len * position ;
                                Quest02.y = height * 0.5 + height / tick_len * position ;

                                if(position == tick_len){Quest01.y = height*2; Quest02.y = height*2;}
                                break;

                            case 3:
                                
                                Quest01.x = width * 0.4
                                Quest02.x = width * 0.5
                                Quest03.x = width * 0.6

                                Quest01.y = height * 0.5 + height / tick_len * position ;
                                Quest02.y = height * 0.5 + height / tick_len * position ;
                                Quest03.y = height * 0.5 + height / tick_len * position ;

                            
                                if(position == tick_len){Quest01.y = height*2; Quest02.y = height*2; Quest03.y = height*2;}
                                break;

                            case 4:
                                Quest01.x = width * 0.45
                                Quest02.x = width * 0.55
                                Quest03.x = width * 0.45
                                Quest04.x = width * 0.55

                                Quest01.y = height * 0.5 + height / tick_len * position ;
                                Quest02.y = height * 0.5 + height / tick_len * position ;
                                Quest03.y = height * 0.5 + height / tick_len * position ;
                                Quest04.y = height * 0.5 + height / tick_len * position ;

                            
                                if(position == tick_len){Quest01.y = height*2; Quest02.y = height*2; Quest03.y = height*2; Quest04.y = height*2;}
                                break;

                            case 5:
                                // console.log("QUEST 5");
                                Quest01.x = width * 0.4
                                Quest02.x = width * 0.5
                                Quest03.x = width * 0.6
                                Quest04.x = width * 0.45
                                Quest05.x = width * 0.55

                                Quest01.y = height * 0.45 + height / tick_len * position ;
                                Quest02.y = height * 0.45 + height / tick_len * position ;
                                Quest03.y = height * 0.45 + height / tick_len * position ;
                                Quest04.y = height * 0.6 + height / tick_len * position ;
                                Quest05.y = height * 0.6 + height / tick_len * position ;

                        
                                if(position == tick_len){Quest01.y = height*2; Quest02.y = height*2; Quest03.y = height*2; Quest04.y = height*2; Quest05.y = height*2;}
                                break;


                            case 6:
                                Quest01.x = width*0.4
                                Quest02.x = width*0.5
                                Quest03.x = width*0.6
                                Quest04.x = width*0.4
                                Quest05.x = width*0.5
                                Quest06.x = width*0.6

                                Quest01.y = height * 0.45 + height / tick_len * position ;
                                Quest02.y = height * 0.45 + height / tick_len * position ;
                                Quest03.y = height * 0.45 + height / tick_len * position ;
                                Quest04.y = height * 0.6 + height / tick_len * position ;
                                Quest05.y = height * 0.6 + height / tick_len * position ;
                                Quest06.y = height * 0.6 + height / tick_len * position ;
                        
                        
                                if(position == tick_len){Quest01.y = height*2; Quest02.y = height*2; Quest03.y = height*2; Quest04.y = height*2; Quest05.y = height*2; Quest06.y = Quest06*2;}
                                break;

                            case 7:
                                Quest01.x = width*0.35
                                Quest02.x = width*0.45
                                Quest03.x = width*0.55
                                Quest04.x = width*0.65
                                Quest05.x = width*0.4
                                Quest06.x = width*0.5
                                Quest07.x = width*0.6

                                Quest01.y = height * 0.45 + height / tick_len * position ;
                                Quest02.y = height * 0.45 + height / tick_len * position ;
                                Quest03.y = height * 0.45 + height / tick_len * position ;
                                Quest04.y = height * 0.45 + height / tick_len * position ;
                                Quest05.y = height * 0.6 + height / tick_len * position ;
                                Quest06.y = height * 0.6 + height / tick_len * position ;
                                Quest07.y = height * 0.6 + height / tick_len * position ;


                                if(position == tick_len){Quest01.y = height*2; Quest02.y = height*2; Quest03.y = height*2; Quest04.y = height*2; Quest05.y = height*2; Quest06.y = Quest06*2; Quest07.y = height*2;}
                                break;
                            }


                        
                    }else{
                        MemoryNote.y = height*0.1 + height / tick_len * (tick_len-position) ;
                        CrokArm.y = height * 0.655 + height / tick_len * (tick_len-position); 
                   

                        switch(now_round_question[now_round_idx][0]){
                            case 1:
                                Quest01.y = height * 0.5 + height / tick_len * (tick_len-position) ;
                                break;

                            case 2:
                                Quest01.x = width * 0.45
                                Quest02.x = width * 0.55

                                Quest01.y = height * 0.5 + height / tick_len * (tick_len-position) ;
                                Quest02.y = height * 0.5 + height / tick_len * (tick_len-position) ;
                                break;

                            case 3:
                                Quest01.x = width * 0.4
                                Quest02.x = width * 0.5
                                Quest03.x = width * 0.6

                                Quest01.y = height * 0.5 + height / tick_len * (tick_len-position) ;
                                Quest02.y = height * 0.5 + height / tick_len * (tick_len-position) ;
                                Quest03.y = height * 0.5 + height / tick_len * (tick_len-position) ;
                                
                                break;

                            case 4:
                                Quest01.x = width * 0.45
                                Quest02.x = width * 0.55
                                Quest03.x = width * 0.45
                                Quest04.x = width * 0.55


                                Quest01.y = height * 0.45 + height / tick_len * (tick_len-position) ;
                                Quest02.y = height * 0.45 + height / tick_len * (tick_len-position) ;
                                Quest03.y = height * 0.6 + height / tick_len * (tick_len-position) ;
                                Quest04.y = height * 0.6 + height / tick_len * (tick_len-position) ;
                                

                                break;

                            case 5:
                                Quest01.x = width * 0.4
                                Quest02.x = width * 0.5
                                Quest03.x = width * 0.6
                                Quest04.x = width * 0.45
                                Quest05.x = width * 0.55

                                Quest01.y = height * 0.45 + height / tick_len * (tick_len-position) ;
                                Quest02.y = height * 0.45 + height / tick_len * (tick_len-position) ;
                                Quest03.y = height * 0.45 + height / tick_len * (tick_len-position) ;
                                Quest04.y = height * 0.6 + height / tick_len * (tick_len-position) ;
                                Quest05.y = height * 0.6 + height / tick_len * (tick_len-position) ;

                                break;
                       

                            case 6:
                                Quest01.x = width*0.4
                                Quest02.x = width*0.5
                                Quest03.x = width*0.6
                                Quest04.x = width*0.4
                                Quest05.x = width*0.5
                                Quest06.x = width*0.6
                        
                        

                                Quest01.y = height * 0.45 + height / tick_len * (tick_len-position) ;
                                Quest02.y = height * 0.45 + height / tick_len * (tick_len-position) ;
                                Quest03.y = height * 0.45 + height / tick_len * (tick_len-position) ;
                                Quest04.y = height * 0.6 + height / tick_len * (tick_len-position) ;
                                Quest05.y = height * 0.6 + height / tick_len * (tick_len-position) ;
                                Quest06.y = height * 0.6 + height / tick_len * (tick_len-position) ;
                            
                                break;

                            case 7:
                                Quest01.x = width*0.35
                                Quest02.x = width*0.45
                                Quest03.x = width*0.55
                                Quest04.x = width*0.65
                                Quest05.x = width*0.4
                                Quest06.x = width*0.5
                                Quest07.x = width*0.6

                                Quest01.y = height * 0.45 + height / tick_len * (tick_len-position) ;
                                Quest02.y = height * 0.45 + height / tick_len * (tick_len-position) ;
                                Quest03.y = height * 0.45 + height / tick_len * (tick_len-position) ;
                                Quest04.y = height * 0.45 + height / tick_len * (tick_len-position) ;
                                Quest05.y = height * 0.6 + height / tick_len * (tick_len-position) ;
                                Quest06.y = height * 0.6 + height / tick_len * (tick_len-position) ;
                                Quest07.y = height * 0.6 + height / tick_len * (tick_len-position) ;
                                
                                break;
                        }
                    }

                    
                    position += 1;

                } else {
                    if(answerUpDown){
                        answerUpDown = false
                        tickerbagStart()
                    }else{
                        answerUpDown = true
                        
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

            let bag = PIXI.Sprite.from('spine/Memory/Sprite/MemoryBag.png');
            bag.y = height;
            bag.x = width;
            
            // bag.y = height*0.08;
            // bag.x = width*0.16;
            bag.scale.set(scale);
            app.stage.addChild(bag);

            //box칸 문제들
            let box01 = PIXI.Sprite.from('spine/Memory/Sprite/MemoryBox_01.png');
            let box02 = PIXI.Sprite.from('spine/Memory/Sprite/MemoryBox_01.png');
            let box03 = PIXI.Sprite.from('spine/Memory/Sprite/MemoryBox_01.png');
            let box04 = PIXI.Sprite.from('spine/Memory/Sprite/MemoryBox_01.png');
            let box05 = PIXI.Sprite.from('spine/Memory/Sprite/MemoryBox_01.png');
            let box06 = PIXI.Sprite.from('spine/Memory/Sprite/MemoryBox_01.png');
            let box07 = PIXI.Sprite.from('spine/Memory/Sprite/MemoryBox_01.png');
            let box08 = PIXI.Sprite.from('spine/Memory/Sprite/MemoryBox_01.png');
            let box09 = PIXI.Sprite.from('spine/Memory/Sprite/MemoryBox_01.png');
            let box10 = PIXI.Sprite.from('spine/Memory/Sprite/MemoryBox_01.png');
            let box11 = PIXI.Sprite.from('spine/Memory/Sprite/MemoryBox_01.png');
            let box12 = PIXI.Sprite.from('spine/Memory/Sprite/MemoryBox_01.png');

            

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
                        switch(now_round_question[now_round_idx][1]){
                            case 2:
                                box01.x = width * 0.29 + width / tick_len * (tick_len-position) ;
                                box02.x = width * 0.51 + width / tick_len * (tick_len-position) ;
                             
                                Box01_obj.x = width * 0.39 + width / tick_len * (tick_len-position) ;
                                Box02_obj.x = width * 0.61+ width / tick_len * (tick_len-position) ;
    
                                box01.y = height * 0.38;
                                box02.y = height * 0.38;
    
                                Box01_obj.y = height * 0.555;
                                Box02_obj.y = height * 0.555;
                                
                                
                                box01.scale.set(scale*3, scale*3);
                                box02.scale.set(scale*3, scale*3);
    
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
                             
                                Box01_obj.x = width * 0.39 - width / tick_len * position;
                                Box02_obj.x = width * 0.61 - width / tick_len * position;
    
                          
                            break;
    
                            case 3:
                                box01.x = width * 0.225 - width / tick_len * position;
                                box02.x = width * 0.415 - width / tick_len * position;
                                box03.x = width * 0.605 - width / tick_len * position;
                             
                             
                                Box01_obj.x = width * 0.315 - width / tick_len * position;
                                Box02_obj.x = width * 0.5 - width / tick_len * position;
                                Box03_obj.x = width * 0.695 - width / tick_len * position;
       
    
                            break;
    
                            case 4:
                                box01.x = width * 0.325 - width / tick_len * position;
                                box02.x = width * 0.5 - width / tick_len * position;
                                box03.x = width * 0.325 - width / tick_len * position;
                                box04.x = width * 0.5 - width / tick_len * position;
            
    
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
                    // console.log("bagbagbag nn")

                    let rucro = new PIXI.spine.Spine(res.common_rucro.spineData);
                    rucro.scale.set(scale);
                    rucro.x = width/2
                    rucro.y = height/2
                    let Great_time = 0;

                    if(tickerbag){
                        tickerbag = false
                        boxobjClick();
                    }else{
                        tickerbag = true;
                        now_round_idx++;
                        // console.log("fail_count", fail_count)
                        if(fail_count == 0){
                            if(Istutorial){       
                                                                                                          // 튜토리얼 정답
                                // console.log("튜토리얼 정답!!")
                                app.stage.addChild(grayscale);
                                app.stage.addChild(rucro);
                                let Great = rucro.state.addAnimation(0, 'Great', false, 0);
                                Great_time = Great.animationEnd

                                tutorial_idx++;
                                now_round_question.push(tutorial_question[tutorial_idx]);
                                if(tutorial_idx < 2){
                                    getlist(now_round_question[now_round_idx][0], now_round_question[now_round_idx][1]); 
                                }
                            } else {                                                                                        // 본게임 정답
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

                            } else {                                                                                        // 본게임 오답
                                now_round_question.push(round_question[round_idx]);
                                getlist(now_round_question[now_round_idx][0], now_round_question[now_round_idx][1]); 

                            }
                        }

                        // console.log(now_round_question);

                        if(tutorial_idx > 1 && Istutorial){                         // 튜토리얼 엔드
                            // console.log("튜토리얼 끝!!")
                            setTimeout(() => {
                                app.stage.removeChild(rucro);
                                app.stage.removeChild(grayscale);
                                Istutorial = false;
                                btn_click("red");
                            }, (Great_time-0.3)*1000);

                        } else if(Istutorial){                                      // 튜토리얼 중
                            setTimeout(() => {
                                // console.log("튜토리얼 진행중!!")
                                app.stage.removeChild(rucro);
                                app.stage.removeChild(grayscale);
                                // console.log(now_round_question);
                                memory_bag.state.addAnimation(0, "Idle", false, 0);
                                questObjList();
                                answerObjList();
                                answerUpStart();

                                setTimeout(() => {
                                    // 정답내려감
                                    answerUpStart(); 
                                }, 2500);
                            }, (Great_time-0.3)*1000);
                        } else {                                                    // 본게임
                            // console.log("본 게임입니다!!")
                            // console.log(now_round_question);
                            memory_bag.state.addAnimation(0, "Idle", false, 0);
                            questObjList();
                            answerObjList();
                            answerUpStart();

                            setTimeout(() => {
                                // 정답내려감
                                answerUpStart(); 
                            }, 2500);
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
            // console.log(tickerbag)
            Bag_ticker.start();
        }

        
        // 정답리스트 -- 랜덤이  들어가야 할 자리!!
        function answerObjList(){
            // console.log("answerObjList",answer_list)
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
            // console.log("questObjList",question_list)
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

                //2개일뗴 클릭좌표
                // console.log(e.clientX , e.clientY )
                var bound = canvas.getBoundingClientRect();

                let x = (e.clientX - bound.left) * (canvas.width / bound.width);
                let y = (e.clientY - bound.top) * (canvas.height / bound.height);

                switch(now_round_question[now_round_idx][1]){
                    case 2 :
                        if(Box01_obj.x + 230*scale*0.7 > x && Box01_obj.x - 230*scale*0.7 < x && Box01_obj.y+ 230 * scale*0.7 > y && Box01_obj.y - 230 * scale*0.7 < y){
                            // console.log("111")
                            if(box01_click){
                                Box01_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box01_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(0), 1)
                            }else{
                                Box01_obj.state.addAnimation(0, 'Click', false, 0);
                                box01_click = true
                                click_count += 1
                                answer_check_idx_list.push(0)
                            }
                        }else if(Box02_obj.x + 230*scale*0.7 > x && Box02_obj.x - 230*scale*0.7 < x && Box02_obj.y+ 230 * scale*0.7 > y && Box02_obj.y - 230 * scale*0.7 < y){
                            // console.log("222")
                        
                            if(box02_click){
                                Box02_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box02_click = false;
                                click_count -= 1;
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(1), 1);
                            }else{
                                Box02_obj.state.addAnimation(0, 'Click', false, 0);
                                box02_click = true;
                                click_count += 1;
                                answer_check_idx_list.push(1);
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
                            }else{
                                Box01_obj.state.addAnimation(0, 'Click', false, 0);
                                box01_click = true
                                click_count += 1
                                answer_check_idx_list.push(0)
                            }
                            
                        }else if(Box02_obj.x + 230*scale*0.7 > x && Box02_obj.x - 230*scale*0.7 < x && Box02_obj.y+ 230 * scale*0.7 > y && Box02_obj.y - 230 * scale*0.7 < y){
                            // console.log("222")
                        
                            if(box02_click){
                                Box02_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box02_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(1), 1)
                            }else{
                                Box02_obj.state.addAnimation(0, 'Click', false, 0);
                                box02_click = true
                                click_count += 1
                                answer_check_idx_list.push(1)
                            }
                        }else if(Box03_obj.x + 230*scale*0.7 > x && Box03_obj.x - 230*scale*0.7 < x && Box03_obj.y+ 230 * scale*0.7 > y && Box03_obj.y - 230 * scale*0.7 < y){
                            // console.log("222")
                        
                            if(box03_click){
                                Box03_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box03_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(2), 1)
                            }else{
                                Box03_obj.state.addAnimation(0, 'Click', false, 0);
                                box03_click = true
                                click_count += 1
                                answer_check_idx_list.push(2)
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
                            }else{
                                Box01_obj.state.addAnimation(0, 'Click', false, 0);
                                box01_click = true
                                click_count += 1
                                answer_check_idx_list.push(0)
                            }
                            
                        }else if(Box02_obj.x + 230*scale*0.62 > x && Box02_obj.x - 230*scale*0.62 < x && Box02_obj.y+ 230 * scale*0.62 > y && Box02_obj.y - 230 * scale*0.62 < y){
                            // console.log("222")
                        
                            if(box02_click){
                                Box02_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box02_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(1), 1)
                            }else{
                                Box02_obj.state.addAnimation(0, 'Click', false, 0);
                                box02_click = true
                                click_count += 1
                                answer_check_idx_list.push(1)
                            }
                        }else if(Box03_obj.x + 230*scale*0.62 > x && Box03_obj.x - 230*scale*0.62 < x && Box03_obj.y+ 230 * scale*0.62 > y && Box03_obj.y - 230 * scale*0.62 < y){
                            // console.log("333")
                        
                            if(box03_click){
                                Box03_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box03_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(2), 1)
                            }else{
                                Box03_obj.state.addAnimation(0, 'Click', false, 0);
                                box03_click = true
                                click_count += 1
                                answer_check_idx_list.push(2)
                            }
                        }else if(Box04_obj.x + 230*scale*0.62 > x && Box04_obj.x - 230*scale*0.62 < x && Box04_obj.y+ 230 * scale*0.62 > y && Box04_obj.y - 230 * scale*0.62 < y){
                            // console.log("444")
                        
                            if(box04_click){
                                Box04_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box04_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(3), 1)
                            }else{
                                Box04_obj.state.addAnimation(0, 'Click', false, 0);
                                box04_click = true
                                click_count += 1
                                answer_check_idx_list.push(3)
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
                            }else{
                                Box01_obj.state.addAnimation(0, 'Click', false, 0);
                                box01_click = true
                                click_count += 1
                                answer_check_idx_list.push(0)
                            }
                            
                        }else if(Box02_obj.x + 230*scale*0.62 > x && Box02_obj.x - 230*scale*0.62 < x && Box02_obj.y+ 230 * scale*0.62 > y && Box02_obj.y - 230 * scale*0.62 < y){
                            // console.log("222")
                        
                            if(box02_click){
                                Box02_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box02_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(1), 1)
                            }else{
                                Box02_obj.state.addAnimation(0, 'Click', false, 0);
                                box02_click = true
                                click_count += 1
                                answer_check_idx_list.push(1)
                            }
                        }else if(Box03_obj.x + 230*scale*0.62 > x && Box03_obj.x - 230*scale*0.62 < x && Box03_obj.y+ 230 * scale*0.62 > y && Box03_obj.y - 230 * scale*0.62 < y){
                            // console.log("333")
                        
                            if(box03_click){
                                Box03_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box03_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(2), 1)
                            }else{
                                Box03_obj.state.addAnimation(0, 'Click', false, 0);
                                box03_click = true
                                click_count += 1
                                answer_check_idx_list.push(2)
                            }
                        }else if(Box04_obj.x + 230*scale*0.62 > x && Box04_obj.x - 230*scale*0.62 < x && Box04_obj.y+ 230 * scale*0.62 > y && Box04_obj.y - 230 * scale*0.62 < y){
                            // console.log("444")
                        
                            if(box04_click){
                                Box04_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box04_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(3), 1)
                            }else{
                                Box04_obj.state.addAnimation(0, 'Click', false, 0);
                                box04_click = true
                                click_count += 1
                                answer_check_idx_list.push(3)
                            }
                        }else if(Box05_obj.x + 230*scale*0.62 > x && Box05_obj.x - 230*scale*0.62 < x && Box05_obj.y+ 230 * scale*0.62 > y && Box05_obj.y - 230 * scale*0.62 < y){
                            // console.log("555")
                        
                            if(box05_click){
                                Box05_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box05_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(4), 1)
                            }else{
                                Box05_obj.state.addAnimation(0, 'Click', false, 0);
                                box05_click = true
                                click_count += 1
                                answer_check_idx_list.push(4)
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
                            }else{
                                Box01_obj.state.addAnimation(0, 'Click', false, 0);
                                box01_click = true
                                click_count += 1
                                answer_check_idx_list.push(0)
                            }
                            
                        }else if(Box02_obj.x + 230*scale*0.62 > x && Box02_obj.x - 230*scale*0.62 < x && Box02_obj.y+ 230 * scale*0.62 > y && Box02_obj.y - 230 * scale*0.62 < y){
                            // console.log("222")
                        
                            if(box02_click){
                                Box02_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box02_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(1), 1)
                            }else{
                                Box02_obj.state.addAnimation(0, 'Click', false, 0);
                                box02_click = true
                                click_count += 1
                                answer_check_idx_list.push(1)
                            }
                        }else if(Box03_obj.x + 230*scale*0.62 > x && Box03_obj.x - 230*scale*0.62 < x && Box03_obj.y+ 230 * scale*0.62 > y && Box03_obj.y - 230 * scale*0.62 < y){
                            // console.log("333")
                        
                            if(box03_click){
                                Box03_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box03_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(2), 1)
                            }else{
                                Box03_obj.state.addAnimation(0, 'Click', false, 0);
                                box03_click = true
                                click_count += 1
                                answer_check_idx_list.push(2)
                            }
                        }else if(Box04_obj.x + 230*scale*0.62 > x && Box04_obj.x - 230*scale*0.62 < x && Box04_obj.y+ 230 * scale*0.62 > y && Box04_obj.y - 230 * scale*0.62 < y){
                            // console.log("444")
                        
                            if(box04_click){
                                Box04_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box04_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(3), 1)
                            }else{
                                Box04_obj.state.addAnimation(0, 'Click', false, 0);
                                box04_click = true
                                click_count += 1
                                answer_check_idx_list.push(3)
                            }
                        }else if(Box05_obj.x + 230*scale*0.62 > x && Box05_obj.x - 230*scale*0.62 < x && Box05_obj.y+ 230 * scale*0.62 > y && Box05_obj.y - 230 * scale*0.62 < y){
                            // console.log("555")
                        
                            if(box05_click){
                                Box05_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box05_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(4), 1)
                            }else{
                                Box05_obj.state.addAnimation(0, 'Click', false, 0);
                                box05_click = true
                                click_count += 1
                                answer_check_idx_list.push(4)
                            }
                        }else if(Box06_obj.x + 230*scale*0.62 > x && Box06_obj.x - 230*scale*0.62 < x && Box06_obj.y+ 230 * scale*0.62 > y && Box06_obj.y - 230 * scale*0.62 < y){
                            // console.log("666")
                        
                            if(box06_click){
                                Box06_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box06_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(5), 1)
                            }else{
                                Box06_obj.state.addAnimation(0, 'Click', false, 0);
                                box06_click = true
                                click_count += 1
                                answer_check_idx_list.push(5)
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
                            }else{
                                Box01_obj.state.addAnimation(0, 'Click', false, 0);
                                box01_click = true
                                click_count += 1
                                answer_check_idx_list.push(0)
                            }
                            
                        }else if(Box02_obj.x + 230*scale*0.5 > x && Box02_obj.x - 230*scale*0.5 < x && Box02_obj.y+ 230 * scale*0.5 > y && Box02_obj.y - 230 * scale*0.5 < y){
                            // console.log("222")
                        
                            if(box02_click){
                                Box02_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box02_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(1), 1)
                            }else{
                                Box02_obj.state.addAnimation(0, 'Click', false, 0);
                                box02_click = true
                                click_count += 1
                                answer_check_idx_list.push(1)
                            }
                        }else if(Box03_obj.x + 230*scale*0.5 > x && Box03_obj.x - 230*scale*0.5 < x && Box03_obj.y+ 230 * scale*0.5 > y && Box03_obj.y - 230 * scale*0.5 < y){
                            // console.log("333")
                        
                            if(box03_click){
                                Box03_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box03_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(2), 1)
                            }else{
                                Box03_obj.state.addAnimation(0, 'Click', false, 0);
                                box03_click = true
                                click_count += 1
                                answer_check_idx_list.push(2)
                            }
                        }else if(Box04_obj.x + 230*scale*0.5 > x && Box04_obj.x - 230*scale*0.5 < x && Box04_obj.y+ 230 * scale*0.5 > y && Box04_obj.y - 230 * scale*0.5 < y){
                            // console.log("444")
                        
                            if(box04_click){
                                Box04_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box04_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(3), 1)
                            }else{
                                Box04_obj.state.addAnimation(0, 'Click', false, 0);
                                box04_click = true
                                click_count += 1
                                answer_check_idx_list.push(3)
                            }
                        }else if(Box05_obj.x + 230*scale*0.5 > x && Box05_obj.x - 230*scale*0.5 < x && Box05_obj.y+ 230 * scale*0.5 > y && Box05_obj.y - 230 * scale*0.5 < y){
                            // console.log("555")
                        
                            if(box05_click){
                                Box05_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box05_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(4), 1)
                            }else{
                                Box05_obj.state.addAnimation(0, 'Click', false, 0);
                                box05_click = true
                                click_count += 1
                                answer_check_idx_list.push(4)
                            }
                        }else if(Box06_obj.x + 230*scale*0.5 > x && Box06_obj.x - 230*scale*0.5 < x && Box06_obj.y+ 230 * scale*0.5 > y && Box06_obj.y - 230 * scale*0.5 < y){
                            // console.log("666")
                        
                            if(box06_click){
                                Box06_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box06_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(5), 1)
                            }else{
                                Box06_obj.state.addAnimation(0, 'Click', false, 0);
                                box06_click = true
                                click_count += 1
                                answer_check_idx_list.push(5)
                            }
                        }else if(Box07_obj.x + 230*scale*0.5 > x && Box07_obj.x - 230*scale*0.5 < x && Box07_obj.y+ 230 * scale*0.5 > y && Box07_obj.y - 230 * scale*0.5 < y){
                            // console.log("777")
                        
                            if(box07_click){
                                Box07_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box07_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(6), 1)
                            }else{
                                Box07_obj.state.addAnimation(0, 'Click', false, 0);
                                box07_click = true
                                click_count += 1
                                answer_check_idx_list.push(6)
                            }
                        }else if(Box08_obj.x + 230*scale*0.5 > x && Box08_obj.x - 230*scale*0.5 < x && Box08_obj.y+ 230 * scale*0.5 > y && Box08_obj.y - 230 * scale*0.5 < y){
                            // console.log("888")
                        
                            if(box08_click){
                                Box08_obj.state.addAnimation(0, 'UnClick', false, 0);
                                box08_click = false
                                click_count -= 1
                                answer_check_idx_list.splice(answer_check_idx_list.indexOf(7), 1)
                            }else{
                                Box08_obj.state.addAnimation(0, 'Click', false, 0);
                                box08_click = true
                                click_count += 1
                                answer_check_idx_list.push(7)
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
                                    // console.log(answer_check_idx_list)
                                    
                                }else{
                                    Box01_obj.state.addAnimation(0, 'Click', false, 0);
                                    box01_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(0)
                                    // console.log(answer_check_idx_list)
                                    
                                }
                                
                            }else if(Box02_obj.x + 230*scale*0.45 > x && Box02_obj.x - 230*scale*0.45 < x && Box02_obj.y+ 230 * scale*0.45 > y && Box02_obj.y - 230 * scale*0.45 < y){
                                // console.log("222")
                            
                                if(box02_click){
                                    Box02_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box02_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(1), 1)
                                    // console.log(answer_check_idx_list)

                                }else{
                                    Box02_obj.state.addAnimation(0, 'Click', false, 0);
                                    box02_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(1)
                                    // console.log(answer_check_idx_list)
                                    
                                }
                            }else if(Box03_obj.x + 230*scale*0.45 > x && Box03_obj.x - 230*scale*0.45 < x && Box03_obj.y+ 230 * scale*0.45 > y && Box03_obj.y - 230 * scale*0.45 < y){
                                // console.log("333")
                            
                                if(box03_click){
                                    Box03_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box03_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(2), 1)
                                    // console.log(answer_check_idx_list)
                                    
                                }else{
                                    Box03_obj.state.addAnimation(0, 'Click', false, 0);
                                    box03_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(2)
                                    // console.log(answer_check_idx_list)
                                    
                                }
                            }else if(Box04_obj.x + 230*scale*0.45 > x && Box04_obj.x - 230*scale*0.45 < x && Box04_obj.y+ 230 * scale*0.45 > y && Box04_obj.y - 230 * scale*0.45 < y){
                                // console.log("444")
                            
                                if(box04_click){
                                    Box04_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box04_click = false;
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(3), 1)
                                    // console.log(answer_check_idx_list)
                                    
                                }else{
                                    Box04_obj.state.addAnimation(0, 'Click', false, 0);
                                    box04_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(3)
                                    // console.log(answer_check_idx_list)
                                    
                                }
                            }else if(Box05_obj.x + 230*scale*0.45 > x && Box05_obj.x - 230*scale*0.45 < x && Box05_obj.y+ 230 * scale*0.45 > y && Box05_obj.y - 230 * scale*0.45 < y){
                                // console.log("555")
                            
                                if(box05_click){
                                    Box05_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box05_click = false;
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(4), 1)
                                    // console.log(answer_check_idx_list)
                                    
                                }else{
                                    Box05_obj.state.addAnimation(0, 'Click', false, 0);
                                    box05_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(4)
                                    // console.log(answer_check_idx_list)
                                    
                                }
                            }else if(Box06_obj.x + 230*scale*0.45 > x && Box06_obj.x - 230*scale*0.45 < x && Box06_obj.y+ 230 * scale*0.45 > y && Box06_obj.y - 230 * scale*0.45 < y){
                                // console.log("666")
                            
                                if(box06_click){
                                    Box06_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box06_click = false;
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(5), 1)
                                    // console.log(answer_check_idx_list)
                                    
                                }else{
                                    Box06_obj.state.addAnimation(0, 'Click', false, 0);
                                    box06_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(5)
                                    // console.log(answer_check_idx_list)
                                    
                                }
                            }else if(Box07_obj.x + 230*scale*0.45 > x && Box07_obj.x - 230*scale*0.45 < x && Box07_obj.y+ 230 * scale*0.45 > y && Box07_obj.y - 230 * scale*0.45 < y){
                                // console.log("777")
                            
                                if(box07_click){
                                    Box07_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box07_click = false;
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(6), 1)
                                    // console.log(answer_check_idx_list)

                                }else{
                                    Box07_obj.state.addAnimation(0, 'Click', false, 0);
                                    box07_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(6)
                                    // console.log(answer_check_idx_list)
                                    
                                }
                            }else if(Box08_obj.x + 230*scale*0.45 > x && Box08_obj.x - 230*scale*0.45 < x && Box08_obj.y+ 230 * scale*0.45 > y && Box08_obj.y - 230 * scale*0.45 < y){
                                // console.log("888")
                            
                                if(box08_click){
                                    Box08_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box08_click = false;
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(7), 1)
                                    // console.log(answer_check_idx_list)
                                    
                                }else{
                                    Box08_obj.state.addAnimation(0, 'Click', false, 0);
                                    box08_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(7)
                                    // console.log(answer_check_idx_list)
                                    
                                }
                            }else if(Box09_obj.x + 230*scale*0.45 > x && Box09_obj.x - 230*scale*0.45 < x && Box09_obj.y+ 230 * scale*0.45 > y && Box09_obj.y - 230 * scale*0.45 < y){
                                // console.log("999")
                            
                                if(box09_click){
                                    Box09_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box09_click = false;
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(8), 1)
                                    // console.log(answer_check_idx_list)
                                    
                                }else{
                                    Box09_obj.state.addAnimation(0, 'Click', false, 0);
                                    box09_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(8)
                                    // console.log(answer_check_idx_list)
                                    
                                }
                            }else if(Box10_obj.x + 230*scale*0.45 > x && Box10_obj.x - 230*scale*0.45 < x && Box10_obj.y+ 230 * scale*0.45 > y && Box10_obj.y - 230 * scale*0.45 < y){
                                // console.log("101010")
                            
                                if(box10_click){
                                    Box10_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box10_click = false;
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(9), 1)
                                    // console.log(answer_check_idx_list)
                                    
                                }else{
                                    Box10_obj.state.addAnimation(0, 'Click', false, 0);
                                    box10_click = true;
                                    click_count += 1
                                    answer_check_idx_list.push(9)
                                    // console.log(answer_check_idx_list)
                                    
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
                                }else{
                                    Box01_obj.state.addAnimation(0, 'Click', false, 0);
                                    box01_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(0)
                                }
                                
                            }else if(Box02_obj.x + 230*scale*0.5 > x && Box02_obj.x - 230*scale*0.5 < x && Box02_obj.y+ 230 * scale*0.5 > y && Box02_obj.y - 230 * scale*0.5 < y){
                                // console.log("222")
                            
                                if(box02_click){
                                    Box02_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box02_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(1), 1)
                                }else{
                                    Box02_obj.state.addAnimation(0, 'Click', false, 0);
                                    box02_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(1)
                                }
                            }else if(Box03_obj.x + 230*scale*0.5 > x && Box03_obj.x - 230*scale*0.5 < x && Box03_obj.y+ 230 * scale*0.5 > y && Box03_obj.y - 230 * scale*0.5 < y){
                                // console.log("333")
                            
                                if(box03_click){
                                    Box03_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box03_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(2), 1)
                                }else{
                                    Box03_obj.state.addAnimation(0, 'Click', false, 0);
                                    box03_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(2)
                                }
                            }else if(Box04_obj.x + 230*scale*0.5 > x && Box04_obj.x - 230*scale*0.5 < x && Box04_obj.y+ 230 * scale*0.5 > y && Box04_obj.y - 230 * scale*0.5 < y){
                                // console.log("444")
                            
                                if(box04_click){
                                    Box04_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box04_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(3), 1)
                                }else{
                                    Box04_obj.state.addAnimation(0, 'Click', false, 0);
                                    box04_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(3)
                                }
                            }else if(Box05_obj.x + 230*scale*0.5 > x && Box05_obj.x - 230*scale*0.5 < x && Box05_obj.y+ 230 * scale*0.5 > y && Box05_obj.y - 230 * scale*0.5 < y){
                                // console.log("555")
                            
                                if(box05_click){
                                    Box05_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box05_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(4), 1)
                                }else{
                                    Box05_obj.state.addAnimation(0, 'Click', false, 0);
                                    box05_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(4)
                                }
                            }else if(Box06_obj.x + 230*scale*0.5 > x && Box06_obj.x - 230*scale*0.5 < x && Box06_obj.y+ 230 * scale*0.5 > y && Box06_obj.y - 230 * scale*0.5 < y){
                                // console.log("666")
                            
                                if(box06_click){
                                    Box06_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box06_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(5), 1)
                                }else{
                                    Box06_obj.state.addAnimation(0, 'Click', false, 0);
                                    box06_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(5)
                                }
                            }else if(Box07_obj.x + 230*scale*0.5 > x && Box07_obj.x - 230*scale*0.5 < x && Box07_obj.y+ 230 * scale*0.5 > y && Box07_obj.y - 230 * scale*0.5 < y){
                                // console.log("777")
                            
                                if(box07_click){
                                    Box07_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box07_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(6), 1)
                                }else{
                                    Box07_obj.state.addAnimation(0, 'Click', false, 0);
                                    box07_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(6)
                                }
                            }else if(Box08_obj.x + 230*scale*0.5 > x && Box08_obj.x - 230*scale*0.5 < x && Box08_obj.y+ 230 * scale*0.5 > y && Box08_obj.y - 230 * scale*0.5 < y){
                                // console.log("888")
                            
                                if(box08_click){
                                    Box08_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box08_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(7), 1)
                                }else{
                                    Box08_obj.state.addAnimation(0, 'Click', false, 0);
                                    box08_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(7)
                                }
                            }else if(Box09_obj.x + 230*scale*0.5 > x && Box09_obj.x - 230*scale*0.5 < x && Box09_obj.y+ 230 * scale*0.5 > y && Box09_obj.y - 230 * scale*0.5 < y){
                                // console.log("999")
                            
                                if(box09_click){
                                    Box09_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box09_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(8), 1)
                                }else{
                                    Box09_obj.state.addAnimation(0, 'Click', false, 0);
                                    box09_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(8)
                                }
                            }else if(Box10_obj.x + 230*scale*0.5 > x && Box10_obj.x - 230*scale*0.5 < x && Box10_obj.y+ 230 * scale*0.5 > y && Box10_obj.y - 230 * scale*0.5 < y){
                                // console.log("101010")
                            
                                if(box10_click){
                                    Box10_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box10_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(9), 1)
                                }else{
                                    Box10_obj.state.addAnimation(0, 'Click', false, 0);
                                    box10_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(9)
                                }
                            }else if(Box11_obj.x + 230*scale*0.5 > x && Box11_obj.x - 230*scale*0.5 < x && Box11_obj.y+ 230 * scale*0.5 > y && Box11_obj.y - 230 * scale*0.5 < y){
                                // console.log("111111")
                            
                                if(box11_click){
                                    Box11_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box11_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(10), 1)
                                }else{
                                    Box11_obj.state.addAnimation(0, 'Click', false, 0);
                                    box11_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(10)
                                }
                            }else if(Box12_obj.x + 230*scale*0.5 > x && Box12_obj.x - 230*scale*0.5 < x && Box12_obj.y+ 230 * scale*0.5 > y && Box12_obj.y - 230 * scale*0.5 < y){
                                // console.log("121212")
                            
                                if(box12_click){
                                    Box10_obj.state.addAnimation(0, 'UnClick', false, 0);
                                    box12_click = false
                                    click_count -= 1
                                    answer_check_idx_list.splice(answer_check_idx_list.indexOf(11), 1)
                                }else{
                                    Box12_obj.state.addAnimation(0, 'Click', false, 0);
                                    box12_click = true
                                    click_count += 1
                                    answer_check_idx_list.push(11)
                                }
                            }
                            break;
                }

                if(click_count == now_round_question[now_round_idx][0] ){
                    $('#mycanvas').unbind('pointerdown');
                    // console.log("정답비교");
                    memory_bag.x = width * 0.5;
                    memory_bag.y = height * 0.556;


                    // console.log(answer_check_idx_list.toString())
                    // console.log(answer_idx_list[now_round_idx].toString())
                    // console.log(JSON.stringify(answer_check_idx_list) === JSON.stringify(answer_idx_list[now_round_idx]));

                    // 정답비교
                    let try_answer_count = 0;
                    for (var i = 0; i < answer_check_idx_list.length; i++) {
                        // Check if we have nested arrays
                        if (answer_idx_list[now_round_idx].indexOf(answer_check_idx_list[i]) == -1) {
                            // console.log("틀틀")
                        } else { 
                            try_answer_count += 1;
                            // console.log("답답")
                        }           
                    }       

                    // console.log(try_answer_count)
                    
                    if(try_answer_count == now_round_question[now_round_idx][0]){
                        // console.log("답답")
                        let Success = memory_bag.state.addAnimation(0, 'Success', false, 0);
                        let Success_time = Success.animationEnd;
                        fail_count = 0;
                        setTimeout(() => {
                            tickerbagStart();
                        }, Success_time*1000);
                    }else{
                        // console.log("틀틀")
                        let fail = memory_bag.state.addAnimation(0, 'Fail', false, 0);
                        let fail_time = fail.animationEnd;
                        fail_count += 1;

                        setTimeout(() => {
                            tickerbagStart();
                        }, fail_time*1000);
                    }
                }
            })
        }



        app.start();
    }


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
    const container = document.getElementById('container');
    container.removeChild(app.view);


    // // console.log("총 수행 라운드 : ", total_round, ssResponseTimeList.length);
    // // console.log("총 정답 라운드 : ", ssNumOfSuccessRound);

    // // console.log("전체 라운드 반응시간 리스트 : ", ssResponseTimeList);
    // // console.log("연속 정답 리스트 : ", ssMaxCnsctvSuccessCountlist);
    // // console.log("연속 정답 개수 : ", ssMaxCnsctvSuccessCount);
    // // console.log("총 수행 시간 : ", ssPerformanceTime / 1000);
}