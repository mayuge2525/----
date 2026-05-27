const wordList = [
    { kanji: '太陽', kana: 'taiyou', attr: 'fire' },
    { kanji: '炎', kana: 'honoo', attr: 'fire' },
    { kanji: '熱い', kana: 'atsui', attr: 'fire' },
    { kanji: '情熱', kana: 'jounetsu', attr: 'fire' },
    { kanji: '火山', kana: 'kazan', attr: 'fire' },
    { kanji: '水', kana: 'mizu', attr: 'water' },
    { kanji: '海', kana: 'umi', attr: 'water' },
    { kanji: '雨', kana: 'ame', attr: 'water' },
    { kanji: '氷', kana: 'koori', attr: 'water' },
    { kanji: 'しずく', kana: 'shizuku', attr: 'water' },
    { kanji: '風', kana: 'kaze', attr: 'wind' },
    { kanji: '雲', kana: 'kumo', attr: 'wind' },
    { kanji: '嵐', kana: 'arashi', attr: 'wind' },
    { kanji: '翼', kana: 'tsubasa', attr: 'wind' },
    { kanji: '自由', kana: 'jiyuu', attr: 'wind' },
    { kanji: '卵', kana: 'tamago', attr: 'earth' },
    { kanji: '光', kana: 'hikari', attr: 'earth' },
    { kanji: '大地', kana: 'daichi', attr: 'earth' },
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

const dinoElement = document.getElementById('dino');
const dinoMain = document.getElementById('dino-main');
const dinoSub = document.getElementById('dino-sub');
const dinoEyes = document.getElementById('dino-eyes');
const expValueElement = document.getElementById('exp-value');
const expBarElement = document.getElementById('exp-bar-fill');
const wordSelectionArea = document.getElementById('word-selection');
const typingArea = document.getElementById('typing-area');
const targetWordElement = document.getElementById('target-word');
const typedCharsElement = document.getElementById('typed-chars');

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
        main: 'M60,140 C40,140 30,120 30,100 C30,70 50,50 80,50 C110,50 130,70 130,100 Q130,140 160,140 L160,150 L60,150 Z',
        mainColor: '#b2ff59',
        sub: 'M80,50 C70,50 60,40 60,20 C60,10 70,5 80,5 C90,5 100,10 100,20 Q100,40 90,50 Z',
        subColor: '#b2ff59',
        eyes: '<circle cx="75" cy="20" r="3" fill="#1b5e20" /><circle cx="85" cy="20" r="3" fill="#1b5e20" />'
    },
    'fire': {
        child: {
            main: 'M40,140 Q30,140 30,110 Q30,80 60,80 Q90,80 100,110 Q110,140 150,130 L150,140 Z',
            mainColor: '#ff7043',
            sub: 'M60,80 Q40,80 35,50 Q30,20 60,20 Q90,20 95,50 Q100,80 60,80 Z',
            subColor: '#ff7043',
            eyes: '<circle cx="50" cy="40" r="4" fill="#3e2723" /><circle cx="70" cy="40" r="4" fill="#3e2723" />'
        },
        adult: {
            main: 'M30,150 Q20,150 20,110 Q20,70 60,70 Q100,70 110,110 Q120,150 180,130 L180,150 Z',
            mainColor: '#d84315',
            sub: 'M60,70 Q30,70 25,30 Q20,0 60,0 Q100,0 105,30 Q110,70 60,70 Z',
            subColor: '#d84315',
            eyes: '<circle cx="45" cy="30" r="5" fill="#3e2723" /><circle cx="75" cy="30" r="5" fill="#3e2723" />'
        }
    },
    'water': {
        child: {
            main: 'M50,140 C30,140 20,120 20,100 C20,80 50,80 80,80 C110,80 130,100 130,120 Q130,140 150,140 L50,140 Z',
            mainColor: '#4fc3f7',
            sub: 'M80,80 Q75,80 75,40 Q75,20 85,20 Q95,20 95,40 Q95,80 80,80 Z',
            subColor: '#4fc3f7',
            eyes: '<circle cx="82" cy="30" r="3" fill="#01579b" /><circle cx="88" cy="30" r="3" fill="#01579b" />'
        },
        adult: {
            main: 'M40,150 C20,150 10,120 10,90 C10,60 50,60 90,60 C130,60 160,90 160,120 Q160,150 190,150 L40,150 Z',
            mainColor: '#0288d1',
            sub: 'M90,60 Q85,60 85,20 Q85,0 100,0 Q115,0 115,20 Q115,60 90,60 Z',
            subColor: '#0288d1',
            eyes: '<circle cx="95" cy="20" r="4" fill="#e1f5fe" /><circle cx="105" cy="20" r="4" fill="#e1f5fe" />'
        }
    },
    'wind': {
        child: {
            main: 'M80,140 Q70,140 70,110 Q70,90 90,90 Q110,90 110,110 Q110,140 100,140 Z',
            mainColor: '#bdbdbd',
            sub: 'M40,110 Q40,70 90,70 Q140,70 140,110 Q90,90 40,110 Z',
            subColor: 'rgba(158, 158, 158, 0.6)',
            eyes: '<circle cx="85" cy="105" r="3" fill="#212121" /><circle cx="95" cy="105" r="3" fill="#212121" />'
        },
        adult: {
            main: 'M90,150 Q80,150 80,110 Q80,90 100,90 Q120,90 120,110 Q120,150 110,150 Z',
            mainColor: '#616161',
            sub: 'M20,110 Q20,50 100,50 Q180,50 180,110 Q100,80 20,110 Z',
            subColor: 'rgba(97, 97, 97, 0.7)',
            eyes: '<circle cx="92" cy="100" r="4" fill="#f1f8e9" /><circle cx="108" cy="100" r="4" fill="#f1f8e9" />'
        }
    },
    'earth': {
        child: {
            main: 'M60,140 Q40,140 40,110 Q40,80 80,80 Q120,80 120,110 Q120,140 140,140 L60,140 Z',
            mainColor: '#aed581',
            sub: 'M40,110 Q20,110 20,80 Q20,50 50,50 Q80,50 80,80 Q80,110 40,110 Z',
            subColor: '#aed581',
            eyes: '<circle cx="40" cy="70" r="4" fill="#1b5e20" /><circle cx="60" cy="70" r="4" fill="#1b5e20" />'
        },
        adult: {
            main: 'M50,150 Q30,150 30,110 Q30,70 90,70 Q150,70 150,110 Q150,150 180,150 L50,150 Z',
            mainColor: '#388e3c',
            sub: 'M40,110 Q10,110 10,70 Q10,30 50,30 Q90,30 90,70 Q90,110 40,110 Z',
            subColor: '#388e3c',
            eyes: '<circle cx="35" cy="60" r="5" fill="#d7ccc8" /><circle cx="65" cy="60" r="5" fill="#d7ccc8" />'
        }
    }
};

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
    if (typingArea.classList.contains('hidden')) return;
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
        wordSelectionArea.classList.remove('hidden');
        updateWordOptions();
    }, 500);
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
        dinoEyes.innerHTML = data.eyes;
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
