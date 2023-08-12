const sqlite3 = require("sqlite3").verbose();
let sql;
let db = null;

// Create Table => sql = "CREATE TABLE users(id INTEGER PRIMARY KEY, gmail, token)";

// Open DB
function RunDB() {
    try {
        db = new sqlite3.Database("./test.db", sqlite3.OPEN_READWRITE, (err) => {
            if (err) return console.err(err.message);
        });
    } catch (error) {
        console.error(error.message);
    }

}

function InsertUser(gmail, token) {

    RunDB();

    if (!gmail) {
        console.error('Invalid gmail');
        db.close();
        return;
    }

    const insertQuery = 'INSERT INTO users (gmail, token) VALUES (?, ?)';
    const selectQuery = 'SELECT id FROM users WHERE gmail = ? LIMIT 1';

    db.serialize(() => {
        // Check if the gmail already exists
        db.get(selectQuery, [gmail], (err, row) => {
            if (err) {
                console.error('Error checking for existing gmail:', err.message);
                db.close();
                return;
            }

            if (row) {
                console.error('This User Already Exists!!!!');
                db.close();
                return;
            }

            // If the gmail doesn't exist, insert the user
            db.run(insertQuery, [gmail, token], (insertErr) => {
                if (insertErr) {
                    console.error('Error inserting user:', insertErr.message);
                } else {
                    console.log('User inserted successfully');
                }
                db.close();
            });
        });
    });
}

function UpdateUser(gmail, token) {

    RunDB();

    sql = `UPDATE users SET token = ? WHERE gmail = ?`

    db.serialize(() => {
        db.run(sql, [token, gmail], (err) => {
            if (err) return console.error(err.message);
        });

        db.close();
    });
}

function DeleteUser(gmail) {

    RunDB();

    sql = 'DELETE FROM users WHERE gmail=?'

    db.serialize(() => {
        db.run(sql, [gmail], (err) => {
            if (err) return console.error(err.message);
        });

        db.close();
    });
}

function DecreaseUserToken(gmail, value) {

    RunDB();

    //sql = `UPDATE users SET token = token - ${value} WHERE gmail = ?`;
    sql = `UPDATE users SET token = CASE WHEN token > 0 THEN token - ${value} ELSE 0 END WHERE gmail = ?`;

    db.serialize(() => {
        db.run(sql, [gmail], (err) => {
            if (err) return console.error(err.message);
        });

        db.close();
    });

}

function IncreaseUserToken(gmail, value) {

    RunDB();

    sql = `UPDATE users SET token = token + ${value} WHERE gmail = ?`;

    db.serialize(() => {
        db.run(sql, [gmail], (err) => {
            if (err) return console.error(err.message);
        });

        db.close();
    });

}

function PrintTable() {

    RunDB();

    sql = 'SELECT * FROM users'

    db.serialize(() => {
        db.all(sql, [], (err, rows) => {
            rows.forEach((row) => {
                console.log(row);
            })
        });

        db.close();
    });
}

function PrintTotalUsers() {

    RunDB();

    sql = 'SELECT COUNT(*) AS totalRows FROM users'

    db.get(sql, (err, row) => {
        if (err) {
            console.error('Error getting total row count:', err.message);
        } else {
            const totalRows = row.totalRows;
            console.log('Kullanıcı sayisi: ', totalRows);
        }
    });

    db.close();
}

module.exports = {
    InsertUser,
    PrintTable,
    UpdateUser,
    DeleteUser,
    PrintTotalUsers,
    IncreaseUserToken,
    DecreaseUserToken
};