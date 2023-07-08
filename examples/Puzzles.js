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
                console.log(puzzlePGN);
                let puzzleMoves;
                let cleanedPGN = puzzlePGN.replace(/\d+\./g, '');
                if (cleanedPGN.startsWith('..')) {
                  console.log('black to move');
                  moveColor = COLOR.black;
                }
                cleanedPGN = cleanedPGN.replace(/\./g, '');
                moveArray = cleanedPGN.split(' ');
                moveArray = moveArray.filter((item) => item !== '')

                console.log(moveArray);
                const event = puzzleData.event;
                const white = puzzleData.white;
                const black = puzzleData.black;
                board.setPosition(fen);
                chess.load(fen);
                console.log(fen);
                console.log(chess.turn());
                console.log(chess.fen());
                board.enableMoveInput(inputHandler , moveColor);
            });
        }
  function inputHandler(event) {
    console.log("event", event)
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
        console.log("result", result["san"]);
        console.log("moveArray", moveArray[moveInt]);
        if (result["san"] === moveArray[moveInt]) {
            event.chessboard.setPosition(chess.fen());
            setTimeout(() => {
            }, 500);
            moveInt++;
            if (moveInt === moveArray.length) {
              showPopupCorrect().then(() => {
              });
              setTimeout(() => {
              }, 2000);
              moveInt = 0;
              getPuzzle();
          }
          else {
            chess.move(moveArray[moveInt])
            moveInt++;
            event.chessboard.setPosition(chess.fen());
            event.chessboard.enableMoveInput(inputHandler, moveColor);
            if (moveInt === moveArray.length) {
              setTimeout(() => {
              }, 2000);
              showPopupCorrect().then(() => {
              });
              moveInt = 0;
              getPuzzle();
            }
          }
        } else {
          showPopupIncorrect().then(() => {
            // Code to update the main page after the popup is hidden
            console.log('Popup closed');
          });
            chess.load(fen);
            event.chessboard.setPosition(fen);
            event.chessboard.view.redraw();
            moveInt = 0;
            event.chessboard.enableMoveInput(inputHandler, moveColor);
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
      // Cleanup code (if needed)
    };
  }, []);


  return <div id="board" style={{ width: '50%', height: '50%' }}></div>;
};

const root = createRoot(document.getElementById('root'))
root.render(<PuzzlesComponent />);