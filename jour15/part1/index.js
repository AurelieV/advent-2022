const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

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

    function getCantBeABeacon(y, sensor) {
        let x = sensor.x;
        let cantBeABeacon = true;
        let result = [];
        while (cantBeABeacon) {
            result.push(x);
            x += 1;
            cantBeABeacon = Math.abs(sensor.x - x) + Math.abs(sensor.y - y) <= sensor.distance;
        }
        x = sensor.x;
        cantBeABeacon = true;
        while (cantBeABeacon) {
            result.push(x);
            x -= 1;
            cantBeABeacon = Math.abs(sensor.x - x) + Math.abs(sensor.y - y) <= sensor.distance;
        }

        return result;
    }

    const max = 20;
    const cantBeABeacon = new Set();
    sensors.forEach((sensor) => {
        getCantBeABeacon(y, sensor).forEach((x) => {
            cantBeABeacon.add(x);
        });
    });

    sensors.forEach((sensor) => {
        if (sensor.beaconY === y) {
            cantBeABeacon.delete(sensor.beaconX);
        }
    });

    resolving.succeed(`Jour ${chalk.red(15)} - the answer is ${chalk.bold.magenta(cantBeABeacon.size)}`);
    console.timeEnd("exec");
}

main();
