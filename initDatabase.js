var mysql = require('mysql');
const fs = require("fs");
const path = require("path");
const { ipcRenderer } = require('electron');
var con = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: ''
});
var con2 = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "electronics"
});
const finishedBuildTable = () => {
    fs.readFile(path.join(__dirname, 'electronics.json'), (error, data) => {

        if (error) {

            console.error(error);

            throw error;
        }

        var info = JSON.parse(data);
        info.Initialized = "1";
        const dataUpdated = JSON.stringify(info);
        fs.writeFile(path.join(__dirname, 'electronics.json'), dataUpdated, (error) => {

            if (error) {

                console.error(error);

                throw error;
            }
            console.log("data.json written correctly");
            ipcRenderer.send('change-web-content', "index.html");
        });
    });
}
const inventories = () => {

    var sql = `
    CREATE TABLE if not exists inventories (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        costs DOUBLE NOT NULL ,
        sells DOUBLE NOT NULL ,
        expenses DOUBLE NOT NULL ,
        debt DOUBLE NOT NULL ,
        profit DOUBLE  GENERATED ALWAYS  AS (sells - (costs + expenses + debt)) ,
        description TEXT  ,
        created_at TIMESTAMP NOT NULL DEFAULT NOW() ,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now()
        )`;
    con2.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Table inventories created");
        finishedBuildTable()
    });
}
const Debt = () => {

    var sql = `
    CREATE TABLE if not exists Debt (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL ,
        phoneNumber int(11),
        totall DOUBLE NOT NULL ,
        description TEXT  ,
        clacualted INT(1) DEFAULT 0  ,
        paid INT(1) DEFAULT 0  ,
        created_at TIMESTAMP NOT NULL DEFAULT NOW() ,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now()
        )`;
    con2.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Table debt created");
        inventories()
    });
}
const expenses = () => {

    var sql = `
    CREATE TABLE if not exists expenses (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255)  ,
        totall DOUBLE NOT NULL ,
        description TEXT  ,
        clacualted INT(1) DEFAULT 0  ,
        created_at TIMESTAMP NOT NULL DEFAULT NOW() ,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now()
        )`;
    con2.query(sql, function(err, result) {
        if (err) throw err;
        Debt()
        console.log("Table expenses created");
    });
}
const selling_paymentsTable = () => {

    var sql = `
    CREATE TABLE if not exists selling_payments (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL ,
        code  VARCHAR(255),
        quantity INT(11) NOT NULL ,
        sellingPrice DOUBLE NOT NULL ,
        totall DOUBLE  GENERATED ALWAYS  AS (sellingPrice * quantity) ,
        description TEXT  ,
        clacualted INT(1) DEFAULT 0  ,
        created_at TIMESTAMP NOT NULL DEFAULT NOW() ,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
        CONSTRAINT fk_product_selling FOREIGN KEY (code)  
        REFERENCES products(code)  
        ON UPDATE CASCADE  
        ON DELETE SET NULL 
        )`;
    con2.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Table selling_payments created");
        expenses()
    });
}
const buying_paymentsTable = () => {

    var sql = `
    CREATE TABLE if not exists buying_payments (
        id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL ,
        code  VARCHAR(255) ,
        quantity INT(11) NOT NULL ,
        price DOUBLE NOT NULL ,
        sellingPrice DOUBLE NOT NULL ,
        totall DOUBLE NOT NULL ,
        description TEXT  ,
        clacualted INT(1) DEFAULT 0  ,
        created_at TIMESTAMP NOT NULL DEFAULT NOW() ,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now(),
        CONSTRAINT fk_product FOREIGN KEY (code)  
        REFERENCES products(code)  
        ON UPDATE CASCADE  
        ON DELETE SET NULL 
        )`;
    con2.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Table buying_payments created");
        selling_paymentsTable()
    });
}
const productsTable = () => {


    var sql = `
        CREATE TABLE if not exists products (
            id int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL ,
            code  VARCHAR(255) NOT NULL UNIQUE ,
            quantity INT(11) NOT NULL ,
            price DOUBLE NOT NULL ,
            sellingPrice DOUBLE NOT NULL ,
            description TEXT  ,
            created_at TIMESTAMP NOT NULL DEFAULT NOW() ,
            updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now()
            )`;
    con2.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Table products created");
        buying_paymentsTable()
    });

}
con.connect(function(err) {
    if (err) throw err;
    con.query("CREATE DATABASE if not exists electronics", function(err, result) {
        if (err) throw err;
        console.log("Database created");
        //////////////// tables
        productsTable()
    });
});