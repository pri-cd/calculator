const DEBUG = true;
const CL_SPACE_ID = "#calculationSpace";
const CL_CONTAINER_ID = "#calculator";
const FUNC_KEY_CLS = "function";
const BTN_KEY_CLS = "button";

const CL_STATE_OPERAND_1_RECVD = 0;
const CL_STATE_OPERATOR_INIT_RECVD = 1;
const CL_STATE_OPERAND_2_RECVD = 2;
const CL_STATE_OPERATOR_FINAL_RECVD = 3;

const DECIMAL = ".";
let CL_DECIMAL_LOCK = false;

function debug(...args) {
    if (DEBUG === true) {
        console.log(...args);
    }
}


/**
 * The setter function for "CL_DECIMAL_LOCK" flag.
 * @param {boolean} lock 
 */
function setDecimalLock(lock) {
    CL_DECIMAL_LOCK = lock;
    debug("Setting Decimal Lock!: ", CL_DECIMAL_LOCK);
}


/**
 * The getter function for "CL_DECIMAL_LOCK" flag.
 */
function getDecimalLock()
{
    return CL_DECIMAL_LOCK;
}


/**
 * This gets the number from the div that displays numbers from calculator.
 * @param {boolean} [float=false]
 * @returns {Number}
 */
function getNumberFromArea(float = false) {
    const calcArea = document.querySelector(CL_SPACE_ID);
    let number = 0;

    if (calcArea instanceof HTMLElement) {
        if (float === true) {
            number = Number.parseFloat(calcArea.textContent);
            return number;
        }
        number = Number.parseInt(calcArea.textContent);
    }
    return number;
}


/**
 * This handles the display related functionality.
 * @param {string} string 
 * @param {boolean} [clearDisplay=false] 
 * @param {boolean} [backSpace=false] 
 */
function handleDisplaying(string, clearDisplay = false, backSpace = false) {
    const display = document.querySelector(CL_SPACE_ID);
    const content = display.textContent
    if (clearDisplay) {
        display.textContent = "";
        return;
    }

    if (backSpace) {
        if (content.at(-1) === DECIMAL)
        {
            setDecimalLock(false);
        }
        display.textContent = content.slice(0, -1);
        return;
    }

    if (string === DECIMAL) {
        if (getDecimalLock()) {
            return;
        }
        setDecimalLock(true);
    }
    display.textContent += string;
}


/**
 * Handles all the calls for buttons like Delete, Backspace, Equal, Addition, Subtraction, etc.
 * @param {HTMLElement} targetElement 
 */
function handleFunctionEvents(targetElement) {
    const funcButtonIds = {
        clearDisplay: "clearCalcButton",
        backSpace: "backspace",
        divide: "divide",
        multiply: "multiply",
        addition: "addition",
        subtract: "subtract",
        equal: "equal",
    }

    if (targetElement.className.includes(FUNC_KEY_CLS)) {

        switch (targetElement.id) {
            case funcButtonIds.clearDisplay:
                handleDisplaying("", true);
                break;
            case funcButtonIds.backSpace:
                handleDisplaying("", false, true);
                break;
            case funcButtonIds.addition:
                break;
            case funcButtonIds.subtract:
                break;
            case funcButtonIds.multiply:
                break;
            case funcButtonIds.divide:
                break;
            case funcButtonIds.equal:
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
            handleFunctionEvents(target);
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
