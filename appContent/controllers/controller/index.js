var mysql = require('mysql');
var constraint = require('./constraint')
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
module.exports.mysqlConect = (sql, func) => {
    con.query(sql, func);
}

module.exports.insert = (tabel, values, funcTrue) => {
    var leftSql = ''
    var rightSql = ''
    for (const [key, value] of Object.entries(values)) {
        leftSql = leftSql + ` ${key}  ,`
    }
    for (const [key, value] of Object.entries(values)) {
        rightSql = rightSql + ` ${(typeof value === 'string')? "\"" +value +"\"," : value+' ,'}`
    }
    var sql = `INSERT INTO ${tabel} (
     ${leftSql.slice(0, -1)}
    )
    VALUES 
    (
        ${rightSql.slice(0, -1)}
    );`
    this.mysqlConect(sql, function(err, result) {
        if (err) {
            throw err;
        };
        console.log('data inserted');
        if (funcTrue) {
            funcTrue(result)
        }
    });

}
module.exports.update = (tabel, values, condtions, funcTrue) => {
    var leftSql = ''
    var rightSql = ''
    for (const [key, value] of Object.entries(values)) {
        leftSql = leftSql + ` ${key} = ${(value !== null) && (value !== '') ? (typeof value === 'string') ? "\"" +value +"\","  : value+' ,' : 'NULL ,'}`
    }
    for (const [key, value] of Object.entries(condtions)) {
        rightSql = rightSql + ` ${key} ${value.o} ${  (typeof value.v === 'string')? "\"" +value.v +"\" AND" : value.v+' AND' }`
    }
    leftSql = leftSql.slice(0, -1)
    rightSql = rightSql.slice(0, -3)

    var sql = ` update ${tabel}
    set ${leftSql}
    where ${rightSql};
    `;
    this.mysqlConect(sql, function(err, result) {
        if (err) {
            throw err;
        };
        console.log('data updated');
        if (funcTrue) {
            funcTrue(result)
        }
    });

}
module.exports.delet = (tabel, condtions, funcTrue) => {
    var rightSql = ''
    for (const [key, value] of Object.entries(condtions)) {
        rightSql = rightSql + ` ${key} ${value.o} ${(typeof value.v === 'string')? "\"" +value.v +"\" AND" : value.v+' AND'}`
    }
    rightSql = rightSql.slice(0, -3)

    var sql = ` 
    DELETE FROM ${tabel} WHERE ${rightSql} ;
    `;
    this.mysqlConect(sql, function(err, result) {
        if (err) {
            throw err;
        };
        console.log('data deleted');
        if (funcTrue) {
            funcTrue(result)
        }
    });

}
module.exports.selectAll = (tabel, funcTrue, funcFail) => {
    var sql = `
    select * ,DATE_FORMAT(created_at, '%p %h:%i:%s _ %a %Y/%m/%d') as created_at_formated , DATE_FORMAT(updated_at, '%p %h:%i:%s _ %a %Y/%m/%d') as updated_at_formated  from ${tabel} ;
    `
    this.mysqlConect(sql, function(err, result) {
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
module.exports.selectAllOrderedBy = (tabel, column, dir, funcTrue, funcFail) => {
    var sql = `
    select * ,DATE_FORMAT(created_at, '%p %h:%i:%s _ %a %Y/%m/%d') as created_at_formated , DATE_FORMAT(updated_at, '%p %h:%i:%s _ %a %Y/%m/%d') as updated_at_formated from ${tabel} 
    ORDER BY ${column} ${dir ? dir : 'ASC' };
    `
    this.mysqlConect(sql, function(err, result) {
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

module.exports.select = (tabel, values, funcTrue, funcFail) => {
    var innerSql = ''
    for (const [key, value] of Object.entries(values)) {
        innerSql = innerSql + ` ${key} = '${value}' AND`
    }
    var sql = `
    select * 
    from ${tabel} 
    WHERE ${innerSql.slice(0, -3)};
    `
    this.mysqlConect(sql, function(err, result) {
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
module.exports.selectWhere = (tabel, condtions, funcTrue) => {
    var innerSql = ''
    for (const [key, value] of Object.entries(condtions)) {
        innerSql = innerSql + `${value.r ? value.r : 'AND '} ${key} ${value.o} ${ (typeof value.v === 'string')? "\"" +value.v +"\"" : value.v }`
    }
    var sql = `
    select * 
    from ${tabel} 
    WHERE ${innerSql.slice(3)};
    `
    this.mysqlConect(sql, function(err, result) {
        if (err) {
            throw err;
        };
        if (funcTrue) {
            funcTrue(result)
        }
    });

}
module.exports.columnSumWhere = (tabel, column, condtions, funcTrue) => {
        var innerSql = ''
        for (const [key, value] of Object.entries(condtions)) {
            if (Array.isArray(value))
                value.forEach(v => {
                    innerSql = innerSql + `${v.r ? v.r : 'AND '} ${key} ${v.o} ${ (typeof v.v === 'string')? "\"" +v.v +"\"" : v.v }`
                });
            else
                innerSql = innerSql + `${value.r ? value.r : 'AND '} ${key} ${value.o} ${ (typeof value.v === 'string')? "\"" +value.v +"\"" : value.v }`
        }
        var sql = `
    select SUM(${column} ) AS sum
    from ${tabel} 
    WHERE ${innerSql.slice(3)};
    `
        this.mysqlConect(sql, function(err, result) {
            if (err) {
                throw err;
            };
            if (funcTrue) {
                funcTrue(result)
            }
        });

    }
    // module.exports.columnSumWhereMultiCond = (tabel, column, condtions, funcTrue) => {
    //     var innerSql = ''
    //     for (const [key, values] of Object.entries(condtions)) {
    //         values.forEach(value => {
    //             innerSql = innerSql + ` ${key} ${value.o} ${ isNaN(value.v)? "\"" +value.v +"\" AND" : value.v+' AND' }`
    //         });
    //     }
    //     var sql = `
    //     select SUM(${column} ) AS sum
    //     from ${tabel} 
    //     WHERE ${innerSql.slice(0, -3)};
    //     `
    //     this.mysqlConect(sql, function(err, result) {
    //         if (err) {
    //             throw err;
    //         };
    //         if (funcTrue) {
    //             funcTrue(result)
    //         }
    //     });

// }
module.exports.selectId = (tabel, value, funcTrue, funcFail) => {
    var sql = `
    select * 
    from ${tabel} 
    WHERE id = ${value} 
    LIMIT 1;
    `
    this.mysqlConect(sql, function(err, result) {
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
module.exports.uniqeColumn = (tabel, column, value, funcTrue, funcFail) => {
        constraint.uniqeColumn(tabel, column, value, funcTrue, funcFail)

    }
    // this.update("products", { name: 'aaa', quantity: 1 }, { code: { o: '=', v: 'zzz' } })
    // this.delet("buying_payments", { code: { o: '=', v: 'edwed' } })