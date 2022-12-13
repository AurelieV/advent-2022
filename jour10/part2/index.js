const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const instructions = rawInput.split("\n").map((line) => {
        if (line === "noop") return { type: "noop" };
        const [, rawValue] = line.match(/^addx (-{0,1}\d+)$/);

        return { type: "add", value: parseInt(rawValue) };
    });

    let cycle = 0;
    let x = 1;

    let screen = "";

    function drawPixel() {
        if (cycle % 40 === 0) {
            screen += "\n";
        }
        screen += Math.abs(x - (cycle % 40)) <= 1 ? "#" : ".";
    }

    instructions.forEach((instruction) => {
        if (instruction.type === "noop") {
            drawPixel();
            cycle++;
        } else if (instruction.type === "add") {
            drawPixel();
            cycle++;
            drawPixel();
            cycle++;
        }
        if (instruction.type === "add") {
            x += instruction.value;
        }
    });

    resolving.succeed(`Jour ${chalk.red(10)} - Done`);
    console.log(screen);
    console.timeEnd("exec");
}

main();
