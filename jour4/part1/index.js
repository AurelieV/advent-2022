const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const answer = rawInput.split("\n").reduce((total, pair) => {
        let [, elf1start, elf1end, elf2start, elf2end] = pair.match(/^(\d+)-(\d+),(\d+)-(\d+)$/);

        elf1start = parseInt(elf1start);
        elf1end = parseInt(elf1end);
        elf2start = parseInt(elf2start);
        elf2end = parseInt(elf2end);

        const isOverLapping =
            (elf1start >= elf2start && elf1end <= elf2end) || (elf2start >= elf1start && elf2end <= elf1end);

        return isOverLapping ? total + 1 : total;
    }, 0);

    resolving.succeed(`Jour ${chalk.red(4)} - the answer is ${chalk.bold.magenta(answer)}`);
    console.timeEnd("exec");
}

main();
