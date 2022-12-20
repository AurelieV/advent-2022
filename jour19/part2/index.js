const fs = require("fs");
const path = require("path");
const ora = require("ora");
const chalk = require("chalk");

function main() {
    console.time("exec");
    const resolving = ora("Reading file").start();
    // const rawInput = fs.readFileSync(path.resolve(__dirname, "test.txt"), "utf-8");
    const rawInput = fs.readFileSync(path.resolve(__dirname, "input.txt"), "utf-8");

    const blueprints = rawInput.split("\n").map((line) => {
        const [
            ,
            id,
            oreCostForOreRobot,
            oreCostForClayRobot,
            oreCostForObsidianRobot,
            clayCostForObsidianRobot,
            oreCostForGeodeRobot,
            obsidianCostForGeodeRobot,
        ] = line.match(
            /^Blueprint (\d+): Each ore robot costs (\d+) ore. Each clay robot costs (\d+) ore. Each obsidian robot costs (\d+) ore and (\d+) clay. Each geode robot costs (\d+) ore and (\d+) obsidian.$/
        );

        return {
            id: parseInt(id),
            cookbooks: {
                ore: {
                    ore: parseInt(oreCostForOreRobot),
                    clay: 0,
                    obsidian: 0,
                },
                clay: {
                    ore: parseInt(oreCostForClayRobot),
                    clay: 0,
                    obsidian: 0,
                },
                obsidian: {
                    ore: parseInt(oreCostForObsidianRobot),
                    clay: parseInt(clayCostForObsidianRobot),
                    obsidian: 0,
                },
                geode: {
                    ore: parseInt(oreCostForGeodeRobot),
                    clay: 0,
                    obsidian: parseInt(obsidianCostForGeodeRobot),
                },
            },
        };
    });

    const max_time = 32;
    const initialState = {
        ore: 0,
        clay: 0,
        obsidian: 0,
        oreRobots: 1,
        clayRobots: 0,
        obsidianRobots: 0,
        geodes: 0,
        remainingTime: max_time,
    };

    function getHashState(state) {
        return `${state.remainingTime}__${state.ore}_${state.clay}_${state.obsidian}__${state.oreRobots}_${state.clayRobots}_${state.obsidianRobots}`;
    }

    function getMax(blueprint) {
        let currentMaxGeodesProduced = 0;
        const memory = new Map();

        const max = {
            ore: Math.max(...Object.values(blueprint.cookbooks).map((cookbook) => cookbook.ore)),
            clay: Math.max(...Object.values(blueprint.cookbooks).map((cookbook) => cookbook.clay)),
            obsidian: Math.max(...Object.values(blueprint.cookbooks).map((cookbook) => cookbook.obsidian)),
        };

        function searchMax(state) {
            // No need to build a robot as it will never produce something
            if (state.remainingTime <= 1) {
                currentMaxGeodesProduced = Math.max(state.geodes, currentMaxGeodesProduced);
                return;
            }

            // If we produce a robot each turn, we will never be better than the current max. Stop exploring
            const maxRobotsBuildable = state.remainingTime - 1;
            const productionIfOneRobotEachTurn = (maxRobotsBuildable * (maxRobotsBuildable + 1)) / 2;
            if (productionIfOneRobotEachTurn + state.geodes < currentMaxGeodesProduced) {
                return;
            }

            // Search the next robot we want to produce
            const nextProductionRobots = ["obsidian", "clay", "ore"].filter((type) => {
                // We produce enough of this, no need of more robots
                return state[`${type}Robots`] < max[type];
            });

            ["geode", ...nextProductionRobots].forEach((type) => {
                // Who much time we need to have the ressouces?
                const time = Math.max(
                    ...["ore", "clay", "obsidian"].map((ressource) => {
                        return blueprint.cookbooks[type][ressource] <= state[ressource]
                            ? 0
                            : Math.ceil(
                                  (blueprint.cookbooks[type][ressource] - state[ressource]) /
                                      state[`${ressource}Robots`]
                              );
                    })
                );
                if (time + 1 >= state.remainingTime) {
                    currentMaxGeodesProduced = Math.max(state.geodes, currentMaxGeodesProduced);
                    return;
                }
                const newState = {
                    ...state,
                    remainingTime: state.remainingTime - (time + 1), // time to have ressources + time to build
                    ore: state.ore + (time + 1) * state.oreRobots - blueprint.cookbooks[type].ore,
                    clay: state.clay + (time + 1) * state.clayRobots - blueprint.cookbooks[type].clay,
                    obsidian: state.obsidian + (time + 1) * state.obsidianRobots - blueprint.cookbooks[type].obsidian,
                };
                if (type === "geode") {
                    newState.geodes = state.geodes + newState.remainingTime;
                } else {
                    newState[`${type}Robots`] = state[`${type}Robots`] + 1;
                }
                searchMax(newState);
            });
        }

        searchMax(initialState);

        return currentMaxGeodesProduced;
    }

    const answer = blueprints.slice(0, 3).reduce((total, blueprint) => {
        const maxGeodes = getMax(blueprint);
        return maxGeodes * total;
    }, 1);

    resolving.succeed(`Jour ${chalk.red(19)} - the answer is ${chalk.bold.magenta(answer)}`);
    console.timeEnd("exec");
}

main();
