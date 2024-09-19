// Device SenseCap T1000
// Staging Code.

function Decode(payload) {
  let decoded = {};

  let bytes = hexToBytes(payload);
  console.log(bytes);

  const { mode, id } = getDeviceModeAndID(bytes.slice(0, 1));

  decoded.Mode = mode;
  decoded.ID = id;

  return decoded;
}

let payload =
  "0153010501050207001e00050005010000001e000500016801012c000005001e025800000000000500010064000000";

let decodedData = Decode(payload);
console.log(decodedData);
