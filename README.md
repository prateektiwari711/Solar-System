**Solar System 3D Simulation**

This project is a 3D simulation of the solar system built using **Three.js**. It visually represents the Sun, planets, moon, stars, and their orbits with animation, lighting, and interactivity. Users can pause/play the simulation and toggle between **Dark** and **Light** themes.

---
**Features**

- Realistic 3D models of the Sun, planets, and moon.
- Rotating planets around the Sun using correct orbital speed scaling.
- Animated rotation for each celestial body.
- Starry background texture.
- Saturn rings modeled separately.
- Pause/Play simulation toggle.
- Light and Dark theme switch.
- Fully responsive layout for all screen sizes.

---

## 🧱 Technologies Used

- **Three.js**
- **JavaScript**
- **HTML/CSS**
- **Textures (JPG/PNG)** from [Solar System Scope](https://www.solarsystemscope.com/textures/)

---

## 📁 Folder Structure

Solar-System/
│
├── index.html
├── style.css
├── main.js
└── textures/
  ├── 2k_sun.jpg
  ├── 2k_mercury.jpg
  ├── 2k_venus.jpg
  ├── 2k_earth.jpg
  ├── 2k_moon.jpg
  ├── 2k_mars.jpg
  ├── 2k_jupiter.jpg
  ├── 2k_saturn.jpg
  ├── 2k_saturn_ring.png
  ├── 2k_uranus.jpg
  ├── 2k_neptune.jpg
  └── 2k_stars.jpg


> Make sure the `/textures` folder and image file names are **exactly** as listed above.

-------------------------------------------------------------------------------------------------------------------------

**Setup Instructions**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/prateektiwari711/Solar-System.git
   cd Solar-System
  ->Ensure texture images are placed in the textures/ folder.
  ->Start the project locally
  ->You can use a local server to avoid texture load issues.
If using VS Code:
  ->Install Live Server extension
  ->Right-click index.html → Open with Live Server
If deploying to GitHub Pages
  ->Ensure all texture files are inside the public/textures/ folder (for React or Vite)
Or host using a server like Netlify or Vercel for static sites


**License**
This project is open-source and free to use under the MIT License.

**Author**
Prateek Tiwari
