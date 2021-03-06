const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UsersRespository extends Repository{
    async create(attrs){
        attrs.id = this.randomId();

        const salt = crypto.randomBytes(8).toString('hex');
        const buf = await scrypt(attrs.pass, salt, 64);

        const records = await this.getAll();
        const record = {
            ...attrs,
            pass: `${buf.toString('hex')}.${salt}`
        };
        records.push(record);

        await this.writeAll(records);

        return record;
    }

    async comparePassword(saved, supplied){
        const [hashed, salt] = saved.split('.');
        const hasehedSupplied = await scrypt(supplied, salt, 64);

        return hashed === hasehedSupplied.toString('hex');
    }
}

module.exports = new UsersRespository('users.json');