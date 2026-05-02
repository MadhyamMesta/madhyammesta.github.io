const canvas = document.getElementById("bg");

const scene = new THREE.Scene();
const camera = new THREE.Camera();
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);

const uniforms = {
  time: { value: 0 },
  resolution: {
    value: new THREE.Vector2(window.innerWidth, window.innerHeight)
  }
};

const material = new THREE.ShaderMaterial({
  uniforms,
  fragmentShader: `
    precision highp float;

    uniform float time;
    uniform vec2 resolution;

    // 🔥 Smooth noise
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);

      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));

      vec2 u = f * f * (3.0 - 2.0 * f);

      return mix(a, b, u.x) +
             (c - a) * u.y * (1.0 - u.x) +
             (d - b) * u.x * u.y;
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;

      for (int i = 0; i < 5; i++) {
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
      }

      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;

      // center and stretch
      uv = uv * 2.0 - 1.0;
      uv.x *= resolution.x / resolution.y;

      // animate
      float t = time * 0.1;

      // fluid motion
      float n = fbm(uv * 2.0 + t);

      float n2 = fbm(uv * 3.0 - t * 1.2);

      float mixVal = smoothstep(0.2, 0.8, n + n2);

      // 🎨 YOUR COLOR PALETTE
      vec3 purple = vec3(0.4, 0.0, 1.0);
      vec3 blue   = vec3(0.0, 0.4, 1.0);
      vec3 yellow = vec3(1.0, 0.8, 0.2);

      vec3 color = mix(purple, blue, mixVal);
      color = mix(color, yellow, pow(mixVal, 2.0));

      // glow intensity
      float glow = smoothstep(0.3, 1.0, mixVal);

      color *= glow;

      gl_FragColor = vec4(color, 1.0);
    }
  `
});

const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
scene.add(mesh);

function animate() {
  uniforms.time.value += 0.01;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// responsive
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
});
