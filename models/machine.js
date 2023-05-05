const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MachineSettingSchema = new Schema({
  machine_type: {
    type: Number,
    required: true,
  },
  machine_diameter: {
    type: Number,
    required: true,
  },
  machine_no_needless: {
    type: Number,
    required: true,
  },
  machine_coursws: {
    type: Number,
    required: true,
  },
  machine_wales: {
    type: Number,
    required: true,
  },
  yarn_no_feeders: {
    type: Number,
    required: true,
  },
  yarn_count: {
    type: Number,
    required: true,
  },
  lycra_no_feeders: {
    type: Number,
    required: true,
  },
  lycra_count: {
    type: Number,
    required: true,
  },
});

const MachineSchema = new Schema(
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
    setting: MachineSettingSchema,
  },
  { timestamps: true }
);

const Machine = mongoose.model("Machines", MachineSchema);
module.exports = Machine;
