const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const initialMap = {};
    const lines = rawInput.split("\n");
    lines.forEach((line, y) => {
        [...line].forEach((point, x) => {
            if (["<", ">", "v", "^"].includes(point)) {
                initialMap[`${x}_${y}`] = { x, y, blizards: [point] };
            }
        });
    });

    const DIRECTIONS = {
        "<": { dx: -1, dy: 0, index: 0 },
        ">": { dx: 1, dy: 0, index: 1 },
        "^": { dx: 0, dy: -1, index: 2 },
        v: { dx: 0, dy: 1, index: 3 },
    };

    const maxY = lines.length - 1;
    const maxX = lines[0].length - 1;
    const finalPosition = { x: maxX - 1, y: maxY };

    function isFinal(x, y) {
        return x === finalPosition.x && y === finalPosition.y;
    }

    const initialState = {
        x: 1,
        y: 0,
        turn: 0,
    };

    const MAPS = [initialMap];
    const MAP_CYCLE = (maxX - 1) * (maxY - 1);
    let map = initialMap;
    function getNextMap() {
        const newMap = {};
        Object.values(map).forEach(({ x, y, blizards }) => {
            blizards.forEach((blizard) => {
                let newX = x + DIRECTIONS[blizard].dx;
                let newY = y + DIRECTIONS[blizard].dy;
                if (newX <= 0) {
                    newX = maxX - 1;
                } else if (newX >= maxX) {
                    newX = 1;
                } else if (newY <= 0) {
                    newY = maxY - 1;
                } else if (newY >= maxY) {
                    newY = 1;
                }
                if (!newMap[`${newX}_${newY}`]) {
                    newMap[`${newX}_${newY}`] = { x: newX, y: newY, blizards: [blizard] };
                } else {
                    newMap[`${newX}_${newY}`].blizards.push(blizard);
                }
            });
        });

        return newMap;
    }
    for (let i = 0; i < MAP_CYCLE - 1; i++) {
        map = getNextMap(map);
        MAPS.push(map);
    }

    function getHashState(state) {
        return `${state.x}_${state.y}__${state.turn % MAP_CYCLE}`;
    }

    function isPossible(x, y, map) {
        if (x <= 0) return false;
        if (x >= maxX) return false;
        if (y === 0) return x === 1;
        if (y === maxY) return x === maxX - 1;
        if (y < 0) return false;
        if (y > maxY) return false;
        return !map[`${x}_${y}`];
    }

    function getNextPossiblePositions(x, y, map) {
        const newPositions = [];
        const bestMoves = ["v", ">"]
            .map((dir) => ({ x: x + DIRECTIONS[dir].dx, y: y + DIRECTIONS[dir].dy }))
            .filter((position) => isPossible(position.x, position.y, map));
        newPositions.push(...bestMoves);
        const worstMoves = ["^", "<"]
            .map((dir) => ({ x: x + DIRECTIONS[dir].dx, y: y + DIRECTIONS[dir].dy }))
            .filter((position) => isPossible(position.x, position.y, map));
        newPositions.push(...worstMoves);
        if (isPossible(x, y, map)) {
            newPositions.push({ x, y }); // WAIT
        }

        return newPositions;
    }

    let minimalTurns = Infinity;
    const memoizedMove = new Map();
    function move(state) {
        const hash = getHashState(state);
        // Detecting loop
        if (memoizedMove.has(hash)) {
            return;
        }
        memoizedMove.set(hash, true);

        const newMap = MAPS[(state.turn + 1) % MAP_CYCLE];
        const positions = getNextPossiblePositions(state.x, state.y, newMap);
        if (positions.some((position) => isFinal(position.x, position.y))) {
            minimalTurns = Math.min(state.turn + 1, minimalTurns);
            return;
        }
        const minimalMoveToReachEnd = finalPosition.y - state.x + (finalPosition.y - state.y);
        if (state.turn + minimalMoveToReachEnd > minimalTurns) {
            return; // we will never do better
        }
        positions.forEach((position) => {
            move({
                x: position.x,
                y: position.y,
                turn: state.turn + 1,
            });
        });
    }

    move(initialState);

    resolving.succeed(`Jour ${chalk.red(24)} - the answer is ${chalk.bold.magenta(minimalTurns)}`);
    console.timeEnd("exec");
}

main();
