var mysql = require('mysql');
const { ipcRenderer } = require('electron');
const electronics = require('./electronics')
var info;

var con;
var con2;

async function init() {
    info = await electronics.readConfig()
    con = mysql.createConnection({
        host: "localhost",
        user: info.mysql.user,
        password: info.mysql.password,
    });
    con2 = mysql.createConnection({
        host: "localhost",
        user: info.mysql.user,
        password: info.mysql.password,
        database: "electronics",
        multipleStatements: true
    });
    con.connect(function(err) {
        if (err) throw err;
        con.query("CREATE DATABASE if not exists electronics", function(err, result) {
            if (err) throw err;
            console.log("Database created");
            //////////////// tables
            productsTable()
        });
    });
}
const finishedBuildTable = async() => {
    info.Initialized = "1";
    await electronics.writeConfig(info)
    ipcRenderer.send('change-web-content', "index.html");
}
const setTriggers = () => {
    var sql =
        `
            drop trigger if exists delete_expenses_trigger ;
            CREATE TRIGGER delete_expenses_trigger AFTER  DELETE ON expenses FOR EACH ROW
            BEGIN
            CALL updateExpensesInventory (
                OLD.inventoryId
            );
            END;


            drop trigger if exists delete_costs_trigger ;
            CREATE TRIGGER delete_costs_trigger AFTER  DELETE ON buying_payments FOR EACH ROW
            BEGIN
            CALL updateCostsInventory (
                OLD.inventoryId
            );
            END ;


            drop trigger if exists delete_sells_trigger ;
            CREATE TRIGGER delete_sells_trigger AFTER  DELETE ON selling_payments FOR EACH ROW
            BEGIN
            CALL updateSellsInventory (
                OLD.inventoryId
            );
            END;


            drop trigger if exists delete_debt_trigger ;
            CREATE TRIGGER delete_debt_trigger AFTER  DELETE ON debt FOR EACH ROW
            BEGIN
            CALL updateDeptInventory (
                OLD.inventoryId
            );
            END ;








            drop trigger if exists update_expenses_trigger ;
            CREATE TRIGGER update_expenses_trigger AFTER  UPDATE ON expenses FOR EACH ROW
            BEGIN
            IF (NEW.totall <> OLD.totall) THEN
            CALL updateExpensesInventory (
                OLD.inventoryId
            );
            END IF;
            END ;
        
            drop trigger if exists update_debt_trigger ;
            CREATE TRIGGER update_debt_trigger AFTER  UPDATE ON debt FOR EACH ROW
            BEGIN
            IF ((NEW.paid <> OLD.paid) or (NEW.totall <> OLD.totall)) THEN
            CALL updateDeptInventory (
                OLD.inventoryId
            );
            END IF;
            END;
        
        
        
            drop trigger if exists update_costs_trigger ;
            CREATE TRIGGER update_costs_trigger AFTER  UPDATE ON buying_payments FOR EACH ROW
            BEGIN
            IF (NEW.totall <> OLD.totall) THEN
            CALL updateCostsInventory (
                OLD.inventoryId
            );
            END IF;
            END ;
        

            drop trigger if exists update_sells_trigger ;
            CREATE TRIGGER update_sells_trigger AFTER  UPDATE ON selling_payments FOR EACH ROW
            BEGIN
            IF (NEW.totall <> OLD.totall) THEN
            CALL updateSellsInventory (
                OLD.inventoryId
            );
            END IF;
            END;
        
        `;

    con2.query(sql, function(err, result) {
        if (err) throw err;
        console.log("triggers created successfully");
        finishedBuildTable()
    });
}
const setProcedures = () => {
    var sql =
        `
            drop PROCEDURE if exists updateDeptInventory ;
            CREATE PROCEDURE updateDeptInventory (IN invId INT(11))  
            BEGIN  
            DECLARE debt DOUBLE;
                SELECT SUM(totall) INTO debt FROM debt where inventoryId = invId and paid = 0;  
                IF (debt IS NULL) THEN
                SET debt = 0;
                END IF;
                update inventories set debt = debt where id = invId;
            END ;

            drop PROCEDURE if exists updateCostsInventory ;
            create PROCEDURE updateCostsInventory (IN invId INT(11))  
            BEGIN  
            DECLARE costs DOUBLE;
                SELECT SUM(totall) INTO costs FROM buying_payments where inventoryId = invId;  
                IF (costs IS NULL) THEN
                SET costs = 0;
                END IF;
                update inventories set  costs = costs where id = invId;
            END ;


            drop PROCEDURE if exists updateSellsInventory ;
            create PROCEDURE updateSellsInventory (IN invId INT(11))  
            BEGIN  
            DECLARE sells DOUBLE;
                SELECT SUM(totall) INTO sells FROM selling_payments where inventoryId = invId;  
                IF (sells IS NULL) THEN
                SET sells = 0;
                END IF;
                update inventories set  sells = sells  where id = invId;
            END ;


            drop PROCEDURE if exists updateExpensesInventory ;
            CREATE  PROCEDURE updateExpensesInventory (IN invId INT(11))  
            BEGIN  
            DECLARE expenses DOUBLE;
                SELECT SUM(totall) INTO expenses FROM expenses where inventoryId = invId;  
                IF (expenses IS NULL) THEN
                SET expenses = 0;
                END IF;
                update inventories set expenses = expenses where id = invId;
            END ;

        `;

    con2.query(sql, function(err, result) {
        if (err) throw err;
        console.log("procedures created successfully");
        setTriggers()
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
        reguler INT(1) DEFAULT 0  ,
        description TEXT  ,
        created_at TIMESTAMP NOT NULL DEFAULT NOW() ,
        updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE now()
        )`;
    con2.query(sql, function(err, result) {
        if (err) throw err;
        console.log("Table inventories created");
        setProcedures()
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
        inventoryId int(11),
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
        inventoryId int(11),
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
        inventoryId int(11),
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
        inventoryId int(11),
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
init()