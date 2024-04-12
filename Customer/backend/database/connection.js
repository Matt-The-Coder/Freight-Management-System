const mysql = require('mysql')
// const db = mysql.createPool(
//     {
//         host: 'localhost',
//         user: 'root',
//         password: '',
//         database: 'fleet',
//         port: 3306
//     })

const db = mysql.createPool({
    host: '194.110.173.106',
    user:'sust_matthew',
    password:'qwe',
    database: "sust_main",
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