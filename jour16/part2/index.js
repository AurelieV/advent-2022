const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const valves = {};
    rawInput.split("\n").forEach((line) => {
        const match = line.match(/^Valve (..) has flow rate=(\d+); tunnels{0,1} leads{0,1} to valves{0,1} (.+)$/);
        const [, id, rawRate, rawNext] = match;
        const rate = parseInt(rawRate);
        const next = rawNext.split(", ");

        valves[id] = {
            id,
            rate,
            next,
        };
    });
    const distances = {};
    function getMinimalDistanceFrom(id) {
        const _valves = JSON.parse(JSON.stringify(valves));
        for (const id in _valves) {
            _valves[id].distance = Infinity;
            _valves[id].isSolved = false;
            _valves[id].path = [];
        }
        let currentValve = _valves[id];
        currentValve.distance = 0;
        currentValve.isSolved = true;
        let remainingValveIds = Object.values(_valves)
            .map((v) => v.id)
            .filter((id) => !_valves[id].isSolved);
        while (remainingValveIds.length > 0) {
            currentValve.next.forEach((id) => {
                const valve = _valves[id];
                if (valve.isSolved) return;
                if (valve.distance > currentValve.distance + 1) {
                    valve.distance = currentValve.distance + 1;
                    valve.path = [...currentValve.path, id];
                }
            });
            remainingValveIds.sort((a, b) => _valves[a].distance - _valves[b].distance);
            const id = remainingValveIds.shift();
            currentValve = _valves[id];
            if (currentValve.distance === Infinity) break;
            currentValve.isSolved = true;
        }

        return Object.values(_valves).reduce((distances, valve) => {
            distances[valve.id] = { value: valve.distance, path: valve.path };
            return distances;
        }, {});
    }
    Object.keys(valves).forEach((id) => {
        distances[id] = getMinimalDistanceFrom(id);
    });

    const deltaMaxFromState = new Map();
    const TOTAL_TIME = 26;

    function getStateHash(state) {
        const remaining = state.remainingValveIds.sort().join(",");
        return `${state.time}_${remaining}_${state.position}`;
    }
    function getDeltaMaxFromState(state) {
        const hash = getStateHash(state);
        if (deltaMaxFromState.has(hash)) {
            return deltaMaxFromState.get(hash);
        }

        // Only take valve that can still be open in the remaining time
        const potentialNextValveToOpen = state.remainingValveIds.filter(
            (id) => state.time + distances[state.position][id].value + 1 < TOTAL_TIME
        );

        // No valve left
        if (potentialNextValveToOpen.length === 0) {
            deltaMaxFromState.set(hash, 0);
            return 0;
        }

        const deltas = potentialNextValveToOpen.map((valveId) => {
            const remainingValveIds = potentialNextValveToOpen.filter((id) => id !== valveId);
            const delta = getDeltaMaxFromState({
                remainingValveIds,
                time: state.time + distances[state.position][valveId].value + 1,
                position: valveId,
            });

            const remainingTime = TOTAL_TIME - (state.time + distances[state.position][valveId].value + 1);
            const addedPressure = remainingTime * valves[valveId].rate;

            return delta + addedPressure;
        });

        const result = Math.max(...deltas);
        deltaMaxFromState.set(hash, result);
        return result;
    }

    const startingValves = Object.keys(valves).filter((id) => valves[id].rate > 0);
    let groups = [];
    let size = 1;
    while (startingValves.length - size > size) {
        groups = groups.concat(
            getGroups(startingValves, size).map((group) => ({
                group: group.sort(),
                comp: startingValves.filter((item) => !group.includes(item)).sort(),
            }))
        );
        size++;
    }
    if (startingValves.length - size === size) {
        const subGroups = getGroups(startingValves, size).map((group) => ({
            group: group.sort(),
            comp: startingValves.filter((item) => !group.includes(item)).sort(),
        }));
        groups = groups.concat(
            subGroups.filter(({ comp }, index) => {
                const compIndex = subGroups.findIndex(({ group }) => isEqual(group, comp));
                return compIndex > index;
            })
        );
    }

    const maxes = groups.map(({ group, comp }) => {
        const myMax = getDeltaMaxFromState({
            time: 0,
            position: "AA",
            remainingValveIds: group,
        });
        const elephantMax = getDeltaMaxFromState({
            time: 0,
            position: "AA",
            remainingValveIds: comp,
        });

        return myMax + elephantMax;
    });

    const answer = Math.max(...maxes);

    resolving.succeed(`Jour ${chalk.red(16)} - the answer is ${chalk.bold.magenta(answer)}`);
    console.timeEnd("exec");
}

function getGroups(arr, size) {
    if (arr.length === size) {
        return [arr];
    }
    if (size === 1) {
        return arr.map((item) => [item]);
    }
    const [first, ...others] = arr;
    return getGroups(others, size - 1)
        .map((group) => [first, ...group]) // all groups which include first
        .concat(getGroups(others, size)); // all groups which does not includes first
}
function isEqual(arr, arr2) {
    return arr.join(",") === arr2.join(",");
}
main();
