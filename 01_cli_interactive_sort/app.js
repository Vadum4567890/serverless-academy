const readline = require('readline');

const read = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

function getInput() {
    read.question('Hello. Enter 10 words or digits deviding them in spaces(or type "exit" to quit):', (input) => {
        if (input.toLowerCase() === 'exit') {
            read.close();
        }
        else {
            const data = input.split(' ');
            requestSortOptions(data);
        }
    });
}

function requestSortOptions(data) {
    read.question(`How would you like to sort values:\n
    1. Words by name (form A to Z).
    2. Show digits from the smallest.
    3. Show digits from the bigest.
    4. Words by quantity of leters. 
    5. Only unique words.\n\n
    Select (1-5) and press ENTER:`, (option) => {
        sortOptions(data, parseInt(option));
    });
}

function sortOptions(data, option) {
    let sortedData;
    switch (option) {
        case 1:
            sortedData = data.sort();
            break;
        case 2:
            sortedData = data.filter(x => !isNaN(x)).sort((a, b) => a - b);
            break;
        case 3:
            sortedData = data.filter(x => !isNaN(x)).sort((a, b) => b - a);
            break;
        case 4:
            sortedData = data.sort((a, b) => a.length - b.length);
            break;
        case 5:
            sortedData = data.filter(x => isNaN(x)).filter((value, index, self) => self.indexOf(value) === index);
            break; 
        default:
            console.log("Try again");
            break;
    }
    const result = '[' + sortedData.map(x => `'${x}'`).join(', ') + ']';
    console.log(result);
    getInput();
}
getInput();

