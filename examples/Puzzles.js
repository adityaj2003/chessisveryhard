import React, { useEffect } from 'react';
import { Chessboard, COLOR, INPUT_EVENT_TYPE, MARKER_TYPE } from '../src/cm-chessboard/Chessboard.js';
import { createRoot } from 'react-dom/client';
import Chess from '../chess.js';
import io from 'socket.io-client';
import {parse} from 'pgn-parser';
import Header from './LoginComponent.js';
import e from 'cors';


function showPopupIncorrect() {
  const popup = document.getElementById('popup');
  popup.style.display = 'block';

  return new Promise((resolve) => {
    setTimeout(() => {
      popup.style.display = 'none';
      resolve();
    }, 2000);
  });
}

function showPopupCorrect() {
  const popup = document.getElementById('popupCorrect');
  popup.style.display = 'block';
  return new Promise((resolve) => {
    setTimeout(() => {
      popup.style.display = 'none';
      resolve();
    }, 2000);
  });
}



const PuzzlesComponent = () => {
  let chess = new Chess();
  const socket = io();
  let board;
  let moveInt = 0;
  let moveColor = COLOR.white;
  let fen;
  let moveArray;
        function getPuzzle() {
            socket.emit('getPuzzle', {});
            socket.on('puzzleData', function (msg) {
                const puzzleData = JSON.parse(msg);
                const puzzleId = puzzleData.puzzleId;
                fen = puzzleData.fen;
                const puzzlePGN = puzzleData.moves;
                let puzzleMoves;
                let cleanedPGN = puzzlePGN.replace(/\d+\./g, '');
                if (cleanedPGN.startsWith('..')) {
                  console.log('black to move');
                  board.setOrientation(COLOR.black);
                  moveColor = COLOR.black;
                }
                cleanedPGN = cleanedPGN.replace(/\./g, '');
                moveArray = cleanedPGN.split(' ');
                moveArray = moveArray.filter((item) => item !== '')

                const event = puzzleData.event;
                const white = puzzleData.white;
                const black = puzzleData.black;
                board.setPosition(fen);
                chess.load(fen);
                board.enableMoveInput(inputHandler , moveColor);
            });
        }
  async function inputHandler(event) {
    event.chessboard.removeMarkers(undefined, MARKER_TYPE.dot)
    event.chessboard.removeMarkers(undefined, MARKER_TYPE.square)
    if (event.type === INPUT_EVENT_TYPE.moveStart) {
        const moves = chess.moves({square: event.square, verbose: true});
        event.chessboard.addMarker(event.square, MARKER_TYPE.square)
        for (const move of moves) { // draw dots on possible moves
            event.chessboard.addMarker(move.to, MARKER_TYPE.dot)
        }
        return moves.length > 0
    } else if (event.type === INPUT_EVENT_TYPE.moveDone) {
        const move = {from: event.squareFrom, to: event.squareTo}
        const result = chess.move(move)
        if (result !== null) {
          if (result["san"] === moveArray[moveInt]) {
              event.chessboard.setPosition(chess.fen());
              await new Promise(resolve => setTimeout(resolve, 1000));
              moveInt++;
              if (moveInt === moveArray.length) {
                showPopupCorrect().then(() => {
                });
                moveInt = 0;
                getPuzzle();
            }
            else {
              chess.move(moveArray[moveInt])
              moveInt++;
              event.chessboard.setPosition(chess.fen());
              event.chessboard.enableMoveInput(inputHandler, moveColor);
              if (moveInt === moveArray.length) {
                showPopupCorrect().then(() => {
                });
                moveInt = 0;
                getPuzzle();
              }
            }
          } else {
            showPopupIncorrect().then(() => {
            });
            await new Promise(resolve => setTimeout(resolve, 1000));
            chess.load(fen);
            event.chessboard.setPosition(fen);
            event.chessboard.view.redraw();
            moveInt = 0;
            event.chessboard.enableMoveInput(inputHandler, moveColor);
          }
      }
      else {
        await new Promise(resolve => setTimeout(resolve, 1000));
        event.chessboard.setPosition(chess.fen());
        console.warn("invalid move", move);
      }
        return result

    }
}
  useEffect(() => {
    board = new Chessboard(document.getElementById('board'), {
      position: chess.fen(),
      sprite: { url: '../assets/images/chessboard-sprite.svg' },
      style: {
        moveFromMarker: undefined,
        moveToMarker: undefined,
        cssClass: 'chessboard-js',
      },
      orientation: COLOR.white,
    });
    board.enableMoveInput(inputHandler , COLOR.white);
    getPuzzle();
    return () => {
    };
  }, []);


  return <div id="board" style={{ width: '40%', height: '40%' }}></div>;
};

const root = createRoot(document.getElementById('root'))
root.render(<PuzzlesComponent />);