'use strict'
//change hero not work 5.8 04:17 -last version 
var gHero
const LASER_SPEED = 80
const HERO = 'HERO'
var HERO_IMG = '<img class="icon" src="photos/superhero.png">'
var BOARD_SIZE = 14
var gScore = 0
var gIdShootInterval = 0
var gPos = { i: 0, j: 0 }
var gMiddleLocationHero = Math.floor(BOARD_SIZE / 2)
function createHero(board) {
  
    gHero = {
        location: {
            i: BOARD_SIZE - 2,
            j: gMiddleLocationHero - 1
        },
        isShoot: false,
        isBlowUp:false
    }
    board[BOARD_SIZE - 2][gMiddleLocationHero - 1].gameObject = HERO
}

function moveTo(i, j) {
    if (!gGame.isOn) return
    if (j < 0 || j >= BOARD_SIZE) return
    var prevObject = gBoard[i][j]
    handleCandleHit(prevObject)
    gBoard[gHero.location.i][gHero.location.j].gameObject = null
    updateCell(gHero.location, '')
    gHero.location.i = i
    gHero.location.j = j
    gBoard[gHero.location.i][gHero.location.j].gameObject = HERO
    updateCell(gHero.location, HERO_IMG)
}


function onHandleKey(event) {
    if (!gGame.isOn) return
    const i = gHero.location.i
    const j = gHero.location.j
    console.log('event', event.key)
    switch (event.key) {
        case 'ArrowLeft':
            moveTo(i, j - 1)
            break
        case 'ArrowRight':
            moveTo(i, j + 1)
            break
        case ' ':
            shoot()
        case 'n':
            if(gHero.isShoot){
                gHero.isBlowUp=true
                blowUpNeighbors()
            }
           
    }
}


function shoot() {
    if (gHero.isShoot) return
    gHero.isShoot = true
    gPos.i = gHero.location.i - 1
    gPos.j = gHero.location.j
    playSound('shotS')
    gIdShootInterval = setInterval(blinkLaser, 80)

}

function blinkLaser(pos) {
    if (!gHero.isShoot) return
    if (gPos.i < 0) {
        clearInterval(gIdShootInterval)
        gHero.isShoot = false
        return
    }
    if (gBoard[gPos.i][gPos.j].gameObject === ALIEN) {
        updateCell(gPos, '')
        updateCell(gPos, LASER_IMG)
        gScore += 10
        gCountAliens--
        updateScore(gScore)
        if (gCountAliens === 0) isVictory()
        console.log('gcountAliens', gCountAliens)
        clearInterval(gIdShootInterval)
        gHero.isShoot = false
        return
    }
    updateCell(gPos, LASER_IMG)
    setTimeout(() => {
        if (gBoard[gPos.i][gPos.j].gameObject === '❗') updateCell(gPos, '')
        gPos.i = gPos.i - 1
    }, 500);
}



function blowUpNeighbors() {
    //debugger
    for (var i = gPos.i - 1; i <= gPos.i + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue
        for (var j = gPos.j - 1; j <= gPos.j + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue
            if (i === gPos.i && j === gPos.j) continue
            if (gBoard[i][j].gameObject === ALIEN) {
                if(gHero.isShoot) laserStop()
                gCountAliens--
                gScore+=10
                //shoot()
                updateScore(gScore)
                updateCell({ i: i, j: j })
              
            }
        }
    }
 
}
function laserStop(){
    updateCell(gPos) //not sure 
    gHero.isShoot=false
    clearInterval(gIdShootInterval)
    if(gHero.isBlowUp) gHero.isBlowUp=false

}

