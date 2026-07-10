import * as THREE from "./libs/three.module.js";
import { EffectComposer } from "./libs/EffectComposer.js";
import { RenderPass } from "./libs/RenderPass.js";
import { ShaderPass } from "./libs/ShaderPass.js";

/**
 * 三年之约 · 首屏视差云雾 + 闪电背景
 * 改编自 Three.js 云雾粒子系统：去除 GUI / 示例文字，
 * 仅保留视觉背景，并提供渐隐 + 停止渲染的能力（省电）。
 */
class SmokeBackground {
  constructor(options = {}) {
    const defaults = {
      mount: document.body,
      width: window.innerWidth,
      height: window.innerHeight,
      smokeOpacity: 0.3,
      smokeColor: 0xffffff,
      particleCount: 150,
      flashMinX: -2000,
      flashMaxX: 2000,
      flashMinY: -1000,
      flashMaxY: 1000,
      flashMinZ: -1500,
      flashMaxZ: 1500,
      flashFrequency: 0.93,
      flashSpeed: 500,
    };
    Object.assign(this, defaults, options);

    this.running = true;
    this.disposed = false;
    this.onResize = this.onResize.bind(this);
    this.update = this.update.bind(this);

    window.addEventListener("resize", this.onResize);
    this.init();
  }

  init() {
    const { width, height } = this;
    this.clock = new THREE.Clock();
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(width, height);
    this.renderer.domElement.classList.add("smoke-canvas");
    this.mount.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();
    this.addCamera();
    this.addLights();
    this.addParticles();

    this.flash = new THREE.PointLight(0x062d89, 0, 500, 0.7);
    this.updateFlashPosition();
    this.scene.add(this.flash);

    this.camera.position.z = 1000;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));
    this.addNoisePass();
    this.addBlackAndWhitePass();

    this.update();
  }

  addCamera() {
    this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 1, 10000);
    this.scene.add(this.camera);
  }

  addLights() {
    const light = new THREE.DirectionalLight(0xffffff, 0.75);
    light.position.set(-1, 0, 1);
    this.scene.add(light);
  }

  addParticles() {
    const textureLoader = new THREE.TextureLoader();
    this.smokeParticles = [];

    const cloudUrl = "./images/clouds.png";
    const fallbackUrl =
      "";

    const loadTexture = (url) => {
      textureLoader.load(
        url,
        (texture) => {
          if (this.disposed) return;
          const smokeMaterial = new THREE.MeshLambertMaterial({
            color: this.smokeColor,
            map: texture,
            transparent: true,
            opacity: this.smokeOpacity,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          });
          smokeMaterial.map.minFilter = THREE.LinearFilter;
          const smokeGeometry = new THREE.PlaneGeometry(320, 320);

          for (let i = 0; i < this.particleCount; i++) {
            const smokeMesh = new THREE.Mesh(smokeGeometry, smokeMaterial);
            smokeMesh.position.set(
              Math.random() * 500 - 250,
              Math.random() * 500 - 250,
              Math.random() * 1000 - 100
            );
            smokeMesh.rotation.z = Math.random() * Math.PI * 2;
            this.smokeParticles.push(smokeMesh);
            this.scene.add(smokeMesh);
          }
        },
        undefined,
        () => {
          if (url === cloudUrl) loadTexture(fallbackUrl);
        }
      );
    };

    loadTexture(cloudUrl);
  }

  addNoisePass() {
    const noiseShader = {
      uniforms: {
        tDiffuse: { value: null },
        noiseIntensity: { value: 0.05 },
        noiseSize: { value: 4.0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float noiseIntensity;
        uniform float noiseSize;
        varying vec2 vUv;
        float random(vec2 n) {
          return fract(sin(dot(n, vec2(12.9898, 78.233))) * 43758.5453);
        }
        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          vec2 uvs = vUv * noiseSize;
          vec3 noise = vec3(random(uvs + 0.01)) * noiseIntensity;
          color.rgb += noise;
          gl_FragColor = color;
        }
      `,
    };
    this.noisePass = new ShaderPass(noiseShader);
    this.composer.addPass(this.noisePass);
  }

  addBlackAndWhitePass() {
    const bwShader = {
      uniforms: { tDiffuse: { value: null } },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          float gray = dot(color.rgb, vec3(0.3, 0.59, 0.11));
          gl_FragColor = vec4(vec3(gray), color.a);
        }
      `,
    };
    this.blackAndWhitePass = new ShaderPass(bwShader);
    this.composer.addPass(this.blackAndWhitePass);
  }

  evolveSmoke(delta) {
    for (const p of this.smokeParticles) {
      p.rotation.z += delta * 0.2;
    }
  }

  animateThunder() {
    if (Math.random() < this.flashFrequency) {
      if (this.flash.power < 100) this.updateFlashPosition();
      this.flash.power = 50 + Math.random() * this.flashSpeed;
    } else {
      this.flash.power = 0;
    }
  }

  updateFlashPosition() {
    const x = Math.random() * (this.flashMaxX - this.flashMinX) + this.flashMinX;
    const y = Math.random() * (this.flashMaxY - this.flashMinY) + this.flashMinY;
    const z = Math.random() * (this.flashMaxZ - this.flashMinZ) + this.flashMinZ;
    this.flash.position.set(x, y, z);
  }

  render() {
    this.composer.render();
  }

  update() {
    if (this.disposed) return;
    this.rafId = requestAnimationFrame(this.update);
    if (!this.running) return;
    const delta = this.clock.getDelta();
    this.evolveSmoke(delta);
    this.animateThunder();
    this.render();
  }

  onResize() {
    if (this.disposed) return;
    const { innerWidth, innerHeight } = window;
    this.camera.aspect = innerWidth / innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(innerWidth, innerHeight);
    this.composer.setSize(innerWidth, innerHeight);
  }

  pause() {
    this.running = false;
  }

  resume() {
    if (this.disposed) return;
    if (!this.running) {
      this.running = true;
      this.clock.getDelta(); // 丢弃暂停期间累计的时间
    }
  }

  /** 渐隐画布并在结束后停止渲染（省电）。delay 之后才真正销毁。 */
  fadeOut(duration = 900) {
    const canvas = this.renderer.domElement;
    canvas.style.transition = `opacity ${duration}ms ease`;
    canvas.style.opacity = "0";
    window.setTimeout(() => this.dispose(), duration + 60);
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.running = false;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener("resize", this.onResize);
    try {
      for (const p of this.smokeParticles || []) {
        p.geometry?.dispose?.();
        p.material?.map?.dispose?.();
        p.material?.dispose?.();
      }
      this.composer?.passes?.forEach((pass) => pass.dispose?.());
      this.renderer?.dispose?.();
      const el = this.renderer?.domElement;
      if (el && el.parentNode) el.parentNode.removeChild(el);
    } catch (e) {
      /* ignore cleanup errors */
    }
  }
}

// 挂到全局，供 app.js 调用渐隐
const mountEl = document.getElementById("smokeBackground") || document.body;
const reduceMotion =
  typeof matchMedia === "function" &&
  matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!reduceMotion) {
  window.__sannianSmokeBg = new SmokeBackground({ mount: mountEl });
}
