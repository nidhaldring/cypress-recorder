

const eventRecorder = {

    events: ["click","change","dbclick","keydown","submit"],

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

    start(token){
        eventRecorder.conn = chrome.runtime.connect({name: token});
        eventRecorder.events.forEach((event) => document.addEventListener(event,eventRecorder._sendEvent))
    },

    end(){
        eventRecorder.removeEventListener();
        eventRecorder.conn.disconnect();
    },

    pause(){
        eventRecorder.removeEventListener();
    },

    resume(){
        eventRecorder.start();
    },

    listen(){
        eventRecoder.conn.onMessage.addListener((req) => {
            eventRecorder[req.msg](req.token);
        });
    }
}


eventRecorder.start();
