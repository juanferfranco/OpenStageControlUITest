let val = 0;
let socket;
let status = "Conectando...";

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Conectamos
  socket = new WebSocket("ws://127.0.0.1:8081");

  socket.onopen = () => {
    status = "¡CONECTADO Y ACTIVADO!";
    console.log("Conexión abierta. Enviando saludo inicial...");
    // socket.send(JSON.stringify({ type: 'init' }));
  };

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log("OSC->WS:", data);

  const a0 = data.args?.[0];
  val = (a0 && typeof a0 === "object" && "value" in a0) ? a0.value : (a0 ?? 0);

  status = "Recibiendo de: " + data.address;
};

  socket.onerror = (err) => {
    status = "Error en el socket";
    console.error(err);
  };
}

function draw() {
  background(val * 255);
  
  fill(255, 0, 0);
  noStroke();
  textSize(20);
  text(status, 20, 40);
  
  fill(0, 255, 0);
  rect(20, 100, val * (width - 40), 50);
  
  fill(255);
  text("Valor: " + nf(val, 1, 3), 20, 85);
}
