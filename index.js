// Cypher Mapping
const cypherMap = {
    'p': 'e', 'b': 'ɘ',
    't': 'ʌ', 'd': 'v',
    'k': 'c', 'g': 'ↄ',
    'q': 'ʊ',
    's': 's', 'z': 'ƨ',
    'c': 'ɛ', 'j': 'ɜ',
    'ph': 'e̱', 'bh': 'ɘ̱',
    'th': 'ʌ̱', 'dh': 'v̱',
    'kh': 'c̱', 'gh': 'ↄ̱',
    'qh': 'ʊ̱',
    'sh': 's̱', 'zh': 'ƨ̱',
    'ch': 'ɛ̱', 'jh': 'ɜ̱',
    'm': 'ƞ', 'n': 'ʜ',
    'l': 'ꞁ',
    'r': 'ɽ',
    'y': 'ɥ',
    'x': 'ı' 
};

// Combining marks
const vowelDiac = {
    'a': '\u0300', // Grave `
    'e': '\u0301', // Acute ´
    'i': '\u0302', // Circumflex ˆ
    'o': '\u0307', // Dot ̇
    'u': '\u0308', // Diaeresis ¨
    'v': '\u030C', // Caron ˇ
    'w': '\u0303'  // Tilde ˜
};

const preProc = {
    'ph':'0', 'th':'1', 'kh':'2', 'qh':'3', 'sh':'4', 'ch':'5',
    'bh':'6', 'dh':'7', 'gh':'8', 'zh':'9', 'jh':'@'
};
const postProc = {
    '0':'ph', '1':'th', '2':'kh', '3':'qh', '4':'sh', '5':'ch',
    '6':'bh', '7':'dh', '8':'gh', '9':'zh', '@':'jh'
};

function convertChunk(chunk, isPure, useToolU) {
    let s = chunk; 
    for(let k in preProc) s = s.replace(new RegExp(k, 'g'), preProc[k]);

    let out = '';
    let lastWasConsonant = false;

    // Sequential parser
    for (let i = 0; i < s.length; i++) {
        let char = s[i];

        if (vowelDiac[char]) {
            // It's a vowel. Check if it needs an onset anchor.
            if (!lastWasConsonant) {
                out += cypherMap['x']; 
            }
            // Append the diacritic if in "Pure" mode
            if (isPure) {
                out += vowelDiac[char];
            }
            // A vowel terminates the active consonant state
            lastWasConsonant = false; 
        } else {
            // It's a consonant or punctuation
            let cLat = postProc[char] || char;
            
            if (cypherMap[cLat]) {
                out += cypherMap[cLat];
                lastWasConsonant = true;
            } else {
                out += char;
                lastWasConsonant = false;
            }
        }
    }

    // Apply the Tool U Shortcut (ı + ¨)
    if (useToolU && isPure) {
        out = out.replace(/ı\u0308/g, ':');
    }

    return out;
}

function convertToCypher(text, isPure, useToolU) {
    return text.replace(/[a-zA-Z\-]+/g, (word) => {
        let chunks = word.split('-'); 
        let out = '';
        for (let chunk of chunks) out += convertChunk(chunk, isPure, useToolU);
        return out;
    });
}

// UI Elements
const quoteTypeDoubleAngle = document.getElementById('quoteTypeDoubleAngle');
const quoteTypeSquare = document.getElementById('quoteTypeSquare');
const transliterateNouns = document.getElementById('transliterateNouns');
const isPure = document.getElementById('isPure');
const toolUShortcut = document.getElementById('toolUShortcut');
const latinIn = document.getElementById('latinIn');
const kalobOutText = document.getElementById('kalobOutText');
const kalobOut = document.getElementById('kalobOut');
const copyKalobBtn = document.getElementById('copyKalob');
const toast = document.getElementById('toast');

// UI Triggers
const inputsToWatch = [quoteTypeDoubleAngle, quoteTypeSquare, transliterateNouns, isPure, toolUShortcut];
inputsToWatch.forEach(input => {
    input.addEventListener('change', () => handleInput());
});

latinIn.addEventListener('input', handleInput);

function handleInput() {
    let quotation = quoteTypeSquare.checked ? ['｢ ', ' ｣'] : ['《 ', ' 》'];
    let doTransliterate = transliterateNouns.checked;
    let pureAbjad = isPure.checked;
    let doToolUShortcut = toolUShortcut.checked;
    
    let text = latinIn.value
        .split('"')
        .reduce((acc, v, i) => acc + (i % 2 ? '[' : ']') + v)
        .replace(/\b[A-Z][A-Za-z]*/g, '{$&}'); 

    let parts = text.split(/(\{.*?\})/);
    
    for (let i = 0; i < parts.length; i++) {
        if (parts[i].startsWith('{')) {
            let noun = parts[i].slice(1, -1).toLowerCase(); 
            if (doTransliterate) parts[i] = '〈 ' + convertToCypher(noun, pureAbjad, doToolUShortcut) + ' 〉';
            else parts[i] = '〈 ' + parts[i].slice(1, -1) + ' 〉';
        } else {
            parts[i] = convertToCypher(parts[i].toLowerCase(), pureAbjad, doToolUShortcut);
        }
    }

    text = parts.join('')
        .replace(/\[/g, quotation[0])
        .replace(/]/g, quotation[1])
        .replace(/\r?\n/g, '\uFFFE');

    kalobOutText.innerText = text;
    kalobOut.innerHTML = kalobOutText.innerHTML.replace(/\uFFFE/g, '<br>');
}

// Initial Conversion
handleInput();

// Select all on focus if there is content
latinIn.addEventListener('focus', (e) => {
    if (e.currentTarget.value.trim().length > 0) {
        e.target.select();
    }
});

// Copy functionality with Toast notification
let toastTimeout;
copyKalobBtn.addEventListener('click', () => {
    const textToCopy = kalobOut.innerText;
    navigator.clipboard.writeText(textToCopy).then(() => {
        // Show toast
        toast.classList.add('show');
        
        // Reset button state slightly for visual feedback
        const btnText = copyKalobBtn.querySelector('.btn-text');
        btnText.innerText = 'Copied!';
        
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
            btnText.innerText = 'Copy';
        }, 2000);
    });
});