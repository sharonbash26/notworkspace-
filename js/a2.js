'use strict'

const ALIEN_SPEED = 500
const ROCK_SPEED = 700
var gIntervalAliens
var gAliensTopRowIdx=0
var gAliensBottomRowIdx=2
var gIsAlienFreeze
var gRockPos
var gBlinkRockInterval


var gCountAliens = 0


function handleAlienHit(pos) {
    stopLaser()
    gCountAliens--
    gScore += 10           
    updateScore(gScore)
    if (gCountAliens=== 0) isVictory()
    else if (!isRowHasAlien(gBoard[pos.i])) updateAlienRowIdxs()
}

function shiftBoardRight(board, fromI, toI) {

 
    if (gIsAlienFreeze) return
    if (isAliensReachedRightWall(board)) {
        clearInterval(gIntervalAliens)
        shiftBoardDown(board, gAliensTopRowIdx, gAliensBottomRowIdx)
    } else {
        for (var i = fromI; i <= toI; i++) {
            for (var j = board[0].length - 1; j >= 0; j--) {
                if (j === 0) updateCell({ i:i,j:j })
                else {
                    var lastCellObj = board[i][j - 1].gameObject
                    if (lastCellObj === LASER) handleAlienHit({ i, j })
                    if (lastCellObj === ALIEN) updateCell({ i, j }, ALIEN_IMG)
                    else if (lastCellObj === null) updateCell({ i, j })
                }
            }
        }
    }
}

function shiftBoardLeft(board, fromI, toI) {
    if (gIsAlienFreeze) return
    if (isAliensReachedLeftWall(board)) {
        clearInterval(gIntervalAliens)
        shiftBoardDown(board, gAliensTopRowIdx, gAliensBottomRowIdx)
    } else {
        for (var i = fromI; i <= toI; i++) {
            for (var j = 0; j < board[0].length; j++) {
                if (j === board[0].length - 1) updateCell({ i, j })
                else {
                    var nextCellObj = board[i][j + 1].gameObject
                    if (gLaserPos === { i, j }) handleAlienHit({ i, j })
                    if (nextCellObj === ALIEN) updateCell({ i, j }, ALIEN_IMG)
                    else if (nextCellObj === null) updateCell({ i, j })
                }

            }
        }
    }
}

function shiftBoardDown(board, fromI, toI) {
    if (gIsAlienFreeze) return
    clearInterval(gIntervalAliens)
    if (gAliensBottomRowIdx + 1 === gHero.pos.i) {
        gameOver()
        return
    }
    else {
        for (var i = toI + 1; i >= fromI; i--) {
            for (var j = 0; j < board[0].length; j++) {
                if (i === 0 || i === fromI) updateCell({ i, j })
                else {
                    var cellAboveObj = board[i - 1][j].gameObject
                    if (cellAboveObj === ALIEN) updateCell({ i, j }, ALIEN_IMG)
                    else if (cellAboveObj === null) updateCell({ i, j })
                }
            }
        }
        updateAlienRowIdxs()

        var func = (isAliensReachedRightWall(gBoard)) ? shiftBoardLeft : shiftBoardRight
        gIntervalAliens = setInterval(func, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
    }
}

function moveAliens() {
    gIntervalAliens = setInterval(shiftBoardRight, ALIEN_SPEED, gBoard, gAliensTopRowIdx, gAliensBottomRowIdx)
}



function isAliensReachedRightWall(board) {
    for (var i = 0; i < board.length; i++) {
        if (board[i][board.length - 1].gameObject === ALIEN) return true
    }
    return false
}

function isAliensReachedLeftWall(board) {
    for (var i = 0; i < board.length; i++) {
        if (board[i][0].gameObject === ALIEN) return true
    }
    return false
}

function updateAlienRowIdxs() {
    for (var i = 0; i < gBoard.length; i++) {
        if (isRowHasAlien(gBoard[i])) {
            gAliensTopRowIdx = i
            break
        }
    }
    for (var i = gBoard.length - 1; i >= 0; i--) {
        if (isRowHasAlien(gBoard[i])) {
            gAliensBottomRowIdx = i
            break
        }
    }
}

function isRowHasAlien(row) {
    var rowObjects = []
    for (var j = 0; j < row.length; j++) {
        rowObjects.push(row[j].gameObject)
    }
    if (rowObjects.includes(ALIEN)) return true
    else return false
}




