const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

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

    function getDistance({ x, y }, delta) {
        function getTree(x, y) {
            return trees.get(`${x}_${y}`);
        }

        const originTree = getTree(x, y);
        x = x + delta.x;
        y = y + delta.y;
        let tree = getTree(x, y);
        let distance = 0;

        while (tree) {
            distance++;
            if (tree.height >= originTree.height) return distance;
            x = x + delta.x;
            y = y + delta.y;
            tree = getTree(x, y);
        }

        return distance;
    }

    function getScore({ x, y }) {
        const scoreBottom = getDistance({ x, y }, { x: 0, y: 1 }, trees);
        const scoreTop = getDistance({ x, y }, { x: 0, y: -1 }, trees);
        const scoreRight = getDistance({ x, y }, { x: 1, y: 0 }, trees);
        const scoreLeft = getDistance({ x, y }, { x: -1, y: 0 }, trees);

        return scoreBottom * scoreTop * scoreRight * scoreLeft;
    }

    let maxScore = 0;
    for (let x = 1; x < maxX; x++) {
        for (let y = 1; y < maxY; y++) {
            const score = getScore({ x, y });
            if (score > maxScore) {
                maxScore = score;
            }
        }
    }

    resolving.succeed(`Jour ${chalk.red(8)} - the answer is ${chalk.bold.magenta(maxScore)}`);
    console.timeEnd("exec");
}

main();
