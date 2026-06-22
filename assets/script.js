const DEBUG = true;
const CL_SPACE_ID = "#calculationSpace";
const CL_CONTAINER_ID = "#calculator";
const FUNC_KEY_CLS = "function";
const BTN_KEY_CLS = "button";
const MAX_NUM_LENGTH = 21;

const ERR_MSG_DIV_ZERO = "Dividing by zero, Isn't allowed!";


const CL_STATE_NONE = 0;
const CL_STATE_OPERAND_1_RECVD = 1;
const CL_STATE_OPERATOR_INIT_RECVD = 2;
const CL_STATE_OPERAND_2_RECVD = 3;
const CL_STATE_OPERATOR_FINAL_RECVD = 4;
const operationVar = {
    operandA: 0,
    operandB: 0,
    operator: "",
    currState: CL_STATE_NONE,
    operationLog: [CL_STATE_NONE],
}
const funcButtonIds = {
    clearDisplay: "clearCalcButton",
    backSpace: "backspace",
    divide: "divide",
    multiply: "multiply",
    add: "add",
    subtract: "subtract",
    equal: "equal",
}

const DECIMAL = ".";
let ongoingCalc = structuredClone(operationVar);


function debug(...args) {
    if (DEBUG === true) {
        console.log(...args);
    }
}

/**
 * Pass in a empty string to clear the message!
 * @param {string} errorMsg 
 */
function showErrorMessages(errorMsg) {
    const error = document.querySelector("#errMsg");
    if (error instanceof HTMLElement)
    {
        error.textContent = errorMsg;
    }
}

/**
 * @param {HTMLElement} calcArea
 */
function isDecimalInArea(calcArea) {
    let isDecimal = false;
    if (calcArea.textContent.split("").includes(DECIMAL)) {
        isDecimal = true;
    }
    return isDecimal;
}


function handleDisplayBackspace() {
    const display = document.querySelector(CL_SPACE_ID);
    display.textContent = display.textContent.slice(0, -1);
    return;
}

/**
 * This handles the display related functionality.
 * If passed "" empty string, It'll empty out the display.
 * @param {string} char 
 */
function handleDisplaying(char) {
    const display = document.querySelector(CL_SPACE_ID);
    const content = display.textContent;

    if (isDecimalInArea(display) && char === DECIMAL) {
        return;
    }

    if (char === "") {
        display.textContent = "";
        return;
    }

    if (display.textContent.length < 21) {
        display.textContent += char;
    }
}


function resetAll() {
    ongoingCalc = structuredClone(operationVar);
}

/**
 * Returns "true" If the calculation area is empty!
 * @returns {Boolean}
 */
function isAreaEmpty() {
    let isEmpty = false;
    const calcArea = document.querySelector(CL_SPACE_ID);

    if (calcArea.textContent.length < 1) {
        isEmpty = true;
    }

    return isEmpty;
}

/**
 * This gets the number from the div that displays numbers from calculator.
 * @returns {Number}
 */
function getNumberFromArea() {
    const calcArea = document.querySelector(CL_SPACE_ID);
    let number = 0;

    if (calcArea instanceof HTMLElement) {
        if (isDecimalInArea(calcArea) === true) {
            number = Number.parseFloat(calcArea.textContent);
            return number;
        }
        number = Number.parseInt(calcArea.textContent);
    }
    return number;
}



/**
 * Return the result as per the operation.
 * @param {operationVar} ongoingCalc 
 * @returns {Number}
 */
function operate(ongoingCalc) {

    let result = 0;
    let strResult = "";

    switch (ongoingCalc.operator) {
        case funcButtonIds.add:
            result = ongoingCalc.operandA + ongoingCalc.operandB;
            break;
        case funcButtonIds.subtract:
            result = ongoingCalc.operandA - ongoingCalc.operandB;
            break;
        case funcButtonIds.multiply:
            result = ongoingCalc.operandA * ongoingCalc.operandB;
            break;
        case funcButtonIds.divide:
            result = ongoingCalc.operandA / ongoingCalc.operandB;
            break;
        default:
            break;
    }

    if (String(result).split("").includes(DECIMAL)) {
        result = Math.round(result * 100) / 100;
    }
    debug("Operating: ", ongoingCalc.operator, result);
    return result;
}



/**
 * This function is called when a function key like add, subtract, equal, divide, multiply is pressed!
 * Starts to store the value of operators & operation as needed!
 * @param {string} keyPressed 
 */
function handleFunctionKeyClicks(keyPressed) {

    const allowed1stOperators = ["add", "subtract", "multiply", "divide"];
    const equalOperator = "equal";

    if (!isAreaEmpty()) {
        if (allowed1stOperators.includes(keyPressed) || keyPressed === equalOperator) {

            /**
             * This is the state when the user presses:
             *  1. 2
             *  2. + 
             */
            if ((ongoingCalc.currState === CL_STATE_NONE)) {

                ongoingCalc.operandA = getNumberFromArea();
                ongoingCalc.operator = keyPressed;
                ongoingCalc.operationLog.push(CL_STATE_OPERAND_1_RECVD, CL_STATE_OPERATOR_INIT_RECVD);
                ongoingCalc.currState = CL_STATE_OPERATOR_INIT_RECVD;

                handleDisplaying("");
                showErrorMessages("");
                debug(ongoingCalc);
                return;
            }

            /**
             * This is the state when the user presses:
             *  1. 2
             *  2. +
             *  3. <anyNumber>
             *  4. +/=
             */
            if ((ongoingCalc.currState === CL_STATE_OPERATOR_INIT_RECVD)) {

                /**
                 * Handle divide by zero condition!
                 * So, this isn't allowed:
                 *  1. 2
                 *  2. /
                 *  3. 0
                 *  4. =/<other>
                 *  5. Give error!
                 */
                if (ongoingCalc.operator === "divide" && getNumberFromArea() === 0) {
                    debug("Divide by zero, not allowed (Resetting!!)");
                    handleDisplaying("");
                    resetAll();
                    showErrorMessages(ERR_MSG_DIV_ZERO);
                    return;
                }

                if (keyPressed === equalOperator) {
                    ongoingCalc.operandB = getNumberFromArea();
                    ongoingCalc.operationLog.push(CL_STATE_OPERAND_2_RECVD, CL_STATE_OPERATOR_FINAL_RECVD);
                    ongoingCalc.currState = CL_STATE_OPERATOR_FINAL_RECVD;
                    handleDisplaying("");
                    handleDisplaying(String(operate(ongoingCalc)));
                    return;
                }
                else {
                    ongoingCalc.operandB = getNumberFromArea();
                    ongoingCalc.currState = CL_STATE_OPERATOR_FINAL_RECVD;
                    ongoingCalc.operationLog.push(CL_STATE_OPERAND_2_RECVD, CL_STATE_OPERATOR_FINAL_RECVD);
                    const result = operate(ongoingCalc);
                    resetAll();

                    ongoingCalc.operandA = result;
                    ongoingCalc.operator = keyPressed;
                    ongoingCalc.currState = CL_STATE_OPERATOR_INIT_RECVD;
                    ongoingCalc.operationLog.push(CL_STATE_NONE, CL_STATE_OPERAND_1_RECVD, ongoingCalc.currState);
                    debug(ongoingCalc);
                    handleDisplaying("");
                    return;
                }
            }

            /**
             * This state code is for when, 
             * for example user presses in this respective order!: 
             *  1. 3
             *  2. +
             *  3. 3
             *  4. = (Should give 6)
             *  5. = (Should give 9)
             *  6. and, so on..
             */
            if (ongoingCalc.currState === CL_STATE_OPERATOR_FINAL_RECVD) {

                if (keyPressed == equalOperator) {
                    const operandA = getNumberFromArea();
                    const operandB = ongoingCalc.operandB;
                    const operator = ongoingCalc.operator;

                    resetAll();

                    ongoingCalc.operandA = operandA;
                    ongoingCalc.operandB = operandB;
                    ongoingCalc.operator = operator;

                    ongoingCalc.currState = CL_STATE_OPERATOR_FINAL_RECVD;
                    ongoingCalc.operationLog.push(CL_STATE_NONE, CL_STATE_OPERAND_1_RECVD, CL_STATE_OPERATOR_INIT_RECVD, CL_STATE_OPERAND_2_RECVD, ongoingCalc.currState);

                    handleDisplaying("");
                    handleDisplaying(String(operate(ongoingCalc)));
                    debug("Nothing recived, Recursively Calculating!", ongoingCalc);
                    return;
                }
                else {
                    const operandA = getNumberFromArea();

                    resetAll();
                    ongoingCalc.operandA = operandA;
                    ongoingCalc.operator = keyPressed;

                    ongoingCalc.currState = CL_STATE_OPERATOR_INIT_RECVD;
                    ongoingCalc.operationLog.push(CL_STATE_NONE, CL_STATE_OPERAND_1_RECVD, CL_STATE_OPERATOR_INIT_RECVD);
                    handleDisplaying("");

                    return;
                }
            }
        }
    }

    debug("Please stop pressing the function without entering number!", ongoingCalc);
}

/**
 * Handles all the calls for buttons like Delete, Backspace, Equal, add, Subtraction, etc.
 * @param {HTMLElement} targetElement 
 */
function handleFunctionEventSegregation(targetElement) {

    if (targetElement.className.includes(FUNC_KEY_CLS)) {

        switch (targetElement.id) {
            case funcButtonIds.clearDisplay:
                handleDisplaying("");
                resetAll();
                break;
            case funcButtonIds.backSpace:
                handleDisplayBackspace();
                break;
            case funcButtonIds.add:
            case funcButtonIds.subtract:
            case funcButtonIds.multiply:
            case funcButtonIds.divide:
                handleFunctionKeyClicks(targetElement.id);
                break;
            case funcButtonIds.equal:
                handleFunctionKeyClicks(targetElement.id);
                break;
            default:
                break;
        }
    }
}


/**
 * Handles all numeric key presses.
 * @param {HTMLElement} targetElement 
 */
function handleNumericEvents(targetElement) {

    const keyPress = {
        number1: "1",
        number2: "2",
        number3: "3",
        number4: "4",
        number5: "5",
        number6: "6",
        number7: "7",
        number8: "8",
        number9: "9",
        number0: "0",
        decimal: DECIMAL,
    };

    const ID = targetElement.id;
    const classNames = targetElement.className;

    if (!classNames.includes(FUNC_KEY_CLS)) {
        handleDisplaying(keyPress[ID]);
    }
}

/**
 * The listener callback function for handing, button clicks!
 * @param {PointerEvent} event 
 */
function handleButtonActions(event) {
    let target = event.target;

    if (target instanceof HTMLElement) {

        if ((target.tagName == "IMG") &&
            (target.parentElement.className.includes(BTN_KEY_CLS))) {
            target = target.parentElement;
        }

        if ((target instanceof HTMLElement) &&
            (target.className.includes(BTN_KEY_CLS))) {
            handleFunctionEventSegregation(target);
            handleNumericEvents(target)
        }
    }
}


function registerButtonListeners() {
    const calculator = document.querySelector(CL_CONTAINER_ID);

    if (calculator instanceof HTMLElement) {
        calculator.addEventListener('click', handleButtonActions);
    }
}

registerButtonListeners();
