//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB",{useNewUrlParser:true});

const itemSchema = {
  name:String
};
const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
name:"Welcome to your todo list"
});
const item2 = new Item({
name:"Hit the + button to add a new item."
});
const item3 = new Item({
name: "<-- Hit to delete item"
});

const defaultItems=[item1,item2,item3];

const listSchema={
  name:String,
  items:[itemSchema]
};

const List = mongoose.model("List", listSchema);

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];


app.post("/", function(req, res){

  var itemName = req.body.newItem;

  const item= new Item({
    name:itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete",function(req,res){
const checkedItemId= req.body.checkbox;
Item.findByIdAndRemove(checkedItemId).then ((removeditem)=>{
  console.log("removed successfully");
});
res.redirect("/");
});


app.get("/", function(req,res){  
  const foundItems = Item.find({}).exec(); // Add .exec() to execute the query
  if(foundItems.length===0){
  Item.insertMany(defaultItems);
  }
  else{

    foundItems.then((i) => {
      
      res.render("list", {listTitle: "Today", newListItems: i});
  
  });
  }
});



app.get("/:customListName",function(req,res){
  const customListName=req.params.customListName;
  List.findOne({name:customListName}).then(function(foundList){
    if(!foundList){
      const list = new List({
        name:customListName,
        items:defaultItems
      });
    
      list.save();
      console.log("saved");
      res.redirect("/"+customListName);
    }
    else{
      res.render("list",{listTitle:foundList.name, newListItems:foundList.items});
    }
})
.catch(function(err){});

  });



app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
