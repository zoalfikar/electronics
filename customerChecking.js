const { exec } = require('child_process');
const electronics = require('./electronics')

module.exports.check = async(prosseccorId) => {
    return new Promise(async(resolve, reject) => {
        // for windows
        const info = await electronics.readConfig()

        if (prosseccorId) {
            if (info.customers.includes(prosseccorId.toString())) {
                resolve(true)
            } else {
                resolve(false)
            }
        } else {
            exec("wmic CPU get ProcessorId", (error, stdout, stderr) => {
                if (error) {
                    console.error(`error: ${error.message}`);
                    return;
                }

                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                    return;
                }

                stdout = stdout.replace(/(\r\n|\n|\r)/gm, "").replace("ProcessorId", '').replaceAll(" ", "")
                if (info.customers.includes(stdout)) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            });
        }

    })
}