const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function checkRowOrColumn({ x, y }, delta, trees) {
    function getTree(x, y) {
        return trees.get(`${x}_${y}`);
    }
    let tree = getTree(x, y);
    let max = -1;
    while (tree) {
        if (tree.height > max) {
            tree.isVisible = true;
            max = tree.height;
        }
        x = x + delta.x;
        y = y + delta.y;
        tree = getTree(x, y);
    }
}

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const trees = new Map();

    const rows = rawInput.split("\n");
    rows.forEach((row, y) => {
        [...row].forEach((tree, x) => {
            trees.set(`${x}_${y}`, { isVisible: false, height: parseInt(tree) });
        });
    });

    const maxX = rows[0].length - 1;
    const maxY = rows.length - 1;

    // Check TOP EDGE
    for (let x = 0; x <= maxX; x++) {
        checkRowOrColumn({ x, y: 0 }, { x: 0, y: 1 }, trees);
    }
    // Check BOTTOM EDGE
    for (let x = 0; x <= maxX; x++) {
        checkRowOrColumn({ x, y: maxY }, { x: 0, y: -1 }, trees);
    }
    // Check LEFT EDGE
    for (let y = 0; y <= maxY; y++) {
        checkRowOrColumn({ x: 0, y }, { x: 1, y: 0 }, trees);
    }
    // Check RIGHT EDGE
    for (let y = 0; y <= maxY; y++) {
        checkRowOrColumn({ x: maxX, y }, { x: -1, y: 0 }, trees);
    }

    const answer = [...trees.values()].filter((tree) => tree.isVisible).length;

    resolving.succeed(`Jour ${chalk.red(8)} - the answer is ${chalk.bold.magenta(answer)}`);
    console.timeEnd("exec");
}

main();
