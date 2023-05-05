const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LogSchema = new Schema(
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
    lfaSpeed: {
      type: Number,
      required: true,
    },
    proxSpeed: {
      type: Number,
      required: true,
    },
    totalTurnPerRoll: {
      type: Number,
      required: true,
    },
    r: {
      type: String,
      required: true,
    },
    N: {
      type: Number,
      required: true,
    },
    n1: {
      type: Number,
      required: true,
    },
    efficiency: {
      type: Number,
      required: true,
    },
    l1: {
      type: Number,
      required: true,
    },
    f1: {
      type: Number,
      required: true,
    },
    ne1: {
      type: Number,
      required: true,
    },
    c1: {
      type: Number,
      required: true,
    },
    c2: {
      type: Number,
      required: true,
    },
    c3: {
      type: Number,
      required: true,
    },
    c4: {
      type: Number,
      required: true,
    },
    c5: {
      type: Number,
      required: true,
    },
    c6: {
      type: Number,
      required: true,
    },

    productionRateEq1: {
      type: Number,
      required: true,
    },

    productionRateEq2: {
      type: Number,
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
    date: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Log = mongoose.model("Logs", LogSchema);
module.exports = Log;
