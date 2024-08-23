import React, { useState, useEffect, useCallback } from 'react';
import './EasterEgg.css';

type TetrominoShape = (string | number)[][];

interface Tetromino {
    shape: TetrominoShape;
    color: string;
}

const TETROMINOS: { [key: string]: Tetromino } = {
    0: { shape: [[0]], color: '0, 0, 0' },
    I: {
        shape: [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            ['I', 'I', 'I', 'I'],
            [0, 0, 0, 0],
        ],
        color: '80, 227, 230',
    },
    J: {
        shape: [
            [0, 0, 0, 0],
            [0, 0, 'J', 0],
            [0, 0, 'J', 0],
            [0, 0, 'J', 'J'],
        ],
        color: '36, 95, 223',
    },
    L: {
        shape: [
            [0, 0, 0, 0],
            [0, 'L', 0, 0],
            [0, 'L', 'L', 'L'],
            [0, 0, 0, 0],
        ],
        color: '223, 173, 36',
    },
    O: {
        shape: [
            [0, 0, 0, 0],
            [0, 'O', 'O', 0],
            [0, 'O', 'O', 0],
            [0, 0, 0, 0],
        ],
        color: '223, 217, 36',
    },
    S: {
        shape: [
            [0, 0, 0, 0],
            [0, 0, 'S', 'S'],
            [0, 'S', 'S', 0],
            [0, 0, 0, 0],
        ],
        color: '48, 211, 56',
    },
    T: {
        shape: [
            [0, 0, 0, 0],
            [0, 'T', 'T', 'T'],
            [0, 0, 'T', 0],
            [0, 0, 0, 0],
        ],
        color: '132, 61, 198',
    },
    Z: {
        shape: [
            [0, 0, 0, 0],
            [0, 'Z', 'Z', 0],
            [0, 0, 'Z', 'Z'],
            [0, 0, 0, 0],
        ],
        color: '227, 78, 78',
    },
};



// 보드 크기 설정
const STAGE_WIDTH = 10;
const STAGE_HEIGHT = 20;

// 게임 보드 생성
const createStage = () =>
    Array.from(Array(STAGE_HEIGHT), () => new Array(STAGE_WIDTH).fill([0, 'clear']));

// 충돌 감지 함수
const checkCollision = (
    player: any,
    stage: any,
    { x: moveX, y: moveY }: { x: number; y: number }
): boolean => {
    for (let y = 0; y < player.tetromino.length; y += 1) {
        for (let x = 0; x < player.tetromino[y].length; x += 1) {
            if (player.tetromino[y][x] !== 0) {
                if (
                    !stage[y + player.pos.y + moveY] ||
                    !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] ||
                    stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !== 'clear'
                ) {
                    return true;
                }
            }
        }
    }
    return false;
};

// 라인 제거 및 점수 계산
const removeCompletedRows = (stage: any, setScore: React.Dispatch<React.SetStateAction<number>>) => {
    let clearedRows = 0;
    const newStage = stage.reduce((acc: any[], row: any[]) => {
        if (row.findIndex((cell) => cell[0] === 0) === -1) {
            clearedRows += 1;
            acc.unshift(new Array(STAGE_WIDTH).fill([0, 'clear']));
        } else {
            acc.push(row);
        }
        return acc;
    }, []);

    switch (clearedRows) {
        case 1:
            setScore((prevScore) => prevScore + 100);
            break;
        case 2:
            setScore((prevScore) => prevScore + 300);
            break;
        case 3:
            setScore((prevScore) => prevScore + 500);
            break;
        case 4:
            setScore((prevScore) => prevScore + 800);
            break;
        default:
            break;
    }

    return newStage;
};
// 현재 블록을 스테이지에 그려주는 함수
const drawPlayer = (stage: any, player: any) => {
    const newStage = stage.map((row: any) => row.map((cell: any) => (cell[1] === 'clear' ? [0, 'clear'] : cell)));

    player.tetromino.forEach((row: any, y: number) => {
        row.forEach((value: any, x: number) => {
            if (value !== 0) {
                if (TETROMINOS[value]) {
                    newStage[y + player.pos.y][x + player.pos.x] = [value, 'clear'];
                }
            }
        });
    });

    return newStage;
};


const getColor = (key: string | number): string => {
    const tetromino = TETROMINOS[key as keyof typeof TETROMINOS];
    return tetromino ? `rgb(${tetromino.color})` : 'white';
};

// 테트로미노 미리보기 사이즈 설정
const PREVIEW_WIDTH = 4;
const PREVIEW_HEIGHT = 4;

const getNextTetromino = (): TetrominoShape => {
    const tetrominos = 'IJLOSTZ';
    const randTetromino = tetrominos[Math.floor(Math.random() * tetrominos.length)];
    const tetromino = TETROMINOS[randTetromino];
    return tetromino ? tetromino.shape : TETROMINOS['0'].shape;
};

const EasterEgg: React.FC = () => {
    const [stage, setStage] = useState(createStage());
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [player, setPlayer] = useState({
        pos: { x: 0, y: 0 },
        tetromino: TETROMINOS['0'].shape,
        collided: false,
    });
    const [nextTetromino, setNextTetromino] = useState<TetrominoShape>(getNextTetromino());

    const saveScore = async (score: number) => {
        try {
            await fetch(`/api/profiles/1/tetris/score`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(score),
            });
        } catch (error) {
            console.error('Error saving score:', error);
        }
    };

    const updatePlayerPos = ({ x, y, collided }: { x: number; y: number; collided: boolean }) => {
        setPlayer((prev) => ({
            ...prev,
            pos: { x: prev.pos.x + x, y: prev.pos.y + y },
            collided,
        }));
    };

    const resetPlayer = useCallback(() => {
        setPlayer({
            pos: { x: Math.floor(STAGE_WIDTH / 2) - 1, y: 0 },
            tetromino: nextTetromino,
            collided: false,
        });
        setNextTetromino(getNextTetromino());
    }, [nextTetromino]);

    const movePlayer = (dir: number) => {
        if (!checkCollision(player, stage, { x: dir, y: 0 })) {
            updatePlayerPos({ x: dir, y: 0, collided: false });
        }
    };

    const dropPlayer = () => {
        if (!checkCollision(player, stage, { x: 0, y: 1 })) {
            updatePlayerPos({ x: 0, y: 1, collided: false });
        } else {
            if (player.pos.y < 1) {
                setGameOver(true);
                saveScore(score); // 게임 오버 시 점수 저장
                setStage(createStage());
                return;
            }

            const newStage = stage.map((row) =>
                row.map((cell) => (cell[1] === 'clear' ? cell : cell))
            );

            player.tetromino.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value !== 0) {
                        if (TETROMINOS[value]) {
                            newStage[y + player.pos.y][x + player.pos.x] = [value, 'merged'];
                        }
                    }
                });
            });

            setStage(removeCompletedRows(newStage, setScore));
            resetPlayer();
        }
    };

    const rotate = (matrix: TetrominoShape, dir: number) => {
        const rotatedTetro = matrix.map((_, index) =>
            matrix.map((col) => col[index])
        );
        if (dir > 0) return rotatedTetro.map((row) => row.reverse());
        return rotatedTetro.reverse();
    };

    const rotatePlayer = (dir: number) => {
        const clonedPlayer = JSON.parse(JSON.stringify(player));
        clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

        const pos = clonedPlayer.pos.x;
        let offset = 1;
        while (checkCollision(clonedPlayer, stage, { x: 0, y: 0 })) {
            clonedPlayer.pos.x += offset;
            offset = -(offset + (offset > 0 ? 1 : -1));
            if (offset > clonedPlayer.tetromino[0].length) {
                rotate(clonedPlayer.tetromino, -dir);
                clonedPlayer.pos.x = pos;
                return;
            }
        }
        setPlayer(clonedPlayer);
    };

    const startGame = () => {
        setStage(createStage());
        setGameOver(false);
        setScore(0);
        resetPlayer();
    };

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!gameOver) {
                if (event.key === 'ArrowLeft') {
                    movePlayer(-1);
                } else if (event.key === 'ArrowRight') {
                    movePlayer(1);
                } else if (event.key === 'ArrowUp') {
                    rotatePlayer(1);
                } else if (event.key === 'ArrowDown') {
                    dropPlayer();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [movePlayer, rotatePlayer, dropPlayer, gameOver]);

    useEffect(() => {
        if (!gameOver) {
            const drop = setInterval(() => {
                dropPlayer();
            }, 500); // 블록이 천천히 내려오도록 조정

            return () => clearInterval(drop);
        }
    }, [player.pos.y, gameOver, stage]);

    useEffect(() => {
        setStage((prevStage) => drawPlayer(prevStage, player));
    }, [player]);

    return (
        <div className="tetris-wrapper">
            <div className="score">Score: {score}</div>
            <div className="tetris-container">
                <div className="tetris">
                    {gameOver ? (
                        <div>Game Over</div>
                    ) : (
                        stage.map((row, rowIndex) =>
                            row.map((cell, cellIndex) => (
                                <div
                                    key={`${rowIndex}-${cellIndex}`}
                                    className="cell"
                                    style={{
                                        backgroundColor: cell[1] === 'merged' ? getColor(cell[0]) : cell[0] !== 0 ? getColor(cell[0]) : 'white',
                                    }}
                                />
                            ))
                        )
                    )}
                </div>
                <div className="preview">
                    {nextTetromino.map((row, rowIndex) =>
                        row.map((cell, cellIndex) => (
                            <div
                                key={`${rowIndex}-${cellIndex}`}
                                className="preview-cell"
                                style={{
                                    backgroundColor: cell !== 0 ? getColor(cell) : 'white',
                                }}
                            />
                        ))
                    )}
                </div>
            </div>
            <div className="controls">
                <button onClick={startGame}>Start Game</button>
            </div>
        </div>
    );
};

export default EasterEgg;