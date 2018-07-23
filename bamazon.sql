CREATE DATABASE IF NOT EXISTS bamazon;

USE bamazon;

CREATE TABLE IF NOT EXISTS products (
    item_id INT(5) UNSIGNED AUTO_INCREMENT NOT NULL
    , product_name VARCHAR(100) NOT NULL
    , department_name VARCHAR(100)
    , price DEC(10, 2) NOT NULL
    , stock_quantity INT(10)
    , PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Nerf Elite Strongarm", "Toys", 12.99, 40)
, ("Mega Man X Lagacy Collection", "Video Games", 39.99, 100)
, ("Chopped Celery in Water", "Grocery", 7.99, 5)
, ("Waifu Body Pillow", "Home & Garden", 24.59, 10)
, ("Banana Hammock Draw-String Shorts", "Men's Fashion", 6.69, 25)
, ("David Bowie Knife", "Sports", 22.50, 30)
, ("Gum Drop Mosquito Repellant", "Outdoors", 9.99, 75)
, ("SlapStick Men's Razor", "Health & Beauty", 12.49, 120)
, ("Fifty Shades of Gay", "Books", 14.99, 50)
, ("Hamtaro Exercise Wheel", "Pets Supplies", 9.58, 20);

SELECT * FROM products;


