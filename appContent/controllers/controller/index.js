var mysql = require('mysql');
var constraint = require('./constraint')
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "electronics"
});
module.exports.mysqlConect = (sql, func) => {
    con.query(sql, function(err, result) {
        if (err) {
            throw err;
        };
        func(result)
    });

}

module.exports.insert = (tabel, values, funcTrue) => {
    var leftSql = ''
    var rightSql = ''
    for (const [key, value] of Object.entries(values)) {
        leftSql = leftSql + ` ${key}  ,`
    }
    for (const [key, value] of Object.entries(values)) {
        rightSql = rightSql + ` ${isNaN(value)? "\"" +value +"\"," : value+' ,'}`
    }
    var sql = `INSERT INTO ${tabel} (
     ${leftSql.slice(0, -1)}
    )
    VALUES 
    (
        ${rightSql.slice(0, -1)}
    )`
    con.query(sql, function(err, result) {
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
        leftSql = leftSql + ` ${key} = ${(value !== null) && (value !== '') ? isNaN(value) ? "\"" +value +"\","  : value+' ,' : 'NULL ,'}`
    }
    for (const [key, value] of Object.entries(condtions)) {
        rightSql = rightSql + ` ${key} ${value.o} ${  isNaN(value.v)? "\"" +value.v +"\" AND" : value.v+' AND' }`
    }
    leftSql = leftSql.slice(0, -1)
    rightSql = rightSql.slice(0, -3)

    var sql = ` update ${tabel}
    set ${leftSql}
    where ${rightSql};
    `;
    con.query(sql, function(err, result) {
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
        rightSql = rightSql + ` ${key} ${value.o} ${isNaN(value.v)? "\"" +value.v +"\" AND" : value.v+' AND'}`
    }
    rightSql = rightSql.slice(0, -3)

    var sql = ` 
    DELETE FROM ${tabel} WHERE ${rightSql}
    `;
    con.query(sql, function(err, result) {
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
    select * ,DATE_FORMAT(created_at, '%p %H:%i %Y/%m/%d') as created_at , DATE_FORMAT(updated_at, '%p %H:%i %Y/%m/%d') as updated_at  from ${tabel} 
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
module.exports.selectAllOrderedBy = (tabel, column, dir, funcTrue, funcFail) => {
    var sql = `
    select * ,DATE_FORMAT(created_at, '%p %H:%i %Y/%m/%d') as created_at , DATE_FORMAT(updated_at, '%p %H:%i %Y/%m/%d') as updated_at from ${tabel} 
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
module.exports.selectWhere = (tabel, condtions, funcTrue) => {
    var innerSql = ''
    for (const [key, value] of Object.entries(condtions)) {
        innerSql = innerSql + ` ${key} ${value.o} ${ isNaN(value.v)? "\"" +value.v +"\" AND" : value.v+' AND' }`
    }
    var sql = `
    select * 
    from ${tabel} 
    WHERE ${innerSql.slice(0, -3)};
    `
    con.query(sql, function(err, result) {
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
        innerSql = innerSql + ` ${key} ${value.o} ${ isNaN(value.v)? "\"" +value.v +"\" AND" : value.v+' AND' }`
    }
    var sql = `
    select SUM(${column} ) AS sum
    from ${tabel} 
    WHERE ${innerSql.slice(0, -3)};
    `
    con.query(sql, function(err, result) {
        if (err) {
            throw err;
        };
        if (funcTrue) {
            funcTrue(result)
        }
    });

}
module.exports.selectId = (tabel, value, funcTrue, funcFail) => {
    var sql = `
    select * 
    from ${tabel} 
    WHERE id = ${value} 
    LIMIT 1;
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
module.exports.uniqeColumn = (tabel, column, value, funcTrue, funcFail) => {
        constraint.uniqeColumn(tabel, column, value, funcTrue, funcFail)

    }
    // this.update("products", { name: 'aaa', quantity: 1 }, { code: { o: '=', v: 'zzz' } })
    // this.delet("buying_payments", { code: { o: '=', v: 'edwed' } })