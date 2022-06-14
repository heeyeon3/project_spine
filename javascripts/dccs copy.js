var app;    // PIXI JS APPLICATION

let grayscale ;                         // GRAY SCALE

// 문제우형 마다 설명 처음은 컬러임으로 트루
let tutorial_color = true;
let tutorial_shape = false;
let tutorial_count = 0;
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

//실패 카운트 연속 2번일 경우 확인하기 위함
let fail_count = 0



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

        .add('grey_scale',      'grey_scale.png')
        .add('UIBox_01',        'spine/WISC/common/UIBox_02.png')
        .add('UIPause',         'spine/WISC/common/UIPause.png')
        .add('UISound',         'spine/WISC/common/UISound.png')
        .add('Color',           'spine/DCCS/Sprite/Color.png')
        .add('Form',            'spine/DCCS/Sprite/Form.png')
        .add('DCCSStar',        'spine/DCCS/Sprite/DCCSStar.png')
        .add('DCCSTriangle',    'spine/DCCS/Sprite/DCCSTriangle.png')
        .add('DCCSTime_01',     'spine/DCCS/Sprite/DCCSTime_01.png')
        .add('DCCSTime_02',     'spine/DCCS/Sprite/DCCSTime_02.png')
        .load(onAssetsLoaded);
 


    app.stage.interactive = true;
    app.stage.buttonMode = true;
    app.stage.sortableChildren = true;

    function onAssetsLoaded(loader, res) {
        // // console.log(width)
        // // console.log(height)
        // // console.log(scale)
        
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

        let UIBox_text = new PIXI.Text("경찰아저씨가 색깔이라고 하면 같은 색깔의 버튼을 누르세요!",{
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

        let background = new PIXI.spine.Spine(res.dccs_bg.spineData);
                    
        let remoteLeft = new PIXI.spine.Spine(res.dccs_remote.spineData);  //왼쪽 리모콘
        let remoteRight = new PIXI.spine.Spine(res.dccs_remote.spineData);  //오른쪽 리모콘
                    
        let eagle = new PIXI.spine.Spine(res.dccs_eagle.spineData); // 문제내는 독수리


        let color_text = new PIXI.Text("색깔",{
            fill : 0xFFFFFF,
            fontSize : "100px"
        })
        color_text.x = width * 2
        color_text.y = height * 2
        color_text.scale.set(scale);
       

        let color_img = PIXI.Sprite.from(res.Color.texture);
        color_img.x = width * 2
        color_img.y = height * 2
        color_img.scale.set(scale);


        let shape_text = new PIXI.Text("모양",{
            fill : 0xFFFFFF,
            fontSize : "100px"
        })
        shape_text.x = width * 2
        shape_text.y = height * 2
        shape_text.scale.set(scale);
        
 

        let shape_img = PIXI.Sprite.from(res.Form.texture);
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
        let wineffect = new PIXI.spine.Spine(res.dccs_wineffect.spineData);

        wineffect.x = width * 0.5
        wineffect.y = height * 0.325
        wineffect.scale.set(scale);

        //tutorial take01
        let tutorial = new PIXI.spine.Spine(res.dccs_tutorial.spineData);

        tutorial.x = width/2
        tutorial.y = height/2
        tutorial.scale.set(scale);
        app.stage.addChild(tutorial);

        let take01 = tutorial.state.addAnimation(0, 'Take_01', false);
        let take01_time = take01.animationEnd * 0


        setTimeout(() => {
            app.stage.removeChild(tutorial)

            //background
            background.x = width/2
            background.y = height/2
            background.scale.set(scale);
            app.stage.addChild(background);

            background.state.addAnimation(0, 'Idle', true, 0);

            
            //왼쪽 버튼
            remoteLeft.x = width * 0.15
            remoteLeft.y = height * 0.85
            remoteLeft.scale.set(scale);
            app.stage.addChild(remoteLeft);

            remoteLeft.state.addAnimation(0, 'Triangle_Idle', false, 0);
            // remoteLeft.state.addAnimation(0, 'Star_Click', false, 0);

            //오른쪽 버튼
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


            eaglequest()
            
        }, take01_time*1000);



        
        function eaglequest(){
         
            eagle.state.addAnimation(1, 'Idle', true, 0);
            eagle.state.addAnimation(1, 'Up', false, 0);
            eagle.state.addAnimation(1, 'Quiz', false, 0);

            
        }

        // eagle ISCOMPLETE로 분기
        eagle.state.addListener({
            complete : function(e){
                // console.log(e.animation.name);
                // // console.log("COMPLETE");
                

                if(e.animation.name == 'Up'){
                    // console.log("UpUp")
                    if(quest_type == 0){
                        //모양 문제
                        shape_text.x = width * 0.455
                        shape_text.y = height * 0.2
                        shape_img.x = width * 0.4
                        shape_img.y = height * 0.325

                    }else if(quest_type == 1){
                        // 색 문제
                        color_text.x = width * 0.455
                        color_text.y = height * 0.2
                        color_img.x = width * 0.4
                        color_img.y = height * 0.325
                    }
                    
                }else if(e.animation.name == 'Quiz'){
                    // console.log("Quiz!!!!!!!!")
                    
                    color_text.y = height * 2
                    shape_text.y = height * 2
         
                    color_img.y = height * 2
                    shape_img.y = height * 2

                    let wineffect = new PIXI.spine.Spine(res.dccs_wineffect.spineData);

                    wineffect.x = width * 0.5
                    wineffect.y = height * 0.325
                    wineffect.scale.set(scale);
                    app.stage.addChild(wineffect);

                    let Change = wineffect.state.addAnimation(0, 'Change', false, 0);
                    let Change_time = Change.animationEnd
                    // console.log(Change_time)

                    setTimeout(() => {
                        app.stage.removeChild(wineffect);
                        // console.log("123123123", quest_shape_type)
                        if(quest_shape_type == 0){
                            // console.log("12")
                            shape_star.x = width * 0.43
                            shape_star.y = height * 0.2
                            if(tutorial_color){
                                eagle.state.addAnimation(1, 'Talk', true, 0);
                                handclick.x = width * 0.145
                                handclick.y = height * 0.875
                                handclick.scale.set(scale*0.7);
                                app.stage.addChild(handclick);
        
                                var handclick_ani = handclick.state.addAnimation(0, 'Click', true, 0 );
                                var handclick_time = handclick_ani.animationEnd

                                setTimeout(() => {
                                    app.stage.removeChild(handclick);
                                    tutorialEx()
                                }, (handclick_time)*1000);
                                
                            }else if(tutorial_shape){
                                eagle.state.addAnimation(1, 'Talk', true, 0);
                                handclick.x = width * 0.855
                                handclick.y = height * 0.875
                                handclick.scale.set(scale*0.7);
                                app.stage.addChild(handclick);
        
                                var handclick1_ani = handclick.state.addAnimation(0, 'Click', true, 0 );
                                var handclick1_time = handclick1_ani.animationEnd
                                setTimeout(() => {
                                    app.stage.removeChild(handclick);
                                    tutorialEx()
                                }, (handclick1_time)*1000);
                                
                            }else if(tutorial_count<2){
                                eagle.state.addAnimation(1, 'Talk', true, 0);
                                // console.log("!!!!!!!!!!!!!!!!!!!!")
                                answerClick()
                            }else if(tutorial_count==2){
                                eagle.state.addAnimation(1, 'Talk', false, 0);
                                timer_set();
                                answerClickNT()
                            }
                        }else if(quest_shape_type == 1){
              
                            shape_triangle.x = width * 0.43
                            shape_triangle.y = height * 0.2
                            // console.log("emfmeffmfjfjn")


                            eagle.state.addAnimation(1, 'Talk', false, 0);

                            if(tutorial_count<2){
                                // console.log("!!!!????????????????!")
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
                    tutorial_color = false
                    setTimeout(() => {
                        shape_star.x = width * 2
                        shape_star.y = height * 2
                        // shape_triangle.y = height * 2
                        // shape_triangle.x = width * 2
                        UIBox_text.text = "경찰아저씨가 색깔이라고 하면 같은 색깔의 버튼을 누르세요!";
                        app.stage.removeChild(common_heart1);
                        app.stage.removeChild(common_heart2);
                        app.stage.removeChild(UIBox_01)
                        app.stage.removeChild(UIBox_text)
                        app.stage.removeChild(UIPause)
                        app.stage.removeChild(UISound)

                        blue_btn_click()
                    }, 90);

                    // setTimeout(() => {
                        
                    // }, Success_time*1000+500);
                }else if(tutorial_shape){
                    let Success = eagle.state.addAnimation(1, 'Down', false, 0);
                    let Success_time  = Success.animationEnd
                    tutorial_shape = false
                    $('#mycanvas').unbind("pointerdown")
                    setTimeout(() => {
                        shape_star.x = width * 2
                        shape_star.y = height * 2
                        // shape_triangle.y = height * 2
                        // shape_triangle.x = width * 2

                        blue_btn_click()
                        
                    }, 90);
                    // setTimeout(() => {
                        

                    // }, Success_time*1000+500);
                    
                }
            
        }

        

        function tutorial_quest(){
            quest_shape_type = Math.floor(Math.random()*2)
            // console.log(quest_shape_type)
        }

        // 튜토리얼 ANSWERCLICK
        function answerClick(){
            // console.log("answerClickanswerClickanswerClickanswerClickanswerClickanswerClick")
            // console.log("quest_type", quest_type, "quest_shape_type", quest_shape_type)
            $('#mycanvas').on('pointerdown', function(e){
                // // console.log("click!!")
                // console.log(e.clientX , e.clientY )
                var bound = canvas.getBoundingClientRect();

                let x = (e.clientX - bound.left) * (canvas.width / bound.width);
                let y = (e.clientY - bound.top) * (canvas.height / bound.height);

                if(remoteLeft.x+418*scale*0.5 > x && remoteLeft.x-418*scale*0.5 < x && remoteLeft.y+339*scale*0.5 > y && remoteLeft.y-339*scale *0.5< y ){
                    // console.log("left click")
                    remoteLeft.state.addAnimation(1, 'Triangle_Click', false, 0);
                    $('#mycanvas').unbind("pointerdown")

                    if((quest_type == 0 && quest_shape_type ==0)|| (quest_type == 1 && quest_shape_type ==1)){
                        //0번 머양 문제
                        eagle.state.addAnimation(1, 'Fail', false, 0);
                        background.state.addAnimation(1, 'Fail', false, 0);
                        background.state.addAnimation(1, 'Idle', true, 0);

                        tutorial_fail = true
                        setTimeout(() => {
                            shape_star.x = width * 2
                            shape_star.y = height * 2
                            shape_triangle.y = height * 2
                            shape_triangle.x = width * 2
                        }, 90);

                        
                        
                        
                    }else if((quest_type == 0 && quest_shape_type ==1)|| (quest_type == 1 && quest_shape_type ==0)){
                        eagle.state.addAnimation(1, 'Success', false, 0);
                        // set up the mixes!
                        background.stateData.setMix('LeftSuccess', 'Idle', 0.1);
                        // play animation
                        background.state.setAnimation(0, 'LeftSuccess', false);
                        background.state.addAnimation(0, 'Idle', true, 0);


                        tutorialSC += 1
                        // remoteLeft.state.addAnimation(0, 'Triangle_Idle', false, 0);
                        setTimeout(() => {
                            shape_star.x = width * 2
                            shape_star.y = height * 2
                            shape_triangle.y = height * 2
                            shape_triangle.x = width * 2
                        }, 90);
                        if(tutorialSC <2){
                            tutorial_quest()
                            eaglequest()
                        }
               
                    }
                }else if(remoteRight.x+418*scale*0.5 > x && remoteRight.x-418*scale*0.5 < x && remoteRight.y+339*scale*0.5 > y && remoteRight.y-339*scale *0.5< y){
                    // console.log("right click")
                    remoteRight.state.addAnimation(0, 'Star_Click', false, 0);
                    $('#mycanvas').unbind("pointerdown")
      
                    if((quest_type == 0 && quest_shape_type ==0)|| (quest_type == 1 && quest_shape_type ==1)){
                        eagle.state.addAnimation(1, 'Success', false, 0);
                        // set up the mixes!
                        background.stateData.setMix('RightSuccess', 'Idle', 0.1);
                        // play animation
                        background.state.setAnimation(0, 'RightSuccess', false);
                        background.state.addAnimation(0, 'Idle', true, 0);

                        tutorialSC += 1
                        setTimeout(() => {
                            shape_star.x = width * 2
                            shape_star.y = height * 2
                            shape_triangle.y = height * 2
                            shape_triangle.x = width * 2
                        }, 90);
                        if(tutorialSC <2){
                            tutorial_quest()
                            eaglequest()
                        }
                        
                       
                    }else if((quest_type == 0 && quest_shape_type ==1)|| (quest_type == 1 && quest_shape_type ==0)){
                        eagle.state.addAnimation(1, 'Fail', false, 0);
                        background.state.addAnimation(1, 'Fail', false, 0);
                        background.state.addAnimation(1, 'Idle', true, 0);
                        tutorial_fail = true
                        setTimeout(() => {
                            shape_star.x = width * 2
                            shape_star.y = height * 2
                            shape_triangle.y = height * 2
                            shape_triangle.x = width * 2
                        }, 90);
                        
                        
                    }
                }
            })
        }


        function GreatGoodFail(){
            let rucro = new PIXI.spine.Spine(res.gonogo_rucro.spineData);

            rucro.x = width * 0.5
            rucro.y = height * 0.5
            rucro.scale.set(scale);
            app.stage.addChild(grayscale);
            app.stage.addChild(rucro);
            


            if(tutorialSC == 2){
                let Good = rucro.state.addAnimation(4, 'Good', false, 0)
                let Good_time = Good.animationEnd

                tutorial_count +=1

                if(tutorial_count <2){
                    setTimeout(() => {
                        app.stage.removeChild(rucro);
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
                        app.stage.removeChild(UIPause)
                        app.stage.removeChild(UISound)
                    }, Good_time*1000);
                }else if(tutorial_count == 2){
                    setTimeout(() => {
                        Istutorial = false;
                        app.stage.removeChild(grayscale);

                        UIBox_text.text = "경찰아저씨의 말을 잘 듣고 같은 모양이나 같은 색깔을 찾아요!";
                        app.stage.removeChild(common_heart1);
                        app.stage.removeChild(common_heart2);
                        app.stage.removeChild(UIBox_01)
                        app.stage.removeChild(UIBox_text)
                        app.stage.removeChild(UIPause)
                        app.stage.removeChild(UISound)

                        blue_btn_click()
                        // eaglequest()
                    }, Good_time*1000);
                }


                


            }else if(tutorial_fail){
                let Fail = rucro.state.addAnimation(4, 'Fail', false, 0)
                let Fail_time = Fail.animationEnd
                tutorial_fail = false
                setTimeout(() => {
                    app.stage.removeChild(rucro);
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
            app.stage.addChild(start);
            
            app.stage.addChild(common_heart1);
            app.stage.addChild(common_heart2);
            app.stage.addChild(UIBox_01)
            app.stage.addChild(UIBox_text)
            app.stage.addChild(UIPause)
            app.stage.addChild(UISound)

            common_heart1.state.addAnimation(0, 'Full', true);
            common_heart2.state.addAnimation(0, 'Full', true);

            if(tutorial_count < 2){
                let blue_btn = start.state.addAnimation(2, 'Ready2', false, 0);
                let blue_btn_time = blue_btn.animationEnd
                start.state.addAnimation(2, 'Ready2', true, 0);
                
                $('#mycanvas').on("pointerdown", function(e){
                    var bound = canvas.getBoundingClientRect();
           

                    let x = (e.clientX - bound.left) * (canvas.width / bound.width);
                    let y = (e.clientY - bound.top) * (canvas.height / bound.height);
                    if(start.x + 206.5*scale*1 > x && start.x - 206.5*scale*1< x && start.y+ 160 * scale*2> y && start.y - 160 * scale*0.3 < y){

                        $('#mycanvas').unbind("pointerdown")
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
                            tutorial_color = false
                            tutorial_quest()
                            eaglequest()
                            app.stage.removeChild(grayscale);
                        }, count_time*4*1000);
                    }
                })
            }else{
                let blue_btn = start.state.addAnimation(2, 'Ready', false, 0);
                let blue_btn_time = blue_btn.animationEnd
                start.state.addAnimation(2, 'Ready', true, 0);

                
                $('#mycanvas').on("pointerdown", function(e){
                    var bound = canvas.getBoundingClientRect();
           

                    let x = (e.clientX - bound.left) * (canvas.width / bound.width);
                    let y = (e.clientY - bound.top) * (canvas.height / bound.height);
                    if(start.x + 206.5*scale*1 > x && start.x - 206.5*scale*1< x && start.y+ 160 * scale*2> y && start.y - 160 * scale*0.3 < y){
                        $('#mycanvas').unbind("pointerdown")
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
                            questNT()
                            app.stage.removeChild(grayscale);
                        }, count_time*4*1000);
                    }
                })
            }                       

            
        }

        
        //본게임
        function questNT(){
            // 문제타입 quest_idx
            let quest = [0,0,0,1,1,1,0,1,1,0,1,0,0,1,0,1,1]
            quest_type = quest[quest_idx]
            quest_shape_type = Math.floor(Math.random()*2)
            // console.log("문제 타입",quest_shape_type, "모양 타입", quest_shape_type)
            eaglequest()
            quest_idx +=1

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
                fontSize : "60px"
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
                        clearInterval(code_timer);
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

                        
                        setTimeout(() => {
                            shape_star.x = width * 2
                            shape_star.y = height * 2
                            shape_triangle.y = height * 2
                            shape_triangle.x = width * 2
                        }, 100);
                    }
                }, 1000);
                timer_start.start();
            }
            
            

            let hide_position = 0

            app.animationUpdate = function () {
                
                var animation_speed = 5 * 1000 / 16.6;    // 5초
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


        function answerClickNT(){
            // console.log("quest_type", quest_type, "quest_shape_type", quest_shape_type)
            $('#mycanvas').on('pointerdown', function(e){
                clearInterval(code_timer);
                app.stage.removeChild(timer_bg);
                app.stage.removeChild(timer);
                app.stage.removeChild(timer_text);
    
                var bound = canvas.getBoundingClientRect();

                let x = (e.clientX - bound.left) * (canvas.width / bound.width);
                let y = (e.clientY - bound.top) * (canvas.height / bound.height);

                if(remoteLeft.x+418*scale*0.5 > x && remoteLeft.x-418*scale*0.5 < x && remoteLeft.y+339*scale*0.5 > y && remoteLeft.y-339*scale *0.5< y ){
                    // console.log("left click")
                    remoteLeft.state.addAnimation(1, 'Triangle_Click', false, 0);
                    $('#mycanvas').unbind("pointerdown")
                    if((quest_type == 0 && quest_shape_type ==0)|| (quest_type == 1 && quest_shape_type ==1)){
                        //0번 모양 문제
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

                        setTimeout(() => {
                            shape_star.x = width * 2
                            shape_star.y = height * 2
                            shape_triangle.y = height * 2
                            shape_triangle.x = width * 2
                        }, 100);


                        
                    }else if((quest_type == 0 && quest_shape_type ==1)|| (quest_type == 1 && quest_shape_type ==0)){
                        eagle.state.addAnimation(1, 'Success', false, 0);
                        // set up the mixes!
                        background.stateData.setMix('LeftSuccess', 'Idle', 0.1);
                        // play animation
                        background.state.setAnimation(0, 'LeftSuccess', false);
                        background.state.addAnimation(0, 'Idle', true, 0);
                        tutorialSC += 1
                        fail_count = 0

                        common_heart1.state.setAnimation(0, 'EmptyToFull', false);
                        common_heart2.state.setAnimation(0, 'EmptyToFull', false);
                        
                        common_heart1.state.addAnimation(0, 'Full', true);
                        common_heart2.state.addAnimation(0, 'Full', true);
                        
                        // remoteLeft.state.addAnimation(0, 'Triangle_Idle', false, 0);
                        setTimeout(() => {
                            shape_star.x = width * 2
                            shape_star.y = height * 2
                            shape_triangle.y = height * 2
                            shape_triangle.x = width * 2
                        }, 100);
                 
                    }
                }else if(remoteRight.x+418*scale*0.5 > x && remoteRight.x-418*scale*0.5 < x && remoteRight.y+339*scale*0.5 > y && remoteRight.y-339*scale *0.5< y){
                    // console.log("right click")
                    remoteRight.state.addAnimation(0, 'Star_Click', false, 0);
                    $('#mycanvas').unbind("pointerdown")
                    if((quest_type == 0 && quest_shape_type ==0)|| (quest_type == 1 && quest_shape_type ==1)){
                        eagle.state.addAnimation(1, 'Success', false, 0);
                        // set up the mixes!
                        background.stateData.setMix('RightSuccess', 'Idle', 0.1);
                        // play animation
                        background.state.setAnimation(0, 'RightSuccess', false);
                        background.state.addAnimation(0, 'Idle', true, 0);

                        tutorialSC += 1
                        fail_count = 0

                        common_heart1.state.setAnimation(0, 'EmptyToFull', false);
                        common_heart2.state.setAnimation(0, 'EmptyToFull', false);
                        
                        common_heart1.state.addAnimation(0, 'Full', true);
                        common_heart2.state.addAnimation(0, 'Full', true);
                        setTimeout(() => {
                            shape_star.x = width * 2
                            shape_star.y = height * 2
                            shape_triangle.y = height * 2
                            shape_triangle.x = width * 2
                        }, 90);
                     
                        
                       
                    }else if((quest_type == 0 && quest_shape_type ==1)|| (quest_type == 1 && quest_shape_type ==0)){
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
                       
                        setTimeout(() => {
                            shape_star.x = width * 2
                            shape_star.y = height * 2
                            shape_triangle.y = height * 2
                            shape_triangle.x = width * 2
                        }, 90);
                        
                        
                    }
                }
            })
        }



        app.start();
    }


})



function game_end(){
    const container = document.getElementById('container');
    container.removeChild(app.view);

    alert("게임이 종료되었습니다.");

    // // console.log("총 수행 라운드 : ", total_round, ssResponseTimeList.length);
    // // console.log("총 정답 라운드 : ", ssNumOfSuccessRound);

    // // console.log("전체 라운드 반응시간 리스트 : ", ssResponseTimeList);
    // // console.log("연속 정답 리스트 : ", ssMaxCnsctvSuccessCountlist);
    // // console.log("연속 정답 개수 : ", ssMaxCnsctvSuccessCount);
    // // console.log("총 수행 시간 : ", ssPerformanceTime / 1000);
}
