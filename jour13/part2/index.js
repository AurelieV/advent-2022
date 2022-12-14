const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function compare(part1, part2) {
    if (!Array.isArray(part1) && !Array.isArray(part2)) {
        if (part1 === part2) return 0;
        return part1 < part2 ? -1 : 1;
    }
    if (!Array.isArray(part1)) {
        part1 = [part1];
    }
    if (!Array.isArray(part2)) {
        part2 = [part2];
    }
    if (part1.length === 0 && part2.length === 0) {
        return 0;
    }
    if (part1.length === 0) {
        return -1;
    }
    if (part2.length === 0) {
        return 1;
    }
    const compareFirst = compare(part1[0], part2[0]);
    if (compareFirst === 0) {
        return compare(part1.slice(1), part2.slice(1));
    } else {
        return compareFirst;
    }
}

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const pairs = rawInput.split(/\n+/).map((line) => JSON.parse(line));
    const divider1 = [[2]];
    const divider2 = [[6]];
    pairs.push(divider1);
    pairs.push(divider2);

    pairs.sort(compare);

    const index1 = pairs.findIndex((item) => item === divider1) + 1;
    const index2 = pairs.findIndex((item) => item === divider2) + 1;

    console.log(pairs, index1, index2);

    resolving.succeed(`Jour ${chalk.red(13)} - the answer is ${chalk.bold.magenta(index1 * index2)}`);
    console.timeEnd("exec");
}

main();
