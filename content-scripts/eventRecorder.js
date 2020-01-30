"use strict";

const eventRecorder = {

    events: ["click","change","dbclick","keydown","submit"],
    conn: null, // used to connect to background script

    // send event  to background after parsing it
    _sendEvent(event){
        if(event.isTrusted){
            event.selector = finder(event.target); // find selector for the element
            const parsedEvent = parseEvent(event);
            if(parsedEvent !== null){
                eventRecorder.conn.postMessage(parsedEvent);
            }
        }
    },

    _removeDomListeners(){
        eventRecorder.events.forEach((event) => document.removeEventListener(event,eventRecorder._sendEvent));
    },

    _addDomListeners(){
        eventRecorder.events.forEach((event) => document.addEventListener(event,eventRecorder._sendEvent));
    },

    start(token){
        eventRecorder.conn = chrome.runtime.connect({name: token});
        eventRecorder._addDomListeners();
    },

    end(){
        eventRecorder._removeDomListeners();
        eventRecorder.conn.disconnect();
    },

    pause(){
        eventRecorder._removeDomListeners();
    },

    resume(){
        if(eventRecorder.conn == null){
            eventRecorder.start();
        }else{
            eventRecorder._addDomListeners();
        }
    },

    listen(){
        // listen for msgs coming from popup
        chrome.runtime.onMessage.addListener((req) => {
            console.log(req.msg);
            eventRecorder[req.msg](req.token);
            console.log(eventRecorder[req.msg])
        });
    }
};


eventRecorder.listen();
