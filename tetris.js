var gameBoardColumn = 10;
var gameBoardRow = 20;


var activeTetromino = {
    matrix: null,
    color: null,
    position: {
        x: 0,
        y: 0,
    }
};


var gameBoard = createMatrix(gameBoardColumn, gameBoardRow);
var bodyStyle = document.body.style;
var speed = 1;
var game;
var gamestatus;
// 0 - good game
// 1 - paused
// 2 - game over

function drawTable() {
    var row = "";
    for (var i = 0; i < gameBoardRow; i++) {
        row += "<tr>";
        for (var j = 0; j < gameBoardColumn; j++) {
            row += "<td id='R" + i + "C" + j + "' class='empty'></td>";
        }
        row += "</tr>";
    }
    document.getElementById("gamearea").innerHTML = row;
}

function createMatrix(column, row) {
    var matrix = [];
    while (row--) {
        matrix.push(new Array(column).fill(0));
    }
    return matrix;
}

var pieces = 'TJLOSZI';

var tetrominos = {
    I: {
        matrix: [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ],

        color: "#0341AE",

    },
    L: {
        matrix: [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ],

        color: "#72CB3B",
    },

    J: {
        matrix: [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
        ],

        color: "#FFD500",
    },

    O: {
        matrix: [
            [1, 1],
            [1, 1],
        ],

        color: "#FF971C",


    },
    Z: {
        matrix: [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ],

        color: "#FF3213",

    },
    S: {
        matrix: [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ],

        color: "#28B463",

    },
    T: {
        matrix: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],

        color: "#117A65",
    },
};

function generateTetromino() {

    var selectedType = pieces[Math.floor(Math.random() * pieces.length)];

    activeTetromino.matrix = tetrominos[selectedType].matrix;
    activeTetromino.color = tetrominos[selectedType].color;

    activeTetromino.position = {
        x: Math.floor(gameBoardColumn * 2 / 5),
        y: 0,
    };

    bodyStyle.setProperty('--activeTetrominoColor', activeTetromino.color);

    updateTetromino("full");

    if (anyCollision(activeTetromino.matrix)) {

        var answer = confirm("Game Over! New Game?");

        if (answer == true) {
            resetGame();

        } else {

            messageChange(2);
            resetGame();


        }

    }

}

function updateTetromino(action) {
    for (var i = 0; i < activeTetromino.matrix.length; i++) {
        for (var j = 0; j < activeTetromino.matrix[i].length; j++) {
            if (activeTetromino.matrix[i][j]) {

                var xCoordinate = j + activeTetromino.position.x;
                var yCoordinate = i + activeTetromino.position.y;

                var id = 'R' + yCoordinate + 'C' + xCoordinate;

                document.getElementById(id).className = action;

            }
        }
    }
}

function moveTetrominoHorizontal(direction) {
    updateTetromino("empty");
    activeTetromino.position.x += direction;

    if (anyCollision(activeTetromino.matrix)) {
        activeTetromino.position.x -= direction;
    }

    updateTetromino("full");
}

function moveTetrominoDown() {
    updateTetromino("empty");
    activeTetromino.position.y += 1;

    if (anyCollision(activeTetromino.matrix)) {
        activeTetromino.position.y -= 1;
        lockTetromino();
    }

    updateTetromino("full");

}


function rotateTetromino() {

    var newMatrix = rotateMatrix(activeTetromino.matrix);

    if (!anyCollision(newMatrix)) {
        updateTetromino("empty");
        activeTetromino.matrix = newMatrix;
        updateTetromino("full");
    }
}

function lockTetromino() {
    for (var i = 0; i < activeTetromino.matrix.length; i++) {
        for (var j = 0; j < activeTetromino.matrix.length; j++) {
            if (activeTetromino.matrix[i][j] === 1) {

                gameBoard[i + activeTetromino.position.y][j + activeTetromino.position.x] = 1;

                var id =
                    'R' + (i + activeTetromino.position.y) +
                    'C' + (j + activeTetromino.position.x);

                document.getElementById(id).className = "locked";
            }
        }
    }


    for (var i = 0; i < activeTetromino.matrix.length; i++) {
        checkRowFull();
    }
}


function anyCollision(matrix) {
    for (var i = 0; i < matrix.length; i++) {
        for (var j = 0; j < matrix[i].length; j++) {
            if (matrix[j][i] == 1) {

                var newX = activeTetromino.position.x + i;
                var newY = activeTetromino.position.y + j;

                if (newX < 0 || newX >= gameBoardColumn) {
                    return true;
                }

                if (newY >= gameBoardRow) {

                    return true;
                }

                if ((matrix[j][i] === 1) && (gameBoard[newY][newX] === 1)) {
                    return true;
                }


            }
        }
    }
    return false;
}

function checkRowFull() {

    var rowCountToDelete = 0;
    for (var row = gameBoard.length - 1; row > -1; row--) {

        var complete = true;

        for (var column = 0; column < gameBoard[row].length; column++) {
            if (gameBoard[row][column] == 0) {
                complete = false;
            }
        }

        if (complete) {
            for (var i = row; i > 1; i--) {
                for (var j = 0; j < gameBoard[i].length; j++) {
                    gameBoard[i][j] = gameBoard[i - 1][j];
                }
            }
            score += 10;
            scoreBoard.innerHTML = score;

        }

    }

    fillBoard();
    generateTetromino();

}

function fillBoard() {
    for (var i = 0; i < gameBoard.length; i++) {
        for (var j = 0; j < gameBoard[i].length; j++) {
            if (gameBoard[i][j] == 1) {

                var id = 'R' + i + 'C' + j;

                document.getElementById(id).className = "locked";

            } else {

                var id = 'R' + i + 'C' + j;

                document.getElementById(id).className = "empty";
            }

        }
    }
}

var scoreBoard = document.getElementById("score");
var highScore = document.getElementById("highscore");

var score = 0;
var storagedHighScore;


var currentPlayer = {
    name: "Halil",
    score: 0,
}


function collectInformation() {
    currentPlayer.name = prompt("Please enter your name", "");
}


var scoreList = JSON.parse(localStorage.getItem("scoreList")) || [];



function resetGame() {

    messageChange(0);

    currentPlayer.score = score;

    var tempUser = Object.assign(currentPlayer);

    scoreList.push(tempUser);

    localStorage.setItem("scoreList", JSON.stringify(scoreList));

    if (score > parseInt(storagedHighScore)) {
        localStorage.setItem("highscore", score);

        storagedHighScore = localStorage.getItem("highscore");

    }

    score = 0;
    scoreBoard.innerHTML = score;
    highScore.innerHTML = parseInt(storagedHighScore);

    clearInterval(game);

    for (var i = 0; i < gameBoard.length; i++) {
        for (var j = 0; j < gameBoard[i].length; j++) {

            gameBoard[i][j] = 0;

            var id = 'R' + i + 'C' + j;
            document.getElementById(id).className = "empty";

        }
    }

    initHighScores();

    generateTetromino();

}

function newPlayer() {
    collectInformation();
}

document.addEventListener('keydown', control);


function control(event) {
    switch (event.key) {
        case "ArrowLeft":
            moveTetrominoHorizontal(-1);
            break;

        case "ArrowRight":
            moveTetrominoHorizontal(1);
            break;

        case "ArrowDown":
            messageChange(0);
            moveTetrominoDown();
            break;

        case "ArrowUp":
            rotateTetromino();
            break;

        default:
            break;
    }
}

function pauseGame() {

    messageChange(1);
    clearInterval(game);
}


function startGame() {

    clearInterval(game); //clear interval everytime user pressed start button.
    messageChange(0);
    game = setInterval(moveTetrominoDown, 1000 / speed);

}

var recordedHighScores = JSON.parse(localStorage.getItem("scoreList")) || [];


function initGame() {

    drawTable();
    generateTetromino();
    initHighScore();
    initHighScores();

}

initGame();


function initHighScores() {

    var list = Object.assign(recordedHighScores);
    var printOut = "";      


    // Sort- Slice than print 
    
    list.sort(function (a, b) {
        return b.score - a.score;
    }).slice(0,5).forEach(function (player, index) {


        printOut += '<div>' + "Name: " + player.name + ' Score:' + player.score + '</div>'
        
    });

    document.getElementById("highScoreList").innerHTML = printOut;

}


//Helpers 

//rotate N*N MAtrix 90 Degree Clockwise Rotation 
function rotateMatrix(matrix) {
    var theta = matrix.reduce((omega, alpha) => omega.concat(alpha));
    var newMatrix = [];
    for (var x = 0; x < matrix[0].length; x++) {
        var i = x;
        newMatrix[x] = [];
        while (i < theta.length) {
            newMatrix[x].push(theta[i]);
            i += matrix[0].length;
        }
        newMatrix[x].reverse();
    }
    return newMatrix;

}

function messageChange(status) {
    switch (status) {
        case 0:
            document.getElementById("welcomeMessage").innerHTML = " Good Game ";
            break;

        case 1:
            document.getElementById("welcomeMessage").innerHTML = " Paused ";
            break

        case 2:
            document.getElementById("welcomeMessage").innerHTML = " Game Over ";

        default:
            break;
    }
}

function initHighScore() {

    scoreList = [];

    storagedHighScore = localStorage.getItem("highscore");

    if (storagedHighScore == null) {
        localStorage.setItem("highscore", 0);
    }
    storagedHighScore = localStorage.getItem("highscore");
    highScore.innerHTML = parseInt(storagedHighScore);


}