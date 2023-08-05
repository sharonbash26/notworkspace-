'use strict'

const ALIEN_SPEED = 500
var gCountAliens = 0
var gIsAlienFreeze = false
var gIntervalAliens


var gAliensTopRowIdx = 0
var gAliensBottomRowIdx = 2

function shiftBoardRight(board, fromI, toI) {
    if (gIsAlienFreeze) return
    if (isAlienInRightWall(board)) {
        clearInterval(gIntervalAliens)
        shiftBoardDown(board, gAliensTopRowIdx, gAliensBottomRowIdx)
    } else {
        for (var i = fromI; i <= toI; i++) {
            for (var j = board[0].length - 1; j >= 0; j--) {
                if (j === 0) updateCell({ i, j })
                else {
                    var lastCellObj = board[i][j - 1].gameObject
                    if (lastCellObj === LASER) handleHitInAlien({ i, j })
                    if (lastCellObj === ALIEN) updateCell({ i, j }, ALIEN_IMG)
                    else if (lastCellObj === null) updateCell({ i, j })
                }
            }
        }
    }
}

function shiftBoardLeft(board, fromI, toI) {
    if (gIsAlienFreeze) return
    if (isAlienInLeftWall(board)) {
        clearInterval(gIntervalAliens)
        shiftBoardDown(board, gAliensTopRowIdx, gAliensBottomRowIdx)
    } else {
        for (var i = fromI; i <= toI; i++) {
            for (var j = 0; j < board.length; j++) {
                if (j === board[0].length - 1) updateCell({ i: i, j: j })
                else {
                    var nextCell = board[i][j + 1].gameObject
                    if (nextCell === ALIEN) {
                        updateCell({ i: i, j: j }, ALIEN_IMG)
                    }
                    if (nextCell === null) updateCell({ i: i, j: j })
                    updateCell({ i: i, j: j + 1 })
                    if (gPos === { i: i, j: j }) handleHitInAlien({ i: i, j: j })

                }
            }
        }
    }
}
//

//צריך לחשוב על מקרי קצה כשזה מחוץ לטבלה
function shiftBoardDown(board, fromI, toI) {
    // debugger
    if (gIsAlienFreeze) return
    clearInterval(gIntervalAliens)
    if (gAliensBottomRowIdx + 1 === gHero.location.i) {
        gameOver()
        return
    }
    for (var i = toI + 1; i >= fromI; i--) {
        for (var j = 0; j < board[0].length; j++) {
            if (i === 0 || i === fromI) updateCell({ i, j })
            else {
                var cellAboveObj = board[i - 1][j].gameObject
                if (cellAboveObj === ALIEN) {
                    if (i === gAliensTopRowIdx) updateCell({ i, j }, ALIEN_IMG)
                    if (i === gAliensTopRowIdx + 1) updateCell({ i, j }, ALIEN_IMG)
                    if (i === toI + 1) updateCell({ i, j }, ALIEN_IMG)
                }
                else if (cellAboveObj === null) updateCell({ i, j })
            }
        }
    }
    updateAliensRowIdx()
    var direction=isAlienInRightWall(gBoard)? shiftBoardLeft:shiftBoardRight
    gIntervalAliens=setInterval(direction,ALIEN_SPEED,gBoard,gAliensTopRowIdx,gAliensBottomRowIdx)
}
function moveAliens() {
   gIntervalAliens = setInterval(shiftBoardRight,ALIEN_SPEED,gBoard,gAliensTopRowIdx,gAliensBottomRowIdx)
}

function updateAliensRowIdx() {
    for (var i = 0; i < gBoard.length; i++) {
        if (isAlienInRow(gBoard[i])) {
            gAliensTopRowIdx = i
            break
        }
    }
    for (var i = gBoard.length - 1; i >= 0; i--) {
        if (isAlienInRow(gBoard[i])) {
            gAliensBottomRowIdx = i
            break
        }
    }
}

function isAlienInRow(row) {
    var rowObjects = []
    for (var j = 0; j < row.length; j++) {
        rowObjects.push(row[j].gameObject)
    }
    if (rowObjects.includes(ALIEN)) return true
    return false
}

function freezAliens() {
    if (!gIsAlienFreeze) return
    setTimeout(() => {
        return
    }, 5000);
}

function isAlienInRightWall(board) {
    for (var i = 0; i < board.length; i++) {
        if (board[i][board.length - 1].gameObject === ALIEN) return true
    }
    return false
}

function isAlienInLeftWall(board) {
    for (var i = 0; i < board.length; i++) {
        if (board[i][0].gameObject === ALIEN) return true
    }
    return false
}

function handleHitInAlien(pos) {
    laserStop()
    gCountAliens--
    gScore += 10
    updateScore(gScore)
    if (gCountAliens === 0) isVictory()
    else if (!isAlienInRow(gBoard[pos.i])) updateAliensRowIdx()

}