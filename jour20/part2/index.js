const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const KEY = 811589153;

    const positions = new Map(
        rawInput.split("\n").map((line, index) => [
            index,
            {
                value: parseInt(line) * KEY,
                currentIndex: index,
            },
        ])
    );

    function printList() {
        return [...positions.values()]
            .sort((pos1, pos2) => pos1.currentIndex - pos2.currentIndex)
            .map(({ value }) => value)
            .join(", ");
    }

    function getPositiveModulo(i, m) {
        return ((i % m) + m) % m;
    }

    function getNewIndex(currentIndex, value) {
        if (value === 0) return currentIndex;
        if (value > 0) return (currentIndex + value) % (positions.size - 1);
        if (value < 0) {
            // Insure we have positive modulo
            const index = getPositiveModulo(currentIndex + value, positions.size - 1);

            // 0 = 0-
            return index === 0 ? positions.size - 1 : index;
        }
    }

    for (let turn = 1; turn <= 10; turn++) {
        for (let i = 0; i < positions.size; i++) {
            const { value, currentIndex } = positions.get(i);

            let newIndex = getNewIndex(currentIndex, value);

            if (newIndex !== currentIndex) {
                const min = Math.min(newIndex, currentIndex);
                const max = Math.max(newIndex, currentIndex);
                [...positions.values()].forEach((position) => {
                    if (position.currentIndex === currentIndex) {
                        position.currentIndex = newIndex;
                    } else if (position.currentIndex <= max && position.currentIndex >= min) {
                        position.currentIndex += Math.sign(currentIndex - newIndex);
                    }
                });
            }
        }
    }

    const newPositions = new Map();
    let zeroIndex;
    for (let i = 0; i < positions.size; i++) {
        const { value, currentIndex } = positions.get(i);
        newPositions.set(currentIndex, value);
        if (value === 0) {
            zeroIndex = currentIndex;
        }
    }

    const solution = [
        newPositions.get((zeroIndex + 1000) % positions.size),
        newPositions.get((zeroIndex + 2000) % positions.size),
        newPositions.get((zeroIndex + 3000) % positions.size),
    ];

    const answer = solution[0] + solution[1] + solution[2];

    resolving.succeed(`Jour ${chalk.red(20)} - the answer is ${chalk.bold.magenta(answer)}`);
    console.timeEnd("exec");
}

main();
