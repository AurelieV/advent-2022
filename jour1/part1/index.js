const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time('exec')
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const elfSnacks = rawInput.split('\n\n').map(block => block.split('\n').map(line => parseInt(line)))

    const elfCalories = elfSnacks.map(elf => elf.reduce((calories, snack) => calories + snack, 0))

    const answer = Math.max(...elfCalories)
    
    resolving.succeed(
        `Jour ${chalk.red(1)} - the answer is ${chalk.bold.magenta(answer)}`
    );
    console.timeEnd('exec')
}

main();