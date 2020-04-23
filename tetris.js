const gameBoardColumn = 10;
const gameBoardRow = 20;

let pieces = 'TJLOSZI';

const activeTetromino = {
    matrix: null,
    color: "yellow",
    position: {
        x: 0,
        y: 0,
    }
};






const gameBoard = createMatrix(gameBoardColumn, gameBoardRow);
let bodyStyle = document.body.style;
let speed = 1;
let game;
let gamestatus;
// 0 - good game
// 1 - paused
// 2 - game over




function drawTable() {
    let cell = "";
    for (let i = 0; i < gameBoardRow; i++) {
        cell += "<tr>";
        for (let j = 0; j < gameBoardColumn; j++) {
            cell += "<td id='R" + i + "C" + j + "' class='empty'></td>";
        }
        cell += "</tr>";
    }
    document.getElementById("gamearea").innerHTML = cell;
}

function createMatrix(column, row) {
    const matrix = [];
    while (row--) {
        matrix.push(new Array(column).fill(0));
    }
    return matrix;
}

function createPiece(type) {
    if (type === 'I') {
        return [
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
            [0, 1, 0, 0],
        ];
    } else if (type === 'L') {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [0, 1, 1],
        ];
    } else if (type === 'J') {
        return [
            [0, 1, 0],
            [0, 1, 0],
            [1, 1, 0],
        ];
    } else if (type === 'O') {
        return [
            [1, 1],
            [1, 1],
        ];
    } else if (type === 'Z') {
        return [
            [1, 1, 0],
            [0, 1, 1],
            [0, 0, 0],
        ];
    } else if (type === 'S') {
        return [
            [0, 1, 1],
            [1, 1, 0],
            [0, 0, 0],
        ];
    } else if (type === 'T') {
        return [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ];
    }
}

function createColor(type) {
    if (type === 'I') {
        return "#0341AE";
    } else if (type === 'L') {
        return "#72CB3B";
    } else if (type === 'J') {
        return "#FFD500";
    } else if (type === 'O') {
        return "#FF971C";
    } else if (type === 'Z') {
        return "#FF3213";
    } else if (type === 'S') {
        return "#28B463";
    } else if (type === 'T') {
        return "#117A65";
    }
}

function generateTetromino() {

    selectedType = pieces[Math.floor(Math.random() * pieces.length)];
    activeTetromino.matrix = createPiece(selectedType);
    activeTetromino.color = createColor(selectedType);
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

            gamestatus = 2;
            messageChange();
            resetGame();


        }

    }



}

function updateTetromino(action) {
    for (let i = 0; i < activeTetromino.matrix.length; i++) {
        for (let j = 0; j < activeTetromino.matrix[i].length; j++) {
            if (activeTetromino.matrix[i][j]) {

                const xCoordinate = j + activeTetromino.position.x;
                const yCoordinate = i + activeTetromino.position.y;

                const id = 'R' + yCoordinate + 'C' + xCoordinate;

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
        updateTetromino("empty");
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

function rotateMatrix(matrix) {
    var theta = matrix.reduce((omega, alpha) => omega.concat(alpha));
    var delta = [];
    for (var x = 0; x < matrix[0].length; x++) {
        var i = x;
        delta[x] = [];
        while (i < theta.length) {
            delta[x].push(theta[i]);
            i += matrix[0].length;
        }
        delta[x].reverse();
    }
    return delta;

}

function rotateTetromino() {

    const newMatrix = rotateMatrix(activeTetromino.matrix);

    if (!anyCollision(newMatrix)) {
        updateTetromino("empty");
        activeTetromino.matrix = newMatrix;
        updateTetromino("full");
    }
}

function lockTetromino() {
    for (let i = 0; i < activeTetromino.matrix.length; i++) {
        for (let j = 0; j < activeTetromino.matrix.length; j++) {
            if (activeTetromino.matrix[i][j] === 1) {

                gameBoard[i + activeTetromino.position.y][j + activeTetromino.position.x] = 1;

                const id =
                    'R' + (i + activeTetromino.position.y) +
                    'C' + (j + activeTetromino.position.x);

                document.getElementById(id).className = "locked";
            }
        }
    }

    checkRowFull();
    checkRowFull();
    checkRowFull();
    checkRowFull();



}


function anyCollision(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[j][i] == 1) {

                const newX = activeTetromino.position.x + i;
                const newY = activeTetromino.position.y + j;

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

    for (let row = gameBoard.length - 1; row > -1; row--) {

        let complete = true;

        for (let column = 0; column < gameBoard[row].length; column++) {
            if (gameBoard[row][column] == 0) {
                complete = false;
            }
        }

        if (complete) {

            console.log("full row found");

            for (let i = row; i > 1; i--) {
                for (let j = 0; j < gameBoard[i].length; j++) {

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
    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {
            if (gameBoard[i][j] == 1) {

                const id = 'R' + i + 'C' + j;

                document.getElementById(id).className = "locked";

            } else {

                const id = 'R' + i + 'C' + j;

                document.getElementById(id).className = "empty";
            }

        }
    }
}

const scoreBoard = document.getElementById("score");
const highScoreBoard = document.getElementById("highscore");


var storagedHighScore = localStorage.getItem("highscore");

highScoreBoard.innerHTML = parseInt(storagedHighScore);


let score = 0;

function resetGame() {


    if (storagedHighScore || score > parseInt(storagedHighScore)) {
        localStorage.setItem("highscore", score);

        storagedHighScore = localStorage.getItem("highscore");

    }


    score = 0;
    scoreBoard.innerHTML = score;

    clearInterval(game);



    for (let i = 0; i < gameBoard.length; i++) {
        for (let j = 0; j < gameBoard[i].length; j++) {

            gameBoard[i][j] = 0;

            const id = 'R' + i + 'C' + j;
            document.getElementById(id).className = "empty";

        }
    }

    generateTetromino();
}

document.addEventListener('keydown', control);


function control(event) {
    switch (event.keyCode) {
        case 37: //left move
            moveTetrominoHorizontal(-1);
            break;

        case 39: //right move
            moveTetrominoHorizontal(1);
            break;

        case 40: //down move
            gamestatus = 0;
            messageChange();
            moveTetrominoDown();
            break;

        case 38: //rotate move
            rotateTetromino();
            break;

        default:
            break;
    }
}

function pauseGame() {

    gamestatus = 1;
    messageChange();
    clearInterval(game);
}


function startGame() {

    clearInterval(game); //clear interval everytime user pressed start button.
    gamestatus = 0;
    messageChange();
    game = setInterval(moveTetrominoDown, 1000 / speed);

}

drawTable();
generateTetromino();



function messageChange() {
    switch (gamestatus) {
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