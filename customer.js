let mysql = require('mysql');
let inquirer = require('inquirer');
require('console.table');

//initialize connection
let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'Bridge',
    password: '12345',
    database: 'bamazon'
});

//test connection
connection.connect(function(err) {
    if (err) {
        console.log('Error connecting: ' + err.stack);
    }
    //console.log(connection.threadId);
  loadProducts();
});

function loadProducts() {
    let query = 'Select * FROM products';
    connection.query(query, function(err,res){
        console.table(res);
        //console.log(res);
        //prompt customer for product
       promptCustomerForItem(res);

    });
}

function promptCustomerForItem(inventory) {
    inquirer.prompt([{
        type: 'input',
        message: 'What is the ID of the item you would like to purchase?',
        name: 'choice'
    }]).then(function(val) {
        let choiceId = parseInt(val.choice);
        let product = checkInventory(choiceId, inventory);
        if (product) {
          promptCustomerForQuantity(product);
        } else {
            console.log('That item is not in our inventory');
            endProduct();
        }
    });
}
function promptCustomerForQuantity(product) {
    inquirer.prompt([{
        type: 'input',
        message: 'How many would you like?',
        name: 'quantity',
    }]).then(function(val){
        let quantity = parseInt(val.quantity);
        if(quantity > product.stock_quantity) {
            console.log('not enough');
            endProduct();
        } else {
            makePurchase(product, quantity);
            console.log('Success! You have purchase(d) ' + quantity + ' of the ' + product.product_name + ' product(s).');
            //loadProducts();
        }
    });
}

function makePurchase(product, quantity) {
    connection.query(
        //update database
        'UPDATE products SET stock_quantity = stock_quantity - ? WHERE item_id = ?',
        [quantity, product.item_id],
        function(err, res) {
            
            //loadProducts();
            endProduct();
        }
    )
}
function checkInventory(choiceId, inventory) {
    for (var i = 0; i < inventory.length; i++) {
        if (inventory[i].item_id === choiceId) {
            return inventory[i];
        }
    }
    return null;
}

function endProduct() {
    ///display table
    let query = 'Select * FROM products';
    connection.query(query, function(err,res){
        console.table(res);
         //prompt user for another purchase
    inquirer.prompt([{
        type: 'confirm',
        message: 'Would you like to make another purchase?',
        name: 'confirm',
    }]).then(function(){
        if(confirm === true) {
            loadProducts();
        } else {
            console.log("Thank you. Please return again!");
            return;
           
        }
    });

    });
  
    
}
