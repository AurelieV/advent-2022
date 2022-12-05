const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

const aCharCode = "a".charCodeAt("0");
const ACharCode = "A".charCodeAt("0");
const points = {};
for (let i = 0; i < 26; i++) {
    const lowerCaseLetter = String.fromCharCode(i + aCharCode);
    const upperCaseLetter = String.fromCharCode(i + ACharCode);
    points[lowerCaseLetter] = 1 + i;
    points[upperCaseLetter] = 27 + i;
}

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const answer = rawInput.split('\n').reduce((sum, line) => {
        const bagSize = line.length / 2;
        const bag1 = [...line.slice(0, bagSize)]
        const bag2 = [...line.slice(-bagSize)]

        const double = bag1.find(item => bag2.includes(item));

        return sum + points[double]
    }, 0)

    resolving.succeed(`Jour ${chalk.red(3)} - the answer is ${answer}`);
    console.timeEnd("exec");
}

main();
