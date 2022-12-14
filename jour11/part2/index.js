const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const monkeys = rawInput.split("\n\n").map((rawMonkey) => {
        const lines = rawMonkey.split("\n");
        const [, rawStartItems] = lines[1].trim().match(/^Starting items: (.+)$/);
        const items = JSON.parse(`[${rawStartItems}]`);
        const [, funcOperation] = lines[2].trim().match(/^Operation: new = (.+)$/);
        const [, rawTestDivision] = lines[3].trim().match(/^Test: divisible by (\d+)$/);
        const [, rawNextMonkeyTrue] = lines[4].trim().match(/^If true: throw to monkey (\d+)$/);
        const [, rawNextMonkeyFalse] = lines[5].trim().match(/^If false: throw to monkey (\d+)$/);

        return {
            items,
            funcOperation,
            testDivision: parseInt(rawTestDivision),
            nextMonkeyTrue: parseInt(rawNextMonkeyTrue),
            nextMonkeyFalse: parseInt(rawNextMonkeyFalse),
        };
    });

    const inspections = {};
    const stressManagement = monkeys.reduce((result, monkey) => monkey.testDivision * result, 1);

    function oneRound() {
        monkeys.forEach((monkey, index) => {
            inspections[index] = (inspections[index] || 0) + monkey.items.length;
            while (monkey.items.length) {
                let item = monkey.items.shift();
                item = eval(`(old => ${monkey.funcOperation})(item)`);
                item = item % stressManagement;
                if (item % monkey.testDivision === 0) {
                    monkeys[monkey.nextMonkeyTrue].items.push(item);
                } else {
                    monkeys[monkey.nextMonkeyFalse].items.push(item);
                }
            }
        });
    }

    for (let i = 1; i <= 10000; i++) {
        oneRound();
    }

    console.log(
        Object.values(inspections)
            .map((count, index) => `Monkey ${index} inspect ${count} items`)
            .join("\n")
    );

    const [count1, count2] = Object.values(inspections).sort((a, b) => b - a);

    resolving.succeed(`Jour ${chalk.red(11)} - the answer is ${chalk.bold.magenta(count1 * count2)}`);
    console.timeEnd("exec");
}

main();
