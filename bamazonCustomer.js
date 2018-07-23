const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('cli-table');
const Color = require('colors');

let connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id " + connection.threadId + "\n"');
    displayTable();
});

const displayTable = () => {
    console.log("Current Items for Purchase")
    connection.query('SELECT * FROM products', (err, res) => {
        if (err) throw err;
        let table = new Table({
            head: ['TH 1 Item ID', 'TH 2 Product', 'TH 3 Department', 'TH 4 Price', 'TH 5 Stock']
            , colWidths: [100, 200]
        });
        table.push()
    })
}