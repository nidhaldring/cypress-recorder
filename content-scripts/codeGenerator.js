

function parseClick(event){
    return `cy.get(${event.selector}).click()`;
}

function parseKeyDown(event){
    switch(event.key){
        case 'Backspace':
            return `cy.get('${event.selector}').type('{backspace}');`;
        case 'Escape':
            return `cy.get('${event.selector}').type('{esc}');`;
        case 'ArrowUp':
            return `cy.get('${event.selector}').type('{uparrow}');`;
        case 'ArrowRight':
            return `cy.get('${event.selector}').type('{rightarrow}');`;
        case 'ArrowDown':
            return `cy.get('${event.selector}').type('{downarrow}');`;
        case 'ArrowLeft':
            return `cy.get('${event.selector}').type('{leftarrow}');`;
    }
    return null;
}

function parseDoubleClick(event){
    return `cy.get('${event.selector}').dblclick();`;
}

function parseChange(event){
    if(event.target.type === "checkbox" || event.target.type === "radio"){
        return null;
    }
    return `cy.get('${event.selector}').type('${event.target.value.replace(/'/g,"\\'")}')`;
}


function parseSubmit(event){
    return `cy.get('${event.selector}').submit();`;
}


/* takes an event and returns the cypress code necessary to generate it */
function parseEvent(event){
    switch(event.type){
        case "click":
            return parseClick(event);
        case "change":
            return parseChange(event);
        case "dbclick":
            return parseDoubleClick(event);
        case "keydown":
            return parseKeyDown(event);
        case "submit":
            return parseSubmit(event);
    }
    return null;
}
