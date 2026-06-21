/**
 * Crazy Sun Corporation - aa.js (2026 令和無骨版・極)
*/
const aa = {
    version: '0.1',
    status: 1,
    name: {
        1: 'developing',
        2: 'experimental',
        3: 'beta'
    },
    date: '2026/06/22 5:08',
    log() {
        if (!this.status) return;
        log(`aa.js ver${this.version}-${this.name[this.status]}`);
        log( new Date());
    }
};
aa.log();
const win = window;
const doc = document;
const rgb = ['r', 'g', 'b'];
// ⚓ 一本釣りシステム（首輪固定の魔法）
function element( aa) { return doc.querySelector(aa);     }
function elements(aa) { return doc.querySelectorAll(aa);  }
// 新しいタイプが増えたら、この配列に文字列を足す
const checkTypes = ['checkbox', 'radio'];
const numberTypes  = ['number', 'range'];

function log( aa) {   console.log( aa);   }


//  2026/06/14㈰
function isArray( aa) { return typeof aa === 'object' && aa !== null && Array.isArray( aa);  }
function isObject(aa) { return typeof aa === 'object' && aa !== null && !isArray( aa) && !isNode( aa); }
function isString(aa) { return typeof aa === 'string' && aa !== null && !isArray( aa);       }
function isNumber(aa) { return typeof aa === 'number' && aa !== null && !Number.isNaN( aa);  }
function isNode(  aa) { return typeof aa === 'object' && aa !== null && aa instanceof Node;  }
//盤外
// 👑 値が空文字、undefined、null なら true を返す無敵の引き算
function isEmpty( aa) { return !aa && aa !== 0; }
function isColor( aa) {
    const ab = div(); ab.style.color = aa;
    const res = ab.style.color;
    ab.remove();
    return res !== '';
}

// 2026/06/17㈬ 17:23
// 引数1つの配列はそのまま生還、オブジェクトは1階層目だけ鍵・値を並べる
function array(...aa) {
    if (!aa.length) return []; // 引数なしならカラの器    
    // 💡 引数が1つだけで、それが配列なら、お節介を焼かずに「そのままナマで返す」
    if (aa.length === 1 && isArray(aa[0])) return aa[0];
    let res = [];
    aa.forEach(ba => {
        if (isObject(ba)) {
            // 🔪 1階層目だけ Object.entries() でバラして、そのまま res に叩き込む
            // 中身がオブジェクトだろうが配列だろうが、これ以上は追わない（再帰なし！）
            for (let [bb, bc] of Object.entries(ba)) {
                res.push(bb, bc);
            }
        } else {
            // 配列や文字列、数字、Nodeならそのまま突っ込む
            res.push(ba);
        }
    });
    return res;
}
// 2026/06/17㈬16:30
function object(...aa) {
    if (!aa.length) return {};
    const res = {};
    let count = 0;
    function countUp(ba) {
        while (count in res) count++;
        res[count++] = ba;
    }
    aa.forEach(ba => {
        if (ba === null || ba === undefined) return;
        if (isObject(ba)) {
            Object.assign(res, ba);
        } else if (isString(ba)) {
            ba.split(',').forEach(ca => {
                const item = ca.trim();
                if (!item) return;
                if (!item.includes(':')) {
                    return countUp(item); 
                }
                const [key, ...cb] = item.split(':').map(cc => cc.trim()); 
                let val = string(cb);
                val = isNumber(Number(val)) ? number(val) : val;
                if (!key) {
                    if (val) {
                        countUp(val);
                    }
                } else if (!val) {
                    res[key] = string();
                } else {
                    res[key] = val;
                }
            });
        } else {
            countUp(ba);
        }
    });
    return res;
}
function string(...aa){
    if( !aa.length) return '';
    let res = [];
    aa.forEach(ba => {
        if      (isString(ba))  res.push( ba);
        else if (isNumber(ba))  res.push( String( ba));
        else if (isArray( ba))  res.push( string(...ba));
        else if (isObject(ba))  {
            for (let [bb, bc] of Object.entries(ba)) res.push( string(bb, bc));
        }
    });
    return res.join('');
}
// 2026/06/16㈫17:16 おまけにnumber()を追加
function number(...aa) {
    if (!aa.length) return 0;
    let res = [];
    aa.forEach(ba => {
        if (ba === null || ba === undefined) return;
        if      (isNumber(ba)) res.push(ba);
        else if (isString(ba)) {
            const ca = ba.match(/\d+/g);
            if (ca) res.push(...ca.map(Number));
        } else if (isArray( ba)) res.push(number(...ba)); // ChatGPTくん直伝の push でメモリ効率も最強！
        else if (isObject(ba)) res.push(number(...Object.values(ba)));
    });
    return res.sum();
}


//  parseArgs()
// 📥 2026/06/15㈪ 16:45
// 📥 仕分けのコア
function parseArgs(aa){
    let props    = object();
    let children = array();
    aa.forEach(ba => {
             if (isObject(ba))  props = { ...props, ...ba };
        else if (isArray( ba))  children = [...children, ...ba];
        else if (isNode(ba) || isNumber(ba) || isString(ba))  children.push(ba);
    });
    return { props, children };
}


// ==============================================================================
// 2026/06/12㈮　tag()爆誕記念日。ver1.0
// 2026/06/15㈪17:11【厳格化版】第一引数は「絶対にタグ名」
function tag( tagName, ...aa) {
    if (!isString(tagName)) return null; 
    // この要素がフォーム部品（input, textarea, select等）かどうかを厳密に判定
    const isForm = string(tagName).toLowerCase() === 'input';
    // 残りの引数（...aa）だけを仕分けに回す
    const { props, children } = parseArgs(aa);
    const el = doc.createElement(tagName);

    for (let key in props) {
        if (key === 'list' && isNode(props[key])) {
            el.setAttribute('list', props[key].id);
        }
        else if (key.startsWith('on') || key in el) {
            el[key] = props[key];
        } else {
            el.setAttribute(key, props[key]);
        }
    }
    // ハック処理（number, range）
    if (numberTypes.includes(el.type)) {
        // 設定の金型（データ）
        const numProps = {
            value: { def: 0,   asNumber: true }, // value だけは独自の裏口がある
            min:   { def: -Infinity },
            max:   { def: Infinity },
            step:  { def: 1 }
        };

        // 💡 ロジックはこれだけ。名簿を回して4人分の法律を一撃で量産！
        Object.keys(numProps).forEach(prop => {
            const { def, asNumber } = numProps[prop];

            Object.defineProperty(el, prop, {
                get() {
                    if (asNumber) return isNaN(this.valueAsNumber) ? def : this.valueAsNumber;
                    const val = this.getAttribute(prop);
                    return val === null ? def : (Number(val) || 0);
                },
                set(newVal) {
                    if (asNumber) this.valueAsNumber = Number(newVal) || 0;
                    else this.setAttribute(prop, String(newVal));
                },
                configurable: true
            });

            // 💡 ループの中で、初期値の流し込み（propsチェック）まで一頭買いで処理！
            if (prop in props) el[prop] = props[prop];
        });
    }
    // ハック処理（color）
    if (el.type === 'color') {
        rgb.forEach(c => {
            Object.defineProperty(el, c, {
                get() { return color16toRGB(this.value)[c]; },
                set(newNum) {
                    const cb = color16toRGB(this.value);
                    cb[c] = Number(newNum) || 0;
                    this.value = colorRGBto16(cb.r, cb.g, cb.b);
                },
                configurable: true
            });
        });
    }
    return el.put( children);
}
// /tag();


//  input()
// 2026/06/15㈪17:04
// 👑 【スピンコントローラー内蔵版】特級inputシンジケート
// 2026/06/18㈭12:00 ver 1.3
// 2026/06/18㈭12:00 ver 1.3
const input = (() => {
    return new Proxy({}, {
        get(target, typeName) {
            return (...aa) => {
                // 📋 名簿（includes）を使って、スマートに Yes / No を判定
                const isCheck = checkTypes.includes(typeName);
                const { props, children, text } = parseArgs(aa, !isCheck);
                props.type = typeName;
                // 🧠 「有るか無いか」×「名簿に載ってるか」の超スッキリ判定ライン
                const useSpin = props.spin && numberTypes.includes(typeName);
                delete props.spin; // 特殊プロパティを間引き
                const el = tag('input', props);
                // 💡 チェックボックス・ラジオの処理
                if (isCheck) {
                    const labelEl = tag('label', el, children);
                    Object.defineProperty(labelEl, 'checked', {
                        get() { return el.checked; },
                        set(aa) { el.checked = Boolean(aa); }, // 意味なき最外殻引数 aa
                        configurable: true
                    });
                    return labelEl;
                }
                // 💡 スピンエンジンの呼び出し（条件分岐の美学）
                return useSpin ? spinEngine(el, props) : el;
            };
        }
    });
})();
// input()
// 🛠️ 独立パーツ：スピン（長押し・ホイール加速）の泥臭いイベントを完全隔離
// 2026/06/18㈭14:16 ver 1.3.1
function spinEngine(inputEl, props) {
    const hasMin = 'min' in props, hasMax = 'max' in props;
    const min = hasMin ? Number(props.min) : -Infinity;
    const max = hasMax ? Number(props.max) : Infinity;
    const defaultValue = 'value' in props ? Number(props.value) : 0;
    const baseStep = 'step' in props ? Number(props.step) : 1;

    // 司令塔となるラッパー
    const labelWrapper = tag('label'); 

    const updateValue = (amount) => {
        inputEl.value = Math.max(min, Math.min(max, inputEl.value + amount));
        inputEl.dispatchEvent(new Event('input'));
    };

    // 🏃‍♂️ 長押し連射エンジン
    let holdTimer = null;
    const startHold = (direction) => {
        let count = 0;
        const loop = () => {
            let delay = 200, multiplier = 1;
            if      (count > 30) { delay = 25;  multiplier = 10; }
            else if (count > 15) { delay = 50;  multiplier = 5;  }
            else if (count > 5)  { delay = 100; multiplier = 2;  }
            updateValue(direction * baseStep * multiplier);
            count++;
            holdTimer = setTimeout(loop, delay);
        };
        loop();
    };
    const stopHold = () => clearTimeout(holdTimer);

    // 👑 融合：左右のボタン（ab, bb）を消滅させ、配列ループで一撃生成＆配線！
    // 👑 融合 ＋ クラス名配備 ＋ put()
    const buttonConfigs = [
        { text: '<', dir: -1, limit: min },
        { text: '>', dir: 1,  limit: max }
    ];
    buttonConfigs.forEach(config => {
        const btn = tag('button', { textContent: config.text, type: 'button' });
        // 💡 2026/06/18㈭16:13 CSSで見た目を改造するためのクラス名を刻印
        btn.classList.add('spinButton');
        
        btn.on('mousedown', e => {
            if (e.button === 0) {
                stopHold();
                startHold(config.dir);
            }
        })
        .on('mouseup', stopHold)
        .on('mouseleave', stopHold)
        .on('contextmenu', e => { 
            e.preventDefault(); 
            updateValue(config.limit - (parseFloat(inputEl.value) || 0)); 
        })
        .on('mousedown', e => {
            if (e.button === 1) {
                e.preventDefault();
                inputEl.value = defaultValue;
                inputEl.dispatchEvent(new Event('input')); }
        });
        if (config.dir === -1) {
            labelWrapper.put(btn, inputEl);
        } else {
            labelWrapper.put(btn);
        }
    });
    // 🎡 マウスホイールエンジン（インプット本体への配線）
    let wheelTimer = null, wheelCount = 0;
    inputEl.on('mousedown', e => {
        if (e.button === 1) {
            e.preventDefault();
            inputEl.value = defaultValue;
            inputEl.dispatchEvent(new Event('input')); }
    })
    .on('wheel', e => {
        e.preventDefault();
        clearTimeout(wheelTimer);
        let multiplier = wheelCount > 12 ? 10 : wheelCount > 6 ? 5 : wheelCount > 2 ? 2 : 1;
        updateValue((e.deltaY < 0 ? 1 : -1) * baseStep * multiplier);
        wheelCount++;
        wheelTimer = setTimeout(() => { wheelCount = 0; }, 150);
    }, { passive: false });

    // 司令塔（label）のプロキシ設定
    Object.defineProperty(labelWrapper, 'value', {
        get() { return inputEl.value; },
        set(newVal) {
            inputEl.value = newVal;
            inputEl.dispatchEvent(new Event('input'));
        },
        configurable: true
    });

    return labelWrapper;
}
//  /spinEngine()

// element.on();
// 2026/06/21㈰6:15 ver 1.4 ＠ChatGPT
// 2026/06/21㈰6:27 ver 1.4.1
Object.defineProperty(Node.prototype, 'on', {
    value(type, listener, options) {
        this.addEventListener(type, listener, options);
        return this;
    },
    enumerable: false
});

//  element.put( ...children)
//  2026/06/15㈪17:31
//  2026/06/21㈰9:36 ver 1.5
Object.defineProperty(Element.prototype, 'put', {
    value: function(...aa) {
        const { children } = parseArgs(aa);
        children.forEach(ba => {
            if (isString(ba) || isNumber(ba))
                this.appendChild(doc.createTextNode(string(ba)));
            else if (isNode(ba))
                this.appendChild(ba);
        });
        return this;
    },
    enumerable: false,
    configurable: true
});

//// 2026/06/14㈰＠Google AI
//      おそらくよく使うタグ一覧        //////////////////////////////////////////////
/* 
const       = (...aa) => tag('',     ...aa);
*/
const header    = (...aa) => tag('header',   ...aa);
const footer    = (...aa) => tag('footer',   ...aa);
const main      = (...aa) => tag('main',     ...aa);
const artcile   = (...aa) => tag('article',  ...aa);
const section   = (...aa) => tag('section',  ...aa);
const aside     = (...aa) => tag('aside',    ...aa);
const dialog    = (...aa) => tag('dialog',   ...aa);
const menu      = (...aa) => tag('menu',     ...aa);
const nav       = (...aa) => tag('nav',      ...aa);
const div       = (...aa) => tag('div',      ...aa);
const span      = (...aa) => tag('span',     ...aa);
const p         = (...aa) => tag('p',        ...aa);
const br        = (...aa) => tag('br',       ...aa);
const ol        = (...aa) => tag('ol',       ...aa);
const ul        = (...aa) => tag('ul',       ...aa);
const li        = (...aa) => tag('li',       ...aa);
const table     = (...aa) => tag('table',    ...aa);
const tr        = (...aa) => tag('tr',       ...aa);
const th        = (...aa) => tag('th',       ...aa);
const td        = (...aa) => tag('td',       ...aa);
const form      = (...aa) => tag('form',     ...aa);
const fieldset  = (...aa) => tag('fieldset', ...aa);
const legend    = (...aa) => tag('legend',   ...aa);
const pre       = (...aa) => tag('pre',      ...aa);
const code      = (...aa) => tag('code',     ...aa);
const button    = (...aa) => tag('button',   ...aa);
const select    = (...aa) => tag('select',   ...aa);
const option    = (...aa) => tag('option',   ...aa);
const optgroup  = (...aa) => tag('optgroup', ...aa);
const textarea  = (...aa) => tag('textarea', ...aa);
const datalist  = (...aa) => {
    const { props, children } = parseArgs(aa);
    // 💡 もし「時間被り」すら鉄壁ガードしたいなら、今のブラウザ標準のこれ！
    props.id = props.id || string('id-', crypto.randomUUID());
    return tag('datalist', props, children);
};

function body(...aa) { doc.body.put(...aa); }



// 互換性・対称性完全防壁仕様
Object.defineProperty(String.prototype, 'convertBase', {
    value: function(aa, ab = 10, ac = 0) {
        const ba = parseInt(this, aa).toString(ab).padStart(ac, '0');
        // 🚀 10進数、かつ0埋めなしなら、文字の服を脱がせて「数字」で返す！
        return (ab === 10 && ac === 0) ? Number(ba) : ba;
    },
    enumerable: false
});
Object.defineProperty(Number.prototype, 'convertBase', {
    value: function(aa = 10, ab, ac = 0) {
        const ba = aa === 10 ? ab : aa;
        const bb = aa === 10 ? ac : ab || 0;
        const bc = parseInt(this.toString(10), 10).toString(ba).padStart(bb, '0');
        // 🚀 数字版も全く同じ法律で、10進数・0埋めなしなら「数字」へ！
        return (ba === 10 && bb === 0) ? Number(bc) : bc;
    },
    enumerable: false
});


//  🎲 乱数関数
function random( n){    return Math.floor( Math.random() * n);  }

//      Array関数         //////////////////////////////////////////////////////////////////////////////
// ➕ 配列の合計 (sum)
// 現代の reduce メソッドを使い、ループなしで1行で合計します。
Object.defineProperty( Array.prototype, 'sum', {
    value: function(){
        return this.reduce(( aa, ab) => aa + ( isNumber( ab)? ab : 0), 0);
    },
    enumerable: false
});
// 配列の平均値 (mean)
// 上記の sum() を使い、要素数で割るだけのスマート設計。
Object.defineProperty( Array.prototype, 'mean', {
    value: function(){
        return this.length? this.sum() / this.length : 0;  
    },
    enumerable: false
});
Object.defineProperty( Array.prototype, 'shuffle', {
    value: function() {
        for (let i = this.length - 1; i > 0; i--) {
            const aa = random(i + 1);
            [this[i], this[aa]] = [this[aa], this[i]];
        }
        return this;
    },
    enumerable: false
});
//  中身をクリア。
Object.defineProperty( Array.prototype, 'clear', {
    value: function() { this.length = 0; },
    enumerable: false
});
//      Number          //////////////////////////////////////////////////////////////
// 2026/06/17㈬ 21:40
// 引数0個なら 0~100 / 1個なら 0~指定数 / 2個ならその間（逆転対応）
// 2026/06/17㈬ 22:50 ver 1.1
Object.defineProperty(Number.prototype, 'clamp', {
    value: function(aa = 100, ab = 0) {
        return Math.max(Math.min(aa, ab), Math.min(Math.max(aa, ab), this));
    },
    enumerable: false
});
//      color            ////////////////////////////////////////////////////////////////
// 2026/06/18㈭ 09:27
// 🛠️ 補助関数：どんな色表現も 100% "rgb(r,g,b)" に統一する水際対策マシーン
function styleColor(aa) {
    const ab = div();
    ab.style.color = aa;
    // 🛑 色として成立していないゴミ文字列なら false を返して即終了
    if (!ab.style.color) return false;
    // ✨ 合格なら一瞬だけ実体化させてブラウザの本音（rgb）を暴く
    body(ab);
    const result = getComputedStyle(ab).color;
    ab.remove();
    return result;
}
// 2026/06/18㈭ 05:35
// どこを書き換えても全てが連動する、カラーオブジェクト
// 2026/06/18㈭ 10:20 ver 1.2
// 系統：万能カラーオブジェクト（意味なき変数 ab 襲名仕様）
function color(r, g, b) {
    const _rgb = { r: 0, g: 0, b: 0 };
    const rc = aa => isNumber(aa) ? Math.floor(aa).clamp(255) : 0;
    const st = div().style;
    const setRGB = (...aa) => {
        rgb.forEach((c, i) => _rgb[c] = rc(aa[i]));
        st.color = string('rgb(', rgb.map(c => _rgb[c]).join(','), ')');
    };
    const setHex = (aa) => {
        const ab = styleColor(aa);
        setRGB(...(ab ? ab.match(/\d+/g) : [0,0,0]).map(Number));
    };
    if (isString(r)) setHex(r);
    else if (r !== undefined) setRGB(r, g || 0, b || 0);
    else setRGB(0, 0, 0);
    const res = {
        get hex() { return string('#', rgb.map(c => _rgb[c].convertBase(16, 2))); },
        set hex(aa) { setHex(aa); },
        get css() { return st.color; },
        set css(aa) { setHex(aa); }
    };
    rgb.forEach(c => {
        Object.defineProperty(res, c, {
            get: () => _rgb[c],
            set: (aa) => {
                _rgb[c] = rc(aa);
                setRGB(_rgb.r, _rgb.g, _rgb.b);
            },
            configurable: true,
            enumerable: true
        });
    });
    return res;
}
function color16toRGB( hex = '#000000') {
    // 💡 3桁（#fffなど）を6桁に拡張
    const cleaned = hex.length === 4 ? hex.replace(/([0-9a-f])/gi, '$1$1') : hex;
    const match = cleaned.match(/[0-9a-f]{2}/gi);
    if (!match) return null; 
// 1. 各色の数字（Number型）の配列を作る
    const [r, g, b] = match.map(h => h.convertBase(16, 10));
// 👑 2. テンプレートリテラルを追放！ブラウザに色を塗って、その「塗られた服の文字列」をそのまま剥ぎ取る！
    const el = div();
    el.style.color = hex;
    const css = el.style.color; // 👈 ここでブラウザが勝手に作った「rgb(r, g, b)」が手に入る！
    return { r, g, b, css };
}
function colorRGBto16(r = 0, g = 0, b = 0) {
    // 💡 第一引数に '#' を置き、第二引数に map の結果（配列）をそのまま並べる！
    return string('#', [r, g, b].map(c => Math.max(0, Math.min(255, Math.round(c))).convertBase(16, 2)));
}


function addLoadEvent( func){
    win.addEventListener('DOMContentLoaded', func);
}


/**
 * 💡 魂の id() 関数
 * 2000年代の手癖のまま、超高速に要素を取得・キャッシュします。
 */
function id( name) {
    // 🔍 1. まずはIDで一本釣り
    let current = doc.getElementById(name);
    // 🔍 2. IDで見つからなければ、Name属性（ラジオボタン等）としてまとめて捕獲
    if (!current) {
        current = elements(`input[name="${name}"]`);
        // 何も見つからなければ、この時点で NodeList が空（length === 0）になる
        if (current.length === 0) current = null; 
    }    
    // 🛡️ 3. どこを探しても完全に見つからなかったら撤退
    if (!current) return false;
    // ----------------------------------------------------
    // 🔢 【新機能】type="number"と"range" だった場合の数字型ハック    2026/06/08（月）
    // ----------------------------------------------------
    if ((current.type === 'number' || current.type === 'range') && !current.hasOwnProperty('_hacked')) {
        Object.defineProperty(current, 'value', {
            get() {
                const val = this.valueAsNumber;
                return isNaN(val) ? 0 : val; // 空っぽやバグった時は安全に 0 を返す
            },
            set(newVal) {
                this.valueAsNumber = Number(newVal) || 0;
            }
        });
        current._hacked = true;
    }
    // ----------------------------------------------------
    // 🎨 【新機能】type="color" だった場合、.r .g .b でナマの数字を返す！
    // ----------------------------------------------------
    if (current.type === 'color' && !current.hasOwnProperty('_hacked')) {
        // 🚀 .r, .g, .b というプロパティをカラーピッカーに裏から無理やり増設する
        rgb.forEach(c => {
            Object.defineProperty(current, c, {
                get() {
                    // カラーピッカーの今の 16進数（#ff0000など）を RGB に分解して、狙った色だけを数字で返す
                    const hex = color16toRGB(this.value);
                    return hex[c]; // 255 や 0 がそのまま飛び出す！
                },
                // 📤 値を代入するとき（set）：他の2色と合流して本尊の .value を直撃！
                set(newNum) {
                    // ① まず、今のカラーピッカーの他の色（R,G,B）を全員回収する
                    const currentRGB = color16toRGB(this.value);
                    // ② 今代入された新しい数字（0〜255）で、狙ったチャンネルだけを上書き
                    currentRGB[c] = Number(newNum) || 0;
                    // ③ 3色が揃ったので、16進数に一発変換して本尊の「.value」に叩き込む！
                    this.value = colorRGBto16(currentRGB.r, currentRGB.g, currentRGB.b);
                }
            });
        });
        current._hacked = true;
    }
    // ----------------------------------------------------
    // 🧙‍♂️ 【既存】ラジオボタン（NodeList）の時のチェック連動魔法
    // ----------------------------------------------------
    if (current instanceof NodeList && current.length > 0) {
        Object.defineProperty(current, 'value', {
            get: () => doc.querySelector(`input[name="${name}"]:checked`)?.value,
            set: (v) => {
                if (v) {
                    const target = doc.querySelector(`input[name="${name}"][value="${v}"]`);
                    if (target) target.checked = !!v;
                } else {
                    const targets = doc.querySelectorAll(`input[name="${name}"]`);
                    if (targets) {
                        targets.forEach((radio) => { radio.checked = false; });
                    }
                }
            },
            configurable: true
        });
        current.addEventListener = function(type, listener, options) {
            current.forEach(el => el.addEventListener(type, listener, options));
        };
    }

    // 🎁 4. 極上に仕上がった要素（またはNodeList）を返す
    return current;
}

//doc.body.appendChild( doc.createElement( 'address')).textContent = '©2001 - 2026 Crazy Sun Corporation, All Rights Reserved.';

