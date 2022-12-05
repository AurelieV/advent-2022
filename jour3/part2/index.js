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

    const bags = rawInput.split("\n").map((line) => [...line]);
    const groups = [];
    let i = 0;
    while ((i + 1) * 3 <= bags.length) {
        groups.push(bags.slice(i * 3, (i + 1) * 3));
        i++;
    }

    const answer = groups.reduce((sum, group) => {
        const badge = group[0].find((item) => group[1].includes(item) && group[2].includes(item));

        return sum + points[badge];
    }, 0);

    resolving.succeed(`Jour ${chalk.red(3)} - the answer is ${answer}`);
    console.timeEnd("exec");
}

main();
