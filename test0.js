var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "1111",
    database: "electronics"
});
const selectAllOrderedBy = (tabel, column, dir, funcTrue, funcFail) => {
    var sql = `
    select * ,DATE_FORMAT(created_at, '%p %h:%i:%s _ %a %Y/%m/%d') as created_at_formated , DATE_FORMAT(updated_at, '%p %h:%i:%s _ %a %Y/%m/%d') as updated_at_formated from ${tabel} 
    ORDER BY ${column} ${dir};
    `
    con.query(sql, function(err, result) {
        if (err) {
            throw err;
        };

        if (result.length > 0) {
            funcTrue(result)
        } else {
            if (funcFail) {
                funcFail(result)
            }
        }

    });

}
module.exports.allDebts = () => {
        return new Promise((resolve, reject) => {
            selectAllOrderedBy('debt', 'created_at', 'DESC', (r) => {
                for (let index = 0; index < r.length; index++) {
                    r[index] = JSON.stringify(r[index]);
                }
                for (let index = 0; index < r.length; index++) {
                    r[index] = JSON.parse(r[index]);
                }
                resolve(r)
            })
        })
    }
    // this.allDebts().then((r) => {

//     console.log(r);
// })