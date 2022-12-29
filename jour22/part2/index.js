const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

const DIRECTIONS = [
    { dx: 1, dy: 0 }, // RIGHT
    { dx: 0, dy: 1 }, // BOTTOM
    { dx: -1, dy: 0 }, // LEFT
    { dx: 0, dy: -1 }, // TOP
];

const TOP = 3;
const BOTTOM = 1;
const RIGHT = 0;
const LEFT = 2;

const DIRECTIONS_LABEL = ["RIGHT", "BOTTOM", "LEFT", "TOP"];

// const CUBE_SIZE = 4;
const CUBE_SIZE = 50;

// const FACES = {
//     1: { id: "1", minX: CUBE_SIZE * 2, minY: 0 },
//     2: { id: "2", minX: 0, minY: CUBE_SIZE },
//     3: { id: "3", minX: CUBE_SIZE, minY: CUBE_SIZE },
//     4: { id: "4", minX: CUBE_SIZE * 2, minY: CUBE_SIZE },
//     5: { id: "5", minX: CUBE_SIZE * 2, minY: CUBE_SIZE * 2 },
//     6: { id: "6", minX: CUBE_SIZE * 3, minY: CUBE_SIZE * 2 },
// };
const FACES = {
    1: { id: "1", minX: CUBE_SIZE, minY: 0 },
    2: { id: "2", minX: CUBE_SIZE * 2, minY: 0 },
    3: { id: "3", minX: CUBE_SIZE, minY: CUBE_SIZE },
    4: { id: "4", minX: 0, minY: CUBE_SIZE * 2 },
    5: { id: "5", minX: CUBE_SIZE, minY: CUBE_SIZE * 2 },
    6: { id: "6", minX: 0, minY: CUBE_SIZE * 3 },
};

function getFace(x, y) {
    const face = Object.values(FACES).find(
        (face) => face.minX <= x && face.minY <= y && face.minX + CUBE_SIZE - 1 >= x && face.minY + CUBE_SIZE - 1 >= y
    );
    return face.id;
}

// const CHANGES = {
//     1: {
//         [TOP]: {
//             newDirection: BOTTOM,
//             newFace: "2",
//             getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1 - relativeX,
//             getRelativeY: (relativeX, relativeY) => 0,
//         },
//         [BOTTOM]: {
//             newDirection: BOTTOM,
//             newFace: "4",
//             getRelativeX: (relativeX, relativeY) => relativeX,
//             getRelativeY: (relativeX, relativeY) => 0,
//         },
//         [LEFT]: {
//             newDirection: BOTTOM,
//             newFace: "3",
//             getRelativeX: (relativeX, relativeY) => relativeX,
//             getRelativeY: (relativeX, relativeY) => 0,
//         },
//         [RIGHT]: {
//             newDirection: LEFT,
//             newFace: "6",
//             getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1,
//             getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1 - relativeY,
//         },
//     },
//     2: {
//         [TOP]: {
//             newDirection: BOTTOM,
//             newFace: "1",
//             getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1 - relativeX,
//             getRelativeY: (relativeX, relativeY) => 0,
//         },
//         [BOTTOM]: {
//             newDirection: TOP,
//             newFace: "5",
//             getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1 - relativeX,
//             getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1,
//         },
//         [LEFT]: {
//             newDirection: TOP,
//             newFace: "6",
//             getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1 - relativeY,
//             getRelativeY: (relativeX, relativeY) => 0,
//         },
//         [RIGHT]: {
//             newDirection: RIGHT,
//             newFace: "3",
//             getRelativeX: (relativeX, relativeY) => 0,
//             getRelativeY: (relativeX, relativeY) => relativeY,
//         },
//     },
//     3: {
//         [TOP]: {
//             newDirection: RIGHT,
//             newFace: "1",
//             getRelativeX: (relativeX, relativeY) => 0,
//             getRelativeY: (relativeX, relativeY) => relativeX,
//         },
//         [BOTTOM]: {
//             newDirection: RIGHT,
//             newFace: "5",
//             getRelativeX: (relativeX, relativeY) => 0,
//             getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1 - relativeX,
//         },
//         [LEFT]: {
//             newDirection: LEFT,
//             newFace: "2",
//             getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1,
//             getRelativeY: (relativeX, relativeY) => relativeY,
//         },
//         [RIGHT]: {
//             newDirection: RIGHT,
//             newFace: "4",
//             getRelativeX: (relativeX, relativeY) => 0,
//             getRelativeY: (relativeX, relativeY) => relativeY,
//         },
//     },
//     4: {
//         [TOP]: {
//             newDirection: RIGHT,
//             newFace: "1",
//             getRelativeX: (relativeX, relativeY) => relativeX,
//             getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1,
//         },
//         [BOTTOM]: {
//             newDirection: BOTTOM,
//             newFace: "5",
//             getRelativeX: (relativeX, relativeY) => relativeX,
//             getRelativeY: (relativeX, relativeY) => 0,
//         },
//         [LEFT]: {
//             newDirection: LEFT,
//             newFace: "3",
//             getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1,
//             getRelativeY: (relativeX, relativeY) => relativeY,
//         },
//         [RIGHT]: {
//             newDirection: BOTTOM,
//             newFace: "6",
//             getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1 - relativeY,
//             getRelativeY: (relativeX, relativeY) => 0,
//         },
//     },
//     5: {
//         [TOP]: {
//             newDirection: TOP,
//             newFace: "4",
//             getRelativeX: (relativeX, relativeY) => relativeX,
//             getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1,
//         },
//         [BOTTOM]: {
//             newDirection: TOP,
//             newFace: "2",
//             getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1 - relativeX,
//             getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1,
//         },
//         [LEFT]: {
//             newDirection: TOP,
//             newFace: "3",
//             getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1 - relativeY,
//             getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1,
//         },
//         [RIGHT]: {
//             newDirection: RIGHT,
//             newFace: "6",
//             getRelativeX: (relativeX, relativeY) => 0,
//             getRelativeY: (relativeX, relativeY) => relativeY,
//         },
//     },
//     6: {
//         [TOP]: {
//             newDirection: LEFT,
//             newFace: "4",
//             getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1,
//             getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1 - relativeX,
//         },
//         [BOTTOM]: {
//             newDirection: RIGHT,
//             newFace: "2",
//             getRelativeX: (relativeX, relativeY) => 0,
//             getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1 - relativeX,
//         },
//         [LEFT]: {
//             newDirection: LEFT,
//             newFace: "5",
//             getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1,
//             getRelativeY: (relativeX, relativeY) => relativeY,
//         },
//         [RIGHT]: {
//             newDirection: LEFT,
//             newFace: "1",
//             getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1,
//             getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1 - relativeY,
//         },
//     },
// };
const CHANGES = {
    1: {
        [TOP]: {
            newDirection: RIGHT,
            newFace: "6",
            getRelativeX: (relativeX, relativeY) => 0,
            getRelativeY: (relativeX, relativeY) => relativeX,
        },
        [BOTTOM]: {
            newDirection: BOTTOM,
            newFace: "3",
            getRelativeX: (relativeX, relativeY) => relativeX,
            getRelativeY: (relativeX, relativeY) => 0,
        },
        [LEFT]: {
            newDirection: RIGHT,
            newFace: "4",
            getRelativeX: (relativeX, relativeY) => 0,
            getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1 - relativeY,
        },
        [RIGHT]: {
            newDirection: RIGHT,
            newFace: "2",
            getRelativeX: (relativeX, relativeY) => 0,
            getRelativeY: (relativeX, relativeY) => relativeY,
        },
    },
    2: {
        [TOP]: {
            newDirection: TOP,
            newFace: "6",
            getRelativeX: (relativeX, relativeY) => relativeX,
            getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1,
        },
        [BOTTOM]: {
            newDirection: LEFT,
            newFace: "3",
            getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1,
            getRelativeY: (relativeX, relativeY) => relativeX,
        },
        [LEFT]: {
            newDirection: LEFT,
            newFace: "1",
            getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1,
            getRelativeY: (relativeX, relativeY) => relativeY,
        },
        [RIGHT]: {
            newDirection: LEFT,
            newFace: "5",
            getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1,
            getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1 - relativeY,
        },
    },
    3: {
        [TOP]: {
            newDirection: TOP,
            newFace: "1",
            getRelativeX: (relativeX, relativeY) => relativeX,
            getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1,
        },
        [BOTTOM]: {
            newDirection: BOTTOM,
            newFace: "5",
            getRelativeX: (relativeX, relativeY) => relativeX,
            getRelativeY: (relativeX, relativeY) => 0,
        },
        [LEFT]: {
            newDirection: BOTTOM,
            newFace: "4",
            getRelativeX: (relativeX, relativeY) => relativeY,
            getRelativeY: (relativeX, relativeY) => 0,
        },
        [RIGHT]: {
            newDirection: TOP,
            newFace: "2",
            getRelativeX: (relativeX, relativeY) => relativeY,
            getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1,
        },
    },
    4: {
        [TOP]: {
            newDirection: RIGHT,
            newFace: "3",
            getRelativeX: (relativeX, relativeY) => 0,
            getRelativeY: (relativeX, relativeY) => relativeX,
        },
        [BOTTOM]: {
            newDirection: BOTTOM,
            newFace: "6",
            getRelativeX: (relativeX, relativeY) => relativeX,
            getRelativeY: (relativeX, relativeY) => 0,
        },
        [LEFT]: {
            newDirection: RIGHT,
            newFace: "1",
            getRelativeX: (relativeX, relativeY) => 0,
            getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1 - relativeY,
        },
        [RIGHT]: {
            newDirection: RIGHT,
            newFace: "5",
            getRelativeX: (relativeX, relativeY) => 0,
            getRelativeY: (relativeX, relativeY) => relativeY,
        },
    },
    5: {
        [TOP]: {
            newDirection: TOP,
            newFace: "3",
            getRelativeX: (relativeX, relativeY) => relativeX,
            getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1,
        },
        [BOTTOM]: {
            newDirection: LEFT,
            newFace: "6",
            getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1,
            getRelativeY: (relativeX, relativeY) => relativeX,
        },
        [LEFT]: {
            newDirection: LEFT,
            newFace: "4",
            getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1,
            getRelativeY: (relativeX, relativeY) => relativeY,
        },
        [RIGHT]: {
            newDirection: LEFT,
            newFace: "2",
            getRelativeX: (relativeX, relativeY) => CUBE_SIZE - 1,
            getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1 - relativeY,
        },
    },
    6: {
        [TOP]: {
            newDirection: TOP,
            newFace: "4",
            getRelativeX: (relativeX, relativeY) => relativeX,
            getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1,
        },
        [BOTTOM]: {
            newDirection: BOTTOM,
            newFace: "2",
            getRelativeX: (relativeX, relativeY) => relativeX,
            getRelativeY: (relativeX, relativeY) => 0,
        },
        [LEFT]: {
            newDirection: BOTTOM,
            newFace: "1",
            getRelativeX: (relativeX, relativeY) => relativeY,
            getRelativeY: (relativeX, relativeY) => 0,
        },
        [RIGHT]: {
            newDirection: TOP,
            newFace: "5",
            getRelativeX: (relativeX, relativeY) => relativeY,
            getRelativeY: (relativeX, relativeY) => CUBE_SIZE - 1,
        },
    },
};

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const map = new Map();

    let [rawMap, instructions] = rawInput.split("\n\n");
    const lines = rawMap.split("\n");
    lines.forEach((line, y) => {
        [...line].forEach((carac, x) => {
            if (carac === " ") return;
            map.set(`${x}_${y}`, { x, y, isStop: carac === "#", face: getFace(x, y) });
        });
    });

    let direction = 0; // RIGHT
    const face1Points = [...map.values()].filter((point) => point.face === "1");
    let x = Math.min(...face1Points.map((point) => point.x));
    let y = 0;

    console.log(`\n== Starting from ${x},${y} ==`);

    function getNext(x, y) {
        const { dx, dy } = DIRECTIONS[direction];
        const point = map.get(`${x}_${y}`);
        const face = FACES[point.face];

        const relativeX = x - face.minX;
        const relativeY = y - face.minY;

        const newRelativeX = relativeX + dx;
        const newRelativeY = relativeY + dy;

        if (newRelativeX >= 0 && newRelativeX < CUBE_SIZE && newRelativeY >= 0 && newRelativeY < CUBE_SIZE) {
            const newX = newRelativeX + face.minX;
            const newY = newRelativeY + face.minY;
            console.log(`No need to wrap, next is ${newX},${newY}`);
            return { point: map.get(`${newX}_${newY}`), newDirection: direction };
        }

        const { newDirection, getRelativeX, getRelativeY, newFace } = CHANGES[point.face][direction];

        const newX = getRelativeX(relativeX, relativeY) + FACES[newFace].minX;
        const newY = getRelativeY(relativeX, relativeY) + FACES[newFace].minY;

        console.log(`Wrapping, next is ${newX},${newY}, turning to ${DIRECTIONS_LABEL[newDirection]}`);
        return { point: map.get(`${newX}_${newY}`), newDirection };
    }

    function executeMovement(count) {
        console.log(`***=== Executing ${count}, direction ${DIRECTIONS_LABEL[direction]} ===`);
        while (count > 0) {
            const { point, newDirection } = getNext(x, y);
            if (point.isStop) {
                console.log("== Not doing this movement, STOP ==");
                return;
            }
            console.log("== Doing this movement, CONTINUE ==");
            x = point.x;
            y = point.y;
            direction = newDirection;
            console.log(`== Currently at ${x},${y}, looking ${DIRECTIONS_LABEL[direction]}`);
            count--;
        }
    }
    function executeRotation(rotation) {
        if (rotation === "R") {
            direction = (direction + 1) % 4;
        } else {
            direction = (direction - 1 + 4) % 4; // avoid negative modulo
        }
        console.log(`=== Rotation ${rotation}, new direction ${DIRECTIONS_LABEL[direction]} ===`);
    }

    while (instructions.length > 0) {
        const [, movement, rotation, next] = instructions.match(/^(\d+)(R|L)?(.*)$/);

        executeMovement(parseInt(movement));
        if (rotation) {
            executeRotation(rotation);
        }
        instructions = next;
    }

    console.log(`Column: ${x + 1}, row: ${y + 1}, direction: ${DIRECTIONS_LABEL[direction]} `);
    const answer = 1000 * (y + 1) + 4 * (x + 1) + direction;

    resolving.succeed(`Jour ${chalk.red(22)} - the answer is ${chalk.bold.magenta(answer)}`);
    console.timeEnd("exec");
}

main();
