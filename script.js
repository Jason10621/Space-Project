// =======================================================================
// HAFS Deep Space Navigator - Macro to Micro Engine (Black Hole Edition)
// =======================================================================

// --- 1. 우주 데이터베이스 (블랙홀 데이터 추가) ---
const UNIVERSE_DATA = {
    'home': {
        name: "MILKY WAY (우리은하)", type: "nebula",
        distance: "0 Light Years", scale: "100,000 Light Years",
        desc: "우리가 속해 있는 막대 나선 은하입니다. 이 거대한 우주 지도의 기준점(Origin) 역할을 합니다.",
        coords: new THREE.Vector3(0, 0, 0), color: 0x88bbff, particleCount: 15000,
        subSystems: [
            { title: "Orion Arm (오리온자리 팔)", detail: "태양계가 위치한 나선팔 구조입니다." }
        ]
    },
    // [신규] 블랙홀 데이터
    'sgra': {
        name: "SAGITTARIUS A* (초거대 블랙홀)", type: "blackhole",
        distance: "26,000 Light Years", scale: "Event Horizon: ~0.1 AU",
        desc: "우리은하 중심에 위치한 초거대 질량 블랙홀입니다. 시공간을 휘게 만드는 강력한 중력으로 인해 빛조차 빠져나갈 수 없는 사상의 지평선(Event Horizon)과, 그 주변을 공전하는 강착 원반(Accretion Disk)을 형성합니다.",
        coords: new THREE.Vector3(200, 50, -200), // 은하 중심 근처에 배치
        subSystems: [] // 블랙홀은 물리엔진 UI를 사용하므로 비워둠
    },
    'carina': {
        name: "CARINA NEBULA (용골자리 성운)", type: "nebula",
        distance: "8,500 Light Years", scale: "460 Light Years",
        desc: "가스와 먼지로 이루어진 거대한 별의 요람입니다. JWST가 촬영한 '우주 절벽(Cosmic Cliffs)'이 이곳에 있습니다.",
        coords: new THREE.Vector3(1200, 300, -800), color: 0xff5522, particleCount: 20000,
        subSystems: [
            { title: "Eta Carinae (에타 카리나이)", detail: "태양 질량의 100배가 넘는, 폭발 직전의 극대거성 쌍성계입니다." },
            { title: "Cosmic Cliffs (우주 절벽)", detail: "뜨거운 자외선 복사로 인해 가스가 깎여나가는 거대한 별 탄생 영역입니다." }
        ]
    },
    'stephan': {
        name: "STEPHAN'S QUINTET (오중주 은하군)", type: "nebula",
        distance: "290 Million Light Years", scale: "300,000 Light Years",
        desc: "5개의 은하가 중력으로 얽혀 충돌하고 병합하는 역동적인 은하군입니다.",
        coords: new THREE.Vector3(-2000, 1500, 1200), color: 0xffcc77, particleCount: 25000,
        subSystems: [
            { title: "NGC 7318a & NGC 7318b", detail: "서로 충돌하며 거대한 충격파(가스 꼬리)를 만들어내는 두 개의 나선 은하입니다." }
        ]
    },
    'smacs': {
        name: "SMACS 0723 (중력렌즈 은하단)", type: "nebula",
        distance: "4.6 Billion Light Years", scale: "Unknown (Galaxy Cluster)",
        desc: "전면에 있는 은하단의 엄청난 질량이 시공간을 휘게 만들어, 뒤편의 초기 은하들을 확대해 보여줍니다.",
        coords: new THREE.Vector3(3500, -2000, -4000), color: 0x5544ff, particleCount: 30000,
        subSystems: [
            { title: "Gravitational Lensing Arcs", detail: "중력 렌즈 현상으로 인해 시공간이 휘어져, 배경 은하들의 빛이 활처럼 휘어보이는 현상입니다." }
        ]
    }
};

// --- 2. 3D 엔진 초기화 ---
const container = document.getElementById('three-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x02050a, 0.0001); 

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 20000);
camera.position.set(0, 0, 500); 

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.maxDistance = 10000;

const celestialObjects = {}; 

// [신규] 블랙홀 물리 엔진 전용 객체 저장소
const blackHoleEngine = {
    group: null, eventHorizon: null, photonSphere: null, diskParticles: null,
    particleSpeeds: [], particleCount: 40000 
};

// --- 3. 거시 및 미시 파티클 구조 생성기 ---
function initUniverseMap() {
    // 1. 전체 우주 배경 별
    const bgGeo = new THREE.BufferGeometry();
    const bgPos = new Float32Array(15000 * 3);
    for(let i=0; i<15000*3; i++) bgPos[i] = (Math.random() - 0.5) * 15000;
    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPos, 3));
    const bgMat = new THREE.PointsMaterial({color: 0x555555, size: 2});
    scene.add(new THREE.Points(bgGeo, bgMat));

    // 2. 우주 객체(성운 및 블랙홀) 생성
    for (const [key, data] of Object.entries(UNIVERSE_DATA)) {
        if (data.type === 'nebula') {
            createNebula(key, data);
        } else if (data.type === 'blackhole') {
            createBlackHole(key, data);
        }
    }
}

// 기존 은하/성운 렌더링
function createNebula(key, data) {
    const geo = new THREE.BufferGeometry();
    const posArray = new Float32Array(data.particleCount * 3);
    const colorArray = new Float32Array(data.particleCount * 3);
    const baseColor = new THREE.Color(data.color);
    const secondColor = new THREE.Color(0xffffff);

    for(let i=0; i<data.particleCount * 3; i+=3) {
        const r = Math.pow(Math.random(), 2);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const spread = key === 'home' || key === 'stephan' ? 200 : 300; 
        
        posArray[i] = r * Math.sin(phi) * Math.cos(theta) * spread;
        posArray[i+1] = r * Math.sin(phi) * Math.sin(theta) * (spread * 0.3); 
        posArray[i+2] = r * Math.cos(phi) * spread;

        const mixRatio = r; 
        const c = secondColor.clone().lerp(baseColor, mixRatio);
        colorArray[i] = c.r; colorArray[i+1] = c.g; colorArray[i+2] = c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const mat = new THREE.PointsMaterial({
        size: 1.5, vertexColors: true, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending 
    });

    const cloud = new THREE.Points(geo, mat);
    cloud.position.copy(data.coords);
    scene.add(cloud);
    celestialObjects[key] = cloud;
}

// [신규] 블랙홀 구조 렌더링
function createBlackHole(key, data) {
    const bhGroup = new THREE.Group();

    // 사상의 지평선 (검은 구체)
    blackHoleEngine.eventHorizon = new THREE.Mesh(
        new THREE.SphereGeometry(1, 64, 64), 
        new THREE.MeshBasicMaterial({ color: 0x000000 })
    );
    bhGroup.add(blackHoleEngine.eventHorizon);

    // 광자구 (붉은 테두리)
    blackHoleEngine.photonSphere = new THREE.Mesh(
        new THREE.SphereGeometry(1.5, 64, 64), 
        new THREE.MeshBasicMaterial({ color: 0xff3366, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending, side: THREE.BackSide })
    );
    bhGroup.add(blackHoleEngine.photonSphere);

    // 강착 원반 (가스 파티클)
    const diskGeo = new THREE.BufferGeometry();
    const diskPos = new Float32Array(blackHoleEngine.particleCount * 3);
    const diskCol = new Float32Array(blackHoleEngine.particleCount * 3);
    blackHoleEngine.particleSpeeds = new Float32Array(blackHoleEngine.particleCount);

    for(let i=0; i < blackHoleEngine.particleCount; i++) {
        const radius = 2 + Math.random() * 30; 
        const theta = Math.random() * Math.PI * 2;
        const yOffset = (Math.random() - 0.5) * (radius * 0.05);

        diskPos[i*3] = Math.cos(theta) * radius;
        diskPos[i*3+1] = yOffset;
        diskPos[i*3+2] = Math.sin(theta) * radius;

        // 케플러 운동 속도 부여
        blackHoleEngine.particleSpeeds[i] = 1.8 / Math.sqrt(radius);

        // 중심부는 매우 뜨거운 푸른색/흰색, 외곽은 붉은색
        const intensity = 1.0 - (radius / 32);
        diskCol[i*3] = 1.0; 
        diskCol[i*3+1] = 0.3 + (intensity * 0.5); 
        diskCol[i*3+2] = intensity * 1.0;
    }

    diskGeo.setAttribute('position', new THREE.BufferAttribute(diskPos, 3));
    diskGeo.setAttribute('color', new THREE.BufferAttribute(diskCol, 3));

    blackHoleEngine.diskParticles = new THREE.Points(
        diskGeo, 
        new THREE.PointsMaterial({ size: 0.2, vertexColors: true, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending, depthWrite: false })
    );
    
    bhGroup.add(blackHoleEngine.diskParticles);
    bhGroup.position.copy(data.coords);
    bhGroup.rotation.x = 0.2; // 원반이 잘 보이도록 약간 기울임
    
    scene.add(bhGroup);
    celestialObjects[key] = bhGroup;
    blackHoleEngine.group = bhGroup;
}

// --- 4. 초공간 도약 (Warp Drive) ---
function warpToTarget(targetKey) {
    const data = UNIVERSE_DATA[targetKey];
    const targetCloud = celestialObjects[targetKey];

    document.getElementById('status-text').textContent = "CALCULATING HYPERSPACE JUMP...";
    document.getElementById('status-text').style.color = "var(--color-accent-gold)";
    document.getElementById('info-hud').style.opacity = "0";

    // 블랙홀일 경우 카메라를 더 가까이(디테일 감상), 일반 성운은 넓게 조망
    const zoomOffset = data.type === 'blackhole' ? 50 : 400;
    const endPosition = new THREE.Vector3(
        targetCloud.position.x, 
        targetCloud.position.y + (zoomOffset/3), 
        targetCloud.position.z + zoomOffset
    );

    new TWEEN.Tween(camera.position)
        .to(endPosition, 4000) 
        .easing(TWEEN.Easing.Cubic.InOut) 
        .onUpdate(() => camera.lookAt(targetCloud.position))
        .onComplete(() => {
            controls.target.copy(targetCloud.position);
            document.getElementById('status-text').textContent = "ORBIT ESTABLISHED";
            document.getElementById('status-text').style.color = "var(--color-status-green)";
            showTargetInfo(data);
        })
        .start();
}

// 도착 후 패널 업데이트 (블랙홀 / 일반 은하 분기)
function showTargetInfo(data) {
    document.getElementById('info-title').textContent = data.name;
    document.getElementById('info-desc').textContent = data.desc;
    document.getElementById('info-scale').textContent = data.scale;
    
    if (data.type === 'blackhole') {
        // 일반 은하 정보 숨기고 블랙홀 물리 컨트롤 표시
        document.getElementById('normal-info').style.display = 'none';
        document.getElementById('bh-controls').style.display = 'block';
        updateBlackHolePhysics(); // 도약 즉시 초기값 연산
    } else {
        // 일반 은하 정보 표시
        document.getElementById('normal-info').style.display = 'block';
        document.getElementById('bh-controls').style.display = 'none';
        
        const ul = document.getElementById('sub-systems-list');
        ul.innerHTML = '';
        data.subSystems.forEach(sub => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="sub-title">${sub.title}</span><span class="sub-detail">${sub.detail}</span>`;
            ul.appendChild(li);
        });
    }

    document.getElementById('info-hud').style.opacity = "1";
    document.getElementById('info-hud').style.pointerEvents = "auto";
}

// --- 5. 블랙홀 물리 엔진 연산 ---
function updateBlackHolePhysics() {
    const mass = parseFloat(document.getElementById('bh-mass').value);
    const dist = parseFloat(document.getElementById('bh-dist').value);
    
    // Rs 연산 (근사치)
    const rs = mass * 3.0; 
    const scale = Math.max(1, mass / 10);
    
    // 3D 메쉬 동적 크기 변환
    if(blackHoleEngine.eventHorizon) {
        blackHoleEngine.eventHorizon.scale.set(scale, scale, scale);
        blackHoleEngine.photonSphere.scale.set(scale, scale, scale);
        blackHoleEngine.diskParticles.scale.set(scale, scale, scale);
    }

    // 상대성이론 시간 지연 연산
    const r_actual = dist * rs;
    let timeDilation = (r_actual > rs) ? 1 / Math.sqrt(1 - (rs / r_actual)) : 0;

    // UI 업데이트
    document.getElementById('bh-mass-val').textContent = `${mass.toFixed(1)} 태양 질량`;
    document.getElementById('bh-dist-val').textContent = `${dist} R_s`;
    document.getElementById('bh-rs').textContent = `${rs.toFixed(2)} km`;
    
    if (timeDilation > 0) {
        document.getElementById('bh-time').textContent = timeDilation.toFixed(4) + "x";
        document.getElementById('bh-time').style.color = timeDilation > 2 ? "#ff3366" : "#00ffcc";
    } else {
        document.getElementById('bh-time').textContent = "INFINITE";
        document.getElementById('bh-time').style.color = "red";
    }
}

// --- 6. 렌더링 루프 (애니메이션) ---
function animate() {
    requestAnimationFrame(animate);
    TWEEN.update(); 
    
    // 1. 일반 은하들의 은은한 자전
    Object.keys(UNIVERSE_DATA).forEach(key => {
        if(UNIVERSE_DATA[key].type === 'nebula' && celestialObjects[key]) {
            celestialObjects[key].rotation.y += 0.0002;
        }
    });

    // 2. 블랙홀 강착 원반의 역동적인 케플러 회전
    if (blackHoleEngine.diskParticles) {
        const positions = blackHoleEngine.diskParticles.geometry.attributes.position.array;
        const currentScale = blackHoleEngine.eventHorizon.scale.x;
        const massFactor = parseFloat(document.getElementById('bh-mass').value) / 10;

        for(let i=0; i < blackHoleEngine.particleCount; i++) {
            const x = positions[i*3];
            const z = positions[i*3+2];
            const radius = Math.sqrt(x*x + z*z);
            let theta = Math.atan2(z, x);

            // 중심부에 가까울수록, 블랙홀 질량이 작을수록 각속도 증가
            const speed = blackHoleEngine.particleSpeeds[i] * (1.2 / massFactor);
            theta += speed;
            
            // 중심으로 빨려들어가는 연출
            let newRadius = radius - 0.01; 
            
            // 사상의 지평선을 넘으면 외곽에서 파티클 재활용(Recycle)
            if (newRadius < 1.1 * currentScale) {
                newRadius = (10 + Math.random() * 20) * currentScale; 
            }

            positions[i*3] = Math.cos(theta) * newRadius;
            positions[i*3+2] = Math.sin(theta) * newRadius;
        }
        blackHoleEngine.diskParticles.geometry.attributes.position.needsUpdate = true;
    }

    controls.update();
    renderer.render(scene, camera);
}

// --- 7. 이벤트 바인딩 ---
document.querySelectorAll('.target-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.target-btn').forEach(b => b.classList.remove('active'));
        const currentBtn = e.target.closest('.target-btn');
        currentBtn.classList.add('active');
        warpToTarget(currentBtn.dataset.target);
    });
});

document.getElementById('bh-mass').addEventListener('input', updateBlackHolePhysics);
document.getElementById('bh-dist').addEventListener('input', updateBlackHolePhysics);

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 런타임 시작
initUniverseMap();
animate();
showTargetInfo(UNIVERSE_DATA['home']); // 첫 화면 정보 표출