const playerFactory = (symbol, name) => {

    const getSymbol = () => {
        return symbol;
    } 

    const getName = () => {
        return name;
    } 

    return {getSymbol, getName};
}

const gameBoard = () => {
    const _gameGrid = [];

    const _visualSquarePlayed = (target, playerValue) => {
        let targetSquare = document.querySelector(`.boardSquare:nth-child(${target})`);
        targetSquare.textContent = playerValue;

    }
    
    const getSquare = (target) => { return _gameGrid[target]; };
    const setSquare = (target, playerValue) => { 
        _gameGrid[target] = playerValue;
        _visualSquarePlayed(target);
        
    };

    const checkWin = (player1, player2) => {
        if (_gameGrid[1] === _gameGrid[2] === _gameGrid[3] === 1 ||
        _gameGrid[4] === _gameGrid[5] === _gameGrid[6] === 1 ||
        _gameGrid[7] === _gameGrid[8] === _gameGrid[9] === 1 ||
        _gameGrid[1] === _gameGrid[4] === _gameGrid[7] === 1 ||
        _gameGrid[2] === _gameGrid[5] === _gameGrid[8] === 1 ||
        _gameGrid[3] === _gameGrid[6] === _gameGrid[9] === 1 ||
        _gameGrid[1] === _gameGrid[5] === _gameGrid[9] === 1 ||
        _gameGrid[3] === _gameGrid[5] === _gameGrid[7] === 1 ) {
            // Increment player1 wins by 1
            player1.setWins(player1.getWins()+1);
            return true;
        } else if (_gameGrid[1] === _gameGrid[2] === _gameGrid[3] === 2 ||
        _gameGrid[4] === _gameGrid[5] === _gameGrid[6] === 2 ||
        _gameGrid[7] === _gameGrid[8] === _gameGrid[9] === 2 ||
        _gameGrid[1] === _gameGrid[4] === _gameGrid[7] === 2 ||
        _gameGrid[2] === _gameGrid[5] === _gameGrid[8] === 2 ||
        _gameGrid[3] === _gameGrid[6] === _gameGrid[9] === 2 ||
        _gameGrid[1] === _gameGrid[5] === _gameGrid[9] === 2 ||
        _gameGrid[3] === _gameGrid[5] === _gameGrid[7] === 2 ) {
            // Increment player2 wins by 1
            player2.setWins(player2.getWins()+1);
            return true;
        }

        return false;
    }

    const wipeBoard = () => {
        _gameGrid = [];
    }

    return { getSquare, setSquare, checkWin, wipeBoard };
}



const gameController = () => {

    const _hideObject = (target) => {
        target.classList.add('hide');
    }
    const _unHideObject = (target) => {
        target.classList.remove('hide');
    }

    const _initializePlayers = (form, player1, player2) => {
        
        /* Create a player object for both players, and use the names
        entered in the form */
        player1 = playerFactory('x', form.elements['player1Name'].value)
        player2 = playerFactory('o', form.elements['player2Name'].value)

        // Make a variable for the display of each player
        const p1Display = document.querySelector('.p1');
        const p2Display = document.querySelector('.p2');

        /* Set the name displays to the player's names. */
        p1Display.querySelector('.name').textContent = player1.getName();
        p2Display.querySelector('.name').textContent = player2.getName();

        // Remove the win class from all win indicators
        document.querySelectorAll('.won').forEach(element => element.classList.remove('won'));

        // Display the player displays
        _unHideObject(p1Display);
        _unHideObject(p2Display);
    }

    const runGame = () => {
        const playButton = document.querySelector('.play.buttons');
        const form = document.querySelector('form');
        const player1 = null;
        const player2 = null;
        // Hide the button after it's been pressed
        _hideObject(playButton);
        _unHideObject(form);
        
        form.addEventListener('submit', function(event) {
            // Stop from refreshing the page
            event.preventDefault();
            /* Generate the two players */
            _initializePlayers(form, player1, player2)

            //Reset the form and then hide it
            form.reset();
            _hideObject(form);
        });



    }

    return {runGame};
}

const gameInstance = gameController();

document.querySelector('.play.buttons').addEventListener('click', gameInstance.runGame);