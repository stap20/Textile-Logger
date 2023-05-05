const mongoose = require("mongoose");
var express = require("express");
var cors = require("cors");
var cookieParser = require("cookie-parser");
const mqtt = require("mqtt");
const MqttListner = require("./helpers/mqttHandler");
const fs = require("fs");
const MongoHelper = require("./helpers/mongoHelper");
const csv = require("fast-csv");
const client = mqtt.connect("mqtt:broker.hivemq.com:1883");
const uri = "mongodb+srv://stap20:khaled101198@textile-logger.wclirgm.mongodb.net/?retryWrites=true&w=majority";

//------------------------------ app.use() session --------------------------------
//Intiate Server App
var app = express();
//enable cross origin request
const corsConfig = {
  origin: true,
  credentials: true,
};
//app.use(cors());
app.use(cors(corsConfig));
app.options("*", cors(corsConfig));
app.use(cookieParser());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,UPDATE,OPTIONS"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept"
  );
  next();
});

client.subscribe("device/data");
client.subscribe("device/resume");
client.subscribe("device/stopped");
client.subscribe("device/roll_is_done");
client.subscribe("device/register");

var mqttPublish = function (topic, msg) {
  client.publish(topic, msg, function () {
    console.log("msg sent: " + msg);
  });
};

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    client.on("message", MqttListner);
  } catch (error) {
    console.error(error);
  }
}

connect();

app.get("/download/*", async (req, res) => {
  try {
    var type = req.params[0];
    const collectionName = type + "_" + Date.now();
    collectionData = [];

    if (type == "machineLogs") {
      collectionData = await MongoHelper.LogHelpers.GetAllLogs(undefined, true);
    } else if (type == "machineIssues") {
      collectionData = await MongoHelper.EventHelpers.GetAllEvents(
        undefined,
        true
      );
    }

    const csvStream = csv.format({ headers: true });

    collectionData.forEach((data) => {
      csvStream.write(data);
    });

    csvStream.end();

    res.setHeader(
      "Content-disposition",
      `attachment; filename=${collectionName}.csv`
    );
    res.set("Content-Type", "text/csv");
    csvStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error exporting the collection.");
  }
});

//------------------------------ Server session --------------------------------
//server listner
const port = 5000;
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log("Example app listening at http://%s:%s", host, port);
});
