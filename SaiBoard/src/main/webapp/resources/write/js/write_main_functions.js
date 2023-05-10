// 글 쓰기 function
function writeBoard() {
		
		// 1. getherData 펑션을 통해 입력한 데이터들을 formData 형식으로 압축하여 불러와준다.
		let formData = getherData();
		
		// 2. 압축한 form데이터를 BoardRESTController에 있는 writeBoard()에 매개 변수로 보내준다.
		$.ajax({
			type: 'POST',
		    url: contextPath + '/board/write/write_board',
		    contentType: false,
		    // *processData - 기본값은 true, 서버에 전달되는 데이터를 QueryString 형태로 전달할 것인지 결정하는 설정
		    // 파일 전송할 때는 Query String으로 전달하면 안된다. 그래서 false.
		    // *Query String - 사용자가 입력 데이터를 전달하는 방법중의 하나로,
		    //                 url 주소에 미리 협의된 데이터를 파라미터를 통해 넘기는 것을 말한다.
		    // 예) http://localhost:8888/saiboard/board?board_seq=211&page=5
		    //		여기서 '?' 이후의 값이 QueryString이다.
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
		    	
		    	// 3. 통신이 성공하면 결과에 따라 status 파라미터 값을 달리 세팅해주고 다시 메인 게시판으로 돌아간다. 
		    	if(data == 'write_success') {
		    		location.href = contextPath + '/board?status=board_write_success';
		    	} else {
		    		location.href = contextPath + '/board?status=board_write_fail';
		    	}
		    });
}

// 글 수정 Function
function editBoard() {
	
	// 1. getherData 펑션을 통해 입력한 데이터들을 formData 형식으로 압축하여 불러와준다.
	let formData = getherData();

	// 2. 압축한 form데이터를 BoardRESTController에 있는 editBoard()에 매개 변수로 보내준다.
    $.ajax({
            type: 'POST',
            url: contextPath + '/board/edit_board/' + board_seq,
            contentType: false,
            processData: false,
            enctype: 'multipart/form-data',
            data: formData
        })
        .fail(function(e) {
            console.log(e);
            alert("통신 오류 error");
        })
        .done(function(data) {

            console.log('통신 성공!');

			// 3. 통신이 성공하면 결과에 따라 status 파라미터 값을 달리 세팅해주고 다시 메인 게시판으로 돌아간다. 
            if (data == 'true') {
                location.href = contextPath + '/board?status=board_edit_success';
            } else {
                location.href = contextPath + '/board?status=board_write_failed';
            }
        });
}

// 글 수정과 삭제 전 데이터를 모아주는 function
function getherData() {
		// 1-1. 작성한 게시글 항목들을 JSON타입으로 모아주고
		const board = {
			board_category : $('#boardCategory-select').val(),
			board_writer : $('#boardWriter-text').val(),
			board_title : $('#boardTitle-text').val(),
			board_content : $('#boardContent-text').val(),
			board_pw : $('#boardPassword-text').val()
		}
		
		// 1-2. 업로드한 파일들도 한 변수에 모아준다.
		let fileInput = $('input[name=upload_files]');
		
		// 2. 업로드한 파일들(JQueryObj을 담은 배열)과 게시글 데이터(JSON)의 형태가 다르니
		// 다른 형태를 한꺼번에 모아서 보낼 수 있는 formData 형식으로 다른 형식의 데이터를 모아준다.
		let formData = new FormData();
		// formData - 일반적인 form 태그와 비슷하게 데이터를 전송하는 객체
		//            주로 script 단에서 비동기 방식으로 폼 데이터를 전달할 때 사용한다.
	
		// ****************** 여러 개의 input type file을 JQuery로 불러온 데이터에 대한 고찰 *******************
		// Array.isArray(fileInput)로 검사하면 false
		// typeof fileInput은 = object 인데
		// console.log(fileInput) 결과는
		// S.fn.init(3) [input#boardUpload-file1.form-control,
		//				 input#boardUpload-file2.form-control,
		//				 input#boardUpload-file3.form-control, prevObject: S.fn.init(1)]
		// 여기서 앞에 S.fn.init(3)은 리턴된 JQuery 객체를 의미하고 3은 갯수이다.
		// 뒤에 나온 prevObject는 굳이 알 필요 없단다
		// Array.isArray(fileInput)가 false로 나온건 그저 배열과 유사한 JQuery 객체라서 결과가 false인 것이다.
		// 데이터 활용 방법은 Array와 같다.
		// *********************************************************************************************
		
		// 2-1. 'board'라는 이름으로 위에서 담은 board를 formData에 append한다. type은 json
		// Blob - Blob(Binary Large Object)란 바이너리 형태중에서도 큰 객체를 뜻하는데,
		//		  주로 이미지, 비디오, 사운드 같은 멀티미디어 객체를 나타낸다.
		// (물론 꼭 미디어 관련해서만 사용하는 것이 아니라 html, plain text 등 바이너리로 표현 가능한 많은 데이터에서 쓸 수 있다.)
		// binary 형태인 파일 데이터와 JSON 형태의 데이터를 같이 보내주려면 둘 중에 하나를 변환해야 하는데
		// 우선 JSON형태의 데이터를 Blob을 사용해서 binary data로 변환하여 formData에 넣어준다.
		formData.append('board', new Blob([ JSON.stringify(board) ], {type : "application/json"}));
		
			// files 속성 : input type이 file 객체를 변수에 담아주면 변수에는 FileList 형태가 담기게 된다.
			//			   변수.files는 변수에 담은 FileList를 불러와주는 것이다.
			console.log(fileInput[0].files);
		 
		for (let i = 0; i < fileInput.length; i++) {
		
			// 2-2. fileInput에 담긴 각 fileList에 파일이 있다면
			// (multiple upload가 아니라서 각 fileList에는 한개의 파일만 담겨있다.)
			 
			if (fileInput[i].files.length > 0) {
				for (let j = 0; j < fileInput[i].files.length; j++) {
					console.log(" fileInput[i].files[j] :::"+ fileInput[i].files[j]);
					
					// 2-2. formData에 'upload_files'라는 키값으로 fileInput 값을 append 시킨다.			
					formData.append('upload_files', fileInput[i].files[j]);
				}
			}
		}
		
		// 3. 모아준 데이터를 리턴한다.
		return formData;
}