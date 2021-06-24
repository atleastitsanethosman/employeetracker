const con = require('../connection.js');
const cTable = require('console.table');

// retrieve queries to be exported.
function retrieveAllEmployee() {
    con.query("SELECT a.id, concat(a.first_name, ' ', a.last_name) as Employee, c.title, d.name AS Department, c.salary, concat(b.first_name, ' ', b.last_name) AS Manager FROM employee a LEFT JOIN employee b ON a.manager_id = b.id LEFT JOIN role c ON a.role_id = c.id LEFT JOIN department d ON c.department_id = d.id ORDER BY a.last_name, a.first_name", (err, result) =>
    {
        if (err) throw err;
        // if (result)
        // {
        //     console.log("  \n"); //making sure table stars on new line.
        //     console.table(result); 
        // }
    });
};

function retrieveAllEmployeeMgr(mgrId) {
    con.query("SELECT a.id, concat(a.first_name, ' ', a.last_name) as Employee, c.title, d.name AS Department, c.salary, concat(b.first_name, ' ', b.last_name) AS Manager FROM employee a LEFT JOIN employee b ON a.manager_id = b.id LEFT JOIN role c ON a.role_id = c.id LEFT JOIN department d ON c.department_id = d.id WHERE ? ORDER BY a.last_name, a.first_name",
    {
        'a.manager_id': mgrId
    },
     (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
            console.log("  \n"); //making sure table stars on new line.
            console.table(result); 
        }
    });
};

function retrieveAllDept() {
        con.query("select * from department", (err, result) =>
        {
            if (err) throw err;
            if (result)
            {
                console.log("  \n"); //making sure table stars on new line.
                console.table(result); 
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
            console.log("  \n"); //making sure table stars on new line.
            console.table(result); 
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
            console.log("  \n"); //making sure table stars on new line.
            console.table(result); 
        }
    });
};


// create query statements to be updated.
function addEmployee(firstName, lastName, roleId, managerID) {
    con.query("INSERT INTO employee SET ?", 
    {
        first_name: firstName,
        last_name: lastName,
        role_id: roleId,
        manager_id: managerID
    }, 
    (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
            console.log("  \n"); //making sure table stars on new line.
            console.table(result); 
        }
    });
};

function addRole(title, salary, departmentId) {
    con.query("INSERT INTO role SET ?", 
    {
        title: title,
        salary: salary,
        department_id: departmentId
    }, 
    (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
            console.log("  \n"); //making sure table stars on new line.
            console.table(result); 
        }
    });
};

function addDepartment(departmentName) {
    con.query("INSERT INTO department SET ?", 
    {
        name: departmentName
    }, 
    (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
            console.log("  \n"); //making sure table stars on new line.
            console.table(result); 
        }
    });
};

// Update Queries for database
function updateEmpRole(employeeId, roleId) {
    con.query("UPDATE employee SET ? WHERE ?", 
    [    
        {
            role_id: roleId
        }, 
        {
            id: employeeId
        }
    ],
    (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
            console.log("  \n"); //making sure table stars on new line.
            console.table(result); 
        }
    });
};

function updateEmpMgr(employeeId, mgrId) {
    con.query("UPDATE employee SET ? WHERE ?", 
    [    
        {
            manager_id: mgrId
        }, 
        {
            id: employeeId
        }
    ],
    (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
            console.log("  \n"); //making sure table stars on new line.
            console.table(result); 
        }
    });
};

//Destroy or Delete record functions are below.
function deleteEmployee(employeeId) {
    con.query("DELETE FROM employee WHERE ?", 
    {
        id: employeeId
    }, 
    (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
            console.log("  \n"); //making sure table stars on new line.
            console.table(result); 
        }
        
    });
};

//checks to ensure no orphan employee records are left with that role by querying and checking lenth.
function deleteRole(roleId) {
    con.query("SELECT a.id, concat(a.first_name, ' ', a.last_name) as Employee, c.title, d.name AS Department, c.salary, concat(b.first_name, ' ', b.last_name) AS Manager FROM employee a LEFT JOIN employee b ON a.manager_id = b.id LEFT JOIN role c ON a.role_id = c.id LEFT JOIN department d ON c.department_id = d.id WHERE ? ORDER BY a.last_name, a.first_name",
    {
        'a.role_id': roleId
    },
     (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
            if (result.length > 0) {
                console.log("  \n"); //making sure table stars on new line.
                console.table(result);
                console.log("You must alter these employee's roles or delete these employees first!\n")
            } else {
                con.query("DELETE FROM role WHERE ?", 
                {
                    id: roleId
                }, 
                (err, result) =>
                {
                    if (err) throw err;
                    if (result)
                    {
                        console.log("  \n"); //making sure table stars on new line.
                        console.table(result); 
                    }
                });
                };
            }
        }
    )
};

//checks to ensure no orphan role records are left with that department by querying and checking lenth.
function deleteDept(departmentId) {
    con.query("SELECT a.id, a.title, a.salary, b.name AS Department FROM role a LEFT JOIN department b ON a.department_id = b.id WHERE ? ORDER BY b.name, a.title",
    {
        'a.department_id': departmentId
    },
     (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
            if (result.length > 0) {
                console.log("  \n"); //making sure table stars on new line.
                console.table(result);
                console.log("You must alter these roles' departments or delete these roles first!\n")
            } else {
                con.query("DELETE FROM department WHERE ?", 
                {
                    id: departmentId
                }, 
                (err, result) =>
                {
                    if (err) throw err;
                    if (result)
                    {
                        console.log("  \n"); //making sure table stars on new line.
                        console.table(result); 
                    }
                });
                };
            }
        }
    )
};

module.exports = {
    retrieveAllEmployee,
    retrieveAllEmployeeMgr,
    retrieveAllDept,
    retrieveAllDeptBudget,
    retrieveAllRole,
    addEmployee,
    addRole,
    addDepartment,
    updateEmpRole,
    updateEmpMgr,
    deleteEmployee,
    deleteRole,
    deleteDept
}