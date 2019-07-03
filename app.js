const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _=require("lodash");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-ravos:Mgi86Shift@cluster0-g2cja.mongodb.net/dynamo", {useNewUrlParser: true});
const itemSchema = { 
  number: String, 
  date: String,
  attn: String,  
  customer: String, 
  worksite: String, 

  generalWelding: String,
  generalRepair: String,
  basementDoor: String,

  fireEscapes: String,
  awnings: String,
  railings: String,

  fences: String,
  stairs: String,
  gates: String,

  securityDoor: String,
  windowGuards: String,
  otherServices: String,

  description: String, 
  note: String, 
  price: String, 
  tax: String 
};
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
  Item.find(function(err, lastItem){ lastNumber = lastItem; }).limit(1).sort({$natural:-1});
  Item.findOne({number: selectedNumber}, function(err, foundItem){
    console.log(foundItem);
    if (foundItem){ doc = selectedNumber; } else { doc = "New Document"; }
    res.render("item", {item: foundItem, Document: doc, Numberr: lastNumber});
  });
});

app.post("/", function(req, res){
  console.log( req.body.itemTax  );
  const selectedNumber = req.body.itemNumber;
  const item = new Item({
    number: req.body.itemNumber,
    date: req.body.itemDate,
    attn: req.body.itemAttn,
    customer: req.body.itemCustomer,
    worksite: req.body.itemWorksite,

    generalWelding: req.body.itemGeneralWelding,
    generalRepair: req.body.itemGeneralRepair,
    basementDoor: req.body.itemBasementDoor,

    fireEscapes: req.body.itemFireEscapes,
    awnings: req.body.itemAwnings,
    railings: req.body.itemRailings,

    fences: req.body.itemFences,
    stairs: req.body.itemStairs,
    gates: req.body.itemGates,

    securityDoor: req.body.itemSecurityDoor,
    windowGuards: req.body.itemWindowGuards,
    otherServices: req.body.itemOtherServices,

    description: req.body.itemDescription,
    note: req.body.itemNote,
    price: req.body.itemPrice,
    tax: req.body.itemTax
  });
  
  Item.findOne({number: selectedNumber}, function(err, foundItem){
     if (foundItem) {
       Item.findOneAndUpdate({number: selectedNumber }, { 
        number: req.body.itemNumber,
        date: req.body.itemDate,
        attn: req.body.itemAttn,
        customer: req.body.itemCustomer,
        worksite: req.body.itemWorksite,

        generalWelding: req.body.itemGeneralWelding,
        generalRepair: req.body.itemGeneralRepair,
        basementDoor: req.body.itemBasementDoor,

        fireEscapes: req.body.itemFireEscapes,
        awnings: req.body.itemAwnings,
        railings: req.body.itemRailings,

        fences: req.body.itemFences,
        stairs: req.body.itemStairs,
        gates: req.body.itemGates,

        securityDoor: req.body.itemSecurityDoor,
        windowGuards: req.body.itemWindowGuards,
        otherServices: req.body.itemOtherServices,

        description: req.body.itemDescription,
        note: req.body.itemNote,
        price: req.body.itemPrice,
        tax: req.body.itemTax    
       }, function(err, foundItem){
         res.redirect("/");
       });
     } else {
        item.save();
        res.redirect("/");
     }
  });
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.id;
  Item.findByIdAndRemove(checkedItemId, function(err){
    if (err) { console.log(err); } else { console.log("removed"); res.redirect("/"); }
  });
});

app.listen(3000, function() { console.log("Server started on port 3000"); });
