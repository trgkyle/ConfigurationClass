// Requirement dependencies
const yaml = require('js-yaml');
const fs = require('fs');

class Configuration {

    constructor(filepath, encoding = 'utf8') { 
        try {
            if (Configuration.instance == null) {
                this.data = yaml.load(fs.readFileSync(filepath, encoding));    
                Configuration.instance = this;
            }
            return Configuration.instance;
        } catch (e) {
            console.log(e);
        }
    }

    getData() {
        return this.data;
    }

    saveToFile(fileName) {
        const yml = yaml.dump(this.data);
        fs.writeFileSync(`${fileName}.yml`, yml, (err) => {
            if (err) {
                console.log(err);
            } 
        })
        console.log(`${fileName}.yml saved`);
    }

    convertToJson() {
        return JSON.stringify(this.data);
    }

    getKeyAndValueFrom(obj, parentKey, arr) {
        if (typeof(obj) == 'object') {
            for (const key in obj) {
                if (parentKey == "") {
                    this.getKeyAndValueFrom(obj[key], key, arr);
                } else {
                    this.getKeyAndValueFrom(obj[key], parentKey + "." + key, arr);
                }
            }
        } else {
            arr.key.push(parentKey);
            arr.value.push(obj);
            arr.valueType.push(typeof(obj));
        }
    }

    setKey(keyName, val) {
        try {
            const keySplit = keyName.split('.');
            var obj = this.data.env;
            for (let i = 0; i < keySplit.length - 1; ++ i) {
                obj = obj[keySplit[i]];
            }
            if (typeof(val) != typeof(obj[keySplit[keySplit.length - 1]])) {
                console.log("Canot set value with different type!");
                return;
            }
            obj[keySplit[keySplit.length - 1]] = val;
            console.log("Set value success");
        } catch (e) {
            console.log("Key not Exist");
            console.log(e);
        }
    }

    getAllKeyAndValue() {
        var from_default = {
            key: [],
            value: [],
            valueType: [],
        }
        this.getKeyAndValueFrom(this.data.env.default, '', from_default);

        var from_dev = {
            key: [],
            value: [],
            valueType: [],
        }
        this.getKeyAndValueFrom(this.data.env.dev, '', from_dev);

        var from_prod = {
            key: [],
            value: [],
            valueType: [],
        }
        this.getKeyAndValueFrom(this.data.env.dev, '', from_prod);

        console.log("default=====================================");
        for (let i = 0; i < from_default.key.length ; ++ i) {
            console.log(from_default.key[i] + " * " + from_default.value[i] + " * " + from_default.valueType[i]);
        }
        console.log("dev=====================================");
        for (let i = 0; i < from_dev.key.length ; ++ i) {
            console.log(from_dev.key[i] + " * " + from_dev.value[i] + " * " + from_dev.valueType[i]);
        }
        console.log("prod=====================================");
        for (let i = 0; i < from_prod.key.length ; ++ i) {
            console.log(from_prod.key[i] + " * " + from_prod.value[i] + " * " + from_prod.valueType[i]);
        }
    }

   

  
}
const config = new Configuration('./sample.yml', 'utf8');
module.exports = config;