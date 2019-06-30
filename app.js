const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _=require("lodash");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/test", {useNewUrlParser: true});
const itemSchema = { number: String, date: String };
const Item = mongoose.model("Item", itemSchema);


app.get("/", function(req, res) {
  Item.find({}, function(err, dbItems){ 
    res.render("home", {dbItems: dbItems});
  });
});

app.get("/:itemNumber", function(req, res) {
  const selectedNumber = req.params.itemNumber;
  var lastNumber = Number;
  var doc = String;
  Item.find(function(err, lastItem){
    lastNumber = lastItem;
  }).limit(1).sort({$natural:-1});
  console.log(selectedNumber);
  Item.findOne({number: selectedNumber}, function(err, foundItem){
    console.log(foundItem);
    if (foundItem){
       doc = selectedNumber;
    } else {
      doc = "New Document";
    }
    res.render("item", {item: foundItem, Document: doc, Numberr: lastNumber});
  });
});

app.post("/", function(req, res){
   const selectedNumber = req.body.itemNumber;
   console.log(selectedNumber);
   Item.findOne({number: selectedNumber}, function(err, foundItem){
    if (foundItem) {
      // foundItem.replaceOne({number: selectedNumber}, function(err, foundItem){
        console.log("replaced");
      // });
    } else {
      console.log("create new");
      const item = new Item({
        number: req.body.itemNumber,
        date: req.body.itemDate,
      });
      if (selectedNumber) {
        item.save();
      }
    }
   });
  res.redirect("/");
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.id;
  Item.findByIdAndRemove(checkedItemId, function(err){
    if (err) { console.log(err); } else { console.log("removed"); res.redirect("/"); }
  });
});

app.listen(3000, function() { console.log("Server started on port 3000"); });
