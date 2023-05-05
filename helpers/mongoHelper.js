const Machine = require("../models/machine");
const Log = require("../models/log");
const Event = require("../models/event");

const MongoHelper = {
  MachineHelpers: {
    AddMachine(machine) {
      const machineCollection = new Machine(machine);

      try {
        machineCollection.save();
        console.log("Machine Saved Successful");
      } catch (e) {
        console.log("Machine Not Saved Successful");
      }
    },
    async GetAllMachines(condition = {}, isLean) {
      const res = isLean
        ? await Machine.find(condition).lean()
        : await Machine.find(condition);

      return res;
    },
    async FindMachine(condition) {
      const res = await Machine.findOne(condition);

      return res;
    },
  },

  LogHelpers: {
    AddLog(log) {
      const logCollection = new Log(log);

      try {
        logCollection.save();
        console.log("Log Saved Successful");
      } catch (e) {
        console.log("Log Not Saved Successful");
      }
    },
    async GetAllLogs(condition = {}, isLean = false) {
      const res = isLean
        ? await Log.find(condition).lean()
        : await Log.find(condition);

      return res;
    },
    async FindLog(condition) {
      const res = await Log.findOne(condition);

      return res;
    },
  },

  EventHelpers: {
    AddEvent: (event) => {
      const eventCollection = new Event(event);

      try {
        console.log(event);
        eventCollection.save();
        console.log("Event Saved Succefull");
      } catch (e) {
        console.log("Event Not Saved Succefull");
      }
    },
    async GetAllEvents(condition = {}, isLean = false) {
      const res = isLean
        ? await Event.find(condition).lean()
        : await Event.find(condition);

      return res;
    },
    async FindEvent(condition) {
      const res = await Event.findOne(condition);

      return res;
    },
    async UpdateEventCloseTime(condition, datetime) {
      try {
        await Event.updateOne(condition, { $set: datetime }, { upsert: true });

        console.log("Event Close Time Updated Successful");
      } catch (e) {
        console.log("Machine doesn't have event to close it");
      }
    },
  },
};

module.exports = MongoHelper;
