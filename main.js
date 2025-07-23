import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

// Scene & Camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 40, 120);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Texture Loader
const loader = new THREE.TextureLoader();

// Background
loader.load("textures/2k_stars.jpg", (texture) => {
  scene.background = texture;
});

// Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 6, 1000);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// GUI controls
const gui = new GUI();
const planetSpeeds = {};

// Planets info
const planetsInfo = [
  {
    name: "Sun",
    size: 10,
    distance: 0,
    texture: "textures/2k_sun.jpg",
    speed: 0,
  },
  {
    name: "Mercury",
    size: 1.2,
    distance: 15,
    texture: "textures/2k_mercury.jpg",
    speed: 0.04,
  },
  {
    name: "Venus",
    size: 2,
    distance: 23,
    texture: "textures/2k_venus.jpg",
    speed: 0.015,
  },
  {
    name: "Earth",
    size: 2.5,
    distance: 30,
    texture: "textures/2k_earth.jpg",
    speed: 0.01,
  },
  {
    name: "Moon",
    size: 0.5,
    distance: 3,
    texture: "textures/2k_moon.jpg",
    speed: 0.08,
    orbitAround: "Earth",
  },
  {
    name: "Mars",
    size: 2,
    distance: 38,
    texture: "textures/2k_mars.jpg",
    speed: 0.008,
  },
  {
    name: "Jupiter",
    size: 4.5,
    distance: 50,
    texture: "textures/2k_jupiter.jpg",
    speed: 0.006,
  },
  {
    name: "Saturn",
    size: 4,
    distance: 65,
    texture: "textures/2k_saturn.jpg",
    speed: 0.005,
    hasRing: true,
  },
  {
    name: "Uranus",
    size: 3.5,
    distance: 78,
    texture: "textures/2k_uranus.jpg",
    speed: 0.003,
  },
  {
    name: "Neptune",
    size: 3.2,
    distance: 90,
    texture: "textures/2k_neptune.jpg",
    speed: 0.002,
  },
];

const planets = {};
const labels = {};
const labelContainer = document.createElement("div");
labelContainer.style.position = "absolute";
labelContainer.style.top = 0;
labelContainer.style.left = 0;
labelContainer.style.pointerEvents = "none";
document.body.appendChild(labelContainer);

function createLabel(name) {
  const label = document.createElement("div");
  label.textContent = name;
  label.style.color = "white";
  label.style.fontSize = "12px";
  label.style.position = "absolute";
  label.style.display = "none";
  labelContainer.appendChild(label);
  return label;
}

function createPlanet({ name, size, distance, texture, hasRing }) {
  const geometry = new THREE.SphereGeometry(size, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    map: loader.load(texture),
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.userData = { name, distance, angle: 0, size };
  scene.add(mesh);

  if (hasRing) {
    const ringGeometry = new THREE.RingGeometry(size + 1, size + 2, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({
      map: loader.load("textures/2k_saturn_ring.png"),
      side: THREE.DoubleSide,
      transparent: true,
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    mesh.add(ring);
  }

  const label = createLabel(name);
  labels[name] = label;
  return mesh;
}

// Add planets
planetsInfo.forEach((info) => {
  if (info.name !== "Moon") {
    const mesh = createPlanet(info);
    planets[info.name] = mesh;
    planetSpeeds[info.name] = info.speed;
    if (info.distance > 0) {
      const orbit = new THREE.RingGeometry(
        info.distance - 0.1,
        info.distance + 0.1,
        64
      );
      const orbitMat = new THREE.MeshBasicMaterial({
        color: 0x555555,
        side: THREE.DoubleSide,
      });
      const orbitMesh = new THREE.Mesh(orbit, orbitMat);
      orbitMesh.rotation.x = Math.PI / 2;
      scene.add(orbitMesh);
    }
    gui.add(planetSpeeds, info.name, 0, 0.1).name(`${info.name} Speed`);
  }
});

// Add moon
const moon = createPlanet(planetsInfo.find((p) => p.name === "Moon"));
planets["Moon"] = moon;

// Animation control
let isPaused = false;
const pauseBtn = document.getElementById("pauseBtn");
pauseBtn.textContent = "Pause";
pauseBtn.style.position = "absolute";
pauseBtn.style.top = "10px";
pauseBtn.style.left = "10px";
pauseBtn.style.zIndex = 10;
document.body.appendChild(pauseBtn);
pauseBtn.onclick = () => {
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? "Resume" : "Pause";
};

// Raycaster for hover
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  if (!isPaused) {
    for (let name in planets) {
      const p = planets[name];
      if (name === "Moon") {
        const earth = planets["Earth"];
        p.userData.angle += planetSpeeds["Moon"];
        const r = 3;
        p.position.set(
          earth.position.x + r * Math.cos(p.userData.angle),
          0,
          earth.position.z + r * Math.sin(p.userData.angle)
        );
      } else if (p.userData.distance > 0) {
        p.userData.angle += planetSpeeds[name];
        const x = p.userData.distance * Math.cos(p.userData.angle);
        const z = p.userData.distance * Math.sin(p.userData.angle);
        p.position.set(x, 0, z);
      }
      p.rotation.y += 0.005;
    }
  }

  // Hover detection
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(Object.values(planets));
  for (const name in labels) labels[name].style.display = "none";
  if (intersects.length) {
    const name = intersects[0].object.userData.name;
    const label = labels[name];
    if (label) {
      const pos = intersects[0].object.position.clone().project(camera);
      label.style.left = (pos.x * 0.5 + 0.5) * window.innerWidth + "px";
      label.style.top = (-pos.y * 0.5 + 0.5) * window.innerHeight + "px";
      label.style.display = "block";
    }
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();
