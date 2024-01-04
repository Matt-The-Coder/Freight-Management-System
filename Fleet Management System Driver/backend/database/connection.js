const mysql = require('mysql')
const db = new mysql.createPool(
    {
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'fleet',
        port: 3307
    })
module.exports = (query) => 
{
    return new Promise((resolve, reject)=>
    {
        db.getConnection((err, connection)=>
        {
            if(err)
            {
                reject(err)
            }
            connection.query(query, (err, rows, fields)=>
            {
                if(err) reject(err)
                else
            {
                resolve(rows)
            }
            connection.release()
            })
        })
    })
}