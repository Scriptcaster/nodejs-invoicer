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
  customerSelect: String,  
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
const customerSchema = { 
  attn: String,
  info: String,
};
const Customer = mongoose.model("Customer", customerSchema);

app.get("/", function(req, res) {
  Item.find({}, function(err, dbItems){ 
    Customer.find({}, function(err, dbCustomers){ 
       res.render("home", {dbItems: dbItems, dbCustomers: dbCustomers});
    });
  });
  
});

app.get("/:link", function(req, res) {
  const link = req.params.link;
  var lastNumber = Number;
  var doc = String;
  Item.find(function(err, lastItem){ lastNumber = lastItem; }).limit(1).sort({$natural:-1});
  Item.findOne({number: link}, function(err, foundItem){
    if (foundItem){ doc = link; } else { doc = "New Document"; }
      Customer.find({}, function(err, dbCustomers){ 
      res.render("item", {item: foundItem, Document: doc, Numberr: lastNumber, dbCustomers: dbCustomers});
      });
  });
});

app.get("/customers/:link", function(req, res) {
  const link = req.params.link;
  var lastNumber = Number;
  var doc = String;
  Customer.findOne({attn: link}, function(err, foundCustomer){
    if (foundCustomer){ cus = link; } else { cus = "New Customer"; }
      res.render("customer", {customer: foundCustomer, Customer: cus});
  });
});

app.post("/customer", function(req, res){
  const selectedAttn = req.body.customerAttn;
  const customer = new Customer({
    attn: req.body.customerAttn,
    info: req.body.customerInfo, 
  });
  Customer.findOne({attn: selectedAttn}, function(err, foundCustomer){
    if (foundCustomer) {
      Customer.findOneAndUpdate({attn: selectedAttn }, { 
      attn: req.body.customerAttn,
      info: req.body.customerInfo,   
      }, function(err, foundCustomer){
        res.redirect("/");
      });
    } else {
      customer.save();
      res.redirect("/");
    }
  });
});

app.post("/", function(req, res){
  console.log( req.body );
  const selectedNumber = req.body.itemNumber;
  const item = new Item({
    number: req.body.itemNumber,
    date: req.body.itemDate,
    customerSelect: req.body.customerSelect,
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
        customerSelect: req.body.customerSelect,
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
       res.redirect("/"+ req.body.itemNumber);
     });
    } else {
      item.save();
      res.redirect("/"+ req.body.itemNumber);
    }
  });

});





app.post("/update", function(req, res){
  console.log(req.params);
   res.redirect("/");
});



app.post("/delete", function(req, res) {
  const checkedItemId = req.body.id;
  Item.findByIdAndRemove(checkedItemId, function(err){
    if (err) { console.log(err); } else { res.redirect("/"); }
  });
});

app.post("/deleteCustomer", function(req, res) {
  const checkedItemId = req.body.id;
  Customer.findByIdAndRemove(checkedItemId, function(err){
    if (err) { console.log(err); } else { res.redirect("/"); }
  });
});

app.listen(process.env.PORT || 3000, function(){
  console.log("Server is running on port 3000.");
});

// server.connection({
//   port: process.env.PORT || 5000
// });

// app.listen(process.env.PORT || 3000, function(){
//   console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
// });

// let port = process.env.PORT;
// if (port == null || port == "") {
//   port = 5000;
// }

// app.listen(port, function() {
//   console.log("Server started on port 3000");
// });
