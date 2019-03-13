function animateDivider(el) {
  const defaultDensity = 3;
  const defaultOndulation = 50;
  const defaultSpeed = 4;
  const defaultIsStatic = false;

  // Read config variables from data attributes.
  let density = parseInt(
    el.getAttribute('data-rad-divider-density') || defaultDensity,
  );

  if (isNaN(density)) { density = defaultDensity; }

  let ondulation = parseInt(
    el.getAttribute('data-rad-divider-ondulation') || defaultOndulation,
  );

  if (isNaN(ondulation)) { ondulation = defaultOndulation; }

  let speed = parseInt(el.getAttribute('data-rad-divider-speed') || defaultSpeed);

  if (isNaN(speed)) { speed = defaultSpeed; }

  let isStatic = el.getAttribute('data-rad-divider-static') === "true" || defaultIsStatic;

  let width = el.clientWidth;
  let isLine = el.classList.contains('line');

  let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  let path = document.createElementNS('http://www.w3.org/2000/svg', 'path');

  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '150px');

  svg.appendChild(path);
  el.appendChild(svg);

  let yoff = 0;

  let interval = 1000 / 60;
  let then = Date.now();
  let elapsed;

  let noise = Noise(Math.random());
  density = density / 1000;
  speed = speed / 1000;

  function animate() {
    if (width !== el.clientWidth) {
      width = el.clientWidth;
      svg.setAttribute('width', width + 'px');
    }

    now = Date.now();
    elapsed = now - then;

    if (isStatic) {
      elapsed += interval * 2;
    }

    if (elapsed > interval) {
      let xoff = 0;
      let xs = [];

      for (var x = 0; x < width; x++) {
        let n = noise.perlin2(xoff, yoff)
        let y = ondulation - (ondulation * n)

        xs.push([x, y]);

        xoff += density;
      }

      yoff += speed;

      let prefix = 'M0,0 ' + width + ',0 ';

      if (isLine) {
        prefix = 'M';
      }

      var d = prefix + xs.reverse().map(p => {
        return p[0] + ',' + p[1];
      });

      path.setAttribute('d', d);

      then = now - (elapsed % interval);
    }

    if (!isStatic) {
      requestAnimationFrame(animate);
    }
  }

  animate();
}

document.addEventListener('DOMContentLoaded', function () {
  const dividers = document.querySelectorAll('div.divider');

  dividers.forEach(animateDivider);
});

document.addEventListener('DOMContentLoaded', function () {
  const selectors = [
    "#peer h2",
    "#term h2",
    "#prog h2",
  ];
  const lines = [
    [
      "Pr",
      "Per",
      "Peer",
      "Peeer",
      "Peeeer",
      "Peeeeer",
      "Peeeeeer",
      "Peeeeeeer",
      "Peeeeeeeer",
      "Peeeeeeeeer",
      "Peeeeeeeeeer",
      "Peeeeeeeeeeer",
      "Peeeee—eeeer",
      "Peeee——eeeer",
      "Peee————eeer",
      "Peer————peer",
      "Peer—t——peer",
      "Peer–to–peer",
      "Peer–to–peer",
      "Peer–to–peer",
      "Peer–to–peer",
      "Peer–to–peer",
      "Peer–to–peer",
    ],
    [
      "&gt;",
      "&gt;▌",
      "&gt;T",
      "&gt;Te▌",
      "&gt;Ter",
      "&gt;Term▌",
      "&gt;Termi",
      "&gt;Termin▌",
      "&gt;Termina",
      "&gt;Terminal▌",
      "&gt;Terminal–",
      "&gt;Terminal–f▌",
      "&gt;Terminal–fi",
      "&gt;Terminal–fir▌",
      "&gt;Terminal–firs",
      "&gt;Terminal–first▌",
      "&gt;Terminal–first",
      "Terminal–first",
      "Terminal–first",
      "Terminal–first",
      "Terminal–first",
      "Terminal–first",
    ],
    [
      "–––––a––a–––",
      "–––––a––ab––",
      "–––––a––ab–e",
      "–––g–a––ab–e",
      "–––g–a––able",
      "–––g–ammable",
      "––og–ammable",
      "–rogrammable",
      "Programmable",
      "Programmable",
      "Programmable",
      "Programmable",
      "Programmable",
    ],
  ];

  const interval = 120;
  let then = Date.now();
  let elapsed;
  let idxLines = 0;
  let idxSelectors = 0;
  let currentEl = document.querySelector(selectors[idxSelectors]);
  let currentLines = lines[idxSelectors];

  if (currentEl === null) { return; }

  function type() {
    now = Date.now();
    elapsed = now - then;

    if (elapsed > interval) {
      currentEl.innerHTML = currentLines[idxLines];
      then = now - (elapsed % interval);
      idxLines += 1;

      if (idxLines >= currentLines.length - 1) {
        idxLines = 0;
        idxSelectors += 1;
      }

      if (idxSelectors >= selectors.length) {
        idxSelectors = 0;
      }

      if (idxLines === 0) {
        currentEl = document.querySelector(selectors[idxSelectors]);
        currentLines = lines[idxSelectors];
      }
    }

    requestAnimationFrame(type);
  }

  requestAnimationFrame(type);
});



document.addEventListener('DOMContentLoaded', function () {
  const navBar = document.getElementById("nav");

  window.addEventListener("scroll", function () {
    if (navBar === null) { return; }

    var y = window.scrollY;
    if (y > 0) {
      navBar.style.top = "0";
    } else {
      navBar.style.top = "-64px";
    }
  });

  let els = document.getElementsByClassName('cross');

  for (var i = 0; i < els.length; i++) {
    els[i].onclick = function () {
      narrowNav.style.top = "-182px"
    };
  }

  var hamburger = document.getElementById('open');
  var hamburger2 = document.getElementById('narrow-open');
  var narrowNav = document.getElementById("narrow-menu");

  (hamburger || {}).onclick = function () {
    narrowNav.style.top = "0"
  };
  (hamburger2 || {}).onclick = function () {
    narrowNav.style.top = "0"
  };

});

