const inquirer = require('inquirer');
const fs = require('fs');

function appendUser() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the user\'s name. To cancel press ENTER: ',
        },
    ])
    .then((answers) => {
        if (!answers.name) {
            displayAllUsers();
        }
        else {
            inquirer.prompt([
            {
                type: 'list',
                name: 'gender',
                message: 'Choose your gender:',
                choices: ['Male', 'Female'],
            },
            {
                type: 'input',
                name: 'age',
                message: 'Enter the user\'s age: ',
                validate: function (value) {
                    const valid = !isNaN(value) && parseInt(value) >= 0;
                    return valid || 'Please enter your real age :)';
                },
            },
        ])
        .then((userDetails) => {
            const user = {
                name: answers.name,
                gender: userDetails.gender,
                age: userDetails.age,
            };
            appendUserToDatabase(user);
        });
        }
    });
}


function appendUserToDatabase(user) {
    fs.readFile('userDatabase.txt', 'utf8', (err, data) => {
        if (err) throw err;

        const users = data ? JSON.parse(data) : [];

        users.push(user);
        fs.writeFile('userDatabase.txt', JSON.stringify(users, null, 2), (err) => {
            if (err) throw err;
            appendUser();
        });
    });
}

function displayAllUsers() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'searchPrompt',
            message: 'Would you like to search values in DB? (Y/n): ',
        },
    ])
    .then((answer) => {
        if (answer.searchPrompt.toLowerCase() === 'y') {
            fs.readFile('userDatabase.txt', 'utf8', (err, data) => {
                if (err) throw err;
                const users = data ? JSON.parse(data) : [];
        
                if (users.length === 0) {
                    console.log('No users in the database.');
                } else {
                    console.log('All Users in the Database:');
                    users.forEach((user) => {
                        console.log({
                            user: user.name,
                            gender: user.gender,
                            age: user.age,
                        });
                    });
                }
        
                searchUser();
            });
        } else {
            searchUser();
        }
    });
}


function searchUser() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'searchName',
          message: 'Enter the name of the user you want to search for:',
        },
      ])
      .then((answers) => {
        const searchName = answers.searchName.trim().toLowerCase();
        fs.readFile('userDatabase.txt', 'utf8', (err, data) => {
          if (err) throw err;
          const users = data ? JSON.parse(data) : [];
  
          const foundUsers = users.filter((user) =>
            user.name.toLowerCase().includes(searchName)
          );
  
          if (foundUsers.length === 0) {
            console.log('User not found in the database.');
          } else {
            foundUsers.forEach((user) => {
                console.log(`${user.name} was Found:`);
                console.log({
                    user: user.name,
                    gender: user.gender,
                    age: user.age,
                });
            });
          }
  
          process.exit();
        });
    });
}

appendUser();