const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const OUTPUT_DIR = path.join(__dirname, '../frontend/public/videos');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const VIDEO_CONFIGS = [
  {
    name: 'hero-fintech.webm',
    title: 'Hero Cinematic Money & Gold Coins',
    drawType: 'hero',
    duration: 4000,
  },
  {
    name: 'login-coins.webm',
    title: 'Login Rotating 3D Coins & Gold Particles',
    drawType: 'login',
    duration: 4000,
  },
  {
    name: 'register-coins.webm',
    title: 'Register Golden Currency Streams',
    drawType: 'register',
    duration: 4000,
  },
  {
    name: 'analytics-growth.webm',
    title: 'Analytics Financial Growth & Wave Curves',
    drawType: 'analytics',
    duration: 4000,
  },
  {
    name: 'coins-stream.webm',
    title: 'Floating 3D Rupee Coins in Space',
    drawType: 'rupee',
    duration: 4000,
  },
];

let currentIdx = 0;

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url.startsWith('/render')) {
    const config = VIDEO_CONFIGS[currentIdx];
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { margin: 0; background: #070a12; overflow: hidden; }
    canvas { display: block; width: 1280px; height: 720px; }
  </style>
</head>
<body>
  <canvas id="c" width="1280" height="720"></canvas>
  <script>
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    const drawType = '${config.drawType}';
    const duration = ${config.duration};

    // Particle setup
    const particles = [];
    const coins = [];
    const symbols = ['₹', '$', '€', '£', '¥'];

    for (let i = 0; i < 45; i++) {
      coins.push({
        x: Math.random() * 1280,
        y: Math.random() * 720,
        radius: 20 + Math.random() * 28,
        speedY: 0.8 + Math.random() * 1.8,
        speedX: (Math.random() - 0.5) * 1.2,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: 0.04 + Math.random() * 0.06,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        scaleX: 1,
        depth: 0.4 + Math.random() * 0.6,
      });
    }

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: Math.random() * 1280,
        y: Math.random() * 720,
        radius: 1 + Math.random() * 3.5,
        speedY: 0.5 + Math.random() * 1.5,
        speedX: (Math.random() - 0.5) * 1,
        opacity: 0.2 + Math.random() * 0.7,
        hue: 42 + Math.random() * 15,
      });
    }

    let startTime = performance.now();

    function render(t) {
      const elapsed = t - startTime;
      ctx.fillStyle = '#080d1a';
      ctx.fillRect(0, 0, 1280, 720);

      // Radial background aura
      const radial = ctx.createRadialGradient(640, 360, 40, 640, 360, 600);
      radial.addColorStop(0, 'rgba(99, 102, 241, 0.18)');
      radial.addColorStop(0.5, 'rgba(234, 179, 8, 0.12)');
      radial.addColorStop(1, 'rgba(8, 13, 26, 0.95)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, 1280, 720);

      // Draw floating golden particles
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        if (p.y > 720) p.y = -10;
        if (p.x < 0) p.x = 1280;
        if (p.x > 1280) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(' + p.hue + ', 100%, 65%, ' + p.opacity + ')';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      if (drawType === 'analytics') {
        // Draw futuristic financial wave graphs
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.7)';
        ctx.beginPath();
        for (let x = 0; x <= 1280; x += 20) {
          const y = 420 + Math.sin((x * 0.008) + (elapsed * 0.003)) * 80 + Math.cos((x * 0.015) + (elapsed * 0.002)) * 30;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
        ctx.beginPath();
        for (let x = 0; x <= 1280; x += 20) {
          const y = 340 + Math.cos((x * 0.006) + (elapsed * 0.0025)) * 90;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw 3D Rotating Golden Coins
      coins.forEach(coin => {
        coin.y += coin.speedY;
        coin.x += coin.speedX;
        coin.rot += coin.rotSpeed;
        if (coin.y > 740) coin.y = -40;
        if (coin.x < -30) coin.x = 1310;
        if (coin.x > 1310) coin.x = -30;

        const scaleX = Math.abs(Math.cos(coin.rot));

        ctx.save();
        ctx.translate(coin.x, coin.y);

        // Coin Outer Gold Rim
        ctx.beginPath();
        ctx.scale(scaleX, 1);
        ctx.arc(0, 0, coin.radius, 0, Math.PI * 2);

        const goldGrad = ctx.createLinearGradient(-coin.radius, -coin.radius, coin.radius, coin.radius);
        goldGrad.addColorStop(0, '#fef08a');
        goldGrad.addColorStop(0.3, '#f59e0b');
        goldGrad.addColorStop(0.7, '#d97706');
        goldGrad.addColorStop(1, '#78350f');

        ctx.fillStyle = goldGrad;
        ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#fffbeb';
        ctx.stroke();

        // Inner Bevel Ring
        ctx.beginPath();
        ctx.arc(0, 0, coin.radius * 0.8, 0, Math.PI * 2);
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgba(254, 240, 138, 0.8)';
        ctx.stroke();

        // Symbol (₹, $, etc.)
        if (scaleX > 0.25) {
          ctx.font = 'bold ' + Math.round(coin.radius * 0.9) + 'px "Plus Jakarta Sans", sans-serif';
          ctx.fillStyle = '#451a03';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          const sym = drawType === 'rupee' ? '₹' : coin.symbol;
          ctx.fillText(sym, 0, 1);
          ctx.fillStyle = '#fffbeb';
          ctx.fillText(sym, -1, 0);
        }

        ctx.restore();
      });

      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);

    // Setup recorder
    const stream = canvas.captureStream(30);
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8',
      videoBitsPerSecond: 2500000,
    });

    const chunks = [];
    recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const arrayBuffer = await blob.arrayBuffer();
      await fetch('/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: arrayBuffer,
      });
    };

    recorder.start();
    setTimeout(() => {
      recorder.stop();
    }, duration);
  </script>
</body>
</html>`;
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  } else if (req.method === 'POST' && req.url === '/upload') {
    const config = VIDEO_CONFIGS[currentIdx];
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const filePath = path.join(OUTPUT_DIR, config.name);
      fs.writeFileSync(filePath, buffer);
      console.log(`[SUCCESS] Generated: ${config.name} (${(buffer.length / 1024).toFixed(1)} KB)`);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: true }));

      currentIdx++;
      if (currentIdx < VIDEO_CONFIGS.length) {
        console.log(`Starting next video render: ${VIDEO_CONFIGS[currentIdx].name}...`);
        launchChromeForCurrent();
      } else {
        console.log('All videos generated successfully!');
        server.close();
        process.exit(0);
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

let chromeProcess = null;

function launchChromeForCurrent() {
  if (chromeProcess) {
    try { chromeProcess.kill(); } catch (e) {}
  }
  chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--autoplay-policy=no-user-gesture-required',
    '--no-sandbox',
    'http://localhost:4499/render',
  ]);
}

server.listen(4499, () => {
  console.log('Video render server started on port 4499. Initiating generation...');
  launchChromeForCurrent();
});
