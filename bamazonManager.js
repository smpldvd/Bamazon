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
	manageInventory();
});

const manageInventory = () => {
	inquirer
		.prompt([
			{
				type: "list",
				name: "action",
				message: "What would you like to do?",
				choices: [
					"View Current Stock",
					"View Low Stock",
					"Add to Stock",
					"Add a New Product",
				],
			},
		])
		.then(answer => {
			switch (answer.action) {
				case "View Current Stock":
					showAll();
					break;
				case "View Low Stock":
					showLow();
					break;
				case "Add to Stock":
					addStock();
					break;
				case "Add New Product":
					addNew();
					break;
				default:
					showAll();
					break;
			}
		});
};

// Start the shopping experience with a display table of certain products
const showAll = () => {
	connection.query("SELECT * FROM products", (err, res) => {
		if (err) throw err;

		let welcome =
			"██████╗  █████╗ ███╗   ███╗ █████╗ ███████╗ ██████╗ ███╗   ██╗ \n" +
			"██╔══██╗██╔══██╗████╗ ████║██╔══██╗╚══███╔╝██╔═══██╗████╗  ██║ \n" +
			"██████╔╝███████║██╔████╔██║███████║  ███╔╝ ██║   ██║██╔██╗ ██║ \n" +
			"██╔══██╗██╔══██║██║╚██╔╝██║██╔══██║ ███╔╝  ██║   ██║██║╚██╗██║ \n" +
			"██████╔╝██║  ██║██║ ╚═╝ ██║██║  ██║███████╗╚██████╔╝██║ ╚████║ \n" +
			"╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝ \n";

		console.log(`${welcome} \n This is the current inventory quantity.\:`);

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

		manageInventory();
	});
};

const showLow = () => {
	connection.query("SELECT * FROM products WHERE stock_quantity < 5", (err, res) => {
      if (err) throw err;
      
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

			manageInventory();
		}
	);
};

const addStock = () => {
	connection.query("SELECT * FROM products", (err, res) => {
    if (err) throw err;
    
		inquirer.prompt([
      {
        type: "list",
        name: "product",
        message: "Which item are we replenishing?",
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
        message: "How much are you adding to stock?",
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
      for (let i = 0; i < res.length; i++) {
        let stock = res[i].stock_quantity;
        // Verify product name is same
        if (res.product_name >= answer.product) {
          // Update stock
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [
              { stock_quantity: stock + parseFloat(answer.quantity) },
              { product_name: answer.product },
            ],
            (err, res) => {
              if (err) throw err;
              console.log("Stock Quantity has been updated.");
            }
          );
        }
      }
      manageInventory();
    });
	});
};

const addNew = () => {
	inquirer.prompt([
    {
      type: "input",
      name: "product",
      message: "What is the name of the product?",
      validate: input => {
        if (!input) {
          return false;
          done("Please provide an item name");
        } else {
          return true;
        }
      },
    },
    {
      type: "input",
      name: "department",
      message: "Which department would the product be sold in?",
      validate: input => {
        if (!input) {
          return false;
          done("Please state the department");
        } else {
          return true;
        }
      },
    },
    {
      type: "input",
      name: "price",
      message: "How much is the sale price?",
      validate: val => {
        if (isNaN(val)) {
          return false;
          done("Please provide a price");
        } else {
          return true;
        }
      },
    },
    {
      type: "input",
      name: "quantity",
      message: "How many are we receiving?",
      validate: val => {
        if (isNaN(val)) {
          return false;
          done("Please state the quantity");
        } else {
          return true;
        }
      },
    },
  ])
  .then(answer => {
    connection.query(
      "INSERT INTO products SET ?",
      {
        product_name: answer.product,
        department_name: answer.department,
        price: answer.price,
        stock_quantity: answer.quantity,
      },
      (err, res) => {
        if (err) throw err;
        table.push([
          res.item_id,
          res.product_name,
          res.department_name,
          res.price,
          res.stock_quantity,
        ]);
        console.log(table.toString());
      }
    );
    manageInventory();
  });
};
