const inquirer = require('inquirer');
const con = require('./connection.js');
const cTable = require('console.table');
// const query = require('./model/operations');

const mainMenuPrompt = [
    {
        type: "list",
        name: "mainMenuChoice",
        message: "What would you like to do?",
        choices: [
            "View all Employees.",
            "View all Roles.",
            "View all Departments.",
            "View Employees by Manager",
            "View Department Annual Salary Budget",
            "Add a new Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "Delete an Employee",
            "Add a new Role",
            "Delete a Role",
            "Add a new Department",
            "Delete a Department",
        ],
        loop: false,
        pageSize: 5
    },
];

//retrieve queries
function retrieveAllEmployee() {
    con.query("SELECT a.id, concat(a.first_name, ' ', a.last_name) as Employee, c.title, d.name AS Department, c.salary, concat(b.first_name, ' ', b.last_name) AS Manager FROM employee a LEFT JOIN employee b ON a.manager_id = b.id LEFT JOIN role c ON a.role_id = c.id LEFT JOIN department d ON c.department_id = d.id ORDER BY a.last_name, a.first_name", (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
            console.table(result);
            startMenu();
        }
    });
};

//function to retrieve list of managers, then passed to a function to display all employees for that manager.
function retrieveAllEmployeeMgr() {
    con.query("SELECT DISTINCT a.manager_id AS value, concat(b.first_name, ' ', b.last_name) AS name FROM employee a LEFT JOIN employee b ON a.manager_id = b.id ORDER BY name", (err, result) =>
    {
        if (err) throw err;
        if (result) { //console.log(result)
            inquirer.prompt([{
                type: "list",
                message: "Select a manager from the list of employees\n",
                name: "mgrId",
                choices: (result),
                loop: false
            }]).then((answers) => {
                displayAllEmployeeMgr(answers.mgrId)
                })
        };
    })
};

//function taking input from retrieve all employees by manager then displaying.
function displayAllEmployeeMgr(mgrId) {
    con.query("SELECT a.id, concat(a.first_name, ' ', a.last_name) as Employee, c.title, d.name AS Department, c.salary, concat(b.first_name, ' ', b.last_name) AS Manager FROM employee a LEFT JOIN employee b ON a.manager_id = b.id LEFT JOIN role c ON a.role_id = c.id LEFT JOIN department d ON c.department_id = d.id WHERE ? ORDER BY a.last_name, a.first_name",
    {
        'a.manager_id': mgrId
    },
    (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
            console.table(result);
            startMenu();
        }
    });
}

function retrieveAllDept() {
        con.query("select * from department", (err, result) =>
        {
            if (err) throw err;
            if (result)
            {

                console.table(result);
                startMenu();
            }
        });
};

function retrieveAllDeptBudget() {
    con.query("SELECT d.id AS DepartmentID, d.name AS Department, SUM(c.salary) AS TotalSalary FROM employee a LEFT JOIN role c ON a.role_id = c.id LEFT JOIN department d ON c.department_id = d.id GROUP BY d.name, d.id ORDER BY d.id", 
    (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
            console.table(result);
            startMenu(); 
        }
    });
};

function retrieveAllRole() {
    con.query("SELECT a.id, a.title, a.salary, b.name AS Department FROM role a LEFT JOIN department b ON a.department_id = b.id ORDER BY b.name, a.title", 
    (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
            console.table(result);         
            startMenu();

        };
    });
};


// function to handle main menu choices
function startMenu() {
    inquirer.prompt(mainMenuPrompt).then((answers) => {
        switch (answers.mainMenuChoice) {
            case "View all Employees.":
                retrieveAllEmployee();
                break;
            case "View all Roles.":
                retrieveAllRole();
                break;
            case "View all Departments.":
                retrieveAllDept();
                break;
            case "View Employees by Manager":
                retrieveAllEmployeeMgr();
                break;
            case "View Department Annual Salary Budget":
                retrieveAllDeptBudget();
                break;
        }
    })
};

startMenu();