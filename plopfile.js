module.exports = function (plop) {
    plop.setGenerator("jour", {
        description: "Génère un dossier pour un jour de l'AoC",
        prompts: [
            {
                type: "number",
                name: "day",
                message: "Pour quel jour?",
            },
        ],
        actions: [
            {
                type: "add",
                path: "jour{{day}}/part1/index.js",
                templateFile: "plop/index.js.hbs",
            },
            {
                type: "add",
                path: "jour{{day}}/part1/input.txt",
            },
            {
                type: "add",
                path: "jour{{day}}/part1/test.txt",
            },
        ],
    });
};
