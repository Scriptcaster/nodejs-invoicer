const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _=require("lodash");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});
const itemSchema = { number: String, date: String };
const Item = mongoose.model("Item", itemSchema);


// Define font files
var fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf'
  }
};

var PdfPrinter = require('pdfmake/src/printer');
var printer = new PdfPrinter(fonts);
var fs = require('fs');
var options = {}

app.get("/", function(req, res) {
  Item.find({}, function(err, dbItems){ 
    res.render("home", {dbItems: dbItems});
  });
});

app.get("/:itemNumber", function(req, res) {
  Item.findOne({number: req.params.itemNumber}, function(err, foundItem){
   var docDefinition = {
     content: [
       foundItem.number,
       foundItem.date
      ]
    };
    var createFile = function() {
      var pdfDoc = printer.createPdfKitDocument(docDefinition, options);
        pdfDoc.pipe(fs.createWriteStream("public/" + foundItem.number + ".pdf")).on("finish", function(){
        console.log("File Created");
      });
      pdfDoc.end();
    }
    res.render("item", {item: foundItem, createPDF: createFile});
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
