const MongoHelper = require("./mongoHelper");

function getCurrDateTime() {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1; // Months start at 0!
  let dd = today.getDate();
  let hours = today.getHours() % 12;
  let minutes = today.getMinutes();
  let seconds = today.getSeconds();
  let dura = today.getHours() >= 12 ? "pm" : "am";

  const formattedToday =
    dd +
    "-" +
    mm +
    "-" +
    yyyy +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds +
    " " +
    dura;

  return formattedToday;
}

function calc_production(
  machine_Setting,
  lycra_stitch_length,
  yarn_stitch_length,
  speed,
  efficiency
) {
  var N = machine_Setting.machine_no_needless;
  var n1 = speed;
  var eff = efficiency;
  var r = machine_Setting.machine_type;
  //var constant = 5906 * 0.00000000001;
  var f1 = machine_Setting.yarn_no_feeders;
  var l1 = yarn_stitch_length;
  var ne1 = machine_Setting.yarn_count;
  var f2 = machine_Setting.lycra_no_feeders;
  var l2 = lycra_stitch_length;
  var ne2 = machine_Setting.lycra_count;

  var res =
    (r * N * n1 * 60 * eff * l1 * f1 * 1.0937) /
    (ne1 * 1000 * 100 * 840 * 2.202);

  return res;
}

async function machineRegister(res) {
  const machine = JSON.parse(res);

  const machineData = await MongoHelper.MachineHelpers.FindMachine({
    mac_addr: machine.mac_addr,
  });

  if (machineData === null) {
    MongoHelper.MachineHelpers.AddMachine(machine);
  }
}

async function machineData(res) {
  var machineLog = JSON.parse(res);

  const machineData = await MongoHelper.MachineHelpers.FindMachine({
    mac_addr: machineLog.mac_addr,
  });

  if (machineData === null) {
    console.log(
      "Machine with mac address : " + machineLog.mac_addr + " is not registered"
    );

    return;
  }

  machineLog = machineLog.data

  var machineLogData = {
    machine_number: machineData.machine_number,
    name: machineData.name,
    register_id: machineData.register_id,
    mac_addr: machineData.mac_addr,
    order: machineLog.order.toString(),
    fabrics: machineLog.fabrics.toString(),
    lfaSpeed: machineLog.lfaSpeed,
    proxSpeed: machineLog.proxSpeed,
    totalTurnPerRoll: machineLog.totalTurnPerRoll,
    progress: machineLog.progress,
  };

  const efficiency = 76;

  machineLogData.stitch =
    (machineLogData.lfaSpeed * 145.8) /
    (machineLogData.proxSpeed * machineData.setting.machine_no_needless * 2);

  machineLogData.productionRateEq1 = calc_production(
    machineData.setting,
    machineLogData.stitch,
    machineLogData.stitch,
    machineLogData.proxSpeed,
    efficiency
  );

  machineLogData = {
    ...machineLogData,
    r: machineData.setting.machine_type,
    N: machineData.setting.machine_no_needless,
    n1: machineLogData.proxSpeed,
    efficiency: efficiency,
    l1: machineLogData.stitch,
    f1: machineData.setting.yarn_no_feeders,
    ne1: machineData.setting.yarn_count,
    c1: 60,
    c2: 1.0937,
    c3: 1000,
    c4: 100,
    c5: 840,
    c6: 2.202,
    productionRateEq2: 0,
    date: getCurrDateTime(),
  };

  MongoHelper.LogHelpers.AddLog(machineLogData);
}

async function machineStopped(res, type) {
  var machineEvent = JSON.parse(res);

  const machineData = await MongoHelper.MachineHelpers.FindMachine({
    mac_addr: machineEvent.mac_addr,
  });

  
  if (machineData === null) {
    console.log(
      "Machine with mac address : " +
        machineEvent.mac_addr +
        " is not registered"
    );

    return;
  }

  const machineEventDetect = await MongoHelper.EventHelpers.FindEvent({
    mac_addr: machineEvent.mac_addr,
    type: machineEvent.data.stopType,
    endEventDate: null,
  });

  if (machineEventDetect !== null) {
    console.log(
      "Machine with mac address : " +
        machineEvent.mac_addr +
        " already have same opened stop"
    );

    return;
  }
  
  machineEvent = machineEvent.data

  var machineEventData = {
    machine_number: machineData.machine_number,
    name: machineData.name,
    register_id: machineData.register_id,
    mac_addr: machineData.mac_addr,
    order: machineEvent.order.toString(),
    fabrics: machineEvent.fabrics.toString(),
    totalTurnPerRoll: machineEvent.totalTurnPerRoll,
    progress: machineEvent.progress,
    type: machineEvent.stopType,
    startEventDate: new Date(),
  };

  MongoHelper.EventHelpers.AddEvent(machineEventData);
}

async function machineResumed(res) {
  const machineEvent = JSON.parse(res);

  const machineData = await MongoHelper.MachineHelpers.FindMachine({
    mac_addr: machineEvent.mac_addr,
  });

  if (machineData === null) {
    console.log(
      "Machine with mac address : " +
        machineEvent.mac_addr +
        " is not registered"
    );

    return;
  }

  const machineEventData = await MongoHelper.EventHelpers.FindEvent({
    mac_addr: machineEvent.mac_addr,
    type: machineEvent.data.stopType,
    endEventDate: null,
  });

  if (machineEventData === null) {
    console.log(
      "Machine with mac address : " +
        machineEvent.mac_addr +
        " not have any opened stop"
    );

    return;
  }

  MongoHelper.EventHelpers.UpdateEventCloseTime(
    {
      _id: machineEventData._id,
      endEventDate: null,
    },
    { endEventDate: new Date() }
  );
}

async function machineRollDone(res) {
  var machineEvent = JSON.parse(res);

  const machineData = await MongoHelper.MachineHelpers.FindMachine({
    mac_addr: machineEvent.mac_addr,
  });

  if (machineData === null) {
    console.log(
      "Machine with mac address : " +
        machineEvent.mac_addr +
        " is not registered"
    );

    return;
  }

  machineEvent = machineEvent.data

  var machineEventData = {
    machine_number: machineData.machine_number,
    name: machineData.name,
    register_id: machineData.register_id,
    mac_addr: machineData.mac_addr,
    order: machineEvent.order.toString(),
    fabrics: machineEvent.fabrics.toString(),
    totalTurnPerRoll: machineEvent.totalTurnPerRoll,
    progress: 100,
    type: machineEvent.stopType,
    startEventDate: new Date(),
  };

  MongoHelper.EventHelpers.AddEvent(machineEventData);
}

async function MqttListner(topic, message) {
  // message is Buffer
  var res = message.toString();

  if (topic == "device/register") {
    await machineRegister(res);
  } else if (topic == "device/data") {
    await machineData(res);
  } else if (topic == "device/stopped") {
    await machineStopped(res);
  } else if (topic == "device/resume") {
    await machineResumed(res);
  } else if (topic == "device/roll_is_done") {
    await machineRollDone(res);
  }
}

module.exports = MqttListner;
