/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import {
  allPass,
  anyPass,
  both,
  complement,
  compose,
  equals,
  filter,
  isEmpty,
  juxt,
  length,
  prop,
  props,
  uniq
} from 'ramda';
import { COLORS, SHAPES } from '../constants';

/**
 * Гетеры
 */

const getTriangleColor = prop(SHAPES.TRIANGLE);
const getSquareColor = prop(SHAPES.SQUARE);
const getCircleColor = prop(SHAPES.CIRCLE);
const getStarColor = prop(SHAPES.STAR);
const getTringleAndSquareColors = props([SHAPES.TRIANGLE, SHAPES.SQUARE]);
const getColors = props([SHAPES.TRIANGLE, SHAPES.SQUARE, SHAPES.CIRCLE, SHAPES.STAR]);

/**
 * Предикаты
 */

const isRed = equals(COLORS.RED);
const isBlue = equals(COLORS.BLUE);
const isOrange = equals(COLORS.ORANGE);
const isGreen = equals(COLORS.GREEN);
const isWhite = equals(COLORS.WHITE);

const isStarRed = compose(isRed, getStarColor);
const isStarWhite = compose(isWhite, getStarColor);
const isSquareGreen = compose(isGreen, getSquareColor);
const isSquareOrange = compose(isOrange, getSquareColor);
const isSquareWhite = compose(isWhite, getSquareColor);
const isTriangleWhite = compose(isWhite, getTriangleColor);
const isTriangleGreen = compose(isGreen, getTriangleColor);
const isCircleWhite = compose(isWhite, getCircleColor);
const isCircleBlue = compose(isBlue, getCircleColor);

const isEqualsOne = equals(1);
const isEqualsTwo = equals(2);
const isEqualsFour = equals(4);

/**
 * Вспомогательные функции
 */

const quantityRedShapes = compose(length, filter(isRed), getColors);
const quantityBlueShapes = compose(length, filter(isBlue), getColors);
const quantityOrangeShapes = compose(length, filter(isOrange), getColors);
const quantityGreenShapes = compose(length, filter(isGreen), getColors);
const getQuantityRedAndBlueShapes = juxt([quantityRedShapes, quantityBlueShapes]);

const nonEmpty = complement(isEmpty);
const isLengthOne = compose(isEqualsOne, length, uniq);
const isNonZero = compose(nonEmpty, uniq);
const isArrayElementsSameAndNonZero = both(isLengthOne, isNonZero);

const moreThanThree = (num) => num >= 3;
const isColorsMoreThanThree = (colorQuantity) => compose(moreThanThree, colorQuantity);

const isColorEqualOne = (colorQuantity) => compose(isEqualsOne, colorQuantity);
const isColorEqualTwo = (colorQuantity) => compose(isEqualsTwo, colorQuantity);

const isTriangleAndSquareColorsSame = compose(isEqualsOne, length, uniq, getTringleAndSquareColors);

// 1. Красная звезда, зеленый квадрат, все остальные белые.

export const validateFieldN1 = allPass([isStarRed, isSquareGreen, isTriangleWhite, isCircleWhite]);


// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = compose(isEqualsTwo, length, filter(isGreen), getColors);

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = compose(isArrayElementsSameAndNonZero, getQuantityRedAndBlueShapes);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([isCircleBlue, isStarRed, isSquareOrange]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = anyPass([
  isColorsMoreThanThree(quantityOrangeShapes),
  isColorsMoreThanThree(quantityGreenShapes),
  isColorsMoreThanThree(quantityRedShapes),
  isColorsMoreThanThree(quantityBlueShapes)]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
  isColorEqualTwo(quantityGreenShapes),
  isTriangleGreen,
  isColorEqualOne(quantityRedShapes)
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = compose(isEqualsFour, length, filter(isOrange), getColors);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = allPass([complement(isStarRed), complement(isStarWhite)]);

// 9. Все фигуры зеленые.
export const validateFieldN9 = compose(isEqualsFour, length, filter(isGreen), getColors);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
  complement(isTriangleWhite),
  complement(isSquareWhite),
  isTriangleAndSquareColorsSame
]);
