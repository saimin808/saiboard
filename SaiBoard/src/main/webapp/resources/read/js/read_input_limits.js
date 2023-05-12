// 전역변수 선언부 ************************
let maxlength;// 최대로 입력 가능한 문자 수
let text_val; // 입력한 문자
let text_len; // 입력한 문자 수

let each_char; // 글자 확인시 사용할 변수
//**************************************

// 댓글 작성 글자 제한 byte
function content_checkText(obj){
	maxlength = 40; //최대 40자
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
    	alert('최대 40자까지만 입력가능합니다.');
       	document.getElementById("nowLetter").innerText = total;
        document.getElementById("nowLetter").style.color = "red";
        $(obj).val($(obj).val().substr(0, $(obj).attr('maxlength')));
    } else {
       	document.getElementById("nowLetter").innerText = total;
        document.getElementById("nowLetter").style.color = "green";
    }
}

// 댓글 수정(edit) 글자 제한 byte
function edit_content_checkText(obj) {
	maxlength = 40; //최대 40자
    text_val = obj.value; //입력한 문자
    text_len = text_val.length; //입력한 문자수
    
    let total=0;
    for(let i=0; i < text_len; i++){
    	each_char = text_val.charAt(i);
        
        // 글자 수만큼 증가 (+1)
        total += each_char.length;
    }
    
    // 글자가 넘어가면 알림 후 maxlength 글자까지만 substr
    if(total > maxlength){
    	alert('최대 40자까지만 입력가능합니다.');
        document.getElementById("edit_nowLetter").innerText = total;
        document.getElementById("edit_nowLetter").style.color = "red";
        $(obj).val($(obj).val().substr(0, $(obj).attr('maxlength')));
    }else{
       	document.getElementById("edit_nowLetter").innerText = total;
        document.getElementById("edit_nowLetter").style.color = "green";
    }
}