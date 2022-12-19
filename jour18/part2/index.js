const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test_2.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const lava = {};
    const air = {};

    rawInput.split("\n").forEach((line) => {
        const [x, y, z] = line.split(",");

        lava[`${x}_${y}_${z}`] = {
            x: parseInt(x),
            y: parseInt(y),
            z: parseInt(z),
        };
    });

    const VOISINS = [
        { dx: 1, dy: 0, dz: 0 },
        { dx: -1, dy: 0, dz: 0 },
        { dx: 0, dy: 1, dz: 0 },
        { dx: 0, dy: -1, dz: 0 },
        { dx: 0, dy: 0, dz: 1 },
        { dx: 0, dy: 0, dz: -1 },
    ];

    const maxX = Math.max(...Object.values(lava).map(({ x }) => x));
    const minX = Math.min(...Object.values(lava).map(({ x }) => x));
    const maxY = Math.max(...Object.values(lava).map(({ y }) => y));
    const minY = Math.min(...Object.values(lava).map(({ y }) => y));
    const maxZ = Math.max(...Object.values(lava).map(({ z }) => z));
    const minZ = Math.min(...Object.values(lava).map(({ z }) => z));

    Object.values(lava).forEach(({ x, y, z }) => {
        VOISINS.forEach(({ dx, dy, dz }) => {
            const voisinKey = `${x + dx}_${y + dy}_${z + dz}`;
            if (!lava[voisinKey]) {
                if (!air[voisinKey]) {
                    air[voisinKey] = {
                        lavaCount: 0,
                        x: x + dx,
                        y: y + dy,
                        z: z + dz,
                        isExternal:
                            x + dx > maxX ||
                            y + dy > maxY ||
                            z + dz > maxZ ||
                            x + dx < minX ||
                            y + dy < minY ||
                            z + dz < minZ,
                    };
                }
                air[voisinKey].lavaCount++;
            }
        });
    });

    function checkCube(x, y, z) {
        const key = `${x}_${y}_${z}`;
        if (lava[key]) {
            return { havetoBreak: true, haveToMarked: false };
        }
        if (air[key] && !air[key]?.isExternal) {
            return { havetoBreak: true, haveToMarked: false };
        }
        if (air[key]?.isExternal || z > maxZ || z < minZ || x > maxX || x < minX || y > maxY || y < minY) {
            return { havetoBreak: false, haveToMarked: true };
        }
        return { havetoBreak: false, haveToMarked: false };
    }

    let marked = 1;
    while (marked > 0) {
        const airToCheck = Object.values(air).filter((air) => !air.isExternal);
        marked = 0;
        airToCheck.forEach((air) => {
            for (let { dx, dy, dz } of VOISINS) {
                let x = air.x + dx;
                let y = air.y + dy;
                let z = air.z + dz;

                let { havetoBreak = false, haveToMarked = false } = checkCube(x, y, z);
                while (!havetoBreak && !haveToMarked) {
                    x += dx;
                    y += dy;
                    z += dz;
                    const check = checkCube(x, y, z);
                    haveToMarked = check.haveToMarked;
                    havetoBreak = check.havetoBreak;
                }
                if (haveToMarked) {
                    air.isExternal = true;
                    marked++;
                    break;
                }
            }
        });
    }

    const answer = Object.values(air).reduce((total, cube) => (cube.isExternal ? cube.lavaCount + total : total), 0);

    resolving.succeed(`Jour ${chalk.red(18)} - the answer is ${chalk.bold.magenta(answer)}`);
    console.timeEnd("exec");
}

main();
