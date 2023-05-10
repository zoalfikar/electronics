const jfe = require("json-file-encrypt");
const fs = require("fs");
const path = require("path");

let key1 = new jfe.encryptor("electronics-v1");

module.exports.writeConfig = (data) => {

    return new Promise((resolve, reject) => {
        let encrypted = key1.encrypt(JSON.stringify(data));

        fs.writeFile(path.join(__dirname, 'electronics.confige.txt'), encrypted, (error) => {

            if (error) {
                console.error(error);

                throw error;
            }
            console.log("data.json written correctly");
            resolve(1)
        });
    })
}
module.exports.readConfig = () => {
        return new Promise((resolve, reject) => {
            fs.readFile(path.join(__dirname, 'electronics.confige.txt'), 'utf8', (error, data) => {
                if (error) {
                    console.error(error);
                    throw error;
                }
                var json = key1.decrypt(data.toString())
                json = JSON.parse(json)
                console.log('reading complete');
                resolve(json)
            })
        })
    }
    // var confige = {};
    // fs.readFile(path.join(__dirname, 'electronics.json'), (error, data) => {
    //     if (error) {
    //         console.error(error);
    //         throw error;
    //     }
    //     confige = JSON.parse(data)
    //     console.log('reading complete');
    //     this.writeConfig(confige)
    // })