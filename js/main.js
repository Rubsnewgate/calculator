// Calculator DOM elements
const calculatorElements = {
    screen: document.getElementById('screen'),
    btns: document.querySelector('.calculator__btns'),
}

// Calculator initial state
let shouldResetScreen = false
let previousOperand = 0
let currentOperand = '0'
let hasError = false
let operator = null
let result = 0

// Arithmetic operations
const subtract = (a, b) => a - b
const multiply = (a, b) => a * b
const add = (a, b) => a + b

const divide = (a, b) => {
    if (b === 0) {
        hasError = true
        return 'ERROR'
    }
    return a / b
}

// Calculator special functions
const allClear = () => {
    shouldResetScreen = false
    previousOperand = 0
    currentOperand = '0'
    hasError = false
    operator = null
    result = 0

    calculatorElements.screen.innerText = currentOperand
}

const backspace = () => {
    currentOperand = currentOperand.length > 1
        ? currentOperand.slice(0, -1)
        : '0'
    calculatorElements.screen.innerText = currentOperand
}

const addDecimal = () => {
    if (!currentOperand.includes('.')){
        currentOperand += currentOperand === '0' ? '0.' : '.'
    }
    calculatorElements.screen.innerText = currentOperand
}

const getResult = () => {
    if (operator === null) {
        return
    }

    result = operate(operator, previousOperand, +currentOperand)

    if (result === 'ERROR') {
        calculatorElements.screen.innerText = 'ERROR'
        currentOperand = '0'
        previousOperand = 0
        operator = null
    }
    else {
        calculatorElements.screen.innerText = result
        currentOperand = result.toString()
        previousOperand = 0
        operator = null
        shouldResetScreen = true
    }
}

// Check what type of btn was clicked
function clickBtn (value) {
    if (isNaN(Number(value))) {
        handleSymbol(value)
    }
    else {
        handleNumber(value)
    }
}

const prepareOperation = (operationSymbol) => {
    previousOperand = +currentOperand
    operator = operationSymbol
    currentOperand = '0'
}

// Handle numbers and symbols
function handleNumber (number) {
    if (hasError) {
        return
    }

    if (shouldResetScreen) {
        currentOperand = number
        shouldResetScreen = false
    }
    else {
        currentOperand = currentOperand === '0' ? number : currentOperand + number
    }

    calculatorElements.screen.innerText = currentOperand
}

function handleSymbol (symbol) {
    if (hasError && symbol !== 'AC') return

    switch (symbol) {
        case 'AC':
            allClear()
            break
        case '←':
            backspace()
            break
        case '.':
            addDecimal()
            break
        case '=':
            getResult()
            break
        case '-':
        case '*':
        case '÷':
        case '+':
            if (operator !== null && previousOperand !== 0 && currentOperand !== '0') {
                // Case 1: We have both numbers, calculate immediately
                getResult()
                previousOperand = +currentOperand
                currentOperand = '0'
                console.log(previousOperand, currentOperand)
            }
            else if (currentOperand === '0' && previousOperand !== 0) {
                // Case 2: User pressed operator multiple times, just update operator
                // No code needed here!
            }
            else {
                // Case 3: First operator press, store the first number
                previousOperand = +currentOperand
                currentOperand = '0'
                console.log(previousOperand, currentOperand)
            }
            operator = symbol
            break
    }
}

// Standardization of floating numbers
function cleanResult(num) {
    const cleaned =  parseFloat(num.toFixed(8))
    return cleaned % 1 === 0 ? cleaned.toString() : cleaned
}

// Operation handle
function operate (symbol, numberA, numberB) {
    switch (symbol) {
        case '-':
            result = subtract(numberA, numberB)
            break
        case '*':
            result = multiply(numberA, numberB)
            break
        case '÷':
            result = divide(numberA, numberB)
            if (result === 'ERROR') return
            break
        case '+':
            result = add(numberA, numberB)
            break
    }

    return cleanResult(result)
}

// Init the calculator app
function init () {
    calculatorElements.screen.innerText = '0'

    calculatorElements.btns.addEventListener('click', function (event) {
        clickBtn(event.target.value)
    })

    document.addEventListener('keydown', (e) => {
        const keyMap = {
            'Escape': 'AC',
            'Backspace': '←',
            'Enter': '=',
            '+': '+',
            '-': '-',
            '*': '*',
            '/': '÷',
            '.': '.',
            '0': '0',
            '1': '1',
            '2': '2',
            '3': '3',
            '4': '4',
            '5': '5',
            '6': '6',
            '7': '7',
            '8': '8',
            '9': '9'
        }
        if (keyMap[e.key]) clickBtn(keyMap[e.key])
    })
}

init()
