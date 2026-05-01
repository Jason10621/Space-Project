// =======================================================================
// HAFS Grand Observatory (V11.0 Unabridged Ultimate Engine)
// MODULE 01: Deep Space & Black Hole
// MODULE 02: Solar System Explorer
// MODULE 03: Interstellar Probes
// =======================================================================

const App = { mode: 'lobby', scene: null, camera: null, renderer: null, controls: null };

// --- 1. 천문 대백과사전 데이터베이스 ---
const DB = {
    deepspace: {
        'home': { name: "MILKY WAY (우리은하)", type: "nebula", coords: new THREE.Vector3(0, 0, 0), color: 0x88bbff, count: 15000, desc: "태양계가 속해 있는 지름 약 10만 광년의 막대 나선 은하입니다.", details: "약 1,000억에서 4,000억 개의 항성으로 이루어져 있습니다.", subs: [{t: "Orion Arm (오리온 팔)", d: "태양계와 지구를 품고 있는 나선팔"}, {t: "Galactic Halo", d: "암흑물질과 구상성단 영역"}] },
        'sgra': { name: "SAGITTARIUS A* (초거대 블랙홀)", type: "blackhole", coords: new THREE.Vector3(200, 50, -200), desc: "우리은하 중심의 초대질량 블랙홀입니다. 시공간을 극단적으로 왜곡합니다.", details: "질량은 태양의 약 430만 배에 달하지만, 크기는 수성 궤도보다 작습니다." },
        'carina': { name: "CARINA NEBULA (용골자리 성운)", type: "nebula", coords: new THREE.Vector3(1200, 300, -800), color: 0xff5522, count: 20000, desc: "지구에서 8,500광년 떨어진 거대한 별의 요람입니다.", details: "우리은하에서 가장 활동적이고 거대한 항성 탄생 영역 중 하나입니다.", subs: [{t: "Eta Carinae", d: "폭발 직전의 극대거성 쌍성계"}, {t: "Cosmic Cliffs", d: "우주 절벽"}] },
        'smacs': { name: "SMACS 0723 (중력렌즈 은하단)", type: "nebula", coords: new THREE.Vector3(3500, -2000, -4000), color: 0x5544ff, count: 30000, desc: "JWST가 관측한 최초의 딥 필드 이미지 대상입니다.", details: "거대한 질량으로 시공간을 렌즈처럼 휘게 하여 배경 은하를 확대합니다.", subs: [{t: "Gravitational Lensing Arcs", d: "배경 은하의 빛이 왜곡된 원호"}] }
    },
    solarsystem: [
        { id: "earth", name: "EARTH (지구)", r: 2.0, d: 40, speed: 0.029, color: 0x3366ff, img: "https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg", temp: "15°C", orb: "29.78", desc: "액체 상태의 물이 존재하는 생명체 거주 행성.", details: "다이나모 이론에 의한 자기장 형성으로 생명체를 보호합니다.", atm: [{n: "질소(N2)", p: 78, c: "#8892b0"}, {n: "산소(O2)", p: 21, c: "#66ccff"}], internal: [{n: "맨틀", p: 40, c: "#b33c00"}, {n: "외핵", p: 35, c: "#ff6600"}, {n: "내핵", p: 20, c: "#ffcc00"}], moons: [{id:"luna", name:"Luna", r:0.5, d:4, speed:0.08, color:0xaaaaaa, desc:"지구와의 조석 고정(Tidal Locking)으로 항상 같은 면만 보입니다."}] },
        { id: "mars", name: "MARS (화성)", r: 1.5, d: 55, speed: 0.024, color: 0xff4422, img: "https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg", temp: "-63°C", orb: "24.07", desc: "산화철로 붉게 보이며 과거 물이 흘렀던 흔적이 있는 행성.", details: "지구의 1% 수준인 희박한 대기를 가졌습니다.", atm: [{n: "CO2", p: 95, c: "#ff6666"}, {n: "N2", p: 3, c: "#8892b0"}], internal: [{n: "맨틀", p: 60, c: "#993311"}, {n: "코어", p: 30, c: "#551100"}], moons: [{id:"phobos", name:"Phobos", r:0.2, d:2, speed:0.15, color:0x888888, desc:"점점 추락 중인 위성."}, {id:"deimos", name:"Deimos", r:0.15, d:3, speed:0.1, color:0x777777, desc:"작고 어두운 위성."}] },
        { id: "jupiter", name: "JUPITER (목성)", r: 5.5, d: 85, speed: 0.013, color: 0xdda050, img: "https://upload.wikimedia.org/wikipedia/commons/e/e2/Jupiter.jpg", temp: "-110°C", orb: "13.07", desc: "태양계에서 가장 거대한 가스 행성.", details: "액체 금속 수소 바다가 초강력 자기장을 만들어냅니다.", atm: [{n: "H2", p: 89, c: "#4da6ff"}, {n: "He", p: 10, c: "#ffcc99"}], internal: [{n: "액체 금속 수소", p: 70, c: "#99aacc"}, {n: "암석 코어", p: 15, c: "#444444"}], moons: [{id:"europa", name:"Europa", r:0.35, d:9, speed:0.09, color:0xeeeeee, desc:"얼음 지각 아래 거대한 바다가 존재할 것으로 보입니다."}] },
        { id: "saturn", name: "SATURN (토성)", r: 4.5, d: 120, speed: 0.009, color: 0xead6b8, img: "https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg", temp: "-140°C", orb: "9.69", desc: "아름다운 고리 시스템을 가진 거대 가스 행성.", details: "밀도가 물보다 낮으며 얼음 조각으로 이루어진 고리가 있습니다.", atm: [{n: "H2", p: 96, c: "#4da6ff"}], internal: [{n: "금속 수소", p: 60, c: "#8899aa"}], hasRing: true, ringColor: 0xeeddcc, ringInner: 1.5, ringOuter: 2.8, moons: [{id:"titan", name:"Titan", r:0.7, d:8, speed:0.05, color:0xffaa55, desc:"짙은 대기와 메탄 호수를 가진 위성입니다."}] }
    ],
    probes: [
        { id: "voyager1", name: "VOYAGER 1 (보이저 1호)", distAU: 162.5, vel: "17.0", img: "https://upload.wikimedia.org/wikipedia/commons/6/60/Voyager_spacecraft_model.png", power: "RTG (Declining)", desc: "인류 역사상 가장 멀리 떨어진 인공 물체입니다.", details: "성간 공간에 진입했으며 외계 지적 생명체를 위한 골든 레코드를 싣고 있습니다.", angle: Math.PI / 4 },
        { id: "voyager2", name: "VOYAGER 2 (보이저 2호)", distAU: 136.0, vel: "15.3", img: "https://upload.wikimedia.org/wikipedia/commons/6/60/Voyager_spacecraft_model.png", power: "RTG (Declining)", desc: "목, 토, 천, 해왕성을 모두 방문한 탐사선입니다.", details: "성간 공간에 진입한 두 번째 인공 물체입니다.", angle: Math.PI * 1.8 },
        { id: "newhorizons", name: "NEW HORIZONS (뉴 호라이즌스)", distAU: 58.0, vel: "13.8", img: "https://upload.wikimedia.org/wikipedia/commons/f/fb/New_Horizons_Transparent.png", power: "RTG (Active)", desc: "명왕성과 카이퍼 벨트를 탐사했습니다.", details: "초기 태양계의 비밀을 밝혀내고 있습니다.", angle: Math.PI }
    ]
};

// --- 엔진 물리 메모리 저장소 ---
const DSEngine = { objects: {}, bh: { eh: null, ps: null, disk: null, speeds: [], count: 35000 } };
const SSEngine = { planets: [], moons: [], tracked: null, speedMulti: 1.0 };
const PREngine = { probes: [], tracked: null };

// --- DOM 바인딩 ---
const DOM = {
    lobby: document.getElementById('ui-lobby'), btnHub: document.getElementById('btn-return-hub'),
    uiDS: document.getElementById('ui-deepspace'), uiSS: document.getElementById('ui-solarsystem'), uiPR: document.getElementById('ui-probes'),
    // DS
    dsTargets: document.querySelectorAll('.ds-target'), dsInfo: document.getElementById('ds-info'), dsTitle: document.getElementById('ds-title'), dsDesc: document.getElementById('ds-desc'), dsDetails: document.getElementById('ds-details'),
    dsNormal: document.getElementById('ds-normal-info'), dsSubList: document.getElementById('ds-sub-list'), dsBHCtrl: document.getElementById('ds-bh-controls'), bhMass: document.getElementById('bh-mass'), bhDist: document.getElementById('bh-dist'),
    // SS
    ssList: document.getElementById('ss-planet-list'), ssSpeed: document.getElementById('ss-speed'), ssBtnReset: document.getElementById('btn-ss-reset'),
    ssInfo: document.getElementById('ss-info'), ssName: document.getElementById('ss-name'), ssMedia: document.getElementById('ss-media'), ssDesc: document.getElementById('ss-desc'), ssDetails: document.getElementById('ss-details'),
    ssTemp: document.getElementById('ss-temp'), ssOrb: document.getElementById('ss-orb'), ssCompBar: document.getElementById('ss-comp-bar'), ssCompLegend: document.getElementById('ss-comp-legend'),
    ssInternalBar: document.getElementById('ss-internal-bar'), ssInternalLegend: document.getElementById('ss-internal-legend'), ssMoonsCont: document.getElementById('ss-moons-container'), ssMoonsList: document.getElementById('ss-moons-list'),
    // PR
    prList: document.getElementById('pr-list'), btnPrReset: document.getElementById('btn-pr-reset'),
    prInfo: document.getElementById('pr-info'), prName: document.getElementById('pr-name'), prMedia: document.getElementById('pr-media'), prDesc: document.getElementById('pr-desc'), prDetails: document.getElementById('pr-details'),
    prDist: document.getElementById('pr-dist'), prVel: document.getElementById('pr-vel'), prDelay: document.getElementById('pr-delay'), prPower: document.getElementById('pr-power')
};

// ================= [ 글로벌 초기화 및 유틸리티 ] =================
function initGlobalCore() {
    const container = document.getElementById('three-canvas');
    App.scene = new THREE.Scene();
    App.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 25000);
    App.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    App.renderer.setSize(window.innerWidth, window.innerHeight);
    App.renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(App.renderer.domElement);
    App.controls = new THREE.OrbitControls(App.camera, App.renderer.domElement);
    App.controls.enableDamping = true; App.controls.dampingFactor = 0.05;

    buildLobbyBackground();
    window.addEventListener('resize', () => { App.camera.aspect = window.innerWidth / window.innerHeight; App.camera.updateProjectionMatrix(); App.renderer.setSize(window.innerWidth, window.innerHeight); });
    animate();
}

function clearScene() {
    while(App.scene.children.length > 0) { App.scene.remove(App.scene.children[0]); }
    DSEngine.objects = {}; DSEngine.bh.disk = null;
    SSEngine.planets = []; SSEngine.moons = []; SSEngine.tracked = null;
    PREngine.probes = []; PREngine.tracked = null;
}

function buildLobbyBackground() {
    App.scene.fog = new THREE.FogExp2(0x010205, 0.0005);
    const bgGeo = new THREE.BufferGeometry(); const bgPos = new Float32Array(5000 * 3);
    for(let i=0; i<5000*3; i++) bgPos[i] = (Math.random() - 0.5) * 1000;
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    App.scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({color: 0x888888, size: 2})));
    App.camera.position.set(0, 0, 500); App.controls.target.set(0, 0, 0);
}

// ================= [ MODULE 1: DEEP SPACE ENGINE ] =================
function launchDeepSpace() {
    App.mode = 'deepspace'; clearScene(); App.scene.fog = new THREE.FogExp2(0x010205, 0.0001);
    const bgGeo = new THREE.BufferGeometry(); const bgPos = new Float32Array(15000 * 3);
    for(let i=0; i<15000*3; i++) bgPos[i] = (Math.random() - 0.5) * 15000;
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    App.scene.add(new THREE.Points(bgGeo, new THREE.PointsMaterial({color: 0x555555, size: 2})));

    for (const [key, data] of Object.entries(DB.deepspace)) {
        if (data.type === 'nebula') {
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
        } else {
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
    }
    App.camera.position.set(0, 0, 500); App.controls.target.set(0, 0, 0); dsWarpTo('home'); 
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
            DOM.dsTitle.textContent = data.name; DOM.dsDesc.textContent = data.desc; DOM.dsDetails.textContent = data.details;
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
    if(DSEngine.bh.eh) { DSEngine.bh.eh.scale.set(scale, scale, scale); DSEngine.bh.ps.scale.set(scale, scale, scale); DSEngine.bh.disk.scale.set(scale, scale, scale); }
    const timeDilation = (dist * rs > rs) ? 1 / Math.sqrt(1 - (rs / (dist * rs))) : 0;
    document.getElementById('bh-mass-val').textContent = mass.toFixed(1); document.getElementById('bh-dist-val').textContent = `${dist} Rs`;
    document.getElementById('bh-rs').textContent = `${rs.toFixed(2)} km`;
    document.getElementById('bh-time').textContent = timeDilation > 0 ? timeDilation.toFixed(4) + "x" : "INFINITE";
}

// ================= [ 5. MODULE 2: SOLAR SYSTEM ENGINE ] =================
function launchSolarSystem() {
    App.mode = 'solarsystem'; clearScene(); App.scene.fog = new THREE.FogExp2(0x010205, 0.0005);
    
    const starsGeo = new THREE.BufferGeometry(); const starsPos = new Float32Array(5000 * 3);
    for(let i=0; i<5000*3; i++) starsPos[i] = (Math.random() - 0.5) * 2000;
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    App.scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({color: 0xaaaaaa, size: 1.5})));

    const sun = new THREE.Mesh(new THREE.SphereGeometry(8, 64, 64), new THREE.MeshBasicMaterial({ color: 0xffcc33 }));
    App.scene.add(sun); App.scene.add(new THREE.PointLight(0xffffff, 2, 800)); App.scene.add(new THREE.AmbientLight(0x333333));

    DOM.ssList.innerHTML = '';
    
    DB.solarsystem.forEach(pData => {
        const pMesh = new THREE.Mesh(new THREE.SphereGeometry(pData.r, 32, 32), new THREE.MeshStandardMaterial({ color: pData.color, roughness: 0.6 }));
        pMesh.position.x = pData.d;

        if(pData.hasRing) {
            const ring = new THREE.Mesh(new THREE.RingGeometry(pData.r * pData.ringInner, pData.r * pData.ringOuter, 64), new THREE.MeshStandardMaterial({ color: pData.ringColor, side: THREE.DoubleSide, transparent:true, opacity:0.7 }));
            ring.rotation.x = Math.PI / 2; pMesh.add(ring);
        }

        if(pData.moons && pData.moons.length > 0) {
            pData.moons.forEach(mData => {
                const mMesh = new THREE.Mesh(new THREE.SphereGeometry(mData.r, 16, 16), new THREE.MeshStandardMaterial({color: mData.color}));
                mMesh.position.x = mData.d;
                const mPivot = new THREE.Group(); mPivot.add(mMesh); pMesh.add(mPivot);
                const mOrbit = new THREE.Mesh(new THREE.RingGeometry(mData.d - 0.05, mData.d + 0.05, 64), new THREE.MeshBasicMaterial({ color: 0x555555, side: THREE.DoubleSide, transparent:true, opacity:0.5 }));
                mOrbit.rotation.x = Math.PI / 2; pMesh.add(mOrbit);
                SSEngine.moons.push({ id: mData.id, pivot: mPivot, mesh: mMesh, speed: mData.speed, parent: pMesh, data: mData });
            });
        }

        const pivot = new THREE.Group(); pivot.add(pMesh); App.scene.add(pivot);
        const orbit = new THREE.Mesh(new THREE.RingGeometry(pData.d - 0.1, pData.d + 0.1, 128), new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide }));
        orbit.rotation.x = Math.PI / 2; App.scene.add(orbit);

        SSEngine.planets.push({ id: pData.id, pivot, mesh: pMesh, speed: pData.speed, data: pData, type: 'planet' });

        const btn = document.createElement('button'); btn.className = 'target-btn ss-target';
        btn.innerHTML = `<span class="btn-title" style="display:flex; align-items:center; gap:8px;"><span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:#${pData.color.toString(16)}"></span>${pData.name}</span>`;
        btn.onclick = () => {
            document.querySelectorAll('.ss-target').forEach(b => b.classList.remove('active')); btn.classList.add('active');
            SSEngine.tracked = SSEngine.planets.find(p => p.id === pData.id);
            ssUpdatePlanetInfo(pData);
        };
        DOM.ssList.appendChild(btn);
    });
    App.camera.position.set(0, 150, 200); App.controls.target.set(0, 0, 0);
}

function ssUpdatePlanetInfo(pData) {
    DOM.ssName.textContent = pData.name; DOM.ssMedia.style.backgroundImage = `url('${pData.img}')`; 
    DOM.ssDesc.textContent = pData.desc; DOM.ssDetails.textContent = pData.details;
    DOM.ssTemp.textContent = pData.temp; DOM.ssOrb.textContent = `${pData.orb} km/s`;

    DOM.ssCompBar.innerHTML = ''; DOM.ssCompLegend.innerHTML = '';
    if(pData.atm) {
        pData.atm.forEach(c => {
            DOM.ssCompBar.innerHTML += `<div class="comp-segment" style="width:${c.p}%; background:${c.c};">${c.p}%</div>`;
            DOM.ssCompLegend.innerHTML += `<div class="legend-item"><div class="legend-color" style="background:${c.c};"></div>${c.n}</div>`;
        });
    }

    DOM.ssInternalBar.innerHTML = ''; DOM.ssInternalLegend.innerHTML = '';
    if(pData.internal) {
        pData.internal.forEach(layer => {
            DOM.ssInternalBar.innerHTML += `<div class="internal-segment" style="height:${layer.p * 1.5}px; background:${layer.c}; border-bottom:1px solid rgba(0,0,0,0.5);">${layer.p}%</div>`;
            DOM.ssInternalLegend.innerHTML += `<div class="legend-item"><div class="legend-color" style="background:${layer.c};"></div>${layer.n}</div>`;
        });
    }

    if(pData.moons && pData.moons.length > 0) {
        DOM.ssMoonsCont.style.display = 'block'; DOM.ssMoonsList.innerHTML = '';
        pData.moons.forEach(mData => {
            const btn = document.createElement('button'); btn.className = 'moon-btn'; btn.textContent = mData.name;
            btn.onclick = () => {
                document.querySelectorAll('.moon-btn').forEach(b => b.classList.remove('active')); btn.classList.add('active');
                SSEngine.tracked = SSEngine.moons.find(m => m.id === mData.id);
                DOM.ssDesc.textContent = `[위성 데이터] ${mData.desc}`;
            };
            DOM.ssMoonsList.appendChild(btn);
        });
    } else {
        DOM.ssMoonsCont.style.display = 'none';
    }
    DOM.ssInfo.style.opacity = "1";
}

// ================= [ 6. MODULE 3: INTERSTELLAR PROBES ] =================
function launchProbes() {
    App.mode = 'probes'; clearScene(); App.scene.fog = new THREE.FogExp2(0x010205, 0.0001); 
    
    const starsGeo = new THREE.BufferGeometry(); const starsPos = new Float32Array(10000 * 3);
    for(let i=0; i<10000*3; i++) starsPos[i] = (Math.random() - 0.5) * 15000;
    starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
    App.scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({color: 0x888888, size: 2})));

    const sun = new THREE.Mesh(new THREE.SphereGeometry(2, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffddaa }));
    App.scene.add(sun); App.scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    const refOrbits = [5.2, 9.5, 19.2, 30.1]; const scaleAU = 10;
    refOrbits.forEach(r => {
        const orbit = new THREE.Mesh(new THREE.RingGeometry(r*scaleAU - 0.5, r*scaleAU + 0.5, 128), new THREE.MeshBasicMaterial({ color: 0x223344, side: THREE.DoubleSide }));
        orbit.rotation.x = Math.PI / 2; App.scene.add(orbit);
    });

    DOM.prList.innerHTML = '';
    
    DB.probes.forEach(pData => {
        const dist = pData.distAU * scaleAU;
        const x = Math.cos(pData.angle) * dist;
        const z = Math.sin(pData.angle) * dist;
        
        const pMesh = new THREE.Mesh(new THREE.OctahedronGeometry(1.5, 0), new THREE.MeshBasicMaterial({ color: 0xa277ff, wireframe: true }));
        pMesh.position.set(x, 0, z); App.scene.add(pMesh);

        const points = [new THREE.Vector3(0,0,0), new THREE.Vector3(x, 0, z)];
        const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
        const lineMat = new THREE.LineBasicMaterial({ color: 0xa277ff, transparent: true, opacity: 0.3 });
        const line = new THREE.Line(lineGeo, lineMat); App.scene.add(line);

        PREngine.probes.push({ id: pData.id, mesh: pMesh, data: pData });

        const btn = document.createElement('button'); btn.className = 'target-btn pr-target';
        btn.innerHTML = `<span class="btn-title" style="color:#a277ff;">${pData.name}</span>`;
        btn.onclick = () => {
            document.querySelectorAll('.pr-target').forEach(b => b.classList.remove('active')); btn.classList.add('active');
            PREngine.tracked = PREngine.probes.find(p => p.id === pData.id);
            prUpdateInfo(pData);
        };
        DOM.prList.appendChild(btn);
    });
    App.camera.position.set(0, 500, 800); App.controls.target.set(0, 0, 0);
}

function prUpdateInfo(pData) {
    DOM.prName.textContent = pData.name; DOM.prMedia.style.backgroundImage = `url('${pData.img}')`; 
    DOM.prDesc.textContent = pData.desc; DOM.prDetails.textContent = pData.details;
    DOM.prDist.textContent = `${pData.distAU} AU (${(pData.distAU * 1.496e8).toLocaleString()} km)`;
    DOM.prVel.textContent = `${pData.vel} km/s`;
    DOM.prPower.textContent = pData.power;
    
    const distKm = pData.distAU * 1.496e8; const seconds = distKm / 300000;
    DOM.prDelay.textContent = `${Math.floor(seconds / 3600)} Hours ${Math.floor((seconds % 3600) / 60)} Mins`;

    DOM.prInfo.style.opacity = "1";

    const tPos = PREngine.tracked.mesh.position;
    new TWEEN.Tween(App.controls.target).to(tPos, 1500).start();
    const dirToSun = tPos.clone().normalize().multiplyScalar(-15);
    new TWEEN.Tween(App.camera.position).to(tPos.clone().add(new THREE.Vector3(0, 5, 0)).add(dirToSun), 1500).start();
}

// ================= [ 7. 글로벌 라우팅 및 애니메이션 루프 ] =================
document.querySelectorAll('.module-card').forEach(card => {
    card.addEventListener('click', () => {
        DOM.lobby.style.opacity = "0";
        setTimeout(() => {
            DOM.lobby.style.display = "none"; DOM.btnHub.style.display = "block"; 
            const targetMod = card.dataset.module;
            if (targetMod === 'deepspace') { DOM.uiDS.style.display = 'block'; launchDeepSpace(); }
            else if (targetMod === 'solarsystem') { DOM.uiSS.style.display = 'block'; launchSolarSystem(); }
            else if (targetMod === 'probes') { DOM.uiPR.style.display = 'block'; launchProbes(); }
        }, 500);
    });
});

DOM.btnHub.addEventListener('click', () => {
    DOM.uiDS.style.display = 'none'; DOM.uiSS.style.display = 'none'; DOM.uiPR.style.display = 'none'; DOM.btnHub.style.display = 'none';
    App.mode = 'lobby'; clearScene(); buildLobbyBackground();
    DOM.lobby.style.display = 'flex'; setTimeout(() => DOM.lobby.style.opacity = "1", 100);
});

DOM.dsTargets.forEach(btn => btn.addEventListener('click', (e) => { DOM.dsTargets.forEach(b => b.classList.remove('active')); e.target.closest('.target-btn').classList.add('active'); dsWarpTo(e.target.closest('.target-btn').dataset.target); }));
DOM.bhMass.addEventListener('input', dsUpdatePhysics); DOM.bhDist.addEventListener('input', dsUpdatePhysics);

DOM.ssBtnReset.addEventListener('click', () => {
    SSEngine.tracked = null; document.querySelectorAll('.ss-target, .moon-btn').forEach(b => b.classList.remove('active')); DOM.ssInfo.style.opacity = "0";
    new TWEEN.Tween(App.camera.position).to(new THREE.Vector3(0, 150, 200), 1500).start(); new TWEEN.Tween(App.controls.target).to(new THREE.Vector3(0,0,0), 1500).start();
});
DOM.ssSpeed.addEventListener('input', e => { SSEngine.speedMulti = parseFloat(e.target.value) / 10; document.getElementById('ss-speed-val').textContent = `${(SSEngine.speedMulti*10).toFixed(1)}x`; });

DOM.btnPrReset.addEventListener('click', () => {
    PREngine.tracked = null; document.querySelectorAll('.pr-target').forEach(b => b.classList.remove('active')); DOM.prInfo.style.opacity = "0";
    new TWEEN.Tween(App.camera.position).to(new THREE.Vector3(0, 500, 800), 1500).start(); new TWEEN.Tween(App.controls.target).to(new THREE.Vector3(0,0,0), 1500).start();
});

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update(); 

    if (App.mode === 'lobby') { App.scene.rotation.y += 0.0005; } 
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
        SSEngine.moons.forEach(m => { m.pivot.rotation.y += m.speed * SSEngine.speedMulti; });
        if (SSEngine.tracked) {
            const tPos = new THREE.Vector3(); SSEngine.tracked.mesh.getWorldPosition(tPos); 
            App.controls.target.lerp(tPos, 0.1);
            const isMoon = SSEngine.tracked.data.speed !== undefined && SSEngine.tracked.parent !== undefined;
            const zDist = isMoon ? SSEngine.tracked.data.r * 8 + 2 : SSEngine.tracked.data.r * 5 + 10;
            App.camera.position.lerp(tPos.clone().add(new THREE.Vector3(zDist, zDist/2, zDist)), 0.05);
        }
    }
    else if (App.mode === 'probes') {
        PREngine.probes.forEach(p => p.mesh.rotation.y += 0.02);
    }

    App.controls.update();
    App.renderer.render(App.scene, App.camera);
}

window.onload = initGlobalCore;