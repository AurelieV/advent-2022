const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const lava = new Map();

    rawInput.split("\n").forEach((line) => {
        const [x, y, z] = line.split(",");

        lava.set(`${x}_${y}_${z}`, {
            x: parseInt(x),
            y: parseInt(y),
            z: parseInt(z),
        });
    });

    const VOISINS = [
        { dx: 1, dy: 0, dz: 0 },
        { dx: -1, dy: 0, dz: 0 },
        { dx: 0, dy: 1, dz: 0 },
        { dx: 0, dy: -1, dz: 0 },
        { dx: 0, dy: 0, dz: 1 },
        { dx: 0, dy: 0, dz: -1 },
    ];

    const answer = [...lava.values()].reduce((total, { x, y, z }) => {
        const delta = VOISINS.reduce(
            (sum, { dx, dy, dz }) => (lava.has(`${x + dx}_${y + dy}_${z + dz}`) ? sum : sum + 1),
            0
        );
        return total + delta;
    }, 0);

    resolving.succeed(`Jour ${chalk.red(18)} - the answer is ${chalk.bold.magenta(answer)}`);
    console.timeEnd("exec");
}

main();
