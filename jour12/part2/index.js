const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const points = {};
    rawInput.split("\n").forEach((line, y) => {
        [...line].forEach((point, x) => {
            let height = point;
            if (height === "E") {
                height = "z";
            } else if (height === "S") {
                height = "a";
            }
            points[`${x}_${y}`] = {
                x,
                y,
                solved: false,
                distance: Infinity,
                previousNode: null,
                isStart: point === "E",
                height: height.charCodeAt("0") - "a".charCodeAt("0"),
            };
        });
    });

    function getPoint(x, y) {
        return points[`${x}_${y}`];
    }
    function getUnresolvedVoisins(x, y) {
        const voisins = [
            { x, y: y + 1 },
            { x, y: y - 1 },
            { x: x + 1, y },
            { x: x - 1, y },
        ];

        const currentHeight = getPoint(x, y).height;
        return voisins
            .map(({ x, y }) => getPoint(x, y))
            .filter((point) => point !== undefined)
            .filter(({ solved, height }) => !solved && height + 1 >= currentHeight);
    }

    const startingPoint = Object.values(points).find(({ isStart }) => isStart);
    let { x, y } = startingPoint;
    startingPoint.distance = 0;
    startingPoint.solved = true;

    while (!getPoint(x, y).isFinal) {
        const currentPoint = getPoint(x, y);
        const voisins = getUnresolvedVoisins(x, y);
        voisins.forEach((point) => {
            if (currentPoint.distance + 1 < point.distance) {
                point.distance = currentPoint.distance + 1;
                point.previousNode = { x, y };
            }
        });
        currentPoint.solved = true;
        const [nextPoint] = Object.values(points)
            .filter(({ solved, distance }) => !solved && distance !== Infinity)
            .sort((a, b) => a.distance - b.distance);
        if (!nextPoint) break;
        x = nextPoint.x;
        y = nextPoint.y;
    }

    const [bestSpot] = Object.values(points)
        .filter(({ height }) => height === 0)
        .sort((a, b) => a.distance - b.distance);

    console.log(bestSpot);
    resolving.succeed(`Jour ${chalk.red(12)} - the answer is ${chalk.bold.magenta(bestSpot.distance)}`);
    console.timeEnd("exec");
}

main();
