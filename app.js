const express = require("express");
const bodyParser = require("body-parser");
const urlEncodedParser = bodyParser.urlencoded({extended:false});
const connection = require("mysql");
const app = express();

app.use(express.static('public'));
app.use('/css', express.static(__dirname + 'public/css'));
app.use('/js', express.static(__dirname + 'public/js'));
app.use('/img', express.static(__dirname + 'public/img'));

app.use(express.static('node_modules'));
app.use('/@fontawesome', express.static(__dirname + 'node_modules/fontawesome'));

app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
    res.render('dash');
})

app.get('/product', (req, res)=>{
    res.render('product');
})

app.get('/transaction', (req, res)=>{
    res.render('transaction');
})

app.listen(3000);