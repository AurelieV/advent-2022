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
    rawInput.split("\n").forEach((line, index) => {
        const match = line.match(/^Valve (..) has flow rate=(\d+); tunnels{0,1} leads{0,1} to valves{0,1} (.+)$/);
        const [, id, rawRate, rawNext] = match;
        const rate = parseInt(rawRate);
        const next = rawNext.split(", ");

        valves[id] = {
            id,
            rate,
            next,
            index,
        };
    });

    const distances = {};

    function getMinimalDistanceFrom(id) {
        const _valves = JSON.parse(JSON.stringify(valves));
        for (const id in _valves) {
            _valves[id].distance = Infinity;
            _valves[id].isSolved = false;
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
                }
            });
            remainingValveIds.sort((a, b) => _valves[a].distance - _valves[b].distance);
            const id = remainingValveIds.shift();
            currentValve = _valves[id];
            if (currentValve.distance === Infinity) break;
            currentValve.isSolved = true;
        }

        return Object.values(_valves).reduce((distances, valve) => {
            if (valve.id !== id) {
                distances[valve.id] = valve.distance;
            }
            return distances;
        }, {});
    }

    Object.keys(valves).forEach((id) => {
        distances[id] = getMinimalDistanceFrom(id);
    });

    const deltaMaxFromState = new Map();
    const initialState = {
        openedValves: {},
        time: 0,
        currentValve: "AA",
    };

    function getStateHash(state) {
        const opened = Object.keys(valves)
            .map((id) => (state.openedValves[id] ? "1" : "0"))
            .join("");
        return `${state.time}_${opened}_${state.currentValve}`;
    }

    function getDeltaMaxFromState(state) {
        const hash = getStateHash(state);
        if (deltaMaxFromState.has(hash)) {
            return deltaMaxFromState.get(hash);
        }
        const potentialNextValveToOpen = Object.keys(valves).filter(
            (id) =>
                valves[id].rate > 0 &&
                !state.openedValves[id] &&
                state.time + distances[state.currentValve][id] + 1 < 30
        );
        if (potentialNextValveToOpen.length === 0) {
            deltaMaxFromState.set(hash, 0);
            return 0;
        }
        const deltas = potentialNextValveToOpen.map((id) => {
            const delta = getDeltaMaxFromState({
                openedValves: { ...state.openedValves, [id]: true },
                time: state.time + distances[state.currentValve][id] + 1,
                currentValve: id,
            });

            const remainingTime = 30 - (state.time + distances[state.currentValve][id] + 1);
            const addedPressure = remainingTime * valves[id].rate;

            return delta + addedPressure;
        });

        const result = Math.max(...deltas);
        deltaMaxFromState.set(hash, result);
        return result;
    }

    const answer = getDeltaMaxFromState(initialState);

    resolving.succeed(`Jour ${chalk.red(16)} - the answer is ${chalk.bold.magenta(answer)}`);
    console.timeEnd("exec");
}

main();
