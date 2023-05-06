const fs = require("fs");
const { exec } = require('child_process');
const path = require('path')

module.exports.check = (prosseccorId) => {
    return new Promise((resolve, reject) => {
        // for windows
        exec("wmic CPU get ProcessorId", (error, stdout, stderr) => {
            if (error) {
                console.error(`error: ${error.message}`);
                return;
            }

            if (stderr) {
                console.error(`stderr: ${stderr}`);
                return;
            }
            fs.readFile(path.join(__dirname, 'electronics.json'), (error, data) => {
                if (error) {
                    console.error(error);

                    throw error;
                }
                const info = JSON.parse(data);
                stdout = stdout.replace(/(\r\n|\n|\r)/gm, "").replace("ProcessorId", '').replaceAll(" ", "")
                if (info.customers.includes(stdout)) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            })
        });
    })

}