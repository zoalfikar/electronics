const { exec } = require('child_process');
const fs = require("fs");
const path = require('path');
// for windows
module.exports.run = async() => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, 'electronics.json'), (error, data) => {
            if (error) {
                console.error(error);

                throw error;
            }
            const info = JSON.parse(data);
            let path = info.mysql.mysqlServerPath.replace('{subPath}', info.mysql.subPath.replace('{version}', info.mysql.version))
            let runCommand = info.mysql.mysqlServerPath.charAt(0) + ": & cd " + path + " & " + info.mysql.runCommand + ` -u ${info.mysql.user} --password=${info.mysql.password}`
            exec(runCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`error: ${error.message}`);
                    return;
                }

                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    return;
                }
                resolve(stdout)
            })
        })

    })
}
module.exports.run2 = async() => {
    return new Promise((resolve, reject) => {

        let runCommand = 'net start mysql'
        exec(runCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`error: ${error.message}`);
                return;
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            resolve(stdout)
        })
    })
}