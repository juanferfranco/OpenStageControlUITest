const {WebSocket } = require("ws");
const osc = require("osc");


const WS_PORT = 8081;
const OSC_PORT = 9000;

// WS server
const wss = new WebSocket.Server({ port: WS_PORT });
console.log("WS relay listening on ws://127.0.0.1:" + WS_PORT);

// OSC UDP server
const udpPort = new osc.UDPPort({
  localAddress: "0.0.0.0",
  localPort: OSC_PORT,
});
udpPort.open();

udpPort.on("message", (msg, timeTag, info) => {
  const payload = {
    address: msg.address,
    args: msg.args,
    from: { address: info.address, port: info.port },
    timeTag,
  };

  const text = JSON.stringify(payload);
  wss.clients.forEach((client) => {
     if (client.readyState === WebSocket.OPEN) client.send(text);
  });
});

udpPort.on("ready", () => {
  console.log("OSC listening on udp://0.0.0.0:" + OSC_PORT);
});
