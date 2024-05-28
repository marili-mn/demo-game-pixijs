const { BLOCK_SIZE, BOARD_WIDTH, BOARD_HEIGHT } = require('../../constants');
const TetriX = require('../TetriX');
const Block = require('../Block');

class Board extends PIXI.Container {
  constructor({ resources }) {
    super();

    this.res = resources;

    this.grid = this.createEmptyBoard();
    this.visibleGrid = this.createEmptyBoard();
    this.createGraphicalContainer();

    // Create board container
    this.board = new PIXI.Container();

    // Set position
    this.board.position.x = 32;
    this.board.position.y = 32;

    this.init();
  }

  createGraphicalContainer() {
    const maxHeight = (BOARD_HEIGHT + 1);
    const maxWidth = (BOARD_WIDTH + 1);

    for (let row = 0; row <= maxHeight; row++) {
      for (let column = 0; column <= maxWidth; column++) {
        if ((row === 0 || row === maxHeight) || (column === 0 || column === maxWidth)) {
          let rowBlock = new Block(this.res['board-border'].texture, BLOCK_SIZE);

          if (row === 0 && column === 0) {
            rowBlock.el.texture = this.res['board-corner'].texture;
          } else if (row === 0 && column === maxWidth) {
            rowBlock.el.texture = this.res['board-corner'].texture;

            rowBlock.el.anchor.x = 1;
            rowBlock.el.scale.x *= -1;
          } else if (row === maxHeight && column === 0) {
            rowBlock.el.texture = this.res['board-corner'].texture;

            rowBlock.el.anchor.y = 1;
            rowBlock.el.scale.y *= -1;
          } else if (row === maxHeight && column === maxWidth) {
            rowBlock.el.texture = this.res['board-corner'].texture;

            rowBlock.el.anchor.x = 1;
            rowBlock.el.scale.x *= -1;
            rowBlock.el.anchor.y = 1;
            rowBlock.el.scale.y *= -1;
          } else if (row === maxHeight) {
            rowBlock.el.anchor.y = 1;
            rowBlock.el.scale.y *= -1;
          } else if (column === 0) {
            rowBlock.el.angle = -90;
            rowBlock.el.pivot.set(BLOCK_SIZE, 0);
          } else if (column === maxWidth) {
            rowBlock.el.angle = 90;
            rowBlock.el.pivot.set(0, BLOCK_SIZE);
          }

          // Modify Position
          rowBlock.el.position.x = column * BLOCK_SIZE;
          rowBlock.el.position.y = row * BLOCK_SIZE;

          this.addChild(rowBlock.el);
        }
      }
    }
  }

  createEmptyBoard() {
    return new Array(BOARD_HEIGHT).fill(0).map(() =>
      new Array(BOARD_WIDTH).fill(0)
    );
  }

  init() {
    for (let row = 0; row < this.grid.length; row++) {
      for (let column = 0; column < this.grid[row].length; column++) {
        const block = new Block(this.res['block-empty'].texture, BLOCK_SIZE);

        // Modify Position
        block.el.position.x = column * BLOCK_SIZE;
        block.el.position.y = row * BLOCK_SIZE;

        this.visibleGrid[row][column] = block.el;
        this.board.addChild(block.el);
      }
    }

    // Add board to the container
    this.addChild(this.board);
  }

  spawn(TetriX) {
    this.update(TetriX);
  }

  merge(TetriX) {
    this.grid = this.getGridWithTetromino(TetriX);
  }

  update(TetriX) {
    this.draw(
      this.getGridWithTetromino(TetriX)
    );
  }

  getGridWithTetromino(TetriX) {
    const tempBoard = this.createEmptyBoard();

    let tetromRow = 0;

    for (let row = 0; row < this.grid.length; row++) {
      let tetromCol = (TetriX.col < 0) ? Math.abs(TetriX.col) : 0;
      let found = false;

      for (let column = 0; column < this.grid[row].length; column++) {
        if (
          row >= TetriX.row && row < (TetriX.row + TetriX.type.size) &&
          column >= TetriX.col && column < (TetriX.col + TetriX.type.size)
        ) {
          if ( TetriX.type.shapes[TetriX.currRotation][tetromRow][tetromCol] ) {
            tempBoard[row][column] = TetriX.type.texture;
          } else {
            tempBoard[row][column] = this.grid[row][column];
          }
          found = true;
        } else {
          tempBoard[row][column] = this.grid[row][column];
        }

        if (found) tetromCol++;
      }

      if (found) tetromRow++;
    }

    return tempBoard
  }

  draw(board) {
    for (let row = 0; row < this.grid.length; row++) {
      for (let column = 0; column < this.grid[row].length; column++) {
        if (board[row][column] !== 0) {
          this.visibleGrid[row][column].texture = this.res[board[row][column]].texture;
        } else {
          this.visibleGrid[row][column].texture = this.grid[row][column] ? this.visibleGrid[row][column].texture : this.res['block-empty'].texture;
        }
      }
    }
  }

  completeEmptyRowWithRandomBlocks() {
    let rowFull = (this.grid.length - 1);

    for (let row = rowFull; row >= 0; row--) {
      let isFull = true;

      for (let column = 0; column < this.grid[row].length; column++) {
        if (this.grid[row][column] === 0) {
          isFull = false;
        }
      }

      if (!isFull) {
        for (let column = 0; column < this.grid[row].length; column++) {
          const randomTetromino = new TetriX({});
          this.visibleGrid[row][column].texture = this.res[randomTetromino.type.texture].texture;
          this.grid[row][column] = randomTetromino.type.texture;

          rowFull = row;
        }

        break;
      }
    }

    return rowFull;
  }
}

module.exports = Board;
