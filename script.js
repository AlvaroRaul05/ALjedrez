//  Espera por el DOM para estar completamente
// cargado antes de ejecutar el código.
document.addEventListener('DOMContentLoaded', () => {
    let board = null;
    const game = new Chess(); // Creando un nuevo Ajedrez.js
    const moveHistory = document.getElementById('move-history'); //Obtiene el contenedor del historial
    let moveCount = 1; //Inicia el conteo de movimientos
    let userColor = 'w'; // Inicia el usuario con color blanco

    //Una función para hacer un movimiento
    //aleatorio para la computadora
    const makeRandomMove = () => {
        const possibleMoves = game.moves();

        if (game.game_over()){
            alert("¡Jaque Mate!");
        }
        else {
            const randomIdx = Math.floor(Math.random() * possibleMoves.length);
            const move = possibleMoves[randomIdx];
            game.move(move);
            board.position(game.fen());
            recordMove(move, moveCount); // Marca y
            //muestra el movimiento en pantalla con el conteo de movimiento.
            moveCount++; // Incrementa el contador de jugadas.
        }
    };
    //Función para marcar y mostrar en pantalla en el historial de movimientos.
    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)} . ${move}` : `${move} -`;
        moveHistory.textContent += formattedMove + ' ';
        moveHistory.scrollTop = moveHistory.scrollHeight;
        //Auto deslice para el último movimiento.
    };
    // Función para manejar el inicio de arrastre, osea, arrastrar las piezas.
    const onDragStart = (source, piece) => {
        //Permite al usuario arrastrar sólo sus piezas basado en el color.
        return !game.game_over() && piece.search(userColor) === 0;
    };

    //Función para soltar las piezas en el tablero.
    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q',
        });

        if (move === null) return 'snapback';

        window.setTimeout(makeRandomMove, 250);
        recordMove(move.san, moveCount);
        // Anota y muestra en pantalla el movimiento junto con su conteo.
        moveCount++;
    };
    const onSnapEnd = () => {
        board.position(game.fen());
    };
    // Configuración de las opciones para el tablero de ajedrez
    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'fast',
        snapBackSpeed: 500,
        snapSpeed: 100,
        showErrors: true,
    };

    // Inicializa el tablero
    board = Chessboard('board', boardConfig);

    //Escucha eventos para el botón de Jugar de Nuevo
    document.querySelector('.jugarOtraVez').addEventListener('click', () => {
        game.reset();
        board.start();
        moveHistory.textContent = ' ';
        moveCount = 1;
        userColor = 'w';
    });

    document.querySelector('.posicionar').addEventListener('click', () => {
        const fen = prompt("Ingresa la notación FEN");
        if (fen !== null) {
            if (game.load(fen)) {
                board.position(fen);
                moveHistory.textContent = ' ';
                moveCount = 1;
                userColor = 'w'
            }
            else {
                alert("Ha ingresado una notación inválida, por favor ingrese una notación fen válida.");
            }
        }
    });

    //Escucha eventos para el botón de Girar Tablero.
    document.querySelector('.girarTablero').addEventListener('click', () => {
        board.flip();
        makeRandomMove();
        //Cambia el color del usuario dando vuelta el tablero.
        userColor = userColor === 'w' ? 'b' : 'w';
    });
});
