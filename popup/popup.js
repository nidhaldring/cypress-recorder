
"use strict";

const token = document.getElementById("token");
const hint = document.getElementById("hint");
const startBtn = document.getElementById("start");
const pauseBtn = document.getElementById("pause");
const resumeBtn = document.getElementById("resume");
const sendBtn = document.getElementById("send");
const withdrawBtn = document.getElementById("withdraw");
const endBtn = document.getElementById("end");
const gotoBtn = document.getElementById("goto");

/* utils */

function sendMessageToBackground(msg){
    conn.postMessage(msg);
}

function sendMessageToEventRecorder(msg){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, msg);
    });
}


// change background recording statsu, e.g pause background recodring
function setRecordingStatus(status){
    conn.postMessage({msg: "updateStatus",status});
}

// get background recording status,e.g : paused,halting ...
async function getRecordingInfos(){
    return new Promise((resolve,reject) => {
        chrome.runtime.sendMessage({msg:"infos"},(response) => {
            resolve(response);
        });
    });
}

function setButtonsDisplay(startBtnDisplay,endBtnDisplay,resumeBtnDisplay,
    pauseBtnDisplay,sendBtnDisplay,withdrawBtnDisplay
){
    startBtn.style.display = startBtnDisplay;
    endBtn.style.display = endBtnDisplay;
    resumeBtn.style.display = resumeBtnDisplay;
    pauseBtn.style.display = pauseBtnDisplay;
    sendBtn.style.display = sendBtnDisplay;
    withdrawBtn.style.display = withdrawBtnDisplay;
}

/* end utils */

// set buttons event

token.oninput = () => {
    if(token.value.length >= 20){
        startBtn.style.display = "block";
    }else{
        startBtn.style.display = "none";
    }
}

startBtn.onclick = () => {
    setRecordingStatus("running");
    sendMessageToEventRecorder({msg: "start"});
    sendMessageToBackground({msg: "start",token: token.value}); // set session token
    setButtonsDisplay("none","block","none","block","none","none");
    token.disabled = true;
    hint.style.display = "none";
}

pauseBtn.onclick = () => {
    setRecordingStatus("paused");
    sendMessageToEventRecorder({msg: "pause"});
    setButtonsDisplay("none","none","block","none","none","none");
}

endBtn.onclick = () => {
    setRecordingStatus("halting");
    sendMessageToEventRecorder({msg: "end"});
    setButtonsDisplay("none","none","none","none","block","block");
    token.disabled = false;
}


resumeBtn.onclick = () => {
    setRecordingStatus("running");
    sendMessageToEventRecorder({msg: "resume"});
    setButtonsDisplay("none","block","none","block","none","none");
}

sendBtn.onclick = () => {
    // send msg to background
    sendMessageToBackground({msg: "send"});
    setButtonsDisplay("block","none","none","none","none","none");
    token.disabled = false;
}

withdrawBtn.onclick = () => {
    sendMessageToBackground({msg: "withdraw"}); // send msg to background
    setButtonsDisplay("block","none","none","none","none","none");
    token.disabled = false;
}


async function initUI(){
    const infos = await getRecordingInfos();
    switch(infos.status){
        case "running":
            setButtonsDisplay("none","block","none","block","none","none");
            token.disabled = true;
            hint.style.display = "none";
            token.value = infos.token;
            break;
        case "halting":
            setButtonsDisplay("none","none","none","none","block","block");
            token.disabled = false;
            hint.style.display = "none";
            token.value = infos.token;
            break;
        case "paused":
            setButtonsDisplay("none","none","block","none","none","none");
            token.disabled = true;
            hint.style.display = "none";
            token.value = infos.token;
            break;
        case "on":
            setButtonsDisplay("block","none","none","none","none","none");
            token.disabled = false;
            hint.style.display = "block";
            break;
        default:
            setButtonsDisplay("none","none","none","none","none","none");
            token.disabled = false;
            hint.style.display = "block";
    }
}

let conn = null;
function init(){
    conn = chrome.runtime.connect({name: "popup"});
    conn.onMessage.addListener((res) => {
        if(res.ok){
            alert("sucessfull !!");
        }else{
            alert("an error occured ! ");
        }
    });
    initUI();
}


init();
