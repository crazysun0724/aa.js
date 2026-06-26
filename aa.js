//aa.js
const aa = {
    version: '0.16.1',
    date: '2026/06/26 21:15',
    status: 1,
    state: {
        1: 'developing',
        2: 'experimental',
        3: 'beta'
    },
    log(){
        if (!this.status) return;
        log(`aa.js ver${this.version}-${this.state[this.status]}`);
        log( new Date());
    }
};
aa.log();
const win = window;
const doc = document;
const _rgb = ['r', 'g', 'b'];

function element( aa, ab = doc){ return ab.querySelector(aa);   }
function elements(aa, ab = doc){ return ab.querySelectorAll(aa);}

//⚠️メモリ汚染を防ぐため使い回す作業台
const _palette = {
    set(aa){
        this.x.fillStyle = '#000000';
        this.y.color = ''; // 初期化
        this.y.color = aa;
        if( this.y.color === '') return false;
        this.x.fillStyle = this.y.color;
        this.y.color = this.x.fillStyle;
        return this.y.color !== '';
    },
    get hex(){ return this.x.fillStyle; },
    get css(){ return this.y.color; },
    get z  (){ return this._z || (this._z = tag('canvas')); },
    get x  (){ return this._x || (this._x = this.z.getContext('2d')); },
    get y  (){ return this._y || (this._y = this.z.style); }
};
// 新しいinput typeが増えたら、この配列に文字列を足す
const checkTypes = ['checkbox', 'radio'];
const numberTypes  = ['number', 'range'];

function log(aa){ console.log( aa);   }

function isArray( aa){ return Array.isArray(aa); }
function isString(aa){ return typeof aa === 'string'; }
function isNumber(aa){ return typeof aa === 'number' && !Number.isNaN(aa); }
function isNode(  aa){ return aa instanceof Node; }
function isObject(aa){ return typeof aa === 'object' && aa !== null && !isArray(aa) && !isNode(aa); }

function isBlank( aa){ return aa === ''; }
function isNull(  aa){ return aa === null || aa === undefined; }
function isColor( aa){ return _palette.set(aa); }

function array(...aa){
    if (!aa.length) return [];
    // 💡 引数が1つだけで、それが配列なら、そのままナマで返す
    if (aa.length === 1 && isArray(aa[0])) return aa[0];
    let res = [];
    aa.forEach(ba => {
        if (isObject(ba)){
            // 🔪 1階層目だけ Object.entries() でバラして、そのまま res に叩き込む
            // 中身がオブジェクトだろうが配列だろうが、これ以上は追わない（再帰なし）
            for (let [bb, bc] of Object.entries(ba)){
                res.push(bb, bc);
            }
        } else {
            // 配列や文字列、数字、Nodeならそのまま突っ込む
            res.push(ba);
        }
    });
    return res;
}
function object(...aa){
    if (!aa.length) return {};
    if (aa.length === 1 && isObject(aa[0])) return aa[0];
    const res = {};
    let count = 0;
    function countUp(ba){
        while (count in res) count++;
        res[count++] = ba;
    }
    aa.forEach(ba => {
        if (ba === null || ba === undefined) return;
        if (isObject(ba)){ Object.assign(res, ba);
        } else if (isString(ba)){
            ba.split(',').forEach(ca => {
                const item = ca.trim();
                if (!item) return;
                if (!item.includes(':')){ return countUp(item); 
                }
                const [key, ...cb] = item.split(':').map(cc => cc.trim()); 
                let val = string(cb);
                val = isNumber(Number(val)) ? number(val) : val;
                if (!key){ if (val){ countUp(val); }
                } else if (!val){ res[key] = string();
                } else { res[key] = val;
                }
            });
        } else { countUp(ba);
        }
    });
    return res;
}
function string(...aa){
    if( !aa.length) return '';
    let res = [];
    aa.forEach(ba => {
         if (isString(ba)) res.push( ba);
    else if (isNumber(ba)) res.push( String( ba));
    else if (isArray( ba)) res.push( string(...ba));
    else if (isObject(ba)){
            for (let [bb, bc] of Object.entries(ba)) res.push( string(bb, bc));
        }
    });
    return res.join('');
}
function number(...aa){
    if (!aa.length) return 0;
    let res = [];
    aa.forEach(ba => {
        if (isNumber(ba)){ res.push(ba);
        } else if (isString(ba)){
            const bb = ba.match(/-?\d+/g) || [];
            if (bb.length) { res.push(...bb.map(Number)); }
            const bc = ba.replace(/-?\d+/g, '');
            if (bc) {
                let ca = 0;
                for (let i = 0; i < bc.length; i++) { ca += bc.charCodeAt(i); }
                res.push(ca);
            }
        } else if (isArray(ba)){
            res.push(number(...ba));
        } else if (isObject(ba)){
            for (let [bb, bc] of Object.entries(ba)){ res.push(number(bb, bc)); }
        }
    });
    return res.sum();
}

function color(...aa) {
  const rgb = { r: 0, g: 0, b: 0 };
  const setPalette = () => _palette.set(`rgb(${rgb.r},${rgb.g},${rgb.b})`);
    const res = {};
    _rgb.forEach(c => {
        Object.defineProperty(res, c, {
            get: () => rgb[c],
            set: (val) => rgb[c] = number(val),
            enumerable: true
        });
    });
    Object.defineProperties(res, {
        hex: { get() { setPalette(); return _palette.hex; } },
        css: { get() { setPalette(); return _palette.css; } }
    });
    res.set = (...ba) => {
        const l = ba.length;
        if (l === 3 && isNumber(ba[0]) && isNumber(ba[1]) && isNumber(ba[2])) {
            _rgb.forEach((c, i) => rgb[c] = ba[i]);
        } else if (l > 0) {
            let isFirst = true;
            ba.forEach(ca => {
                let t; // 💡 一時的なRGBを「配列」として確保する器
                if(!ca) t = [0,0,0];
                else if (_palette.set(String(ca))) {
                    t = (_palette.css.match(/\d+/g) || [0,0,0]).map(Number);
                } else {
                    const seed = number(ca) % 65535;
                    t = [(seed * 7) % 256, (seed * 13) % 256, (seed * 17) % 256];
                }
                _rgb.forEach((c, i) => rgb[c] = isFirst ? t[i] : Math.round((rgb[c] + t[i]) / 2));            
                isFirst = false;
            });
        }
        return res;
    }
    res.set(...aa);
    return res;
}
function parseArgs(aa){
    let props    = {};
    let children = [];
    aa.forEach(ba => {
        if (isObject(ba)){ Object.assign(props, ba);
        } else if (isArray(ba)){ children.push(...ba);
        } else if (isNode(ba) || isNumber(ba) || isString(ba)){
            children.push(ba);
        }
    });
    return { props, children };
}


// ==============================================================================
function tag(tagName, ...aa){
    if (!isString(tagName)) return null; 
    const { props, children } = parseArgs(aa);
    const el = doc.createElement(tagName);
    // プロパティの流し込み（属性・イベント・通常プロパティ）
    Object.keys(props).forEach(key => {
        const val = props[key];
        if (key === 'list' && isNode(val)){
            el.setAttribute('list', val.id);
        } else if (key.startsWith('on') || key in el){
            el[key] = val;
        } else { el.setAttribute(key, val);
        }
    });
    return el.put(...children);
}// /tag();

const input = (() => {
    return new Proxy({}, {
        get(target, typeName){
            return (...aa) => {
                const { props, children } = parseArgs(aa);
                props.type = typeName;
                const isNumberType = numberTypes.includes(typeName);
                const useSpin = props.spin && isNumberType;
                delete props.spin; // 特殊プロパティを間引き
                // 1. ベースとなる input 要素を生成
                const el = tag('input', props);
                // 2. type="number" または "range"
                if (isNumberType){
                    const numProps = {
                        value:{ def: 0, asNumber: true },
                        min  :{ def: -Infinity },
                        max  :{ def: Infinity },
                        step :{ def: 1 }
                    };
                    Object.keys(numProps).forEach(prop => {
                        const { def, asNumber } = numProps[prop];
                        Object.defineProperty(el, prop, {
                            get(){
                                if (asNumber) return isNaN(this.valueAsNumber) ? def : this.valueAsNumber;
                                const val = this.getAttribute(prop);
                                return val === null ? def : (Number(val) || 0);
                            },
                            set(newVal){
                                if (asNumber) this.valueAsNumber = Number(newVal) || 0;
                                else this.setAttribute(prop, String(newVal));
                            },
                            configurable: true
                        });
                        if (prop in props) el[prop] = props[prop];
                    });
                } else if (typeName === 'color'){
                    const ba = color(el.value);
                    // 👑 ブラウザが持っている「本来の value の（ゲッター/セッター）」を盗み出す
                    const nativeValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value');
                    // 💡 el 自身の value を乗っ取る
                    Object.defineProperty(el, 'value', {
                        get() { 
                            // 値を返す時は本来の挙動
                            return nativeValue.get.call(this);
                        },
                        set(val) {
                            // 1. まず内部の魂（r, g, b）を最新の色で上書きする
                            ba.set(val);
                            // 2. その後、ブラウザ本来の機能を使って画面を正規化された色で更新する
                            nativeValue.set.call(this, ba.hex);
                        },
                        configurable: true
                    });
                    _rgb.forEach(c => {
                        Object.defineProperty(el, c, {
                            get: () => ba[c], 
                            set: (ca) => {
                                ba[c] = number(ca);
                                // 💡 r,g,bが弄られた時も、本来の value の機能を使って画面だけ更新
                                nativeValue.set.call(el, ba.hex);
                            },
                            configurable: true
                        });
                        if (c in props) el[c] = props[c];
                    });
                    el.on('input', function(){
                        // UIからピッカーがドラッグされた時の逆流
                        ba.set(nativeValue.get.call(this));
                    });
                } else if (checkTypes.includes(typeName)){
                    const labelEl = label( el, ...children);
                    Object.defineProperty(labelEl, 'checked', {
                        get(){ return el.checked; },
                        set(val){ el.checked = Boolean(val); },
                        configurable: true
                    });
                    return labelEl;
                }
                return useSpin ? spinEngine(el, props) : el;
            };
        }
    });
})();// input()

function spinEngine(inputEl, props){
    const hasMin = 'min' in props, hasMax = 'max' in props;
    const min = hasMin ? Number(props.min) : -Infinity;
    const max = hasMax ? Number(props.max) : Infinity;
    const defaultValue = 'value' in props ? Number(props.value) : 0;
    const baseStep = 'step' in props ? Number(props.step) : 1;
    // 司令塔となるラッパー
    const labelWrapper = label(); 
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
            if      (count > 30){ delay =  25; multiplier = 10; }
            else if (count > 15){ delay =  50; multiplier =  5; }
            else if (count >  5){ delay = 100; multiplier =  2; }
            updateValue(direction * baseStep * multiplier);
            count++;
            holdTimer = setTimeout(loop, delay);
        };
        loop();
    };
    const stopHold = () => clearTimeout(holdTimer);
    const buttonConfigs = [
        { text: '<', dir: -1, limit: min },
        { text: '>', dir: 1,  limit: max }
    ];
    buttonConfigs.forEach(config => {
        const btn = tag('button', { textContent: config.text, type: 'button' });
        btn.classList.add('spinButton');
        btn.on('mousedown', e => {
            if (e.button === 0){
                stopHold();
                startHold(config.dir);
            } else if (e.button === 1){
                e.preventDefault();
                inputEl.value = defaultValue;
                inputEl.dispatchEvent(new Event('input'));
            }
        })
        .on('mouseup', stopHold)
        .on('mouseleave', stopHold)
        .on('contextmenu', e => { 
            e.preventDefault(); 
            updateValue(config.limit - (parseFloat(inputEl.value) || 0)); 
        });
        if (config.dir === -1){
            labelWrapper.put(btn, inputEl);
        } else {
            labelWrapper.put(btn);
        }
    });
    // 🎡 マウスホイールエンジン（インプット本体への配線）
    let wheelTimer = null, wheelCount = 0;
    inputEl.on('mousedown', e => {
        if (e.button === 1){
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
    Object.defineProperty(labelWrapper, 'value', {
        get(){ return inputEl.value; },
        set(newVal){
            inputEl.value = newVal;
            inputEl.dispatchEvent(new Event('input'));
        },
        configurable: true
    });
    return labelWrapper;
}//  /spinEngine()

Object.defineProperty(Node.prototype, 'on', {
    value(aa, ab, ac){
        this.addEventListener(aa, ab, ac);
        return this;
    },
    enumerable: false
});
Object.defineProperty(Element.prototype, 'put', {
    value(...aa){
        const { children } = parseArgs(aa);
        this.append(...children);         
        return this;
    },
    enumerable: false
});
Object.defineProperty(Element.prototype, 'element', {
    value(aa){ return element( aa, this); },
    enumerable: false,
});
Object.defineProperty(Element.prototype, 'elements', {
    value(aa){ return elements( aa, this); },
    enumerable: false,
});
Object.defineProperty(Element.prototype, 'deStyle', {
    value(prop){
        if (prop){ this.style[prop] = '';
        } else {   this.removeAttribute('style');
        }
        return this;
    },
    enumerable: false
});
Object.defineProperty(String.prototype, 'convertBase', {
    value( aa, ab = 10, ac = 0){
        const ba = parseInt(this, aa).toString(ab).padStart(ac, '0');
        return (ab === 10 && ac === 0) ? Number(ba) : ba;
    },
    enumerable: false
});
Object.defineProperty(Number.prototype, 'convertBase', {
    value( aa = 10, ab, ac = 0){
        const ba = aa === 10 ? ab : aa;
        const bb = aa === 10 ? ac : ab || 0;
        const bc = parseInt(this.toString(10), 10).toString(ba).padStart(bb, '0');
        return (ba === 10 && bb === 0) ? Number(bc) : bc;
    },
    enumerable: false
});

//  🎲 乱数関数
function random( n){ return Math.floor( Math.random() * n); }

//      Array関数         //////////////////////////////////////////////////////////////////////////////
// ➕ 配列の合計 (sum)
Object.defineProperty( Array.prototype, 'sum', {
    value(){
        return this.reduce(( aa, ab) => aa + (isNumber( ab)? ab : 0), 0);
    },
    enumerable: false
});
// 配列の平均値 (mean)
Object.defineProperty( Array.prototype, 'mean', {
    value(){
        return this.length? this.sum() / this.length : 0;  
    },
    enumerable: false
});
Object.defineProperty( Array.prototype, 'shuffle', {
    value(){
        for (let i = this.length - 1; i > 0; i--){
            const aa = random(i + 1);
            [this[i], this[aa]] = [this[aa], this[i]];
        }
        return this;
    },
    enumerable: false
});
//  中身をクリア。
Object.defineProperty( Array.prototype, 'clear', {
    value(){ this.length = 0; },
    enumerable: false
});
//      Number
// 引数0個なら 0~100 / 1個なら 0~指定数 / 2個ならその間（逆転対応）
Object.defineProperty(Number.prototype, 'clamp', {
    value(aa = 100, ab = 0){
        return Math.max(Math.min(aa, ab), Math.min(Math.max(aa, ab), this));
    },
    enumerable: false
});


function addLoadEvent(func) {
    if (doc.readyState !== 'loading') { func(); return; }
    win.addEventListener('DOMContentLoaded', func);
}
//      おそらくよく使うタグ一覧        //
/* 
const       = (...aa) => tag('',     ...aa);
*/
const header   = (...aa) => tag('header',   ...aa);
const footer   = (...aa) => tag('footer',   ...aa);
const main     = (...aa) => tag('main',     ...aa);
const article  = (...aa) => tag('article',  ...aa);
const section  = (...aa) => tag('section',  ...aa);
const aside    = (...aa) => tag('aside',    ...aa);
const dialog   = (...aa) => tag('dialog',   ...aa);
const menu     = (...aa) => tag('menu',     ...aa);
const nav      = (...aa) => tag('nav',      ...aa);
const div      = (...aa) => tag('div',      ...aa);
const span     = (...aa) => tag('span',     ...aa);
const p        = (...aa) => tag('p',        ...aa);
const br       = (...aa) => tag('br',       ...aa);
const hr       = (...aa) => tag('hr',       ...aa);
const ol       = (...aa) => tag('ol',       ...aa);
const ul       = (...aa) => tag('ul',       ...aa);
const li       = (...aa) => tag('li',       ...aa);
const table    = (...aa) => tag('table',    ...aa);
const tr       = (...aa) => tag('tr',       ...aa);
const th       = (...aa) => tag('th',       ...aa);
const td       = (...aa) => tag('td',       ...aa);
const form     = (...aa) => tag('form',     ...aa);
const fieldset = (...aa) => tag('fieldset', ...aa);
const legend   = (...aa) => tag('legend',   ...aa);
const label    = (...aa) => tag('label',    ...aa);
const pre      = (...aa) => tag('pre',      ...aa);
const code     = (...aa) => tag('code',     ...aa);
const button   = (...aa) => tag('button',   ...aa);
const select   = (...aa) => tag('select',   ...aa);
const option   = (...aa) => tag('option',   ...aa);
const optgroup = (...aa) => tag('optgroup', ...aa);
const textarea = (...aa) => tag('textarea', ...aa);
const datalist = (...aa) => {
    const { props, children } = parseArgs(aa);
    props.id = props.id || string('id-', crypto.randomUUID());
    return tag('datalist', props, children);
};

function body(...aa){ doc.body.put(...aa); }
