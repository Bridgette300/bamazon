CREATE DATABASE bamazon;

use bamazon;

create table products (
        item_id INT AUTO_INCREMENT NOT NULL,
        product_name VARCHAR(50) NOT NULL,
        department_name VARCHAR(50) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        stock_quantity INT(10) NOT NULL,
        Primary Key (item_id)
);