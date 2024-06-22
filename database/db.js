const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'api-lifebloodid.adirdk.blog',
    user: 'adik8393_admin',
    password: ')3uVn33W^)T8',
    database: 'adik8393_db_lifebloodid'
});

module.exports = pool.promise();