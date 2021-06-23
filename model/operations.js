const con = require('../connection.js');
const cTable = require('console.table');

// retrieve queries to be exported.
function retrieveAllEmployee() {
    con.query("SELECT a.id, concat(a.first_name, ' ', a.last_name) as Employee, c.title, d.name AS Department, c.salary, concat(b.first_name, ' ', b.last_name) AS Manager FROM employee a LEFT JOIN employee b ON a.manager_id = b.id LEFT JOIN role c ON a.role_id = c.id LEFT JOIN department d ON c.department_id = d.id ORDER BY a.last_name, a.first_name", (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
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
            console.table(result); 
        }
    });
};

function retrieveAllRole() {
    con.query("SELECT a.id, a.title, a.salary, b.name AS Department FROM role a LEFT JOIN department b ON a.department_id = b.id ORDER BY b.name, a.title;", 
    (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
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
            console.table(result); 
        }
    });
};

retrieveAllDeptBudget();