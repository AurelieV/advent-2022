const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const world = new Map();

    rawInput.split("\n").forEach((line) => {
        const corners = line.split(" -> ");
        for (let i = 0; i < corners.length - 1; i++) {
            const [startX, startY] = corners[i].split(",").map((raw) => parseInt(raw));
            const [endX, endY] = corners[i + 1].split(",").map((raw) => parseInt(raw));
            if (startX === endX) {
                const min = Math.min(startY, endY);
                const max = Math.max(startY, endY);
                for (let y = min; y <= max; y++) {
                    world.set(`${startX}_${y}`, "#");
                }
            } else if (startY === endY) {
                const min = Math.min(startX, endX);
                const max = Math.max(startX, endX);
                for (let x = min; x <= max; x++) {
                    world.set(`${x}_${startY}`, "#");
                }
            }
        }
    });

    let [maxY] = [...world.keys()]
        .map((id) => {
            const [x, y] = id.split("_");
            return parseInt(y);
        })
        .sort((a, b) => b - a);

    maxY += 2;

    function step() {
        let x = 500;
        let y = 0;
        while (y < maxY - 1) {
            if (!world.has(`${x}_${y + 1}`)) {
                y += 1;
                continue;
            }
            if (!world.has(`${x - 1}_${y + 1}`)) {
                y += 1;
                x -= 1;
                continue;
            }
            if (!world.has(`${x + 1}_${y + 1}`)) {
                y += 1;
                x += 1;
                continue;
            }
            world.set(`${x}_${y}`, "o");
            return;
        }
        world.set(`${x}_${y}`, "o");
    }

    let count = 0;
    while (!world.has("500_0")) {
        step();
        count++;
    }

    resolving.succeed(`Jour ${chalk.red(14)} - the answer is ${chalk.bold.magenta(count)}`);
    console.timeEnd("exec");
}

main();
