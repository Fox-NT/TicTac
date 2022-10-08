const restart = document.querySelector('.restart__btn');
const scorePlayer1 = document.querySelector('.score__player--1');
const scorePlayer2 = document.querySelector('.score__player--2');
const namePlayer1 = document.querySelector('.score__player--name1');
const namePlayer2 = document.querySelector('.score__player--name2');
const cell = document.querySelectorAll('.table__cell');

let game = {
    WinningCells: [[0, 1, 2],
                   [0, 4, 8],
                   [0, 3, 6],
                   [1, 4, 7],
                   [2, 5, 8],
                   [2, 4, 6],
                   [3, 4, 5],
                   [6, 7, 8]],
    info: {
        player1: {
            name: 'Игрок 1',
            score: 0,
            cells: []
        },
        player2: {
            name: 'Игрок 2',
            score: 0,
            cells: []
        }
    },
    settings: {
        player1: {
            style: 'player1Mark',
            symbol: 'X',
            key: false,

        },
        player2: {
            style: 'player2Mark',
            symbol: 'O',
            key: true,

        }
    }
}


let key = true;

for (let i = 0; i < cell.length; i++) {
    cell[i].addEventListener('click', e => {
        e.preventDefault();
        if (key === true) {
            draw(cell[i], game.settings.player1, game.info.player1, i);
            getWinning(game.info.player1);
            noMore()
        } else {
            draw(cell[i], game.settings.player2, game.info.player2, i);
            getWinning(game.info.player2);
            noMore()
        }
    })
}

function draw(item, player, score, i) {
    if (item.outerText == 0) {
        item.innerHTML = player.symbol;
        item.classList.add(player.style)
        key = player.key;
        score.cells.push(i);
    } else if (item.outerText !=0) {
        Swal.fire({
            title: 'Стоп!',
            text: 'Куда ты тыкаешь? Ячейка занята',
            icon: 'error',
            confirmButtonText: 'Извини',
            background: '#262c37',
            color: '#fff'
        })
    }
}

function noMore() {
    if (game.info.player1.cells.length == 5 && game.info.player2.cells.length == 4) {
        let timerInterval
        Swal.fire({
            title: 'Ничья!',
            html: 'Ходов больше нет. Игра перезапутсится через <b></b> миллисекунд.',
            timer: 5000,
            timerProgressBar: true,
            background: '#262c37',
            color: '#fff',
            didOpen: () => {
                Swal.showLoading()
                const b = Swal.getHtmlContainer().querySelector('b')
                timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                }, 100)
            },
            willClose: () => {
                clearInterval(timerInterval)
                restartGame();
            }
        })
    }
}


function getWinning(player) {
    game.WinningCells.find((item) => {
        if (item.filter((i) => player.cells.includes(i)).length === 3) {
            player.score++;
            Swal.fire({
                title: 'Победа!',
                text: `Поздравляем c победой! ${player.name} победил в этом жестоком бою.`,
                imageUrl: 'main/cong.gif',
                imageWidth: 100,
                imageHeight: 100,
                imageAlt: 'Поздравляем',
                confirmButtonText: 'Начать новый раунд',
                color: '#64ad54',
                width: 600,
                padding: '3em',
                backdrop: `
             rgba(0,0,123,0.4)
             url("main/nyan-cat.gif")
             left top
             no-repeat
  `
            })
            restartGame()
        }
    })
}

function updateScore() {
    scorePlayer1.innerHTML = game.info.player1.score;
    scorePlayer2.innerHTML = game.info.player2.score;
}

function restartGame() {

    game.info.player1.cells = [];
    game.info.player2.cells = [];
    key = true;
    for (const item of cell) {
        item.innerHTML = '';
        item.classList.remove('player2Mark')
        item.classList.remove('player1Mark')
    }
    updateScore();
}

restart.addEventListener('click', () => {
    Swal.fire({
        title: 'Вы точно хотите перезапустить?',
        text: "Игра полностью сбросится. Все начнется сначала.",
        icon: 'warning',
        showCancelButton: true,
        cancelButtonText: 'Отмена',
        confirmButtonColor: '#33811d',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Перезапустить',
        background: '#262c37',
        color: '#fff',

    }).then((result) => {
        if (result.isConfirmed) {
            game.info.player1.score = 0;
            game.info.player2.score = 0;
            restartGame();
        }
    })
})

function start() {
    Swal.fire({
        title: 'Введите имя первого игрока:',
        icon: 'question',
        input: 'text',
        background: '#262c37',
        color: '#fff',
        inputPlaceholder: 'Введине имя игрока',
    }).then((item) => game.info.player1.name = item.value).then(() => {
        Swal.fire({
            title: 'Введите имя второго игрока:',
            icon: 'question',
            background: '#262c37',
            color: '#fff',
            input: 'text',
            inputPlaceholder: 'Введине имя игрока',
        }).then((item) => game.info.player2.name = item.value).then(()=> {
            namePlayer1.innerHTML = game.info.player1.name;
            namePlayer2.innerHTML = game.info.player2.name;})
    })

}

start();