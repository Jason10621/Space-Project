// =======================================================================
// HAFS Grand Observatory (Final Master Core)
// Architecture: Multi-App SPA (Hub & Spoke), Dynamic Scene Lifecycle
// =======================================================================

// --- 1. 글로벌 앱 상태 관리 ---
const App = {
    mode: 'lobby', 
    scene: null, camera: null, renderer: null, controls: null,
    animationId: null
};

// --- 2. 통합 천문 데이터베이스 ---
const DB = {
    deepspace: {
        'home': { name: "MILKY WAY (우리은하)", type: "nebula", coords: new THREE.Vector3(0, 0, 0), color: 0x88bbff, count: 15000, desc: "우리가 속해 있는 막대 나선 은하입니다. 거시 우주의 기준점입니다.", subs: [{t: "Orion Arm", d: "태양계가 속한 나선팔"}] },
        'sgra': { name: "SAGITTARIUS A* (초거대 블랙홀)", type: "blackhole", coords: new THREE.Vector3(200, 50, -200), desc: "우리은하 중심의 초대질량 블랙홀입니다. 주변 시공간을 왜곡하며 강착 원반을 형성합니다." },
        'carina': { name: "CARINA NEBULA (용골자리 성운)", type: "nebula", coords: new THREE.Vector3(1200, 300, -800), color: 0xff5522, count: 20000, desc: "가스와 먼지로 이루어진 거대한 별의 요람입니다.", subs: [{t: "Eta Carinae", d: "초거대 폭발 직전의 쌍성계"}] },
        'smacs': { name: "SMACS 0723 (은하단)", type: "nebula", coords: new THREE.Vector3(3500, -2000, -4000), color: 0x5544ff, count: 30000, desc: "막대한 질량으로 중력 렌즈 현상을 일으키는 거대 은하단입니다.", subs: [{t: "Gravitational Lensing", d: "시공간 굴절로 인한 빛의 왜곡 현상"}] }
    },
    solarsystem: [
        { id: "mercury", name: "MERCURY (수성)", r: 1.2, d: 20, speed: 0.047, color: 0xa9a9a9, img: "https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg", temp: "430°C", orb: "47.36", desc: "태양과 가장 가까운 암석 행성. 대기가 없어 일교차가 극심합니다.", comp: [{n: "O", p: 42, c: "#a3c2c2"}, {n: "Na", p: 29, c: "#ffdb4d"}, {n: "H2", p: 22, c: "#4da6ff"}] },
        { id: "venus", name: "VENUS (금성)", r: 1.8, d: 30, speed: 0.035, color: 0xeeddcc, img: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Venus-real_color.jpg", temp: "471°C", orb: "35.02", desc: "극단적 온실효과를 지닌 가장 뜨거운 행성입니다.", comp: [{n: "CO2", p: 96, c: "#ff6666"}, {n: "N2", p: 3, c: "#c2c2d6"}] },
        { id: "earth", name: "EARTH (지구)", r: 1.9, d: 45, speed: 0.029, color: 0x3366ff, img: "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg", temp: "15°C", orb: "29.78", desc: "액체 물이 존재하며 생명체가 서식하는 유일한 행성입니다.", comp: [{n: "N2", p: 78, c: "#c2c2d6"}, {n: "O2", p: 21, c: "#66ccff"}] },
        { id: "mars", name: "MARS (화성)", r: 1.4, d: 60, speed: 0.024, color: 0xff4422, img: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg", temp: "-63°C", orb: "24.07", desc: "산화철로 붉게 보이며 과거 물이 흘렀던 흔적이 있습니다.", comp: [{n: "CO2", p: 95, c: "#ff6666"}, {n: "N2", p: 2, c: "#c2c2d6"}] },
        { id: "jupiter", name: "JUPITER (목성)", r: 5.5, d: 95, speed: 0.013, color: 0xdda050, img: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg", temp: "-110°C", orb: "13.07", desc: "대적점을 가진 태양계에서 가장 거대한 가스 행성입니다.", comp: [{n: "H2", p: 89, c: "#4da6ff"}, {n: "He", p: 10, c: "#ffcc99"}] },
        { id: "saturn", name: "SATURN (토성)", r: 4.5, d: 130, speed: 0.009, color: 0xead6b8, img: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg", temp: "-140°C", orb: "9.69", desc: "얼음과 암석으로 이루어진 웅장한 고리를 가진 행성입니다.", comp: [{n: "H2", p: 96, c: "#4da6ff"}, {n: "He", p: 3, c: "#ffcc99"}], hasRing: true },
        { id: "uranus", name: "URANUS (천왕성)", r: 3.2, d: 165, speed: 0.006, color: 0x66ccff, img: "https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg", temp: "-195°C", orb: "6.81", desc: "자전축이 누워있는 푸른색 얼음 거성입니다.", comp: [{n: "H2", p: 83, c: "#4da6ff"}, {n: "He", p: 15, c: "#ffcc99"}] },
        { id: "neptune", name: "NEPTUNE (해왕성)", r: 3.0, d: 200, speed: 0.005, color: 0x3333cc, img: "https://upload.wikimedia.org/wikipedia/commons/5/56/Neptune_Full.jpg", temp: "-200°C", orb: "5.43", desc: "초음속 강풍이 부는 태양계 최외곽 행성입니다.", comp: [{n: "H2", p: 80, c: "#4da6ff"}, {n: "He", p: 19, c: "#ffcc99"}] }
    ]
};

// --- 독립 엔진 물리 메모리 ---
const DSEngine = { objects: {}, bh: { eh: null, ps: null, disk: null, speeds: [], count: 35000 } };
const SSEngine = { planets: [], tracked: null, speedMulti: 1.0 };

// --- DOM 바인딩 ---
const DOM = {
    lobby: document.getElementById('ui-lobby'), btnHub: document.getElementById('btn-return-hub'),
    uiDS: document.getElementById('ui-deepspace'), uiSS: document.getElementById('ui-solarsystem'),
    // 모듈 1
    dsTargets: document.querySelectorAll('.ds-target'), dsInfo: document.getElementById('ds-info'), dsTitle: document.getElementById('ds-title'), dsDesc: document.getElementById('ds-desc'),
    dsNormal: document.getElementById('ds-normal-info'), dsSubList: document.getElementById('ds-sub-list'), dsBHCtrl: document.getElementById('ds-bh-controls'),
    bhMass: document.getElementById('bh-mass'), bhDist: document.getElementById('bh-dist'),
    // 모듈 2
    ssList: document.getElementById('ss-planet-list'), ssSpeed: document.getElementById('ss-speed'), ssBtnReset: document.getElementById('btn-ss-reset'),
    ssInfo: document.getElementById('ss-info'), ssName: document.getElementById('ss-name'), ssMedia: document.getElementById('ss-media'), ssDesc: document.getElementById('ss-desc'),
    ssTemp: document.getElementById('ss-temp'), ssOrb: document.getElementById('ss-orb'), ssCompBar: document.getElementById('ss-comp-bar'), ssCompLegend: document.getElementById('ss-comp-legend')
};

// ================= [ 3. 글로벌 캔버스 초기화 ] =================
function initGlobalCore() {
    const container = document.getElementById('three-canvas');
    App.scene = new THREE.Scene();
    App.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
    App.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    App.renderer.setSize(window.innerWidth, window.innerHeight);
    App.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(App.renderer.domElement);

    App.controls = new THREE.OrbitControls(App.camera, App.renderer.domElement);
    App.controls.enableDamping = true;
    App.controls.dampingFactor = 0.05;

    buildLobbyBackground();

    window.addEventListener('resize', () => {
        App.camera.aspect = window.innerWidth / window.innerHeight;
        App.camera.updateProjectionMatrix();
        App.renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

function clearScene() {
    while(App.scene.children.length > 0) { App.scene.remove(App.scene.children[0]); }
    DSEngine.objects = {}; DSEngine.bh.disk = null;
    SSEngine.planets = []; SSEngine.tracked = null;
}

function buildLobbyBackground() {
    App.scene.fog = new THREE.FogExp2(0x010308, 0.0005);
    const bgGeo = new THREE.BufferGeometry();
    const bgPos = new Float32Array(5000 * 3);
    for(let i=0; i<5000*3; i++) bgPos[i] = (Math.random() - 0.5) * 1000;
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    App.scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({color: 0x888888, size: 2})));
    App.camera.position.set(0, 0, 500); App.controls.target.set(0, 0, 0);
}

// ================= [ 4. MODULE 1: 심우주 및 블랙홀 엔진 ] =================
function launchDeepSpace() {
    App.mode = 'deepspace'; clearScene();
    App.scene.fog = new THREE.FogExp2(0x010308, 0.0001);
    
    // 배경 별 15,000개
    const bgGeo = new THREE.BufferGeometry(); const bgPos = new Float32Array(15000 * 3);
    for(let i=0; i<15000*3; i++) bgPos[i] = (Math.random() - 0.5) * 15000;
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    App.scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({color: 0x555555, size: 2})));

    for (const [key, data] of Object.entries(DB.deepspace)) {
        if (data.type === 'nebula') buildDSNebula(key, data);
        else buildDSBlackHole(key, data);
    }
    App.camera.position.set(0, 0, 500); App.controls.target.set(0, 0, 0);
    dsWarpTo('home'); 
}

function buildDSNebula(key, data) {
    const geo = new THREE.BufferGeometry(); const pos = new Float32Array(data.count * 3); const col = new Float32Array(data.count * 3);
    const baseCol = new THREE.Color(data.color);
    for(let i=0; i<data.count * 3; i+=3) {
        const r = Math.pow(Math.random(), 2), t = Math.random() * Math.PI * 2, p = Math.acos(2 * Math.random() - 1);
        const spread = key === 'home' ? 250 : 350; 
        pos[i] = r * Math.sin(p) * Math.cos(t) * spread; pos[i+1] = r * Math.sin(p) * Math.sin(t) * (spread * 0.3); pos[i+2] = r * Math.cos(p) * spread;
        const mix = new THREE.Color(0xffffff).lerp(baseCol, r); col[i] = mix.r; col[i+1] = mix.g; col[i+2] = mix.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const cloud = new THREE.Points(geo, new THREE.PointsMaterial({ size: 1.5, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending }));
    cloud.position.copy(data.coords); App.scene.add(cloud); DSEngine.objects[key] = cloud;
}

function buildDSBlackHole(key, data) {
    const bhGroup = new THREE.Group();
    DSEngine.bh.eh = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), new THREE.MeshBasicMaterial({ color: 0x000000 }));
    DSEngine.bh.ps = new THREE.Mesh(new THREE.SphereGeometry(1.5, 64, 64), new THREE.MeshBasicMaterial({ color: 0xff3366, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, side: THREE.BackSide }));
    bhGroup.add(DSEngine.bh.eh); bhGroup.add(DSEngine.bh.ps);

    const geo = new THREE.BufferGeometry(); const pos = new Float32Array(DSEngine.bh.count * 3); const col = new Float32Array(DSEngine.bh.count * 3);
    for(let i=0; i < DSEngine.bh.count; i++) {
        const r = 2 + Math.random() * 30, t = Math.random() * Math.PI * 2;
        pos[i*3] = Math.cos(t) * r; pos[i*3+1] = (Math.random() - 0.5) * (r * 0.05); pos[i*3+2] = Math.sin(t) * r;
        DSEngine.bh.speeds[i] = 1.8 / Math.sqrt(r);
        const intensity = 1.0 - (r / 32); col[i*3] = 1.0; col[i*3+1] = 0.3 + (intensity * 0.5); col[i*3+2] = intensity * 1.0;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    DSEngine.bh.disk = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.2, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    
    bhGroup.add(DSEngine.bh.disk); bhGroup.position.copy(data.coords); bhGroup.rotation.x = 0.2; 
    App.scene.add(bhGroup); DSEngine.objects[key] = bhGroup;
}

function dsWarpTo(targetKey) {
    const data = DB.deepspace[targetKey]; const targetObj = DSEngine.objects[targetKey];
    DOM.dsInfo.style.opacity = "0";

    const zoomOffset = data.type === 'blackhole' ? 50 : 400;
    const endPosition = new THREE.Vector3(targetObj.position.x, targetObj.position.y + (zoomOffset/3), targetObj.position.z + zoomOffset);

    new TWEEN.Tween(App.camera.position).to(endPosition, 3000).easing(TWEEN.Easing.Cubic.InOut)
        .onUpdate(() => App.camera.lookAt(targetObj.position))
        .onComplete(() => {
            App.controls.target.copy(targetObj.position);
            DOM.dsTitle.textContent = data.name; DOM.dsDesc.textContent = data.desc;
            if (data.type === 'blackhole') {
                DOM.dsNormal.style.display = 'none'; DOM.dsBHCtrl.style.display = 'block'; dsUpdatePhysics();
            } else {
                DOM.dsNormal.style.display = 'block'; DOM.dsBHCtrl.style.display = 'none';
                DOM.dsSubList.innerHTML = ''; data.subs.forEach(s => DOM.dsSubList.innerHTML += `<li><span class="sub-title">${s.t}</span><span class="sub-detail">${s.d}</span></li>`);
            }
            DOM.dsInfo.style.opacity = "1";
        }).start();
}

function dsUpdatePhysics() {
    const mass = parseFloat(DOM.bhMass.value), dist = parseFloat(DOM.bhDist.value);
    const rs = mass * 3.0, scale = Math.max(1, mass / 10);
    
    if(DSEngine.bh.eh) {
        DSEngine.bh.eh.scale.set(scale, scale, scale); DSEngine.bh.ps.scale.set(scale, scale, scale); DSEngine.bh.disk.scale.set(scale, scale, scale);
    }
    const timeDilation = (dist * rs > rs) ? 1 / Math.sqrt(1 - (rs / (dist * rs))) : 0;

    document.getElementById('bh-mass-val').textContent = mass.toFixed(1); document.getElementById('bh-dist-val').textContent = `${dist} Rs`;
    document.getElementById('bh-rs').textContent = `${rs.toFixed(2)} km`;
    document.getElementById('bh-time').textContent = timeDilation > 0 ? timeDilation.toFixed(4) + "x" : "INFINITE";
}

// ================= [ 5. MODULE 2: 태양계 탐사 엔진 ] =================
function launchSolarSystem() {
    App.mode = 'solarsystem'; clearScene();
    App.scene.fog = new THREE.FogExp2(0x010308, 0.0005);
    
    const starsGeo = new THREE.BufferGeometry(); const starsPos = new Float32Array(5000 * 3);
    for(let i=0; i<5000*3; i++) starsPos[i] = (Math.random() - 0.5) * 2000;
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    App.scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({color: 0xaaaaaa, size: 1.5})));

    const sun = new THREE.Mesh(new THREE.SphereGeometry(10, 64, 64), new THREE.MeshBasicMaterial({ color: 0xffcc33 }));
    App.scene.add(sun); App.scene.add(new THREE.PointLight(0xffffff, 2, 1000)); App.scene.add(new THREE.AmbientLight(0x222222));

    DOM.ssList.innerHTML = '';
    
    DB.solarsystem.forEach(pData => {
        const pMesh = new THREE.Mesh(new THREE.SphereGeometry(pData.r, 32, 32), new THREE.MeshStandardMaterial({ color: pData.color, roughness: 0.7 }));
        pMesh.position.x = pData.d;
        if(pData.hasRing) {
            const ring = new THREE.Mesh(new THREE.RingGeometry(pData.r * 1.5, pData.r * 2.2, 64), new THREE.MeshStandardMaterial({ color: pData.color, side: THREE.DoubleSide, transparent:true, opacity:0.8 }));
            ring.rotation.x = Math.PI / 2; pMesh.add(ring);
        }

        const pivot = new THREE.Group(); pivot.add(pMesh); App.scene.add(pivot);
        const orbit = new THREE.Mesh(new THREE.RingGeometry(pData.d - 0.1, pData.d + 0.1, 128), new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide }));
        orbit.rotation.x = Math.PI / 2; App.scene.add(orbit);

        SSEngine.planets.push({ id: pData.id, pivot, mesh: pMesh, speed: pData.speed, data: pData });

        const btn = document.createElement('button'); btn.className = 'target-btn ss-target';
        btn.innerHTML = `<span class="btn-title" style="display:flex; align-items:center; gap:8px;"><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#${pData.color.toString(16)}"></span>${pData.name}</span>`;
        btn.onclick = () => {
            document.querySelectorAll('.ss-target').forEach(b => b.classList.remove('active')); btn.classList.add('active');
            SSEngine.tracked = SSEngine.planets.find(p => p.id === pData.id);
            ssUpdateInfo(pData);
        };
        DOM.ssList.appendChild(btn);
    });

    App.camera.position.set(0, 150, 250); App.controls.target.set(0, 0, 0);
}

function ssUpdateInfo(pData) {
    DOM.ssName.textContent = pData.name; DOM.ssMedia.style.backgroundImage = `url('${pData.img}')`; DOM.ssDesc.textContent = pData.desc;
    DOM.ssTemp.textContent = pData.temp; DOM.ssOrb.textContent = `${pData.orb} km/s`;

    DOM.ssCompBar.innerHTML = ''; DOM.ssCompLegend.innerHTML = '';
    pData.comp.forEach(c => {
        DOM.ssCompBar.innerHTML += `<div class="comp-segment" style="width:${c.p}%; background:${c.c};">${c.p}%</div>`;
        DOM.ssCompLegend.innerHTML += `<div class="legend-item"><div class="legend-color" style="background:${c.c};"></div>${c.n}</div>`;
    });
    DOM.ssInfo.style.opacity = "1";
}

DOM.ssBtnReset.addEventListener('click', () => {
    SSEngine.tracked = null; document.querySelectorAll('.ss-target').forEach(b => b.classList.remove('active')); DOM.ssInfo.style.opacity = "0";
    new TWEEN.Tween(App.camera.position).to(new THREE.Vector3(0, 150, 250), 1500).start();
    new TWEEN.Tween(App.controls.target).to(new THREE.Vector3(0,0,0), 1500).start();
});

DOM.ssSpeed.addEventListener('input', e => { SSEngine.speedMulti = parseFloat(e.target.value) / 10; document.getElementById('ss-speed-val').textContent = `${(SSEngine.speedMulti*10).toFixed(1)}x`; });


// ================= [ 6. 글로벌 라우팅 및 렌더링 루프 ] =================
document.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('click', () => {
        DOM.lobby.style.opacity = "0";
        setTimeout(() => {
            DOM.lobby.style.display = "none"; DOM.btnHub.style.display = "block"; 
            const targetMod = card.dataset.module;
            if (targetMod === 'deepspace') { DOM.uiDS.style.display = 'block'; launchDeepSpace(); }
            else if (targetMod === 'solarsystem') { DOM.uiSS.style.display = 'block'; launchSolarSystem(); }
        }, 500);
    });
});

DOM.btnHub.addEventListener('click', () => {
    DOM.uiDS.style.display = 'none'; DOM.uiSS.style.display = 'none'; DOM.btnHub.style.display = 'none';
    App.mode = 'lobby'; clearScene(); buildLobbyBackground();
    DOM.lobby.style.display = 'flex'; setTimeout(() => DOM.lobby.style.opacity = "1", 100);
});

DOM.dsTargets.forEach(btn => btn.addEventListener('click', (e) => {
    DOM.dsTargets.forEach(b => b.classList.remove('active')); e.target.closest('.target-btn').classList.add('active');
    dsWarpTo(e.target.closest('.target-btn').dataset.target);
}));
DOM.bhMass.addEventListener('input', dsUpdatePhysics); DOM.bhDist.addEventListener('input', dsUpdatePhysics);

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update(); 

    if (App.mode === 'lobby') {
        App.scene.rotation.y += 0.0005;
    } 
    else if (App.mode === 'deepspace') {
        Object.keys(DB.deepspace).forEach(k => { if(DB.deepspace[k].type === 'nebula' && DSEngine.objects[k]) DSEngine.objects[k].rotation.y += 0.0002; });
        if (DSEngine.bh.disk) {
            const positions = DSEngine.bh.disk.geometry.attributes.position.array;
            const currentScale = DSEngine.bh.eh.scale.x; const massFactor = parseFloat(DOM.bhMass.value) / 10;
            for(let i=0; i < DSEngine.bh.count; i++) {
                const x = positions[i*3], z = positions[i*3+2]; const r = Math.sqrt(x*x + z*z); let t = Math.atan2(z, x);
                t += DSEngine.bh.speeds[i] * (1.2 / massFactor);
                let nR = r - 0.01; if (nR < 1.1 * currentScale) nR = (10 + Math.random() * 20) * currentScale; 
                positions[i*3] = Math.cos(t) * nR; positions[i*3+2] = Math.sin(t) * nR;
            }
            DSEngine.bh.disk.geometry.attributes.position.needsUpdate = true;
        }
    } 
    else if (App.mode === 'solarsystem') {
        SSEngine.planets.forEach(p => { p.pivot.rotation.y += p.speed * SSEngine.speedMulti; p.mesh.rotation.y += 0.05 * SSEngine.speedMulti; });
        if (SSEngine.tracked) {
            const tPos = new THREE.Vector3(); SSEngine.tracked.mesh.getWorldPosition(tPos);
            App.controls.target.lerp(tPos, 0.1);
            const zDist = SSEngine.tracked.data.r * 5 + 10;
            App.camera.position.lerp(tPos.clone().add(new THREE.Vector3(zDist, zDist/2, zDist)), 0.05);
        }
    }

    App.controls.update();
    App.renderer.render(App.scene, App.camera);
}

window.onload = initGlobalCore;