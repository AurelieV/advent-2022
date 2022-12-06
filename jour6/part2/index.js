const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = "mjqjpqmgbljsphdztnvjfqwrcgsmlb";
    // const rawInput = "bvwbjplbgvbhsrlpgdmjqwftvncz";
    // const rawInput = "nppdvjthqldpwncqszvftbrmjlhg";
    // const rawInput = "nznrnfrfntjfmvfwmzdfjlvtqnbhcprsg";
    // const rawInput = "zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw";
    const [rawInput] = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8").split("\n");

    const caracters = [...rawInput];
    let markerPosition = 14;
    while (
        markerPosition < caracters.length &&
        new Set(caracters.slice(markerPosition - 14, markerPosition)).size < 14
    ) {
        markerPosition++;
    }

    resolving.succeed(`Jour ${chalk.red(6)} - the answer is ${chalk.bold.magenta(markerPosition)}`);
    console.timeEnd("exec");
}

main();
