// load boards from file or manually
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
];
const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
];
const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
];

// create game variables
let timer;
let lives;
let timeRemaining;
let selectedNum;
let selectedTile;
let disableSelect;

window.onload = function () {
    // run startGame function when button is clicked
    id("start-btn").addEventListener("click", startGame);
    // add event listener to each number in number-container
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].addEventListener("click", function () {
            // if selecting is not disabled
            if (!disableSelect) {
                // if number is already selected, deselect it
                if (this.classList.contains("selected")) {
                    this.classList.remove("selected");
                    selectedNum = null;
                } else {
                    // deselect all other number
                    for (let i = 0; i < 9; i++) {
                        id("number-container").children[i].classList.remove("selected");
                    }
                    // select it and update selectedNum
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }
        });
    }
}

function startGame() {
    let board;
    // setup difficulty selection
    if (id("diff-1").checked) board = easy[0];
    else if (id("diff-2").checked) board = medium[0];
    else board = hard[0];
    // Set lives to 3 and enable selecting numbers and tiles
    lives = 3;
    disableSelect = false;
    id("lives").textContent = "Lives Remaining: 3";
    // create board based on difficulty
    generateBoard(board)
    // Start Timer
    startTimer();
    //Sets theme based on input
    if (id("theme-1").checked) {
        qs("body").classList.remove("dark");
    } else {
        qs("body").classList.add("dark");
    }
    // show number container
    id("number-container").classList.remove("hidden");
}

function startTimer() {
    // Set time remaining base on game setup
    if (id("time-1").checked) timeRemaining = 180;
    else if (id("time-2").checked) timeRemaining = 300;
    else timeRemaining = 600;
    // format time to use mm:ss instead of just counting down seconds
    id("timer").textContent = timeConversion(timeRemaining);
    // set timer to update every second
    timer = setInterval(function () {
        timeRemaining--;
        // check for timeout
        if (timeRemaining <= 0) endGame();
        id("timer").textContent = timeConversion(timeRemaining);
    }, 1000);
}

// converts time to mm:ss format
function timeConversion(time) {
    let minutes = Math.floor(time / 60);
    if (minutes < 10) minutes = "0" + minutes;
    let seconds = time % 60;
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

function generateBoard(board) {
    //clear previous board
    clearPrevious();
    // assign tile ids to each tile on board
    let idCount = 0;
    // create each tile
    for (let i = 0; i < 81; i++) {
        // create new paragraph element
        let tile = document.createElement("p");
        if (board.charAt(i) != "-") {
            // set tile to number value
            tile.textContent = board.charAt(i);
        } else {
            // add click eventListener to tile
            tile.addEventListener("click", function () {
                if (!disableSelect) {
                    // if tile is already selected, deselect it
                    if (tile.classList.contains("selected")) {
                        tile.classList.remove("selected");
                        selectedTile = null;
                    } else {
                        // deselect all other tiles
                        for (let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        // Add seletion and update variable
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            });
        }
        // assign tile id;
        tile.id = idCount;
        idCount++;
        // add tile class to each tile
        tile.classList.add("tile");
        // add 9x9 boards to board
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }
        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }
        // add tile to board
        id("board").appendChild(tile);
    }

};

function updateMove() {
    // if a tile and number is selected
    if (selectedTile && selectedNum) {
        // set tile to selected num
        selectedTile.textContent = selectedNum.textContent;
        // if selected num matches solution key
        if (checkCorrect(selectedTile)) {
            // deselect the tiles
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            // clear the select variables
            selectedNum = null;
            selectedTile = null;
            // check of board is complete
            if (checkDone()) {
                endGame();
            }
        } else {  // if selected num != to solution for tile
            // disable selecting new numbers for 1 second ?
            disableSelect = true;
            // make text on tile red
            selectedTile.classList.add("incorrect");
            setTimeout(function () {
                lives--;
                // if zero lives left, end game
                if (lives === 0) {
                    endGame();
                } else {
                    // update lives on screen
                    id("lives").textContent = "Lives Remaining: " + lives;
                    // reenable selecting number
                    disableSelect = false;
                }
                // restore tile color and remove selected from both 
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");
                // clear tiles text and clear select  vars
                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null;
            }, 1000);

        }
    }
}

function checkDone() {
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        if (tiles.textContent === "") return false;
    }
    return true;
}

function endGame() {
    // disable selection
    disableSelect = true;
    clearTimeout(timer);
    // display win or loss msg
    if (lives === 0 || timeRemaining === 0) {
        id("lives").textContent = "You LOOOOOOSE!";
    } else {
        id("lives").textContent = "You WIN!!!!!";
    }
}

function checkCorrect(tile) {
    let solution;
    // set solution basd on difficuly selection
    if (id("diff-1").checked) solution = easy[1];
    else if (id("diff-2").checked) solution = medium[1];
    else solution = hard[1];
    // if tile's number is same as solution number
    if (solution.charAt(tile.id) === tile.textContent) return true;
    else return false;
}


function clearPrevious() {
    let tiles = qsa(".tile");
    // remove each tile
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }
    // clear timer
    if (timer) clearTimeout(timer);
    // Deselect any number
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected=");
    }
    // clear selected variables
    selectedTile = null;
    selectedNum = null;

}

// Helper Functions

function id(id) {
    return document.getElementById(id);
}

function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}