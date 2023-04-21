// 게시글 글쓴이 작성 글자 제한
function writer_checkText(obj){
	const maxlength = 10; //최대 10자
    const text_val = obj.value; //입력한 문자
    const text_len = text_val.length; //입력한 문자수
    
    let total=0;
    for(let i=0; i<text_len; i++){
    	const each_char = text_val.charAt(i);
        
        // 글자 수만큼 증가 (+1)
        total += each_char.length;
    }
    
    // 글자가 넘어가면 알림 후 maxlength 글자까지만 substr
    if(total > maxlength){
    	alert('최대 10자까지만 입력가능합니다.');
    	$(obj).val($(obj).val().substr(0, maxlength));
    }
}

// 게시글 제목 작성 글자 제한
function title_checkText(obj){
	const maxlength = 50; //최대 10자
    const text_val = obj.value; //입력한 문자
    const text_len = text_val.length; //입력한 문자수
    
    let total=0;
    for(let i=0; i<text_len; i++){
    	const each_char = text_val.charAt(i);
        
        // 글자 수만큼 증가 (+1)
        total += each_char.length;
    }
    
    // 글자가 넘어가면 알림 후 maxlength 글자까지만 substr
    if(total > maxlength){  
    	alert('최대 50자까지만 입력가능합니다.');
    	$(obj).val($(obj).val().substr(0, maxlength));
    }
}

// 게시글 내용 작성 글자 제한 byte
function content_checkText(obj){
	const maxlength = 1000; //최대 1000자
    const text_val = obj.value; //입력한 문자
    const text_len = text_val.length; //입력한 문자수
    
    let total=0;
    for(let i=0; i<text_len; i++){
    	const each_char = text_val.charAt(i);
        
        // 글자 수만큼 증가 (+1)
        total += each_char.length;
    }
    
    // 글자가 넘어가면 알림 후 maxlength 글자까지만 substr
    if(total > maxlength) {
    	alert('최대 1000자까지만 입력가능합니다.');
    	$(obj).val($(obj).val().substr(0, maxlength));
        document.getElementById("nowLetter").innerText = total;
        document.getElementById("nowLetter").style.color = "red";
    } else {
        document.getElementById("nowLetter").innerText = total;
        document.getElementById("nowLetter").style.color = "green";
    }
}

// 파일 업로드 Cancel 버튼 action
$('#uploadCancel-button1').click(function() {
	$('#boardUpload-file1').val('');
});
$('#uploadCancel-button2').click(function() {
	$('#boardUpload-file2').val('');
});
$('#uploadCancel-button3').click(function() {
	$('#boardUpload-file3').val('');
});

// 취소버튼 action
$('#boardCancel-button').click(function() {
	location.href = contextPath + '/board';
});

// 작성 버튼 action
// 모든 text들이 입력조건을 만족하지 못하면 버튼 클릭시 각 텍스트의 popover 활성화
// 만족하면 form submit 
$('#boardSubmit-button').click(function() {
	if($('#boardWriter-text').val() < 2) {
		$('#boardWriter-text').popover('show');
		$('#boardWriter-text').focus();
		return;
	} else {
		$('#boardWriter-text').popover('dispose');
	}
	
	if($('#boardTitle-text').val() < 2) {
		$('#boardTitle-text').popover('show');
		$('#boardTitle-text').focus();
		return;
	} else {
		$('#boardTitle-text').popover('dispose');
	}
	
	
	if($('#boardContent-text').val() < 2) {
		$('#boardContent-text').popover('show');
		$('#boardContent-text').focus();
		return;
	} else {
		$('#boardContent-text').popover('dispose');
	}
	
	if($('#boardPassword-text').val() < 2) {
		$('#boardPassword-text').popover('show');
		$('#boardPassword-text').focus();
		return;
	} else {
		$('#boardPassword-text').popover('dispose');
	}
	
	$('#board-form').submit();
});