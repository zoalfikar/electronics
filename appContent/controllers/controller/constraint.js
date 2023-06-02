var mysql = require('mysql');
const electronics = require('../../../electronics')
var info;
var con;

async function init() {
    info = await electronics.readConfig()
    con = mysql.createConnection({
        host: "localhost",
        user: info.mysql.user,
        password: info.mysql.password,
        database: "electronics"
    });
}
init();

module.exports.uniqeColumn = (tabel, column, value, funcTrue, funcFail) => {
    var sql = `
select * from ${tabel} where  ${column} = ${(typeof value === 'string') ? "\"" +value +"\""  : value}
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