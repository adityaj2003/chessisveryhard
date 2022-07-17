var engine = new Worker('../stockfish.js/src/stockfish.js');
var evaler = new Worker('../stockfish.js/src/stockfish.js');

var prevLine = null;

engine.onmessage = function(event) {
    var line;
    if (event && typeof event === "object") {
        
        line = event.data;
    } else {
        line = event;
    }
    
    console.log("Reply engine: " + line);
    if (line.includes("bestmove")) {
        showBestMove(line);
        evalCurrentPosition(prevLine);
    }
    
    if (prevLine == null) {
        prevLine = line;
    }
    else {
    prevLine = line;
    }
    
}


evaler.onmessage = function(event) {
    var line;
    if (event && typeof event === "object") {
        
        line = event.data;
    } else {
        line = event;
    }
    
    if (line.includes("bestmove")) {
        showBestMove(line);
    }
    
    else if(line.includes("Final evaluation")) {
        updateEvalDiv(line);
    }
    
}


console.log("message sent");
engine.postMessage("uci");
engine.postMessage("isready");
evaler.postMessage("uci");
evaler.postMessage("isready");



