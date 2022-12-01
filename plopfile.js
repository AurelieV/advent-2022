module.exports = function (plop) {
    plop.setGenerator('jour', {
        description: 'Génère un dossier pour un jour de l\'AoC',
        prompts: [
            {
                type: 'number',
                name: 'day',
                message: 'Pour quel jour?'
            }
        ],
        actions: [
            {
                type: 'add',
                path: 'jour{{day}}/index.js',
                templateFile: 'plop/index.js.hbs'
            },
            {
                type: 'add',
                path: 'jour{{day}}/input.txt'
            },
            {
                type: 'add',
                path: 'jour{{day}}/test.txt'
            }
        ]
    })
}