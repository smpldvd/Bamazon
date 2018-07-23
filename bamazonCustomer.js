const mysql = require('mysql');
const inquirer = require('inquirer');
const Table = require('cli-table');
const Color = require('colors');
let table = new Table({
    head: ['Item ID', 'Product', 'Department', 'Price', 'Stock']
    , colWidths: [10, 40, 20, 15, 10]
});

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
    connection.query('SELECT * FROM products', (err, res) => {
        if (err) throw err;

        let welcome = 
            '██████╗  █████╗ ███╗   ███╗ █████╗ ███████╗ ██████╗ ███╗   ██╗ \n' +
            '██╔══██╗██╔══██╗████╗ ████║██╔══██╗╚══███╔╝██╔═══██╗████╗  ██║ \n' +
            '██████╔╝███████║██╔████╔██║███████║  ███╔╝ ██║   ██║██╔██╗ ██║ \n' +
            '██╔══██╗██╔══██║██║╚██╔╝██║██╔══██║ ███╔╝  ██║   ██║██║╚██╗██║ \n' +
            '██████╔╝██║  ██║██║ ╚═╝ ██║██║  ██║███████╗╚██████╔╝██║ ╚████║ \n' +
            '╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝ \n';

        console.log(`Welcome to \n\n${welcome} \n This is our current sell selection.\:`);
                                                              
        for (let i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity])
        }

        console.log(table.toString());

        shopTable();
    });
};

const shopTable = () => {
    inquirer.prompt([
        {
            type: "list",
            name: "product",
            message: "What would you like to purchase?",
            choices: val => {
                let prodArr = [];
                for (i = 0; i < res.length; i++) {
                    prodArr.push(res[i].product_name);
                }
            }
        },
        {
            type: "input",
            name: "quantity",
            message: "How many do you want?",
            validate: val => {
                if (isNaN(val)) {
                    return false;
                }
                else {
                    return true;
                }
            }
        },
    ]).then(answer => {
        let quant = parseFloat(answer.quantity);
    })
    connection.end();
    
};