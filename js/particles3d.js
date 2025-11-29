/**
 * 3D Particle Animation - Beekman Strategic
 * Creates a flowing particle sphere with BEEKMAN text in center
 */

class ParticleAnimation {
  constructor(container) {
    this.container = container;
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.particles = null;
    this.textParticles = null;
    this.floatingLabels = [];
    this.currentLabelIndex = 0;
    this.labelTimer = 0;
    this.labelDuration = 3.0; // seconds per label
    this.labelFadeTime = 0.8; // fade in/out time
    this.mouseX = 0;
    this.mouseY = 0;
    this.mouseWorld = new THREE.Vector3();
    this.mouseRay = new THREE.Ray();
    this.mouse = new THREE.Vector2();
    this.clock = new THREE.Clock();
    this.isHovering = false;
    this.currentHover = 0;

    // Service labels to display
    this.serviceLabels = [
      'Asset & Wealth',
      'Investment Banking',
      'Fund Structuring',
      'AI Advisor'
    ];

    this.init();
    this.animate();
    this.addEventListeners();
  }

  init() {
    // Scene
    this.scene = new THREE.Scene();

    // Camera
    const aspect = this.container.clientWidth / this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1500);
    this.camera.position.z = 800;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
    this.container.appendChild(this.renderer.domElement);

    // Create particles
    this.createParticles();
    this.createTextParticles();
    this.createFloatingLabel();
  }

  // Generate points from text using canvas
  getTextPoints(text, fontSize = 140) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    ctx.font = `900 ${fontSize}px Arial, sans-serif`;
    const metrics = ctx.measureText(text);

    canvas.width = Math.ceil(metrics.width) + 40;
    canvas.height = fontSize + 40;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `900 ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 20, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const points = [];
    const density = 1.0; // Higher density for sharper text

    for (let y = 0; y < canvas.height; y += density) {
      for (let x = 0; x < canvas.width; x += density) {
        const i = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
        if (imageData.data[i] > 128) {
          // Center the text with minimal depth variation for sharpness
          points.push({
            x: (x - canvas.width / 2) * 1.5,
            y: -(y - canvas.height / 2) * 1.5,
            z: (Math.random() - 0.5) * 8
          });
        }
      }
    }

    return points;
  }

  createTextParticles() {
    const textPoints = this.getTextPoints('BEEKMAN');
    const particleCount = textPoints.length;

    const positions = new Float32Array(particleCount * 3);
    const originalPositions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const randoms = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      positions[i3] = textPoints[i].x;
      positions[i3 + 1] = textPoints[i].y;
      positions[i3 + 2] = textPoints[i].z;

      // Store original positions for returning
      originalPositions[i3] = textPoints[i].x;
      originalPositions[i3 + 1] = textPoints[i].y;
      originalPositions[i3 + 2] = textPoints[i].z;

      // Cyan accent color - #6ee6ff (matching dark mode accent)
      colors[i3] = 110/255;
      colors[i3 + 1] = 230/255;
      colors[i3 + 2] = 255/255;

      sizes[i] = Math.random() * 0.6 + 1.0;
      randoms[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aOriginalPosition', new THREE.BufferAttribute(originalPositions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouseRayOrigin: { value: new THREE.Vector3(0, 0, 800) },
        uMouseRayDir: { value: new THREE.Vector3(0, 0, -1) },
        uHover: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        attribute float aRandom;
        attribute vec3 aOriginalPosition;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vHighlight;
        uniform float uTime;
        uniform vec3 uMouseRayOrigin;
        uniform vec3 uMouseRayDir;
        uniform float uHover;
        uniform float uPixelRatio;

        // Distance from point to ray
        float distanceToRay(vec3 point, vec3 rayOrigin, vec3 rayDir) {
          vec3 v = point - rayOrigin;
          float t = dot(v, rayDir);
          vec3 closestPoint = rayOrigin + rayDir * t;
          return length(point - closestPoint);
        }

        void main() {
          vColor = color;

          vec3 pos = aOriginalPosition;

          // Subtle floating animation (reduced for sharpness)
          float floatY = sin(uTime * 1.5 + aRandom * 6.28) * 0.8;
          float floatX = cos(uTime * 1.2 + aRandom * 6.28) * 0.6;
          pos.y += floatY * aRandom;
          pos.x += floatX * aRandom;

          // Individual particle mouse interaction - RAY BASED
          float distToRay = distanceToRay(pos, uMouseRayOrigin, uMouseRayDir);
          float interactionRadius = 25.0;
          float repulsionStrength = 20.0;

          float influence = 1.0 - smoothstep(0.0, interactionRadius, distToRay);
          influence = influence * influence * uHover;

          // Push particle away from ray
          vec3 toRayOrigin = pos - uMouseRayOrigin;
          float t = dot(toRayOrigin, uMouseRayDir);
          vec3 closestPointOnRay = uMouseRayOrigin + uMouseRayDir * t;
          vec3 awayFromRay = pos - closestPointOnRay;

          if (length(awayFromRay) > 0.001) {
            vec3 repulsion = normalize(awayFromRay) * influence * repulsionStrength * (0.8 + aRandom * 0.4);
            pos += repulsion;
          }

          vHighlight = influence;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Size boost on hover
          float sizeBoost = 1.0 + influence * 0.3;
          gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z) * sizeBoost;

          vAlpha = 0.95 + influence * 0.05;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        varying float vHighlight;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          // Sharper edges with tighter smoothstep
          float alpha = 1.0 - smoothstep(0.0, 0.4, dist);
          alpha *= vAlpha;

          vec3 color = vColor;
          // Subtle glow effect
          color += (1.0 - dist * 2.0) * 0.15;

          // Brighten on hover
          vec3 highlightColor = vec3(1.0, 0.98, 0.9);
          color = mix(color, highlightColor, vHighlight * 0.6);

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    this.textParticles = new THREE.Points(geometry, material);
    this.scene.add(this.textParticles);
  }

  // Get points for smaller floating labels
  getLabelPoints(text, fontSize = 32) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    ctx.font = `600 ${fontSize}px Arial, sans-serif`;
    const metrics = ctx.measureText(text);

    canvas.width = Math.ceil(metrics.width) + 20;
    canvas.height = fontSize + 16;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `600 ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = '#fff';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 10, canvas.height / 2);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const points = [];
    const density = 2;

    for (let y = 0; y < canvas.height; y += density) {
      for (let x = 0; x < canvas.width; x += density) {
        const i = (Math.floor(y) * canvas.width + Math.floor(x)) * 4;
        if (imageData.data[i] > 128) {
          points.push({
            x: (x - canvas.width / 2) * 1.2,
            y: -(y - canvas.height / 2) * 1.2,
            z: (Math.random() - 0.5) * 10
          });
        }
      }
    }

    return points;
  }

  createFloatingLabel() {
    // Remove existing floating label if any
    if (this.currentFloatingLabel) {
      this.scene.remove(this.currentFloatingLabel);
      this.currentFloatingLabel.geometry.dispose();
      this.currentFloatingLabel.material.dispose();
    }

    // Get random label
    const labelText = this.serviceLabels[this.currentLabelIndex];
    const labelPoints = this.getLabelPoints(labelText);
    const particleCount = labelPoints.length;

    // Random position within the sphere (but avoiding center where BEEKMAN is)
    const angle = Math.random() * Math.PI * 2;
    const yOffset = (Math.random() - 0.5) * 60;
    const radius = 40 + Math.random() * 30;
    const offsetX = Math.cos(angle) * radius;
    const offsetY = yOffset + (Math.random() > 0.5 ? 50 : -50); // Above or below BEEKMAN
    const offsetZ = Math.sin(angle) * radius * 0.3;

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const randoms = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      positions[i3] = labelPoints[i].x + offsetX;
      positions[i3 + 1] = labelPoints[i].y + offsetY;
      positions[i3 + 2] = labelPoints[i].z + offsetZ;

      // Slightly dimmer cyan for labels
      colors[i3] = 110/255 * 0.7;
      colors[i3 + 1] = 230/255 * 0.7;
      colors[i3 + 2] = 255/255 * 0.7;

      sizes[i] = Math.random() * 1.0 + 1.0;
      randoms[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        attribute float aRandom;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform float uOpacity;
        uniform float uPixelRatio;

        void main() {
          vColor = color;

          vec3 pos = position;

          // Subtle floating
          float floatY = sin(uTime * 1.5 + aRandom * 6.28) * 2.0;
          pos.y += floatY * aRandom;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z);

          vAlpha = uOpacity;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
          alpha *= vAlpha;

          vec3 color = vColor;
          color += (1.0 - dist * 2.0) * 0.2;

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    this.currentFloatingLabel = new THREE.Points(geometry, material);
    this.scene.add(this.currentFloatingLabel);

    // Move to next label for next time
    this.currentLabelIndex = (this.currentLabelIndex + 1) % this.serviceLabels.length;
  }

  createParticles() {
    const particleCount = 12000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const randoms = new Float32Array(particleCount);

    // Create a sphere of particles with hollow center for text
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Sphere distribution - hollow in center
      const minRadius = 100; // Inner radius (space for text)
      const maxRadius = 200; // Outer radius
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      // Add some noise for organic look
      const noise = (Math.random() - 0.5) * 20;

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta) + noise;
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) + noise;
      positions[i3 + 2] = radius * Math.cos(phi) + noise;

      // Color gradient - cyan (#6ee6ff) to navy (#0a1628)
      const mixFactor = Math.random();
      // Cyan: #6ee6ff -> RGB(110, 230, 255)
      // Navy muted: #7a92b0 -> RGB(122, 146, 176)
      colors[i3] = (110/255) * (1 - mixFactor * 0.7) + (122/255) * (mixFactor * 0.7);
      colors[i3 + 1] = (230/255) * (1 - mixFactor * 0.5) + (146/255) * (mixFactor * 0.5);
      colors[i3 + 2] = (255/255) * (1 - mixFactor * 0.3) + (176/255) * (mixFactor * 0.3);

      sizes[i] = Math.random() * 2.5 + 0.5;
      randoms[i] = Math.random();
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    // Custom shader material
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouseRayOrigin: { value: new THREE.Vector3(0, 0, 800) },
        uMouseRayDir: { value: new THREE.Vector3(0, 0, -1) },
        uHover: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        attribute float aRandom;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vHighlight;
        uniform float uTime;
        uniform vec3 uMouseRayOrigin;
        uniform vec3 uMouseRayDir;
        uniform float uHover;
        uniform float uPixelRatio;

        // Simplex noise function
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
        vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

        float snoise(vec3 v) {
          const vec2 C = vec2(1.0/6.0, 1.0/3.0);
          const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
          vec3 i = floor(v + dot(v, C.yyy));
          vec3 x0 = v - i + dot(i, C.xxx);
          vec3 g = step(x0.yzx, x0.xyz);
          vec3 l = 1.0 - g;
          vec3 i1 = min(g.xyz, l.zxy);
          vec3 i2 = max(g.xyz, l.zxy);
          vec3 x1 = x0 - i1 + C.xxx;
          vec3 x2 = x0 - i2 + C.yyy;
          vec3 x3 = x0 - D.yyy;
          i = mod289(i);
          vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
          float n_ = 0.142857142857;
          vec3 ns = n_ * D.wyz - D.xzx;
          vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
          vec4 x_ = floor(j * ns.z);
          vec4 y_ = floor(j - 7.0 * x_);
          vec4 x = x_ *ns.x + ns.yyyy;
          vec4 y = y_ *ns.x + ns.yyyy;
          vec4 h = 1.0 - abs(x) - abs(y);
          vec4 b0 = vec4(x.xy, y.xy);
          vec4 b1 = vec4(x.zw, y.zw);
          vec4 s0 = floor(b0)*2.0 + 1.0;
          vec4 s1 = floor(b1)*2.0 + 1.0;
          vec4 sh = -step(h, vec4(0.0));
          vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
          vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
          vec3 p0 = vec3(a0.xy, h.x);
          vec3 p1 = vec3(a0.zw, h.y);
          vec3 p2 = vec3(a1.xy, h.z);
          vec3 p3 = vec3(a1.zw, h.w);
          vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
          p0 *= norm.x;
          p1 *= norm.y;
          p2 *= norm.z;
          p3 *= norm.w;
          vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
          m = m * m;
          return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
        }

        // Distance from point to ray (line)
        float distanceToRay(vec3 point, vec3 rayOrigin, vec3 rayDir) {
          vec3 v = point - rayOrigin;
          float t = dot(v, rayDir);
          vec3 closestPoint = rayOrigin + rayDir * t;
          return length(point - closestPoint);
        }

        void main() {
          vColor = color;

          vec3 pos = position;

          // Flow animation
          float noiseFreq = 0.012;
          float noiseAmp = 20.0;
          float time = uTime * 0.25;

          vec3 noisePos = pos * noiseFreq + time;
          float noise = snoise(noisePos);

          // Calculate normal (outward from center)
          vec3 normal = normalize(pos);

          // Displacement based on noise
          pos += normal * noise * noiseAmp * aRandom;

          // Rotation
          float angle = uTime * 0.08;
          mat3 rotationY = mat3(
            cos(angle), 0.0, sin(angle),
            0.0, 1.0, 0.0,
            -sin(angle), 0.0, cos(angle)
          );
          pos = rotationY * pos;

          // Mouse hover interaction - RAY-BASED for full 3D depth
          float distToRay = distanceToRay(pos, uMouseRayOrigin, uMouseRayDir);
          float interactionRadius = 35.0;
          float repulsionStrength = 25.0;

          // Calculate repulsion based on distance to mouse ray
          float influence = 1.0 - smoothstep(0.0, interactionRadius, distToRay);
          influence = influence * influence * uHover;

          // Push particles away from the ray
          vec3 toRayOrigin = pos - uMouseRayOrigin;
          float t = dot(toRayOrigin, uMouseRayDir);
          vec3 closestPointOnRay = uMouseRayOrigin + uMouseRayDir * t;
          vec3 awayFromRay = pos - closestPointOnRay;

          if (length(awayFromRay) > 0.001) {
            vec3 repulsion = normalize(awayFromRay) * influence * repulsionStrength * (0.5 + aRandom);
            pos += repulsion;
          }

          vHighlight = influence;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          // Size attenuation - particles near mouse get bigger
          float sizeBoost = 1.0 + influence * 0.4;
          gl_PointSize = size * uPixelRatio * (300.0 / -mvPosition.z) * sizeBoost;

          // Alpha
          vAlpha = 0.5 + noise * 0.3 + influence * 0.5;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        varying float vHighlight;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float alpha = 1.0 - smoothstep(0.25, 0.5, dist);
          alpha *= vAlpha;

          vec3 color = vColor;
          color += (1.0 - dist * 2.0) * 0.15;

          // Highlight when mouse is near
          vec3 highlightColor = vec3(1.0, 0.95, 0.85);
          color = mix(color, highlightColor, vHighlight * 0.8);
          alpha = min(alpha + vHighlight * 0.4, 1.0);

          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  addEventListeners() {
    window.addEventListener('resize', () => this.onResize());
    this.container.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.container.addEventListener('mouseenter', () => this.onMouseEnter());
    this.container.addEventListener('mouseleave', () => this.onMouseLeave());
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  onMouseMove(event) {
    const rect = this.container.getBoundingClientRect();

    // Normalized device coordinates (-1 to +1)
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // Store screen position for text particles
    this.mouseX = (event.clientX - rect.left - rect.width / 2);
    this.mouseY = (event.clientY - rect.top - rect.height / 2);

    // Calculate mouse ray for 3D interaction
    const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
    vector.unproject(this.camera);

    this.mouseRay.origin.copy(this.camera.position);
    this.mouseRay.direction.copy(vector.sub(this.camera.position).normalize());
  }

  onMouseEnter() {
    this.isHovering = true;
  }

  onMouseLeave() {
    this.isHovering = false;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // Smooth hover transition
    const targetHover = this.isHovering ? 1.0 : 0.0;
    this.currentHover += (targetHover - this.currentHover) * 0.1;

    // Update sphere particle uniforms
    if (this.particles) {
      this.particles.material.uniforms.uTime.value = elapsedTime;
      this.particles.material.uniforms.uMouseRayOrigin.value.copy(this.mouseRay.origin);
      this.particles.material.uniforms.uMouseRayDir.value.copy(this.mouseRay.direction);
      this.particles.material.uniforms.uHover.value = this.currentHover;
    }

    // Update text particle uniforms
    if (this.textParticles) {
      this.textParticles.material.uniforms.uTime.value = elapsedTime;
      this.textParticles.material.uniforms.uMouseRayOrigin.value.copy(this.mouseRay.origin);
      this.textParticles.material.uniforms.uMouseRayDir.value.copy(this.mouseRay.direction);
      this.textParticles.material.uniforms.uHover.value = this.currentHover;
    }

    // Update floating label animation
    if (this.currentFloatingLabel) {
      if (!this.lastTime) this.lastTime = elapsedTime;
      const deltaTime = elapsedTime - this.lastTime;
      this.lastTime = elapsedTime;
      this.labelTimer += deltaTime;

      // Calculate opacity based on timer
      let opacity = 0;
      if (this.labelTimer < this.labelFadeTime) {
        // Fade in
        opacity = this.labelTimer / this.labelFadeTime;
      } else if (this.labelTimer < this.labelDuration - this.labelFadeTime) {
        // Fully visible
        opacity = 1;
      } else if (this.labelTimer < this.labelDuration) {
        // Fade out
        opacity = (this.labelDuration - this.labelTimer) / this.labelFadeTime;
      } else {
        // Time to switch to next label
        this.labelTimer = 0;
        this.createFloatingLabel();
        opacity = 0;
      }

      this.currentFloatingLabel.material.uniforms.uTime.value = elapsedTime;
      this.currentFloatingLabel.material.uniforms.uOpacity.value = opacity;
    }

    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
    if (this.particles) {
      this.particles.geometry.dispose();
      this.particles.material.dispose();
    }
    if (this.textParticles) {
      this.textParticles.geometry.dispose();
      this.textParticles.material.dispose();
    }
    if (this.currentFloatingLabel) {
      this.currentFloatingLabel.geometry.dispose();
      this.currentFloatingLabel.material.dispose();
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('particle-container');
  if (container) {
    window.particleAnimation = new ParticleAnimation(container);
  }
});
