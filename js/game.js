'use strict';

// import typing from 'typing';
let shift_flag = false;
let char_innow;//入力処理中のアルファベット
let str_hand = "";//手本のひらがな
let str_input = "";//入力し終えたひらがな
let char_Janow;//入力処理中のひらがな
let str_inwait = "";//入力完了待ちアルファベット
let int_point = 0;//ひらがなの位置
let int_pointnow = 0;//入力処理中のアルファベット位置
let int_JaIndex = 0;//入力処理中文字の判定データインデックス
let correct  = 0;
let mistake = 0;
let isPlaying = false;

{
  
  let kanji= document.getElementById('kanji');
  let kana = document.getElementById('kana');
  
  let currentIndex = 0;
  const startTime = 1;
  const typing_time_limit = 5;
  const ready_time_limit = 1;
  const remain_time_limit = 2;
  const trialConut = 6;
  
  const target = document.getElementById('target');
  const rest = document.getElementById('rest');

  let record = [];
  let results = [];
  
  for(let i = 0;i<trialConut;i++) {
    let trial_i = new Array(4); 
    record.push(trial_i);
  }

  document.addEventListener('keydown',() => {
    if(isPlaying === true) {
      return;
    }
    isPlaying = true ;
    target.textContent = "5秒後に開始します。キーボードに手を置いてなるべく動かないようにして下さい"
    setTimeout(function(){
      ready();
    },startTime * 1000);
  });
  
  function ready(){
    let readyCount = ready_time_limit;
    let timeoutId = setInterval(function(){
      target.textContent=readyCount;
      readyCount--;
      if(readyCount === -1) {
        clearInterval(timeoutId);
        gamestart();
      }
    },1000);
  };
  
  
  function gamestart(){
    document.querySelector('form').classList.remove('hidden');
    int_point = 0;//ひらがなの位置
    str_input = "";
    obj_input.value = "";
    setTimeout(function(){
      obj_input.focus();
    },0.000000001);
    obj_set()
    target.style.visibility = "hidden";
    typing.style.visibility = "visible";
    rest.style.visibility = "hidden";
    mistake = 0;
    correct = 0;
    currentIndex++;
    
    setTimeout(function(){
      remain();
      },typing_time_limit * 1000);
  };

  function resultPush() {
    let inputcharacters = correct + mistake;
    let WordPerMinutes = 3*inputcharacters;
    let CorrectRate = (correct / inputcharacters) * 100;
    let score = WordPerMinutes * (CorrectRate / 100) **3;
    record[currentIndex - 1][0] = WordPerMinutes;
    record[currentIndex - 1][1] = correct;
    record[currentIndex - 1][2] = mistake;
    record[currentIndex - 1][3] = CorrectRate;
    record[currentIndex - 1][4] = score;
  }
  
  function remain(){
    target.style.visibility = "visible";
    target.textContent = '+';
    rest.style.visibility = "visible";
    typing.style.visibility = "hidden";
    rest.textContent=remain_time_limit;
    let remainingTime = remain_time_limit - 1;
    
    let clock = setInterval(function(){
      rest.textContent=remainingTime;
      // console.log(remainingTime);
      remainingTime--;
      if(remainingTime <= -1) {
        clearInterval(clock);
        if( currentIndex < trialConut ){
          gamestart();
        } else if ( currentIndex = trialConut ) {
          console.log("happy");
          target.style.visibily = "visible";
          target.textContent = '終わりです！お疲れ様でした！';
          rest.style.visibility = "hidden";
          for(let i = 0;i<trialConut;i++){
            results.push(record[i][4]);
            console.log(record);
          }
          let result = (results.reduce(function(sum, element){
            return sum + element;
          }, 0)) / trialConut;
          console.log(result);
        }};
      },1000);
    resultPush();
  };


  let obj_input = document.getElementById('input');
	
  function obj_set() {
		set_reibun();
		char_Janow = str_hand.charAt(0);//一文字目のひらがな
    obj_input.onkeydown = input_insert;
		obj_input.onkeyup = shift_up;
		hand_to_alfa();;
	}
  
  function set_reibun () {
    let int_reirand = Math.floor( Math.random() * reibun.length);
    let problems = reibun.splice(int_reirand,1)[0];
    let kanamoji = problems[0];
    let kanjimoji = problems[1];

    kana.textContent = str_hand = kanamoji;
    kanji.textContent = kanjimoji;
  }
  
  function hand_to_alfa() {
    let char_now;
    let str_hanalf = "";
    for (let i = 0; i < str_hand.length; i++) {
    char_now = str_hand.charAt(i);
    if ( char_now == "っ")
    str_hanalf += Jadata[str_hand.charAt(i+1)][0].charAt(0);//str_hand=ひらがな文
    else if ( char_now == "ん") {
      if ( i + 1 != str_hand.length ) {
        if ( "aiueon".indexOf( Jadata[str_hand.charAt(i+1)][0].charAt(0) ) == -1 && Jadata[str_hand.charAt(i+1)][0].length != 1)
        str_hanalf += "n";
        else
        str_hanalf += "nn";
      }
      else 
      str_hanalf += "nn";
    }
    else if ( "ゃゅょ".indexOf(char_now) != -1 ) {
      try {
        let yayuyo = Jadata[str_hand.charAt(i-1) + char_now][0];
        str_hanalf = str_hanalf.slice( 0, -(Jadata[str_hand.charAt(i-1)][0].length) );
        str_hanalf += yayuyo;
      }
      catch(e) {
        str_hanalf += Jadata[char_now][0];
      }
    }
    else
    str_hanalf += Jadata[char_now][0];
  }
//		alert(str_hanalf);
}

function input_insert(key) {

    char_innow = keycode_check(key.keyCode);//キー入力イベント
    
    if ( char_innow == "" )
    return;
    
    if ( char_Janow == "っ" && int_point != str_hand.length - 1 ) {//"っ"であり、最後でない
      let char_nex = str_hand.charAt(int_point + 1);//"っ"の次の文字
      if ( "aiueo".indexOf( char_innow ) == -1 ) {//次が子音無し文字でない
        if ( int_pointnow == 0 ) {//アルファ一つ目
          if ( TorF(char_nex, int_point + 1, 0) ) {
            if(char_Janow != "っ")char_Janow = "っ";
            int_pointnow = 1;//アルファ二つ目へ
          str_inwait = char_innow;
          char_innow = "";
          obj_input.value = str_input + str_inwait;
          return;
        }
        }
        else if ( int_pointnow == 1 ) {
					int_JaIndex = 0;
					if ( str_inwait == char_innow && TorF(char_nex, int_point + 1, 0) ) {
						int_point++;//次の文字のアルファ2つ目へ進む
						str_input += "っ";//"っ"と子音一文字入力済み
						char_innow = "";
						if (char_Janow == "っ")char_Janow = char_nex;
						obj_input.value = str_input + str_inwait;
						return;
					}
				}
			}
		}
  
  if ( char_Janow == "ん" && int_pointnow == 1 ) {
    if ( int_point != str_hand.length - 1 ) {
      let char_nex = str_hand.charAt(int_point + 1);
      if ( ",.-!".indexOf(char_innow) != -1 ) {
        if (char_innow == Jadata[str_hand.charAt(int_point+1)][0]) {
          str_input += "ん";
          int_point++;
          str_inwait = "";
          int_pointnow = 0;
          char_Janow = str_hand.charAt(int_point);
        }
      }
      //				else if ( "aiueon".indexOf(char_innow) == -1 && Jadata[str_hand.charAt(int_point + 1)][0].length != 1) {
        else if ( char_innow != "n" && Jadata[str_hand.charAt(int_point + 1)][0].length != 1) {
          
          
          if ( TorF(char_nex, int_point + 1, 0) ) {
          int_point++;
          str_input += "ん";
          str_inwait = char_innow;
          char_innow = "";
          if (char_Janow == "ん")char_Janow = char_nex;
          obj_input.value = str_input + str_inwait;
          return;
        }
      }
    }
  }

  if ( TorF(char_Janow, int_point, int_pointnow) ) {
    str_inwait += char_innow;
    char_innow = "";
    
    if (str_inwait.length == Jadata[char_Janow][int_JaIndex].length) {
      str_input += char_Janow;//ひらがなを追加
      
      if (str_input.length == str_hand.length) {
        int_point = 0;
        str_input = "";
        set_reibun();
      }
      else {
        int_point += char_Janow.length;
      }
      
      str_inwait = "";
      int_pointnow = 0;
      int_JaIndex = 0;
      char_Janow = str_hand.charAt(int_point);
    }
    else {
      int_pointnow++;
    }
  }
  
  obj_input.value = str_input + str_inwait + char_innow;
}
}


function shift_up(e) {//シフトキーの解除
  if (e.keyCode == 16)
  shift_flag = false;
}

function keycode_check (code) {
  
  if (48 <= code && code <= 57 && !shift_flag)//数字
  return String.fromCharCode(code);
  if (65 <= code && code <= 90 && !shift_flag)//アルファベータ小文字
  return String.fromCharCode(code+32);
  if (65 <= code && code <= 90)//アルファベータ大文字
  return String.fromCharCode(code);
  if (96 <= code && code <= 105)//IEやFxのテンキー
    return code - 96;
  if ( (code == 189 || code == 109 || code == 173) && !shift_flag)
    return "-";
  if (code == 32)
    return " ";
  if (code == 49 && shift_flag)
    return "!";
  if (code == 191 && shift_flag)//MacのFF4で動作しない？
    return "?";
  if (code == 188 && !shift_flag)
    return ",";
  if (code == 190 && !shift_flag)
    return ".";

  /************* 特殊キー ******************/

if ( code == 16 )//Shiftキー、ダウン
    shift_flag = true;

  return "";
}

function TorF(char_Ja, int_point, int_pointnow) {//正しい入力がなされたか
  if ( char_innow == Jadata[char_Ja][int_JaIndex].charAt(int_pointnow) ) {
    correct++;
    return true;
  } else {
    mistake++;
  }
  for (let i = 0; i < Jadata[char_Ja].length; i++ ) {
    if ( char_innow == Jadata[char_Ja][i].charAt(int_pointnow) ) {
      if ( int_pointnow == 0 || str_inwait == Jadata[char_Ja][i].substring(0, int_pointnow) ) {
        int_JaIndex = i;
        return true;
      }
    }
  }
  if ( str_hand.length - 1 != int_point ) {
    let char_nex = str_hand.charAt(int_point + 1);
    if ( "ゃゅょぁぃぅぇぉ".indexOf(char_nex) != -1 ) {
      try {
        Jadata[char_Ja + char_nex][0];//存在しなければここで終了
        int_JaIndex = 0;
        if ( TorF(char_Ja + char_nex, int_point, int_pointnow) ) {

          char_Janow = char_Ja + char_nex;
          return true;
        }
      }
      catch(e) {}
    }
  }
  return false;
}




