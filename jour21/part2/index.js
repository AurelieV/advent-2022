const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

const REVERSED = {
    left: {
        "+": { operator: "-", left: "id", right: "right" }, // id: x + right => x: id - right
        "-": { operator: "+", left: "id", right: "right" }, // id: x - right => x: id + right
        "*": { operator: "/", left: "id", right: "right" }, // id: x * right => x: id / right
        "/": { operator: "*", left: "id", right: "right" }, // id: x / right => x: id * right
    },
    right: {
        "+": { operator: "-", left: "id", right: "left" }, // id: left + x => x: id - left
        "-": { operator: "-", left: "left", right: "id" }, // id: left - x => x: left - id
        "*": { operator: "/", left: "id", right: "left" }, // id: left * x => x = id / left
        "/": { operator: "/", left: "left", right: "id" }, // id: left / x => x = left / id
    },
};
const OPPOSITE = {
    left: "right",
    right: "left",
};

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const monkeys = new Map();
    const monkeysPerLeft = new Map();
    const monkeysPerRight = new Map();

    rawInput.split("\n").forEach((line) => {
        const [, id, instruction] = line.match(/^(.+): (.+)$/);
        if (id === "humn") {
            return;
        }

        const value = parseInt(instruction);
        let [left, operator, right] = instruction.split(" ");
        let monkey;

        if (id === "root") {
            monkey = { value: 0, operator: "-", left, right };
        }
        if (!isNaN(value)) {
            monkeys.set(id, { id, value });
            return;
        } else {
            monkey = { id, operator, left, right };
        }
        monkeys.set(id, monkey);
        monkeysPerLeft.set(left, monkey);
        monkeysPerRight.set(right, monkey);
    });

    // A variable only appears once
    function retrieveByReversed(monkeyId) {
        let otherMonkey;
        let operand;
        if (monkeysPerLeft.has(monkeyId)) {
            operand = "left";
            otherMonkey = monkeysPerLeft.get(monkeyId);
        } else {
            operand = "right";
            otherMonkey = monkeysPerRight.get(monkeyId);
        }

        if (otherMonkey.id === "root") {
            monkeys.set(monkeyId, { ...monkeys.get(otherMonkey[OPPOSITE[operand]]) });
            return;
        }

        const { left: leftProp, right: rightProp, operator } = REVERSED[operand][otherMonkey.operator];
        monkeys.set(monkeyId, { left: otherMonkey[leftProp], right: otherMonkey[rightProp], id: monkeyId, operator });
        retrieveByReversed(otherMonkey.id);
    }

    retrieveByReversed("humn");

    function getValue(id) {
        const monkey = monkeys.get(id);
        if (monkey.value !== undefined) {
            return monkey.value;
        }
        const left = getValue(monkey.left);
        const right = getValue(monkey.right);
        const value = eval(`${left} ${monkey.operator} ${right}`);
        monkey.value = value;

        return value;
    }

    const answer = getValue("humn");

    resolving.succeed(`Jour ${chalk.red(21)} - the answer is ${chalk.bold.magenta(answer)}`);
    console.timeEnd("exec");
}

main();
