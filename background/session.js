"use strict";

class Session{

    static URL = "http://localhost:5050/";

    constructor(){
        this.status = "off";
        this.data = [];
        this.token = null;
    }

    async parseMsg(msg){
        if(msg === "send"){
            this.status = "halting";
            return await this.sendData();
        }else if(msg === "withdraw"){
            this.clear();
            this.status = "halting";
        }else{
            this.data.push(msg);
        }
    }

    clear(){
        this.data = [];
    }

    sendData(){
        const body = JSON.stringify({token: this.token,data: this.data.join("\n")});
        this.clear();
        return fetch(Session.URL,{
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body
        });
    }
}
