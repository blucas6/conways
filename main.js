const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
const nextBtn = document.getElementById('step')
const goBtn = document.getElementById('go')
const stopBtn = document.getElementById('stop')
const res = document.getElementById('res')
const randomBtn = document.getElementById('random')
const clearBtn = document.getElementById('clear')
const genTxt = document.getElementById('gen')

let width = 1200
let height = 660
let grid
let next
let cols
let rows
let resolution = 60
let speed = 70
let on = false
let gen = -1

setup(0)
draw()

canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / resolution)
    const y = Math.floor((e.clientY - rect.top) / resolution)
    if(grid[y][x]) {
        grid[y][x] = 0
        ctx.clearRect(x*resolution, y*resolution, resolution, resolution)
    } else {
        grid[y][x] = 1
        ctx.fillRect(x*resolution, y*resolution, resolution-1, resolution-1)
    }
})

nextBtn.addEventListener('click', () => {
    draw()
})
goBtn.addEventListener('click', () => {
    if(on == false) {
        go = setInterval(draw, speed)
        on = true
    }
})
stopBtn.addEventListener('click', () => {
    clearInterval(go)
    on = false
})
res.addEventListener('input', () => {
    let arr = [1, 2, 3, 4, 5, 6, 10, 12, 15, 20, 30, 60]
    if(Number.isInteger(width / arr[res.value]) && Number.isInteger(height / arr[res.value])) {
        resolution = arr[res.value]
    }
    gen = -1
    setup(1)
    draw()
})
randomBtn.addEventListener('click', () => {
    gen = -1
    setup(1)
    draw()
})
clearBtn.addEventListener('click', () => {
    gen = -1
    ctx.clearRect(0, 0, width, height)
    setup(0)
})

function setup(flag) {
    canvas.setAttribute('width', width)
    canvas.setAttribute('height', height)
    cols = width / resolution
    rows = height / resolution
    grid = make2DArray()
    next = make2DArray()
    for(let i=0; i<rows; i++) {
        for(let j=0; j<cols; j++) {
            if(flag) {
                grid[i][j] = getRandomInt(2)
                next[i][j] = 0
            } else {
                grid[i][j] = 0
                next[i][j] = 0
            }
        }
    }
}

function draw() {
    gen++
    genTxt.innerText = "Generations: "+gen
    ctx.clearRect(0, 0, width, height)
    // render
    for(let i=0; i<rows; i++) {
        for(let j=0; j<cols; j++) {
            let x = i * resolution
            let y = j * resolution
            if(grid[i][j] == 1) {
                ctx.fillStyle = 255
                ctx.fillRect(y, x, resolution-1, resolution-1)
            }
        }
    }
    // compute
    next = make2DArray(cols, rows)
    for(let i=0; i<rows; i++) {
        for(let j=0; j<cols; j++) {
            let state = grid[i][j]
            // count live neighbours
            let neighbours = count(grid, i, j)
            if(state == 0 && neighbours == 3) {
                next[i][j] = 1;
            } else if(state == 1 && (neighbours < 2 || neighbours >  3)) {
                next[i][j] = 0
            } else {
                next[i][j] = state
            }
        }
    }
    if(check(grid, next)) {
        clearInterval(go)
        on = false
    }
    grid = next
}

function check(grid, next) {
    for(let i=0; i<rows; i++) {
        for(let j=0; j<cols; j++) {
            if(grid[i][j] != next[i][j]) {
                return false
            }
        }
    }
    return true
}

function count(grid, i, j) {
    let sum = 0
    for(let x=-1; x<2; x++) {
        for(let y=-1; y<2; y++) {
            if(i+x >= 0 && j+y >= 0 && i+x < rows && j+y < cols) {
                sum += grid[i+x][j+y]
            }
        }
    }
    sum -= grid[i][j]
    return sum
}

function make2DArray() {
    console.log(rows, cols)
    let arr = new Array(rows)
    for(let i=0; i<arr.length; i++) {
        arr[i] = new Array(cols)
    }
    return arr
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

