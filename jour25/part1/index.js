const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const ballons = rawInput.split("\n").map((line) => [...line].reverse());

    const SNAFU_VALUES = ["0", "1", "2", "=", "-"];
    const SNAFU_ORDER = {
        "=": 3,
        "-": 4,
        0: 0,
        1: 1,
        2: 2,
    };
    const SNAFU_NUMERIC = new Map([
        ["=", -2],
        ["-", -1],
        ["0", 0],
        ["1", 1],
        ["2", 2],
    ]);

    function addPower(a, b, carry) {
        const power = SNAFU_VALUES[(SNAFU_ORDER[a] + SNAFU_ORDER[b] + SNAFU_ORDER[carry]) % 5];
        const numeric = SNAFU_NUMERIC.get(a) + SNAFU_NUMERIC.get(b) + SNAFU_NUMERIC.get(carry);
        if (numeric > 2) {
            return { power, carry: "1" };
        } else if (numeric < -2) {
            return { power, carry: "-" };
        } else {
            return { power, carry: "0" };
        }
    }

    function addSNAFU(ballon1, ballon2) {
        let carry = "0";
        let sum = [];

        if (ballon2.length > ballon1.length) {
            [ballon1, ballon2] = [ballon2, ballon1];
        }

        ballon1.forEach((powerA, index) => {
            const powerB = ballon2[index] || "0";
            const { power, carry: newCarry } = addPower(powerA, powerB, carry);
            carry = newCarry;
            sum.push(power);
        });
        if (carry !== "0") {
            sum.push(carry);
        }

        return sum;
    }

    const total = ballons.reduce((sum, ballon) => addSNAFU(sum, ballon), "0");
    const answer = total.reverse().join("");

    resolving.succeed(`Jour ${chalk.red(25)} - the answer is ${chalk.bold.magenta(answer)}`);
    console.timeEnd("exec");
}

main();
