const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const lines = rawInput.split("\n");
    const directories = new Map();
    directories.set("/", {
        name: "/",
        level: 0,
        size: 0,
    });
    let currentDirectory = "/";

    for (const line of lines) {
        if (line === "$ ls") {
            continue;
        }
        if (line.startsWith("$ cd")) {
            const directoryName = line.replace("$ cd ", "");
            if (directoryName === "/") {
                currentDirectory = "/";
            } else if (directoryName === "..") {
                const { parent } = directories.get(currentDirectory);
                currentDirectory = parent;
            } else {
                const directory = currentDirectory === "/" ? directoryName : `${currentDirectory}/${directoryName}`;
                const parentDirectory = directories.get(currentDirectory);

                if (!directories.has(directory)) {
                    directories.set(directory, {
                        name: directory,
                        size: 0,
                        parent: currentDirectory,
                        level: parentDirectory.level + 1,
                    });
                }
                currentDirectory = directory;
            }
            continue;
        }
        if (line.startsWith("dir")) continue;
        const [, size, filename] = line.match(/^(\d+) (.+)$/);
        directories.get(currentDirectory).size = directories.get(currentDirectory).size + parseInt(size);
    }

    const sortedDirectories = [...directories.values()].sort((a, b) => b.level - a.level);
    for (const dir of sortedDirectories) {
        if (dir.parent) {
            directories.get(dir.parent).size = directories.get(dir.parent).size + dir.size;
        }
    }

    const answer = sortedDirectories.reduce((sum, dir) => {
        if (dir.name === "/") return sum;
        return dir.size <= 100000 ? sum + dir.size : sum;
    }, 0);

    resolving.succeed(`Jour ${chalk.red(7)} - the answer is ${chalk.bold.magenta(answer)}`);
    console.timeEnd("exec");
}

main();
