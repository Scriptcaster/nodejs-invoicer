const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _=require("lodash");
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true});
const itemsSchema = {
   name: String
 };
 const Item = mongoose.model("Item", itemsSchema);
 const item1 = new Item({
  name: "First Item"
});
const defaultItems = [item1];

const listSchema = {
  name: String,
  items: [itemsSchema]
};
const List = mongoose.model("List", listSchema);


app.get("/", function(req, res) {
  Item.find({}, function(err, foundItems){
    if (foundItems.length === 0) {
            Item.insertMany(defaultItems, function(err) {
       if(err){ console.log(err); } else { console.log("Success"); }
      });
       res.redirect("/");
    } else {
      res.render("list", {listTitle: "Today", newListItems: foundItems});
    }
  });
  
});

app.get("/:customListName", function(req, res) {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName}, function(err, foundList){
    if (!err){
      if (!foundList){
        //Create a new list
        console.log("Doesn't exist!");
         const list = new List({
          name: customListName,
          items: defaultItems
        });
         list.save();
         res.redirect("/" + customListName);
      } else {
        //Show an existing list
        console.log("Exist!");
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  })
 
 
});

app.post("/", function(req, res){
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName
  });
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    })
  }
  
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;
  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function(err){
      if (err) { console.log(err); } else { console.log("yes!!!"); res.redirect("/"); }
    });
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList){
      if (err) {
        console.log(err)
      } else {
        res.redirect("/" + listName);
      }
    });
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
