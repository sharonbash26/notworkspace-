'use strict'

var BOARD_SIZE = 14
const ALIEN_ROW_LENGTH = 8
const ALIEN_ROW_COUNT = 3


const ALIEN = 'ALIEN'
const LASER = 'LASER'
const GROUND = 'GROUND'
const SKY = 'SKY'
const CANDY = 'CANDY'



const GROUND_IMG = '🟫'
const ALIEN_IMG = '👽'

const HERO_IMG2 = '<img class="icon" src="heros/1.png">'
const LASER_IMG = '❗'
const CANDY_IMG = '🍬'

var gScore = 0
var gCountLives = 3
// Matrix of cell objects. e.g.: {type: SKY, gameObject: ALIEN}
var gBoard
////!!!! not forget to delete all inteval when lose and game over ////
var gIdCandyInterval = 0
var gIdCandyTimeout = 0

var gGame = {
    isOn: false,
    alienCount: 0
}

function onInit() {
    gBoard = createBoard(BOARD_SIZE)
    createHero(gBoard)
    console.table(gBoard)
    renderBoard(gBoard)
    clearInterval(gIdCandyInterval)
   
   // shiftBoardLeft(gBoard,0,2)
  // shiftBoardRight(gBoard,0,2)
}
function startGame() {
    if(gGame.isOn) return
    gGame.isOn = true
    // playSound('start')
    gIdCandyInterval = setInterval( spaceCandies ,10000)
    moveAliens()
  
  //  console.log('shift left old gborad', gBoard)
   // console.log('shift left new board', shiftBoardDown(gBoard, 0, 2))

}

function createCell(gameObject = null) {
    return {
        type: SKY,
        gameObject: gameObject
    }
}

function createBoard(size) {
    var board = []
    for (var i = 0; i < size; i++) {
        board[i] = []
        for (var j = 0; j < size; j++) {
            board[i][j] = { type: SKY, gameObject: null }
            if (i === size - 1) {
                board[i][j].type = GROUND
            }
        }
    }
    board = putAliensInBoard(size, board)
    return board
}

function putAliensInBoard(size, board) {
    for (var i = 0; i < ALIEN_ROW_COUNT; i++) {
        for (var j =0 ; j < ALIEN_ROW_LENGTH;j++) {
            board[i][j].gameObject = ALIEN
            gCountAliens++
        }
    }
    return board
}

function updateScore(count) {
    var elScore = document.querySelector('h4 span')
    elScore.innerText = count
}

function isVictory() {
    var msgModal = 'You Win!'
    playSound('claps')
    openModal(msgModal)
    clearInterval(gIdShootInterval)
    clearInterval(gIdCandyInterval)
    clearInterval(gIdCandyTimeout)
    gGame.isOn = false
}
function gameOver(){
    var msgModal='Game Over!'
    playSound('lozer')
    openModal(msgModal)
    clearInterval(gIdShootInterval)
    clearInterval(gIdCandyInterval)
    clearInterval(gIdCandyTimeout)
    gGame.isOn = false

}

function restart() {
    closeModal()
    gScore = 0
    updateScore(gScore)
    gCountAliens = 0
    clearInterval(gIdShootInterval)
    clearInterval(gIdCandyInterval)
    clearInterval(gIdCandyTimeout)
    onInit()
}

function spaceCandies() {
    var randomJ = getRandomIntInclusive(0, BOARD_SIZE - 1)
    if (gBoard[BOARD_SIZE - 2][randomJ].gameObject === HERO) {
        randomJ = getRandomIntInclusive(0, BOARD_SIZE - 1)
    } else {
        gBoard[BOARD_SIZE - 2][randomJ].gameObject = CANDY
        updateCell({ i: BOARD_SIZE - 2, j: randomJ }, CANDY_IMG)
        gIdCandyTimeout = setTimeout(() => {
            gBoard[BOARD_SIZE - 2][randomJ].gameObject = null
            updateCell({ i: BOARD_SIZE - 2, j: randomJ }, '')
        }, 5000);
    }
}

function handleCandleHit(prevItem) {
    if (prevItem.gameObject === '🍬') {
        gScore += 50
        updateScore(gScore)
    }
}

const mainButton = document.querySelector('.mainButton');
const subButtons = document.querySelector('.subButtons');

mainButton.addEventListener('click', () => {
    subButtons.classList.toggle('show')
})


var gCurrBackgroundIdx = 0
var gCurrHeroIdx = 0
const backgrounds = [
    'url("photos/g1.gif")',
    'url("photos/g2.gif")',
    'url("photos/g3.gif")',
    'url("photos/g4.gif")',
    'url("photos/giphy.gif")',
]

const heros = [
    'url("heros/1.png")',
    'url("heros/2.png")',
]

function chooseTheme() {
    const body = document.querySelector('body')
    gCurrBackgroundIdx = (gCurrBackgroundIdx + 1) % backgrounds.length
    body.style.backgroundImage = backgrounds[gCurrBackgroundIdx]
}
var gIsHeroIconChange = false
function chooseHero() {
    gIsHeroIconChange = true
    if (gGame.isOn) 
    {
        alert('You can not change Hero when game is on!')
        return
    }
    gCurrHeroIdx = (gCurrHeroIdx + 1) % heros.length;
    var HERO_IMG = heros[gCurrHeroIdx];
    HERO_IMG = `<img class="icon" src="${HERO_IMG}">`;
    updateCell({ i: BOARD_SIZE - 2, j: gMiddleLocationHero - 1 }, HERO_IMG);
    return HERO_IMG
}
