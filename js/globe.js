/**
 * Globe Animation - Global Financial Centers
 * Uses Cobe library for WebGL 3D globe
 */
import createGlobe from 'https://cdn.skypack.dev/cobe';

function initGlobe() {
  const canvas = document.getElementById('globeCanvas');
  const globeCard = document.querySelector('.globe-card');
  const globeContainer = document.querySelector('.globe-container');

  if (!canvas || !globeCard || !globeContainer) {
    console.log('Globe: Missing canvas, globeCard, or globeContainer');
    return;
  }

  let globe = null;
  let phi = 0;
  let currentSize = 0;

  // 8 Financial Center coordinates [lat, lng]
  const markers = [
    { location: [40.7128, -74.0060], size: 0.08 },   // New York
    { location: [25.7617, -80.1918], size: 0.06 },   // Miami
    { location: [51.5074, -0.1278], size: 0.08 },    // London
    { location: [47.3769, 8.5417], size: 0.06 },     // Zurich
    { location: [43.7384, 7.4246], size: 0.05 },     // Monaco
    { location: [49.6117, 6.1300], size: 0.05 },     // Luxembourg
    { location: [1.3521, 103.8198], size: 0.07 },    // Singapore
    { location: [25.2048, 55.2708], size: 0.07 }     // Dubai
  ];

  function getGlobeColors() {
    const isDark = document.documentElement.dataset.theme === 'dark';
    return {
      dark: isDark ? 1 : 0,
      baseColor: isDark ? [0.15, 0.18, 0.22] : [0.9, 0.92, 0.95],
      markerColor: isDark ? [0.5, 0.85, 1] : [0.2, 0.5, 0.9],
      glowColor: isDark ? [0.15, 0.4, 0.5] : [0.7, 0.85, 1],
      mapBrightness: isDark ? 4 : 8,
      diffuse: isDark ? 1.5 : 2
    };
  }

  function getContainerSize() {
    const rect = globeContainer.getBoundingClientRect();
    return Math.floor(rect.width) || 400;
  }

  function createGlobeInstance() {
    const colors = getGlobeColors();
    const size = getContainerSize();
    currentSize = size;

    // Update canvas attributes
    canvas.width = size * 2;
    canvas.height = size * 2;

    if (globe) {
      globe.destroy();
    }

    globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: size * 2,
      height: size * 2,
      phi: 0,
      theta: 0.3,
      dark: colors.dark,
      diffuse: colors.diffuse,
      mapSamples: 16000,
      mapBrightness: colors.mapBrightness,
      baseColor: colors.baseColor,
      markerColor: colors.markerColor,
      glowColor: colors.glowColor,
      markers: markers,
      onRender: (state) => {
        state.phi = phi;
        phi += 0.003;
      }
    });
  }

  // Create globe after a short delay
  setTimeout(() => {
    createGlobeInstance();
  }, 100);

  // Recreate globe on theme change
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      setTimeout(() => {
        if (globe) {
          createGlobeInstance();
        }
      }, 50);
    });
  }

  // Handle resize with debounce
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const newSize = getContainerSize();
      if (Math.abs(newSize - currentSize) > 20) {
        createGlobeInstance();
      }
    }, 250);
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initGlobe);
} else {
  initGlobe();
}
