const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const urlEncodedParser = bodyParser.urlencoded({extended:false});
var session = require("express-session");
const mysql = require("mysql");
const { response } = require("express");
const app = express();

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));

app.use(express.static('node_modules'));
app.use('/@fontawesome', express.static(__dirname + 'node_modules/fontawesome'));

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.set('view engine', 'ejs');

const connection = mysql.createConnection({
    host: "127.0.0.11",
    user: "root",
    password:"",
    database: "inventory"
})

connection.connect((err)=>{
    if(err) throw err;
    console.log("Database connected");
})


app.post("/create_user", (req, res)=>{
    console.log(req.query);
    let salt = bcrypt.genSaltSync(saltRounds);
    let hash = bcrypt.hashSync(req.query.password, salt);
    connection.query("INSERT INTO user (userName, password, userType) VALUES ('"+req.query.userName+"', '"+hash+"', '"+req.query.userType+"')", (err, response)=>{
        if(err) throw err;
        res.send("Here");
    })
})

//Login
app.get('/login', (req, res)=>{
    res.render('login');
})

app.post('/auth', urlEncodedParser, (req, res)=>{
    connection.query('SELECT * FROM user WHERE userName = "'+req.body.username+'"', (err, response)=>{
        if(err) throw err;
        if(response.length > 0){
            if(bcrypt.compareSync(req.body.password, response[0]['password'])){
                req.session.loggedin = true;
                req.session.username = req.body.username;
                connection.query('SELECT userID FROM user WHERE userName = "'+req.body.username+'" AND password = "'+req.body.password+'"', (err, response,result)=>{
                   req.session.userID = result.userID;
                })
                res.redirect('/');
            }else{
                res.send('Incorrect Username or Password!');
            }
        }else{
            res.end();
        }
    });
})


//Dashboard
app.get('/', (req, res)=>{
    if(req.session.loggedin){
        res.render('dash');
    }
})

//Product
app.get('/showprod', (req, res)=>{
    connection.query('SELECT productId, productName,unitPrice, dateAdded, variantDesc, qty FROM product INNER JOIN product_variant ON product.productId = product_variant.product_Id AND product.status = 1', (err, result)=>{
        res.render('showprod', {prods: result});
    })
})

app.get('/addprod', (req, res)=>{
    connection.query('SELECT * FROM product WHERE status = 1', (err, result)=>{
        res.render('addprod', {prod: result});
    });  
})

// app.post('/add', urlEncodedParser, (req, res)=>{
//     connection.query('INSERT INTO product(productName, unitPrice, userId) VALUES ("'+req.body.productname+'", '+req.body.productprice+', 1)', (err)=>{
//         if(err) throw err;
//         console.log(req.body.productname);
//         res.redirect('/addprod');
//     });
// })

app.post('/add', urlEncodedParser, (req, res)=>{
    connection.query('INSERT INTO product(productName, unitPrice, userId) VALUES ("'+req.body.productname+'", '+req.body.productprice+', 1)', (err)=>{
        if(err) throw err;
        res.redirect('/addprod');
    });
})

app.post('/addvar', urlEncodedParser, (req, res)=>{
    connection.query('SELECT productId FROM product WHERE productName = "'+req.body.productname+'"', (err, result)=>{
        connection.query('INSERT INTO product_variant(variantDesc, qty, product_Id) VALUES ("'+req.body.opt+'", '+req.body.qty+', '+result+')', (err)=>{
            res.redirect('/addprod');
        });
    }); 
    console.log(result);
})


app.get('/delete', (req, res)=>{
    connection.query("UPDATE product SET status = 0 WHERE productId = ?", req.query.id, (err)=>{
        if(err) throw err;
        res.redirect('/addprod');
    });
})

app.get('/transaction', (req, res)=>{
    res.render('transaction');
})



app.listen(3000);