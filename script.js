const wordList = [
    { kanji: '太陽', kana: 'taiyou', attr: 'fire' },
    { kanji: '炎', kana: 'honoo', attr: 'fire' },
    { kanji: '熱い', kana: 'atui', attr: 'fire' },
    { kanji: '情熱', kana: 'jounetu', attr: 'fire' },
    { kanji: '火山', kana: 'kazan', attr: 'fire' },
    { kanji: '水', kana: 'mizu', attr: 'water' },
    { kanji: '海', kana: 'umi', attr: 'water' },
    { kanji: '雨', kana: 'ame', attr: 'water' },
    { kanji: '氷', kana: 'koori', attr: 'water' },
    { kanji: 'しずく', kana: 'sizuku', attr: 'water' },
    { kanji: '風', kana: 'kaze', attr: 'wind' },
    { kanji: '雲', kana: 'kumo', attr: 'wind' },
    { kanji: '嵐', kana: 'arasi', attr: 'wind' },
    { kanji: '翼', kana: 'tubasa', attr: 'wind' },
    { kanji: '自由', kana: 'jiyuu', attr: 'wind' },
    { kanji: '卵', kana: 'tamago', attr: 'earth' },
    { kanji: '光', kana: 'hikari', attr: 'earth' },
    { kanji: '大地', kana: 'daiti', attr: 'earth' },
    { kanji: '森', kana: 'mori', attr: 'earth' },
    { kanji: '花', kana: 'hana', attr: 'earth' }
];

let currentExp = 0;
let currentWord = '';
let typedIndex = 0;
let selectedOptions = [];
let currentStage = 'stage-egg';
let attributePoints = { fire: 0, water: 0, wind: 0, earth: 0 };
let currentWordAttr = 'earth';
let isCrying = false;
let serialPort = null;
let serialReader = null;

const dinoElement = document.getElementById('dino');
const dinoMain = document.getElementById('dino-main');
const dinoSub = document.getElementById('dino-sub');
const dinoEyes = document.getElementById('dino-eyes');
const dinoExtra = document.getElementById('dino-extra');
const dinoHeart = document.getElementById('dino-heart');
const dinoMessage = document.getElementById('dino-message');
const expValueElement = document.getElementById('exp-value');
const expBarElement = document.getElementById('exp-bar-fill');
const wordSelectionArea = document.getElementById('word-selection');
const typingArea = document.getElementById('typing-area');
const targetWordElement = document.getElementById('target-word');
const typedCharsElement = document.getElementById('typed-chars');

const baseBodyPath = 'M50,150 Q50,60 100,60 Q150,60 150,150 Q100,160 50,150 Z';
const baseEyes = '<circle cx="85" cy="100" r="5" fill="#333" /><circle cx="115" cy="100" r="5" fill="#333" />';
const baseCheeks = '<rect x="65" y="105" width="15" height="8" rx="4" fill="#ff9999" opacity="0.8" /><rect x="120" y="105" width="15" height="8" rx="4" fill="#ff9999" opacity="0.8" />';

const svgData = {
    'stage-egg': {
        main: 'M100,150 C70,150 50,120 50,90 C50,60 70,30 100,30 C130,30 150,60 150,90 C150,120 130,150 100,150 Z',
        mainColor: '#fff9e6',
        sub: 'M70,50 Q80,40 90,55 M110,80 Q120,70 130,85 M80,120 Q90,110 100,125',
        subColor: '#f0e68c',
        eyes: ''
    },
    'stage-cracked': {
        main: 'M100,150 C70,150 50,120 50,90 C50,60 70,30 100,30 C130,30 150,60 150,90 C150,120 130,150 100,150 Z',
        mainColor: '#fff9e6',
        sub: 'M100,30 L90,50 L110,60 L95,80 L105,100',
        subColor: '#ffb74d',
        eyes: ''
    },
    'stage-baby': {
        main: baseBodyPath, mainColor: '#81c784', sub: '', subColor: 'transparent', eyes: baseEyes + baseCheeks
    },
    'fire': {
        child: { main: baseBodyPath, mainColor: '#ffab91', sub: 'M100,60 Q100,40 110,35 Q120,40 120,60 Z', subColor: '#ff7043', eyes: baseEyes + baseCheeks },
        adult: { main: baseBodyPath, mainColor: '#ff7043', sub: 'M90,60 Q90,30 105,20 Q120,30 120,60 M110,60 Q110,35 125,30 Q140,35 140,60 Z', subColor: '#d84315', eyes: baseEyes + baseCheeks }
    },
    'water': {
        child: { main: baseBodyPath, mainColor: '#81d4fa', sub: 'M150,130 Q165,130 170,140 Q165,150 150,150 Z', subColor: '#4fc3f7', eyes: baseEyes + baseCheeks },
        adult: { main: baseBodyPath, mainColor: '#4fc3f7', sub: 'M150,120 Q180,120 185,135 Q180,155 150,150 M100,60 Q100,40 115,35 Q130,40 130,60 Z', subColor: '#0288d1', eyes: baseEyes + baseCheeks }
    },
    'wind': {
        child: { main: baseBodyPath, mainColor: '#e0e0e0', sub: 'M50,110 Q35,110 30,120 Q35,130 50,130 Z', subColor: '#bdbdbd', eyes: baseEyes + baseCheeks },
        adult: { main: baseBodyPath, mainColor: '#bdbdbd', sub: 'M50,100 Q20,100 15,115 Q20,135 50,130 M150,100 Q180,100 185,115 Q180,135 150,130 Z', subColor: '#9e9e9e', eyes: baseEyes + baseCheeks }
    },
    'earth': {
        child: { main: baseBodyPath, mainColor: '#aed581', sub: 'M80,65 L85,45 L95,62 M105,62 L115,45 L120,65 Z', subColor: '#f5f5f5', eyes: baseEyes + baseCheeks },
        adult: { main: baseBodyPath, mainColor: '#7cb342', sub: 'M70,70 L75,30 L95,65 M105,65 L125,30 L130,70 M100,60 Q100,30 130,30 Q160,30 160,60 Z', subColor: '#e0e0e0', eyes: baseEyes + baseCheeks }
    }
};

async function connectMicrobit() {
    try {
        serialPort = await navigator.serial.requestPort();
        await serialPort.open({ baudRate: 115200 });
        const btn = document.getElementById('connect-btn');
        btn.innerText = 'micro:bit 接続済み';
        btn.classList.add('connected');
        readSerialLoop();
    } catch (e) {
        console.error(e);
        alert('接続に失敗しました。');
    }
}

async function readSerialLoop() {
    const textDecoder = new TextDecoderStream();
    const readableStreamClosed = serialPort.readable.pipeTo(textDecoder.writable);
    const reader = textDecoder.readable.getReader();
    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value.includes('stop_crying')) sootheDino();
        }
    } catch (e) {
        console.error(e);
    } finally {
        reader.releaseLock();
    }
}

function init() {
    loadData();
    updateWordOptions();
    updateStatus();
}

function saveData() {
    localStorage.setItem('dino_typing_exp', currentExp);
    localStorage.setItem('dino_typing_attr', JSON.stringify(attributePoints));
}

function loadData() {
    const savedExp = localStorage.getItem('dino_typing_exp');
    if (savedExp !== null) currentExp = parseInt(savedExp, 10);
    const savedAttr = localStorage.getItem('dino_typing_attr');
    if (savedAttr !== null) attributePoints = JSON.parse(savedAttr);
}

function resetData() {
    if (confirm('せいちょう度をリセットして、卵からやり直しますか？')) {
        currentExp = 0;
        attributePoints = { fire: 0, water: 0, wind: 0, earth: 0 };
        saveData();
        updateStatus();
    }
}

function updateWordOptions() {
    if (isCrying) return;
    selectedOptions = [];
    const shuffled = [...wordList].sort(() => 0.5 - Math.random());
    selectedOptions = shuffled.slice(0, 3);
    for (let i = 0; i < 3; i++) {
        const btn = document.getElementById(`word-btn-${i}`);
        btn.innerText = selectedOptions[i].kanji;
        btn.className = `attr-${selectedOptions[i].attr}`;
    }
}

function selectWord(index) {
    if (isCrying) return;
    const selected = selectedOptions[index];
    currentWord = selected.kana;
    currentWordAttr = selected.attr;
    typedIndex = 0;
    wordSelectionArea.classList.add('hidden');
    typingArea.classList.remove('hidden');
    targetWordElement.innerText = currentWord;
    typedCharsElement.innerText = '';
}

window.addEventListener('keydown', (e) => {
    if (typingArea.classList.contains('hidden') || isCrying) return;
    const char = e.key.toLowerCase();
    if (char === currentWord[typedIndex]) {
        typedIndex++;
        updateTypingDisplay();
        triggerHitEffect();
        if (typedIndex === currentWord.length) finishTyping();
    }
});

function triggerHitEffect() {
    typedCharsElement.classList.remove('hit');
    void typedCharsElement.offsetWidth;
    typedCharsElement.classList.add('hit');
}

function updateTypingDisplay() {
    typedCharsElement.innerText = currentWord.substring(0, typedIndex);
}

function finishTyping() {
    currentExp += 5;
    attributePoints[currentWordAttr] += 1;
    saveData();
    dinoElement.classList.add('jump');
    setTimeout(() => dinoElement.classList.remove('jump'), 400);
    updateStatus();

    setTimeout(() => {
        typingArea.classList.add('hidden');
        // 一定の確率（20%）で泣き出す（卵・ひび以外）
        if (currentExp >= 25 && Math.random() < 0.2) {
            startCrying();
        } else {
            wordSelectionArea.classList.remove('hidden');
            updateWordOptions();
        }
    }, 500);
}

function startCrying() {
    isCrying = true;
    dinoMessage.innerText = 'このこを あやしてあげて！';
    dinoMessage.classList.remove('hidden');
    wordSelectionArea.classList.add('hidden');
    updateDinoSVG(currentStage, Object.keys(attributePoints).reduce((a, b) => attributePoints[a] >= attributePoints[b] ? a : b));
}

function sootheDino() {
    if (!isCrying) return;
    isCrying = false;
    dinoMessage.classList.add('hidden');
    dinoHeart.classList.remove('hidden');
    
    // 笑顔の目を表示
    const originalEyes = dinoEyes.innerHTML;
    dinoEyes.innerHTML = '<path d="M75,100 Q85,90 95,100 M105,100 Q115,90 125,100" fill="none" stroke="#333" stroke-width="3" />' + baseCheeks;
    
    setTimeout(() => {
        dinoHeart.classList.add('hidden');
        dinoEyes.innerHTML = originalEyes;
        wordSelectionArea.classList.remove('hidden');
        updateWordOptions();
    }, 2000);
}

function sootheByClick() {
    if (isCrying) sootheDino();
}

function updateDinoSVG(stage, attr) {
    let data;
    if (['stage-egg', 'stage-cracked', 'stage-baby'].includes(stage)) {
        data = svgData[stage];
    } else {
        const type = stage.includes('child') ? 'child' : 'adult';
        data = svgData[attr][type];
    }
    if (data) {
        dinoMain.setAttribute('d', data.main);
        dinoMain.setAttribute('fill', data.mainColor);
        dinoSub.setAttribute('d', data.sub);
        dinoSub.setAttribute('fill', data.subColor);
        
        if (isCrying) {
            // 泣き顔の目となみだ
            dinoEyes.innerHTML = '<circle cx="85" cy="100" r="3" fill="#333" /><circle cx="115" cy="100" r="3" fill="#333" />';
            dinoExtra.innerHTML = '<path d="M80,110 Q85,130 90,110 M110,110 Q115,130 120,110" fill="none" stroke="#4fc3f7" stroke-width="2" />';
        } else {
            dinoEyes.innerHTML = data.eyes;
            dinoExtra.innerHTML = '';
        }
        
        dinoSub.setAttribute('stroke', 'none');
        if (stage.includes('adult')) dinoElement.style.transform = 'scale(1.2)';
        else if (stage === 'stage-baby') dinoElement.style.transform = 'scale(0.8)';
        else dinoElement.style.transform = 'scale(1)';
    }
}

function updateStatus() {
    expValueElement.innerText = currentExp;
    const progress = Math.min((currentExp / 150) * 100, 100);
    expBarElement.style.width = `${progress}%`;
    const topAttr = Object.keys(attributePoints).reduce((a, b) => attributePoints[a] >= attributePoints[b] ? a : b);
    let nextStage = '';
    if (currentExp < 10) nextStage = 'stage-egg';
    else if (currentExp < 25) nextStage = 'stage-cracked';
    else if (currentExp < 75) nextStage = 'stage-baby';
    else if (currentExp < 150) nextStage = `stage-child-${topAttr}`;
    else nextStage = `stage-adult-${topAttr}`;

    if (nextStage !== currentStage) {
        dinoElement.classList.add('evolve-flash');
        setTimeout(() => dinoElement.classList.remove('evolve-flash'), 1000);
        currentStage = nextStage;
    }
    updateDinoSVG(currentStage, topAttr);
}

init();
