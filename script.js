let txt="";
const txtCont=document.getElementById("text");
const input= document.getElementById("input");
const timerElem=document.getElementById("timer");
const resultElem=document.getElementById("result");
const timeButtons=document.querySelectorAll(".time-btn");

let time=60;
let totalTime=time;
let interval;
let start=false;

timeButtons.forEach(btn =>{
    btn.addEventListener("click", ()=>{

        timeButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        clearInterval(interval);
        start=false;
        time=parseInt(btn.dataset.time);
        totalTime=time;
        timerElem.innerText=`Time:${time}`;
        input.disabled=false;
        input.value="";
        resultElem.innerText="";
        fetchWords();
        input.focus();
    });
});

function resetTest(){
    clearInterval(interval);
    start = false;
    input.disabled=false;
    input.value="";
    resultElem.innerText="";
    fetchWords();
}

async function fetchWords(){
    try{
        const response= await fetch(
           "https://random-word-api.herokuapp.com/word?number=30"
           );
        const words= await response.json();
        txt=words.join(" ");
        loadTxt();
    }
    catch (error){
        txt="error loading.";
        loadTxt();

    }
}

function loadTxt(){
    txtCont.innerHTML="";
    for (let i=0; i<txt.length; i++){
        const span=document.createElement("span");
        span.innerText=txt[i];
        if (i==0){
            span.classList.add("active");
        }
        txtCont.appendChild(span);
    }
}

input.addEventListener("input", ()=>{
    if(input.disabled) return;
    if(!start){
        initTimer();
        start=true;
    }
     if(input.value.length>txt.length){
       input.value=input.value.slice(0,txt.length);
    }
    const spans= txtCont.querySelectorAll("span");
    const inputValue=input.value;
    spans.forEach((spn, ind)=>{
    spn.classList.remove("active", "wrong", "correct");
    if (ind<inputValue.length){
        if(inputValue[ind]===spn.innerText){
            spn.classList.add("correct");
        }
        else{
            spn.classList.add("wrong");
        }
    }
    if(ind===inputValue.length){
        spn.classList.add("active");
    }
   
    });
    
});

function initTimer(){
    interval=setInterval(()=>{
        time--;
        timerElem.innerText=`Time:${time}`;
        if (time===0){
            clearInterval(interval);
            input.disabled=true;
            calculateWpm();
        }
},1000);
}

function calculateWpm(){
    const wordsTyped=input.value.length/5;
    const wpm=Math.round((wordsTyped/totalTime)*60);
    resultElem.innerText=`WPM: ${wpm}`;
}
fetchWords();
input.focus();