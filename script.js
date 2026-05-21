const wordList = [
    { kanji: '卵', kana: 'tamago' },
    { kanji: '光', kana: 'hikari' },
    { kanji: '大地', kana: 'daichi' },
    { kanji: '水', kana: 'mizu' },
    { kanji: '太陽', kana: 'taiyou' },
    { kanji: '森', kana: 'mori' },
    { kanji: '風', kana: 'kaze' },
    { kanji: '星', kana: 'hoshi' },
    { kanji: '勇気', kana: 'yuuki' },
    { kanji: '未来', kana: 'mirai' }
];

let currentExp = 0;
let currentWord = '';
let typedIndex = 0;
let selectedOptions = [];

const dinoElement = document.getElementById('dino');
const expValueElement = document.getElementById('exp-value');
const expBarElement = document.getElementById('exp-bar-fill');
const wordSelectionArea = document.getElementById('word-selection');
const typingArea = document.getElementById('typing-area');
const targetWordElement = document.getElementById('target-word');
const typedCharsElement = document.getElementById('typed-chars');

// 初期化：単語の選択肢を表示
function init() {
    updateWordOptions();
}

function updateWordOptions() {
    // ランダムに3つの単語を選ぶ
    selectedOptions = [];
    const shuffled = [...wordList].sort(() => 0.5 - Math.random());
    selectedOptions = shuffled.slice(0, 3);

    for (let i = 0; i < 3; i++) {
        document.getElementById(`word-btn-${i}`).innerText = selectedOptions[i].kanji;
    }
}

function selectWord(index) {
    const selected = selectedOptions[index];
    currentWord = selected.kana;
    typedIndex = 0;

    // 表示の切り替え
    wordSelectionArea.classList.add('hidden');
    typingArea.classList.remove('hidden');
    
    targetWordElement.innerText = currentWord;
    typedCharsElement.innerText = '';
}

// キー入力イベント
window.addEventListener('keydown', (e) => {
    if (typingArea.classList.contains('hidden')) return;

    const char = e.key.toLowerCase();
    
    // 正解の文字を打った場合
    if (char === currentWord[typedIndex]) {
        typedIndex++;
        updateTypingDisplay();

        // 単語を打ち終わった場合
        if (typedIndex === currentWord.length) {
            finishTyping();
        }
    }
});

function updateTypingDisplay() {
    typedCharsElement.innerText = currentWord.substring(0, typedIndex);
}

function finishTyping() {
    // 経験値を獲得
    currentExp += 5;
    updateStatus();

    // 画面を戻す
    setTimeout(() => {
        typingArea.classList.add('hidden');
        wordSelectionArea.classList.remove('hidden');
        updateWordOptions();
    }, 500);
}

function updateStatus() {
    expValueElement.innerText = currentExp;
    const progress = Math.min((currentExp / 30) * 100, 100); // 30で最大とする
    expBarElement.style.width = `${progress}%`;

    // ステータス（見た目）の変更
    dinoElement.className = ''; // クラスをリセット
    if (currentExp < 10) {
        dinoElement.classList.add('stage-egg');
    } else if (currentExp < 25) {
        dinoElement.classList.add('stage-cracked');
    } else {
        dinoElement.classList.add('stage-baby');
    }
}

init();
