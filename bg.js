const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let time = 0;

function noise(x, y) {
  return Math.sin(x * 0.01 + time) * Math.cos(y * 0.01 + time);
}

function getColor(n) {
  if (n < 0.4) return "rgba(106,0,255,0.06)";
  if (n < 0.7) return "rgba(0,119,255,0.06)";
  return "rgba(255,216,77,0.08)";
}

function draw() {
  const scale = 8;

  for (let x = 0; x < canvas.width; x += scale) {
    for (let y = canvas.height * 0.3; y < canvas.height; y += scale) {
      let n = (noise(x, y) + 1) / 2;
      ctx.fillStyle = getColor(n);
      ctx.fillRect(x, y, scale, scale);
    }
  }
}

function animate() {
  ctx.fillStyle = "rgba(5,7,13,0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  draw();
  time += 0.008;

  requestAnimationFrame(animate);
}

animate();

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
