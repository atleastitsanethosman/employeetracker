const inquirer = require('inquirer');
const con = require('./connection.js');
const cTable = require('console.table');

// retrieve queries
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

//function to retrieve list of employees by manager with filter for manager.
const retrieveAllEmployeeMgr = () => {
    con.query("SELECT DISTINCT a.manager_id AS value, concat(b.first_name, ' ', b.last_name) AS name FROM employee a LEFT JOIN employee b ON a.manager_id = b.id ORDER BY name", (err, result) =>
    {
        if (err) throw err;
        if (result) { 
            inquirer.prompt([{
                type: "list",
                message: "Select a manager from the list of employees\n",
                name: "mgrId",
                choices: (result),
                loop: false
            }]).then((answers) => {
                con.query("SELECT a.id, concat(a.first_name, ' ', a.last_name) as Employee, c.title, d.name AS Department, c.salary, concat(b.first_name, ' ', b.last_name) AS Manager FROM employee a LEFT JOIN employee b ON a.manager_id = b.id LEFT JOIN role c ON a.role_id = c.id LEFT JOIN department d ON c.department_id = d.id WHERE ? ORDER BY a.last_name, a.first_name",
                    {
                        'a.manager_id': answers.mgrId
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
                })
        };
    })
};


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

// Add Queries follow
const addEmployee = () => {
    let newMgrId="";
    let newRoleId ="";
    con.query("SELECT DISTINCT a.manager_id AS value, concat(b.first_name, ' ', b.last_name) AS name FROM employee a LEFT JOIN employee b ON a.manager_id = b.id ORDER BY name", (err, result) =>
    {
        if (err) throw err;
        if (result) { 
            inquirer.prompt([{
                type: "list",
                message: "Select new employees manager from the list of employees",
                name: "mgrId",
                choices: (result),
                loop: false
            }]).then((answers) => {
                newMgrId = answers;
                con.query("SELECT id AS value, title AS name FROM role ORDER BY name", (err, result) =>
                {
                    if (err) throw err;
                    if (result) { 
                        inquirer.prompt([{
                            type: "list",
                            message: "Select new employees role from the list of roles",
                            name: "roleId",
                            choices: (result),
                            loop: false
                        }]).then((answers) => {
                            newRoleId = answers;
                            inquirer.prompt([
                                {
                                    name: "firstName",
                                    type: "input",
                                    message: "Enter new employee's first name",
                                    validate(value) {
                                        const pass = value.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u);
                                        if (pass) {
                                            return true;
                                        }
                                        return "Please enter a valid name"
                                    }
                                },
                                {
                                    name: "lastName",
                                    type: "input",
                                    message: "Enter new employee's last name",
                                    validate(value) {
                                        const pass = value.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u);
                                        if (pass) {
                                            return true;
                                        }
                                        return "Please enter a valid name"
                                    }
                                },
                            ]).then((answers) => {
                                con.query("INSERT INTO employee SET ?", 
                                {
                                    first_name: answers.firstName,
                                    last_name: answers.lastName,
                                    role_id: newRoleId.roleId,
                                    manager_id: newMgrId.mgrId
                                }, 
                                (err, result) =>
                                {
                                    if (err) throw err;
                                    if (result)
                                    {
                                        console.log(`${answers.firstName} ${answers.lastName} added`);
                                        startMenu();
                                    }
                                });
                                
                            })
                        })
            
                }
            })
        })
        }
    })
};

//prompts and queries to add a new role to database, includes validation on characters in title.
const addRole = () => {
    let newTitle;
    let newSalary;
    con.query("SELECT a.id, a.title, a.salary, b.name AS Department FROM role a LEFT JOIN department b ON a.department_id = b.id ORDER BY b.name, a.title", 
    (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
            console.table(result); 
            console.log("Please see current roles above, answer questions to add a new role\n")       
            inquirer.prompt([
                {
                    type: "input",
                    name: "title",
                    message: "Please enter the role title.",
                    validate(value) {
                        const pass = value.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u);
                        if (pass) {
                            return true;
                        }
                        return "Please enter a title using valid characters"
                    }
                },
                {
                    type: "number",
                    name: "salary",
                    message: "please enter the salary for the new role."
                }
            ]).then((answers) => {
                newTitle = answers.title;
                newSalary = answers.salary;
                con.query("SELECT id AS value, name FROM department ORDER BY name", (err, result) => {
                    if (err) throw err;
                    if (result)
                    {
                        inquirer.prompt(
                            {
                                type: "list",
                                name: "department",
                                message: "please select from available departments",
                                choices: (result),
                                loop: false
                            }
                        ).then((answers) => {
                            con.query("INSERT INTO role SET ?", 
                            {
                                title: newTitle,
                                salary: newSalary,
                                department_id: answers.department
                            }, 
                            (err, result) =>
                            {
                                if (err) throw err;
                                if (result)
                                {
                                    console.log(`${newTitle} added`);
                                    startMenu();
                                }
                            });
                        })
                    }
                })
    
            })
        };
    });
}

//prompts and sql statements to add a new department to our database
const addDepartment = () => {
    con.query("select * from department", (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
            console.table(result);
            inquirer.prompt({
                name: "newDept",
                type: "input",
                message: "Please see list of Departments above and provide new department name.",
                validate(value) {
                    const pass = value.match(/^[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,.'-]+$/u);
                    if (pass) {
                        return true;
                    }
                    return "Please enter a Department Name using letters"
                }
            }).then((answers) => {
                con.query("INSERT INTO department SET ?", 
                {
                    name: answers.newDept
                }, 
                (err, result) =>
                {
                    if (err) throw err;
                    if (result)
                    {
                        console.log(`${answers.newDept} Added`);
                        startMenu();
                    }
                })
            })
        }
    })
}

// Update queries are below this line.
const updateEmpRole = () => {
    let empId;
    con.query("SELECT id AS value, concat(first_name, ' ', last_name) as name FROM employee ORDER BY name", (err, result) => {
        if (err) throw err;
        if (result)
        {
            inquirer.prompt(
                {
                    name: "empId",
                    type: "list",
                    message: "select the employee to update",
                    choices: (result),
                    loop: false
                }
            ).then((answers) => {
                empId = answers.empId;
                con.query("SELECT id AS value, title AS name FROM role ORDER BY name", (err, result) =>
                {
                    if (err) throw err;
                    if (result) { 
                        inquirer.prompt([{
                            type: "list",
                            message: "Select new employees role from the list of roles",
                            name: "roleId",
                            choices: (result),
                            loop: false
                        }]).then((answers) => {
                            con.query("UPDATE employee SET ? WHERE ?", 
                            [    
                                {
                                    role_id: answers.roleId
                                }, 
                                {
                                    id: empId
                                }
                            ],
                            (err, result) =>
                            {
                                if (err) throw err;
                                if (result)
                                {
                                    console.log(`Role updated!`);
                                    startMenu();
                                }
                            });
                        })
                    }
                })
            })
        }
    });
}

const updateEmpMgr = () => {
    let empId;
    con.query("SELECT id AS value, concat(first_name, ' ', last_name, ' id:', id) as name FROM employee ORDER BY name", (err, result) => {
        if (err) throw err;
        if (result)
        {
            inquirer.prompt(
                {
                    name: "empId",
                    type: "list",
                    message: "select the employee to update",
                    choices: (result),
                    loop: false
                }
            ).then((answers) => {
                empId = answers.empId;
                con.query("SELECT id AS value, concat(first_name, ' ', last_name, ' id:', id) as name FROM employee ORDER BY name", (err, result) =>
                {
                    if (err) throw err;
                    if (result) { 
                        inquirer.prompt([{
                            type: "list",
                            message: "Select new manager from the list of employees",
                            name: "mgrId",
                            choices: (result),
                            loop: false
                        }]).then((answers) => {
                            con.query("UPDATE employee SET ? WHERE ?", 
                            [    
                                {
                                    manager_id: answers.mgrId
                                }, 
                                {
                                    id: empId
                                }
                            ],
                            (err, result) =>
                            {
                                if (err) throw err;
                                if (result)
                                {
                                    console.log(`Manager updated!`);
                                    startMenu();
                                }
                            });
                        })
                    }
                })
            })
        }
    });
}

// functions to handle record deletion
//function to delete employee
const deleteEmployee = () => {
    con.query("SELECT id AS value, concat(first_name, ' ', last_name, ' id:', id) as name FROM employee ORDER BY name", (err, result) => {
        if (err) throw err;
        if (result)
        {
            inquirer.prompt(
                {
                    name: "empId",
                    type: "list",
                    message: "select the employee to delete",
                    choices: (result),
                    loop: false
                }
            ).then((answers) => {
                con.query("DELETE FROM employee WHERE ?",  
                    {
                        id: answers.empId
                    },
                (err, result) =>
                {
                    if (err) throw err;
                    if (result)
                    {
                        console.log(`Employee Deleted!`);
                        startMenu();
                    }
                });
            })
        }
    })
}

//function to delete role
const deleteRole = () => {
    con.query("SELECT id AS value, title as name FROM role ORDER BY name", (err, result) => {
        if (err) throw err;
        if (result)
        {
            inquirer.prompt(
                {
                    name: "roleId",
                    type: "list",
                    message: "select the role to delete",
                    choices: (result),
                    loop: false
                }
            ).then((answers) => {
                con.query("DELETE FROM role WHERE ?",  
                    {
                        id: answers.roleId
                    },
                (err, result) =>
                {
                    if (err) throw err;
                    if (result)
                    {
                        console.log(`Role Deleted!`);
                        startMenu();
                    }
                });
            })
        }
    })
}

//function to delete a department.
const deleteDept = () => {
    con.query("SELECT id AS value, name FROM department ORDER BY name", (err, result) => {
        if (err) throw err;
        if (result)
        {
            inquirer.prompt(
                {
                    name: "roleId",
                    type: "list",
                    message: "select the department to delete",
                    choices: (result),
                    loop: false
                }
            ).then((answers) => {
                con.query("DELETE FROM Department WHERE ?",  
                    {
                        id: answers.roleId
                    },
                (err, result) =>
                {
                    if (err) throw err;
                    if (result)
                    {
                        console.log(`Department Deleted!`);
                        startMenu();
                    }
                });
            })
        }
    })
}

// function to handle main menu choices
function startMenu() {
    inquirer.prompt([
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
                "Exit"
            ],
            loop: false,
            pageSize: 5
        },
    ]).then((answers) => {
        switch (answers.mainMenuChoice) {
            case "View all Employees."://
                retrieveAllEmployee();
                break;
            case "View all Roles."://
                retrieveAllRole();
                break;
            case "View all Departments."://
                retrieveAllDept();
                break;
            case "View Employees by Manager"://
                retrieveAllEmployeeMgr();
                break;
            case "View Department Annual Salary Budget"://
                retrieveAllDeptBudget();
                break;
            case "Add a new Employee"://
                addEmployee();
                break;
            case "Update Employee Role"://
                updateEmpRole();
                break;
            case "Update Employee Manager"://
                updateEmpMgr();
                break;
            case "Delete an Employee"://
                deleteEmployee();
                break;
            case "Add a new Role": //
                addRole();
                break;
            case "Delete a Role": //
                deleteRole();
                break;
            case "Add a new Department": //
                addDepartment();
                break;
            case "Delete a Department": //
                deleteDept();
                break;
            case "Exit": //
                process.exit();
        }
    })
};

startMenu();