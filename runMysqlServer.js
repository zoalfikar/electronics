const { exec } = require('child_process');
const electronics = require('./electronics')
    // for windows
module.exports.run = async() => {
    const info = await electronics.readConfig()
    return new Promise(async(resolve, reject) => {
        var ckeckCommand = `sc query ${info.mysql.service} | findstr /i "STATE"`;

        exec(ckeckCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`error: ${error.message}`);
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
            if (stdout.includes('RUNNING')) {
                console.log('sever already running');
                resolve(1)
            } else {
                let runCommand = `net start ${info.mysql.service}`
                exec(runCommand, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`error: ${error.message}`);
                    }

                    if (stderr) {
                        console.error(`stderr: ${stderr}`);
                    }
                    resolve(1)
                })
            }
        })
    })
}
module.exports.run2 = async() => {
    return new Promise(async(resolve, reject) => {

        const info = await electronics.readConfig();

        let path = info.mysql.mysqlServerPath.replace('{subPath}', info.mysql.subPath.replace('{version}', info.mysql.version))
        let runCommand = info.mysql.mysqlServerPath.charAt(0) + ": & cd " + path + " &  mysqld" + ` -u ${info.mysql.user} --password=${info.mysql.password}`
        exec(runCommand, (error, stdout, stderr) => {
            if (error) {
                console.error(`error: ${error.message}`);
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
            }
            console.log(stdout);
            resolve(1)
        })
    })

}