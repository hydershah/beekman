/**
 * Constellation Animation - Organic floating nodes with connections
 * For Wealth Management service page
 */

function initConstellation() {
  const canvas = document.getElementById('constellationCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationId;
  let width, height;

  // Configuration - will be adjusted based on canvas size
  const config = {
    nodeCount: 12,
    connectionDistance: 100,
    nodeSpeed: 0.3,
    centerRadius: 45,
    labelDistance: 140
  };

  // Service labels that orbit
  const labels = [
    'Asset & Wealth',
    'Investment Banking',
    'Fund Structuring',
    'Alternative Investments',
    'AI Advisory'
  ];

  // Nodes array
  let nodes = [];
  let labelNodes = [];

  // Get theme colors - always dark to match other service animations
  function getColors() {
    return {
      node: 'rgba(110, 230, 255, 0.6)',
      line: 'rgba(110, 230, 255, 0.15)',
      center: '#6ee6ff',
      centerBg: 'rgba(10, 22, 40, 0.95)',
      label: 'rgba(255, 255, 255, 0.9)',
      labelBg: 'rgba(10, 22, 40, 0.85)',
      labelBorder: 'rgba(110, 230, 255, 0.3)'
    };
  }

  // Resize canvas
  function resize() {
    const container = canvas.parentElement;
    const rect = container.getBoundingClientRect();
    width = rect.width || 400;
    height = rect.height || 400;

    // Ensure minimum height
    if (height < 300) {
      height = 400;
      container.style.height = height + 'px';
    }

    // Reset canvas transform before scaling
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    canvas.width = width * 2;
    canvas.height = height * 2;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(2, 2);

    // Scale configuration based on available space
    const minDim = Math.min(width, height);
    const isMobile = width < 500;

    // More compact layout for mobile
    if (isMobile) {
      config.labelDistance = Math.min(90, minDim * 0.30);
      config.centerRadius = Math.min(30, minDim * 0.10);
      config.connectionDistance = Math.min(70, minDim * 0.20);
      config.nodeCount = 6; // Fewer nodes on mobile
    } else {
      config.labelDistance = Math.min(160, minDim * 0.38);
      config.centerRadius = Math.min(50, minDim * 0.12);
      config.connectionDistance = Math.min(120, minDim * 0.28);
      config.nodeCount = 12;
    }
  }

  // Create a node
  function createNode(isLabel = false, index = 0) {
    const centerX = width / 2;
    const centerY = height / 2;

    if (isLabel) {
      // Position labels around center
      const angle = (index / labels.length) * Math.PI * 2 - Math.PI / 2;
      const distance = config.labelDistance;
      return {
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        vx: 0,
        vy: 0,
        baseAngle: angle,
        orbitSpeed: 0.0003 + Math.random() * 0.0002,
        label: labels[index],
        isLabel: true
      };
    }

    // Regular floating node
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * (Math.min(width, height) / 2 - 100);
    return {
      x: centerX + Math.cos(angle) * distance,
      y: centerY + Math.sin(angle) * distance,
      vx: (Math.random() - 0.5) * config.nodeSpeed,
      vy: (Math.random() - 0.5) * config.nodeSpeed,
      size: 2 + Math.random() * 3,
      isLabel: false
    };
  }

  // Initialize nodes
  function initNodes() {
    nodes = [];
    labelNodes = [];

    for (let i = 0; i < config.nodeCount; i++) {
      nodes.push(createNode(false, i));
    }

    for (let i = 0; i < labels.length; i++) {
      labelNodes.push(createNode(true, i));
    }
  }

  // Update node positions
  function updateNodes() {
    const centerX = width / 2;
    const centerY = height / 2;
    const time = Date.now();

    // Update regular nodes
    nodes.forEach(node => {
      // Add slight attraction to center
      const dx = centerX - node.x;
      const dy = centerY - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Keep nodes within bounds but not too close to center
      if (dist > Math.min(width, height) / 2 - 50) {
        node.vx += dx * 0.0005;
        node.vy += dy * 0.0005;
      } else if (dist < 100) {
        node.vx -= dx * 0.001;
        node.vy -= dy * 0.001;
      }

      // Add some random movement
      node.vx += (Math.random() - 0.5) * 0.02;
      node.vy += (Math.random() - 0.5) * 0.02;

      // Damping
      node.vx *= 0.99;
      node.vy *= 0.99;

      // Update position
      node.x += node.vx;
      node.y += node.vy;
    });

    // Update label nodes - orbit around center
    labelNodes.forEach((node, i) => {
      node.baseAngle += node.orbitSpeed;
      const wobble = Math.sin(time * 0.001 + i) * 10;
      node.x = centerX + Math.cos(node.baseAngle) * (config.labelDistance + wobble);
      node.y = centerY + Math.sin(node.baseAngle) * (config.labelDistance + wobble);
    });
  }

  // Draw the constellation
  function draw() {
    const colors = getColors();
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;

    // Draw connections between nearby nodes
    ctx.strokeStyle = colors.line;
    ctx.lineWidth = 1;

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < config.connectionDistance) {
          const opacity = 1 - dist / config.connectionDistance;
          ctx.globalAlpha = opacity * 0.3;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      // Connect to center
      const dx = nodes[i].x - centerX;
      const dy = nodes[i].y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < config.connectionDistance * 1.5) {
        const opacity = 1 - dist / (config.connectionDistance * 1.5);
        ctx.globalAlpha = opacity * 0.2;
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(centerX, centerY);
        ctx.stroke();
      }
    }

    ctx.globalAlpha = 1;

    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
      ctx.fillStyle = colors.node;
      ctx.fill();
    });

    // Draw center "B"
    ctx.beginPath();
    ctx.arc(centerX, centerY, config.centerRadius, 0, Math.PI * 2);
    ctx.fillStyle = colors.centerBg;
    ctx.fill();
    ctx.strokeStyle = colors.center;
    ctx.lineWidth = 2;
    ctx.stroke();

    const centerFontSize = Math.max(24, config.centerRadius * 0.7);
    ctx.font = `bold ${centerFontSize}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillStyle = colors.center;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('B', centerX, centerY);

    // Draw label nodes
    labelNodes.forEach(node => {
      // Draw connecting line to center
      ctx.beginPath();
      ctx.moveTo(node.x, node.y);
      ctx.lineTo(centerX, centerY);
      ctx.strokeStyle = colors.line;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.3;
      ctx.stroke();
      ctx.globalAlpha = 1;

      // Draw label background - smaller on mobile
      const isMobile = width < 500;
      const labelFontSize = isMobile ? Math.max(8, Math.min(9, width * 0.022)) : Math.max(10, Math.min(12, width * 0.018));
      ctx.font = `500 ${labelFontSize}px "Plus Jakarta Sans", sans-serif`;
      const textWidth = ctx.measureText(node.label).width;
      const padding = isMobile ? Math.max(8, labelFontSize * 1) : Math.max(14, labelFontSize * 1.2);
      const labelHeight = isMobile ? Math.max(20, labelFontSize * 2.2) : Math.max(28, labelFontSize * 2.8);

      ctx.beginPath();
      ctx.roundRect(
        node.x - textWidth / 2 - padding,
        node.y - labelHeight / 2,
        textWidth + padding * 2,
        labelHeight,
        labelHeight / 2
      );
      ctx.fillStyle = colors.labelBg;
      ctx.fill();
      ctx.strokeStyle = colors.labelBorder;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Draw label text
      ctx.fillStyle = colors.label;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label.toUpperCase(), node.x, node.y);
    });
  }

  // Animation loop
  function animate() {
    updateNodes();
    draw();
    animationId = requestAnimationFrame(animate);
  }

  // Initialize
  function init() {
    resize();
    initNodes();
    animate();
  }

  // Handle resize
  window.addEventListener('resize', () => {
    resize();
    initNodes();
  });

  // Handle theme change
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTimeout(draw, 50);
    });
  }

  init();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initConstellation);
} else {
  initConstellation();
}
