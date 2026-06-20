const DEBUG = true;
const MAX_OPERAND_LEN = 2;

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

const mappedFuncKeys = {
    addition: "+",
    subtract: "-",
    multiply: "x",
    divide: "/",
}

const defaultOperationState = {
    operands: [],
    operator: "",
    lockState: false,
}

let operationState = structuredClone(defaultOperationState);

function resetOperationObject() {
    operationState = structuredClone(defaultOperationState);
    return;
}

/**
 * 
 * @param {operationState} operationObject 
 */
function operate(operationObject) {

    const operand1 = Number.parseFloat(operationObject.operands[0]);
    const operand2 = Number.parseFloat(operationObject.operands[1]);
    let result = 0;

    switch (operationObject.operator) {
        case mappedFuncKeys.addition:
            result = operand1 + operand2;
            break;
        case mappedFuncKeys.subtract:
            result = operand1 - operand2;
            break;
        case mappedFuncKeys.multiply:
            result = operand1 * operand2;
            break;
        case mappedFuncKeys.divide:
            result = operand1 / operand2;
            break;
        default:
            break;
    }

    handleDisplay("", true);
    handleDisplay(String(result));
    resetOperationObject();
}

/**
 * When A function Key is pressed? (+, -, x, / etc..)
 * we store the text content from the calculationSpace and store it as a number in 
 * operand and when we receive the operator "=", we solve (not Implemented "solve")
 * @param {string} operand 
 * @param {string} [currOperator=""] 
 */
function storeAndOperate(currOperator = "") {
    const calculationSpace = document.querySelector("#calculationSpace");
    const operand = calculationSpace.textContent;
    if (calculationSpace instanceof HTMLElement) {
        debug("operand Captured: ", operand);

        if (operationState.operands.length < 2 && operand.length > 0) {
            operationState.operands.push(operand);
        }

        if (currOperator !== "") {

            if (currOperator === "=" && operationState.lockState === true) {
                debug("Eq Received: ", operationState);
                operate(operationState);
                operationState.lockState = false;

                return;
            }

            if (currOperator !== "=" && operationState.operands.length > 0) {

                if (operationState.lockState === false) {
                    operationState.operator = currOperator;
                    operationState.lockState = true;
                }
                else {
                    operate(operationState);
                    operationState.lockState = false;
                }
            }
        }
        debug(operationState);

    }
}

/**
 * Handle the display for the keys! (can clear too!)
 * @param {string} toDisplay 
 * @param {boolean} [clear=false] 
 * @param {boolean} [backspace=false] 
 */
function handleDisplay(toDisplay, clear = false, backspace = false) {
    const display = document.querySelector("#calculationSpace");

    if (clear === true) {
        display.textContent = "";
        return;
    }

    if (backspace === true) {
        display.textContent = display.textContent.slice(0, -1);
    }

    debug("Displaying: ", toDisplay);
    display.textContent += toDisplay;
}

/**
 * Handles keys like Delete, Backspace, Equal
 * @param {PointerEvent} event 
 */
function handleProcessingKeys(event) {
    const target = event.target;
    const processingKeys = ['equal', 'clearCalcButton', 'backspace'];
    let ID = target.id;

    if (target instanceof HTMLElement) {
        if (target.tagName == "IMG") {
            const parentElement = target.parentElement;
            ID = parentElement.id;
        }

        switch (ID) {
            case processingKeys[0]:
                storeAndOperate("=");
                break;
            case processingKeys[1]:
                resetOperationObject();
                console.clear();

                handleDisplay("", true)
                break;
            case processingKeys[2]:
                handleDisplay("", false, true);
                break;
            default:
                break;
        }
    }
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
            handleDisplay(mappedNumKeys[ID]);
        }
    }
}

/**
 * Bind eveent listeners to function buttons (addition, sub, etc..)
 * @param {PointerEvent} event 
*/
function handleFuncKeys(event) {
    const target = event.target;
    let ID = target.id;

    if (target instanceof HTMLElement) {
        if (target.tagName == "IMG") {
            const parentElement = target.parentElement;
            const className = parentElement.className;
            ID = parentElement.id;
        }

        if (Object.keys(mappedFuncKeys).includes(ID)) {
            storeAndOperate(mappedFuncKeys[ID]);
            handleDisplay("", true);
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
        handleProcessingKeys(event);
    });
}


function main() {
    const calculator = document.querySelector("#calculator");
    registerButtonsListeners(calculator);
}



main();