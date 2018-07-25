// Declare all packages needed
const mysql = require("mysql"),
    inquirer = require("inquirer"),
    Table = require("cli-table"),
    Color = require("colors");

// Declare variable for table
let table = new Table({
    head: ["Item ID", "Product", "Department", "Price", "Stock"],
    colWidths: [10, 40, 20, 15, 10],
});

// Establish connection to database
let connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon",
});

connection.connect(err => {
    if (err) throw err;
    console.log('connected as id " + connection.threadId + "\n"');
    startDisplay();
});

// Start the shopping experience with a display table of certain products
const startDisplay = () => {
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;

        let welcome =
            "██████╗  █████╗ ███╗   ███╗ █████╗ ███████╗ ██████╗ ███╗   ██╗ \n" +
            "██╔══██╗██╔══██╗████╗ ████║██╔══██╗╚══███╔╝██╔═══██╗████╗  ██║ \n" +
            "██████╔╝███████║██╔████╔██║███████║  ███╔╝ ██║   ██║██╔██╗ ██║ \n" +
            "██╔══██╗██╔══██║██║╚██╔╝██║██╔══██║ ███╔╝  ██║   ██║██║╚██╗██║ \n" +
            "██████╔╝██║  ██║██║ ╚═╝ ██║██║  ██║███████╗╚██████╔╝██║ ╚████║ \n" +
            "╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝ \n";

        console.log(
            `Welcome to \n\n${welcome} \n This is our current sell selection.\:`
        );

        for (let i = 0; i < res.length; i++) {
            table.push([
                res[i].item_id,
                res[i].product_name,
                res[i].department_name,
                res[i].price,
                res[i].stock_quantity,
            ]);
        }

        console.log(table.toString());

        startBam();
    });
};

// Main function to start the shopping experience
const startBam = () => {
    connection.query("SELECT * FROM products", (err, res) => {
        if (err) throw err;
        inquirer
            .prompt([{
                    type: "list",
                    name: "product",
                    message: "What would you like to purchase?",
                    choices: val => {
                        let prodArr = [];
                        for (i = 0; i < res.length; i++) {
                            prodArr.push(res[i].product_name);
                        }
                        return prodArr;
                    },
                },
                {
                    type: "input",
                    name: "quantity",
                    message: "How many do you want?",
                    validate: val => {
                        if (isNaN(val)) {
                            return false;
                        } else {
                            return true;
                        }
                    },
                },
            ])
            .then(answer => {
                let pickedProduct = res;
                for (let i = 0; i < res.length; i++) {
                    if (res[i].product_name == answer.product){
                        pickedProduct = res[i];
                    }
                }
                let quant = parseFloat(answer.quantity);
                // Verify order quantity against initial stock
                if (quant <= pickedProduct.stock_quantity) {
                    console.log("We can do that.");
                    // Update stock
                    let stock = pickedProduct.stock_quantity - parseFloat(answer.quantity);
                    // Obtain total cost to customer
                    let totalPrice = (quant * parseFloat(pickedProduct.price)).toFixed(2);
                    connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: stock}, {product_name: pickedProduct}], (err, res) => {
                        if (err) throw err;
                        console.log("Purchase successful!");
                        console.log(`Your total will be: $${totalPrice}`);
                    })
                }
                // If quantity is greater than stock
                else {
                    console.log(
                        "Not enough to fulfill your order, please make another selection."
                    );
                }
                recycle();
            });
    });
};

const recycle = () => {
    inquirer
        .prompt([{
            type: "list",
            name: "shop",
            message: "Did you want to see our selection again?",
            choices: ["Yes", "No"],
        }, ])
        .then(answer => {
            if (answer.shop === "Yes") {
                startDisplay();
            } else {
                console.log(
                    "Thank you for shopping Bamazon. We hope you enjoyed your experience. Good bye!"
                );
                connection.end();
            }
        });
};