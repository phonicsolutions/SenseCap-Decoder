// Device SenseCap T1000 - ChirpStack
// Staging Code.

const utils = require("./common.js");

// unpack grabs the remaining bytres and transforms them into their respective data type.
const unpack = (frameID, payload) => {
  let result = {};
  console.log(`Payload data - \n`, payload);

  switch (frameID) {
    case "01": // Device Status Packet - Event Mode
      result = {
        packetID: payload[0],
        batteryLevel: utils.HexStringToDecimal(payload[1]), // Battery level in percentage
        softwareVersion: utils.BytesToVersion(payload.slice(2, 4)), // Software version
        hardwareVersion: utils.BytesToVersion(payload.slice(4, 6)), // Hardware version
        workMode: utils.GetDeviceMode(payload[6]), // Work mode
        positioningStrategy: utils.BytesToPositioningStrategy(payload[7]), // Positioning strategy
        heartbeatInterval: utils.BytesToInterval(payload.slice(8, 10)), // Heartbeat interval
        uplinkInterval: utils.BytesToInterval(payload.slice(10, 12)), // Uplink interval
        eventModeUplinkInterval: utils.BytesToInterval(payload.slice(12, 14)), // Event mode Uplink interval
        tempLightSwitch:
          payload[14] === "01"
            ? "Open the temperature and light sensor"
            : "Close the temperature and light sensor",
        sosMode:
          payload[15] === "00"
            ? "use SOS single mode"
            : "use SOS continuous mode",
        enableMotionEvent: payload[16] === "01" ? "Enabled" : "Disabled",
        axisMotionThreshold: utils.HexStringToDecimal(payload.slice(17, 19)),
        motionStartInterval: utils.HexStringToDecimal(payload.slice(19, 21)),
        enableMotionlessEvent: payload[21] === "01" ? "Enabled" : "Disabled",
        motionlessTimeout: utils.HexStringToDecimal(payload.slice(22, 24)),
        enableShockEvent: payload[24] === "01" ? "Enabled" : "Disabled",
        axisShockThreshold: utils.HexStringToDecimal(payload.slice(25, 27)),
        enableTemperatureEvent: payload[27] === "01" ? "Enabled" : "Disabled",
        temperatureEventUplinkInterval: utils.HexStringToDecimal(
          payload.slice(28, 30)
        ),
        temperatureSampleInterval: utils.HexStringToDecimal(
          payload.slice(30, 32)
        ),
        temperatureMaxThreshold:
          utils.HexStringToDecimal(payload.slice(32, 34)) / 10,
        temperatureMinThreshold:
          utils.HexStringToDecimal(payload.slice(34, 36)) / 10,
        temperatureWarningType: utils.ByteThresholdWarning(payload[36]),
        enableLightEvent: payload[37] === "01" ? "Enabled" : "Disabled",
        lightEventUplinkInterval: utils.HexStringToDecimal(
          payload.slice(38, 40)
        ),
        lightSampleInterval: utils.HexStringToDecimal(payload.slice(40, 42)),
        lightMaxThreshold: utils.HexStringToDecimal(payload.slice(42, 44)),
        lightMinThreshold: utils.HexStringToDecimal(payload.slice(44, 46)),
        lightWarningType: utils.ByteThresholdWarning(payload[46]),
      };
      break;

    case "02": // Device Status Packet - Periodic Modee - 0x02
      result = {
        packetID: payload[0],
        batteryLevel: utils.HexStringToDecimal(payload[1]), // Battery level in percentage
        softwareVersion: utils.BytesToVersion(payload.slice(2, 4)), // Software version
        hardwareVersion: utils.BytesToVersion(payload.slice(4, 6)), // Hardware version
        workMode: utils.GetDeviceMode(payload[6]), // Work mode
        positioningStrategy: utils.BytesToPositioningStrategy(payload[7]), // Positioning strategy
        heartbeatInterval: utils.BytesToInterval(payload.slice(8, 10)), // Heartbeat interval
        uplinkInterval: utils.BytesToInterval(payload.slice(10, 12)), // Uplink interval
        eventModeUplinkInterval: utils.BytesToInterval(payload.slice(12, 14)), // Event mode Uplink interval
        tempLightSwitch:
          payload[14] === "01"
            ? "Open the temperature and light sensor"
            : "Close the temperature and light sensor",
        sosMode:
          payload[15] === "00"
            ? "use SOS single mode"
            : "use SOS continuous mode",
      };
      break;

    case "05": // Heartbeat Packet -0x05
      result = {
        packetID: payload[0],
        batteryLevel: utils.HexStringToDecimal(payload[1]), // Battery level in percentage
        workMode: utils.GetDeviceMode(payload[2]), // Work mode
        positioningStrategy: utils.BytesToPositioningStrategy(payload[3]), // Positioning strategy
        sosMode:
          payload[4] === "00"
            ? "use SOS single mode"
            : "use SOS continuous mode",
      };
      break;

    case "06": // GNSS Location and Sensor Packet-0x06
      result = {
        packetID: payload[0],
        eventStatus: utils.ByteEventStatus(payload.slice(1, 4)),
        motionSegmentNumber: utils.ByteMotionDetection(payload[4]),
        utcTime: utils.HexStringToDecimal(payload.slice(5, 9)),
        longitude: utils.HexStringToDecimal(payload.slice(9, 13)) / 1000000,
        latitude: utils.HexStringToDecimal(payload.slice(13, 17)) / 1000000,
        temperature: utils.HexStringToDecimal(payload.slice(17, 19)) / 10,
        light: utils.HexStringToDecimal(payload.slice(19, 21)),
        batteryLevel: utils.HexStringToDecimal(payload[21]), // Battery level in percentage
      };
      break;

    case "07": // Wi-Fi Location and Sensor Packet-0x07
      result = {
        packetID: payload[0],
        eventStatus: utils.ByteEventStatus(payload.slice(1, 4)),
        motionSegmentNumber: utils.ByteMotionDetection(payload[4]),
        utcTime: utils.HexStringToDecimal(payload.slice(5, 9)),
        macAddressOne: utils.ByteMacAddress(payload.slice(9, 15)),
        rssiMacAddressOne: utils.ByteRSSIMacAddress(payload[15]),
        macAddressTwo: utils.ByteMacAddress(payload.slice(16, 22)),
        rssiMacAddressTwo: utils.ByteRSSIMacAddress(payload[22]),
        macAddressThree: utils.ByteMacAddress(payload.slice(23, 29)),
        rssiMacAddressThree: utils.ByteRSSIMacAddress(payload[29]),
        macAddressFour: utils.ByteMacAddress(payload.slice(30, 36)),
        rssiMacAddressFour: utils.ByteRSSIMacAddress(payload[36]),
        temperature: utils.HexStringToDecimal(payload.slice(37, 39)) / 10,
        light: utils.HexStringToDecimal(payload.slice(39, 41)),
        batteryLevel: utils.HexStringToDecimal(payload[41]), // Battery level in percentage
      };
      break;

    case "08": // Bluetooth Location and Sensor Packet-0x08
      console.log("Payload test - ", payload[15]);
      result = {
        packetID: payload[0],
        eventStatus: utils.ByteEventStatus(payload.slice(1, 4)),
        motionSegmentNumber: utils.ByteMotionDetection(payload[4]),
        utcTime: utils.HexStringToDecimal(payload.slice(5, 9)),
        macAddressOne: utils.ByteMacAddress(payload.slice(9, 15)),
        rssiMacAddressOne: utils.ByteRSSIMacAddress(payload[15]),
        macAddressTwo: utils.ByteMacAddress(payload.slice(16, 22)),
        rssiMacAddressTwo: utils.ByteRSSIMacAddress(payload[22]),
        macAddressThree: utils.ByteMacAddress(payload.slice(23, 29)),
        rssiMacAddressThree: utils.ByteRSSIMacAddress(payload[29]),
        temperature: utils.HexStringToDecimal(payload.slice(30, 32)) / 10,
        light: utils.HexStringToDecimal(payload.slice(32, 34)),
        batteryLevel: utils.HexStringToDecimal(payload[34]), // Battery level in percentage
      };
      break;

    case "09": // GNSS Location Only Packet-0x09
      result = {
        packetID: payload[0],
        eventStatus: utils.ByteEventStatus(payload.slice(1, 4)),
        motionSegmentNumber: utils.ByteMotionDetection(payload[4]),
        utcTime: utils.HexStringToDecimal(payload.slice(5, 9)),
        longitude: utils.HexStringToDecimal(payload.slice(9, 13)) / 1000000,
        latitude: utils.HexStringToDecimal(payload.slice(13, 17)) / 1000000,
        batteryLevel: utils.HexStringToDecimal(payload[17]), // Battery level in percentage
      };
      break;

    case "0A": // Wi-Fi Location Only Packet-0x0A
      result = {
        packetID: payload[0],
        eventStatus: utils.ByteEventStatus(payload.slice(1, 4)),
        motionSegmentNumber: utils.ByteMotionDetection(payload[4]),
        utcTime: utils.HexStringToDecimal(payload.slice(5, 9)),
        macAddressOne: utils.ByteMacAddress(payload.slice(9, 15)),
        rssiMacAddressOne: utils.ByteRSSIMacAddress(payload[15]),
        macAddressTwo: utils.ByteMacAddress(payload.slice(16, 22)),
        rssiMacAddressTwo: utils.ByteRSSIMacAddress(payload[22]),
        macAddressThree: utils.ByteMacAddress(payload.slice(23, 29)),
        rssiMacAddressThree: utils.ByteRSSIMacAddress(payload[29]),
        macAddressFour: utils.ByteMacAddress(payload.slice(30, 36)),
        rssiMacAddressFour: utils.ByteRSSIMacAddress(payload[36]),
        batteryLevel: utils.HexStringToDecimal(payload[37]), // Battery level in percentage
      };
      break;

    case "0B": // Bluetooth Location Only Packet-0x0B
      result = {
        packetID: payload[0],
        eventStatus: utils.ByteEventStatus(payload.slice(1, 4)),
        motionSegmentNumber: utils.ByteMotionDetection(payload[4]),
        utcTime: utils.HexStringToDecimal(payload.slice(5, 9)),
        macAddressOne: utils.ByteMacAddress(payload.slice(9, 15)),
        rssiMacAddressOne: utils.ByteRSSIMacAddress(payload[15]),
        macAddressTwo: utils.ByteMacAddress(payload.slice(16, 22)),
        rssiMacAddressTwo: utils.ByteRSSIMacAddress(payload[22]),
        macAddressThree: utils.ByteMacAddress(payload.slice(23, 29)),
        rssiMacAddressThree: utils.ByteRSSIMacAddress(payload[29]),
        batteryLevel: utils.HexStringToDecimal(payload[30]), // Battery level in percentage
      };
      break;

    case "0D": // Error Code Packet-0x0D
      result = {
        packetID: payload[0],
        errorCode: utils.ByteErrorCode(payload.slice(1, 5)),
      };
      break;

    case "11": // Positioning Status and Sensor Packet-0x11
      result = {
        packetID: payload[0],
        positioningStrategy: utils.BytesToPositioningStatus(payload[1]), // Positioning status
        eventStatus: utils.ByteEventStatus(payload.slice(2, 5)),
        utcTime: utils.HexStringToDecimal(payload.slice(5, 9)),
        temperature: utils.HexStringToDecimal(payload.slice(9, 11)) / 10,
        light: utils.HexStringToDecimal(payload.slice(11, 13)),
        batteryLevel: utils.HexStringToDecimal(payload[13]), // Battery level in percentage
      };
      break;
    default:
      result = payload;
      break;
  }

  return result;
};

function Decode(fport, payload) {
  var bytes = utils.Bytes2HexString(payload);
  var fport = parseInt(fport);

  var decoded = {
    valid: true,
    fport: fport,
    errors: "",
    messages: [],
  };

  if (fport === 199 || fport === 192) {
    decoded.messages.push({
      fport: fport,
      payload: bytes,
    });
    return {
      data: decoded,
    };
  }

  if (fport != 5) {
    decoded.valid = false;
    return {
      data: decoded,
    };
  }

  if (bytes.length <= 0) {
    decoded.valid = false;
    return decoded;
  }

  const id = utils.GetFrameID(bytes.slice(0, 1));

  decoded.frameID = id;

  decoded.data = unpack(decoded.frameID, bytes);

  return decoded;
}

// Frame 01 Payload
let payload_frame1 =
  "0153010501050207001e00050005010000001e000500016801012c000005001e025800000000000500010064000000";
let payload_frame2 = "025601050105010002d0003c003c0000";
let payload_frame5 = "0564010001";
let payload_frame6 = "06000008006462248d06ca502801587ec600fe000057";
let payload_frame7 =
  "070000080064622472487397162234bb3ccd5798fd2ebc74cf002f3ad0a9ec26ca022958b900fe000057";
let payload_frame8 =
  "0800000800646225bb5162d2c1b9d3ca1b5bd2afeae5c0d0e2d70529e8c900fa000057";
let payload_frame9 = "09000000006463186806ca506801587e4c56";
let payload_frame0A =
  "0A0000080064622472487397162234bb3ccd5798fd2ebc74cf002f3ad0a9ec26ca022958b957";
let payload_frame0B =
  "0B00000800646225bb5162d2c1b9d3ca1b5bd2afeae5c0d0e2d70529e8c957";
let payload_frame0D = "0D00000001";
let payload_frame11 = "110100000064a763a0014100002f";

let payload_frame12 = "";

let decodedData = Decode(5, payload_frame11);
console.log(decodedData);
