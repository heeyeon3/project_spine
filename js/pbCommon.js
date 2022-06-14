﻿jQuery(function($){

	// select 디자인
	/*if($('select').length){
		$('select').selectric();
	}*/
	
	// 스크롤바 디자인
	if($('.scrollbar-dynamic').length){
		$('.scrollbar-dynamic').scrollbar();
	}
	
	//왼쪽 메뉴 열기	
	$(document).on('click', '.btn_menu', function() {		
		if($(this).hasClass('open') == true){
			$(this).removeClass('open');
			$('#header').removeClass('open');
			//$('#header').animate({'width':'73px' }, 300).removeClass('open');
			//$('.btn_menu').animate({'left':'69px' }, 300);
		}else{
			$(this).addClass('open');
			$('#header').addClass('open');
			//$('#header').animate({'width':'190px' }, 300).addClass('open');
			//$('.btn_menu').animate({'left':'186px' }, 300);
		}		
	});		
	
	//업데이트 파일 등록
	$('#inputFile').on('change', function(e){
        e.preventDefault();
		var selFileVal = $(this).val().split('/').pop().split('\\').pop();
		$('#selFile').val(selFileVal);        
    });	
	
	//컨텐츠 타입 sort
	$(document).on('click', '.type_sorting li button', function() {		
		$('.type_sorting li').removeClass('active');
		$(this).parent().addClass('active');	
	});		
	
	// 레이어 팝업창 X 버튼으로 닫기
	$(document).on('click', '.btn_close_pop', function() {		
		var hidePopupID = $(this).data('hideId');
		$('#'+hidePopupID+'').hide();
		$('body').removeClass('overflow_none');
	});	

	// input focus add
	$('input[type=text], select').focus(function () {
		$(this).addClass('focus');
	});

	// input focus remove
	$('input[type=text], select').blur(function () {
		$(this).removeClass('focus');
	});
	
});
//jquery end

//윈도우 팝업 뛰우기
function openPopup(url, name, width, height){
	var options = 'top=100, left=100, width='+ width +', height='+ height +', status=no, menubar=no, toolbar=no, resizable=no, scrollbars=no';
	window.open(url, name, options);
}

//레이어 팝업 띄우기
function openLayerPopup(targetID){
	$('#'+targetID+'').show();
	$('body').addClass('overflow_none');
}

//레이어 팝업의 취소 버튼 클릭하여 팝업창 닫기	
function closeLayerPopup(targetID){
	$('#'+targetID+'').hide();
	$('body').removeClass('overflow_none');
}	
