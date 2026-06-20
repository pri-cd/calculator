const DEBUG = true;
function debug(...args) {
    if (DEBUG == true) {
        console.log(...args);
    }
}

const mappedNumKeys = {
    number0: "0",
    number1: "1",
    number2: "2",
    number3: "3",
    number4: "4",
    number5: "5",
    number6: "6",
    number7: "7",
    number8: "8",
    number9: "9",
    decimal: ".",
}

const mappedProcessingKeys = {
    clearCalcButton: "Add func here",
    percentage: "Add func here",
    backspace: "Add func here",
    equal: "Add Func here",
}

const mappedFuncKeys = {
    addition: "+",
    subtract: "-",
    multiply: "x",
    divide: "/",
}

/**
 * Bind event listeners to numerical buttons!
 * @param {PointerEvent} event
 */
function handleNumberKeys(event) {
    const target = event.target;

    if (target instanceof HTMLElement) {
        const className = target.className;
        const ID = target.id;
        
        if (className.includes("number") || ID === "decimal") {
            debug(mappedNumKeys[ID]);
        }
    }

}

/**
 * Bind eveent listeners to function buttons (addition, sub, etc..)
 * @param {PointerEvent} event 
 */
function handleFuncKeys(event) {
    const target = event.target;
    if (target instanceof HTMLElement) {
        if (target.tagName == "IMG") {
            const parentElement = target.parentElement;
            const className = parentElement.className;
            const ID = parentElement.id;
            
            if (Object.keys(mappedFuncKeys).includes(ID))
            {
                debug(mappedFuncKeys[ID]);
            }
        }   
    }
}


/**
 * Register/Wrapper function for binding event listeners to all buttons!
 * @param {HTMLElement} calculator
 */
function registerButtonsListeners(calculator) {

    debug("Initialising Numerical & Function Keys!");

    calculator.addEventListener('click', (event) => {
        handleNumberKeys(event);
        handleFuncKeys(event);
    });
}


function main() {
    const calculator = document.querySelector("#calculator");
    registerButtonsListeners(calculator);
}



main();