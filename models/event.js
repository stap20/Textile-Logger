const mongoose = require("mongoose");

const Schema = mongoose.Schema;
  
const EventSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    machine_number: {
      type: String,
      required: true,
    },
    register_id: {
      type: String,
      required: true,
    },
    mac_addr: {
      type: String,
      required: true,
    },
    order: {
      type: String,
      required: true,
    },
    fabrics: {
      type: String,
      required: true,
    },
    totalTurnPerRoll: {
      type: Number,
      required: true,
    },
    progress: {
      type: Number,
      required: true,
    },
    type: {
        type: String,
        required: true,
    },     
    startEventDate: {
      type: Date,
      required: true,
    },
    endEventDate: {
      type: Date,
      required: false,
    },
  },
  { timestamps: true }
);

const Event = mongoose.model("Events", EventSchema);
module.exports = Event;
