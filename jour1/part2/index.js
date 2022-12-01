const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const elfCalories = rawInput.split("\n\n").map((block) =>
        block
            .split("\n")
            .map((line) => parseInt(line))
            .reduce((calories, snack) => calories + snack, 0)
    );

    const top3 = elfCalories.reduce(
        (top3, calories) => {
            if (top3.max1 <= calories) {
                top3.max3 = top3.max2;
                top3.max2 = top3.max1;
                top3.max1 = calories;
            } else if (top3.max2 <= calories) {
                top3.max3 = top3.max2;
                top3.max2 = calories;
            } else if (top3.max3 <= calories) {
                top3.max3 = calories;
            }

            return top3;
        },
        { max1: 0, max2: 0, max3: 0 }
    );

    const answer = top3.max1 + top3.max2 + top3.max3;

    resolving.succeed(`Jour ${chalk.red(1)} - the answer is ${chalk.bold.magenta(answer)}`);
    console.timeEnd("exec");
}

main();
