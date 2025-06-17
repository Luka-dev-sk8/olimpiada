const sql = require('mssql');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: parseInt(process.env.DB_PORT, 10),
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

app.post('/insertData', async (req, res) =>{
    console.log(">>req.body",req.body);
    const{nombre,email,contraseña} = req.body;

    try{
        let pool = await sql.connect(config);

        let result = await pool.request()
        .input('email', sql.VarChar,email)
        .query("SELECT COUNT (*) AS count FROM Clientes WHERE email = @email");
        console.log('registros con ese correo',result.recordset[0].count);

        if(result.recordset[0].count >0){
            return res.status(400).json({message: 'el correo ya esta registrado'
            });
        }

        await pool.request()


    }catch (err) {
        console.error('Error ejecutando la consulta', err);
        return res.status(500).json({ message: 'Error insertando datos.' });
    }

});

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log('✔ Conectado a SQL Server');
        return pool;
    })
    .catch(err => {
        console.error('❌ Error en la conexión con SQL Server:', err);
    });

module.exports = {
    sql, poolPromise
};
