import React, { useEffect } from 'react';
import { Chessboard, COLOR, INPUT_EVENT_TYPE, MARKER_TYPE } from '../src/cm-chessboard/Chessboard.js';
import Chess from '../chess.js';
import Header from './LoginComponent.js';

const PuzzlesComponent = () => {
  useEffect(() => {
    const chess = new Chess();
    const board = new Chessboard(document.getElementById('board'), {
      position: chess.fen(),
      sprite: { url: '../assets/images/chessboard-sprite.svg' },
      style: {
        moveFromMarker: undefined,
        moveToMarker: undefined,
        cssClass: 'chessboard-js',
      },
      orientation: COLOR.white,
    });
    board.enableMoveInput(inputHandler, COLOR.white);

    return () => {
      // Cleanup code (if needed)
    };
  }, []);

  const inputHandler = (event) => {
    // Handle input events (if needed)
  };

  return <div id="board" style={{ width: '50%', height: '50%' }}></div>;
};

const head = createRoot(document.getElementById('header'))
head.render(<Header />);
const root = createRoot(document.getElementById('root'))
root.render(<PuzzlesComponent />);
