/**
 * Services Animations - Beekman Strategic
 * Handles interactive canvas animations for service pages
 * Refined for professional, subtle, and relevant visuals
 * Mobile-optimized with touch support and responsive scaling
 */

class ServiceAnimation {
  constructor(containerId, type) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.type = type;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.width = 0;
    this.height = 0;
    this.animationId = null;
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    this.isHovering = false;
    
    // Theme colors - More subtle alpha values
    this.colors = {
      bg: '#0a1628',
      bgGradient: ['#0a1628', '#1a2234'],
      primary: 'rgba(8, 145, 178, 0.8)',
      primaryLow: 'rgba(8, 145, 178, 0.2)',
      accent: 'rgba(110, 230, 255, 0.9)',
      accentLow: 'rgba(110, 230, 255, 0.15)',
      grid: 'rgba(110, 230, 255, 0.03)',
      text: '#6ee6ff'
    };

    this.init();
  }

  init() {
    // Replace SVG with Canvas
    const svg = this.container.querySelector('svg');
    if (svg) svg.style.display = 'none';
    
    this.container.appendChild(this.canvas);
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.borderRadius = '12px';

    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
      this.isHovering = true;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isHovering = false;
    });

    // Touch support
    this.canvas.addEventListener('touchstart', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.touches[0].clientX - rect.left;
      this.mouse.y = e.touches[0].clientY - rect.top;
      this.isHovering = true;
    }, { passive: true });

    this.canvas.addEventListener('touchmove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.touches[0].clientX - rect.left;
      this.mouse.y = e.touches[0].clientY - rect.top;
    }, { passive: true });

    this.canvas.addEventListener('touchend', () => {
      this.isHovering = false;
    });

    // Initialize specific animation elements
    if (this.type === 'investment-banking') this.initInvestmentBanking();
    if (this.type === 'fund-structuring') this.initFundStructuring();
    if (this.type === 'wealth-management') this.initWealthManagement();

    this.animate();
  }

  resize() {
    const rect = this.container.getBoundingClientRect();
    this.width = rect.width;
    this.height = rect.height;
    
    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    
    // Re-init elements if needed on resize
    if (this.type === 'investment-banking') this.initInvestmentBanking();
    if (this.type === 'fund-structuring') this.initFundStructuring();
    if (this.type === 'wealth-management') this.initWealthManagement();
  }

  // ==========================================
  // INVESTMENT BANKING ANIMATION
  // ==========================================
  initInvestmentBanking() {
    const scale = Math.min(this.width, this.height) / 400;
    // Abstract nodes instead of boxes
    this.ibNodes = [
      { x: this.width * 0.2, y: this.height * 0.45, r: 6 * scale + 2, label: 'Origin', type: 'node' },
      { x: this.width * 0.8, y: this.height * 0.45, r: 6 * scale + 2, label: 'Market', type: 'node' },
      { x: this.width * 0.5, y: this.height * 0.45, r: 15 * scale + 5, label: '', type: 'hub' }
    ];
    
    this.ibParticles = [];
    // Fewer particles, slower movement
    for(let i=0; i<6; i++) {
      this.ibParticles.push({
        progress: Math.random(),
        speed: 0.001 + Math.random() * 0.001, // Much slower
        offset: (Math.random() - 0.5) * 10 // Slight vertical variation
      });
    }
  }

  drawInvestmentBanking() {
    const ctx = this.ctx;
    const time = Date.now() * 0.001;
    const scale = Math.min(this.width, this.height) / 400;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, this.colors.bgGradient[0]);
    grad.addColorStop(1, this.colors.bgGradient[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Subtle Grid
    ctx.strokeStyle = this.colors.grid;
    ctx.lineWidth = 0.5;
    const gridSize = 50 * scale;
    for(let x=0; x<this.width; x+=gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, this.height); ctx.stroke();
    }
    for(let y=0; y<this.height; y+=gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(this.width, y); ctx.stroke();
    }

    // Draw Main Connection Line (Curve)
    ctx.strokeStyle = this.colors.primaryLow;
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.moveTo(this.ibNodes[0].x, this.ibNodes[0].y);
    // Quadratic curve through center
    ctx.quadraticCurveTo(this.ibNodes[2].x, this.ibNodes[2].y - 20 * scale, this.ibNodes[1].x, this.ibNodes[1].y);
    ctx.stroke();
    
    // Mirror curve
    ctx.beginPath();
    ctx.moveTo(this.ibNodes[0].x, this.ibNodes[0].y);
    ctx.quadraticCurveTo(this.ibNodes[2].x, this.ibNodes[2].y + 20 * scale, this.ibNodes[1].x, this.ibNodes[1].y);
    ctx.stroke();

    // Draw Particles
    this.ibParticles.forEach(p => {
      p.progress += p.speed;
      if(p.progress >= 1) p.progress = 0;
      
      // Calculate position on curve
      const t = p.progress;
      const p0 = this.ibNodes[0];
      const p1 = { x: this.ibNodes[2].x, y: this.ibNodes[2].y + (p.offset > 0 ? 20 * scale : -20 * scale) }; // Control point
      const p2 = this.ibNodes[1];
      
      // Quadratic bezier formula
      const x = (1-t)*(1-t)*p0.x + 2*(1-t)*t*p1.x + t*t*p2.x;
      const y = (1-t)*(1-t)*p0.y + 2*(1-t)*t*p1.y + t*t*p2.y;

      ctx.fillStyle = this.colors.accent;
      ctx.beginPath();
      ctx.arc(x, y, 1.5 * scale + 1, 0, Math.PI * 2);
      ctx.fill();
      
      // Trail
      ctx.fillStyle = 'rgba(110, 230, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(x - (p.speed * 500 * scale), y, 1 * scale, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw Nodes
    this.ibNodes.forEach((node, i) => {
      // Hover effect
      const dx = this.mouse.x - node.x;
      const dy = this.mouse.y - node.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      const isHovered = dist < 30 * scale;
      
      if (node.type === 'hub') {
        // Central Hub - Abstract
        ctx.strokeStyle = this.colors.accent;
        ctx.lineWidth = 1 * scale;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI*2);
        ctx.stroke();
        
        // Inner rotating ring
        ctx.save();
        ctx.translate(node.x, node.y);
        ctx.rotate(time * 0.5);
        ctx.strokeStyle = this.colors.primary;
        ctx.setLineDash([5 * scale, 10 * scale]);
        ctx.beginPath();
        ctx.arc(0, 0, node.r + 8 * scale, 0, Math.PI*2);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
        
        // Center dot
        ctx.fillStyle = this.colors.accent;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3 * scale, 0, Math.PI*2);
        ctx.fill();

      } else {
        // End Nodes
        ctx.fillStyle = this.colors.bg;
        ctx.strokeStyle = isHovered ? this.colors.accent : this.colors.primary;
        ctx.lineWidth = 1.5 * scale;
        
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.r, 0, Math.PI*2);
        ctx.fill();
        ctx.stroke();
        
        // Label
        ctx.fillStyle = isHovered ? this.colors.accent : 'rgba(110, 230, 255, 0.5)';
        ctx.font = `${10 * scale + 2}px "Plus Jakarta Sans", sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(node.label, node.x, node.y + 20 * scale + 5);
      }
    });
    
    // Draw Financial Chart (Subtle)
    this.drawGraph(this.width * 0.5, this.height * 0.85);
  }

  drawGraph(x, y) {
    const ctx = this.ctx;
    const w = this.width * 0.6;
    const h = this.height * 0.15;
    const scale = Math.min(this.width, this.height) / 400;
    
    ctx.save();
    ctx.translate(x - w/2, y);
    
    // Base line
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 0.5 * scale;
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(w, 0);
    ctx.stroke();
    
    // Chart Line
    ctx.strokeStyle = this.colors.accent;
    ctx.lineWidth = 1.5 * scale;
    ctx.beginPath();
    
    const points = 8;
    const step = w / points;
    const time = Date.now() * 0.0005; // Very slow
    
    ctx.moveTo(0, 0);
    
    for(let i=1; i<=points; i++) {
      const px = i * step;
      // Smooth sine wave combination
      const wave1 = Math.sin(i * 0.8 + time) * (10 * scale);
      const wave2 = Math.cos(i * 0.4 - time * 0.5) * (5 * scale);
      const py = - (i / points) * h * 0.6 + wave1 + wave2;
      
      // Bezier curve for smoothness
      const prevX = (i-1) * step;
      const prevY = - ((i-1) / points) * h * 0.6 + Math.sin((i-1) * 0.8 + time) * (10 * scale) + Math.cos((i-1) * 0.4 - time * 0.5) * (5 * scale);
      
      const cp1x = prevX + step/2;
      const cp1y = prevY;
      const cp2x = px - step/2;
      const cp2y = py;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, px, py);
    }
    ctx.stroke();
    
    // Gradient fill below line
    ctx.lineTo(w, 0);
    ctx.lineTo(0, 0);
    ctx.fillStyle = 'rgba(110, 230, 255, 0.05)';
    ctx.fill();
    
    ctx.restore();
  }

  // ==========================================
  // FUND STRUCTURING ANIMATION
  // ==========================================
  initFundStructuring() {
    // Define hierarchy levels - Simplified
    this.fsLevels = [
      { y: 0.25, nodes: [{ label: 'HOLDCO' }] },
      { y: 0.55, nodes: [{ label: 'SPV I' }, { label: 'SPV II' }] },
      { y: 0.85, nodes: [{ label: 'ASSET A' }, { label: 'ASSET B' }, { label: 'ASSET C' }] }
    ];
    
    this.fsPackets = [];
    setInterval(() => {
      if (this.fsPackets.length < 5) { // Limit active packets
        this.fsPackets.push({
          level: 0,
          sourceIndex: 0,
          targetIndex: Math.floor(Math.random() * 2),
          progress: 0
        });
      }
    }, 2000); // Slower generation
  }

  drawFundStructuring() {
    const ctx = this.ctx;
    const scale = Math.min(this.width, this.height) / 400;
    
    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, this.colors.bgGradient[0]);
    grad.addColorStop(1, this.colors.bgGradient[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Architectural Grid
    ctx.strokeStyle = this.colors.grid;
    ctx.lineWidth = 0.5;
    const gridSize = 40 * scale;
    for(let x=0; x<this.width; x+=gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, this.height); ctx.stroke();
    }
    
    // Draw Hierarchy Lines first (behind nodes)
    this.fsLevels.forEach((level, levelIndex) => {
      if (levelIndex < this.fsLevels.length - 1) {
        const nextLevel = this.fsLevels[levelIndex + 1];
        const y = level.y * this.height;
        const nextY = nextLevel.y * this.height;
        
        const count = level.nodes.length;
        const spacing = this.width / (count + 1);
        
        const nextCount = nextLevel.nodes.length;
        const nextSpacing = this.width / (nextCount + 1);
        
        level.nodes.forEach((node, i) => {
          const x = spacing * (i + 1);
          
          nextLevel.nodes.forEach((nextNode, j) => {
            const nextX = nextSpacing * (j + 1);
            
            // Logic for connections
            let connect = false;
            if (levelIndex === 0) connect = true;
            if (levelIndex === 1) {
               if (i === 0 && j < 2) connect = true;
               if (i === 1 && j >= 1) connect = true;
            }
            
            if (connect) {
              ctx.strokeStyle = this.colors.primaryLow;
              ctx.lineWidth = 0.5 * scale;
              ctx.beginPath();
              // Right-angle connections
              ctx.moveTo(x, y + 15 * scale);
              ctx.lineTo(x, y + (nextY-y)/2);
              ctx.lineTo(nextX, y + (nextY-y)/2);
              ctx.lineTo(nextX, nextY - 15 * scale);
              ctx.stroke();
            }
          });
        });
      }
    });

    // Draw Nodes
    this.fsLevels.forEach((level, levelIndex) => {
      const y = level.y * this.height;
      const count = level.nodes.length;
      const spacing = this.width / (count + 1);
      
      level.nodes.forEach((node, nodeIndex) => {
        const x = spacing * (nodeIndex + 1);
        node.x = x;
        node.y = y;
        
        const w = 80 * scale;
        const h = 24 * scale;
        
        // Check hover
        const dx = this.mouse.x - x;
        const dy = this.mouse.y - y;
        const isHovered = Math.abs(dx) < w/2 && Math.abs(dy) < h/2;
        
        ctx.fillStyle = this.colors.bg;
        ctx.strokeStyle = isHovered ? this.colors.accent : this.colors.primary;
        ctx.lineWidth = 1 * scale;
        
        ctx.beginPath();
        ctx.roundRect(x - w/2, y - h/2, w, h, 2 * scale);
        ctx.fill();
        ctx.stroke();
        
        ctx.fillStyle = isHovered ? this.colors.accent : 'rgba(110, 230, 255, 0.7)';
        ctx.font = `${9 * scale + 2}px "Plus Jakarta Sans", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, x, y);
      });
    });
    
    // Draw Packets (Data flow)
    this.fsPackets.forEach((p, i) => {
      p.progress += 0.005; // Very slow flow
      if (p.progress >= 1) {
        if (p.level < this.fsLevels.length - 2) {
          p.level++;
          p.progress = 0;
          p.sourceIndex = p.targetIndex;
          // Simple logic for next target
          if (p.level === 1) {
             if (p.sourceIndex === 0) p.targetIndex = Math.floor(Math.random() * 2);
             else p.targetIndex = 1 + Math.floor(Math.random() * 2);
             // Clamp
             if (p.targetIndex > 2) p.targetIndex = 2;
          }
        } else {
          this.fsPackets.splice(i, 1);
          return;
        }
      }
      
      const currentLevel = this.fsLevels[p.level];
      const nextLevel = this.fsLevels[p.level + 1];
      const sourceNode = currentLevel.nodes[p.sourceIndex];
      let targetNode = nextLevel.nodes[p.targetIndex];
      if (!targetNode) targetNode = nextLevel.nodes[0];
      
      const sx = sourceNode.x;
      const sy = sourceNode.y + 12 * scale;
      const tx = targetNode.x;
      const ty = targetNode.y - 12 * scale;
      
      // Right angle path
      let x, y;
      const midY = sy + (ty - sy)/2;
      
      if (p.progress < 0.5) {
        const localProg = p.progress * 2;
        if (localProg < 0.5) {
           x = sx;
           y = sy + (midY - sy) * (localProg * 2);
        } else {
           x = sx + (tx - sx) * ((localProg - 0.5) * 2);
           y = midY;
        }
      } else {
        const localProg = (p.progress - 0.5) * 2;
        x = tx;
        y = midY + (ty - midY) * localProg;
      }
      
      ctx.fillStyle = this.colors.accent;
      ctx.beginPath();
      ctx.arc(x, y, 1.5 * scale + 1, 0, Math.PI*2);
      ctx.fill();
    });
  }

  // ==========================================
  // WEALTH MANAGEMENT ANIMATION
  // ==========================================
  initWealthManagement() {
    // Concept: "The Financial Landscape" - Accumulation and Growth
    // Stacked, flowing waves representing the growth of a diversified portfolio over time.
    // It conveys "Volume", "Stability", and "Smooth Growth".
    
    this.wmLayers = [];
    const layerCount = 4;
    
    for(let i=0; i<layerCount; i++) {
      this.wmLayers.push({
        offset: i * 20, // Vertical offset
        speed: 0.0005 + (i * 0.0002), // Different speeds for parallax
        amplitude: 15 + (i * 5), // Wave height
        color: i === 0 ? this.colors.accent : this.colors.primary, // Top layer is accent
        alpha: 0.1 + (i * 0.15), // Bottom layers are more opaque
        points: [] // Will be populated in draw
      });
    }
    
    // "Milestone" particles floating above the landscape
    this.wmParticles = [];
    for(let i=0; i<5; i++) {
      this.wmParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * (this.height * 0.5),
        r: Math.random() * 2 + 1,
        speedY: -0.2 - Math.random() * 0.3,
        alpha: Math.random()
      });
    }
  }

  drawWealthManagement() {
    const ctx = this.ctx;
    const time = Date.now();
    const scale = Math.min(this.width, this.height) / 400;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, '#0a1628');
    grad.addColorStop(1, '#1a2234');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw Grid (Subtle background structure)
    ctx.strokeStyle = 'rgba(110, 230, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 40 * scale;
    for(let x=0; x<this.width; x+=gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, this.height); ctx.stroke();
    }

    // Draw Stacked Waves (Back to Front)
    // We draw from the last layer (furthest back/bottom) to the first (top)
    // Actually, usually back layers are drawn first.
    // Let's say layer[3] is the big background one, layer[0] is the sharp foreground one.
    
    this.wmLayers.slice().reverse().forEach((layer, index) => {
      // Actual index in original array
      const originalIndex = this.wmLayers.length - 1 - index;
      
      ctx.beginPath();
      ctx.moveTo(0, this.height); // Start bottom left

      const points = 10;
      const step = this.width / points;
      
      // Generate wave points
      for(let i=0; i<=points; i++) {
        const x = i * step;
        // Base height rises slightly from left to right (Growth trend)
        const trend = (i / points) * (40 * scale); 
        const baseHeight = this.height * 0.7 - (originalIndex * 30 * scale) - trend;
        
        // Sine wave motion
        const wave = Math.sin((i * 0.5) + (time * layer.speed)) * (layer.amplitude * scale);
        const wave2 = Math.cos((i * 0.2) + (time * layer.speed * 0.5)) * (layer.amplitude * 0.5 * scale);
        
        // Mouse interaction (Repel/Attract)
        const dx = this.mouse.x - x;
        const dist = Math.abs(dx);
        const mouseEffect = Math.max(0, (1 - dist / (200 * scale))) * (20 * scale);
        
        const y = baseHeight + wave + wave2 - mouseEffect;
        
        // Smooth curve
        if (i === 0) {
          ctx.lineTo(x, y);
        } else {
          // Simple smoothing (could be better with bezier, but lineTo with high point count is okay for this style)
          // Let's use quadratic for better smoothness with fewer points
          const prevX = (i-1) * step;
          // We need to store previous Y. 
          // For simplicity in this loop, let's just use high point count or simple lineTo.
          // Actually, let's use the bezier helper logic from before if we want super smooth.
          // But here, let's just do a simple curve.
          
          // Re-calculate prevY for the curve control
          const prevTrend = ((i-1) / points) * (40 * scale);
          const prevBase = this.height * 0.7 - (originalIndex * 30 * scale) - prevTrend;
          const prevWave = Math.sin(((i-1) * 0.5) + (time * layer.speed)) * (layer.amplitude * scale);
          const prevWave2 = Math.cos(((i-1) * 0.2) + (time * layer.speed * 0.5)) * (layer.amplitude * 0.5 * scale);
          const prevMouse = Math.max(0, (1 - Math.abs(this.mouse.x - prevX) / (200 * scale))) * (20 * scale);
          const prevY = prevBase + prevWave + prevWave2 - prevMouse;

          const cpX = (prevX + x) / 2;
          const cpY = (prevY + y) / 2;
          ctx.quadraticCurveTo(prevX, prevY, cpX, cpY);
          
          if (i === points) ctx.lineTo(x, y); // Finish
        }
      }

      ctx.lineTo(this.width, this.height); // Bottom right
      ctx.closePath();

      // Fill
      const fillGrad = ctx.createLinearGradient(0, 0, 0, this.height);
      fillGrad.addColorStop(0, layer.color);
      fillGrad.addColorStop(1, 'rgba(10, 22, 40, 0)'); // Fade to transparent
      
      ctx.fillStyle = fillGrad;
      ctx.globalAlpha = layer.alpha;
      ctx.fill();
      
      // Stroke top edge
      ctx.strokeStyle = layer.color;
      ctx.lineWidth = 1.5 * scale;
      ctx.globalAlpha = 0.8;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    });

    // Draw "Growth Particles" (Rising bubbles)
    this.wmParticles.forEach(p => {
      p.y += p.speedY * scale;
      p.alpha -= 0.005;
      
      // Reset if off screen or invisible
      if (p.y < 0 || p.alpha <= 0) {
        p.y = this.height * 0.7 + Math.random() * 50;
        p.x = Math.random() * this.width;
        p.alpha = 1;
        p.speedY = -0.2 - Math.random() * 0.3;
      }
      
      ctx.fillStyle = this.colors.accent;
      ctx.globalAlpha = p.alpha * 0.6;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r * scale, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    });
    
    // Draw "Asset Nodes" on the top layer (The "Fruits" of the landscape)
    // Just a few static-ish nodes that ride the top wave
    const topLayer = this.wmLayers[0];
    const nodeCount = 3;
    for(let i=1; i<=nodeCount; i++) {
      const x = (this.width / (nodeCount + 1)) * i;
      
      // Calculate Y for this X on top layer (simplified calculation matching the loop above)
      const points = 10;
      const step = this.width / points;
      const idx = x / step; // Float index
      
      const trend = (idx / points) * (40 * scale);
      const baseHeight = this.height * 0.7 - trend;
      const wave = Math.sin((idx * 0.5) + (time * topLayer.speed)) * (topLayer.amplitude * scale);
      const wave2 = Math.cos((idx * 0.2) + (time * topLayer.speed * 0.5)) * (topLayer.amplitude * 0.5 * scale);
      const mouseEffect = Math.max(0, (1 - Math.abs(this.mouse.x - x) / (200 * scale))) * (20 * scale);
      const y = baseHeight + wave + wave2 - mouseEffect;
      
      // Draw Node
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(x, y, 3 * scale, 0, Math.PI*2);
      ctx.fill();
      
      // Label line
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x, y - 20 * scale);
      ctx.stroke();
      
      // Label dot
      ctx.fillStyle = this.colors.accent;
      ctx.beginPath();
      ctx.arc(x, y - 20 * scale, 1.5 * scale, 0, Math.PI*2);
      ctx.fill();
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    if (this.type === 'investment-banking') this.drawInvestmentBanking();
    if (this.type === 'fund-structuring') this.drawFundStructuring();
    if (this.type === 'wealth-management') this.drawWealthManagement();
    
    this.animationId = requestAnimationFrame(() => this.animate());
  }
}

// Initialize based on page
document.addEventListener('DOMContentLoaded', () => {
  // Check for containers
  const ibContainer = document.querySelector('.service-illustration');
  
  // Determine page type based on URL or content
  const path = window.location.pathname;
  
  if (path.includes('investment-banking')) {
    // Add ID to container if not present
    if (ibContainer) {
      ibContainer.id = 'ib-animation-container';
      new ServiceAnimation('ib-animation-container', 'investment-banking');
    }
  } else if (path.includes('fund-structuring')) {
    if (ibContainer) {
      ibContainer.id = 'fs-animation-container';
      new ServiceAnimation('fs-animation-container', 'fund-structuring');
    }
  } else if (path.includes('wealth-management')) {
    if (ibContainer) {
      ibContainer.id = 'wm-animation-container';
      new ServiceAnimation('wm-animation-container', 'wealth-management');
    }
  }
});
