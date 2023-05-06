var mysql = require('mysql');
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "electronics"
});
module.exports.uniqeColumn = (tabel, column, value, funcTrue, funcFail) => {
    var sql = `
select * from ${tabel} where  ${column} = ${isNaN(value) ? "\"" +value +"\""  : value}
`
    con.query(sql, function(err, result) {
        if (err) {
            throw err;
        };
        if (result.length > 0) {
            if (funcFail) {
                funcFail(result)
            }
        } else {
            funcTrue(result)
        }
    });

}