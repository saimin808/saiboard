// 전역변수 선언부 ************************
let maxlength;// 최대로 입력 가능한 문자 수
let text_val; // 입력한 문자
let text_len; // 입력한 문자 수

let each_char; // 글자 확인시 사용할 변수
//**************************************

// 게시글 글쓴이 작성 글자 제한
function writer_checkText(obj){
	maxlength = 10; //최대 10자
    text_val = obj.value; //입력한 문자
    text_len = text_val.length; //입력한 문자수
    
    let total=0;
    for(let i=0; i<text_len; i++){
    	each_char = text_val.charAt(i);
        
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
	maxlength = 50; //최대 10자
    text_val = obj.value; //입력한 문자
    text_len = text_val.length; //입력한 문자수
    
    let total=0;
    for(let i=0; i<text_len; i++){
    	each_char = text_val.charAt(i);
        
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
	maxlength = 1000; //최대 1000자
    text_val = obj.value; //입력한 문자
    text_len = text_val.length; //입력한 문자수
    
    let total=0;
    for(let i=0; i<text_len; i++){
    	each_char = text_val.charAt(i);
        
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