// Requirement dependencies
const yaml = require('js-yaml');
const fs = require('fs');

class Configuration {

    constructor(filepath, encoding = 'utf8') { 
        if (this.data === null) {
            try {
                this.data = yaml.load(fs.readFileSync(filepath, encoding));            
            } catch (error) {
                console.log(error);
            }
        }
        
        return this;
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

    getKeyAndValue(obj, ParentKey) {
        if (obj.children) {
            for (const key in obj.children) {
                this.getKeyAndValue(obj.children[key], ParentKey + '.' + obj.name);
            }
        } else {
            for (const key in obj) {
                if (key != 'name') {
                    console.log(`${ParentKey}.${obj.name}.${key}: ${obj[key]}`);
                }
            }
            console.log(`${ParentKey}.${obj.name}.value.type: ${typeof(obj.value)}`);
        }
    }




   


    
}
const config = new Configuration('./sample.yml', 'utf8');
module.exports = config;