const con = require('../connection.js');
const cTable = require('console.table');

// class Department {
//     constructor(id, name) {
//         this.id = id;
//         this.name = name;
//     };
//     retrieve(id) {
//         var query = "select * from department where department.id = ?";
//         con.query(query, [id], (err, result) =>
//         {
//             if (err) throw err;
//             if (result)
//             {
//                 console.table(result); 
//             }
//         });
//     }
//     retrieveAll() {
//         var query = "select * from department";
//         con.query(query, (err, result) =>
//         {
//             if (err) throw err;
//             if (result)
//             {
//                 console.table(result); 
//             }
//         });
//     }
// }

function retrieveAll() {
    var query = "select * from department";
    con.query(query, (err, result) =>
    {
        if (err) throw err;
        if (result)
        {
            console.table(result); 
        }
    });
}

retrieveAll();