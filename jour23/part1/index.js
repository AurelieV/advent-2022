const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

const POSSIBLE_MOVES = [
    { move: "N", checks: ["N", "NE", "NW"] },
    { move: "S", checks: ["S", "SE", "SW"] },
    { move: "W", checks: ["W", "NW", "SW"] },
    { move: "E", checks: ["E", "NE", "SE"] },
];
const ALL_DIRECTIONS = ["N", "S", "E", "W", "NW", "NE", "SE", "SW"];
const DIRECTIONS = {
    N: { dx: 0, dy: -1 },
    S: { dx: 0, dy: 1 },
    W: { dx: -1, dy: 0 },
    E: { dx: 1, dy: 0 },
};

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const map = {};
    const elves = [];
    let elfId = 0;
    rawInput.split("\n").forEach((line, y) => {
        [...line].forEach((point, x) => {
            if (point === "#") {
                elves.push({
                    id: elfId,
                    currentPosition: { x, y },
                });
                map[`${x}_${y}`] = elfId;
                elfId++;
            }
        });
    });

    let firstMoveToTry = 0;

    function printMap() {
        const allX = elves.map((elf) => elf.currentPosition.x);
        const allY = elves.map((elf) => elf.currentPosition.y);

        const minX = Math.min(0, ...allX);
        const minY = Math.min(0, ...allY);
        const maxX = Math.max(...allX);
        const maxY = Math.max(...allY);
        for (let y = minY; y <= maxY; y++) {
            let line = "";
            for (let x = minX; x <= maxX; x++) {
                if (map[`${x}_${y}`] === undefined) {
                    line += ".";
                } else {
                    line += "#";
                }
            }
            console.log(line);
        }
    }

    function getVoisins(x, y) {
        const result = {};
        ALL_DIRECTIONS.forEach((direction) => {
            result[direction] = [...direction].reduce(
                (delta, dir) => {
                    delta.x += DIRECTIONS[dir].dx;
                    delta.y += DIRECTIONS[dir].dy;

                    return delta;
                },
                { x, y }
            );
        });

        return result;
    }
    function setNextWantedPosition(elf) {
        const voisins = getVoisins(elf.currentPosition.x, elf.currentPosition.y);
        const isAlone = Object.values(voisins).every(({ x, y }) => map[`${x}_${y}`] === undefined);
        if (isAlone) {
            elf.nextWantedPosition = null;
            return;
        }
        for (let i = 0; i < POSSIBLE_MOVES.length; i++) {
            const { move, checks } = POSSIBLE_MOVES[(firstMoveToTry + i) % POSSIBLE_MOVES.length];
            const isOk = checks.every(
                (direction) => map[`${voisins[direction].x}_${voisins[direction].y}`] === undefined
            );
            if (isOk) {
                elf.nextWantedPosition = voisins[move];
                return;
            }
        }
        elf.nextWantedPosition = null;
    }

    function moveElf(elf) {
        if (!elf.nextWantedPosition) return;
        const cannotMove = elves.some(
            (otherElf) =>
                otherElf.nextWantedPosition?.x === elf.nextWantedPosition.x &&
                otherElf.nextWantedPosition?.y === elf.nextWantedPosition.y &&
                otherElf.id !== elf.id
        );
        if (cannotMove) return;
        delete map[`${elf.currentPosition.x}_${elf.currentPosition.y}`]; // nothing can take the place elf was
        elf.currentPosition = { ...elf.nextWantedPosition };
        map[`${elf.currentPosition.x}_${elf.currentPosition.y}`] = elf.id;
    }

    console.log(`== INITIAL ==`);
    printMap();

    for (let turn = 1; turn <= 10; turn++) {
        elves.forEach(setNextWantedPosition);
        elves.forEach(moveElf);
        firstMoveToTry = (firstMoveToTry + 1) % POSSIBLE_MOVES.length;

        console.log(`== TURN ${turn} ==`);
        printMap();
    }

    const allX = elves.map((elf) => elf.currentPosition.x);
    const allY = elves.map((elf) => elf.currentPosition.y);

    const minX = Math.min(...allX);
    const minY = Math.min(...allY);
    const maxX = Math.max(...allX);
    const maxY = Math.max(...allY);

    let count = 0;
    for (let x = minX; x <= maxX; x++) {
        for (let y = minY; y <= maxY; y++) {
            if (map[`${x}_${y}`] === undefined) {
                count++;
            }
        }
    }

    resolving.succeed(`Jour ${chalk.red(23)} - the answer is ${chalk.bold.magenta(count)}`);
    console.timeEnd("exec");
}

main();
