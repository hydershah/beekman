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
  // drawWealthGrowthPath removed for cleaner look

  initWealthManagement() {
    const scale = Math.min(this.width, this.height) / 400;
    const cx = this.width * 0.5;
    const cy = this.height * 0.5; // Centered vertically

    // Core portfolio hub
    this.wmCore = { x: cx, y: cy, r: 34 * scale };
    this.wmOrbitSpeed = 0.05; // Much slower rotation

    // Rotating allocation rings - Simplified
    this.wmRings = [
      { radius: 85 * scale, width: 1 * scale, speed: 0.05, alpha: 0.3, dash: [] }, // Static-ish ring
      { radius: 125 * scale, width: 1 * scale, speed: -0.03, alpha: 0.2, dash: [4 * scale, 4 * scale] }
    ];

    // Asset pillars orbiting the core - Evenly distributed
    const assetLabels = [
      { title: 'Public Markets', short: 'Equities' },
      { title: 'Private Equity', short: 'Growth' },
      { title: 'Credit', short: 'Income' },
      { title: 'Real Assets', short: 'Inflation' },
      { title: 'Cash & Liquidity', short: 'Defense' },
      { title: 'Ventures', short: 'Optionality' }
    ];

    const angleStep = (Math.PI * 2) / assetLabels.length;

    this.wmAssets = assetLabels.map((asset, index) => ({
      ...asset,
      baseAngle: index * angleStep - Math.PI / 2, // Start from top
      color: index % 2 === 0 ? this.colors.accent : this.colors.primary
    }));

    // Flow pulses along the spokes - Slower
    this.wmFlows = this.wmAssets.map(() => ({
      progress: Math.random(),
      speed: 0.001 + Math.random() * 0.001
    }));
    
    // Sparkles removed
  }

  drawWealthManagement() {
    const ctx = this.ctx;
    const now = Date.now();
    const t = now * 0.001;
    const scale = Math.min(this.width, this.height) / 400;
    const cx = this.wmCore.x;
    const cy = this.wmCore.y;

    // Background
    const grad = ctx.createLinearGradient(0, 0, 0, this.height);
    grad.addColorStop(0, '#0a1628');
    grad.addColorStop(1, '#111c2d');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Subtle Radial glow
    const glow = ctx.createRadialGradient(cx, cy, 0, cx, cy, this.width * 0.6);
    glow.addColorStop(0, 'rgba(14, 34, 56, 0.4)');
    glow.addColorStop(1, 'rgba(10, 22, 40, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, this.width, this.height);

    // Grid - Fainter
    ctx.strokeStyle = 'rgba(110, 230, 255, 0.02)';
    ctx.lineWidth = 1;
    const gridSize = 50 * scale;
    for (let x = 0; x < this.width; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, this.height); ctx.stroke();
    }
    for (let y = 0; y < this.height; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(this.width, y); ctx.stroke();
    }

    // Allocation rings
    this.wmRings.forEach((ring) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(t * ring.speed);
      ctx.setLineDash(ring.dash);
      ctx.strokeStyle = `rgba(110, 230, 255, ${ring.alpha})`;
      ctx.lineWidth = ring.width;
      ctx.beginPath();
      ctx.arc(0, 0, ring.radius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    });

    // Connections and asset nodes
    const orbitRadius = this.wmRings[1].radius; // Align with outer ring
    
    this.wmAssets.forEach((asset, idx) => {
      // Calculate position - Slow rotation
      const angle = asset.baseAngle + t * this.wmOrbitSpeed;
      const ax = cx + Math.cos(angle) * orbitRadius;
      const ay = cy + Math.sin(angle) * orbitRadius;

      const dx = this.mouse.x - ax;
      const dy = this.mouse.y - ay;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const hovered = dist < 30 * scale;

      // Connection from core
      const startX = cx + Math.cos(angle) * (this.wmCore.r + 4 * scale);
      const startY = cy + Math.sin(angle) * (this.wmCore.r + 4 * scale);
      
      ctx.strokeStyle = 'rgba(110, 230, 255, 0.15)';
      ctx.lineWidth = 1 * scale;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(ax, ay);
      ctx.stroke();

      // Flow pulse - Subtle
      const flow = this.wmFlows[idx];
      flow.progress += flow.speed;
      if (flow.progress > 1) flow.progress = 0;
      const fx = startX + (ax - startX) * flow.progress;
      const fy = startY + (ay - startY) * flow.progress;
      
      ctx.fillStyle = asset.color;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(fx, fy, 1.5 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Asset node
      ctx.fillStyle = '#0a1628';
      ctx.strokeStyle = hovered ? this.colors.accent : asset.color;
      ctx.lineWidth = 1.5 * scale;
      ctx.beginPath();
      ctx.arc(ax, ay, 8 * scale, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Node label - Clean positioning
      // Calculate label position based on angle to avoid overlap with center
      const labelDist = 20 * scale;
      const lx = ax + Math.cos(angle) * labelDist;
      const ly = ay + Math.sin(angle) * labelDist;
      
      ctx.fillStyle = hovered ? '#fff' : 'rgba(255,255,255,0.9)';
      ctx.font = `${10 * scale + 1}px "Plus Jakarta Sans", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Adjust text alignment based on position relative to center
      if (Math.abs(Math.cos(angle)) > 0.5) {
         ctx.textAlign = Math.cos(angle) > 0 ? 'left' : 'right';
         ctx.fillText(asset.title, ax + (Math.cos(angle) > 0 ? 15 : -15) * scale, ay);
      } else {
         ctx.textAlign = 'center';
         ctx.textBaseline = Math.sin(angle) > 0 ? 'top' : 'bottom';
         ctx.fillText(asset.title, ax, ay + (Math.sin(angle) > 0 ? 15 : -15) * scale);
      }
    });

    // Core hub
    const coreGrad = ctx.createRadialGradient(cx, cy, this.wmCore.r * 0.2, cx, cy, this.wmCore.r);
    coreGrad.addColorStop(0, 'rgba(8, 145, 178, 0.2)');
    coreGrad.addColorStop(1, 'rgba(8, 145, 178, 0.05)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, this.wmCore.r, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = this.colors.accent;
    ctx.lineWidth = 1 * scale;
    ctx.beginPath();
    ctx.arc(cx, cy, this.wmCore.r, 0, Math.PI * 2);
    ctx.stroke();

    // Core Symbol ($)
    ctx.fillStyle = this.colors.accent;
    ctx.font = `600 ${18 * scale}px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('$', cx, cy + 1 * scale);
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
