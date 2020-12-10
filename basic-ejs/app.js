var express = require("express");
var path = require("path");
var vexaniumjs = require("vexaniumjs");

var routes = require("./routes");

var app = express();

app.set("port", process.env.PORT || 3000);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");


app.use(express.static('assets'))

app.use(routes);

app.listen(app.get("port"),function(){
    console.log("server started on port " + app.get("port"));
});