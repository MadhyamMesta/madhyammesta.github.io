const canvas = document.getElementById("bg");

const scene = new THREE.Scene();
const camera = new THREE.Camera();
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });


renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
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

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453);
    }

    float noise(vec2 p){
      vec2 i = floor(p);
      vec2 f = fract(p);

      float a = hash(i);
      float b = hash(i + vec2(1.0,0.0));
      float c = hash(i + vec2(0.0,1.0));
      float d = hash(i + vec2(1.0,1.0));
    
      vec2 u = f*f*(3.0-2.0*f);
    
      return mix(a,b,u.x) +
             (c-a)*u.y*(1.0-u.x) +
             (d-b)*u.x*u.y;
    }

    float fbm(vec2 p){
      float v = 0.0;
      float a = 0.5;
    
      mat2 rot = mat2(
        0.8, -0.6,
        0.6,  0.8
      );
      
      for(int i=0;i<6;i++){
        v += a * noise(p);
        p = rot * p * 2.0; // 🔥 rotation added
        a *= 0.5;
      }
      return v;
    }

    void main(){
     vec2 uv = gl_FragCoord.xy / resolution.xy;
      uv = uv * 2.0 - 1.0;
      uv.x *= resolution.x / resolution.y;
      
      // 🔥 break grid alignment
      uv += 0.2 * vec2(
        sin(uv.y * 3.0 + time * 0.2),
        cos(uv.x * 3.0 + time * 0.2)
      );

    
      float t = time * 0.08;
    
      vec2 q = vec2(
        fbm(uv * 1.5 + t),
        fbm(uv * 1.5 - t)
      );
      
      uv += q * 0.4;


      vec2 r = vec2(
        fbm(uv * 3.0 + q + t),
        fbm(uv * 3.0 + q - t)
      );
    
      float f = fbm(uv * 2.5 + r);
    
      vec3 purple = vec3(0.18, 0.0, 0.45);
      vec3 blue   = vec3(0.0, 0.25, 0.7);
      vec3 yellow = vec3(1.0, 0.7, 0.2);
    
      vec3 col = mix(purple, blue, f);
      col = mix(col, yellow, pow(f, 3.5));
    
      float mask = smoothstep(0.15, 0.95, f);
      col *= mask;
    
      col *= 1.3;
    
      gl_FragColor = vec4(col, 1.0);
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
