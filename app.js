const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _=require("lodash");
const app = express();

const PDFDocument = require('pdfkit');
const doc = new PDFDocument;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});
const itemSchema = { number: String, date: String };
const Item = mongoose.model("Item", itemSchema);

app.get("/", function(req, res) {
  Item.find({}, function(err, dbItems){ 
    console.log(dbItems);
    res.render("home", {dbItems: dbItems});
  });
});

app.get("/:itemNumber", function(req, res) {
  Item.findOne({number: req.params.itemNumber}, function(err, foundItem){
    res.render("item", {item: foundItem});
  });
});

app.post("/", function(req, res){
  const item = new Item({
    number: req.body.newNumber,
    date: req.body.newDate,
  });
  item.save();
  res.redirect("/");
});

app.listen(3000, function() { console.log("Server started on port 3000"); });
