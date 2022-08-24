const playerFactory = (symbol, name, wins) => {
    // Initialize wins to 0 for each new player
    wins = 0;

    /* Getter and setters abstract direct access to functions
    from the rest of the program */
    const getSymbol = () => {
        return symbol;
    } 
    const getName = () => {
        return name;
    }
    const getWins = () => {
        return wins;
    } 
    const setWins = (value) => {
        wins = value;
    }

    return {getSymbol, getName, getWins, setWins};
}

const gameBoard = () => {
    // Didn't make it const because it's easier to wipe when reassigned
    let _gameGrid = [];

    // Visually update when a grid cell is set to a player
    const _visualSquarePlayed = (target, playerSymbol) => {
        // Select target square using unique ID
        let targetSquare = document.querySelector(`.boardSquare:nth-child(${target})`);
        targetSquare.textContent = playerSymbol;
    }
  
    const getSquare = (target) => { return _gameGrid[target]; };

    // Updates it visually and in the grid
    const setSquare = (target, playerSymbol) => { 
        _gameGrid[target] = playerSymbol;
        _visualSquarePlayed(target, playerSymbol);
    };

    /* Manually ches for every possible 3 in a row for player 1 and 2.
    There's probably a better way of doing this but I don't know how. */
    const checkWin = () => {
        if ((_gameGrid[1] === 'x' && _gameGrid[2] === 'x' && _gameGrid[3] === 'x') ||
        (_gameGrid[4] === 'x' && _gameGrid[5] === 'x' && _gameGrid[6] === 'x') ||
        (_gameGrid[7] === 'x' && _gameGrid[8] === 'x' && _gameGrid[9] === 'x') ||
        (_gameGrid[1] === 'x' && _gameGrid[4] === 'x' && _gameGrid[7] === 'x') ||
        (_gameGrid[2] === 'x' && _gameGrid[5] === 'x' && _gameGrid[8] === 'x') ||
        (_gameGrid[3] === 'x' && _gameGrid[6] === 'x' && _gameGrid[9] === 'x') ||
        (_gameGrid[1] === 'x' && _gameGrid[5] === 'x' && _gameGrid[9] === 'x') ||
        (_gameGrid[3] === 'x' && _gameGrid[5] === 'x' && _gameGrid[7] === 'x') ) {
            // return player 1 won
            return 1;
        } else if ((_gameGrid[1] === 'o' && _gameGrid[2] === 'o' && _gameGrid[3] === 'o') ||
        (_gameGrid[4] === 'o' && _gameGrid[5] === 'o' && _gameGrid[6] === 'o') ||
        (_gameGrid[7] === 'o' && _gameGrid[8] === 'o' && _gameGrid[9] === 'o') ||
        (_gameGrid[1] === 'o' && _gameGrid[4] === 'o' && _gameGrid[7] === 'o') ||
        (_gameGrid[2] === 'o' && _gameGrid[5] === 'o' && _gameGrid[8] === 'o') ||
        (_gameGrid[3] === 'o' && _gameGrid[6] === 'o' && _gameGrid[9] === 'o') ||
        (_gameGrid[1] === 'o' && _gameGrid[5] === 'o' && _gameGrid[9] === 'o') ||
        (_gameGrid[3] === 'o' && _gameGrid[5] === 'o' && _gameGrid[7] === 'o') ) {
            // return player 2 won
            return 2;
        } else if (_gameGrid[1] && _gameGrid[2] && _gameGrid[3] &&
            _gameGrid[4] && _gameGrid[5] && _gameGrid[6] && _gameGrid[7] &&
            _gameGrid[8] && _gameGrid[9] !== undefined) {
            return 'tie';
        }

        return false;
    }

    // Wipe the grid visually and in storage
    const wipeBoard = () => {
        // Empty the grid storage
        _gameGrid = [];
        // Empty the text on the display
        document.querySelectorAll('.boardSquare')
                .forEach(element => element.textContent = '');
    }

    return { getSquare, setSquare, checkWin, wipeBoard };
}



const gameController = () => {

    /* These functions will be re-used frequently and just make the other code
    a bit cleaner */
    const _hideObject = (target) => {
        target.classList.add('hide');
    }
    const _unHideObject = (target) => {
        target.classList.remove('hide');
    }

    /* Final function that will be called. Only used when a player
    reached 5 wins and ends the game. */
    const _displayWinner = (player, playerNo, turnDisplay) => {
        // Let the user know the game's over, and make text larger to emphasize
        turnDisplay.textContent = `Game Over! ${player.getName()} WINS!!!`;
        turnDisplay.classList.add('biggerDisplay');
        /* Add bigWon class to the scoreboard indicators. Makes them green */
        document.querySelectorAll(`.p${playerNo} .won`)
                .forEach(element => element.classList.add('bigWon'));
    }

    /* Called each time a player wins a round */
    const _updateWinner = (winner, winNum, turnDisplay) => {
        // Display winner above the game board
        turnDisplay.textContent = `${winner.getName()} WON!`;
        // Update player object's wins property
        winner.setWins(winner.getWins()+1);
        // Update winner's visual scoreboard
        document.querySelector(`.p${winNum} .indicator:nth-child(${winner.getWins()}`)
                .classList.add('won');
    }

    /* After someone wins a round, this will be called to wipe everything clean and
    initialize a new round */

    const _newGame = (board, player1, player2, turnDisplay, playAgainButton, that) => {
        // We don't want the play again button showing during gameplay
        _hideObject(playAgainButton);

        /* Reset the board's storage and visuals, reset turn array to be empty
        so it starts on player 1's turn */
        board.wipeBoard();
        let turn = [];
        // Let player 1 know it's their turn again
        turnDisplay.textContent = `${player1.getName()}'s turn!`;

        /* Remove all event listeners on the grid cells and add 1 back on each.
        This makes sure there is 1 and ONLY 1 event listener on each cell */
        let boardSquare = document.querySelectorAll('.boardSquare');
        boardSquare.forEach(element => element.replaceWith(element.cloneNode(true)));
        /* (have to re-define because they were replaced) */
        boardSquare = document.querySelectorAll('.boardSquare');
        boardSquare.forEach(element => element.addEventListener('click', _playTurn.bind(null, turn, board, player1, player2, turnDisplay)));
    }

    const _initializePlayers = (form) => {
        /* Create a player object for both players, and use the names
        entered in the form */
        const player1 = playerFactory('x', form.elements['player1Name'].value)
        const player2 = playerFactory('o', form.elements['player2Name'].value)

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
        
        // Return as a grid so each player can be assigned seperately
        return [player1, player2];
    }

    const _playTurn = (turn, board, player1, player2, turnDisplay, that) => {
        /* Target is the pressed cell's position */
        let target = that.target.getAttribute('data-position');

        /* Remove any event listeners from the cell once it's been pressed.
        we do this by replacing the cell with a clone of itself. This prevents
        the player from pressing the same cell twice and causing issues */
        that.target.replaceWith(that.target.cloneNode(true));

        /* Janky, but this determines whose turn it is. Even array length,
        player 1's turn. Odd, player 2's turn. Pretty sure I could accomplish
        the same thing with just a number variable, but I'm too scared to change
        it now and it's funny so I'll keep it. */
        if (turn.length % 2 === 0) {
            turnDisplay.textContent = `${player2.getName()}'s turn!`;
            board.setSquare(target, player1.getSymbol());
            turn.push(null);
        } else {
            turnDisplay.textContent = `${player1.getName()}'s turn!`;
            board.setSquare(target, player2.getSymbol());
            turn.push(null);
        }

        /* Set a variable to board.checkWin status so that we only have to
        check it once. Saves on performance I'm pretty sure */
        let winStatus = board.checkWin();

        /*
         1 = player 1 wins,
         2 = player 2 wins,
         'tie' = tie, duh
        */
        if (winStatus === 1) {
            _updateWinner(player1, winStatus, turnDisplay);
        } else if (winStatus === 2) {
            _updateWinner(player2, winStatus, turnDisplay);
        } else if (winStatus === 'tie') {
            turnDisplay.textContent = 'Tie Game.';
        }

        /* If either player has greater than 5 wins, end the game and
        declare them the winner. */
        if (player1.getWins() >= 5) {
            _displayWinner(player1, 1, turnDisplay);
            return;
        } else if (player2.getWins() >= 5) {
            _displayWinner(player2, 2, turnDisplay);
            return;
        }

        // If the round is over
        if (winStatus !== false) {
            // Give the play again button a variable because it'll get use
            const playAgainButton = document.querySelector('.play-again');
            // Display the play again button
            playAgainButton.classList.remove('hide');
            // And when it's pressed, start a new game.
            playAgainButton.addEventListener('click', _newGame.bind(null, board, player1, player2, turnDisplay, playAgainButton));
        }

    }

    const startGame = () => {
        // Initialize the essential DOM items into variables
        const playButton = document.querySelector('.play.buttons');
        const form = document.querySelector('form');
        const turnDisplay = document.querySelector('.turnIndicator');
        let players = [];
        // Hide the button after it's been pressed
        _hideObject(playButton);
        _unHideObject(form);
        
        // Execute when the form is submitted
        form.addEventListener('submit', function(event) {
            // Stop from refreshing the page
            event.preventDefault();
            /* Generate the two players and set them to their own variables */
            players = _initializePlayers(form);
            const player1 = players[0];
            const player2 = players[1];
            //Reset the form and then hide it
            form.reset();
            _hideObject(form);

            /* Generate a game board object */
            const board = gameBoard();

            // Start a new round.
            _newGame(board, player1, player2, turnDisplay, playButton);
        });
        
    }

    return {startGame};
}

/* IIFE keeps out of global scope.
Allows 'PLAY' button to start the game */
(function() {
    /* Create instance of the game controller and have the play button
    call the controller's runGame function */
    const gameInstance = gameController();
    document.querySelector('.play.buttons').addEventListener('click', gameInstance.startGame);
})()