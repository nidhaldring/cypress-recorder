"use strict";

function handleEventRecorderConnection(conn){
    conn.onMessage.addListener((msg) => {
        if(session.status !== "paused"){
            session.parseMsg(msg);
        }
    });
}

function handlePopupConnection(conn){
    conn.onMessage.addListener(async(req) => {
        switch(req.msg){
            case "infos":
                conn.postMessage({status: session.status,token: session.token});
                break;
            case "start":
                session.token = req.token;
                break;
            case "withdraw":
                session.clear();
                break;
            case "send":
                session.status = "on";
                let ok = false;
                try{
                    ok = (await session.sendData()).ok;
                }catch(err){}
                session.clear();
                conn.postMessage({ok});
                break;
            case "updateStatus":
                session.status = req.status;
                break;
        }
    });
}

/* handle connections */
const session = new Session();
chrome.runtime.onConnect.addListener((conn) => {
    if(conn.name === "popup"){
        handlePopupConnection(conn);
    }else{
        handleEventRecorderConnection(conn);
    }
});

chrome.runtime.onMessage.addListener((req,sender,sendReponse) => {
    if(req.msg === "infos"){
        sendReponse({status: session.status,token: session.token});
        return true;
    }
});

chrome.tabs.onHighlighted.addListener(() => {
    if(session.status === "running"){
        session.status = "paused";
    }
});
