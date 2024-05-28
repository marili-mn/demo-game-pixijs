const { BOARD_WIDTH } = require('../../constants');
const types = require('./types');
const { randomBetween } = require('../../libs/MathUtil');

/**
 * TetriX Class
 */
class TetriX {
  constructor({ row, col, type, rotation }) {
    this.currRotation = (rotation !== undefined) ? rotation : 0;
    this.realRotation = this.currRotation;
    this.type = type || this.getRandomType();

    this.shape = this.type.shapes[this.currRotation];

    this.row = (row !== undefined) ? row : 0;
    this.col = (col !== undefined) ? col : Math.ceil(((BOARD_WIDTH - 1) / 2) - (this.type.size / 2));
  }

  getRandomType() {
    const rand = randomBetween(1, Object.keys(types).length) - 1;
    return types[Object.keys(types)[rand]];
  }

  move(delta) {
    this.col = this.col + delta;
  }

  fall() {
    this.row++;
  }

  nextRotation(delta) {
    const rotation = Math.abs(this.realRotation + delta) % 4;
    return rotation;
  }

  rotate(delta) {
    this.realRotation = this.realRotation + delta;
    const rotation = Math.abs(this.realRotation) % 4;
    this.currRotation = rotation;
    this.shape = this.type.shapes[this.currRotation];
  }
}

/**
 * Module Export
 * @type {TetriX}
 */
module.exports = TetriX;
