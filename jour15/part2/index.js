const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");
const { interval } = require("rxjs");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const sensors = rawInput.split("\n").map((line) => {
        const [, rawSensorX, rawSensorY, rawBeaconX, rawBeaconY] = line.match(
            /^Sensor at x=(.+), y=(.+): closest beacon is at x=(.+), y=(.+)$/
        );
        const [sensorX, sensorY, beaconX, beaconY] = [rawSensorX, rawSensorY, rawBeaconX, rawBeaconY].map((item) =>
            parseInt(item)
        );
        const distance = Math.abs(sensorX - beaconX) + Math.abs(sensorY - beaconY);

        return {
            x: sensorX,
            y: sensorY,
            beaconX,
            beaconY,
            distance,
        };
    });

    // const max = 20;
    const max = 4000000;
    function getCantBeABeaconPerSensor(y, sensor) {
        let x = sensor.x;
        const minDistance = Math.abs(sensor.y - y);

        if (minDistance >= sensor.distance) {
            return null;
        }

        const deltaX = sensor.distance - minDistance;

        const minX = Math.max(0, sensor.x - deltaX);
        const maxX = Math.min(max, sensor.x + deltaX);

        return [minX, maxX];
    }

    function getCanBeABeacon(y) {
        const intervals = sensors
            .map((sensor) => getCantBeABeaconPerSensor(y, sensor))
            .filter((interval) => !!interval)
            .sort((a, b) => a[0] - b[0]);

        if (intervals[0][0] !== 0) return 0;
        let maxX = intervals[0][1];
        intervals.shift();
        while (maxX < max && intervals.length > 0) {
            if (intervals[0][0] <= maxX) {
                maxX = Math.max(maxX, intervals[0][1]);
                intervals.shift();
            } else {
                return maxX + 1;
            }
        }
        if (interval.length > 0 && maxX < max) {
            return max;
        }
        return null;
    }

    let beaconX = null;
    let y = 0;
    while (y <= max) {
        beaconX = getCanBeABeacon(y);
        if (beaconX !== null) break;
        y++;
    }

    console.log(beaconX, y);
    const answer = beaconX * 4000000 + y;

    resolving.succeed(`Jour ${chalk.red(15)} - the answer is ${chalk.bold.magenta(answer)}`);
    console.timeEnd("exec");
}

main();
