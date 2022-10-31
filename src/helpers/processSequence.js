/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import Api from '../tools/api';
import { allPass, andThen, compose, curry, ifElse, prop, tap, tryCatch } from 'ramda';

const api = new Api();

const getValue = prop('value');
const getResult = prop('result');

const getFixed = (string) => (+string).toFixed(0);
const getLength = (string) => string.length;
const powerTwo = (num) => Math.pow(num, 2);
const reminderFromDivideByThree = (num) => num % 3;

const isStringLessNum = (num, string) => num > string.length;
const isStringMoreNum = (num, string) => num < string.length;
const isNumberPositive = (num) => num > 0;
const curriedIsStringLessNum = curry(isStringLessNum);
const curriedIsStringMoreNum = curry(isStringMoreNum);
const isStringLessThan10 = curriedIsStringLessNum(10);
const isStringMoreThan2 = curriedIsStringMoreNum(2);

const isStringValid = allPass([isStringLessThan10, isStringMoreThan2, isNumberPositive]);

const processSequence = ({value, writeLog, handleSuccess, handleError}) => {
  const showError = () => handleError('ValidationError');
  const createSafeFunction = (fn) => tryCatch(fn, showError);

  const checkValidity = ifElse(isStringValid, getFixed, showError);
  const checkValiditySafe = createSafeFunction(checkValidity);

  const makeQueryNumbersUrl = api.get('https://api.tech/numbers/base');
  const fetchNumber = (num) => makeQueryNumbersUrl({from: 10, to: 2, number: num});
  const fetchAnimal = (id) => api.get(`https://animals.tech/${id}`)({});

  const makeAsyncAfterAnimalFetch = compose(
    handleSuccess,
    getResult
  )

  const makeAsyncAfterNumberFetch = compose(
    andThen(makeAsyncAfterAnimalFetch),
    fetchAnimal,
    tap(writeLog),
    reminderFromDivideByThree,
    tap(writeLog),
    powerTwo,
    tap(writeLog),
    getLength,
    tap(writeLog),
    getResult);

  const app = compose(
    andThen(makeAsyncAfterNumberFetch),
    fetchNumber,
    tap(writeLog),
    checkValiditySafe,
    tap(writeLog),
    getValue
  );

  app({value});
};

export default processSequence;
