// url parameter를 불러온 변수
const urlParams = new URLSearchParams(location.search);

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

// 비밀번호 정규식 : 4 ~ 16자 영문, 숫자, 특수문자를 최소 한가지씩 조합
let pwRegExp = /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{3,16}$/;

// 글쓴이 정규식 : 2 ~ 10자 한글, 영문 허용
let writerRegExp = /^[a-zA-Zㄱ-힣][a-zA-Zㄱ-힣 ]{1,10}$/;

$('#boardSubmit-button').click(function() {
	console.log('writer : ' + writerRegExp.test($('#boardWriter-text').val()));
	console.log('pass : ' + pwRegExp.test($('#boardPassword-text').val()));
	
	if($('#boardWriter-text').val() < 2 || writerRegExp.test($('#boardWriter-text').val()) == false) {
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
	
	if($('#boardPassword-text').val() < 2 || pwRegExp.test($('#boardPassword-text').val()) == false) {
		$('#boardPassword-text').popover('show');
		$('#boardPassword-text').focus();
		return;
	} else {
		$('#boardPassword-text').popover('dispose');
	}
	
		// 작성한 게시글 항목들 모아주고
		const board = {
			board_category : $('#boardCategory-select').val(),
			board_writer : $('#boardWriter-text').val(),
			board_title : $('#boardTitle-text').val(),
			board_content : $('#boardContent-text').val(),
			board_pw : $('#boardPassword-text').val(),
		}
		
		// upload할 파일들 모으고
		let upload_files = new Array;
		
		if($('#boardUpload-file1').val() != null) {
			upload_files.push($('#boardUpload-file1').val());
		}
		if($('#boardUpload-file2').val() != null) {
			upload_files.push($('#boardUpload-file2').val());
		}
		if($('#boardUpload-file3').val() != null) {
			upload_files.push($('#boardUpload-file3').val());
		}
		
		// 업로드한 파일과 게시글 항목들의 형태가 다르니
		// 다른 형태를 한꺼번에 모아서 보낼 수 있는 formData 형식으로 다른 형식의 데이터를 모아준다.
		let formData = new FormData();
		
		// 'key'라는 이름으로 위에서 담은 board를 formData에 append한다. type은 json  
		formData.append('board', new Blob([ JSON.stringify(board) ], {type : "application/json"}));
		
		if(purpose == 'write') {
		
		// input name 값 
		let fileInput = $('input[name=upload_files]');
		console.log(fileInput);
		// fileInput 개수를 구한다.
		for (let i = 0; i < fileInput.length; i++) {
			if (fileInput[i].files.length > 0) {
				for (let j = 0; j < fileInput[i].files.length; j++) {
					console.log(" fileInput[i].files[j] :::"+ fileInput[i].files[j]);
					
					// formData에 'upload_files'이라는 키값으로 fileInput 값을 append 시킨다.  
					formData.append('upload_files', $('input[name=upload_files]')[i].files[j]);
				}
			}
		}
		
		console.log(formData.get('board'));
		//console.log(form);
		$.ajax({
			type: 'POST',
		    url: contextPath + '/board/write/write_board',
		    contentType: false,
		    processData: false,
		    enctype : 'multipart/form-data',
		    data : formData
		})
			.fail( function(e) {
		    	console.log(e);
		    	alert("통신 오류 error");
		    })
		    .done(function(data) {
		    	
		    	console.log('통신 성공!');
		    	
		    	if(data == 'true') {
		    		location.href = contextPath + '/board?status=board_write_success';
		    	} else {
		    		location.href = contextPath + '/board?status=board_write_fail';
		    	}
		    });
	} else if (purpose == 'edit') {
		
		$.ajax({
			type: 'POST',
		    url: contextPath + '/board/edit_board/' + board_seq,
		    contentType: false,
		    processData: false,
		    enctype : 'multipart/form-data',
		    data : formData
		})
			.fail( function(e) {
		    	console.log(e);
		    	alert("통신 오류 error");
		    })
		    .done(function(data) {
		    	
		    	console.log('통신 성공!');
		    	
		    	if(data == 'true') {
		    		location.href = contextPath + '/board?status=board_edit_success';
		    	} else {
		    		location.href = contextPath + '/board?status=board_write_failed';
		    	}
		    });
	}
});

//