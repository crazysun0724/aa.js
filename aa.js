//aa.js
const aa = 'aa.js';
const win = window;
const doc = document;


Object.defineProperty(Node.prototype,'on',{
    value(aa,ab,ac){
        this.addEventListener(aa,ab,ac);
        return this;
    },
    enumerable:false
});
Object.defineProperty(Element.prototype,'emit',{
    value(e){
        this.dispatchEvent(e);
//        this.dispatchEvent(new Event(aa,{ bubbles: true }));
        return this;
    },
    enumerable:false
});
Object.defineProperty(Element.prototype,'put',{
    value(...aa){
        const { children } = parseArgs(aa);
        this.append(...children);         
        return this;
    },
    enumerable:false
});
Object.defineProperty(Element.prototype,'element' ,{
    value(aa){ return element(aa,this); },
    enumerable:false
});
Object.defineProperty(Element.prototype,'elements',{
    value(aa){ return elements(aa,this); },
    enumerable:false
});
Object.defineProperty(Element.prototype,'getValue',{
    value(aa){ return getValue(this,aa); },
    enumerable:false
});
Object.defineProperty(Element.prototype,'attr',{
    value(aa,ab){
        if(arguments.length === 0) return null;
        if(arguments.length === 1) return this.getAttribute(aa);
        if(isNull(ab)) this.removeAttribute(aa);
        else this.setAttribute(aa,String(ab));
        return this;
    },
    configurable: true,
    enumerable: false
});
Object.defineProperty(Element.prototype,'diStyle',{
    value(prop){
        if(prop) this.style[prop] = '';
        else     this.attr('style',null);
        return   this;
    },
    enumerable:false
});
Object.defineProperty(String.prototype,'toBase',{
    value(aa = 36,ab = 10,ac = 0){
        const ba = parseInt(this,aa);
        if (isNaN(ba)) return ba;
        const res = ba.toString(ab).padStart(ac,'0');
        return (ab === 10 && ac === 0)? Number(res) : res;
    },
    enumerable: false
});
Object.defineProperty(Number.prototype,'toBase',{
    value(aa = 36,ab,ac = 0){
        if (isNaN(this)) return NaN;
        // 引数が2個以上ある時だけ、aa===10を「10進数からの明示的な変換元指定」として扱う
        const isDec = arguments.length >= 2 && aa === 10;
        const ba = isDec? (ab || 36) : aa;
        const bb = isDec? ac : (ab || 0);
        const bc = Math.trunc(this).toString(ba).padStart(bb,'0');
        return (ba === 10 && bb === 0)? Number(bc) : bc;
    },
    enumerable: false
});

function random(n){ return Math.floor(Math.random() * n); }

Object.defineProperty(Array.prototype,'sum',{
    value(){
        return this.reduce((aa,ab) => aa + (isNumber(ab)? ab : 0),0);
    },
    enumerable:false
});
Object.defineProperty(Array.prototype,'mean',{
    value(){
        return this.length? this.sum() / this.length : 0;  
    },
    enumerable:false
});
Object.defineProperty(Array.prototype,'shuffle',{
    value(){
        for(let i = this.length - 1; i > 0; i--){
            const aa = random(i + 1);
            [this[i],this[aa]] = [this[aa],this[i]];
        }
        return this;
    },
    enumerable:false
});
Object.defineProperty(Array.prototype,'clear',{
    value(){ this.length = 0; },
    enumerable:false
});
Object.defineProperty(Number.prototype,'clamp',{
    value(aa = 100,ab = 0){
        return Math.max(Math.min(aa,ab),Math.min(Math.max(aa,ab),this));
    },
    enumerable:false
});
Object.defineProperty(HTMLInputElement.prototype,'number',{
    get(){ return this.valueAsNumber; },
    set(aa){ this.valueAsNumber = aa; },
    configurable:true,
    enumerable: false
});
Object.defineProperty(Storage.prototype,'item',{
    value(key,val){
        if(arguments.length === 1){
            const res = this.getItem(key);
            try{ return JSON.parse(res); }catch{ return res; }
        }else if(isNull(val)){
            this.removeItem(key);
        }else{
            this.setItem(key,isObject(val)? JSON.stringify(val) : val);
        }
    },
    configurable:true,
    enumerable: false
});


function isOsLight(){
    return win.matchMedia && win.matchMedia(`(prefers-color-scheme: light)`).matches;
}
function isLight(){
    const aa = doc.body.style.colorScheme;
    return aa === 'light' || (aa !== 'dark' && isOsLight());
}
function switchDark(aa){
    doc.body.style.colorScheme = aa? aa : (isLight()? 'dark' : 'light');
}

const _rgb = ['r','g','b'];
const _tags = [
    'header','footer','main','article','section','aside','dialog','menu','nav',
    'div','span','p','a','br','hr','ol','ul','li','b',
    'table','tr','th','td','dl','dd','dt',
    'form','fieldset','legend','label','pre','code','button',
    'select','datalist','option','optgroup','textarea',
    'h1','h2','h3','h4','h5','h6',
    'details','summary'
];
win.tags = Object.fromEntries(
    _tags.map(name => [name, (...aa) => tag(name, ...aa)])
);
// win (window) 直下にすべて展開
Object.assign(win, win.tags);

const _checkTypes = ['checkbox', 'radio'];
const _numberTypes  = ['number', 'range'];
const _numberDefaults = {
    'number':{ number: 0,min:-Infinity,max: Infinity,step: 1 },
    'range' :{ number: 0,min: 0,       max: 100,     step: 1 }
};

function element( aa,ab = doc){ return ab.querySelector(aa);   }
function elements(aa,ab = doc){ return ab.querySelectorAll(aa);}
function id(aa){ return doc.getElementById(aa); }
function toElement(aa){
    if(isNode(  aa)) return aa;
    if(isString(aa)) return id(aa) || element(aa);
    return null;
}
function toBit(aa){ return aa? 1 : 0; }
const _palette = {
    set(aa){
        this.x.fillStyle = '#000000';
        this.y.color = '';
        this.y.color = aa;
        if(isBlank(this.y.color)) return false;
        this.x.fillStyle = this.y.color;
        this.y.color = this.x.fillStyle;
        return this.y.color !== '';
    },
    get hex(){ return this.x.fillStyle; },
    get css(){ return this.y.color;     },
    get  z (){ return this._z ||= tag('canvas');},
    get  x (){ return this._x ||= this.z.getContext('2d'); },
    get  y (){ return this._y ||= this.z.style; }
};

function log(aa){ console.log(aa); }

function isArray( aa){ return Array.isArray(aa);      }
function isNode(  aa){ return aa instanceof Node;     }
function isString(aa){ return typeof aa === 'string'; }
function isNumber(aa){ return typeof aa === 'number' && !Number.isNaN(aa); }
function isObject(aa){ return typeof aa === 'object' && !isNull(aa) && !isArray(aa) && !isNode(aa); }

function isBlank( aa){ return aa === ''; }
function isNull(  aa){ return aa === null || aa === undefined; }
function isOne(   aa){ return aa === 1; }
function isColor( aa){ return _palette.set(aa); }

function array(...aa){
    if(!aa.length) return [];
    if(aa.length === 1 && isObject(aa[0])){
        return Object.entries(aa[0]).reduce((res,[key,val]) => {
            res.push(key, val);
            return res;
        },[]);
    }
    return aa;
}

function object(...aa) {
    if(!aa.length) return {};
    if(aa.length === 1 && isObject(aa[0])) return aa;
    return Object.fromEntries(aa.map((ba,i) => [i,ba]));
}
function string(...aa){
    return aa.reduce((res, ba) => {
        if(isString(ba) || isNumber(ba)) return res + ba;
        if(isArray(ba)) return res + string(...ba);
        if(isObject(ba)){
            return res + Object.entries(ba).reduce((str,[bb,bc]) => str + string(bb,bc),'');
        }
        return res;
    },'');
}
function number(...aa){
    return aa.reduce((sum,ba) => {
        if (isNumber(ba)) return sum + ba;
        if (isArray( ba)) return sum + number(...ba);
        if (isObject(ba)) return sum + Object.entries(ba).reduce((n,[bb,bc]) => n + number(bb,bc),0);
        if (isString(ba)){
            const regex = /-?\d+(?:\.\d+)?/g;
            const numSum = (ba.match(regex) || []).map(Number).sum();
            const remainStr = ba.replace(regex,'');
            const charSum = Array.from(remainStr).reduce((s,char) => s + char.charCodeAt(0),0);
            return sum + numSum + charSum;
        }
        return sum;
    },0);
}
function color(...aa){
    const rgb = { r:0,g:0,b:0 };
    const res = Object.defineProperties({},Object.fromEntries(_rgb.map(c => [c,{
        get:() => rgb[c],
        set:val => rgb[c] = number(val),
        enumerable: true
    }])));
    ['hex','css'].forEach(ab => {
        Object.defineProperty(res,ab,{
            get:() => {
                _palette.set(`rgb(${rgb.r},${rgb.g},${rgb.b})`);
                return _palette[ab];
            }
        });
    });
    res.set = (...ba) => {
        const l = ba.length;
        if (l === 3 && ba.every(isNumber)) {
            _rgb.forEach((c,i) => rgb[c] = ba[i]);
        }else if(l > 0){
            let isFirst = true;
            ba.forEach(ca => {
                let t;
                if(ca){
                    if(_palette.set(String(ca))){
                        t = _palette.css.match(/\d+/g).map(Number);
                    }else{
                        const seed = number(ca)%65535;
                        t = [(seed*7)%256,(seed*13)%256,(seed*17)%256];
                    }
                }
                _rgb.forEach((c,i) => rgb[c] = isFirst? t[i] : Math.round((rgb[c]+t[i])/2));
                isFirst = false;
            });
        }
        return res;
    };
    return res.set(...aa);
}
function parseArgs(aa){
    return aa.reduce((ab,ac) => {
        if(isObject(ac)) Object.assign(ab.props,ac);
   else if(isArray(ac))  ab.children.push(...ac);
   else if(isNode(ac) || isNumber(ac) || isString(ac)){
             ab.children.push(ac);
        }
        return ab;
    },{ props:{},children:[] });
}
const makeId = () => string('id-',crypto.randomUUID());
function tag(tagName,...aa){
    if(!isString(tagName)) return null;
    const { props,children } = parseArgs(aa);
    const el = doc.createElement(tagName);
    if(tagName === 'label'){
        ['mousedown','mouseup','mouseover','mouseout'].forEach(ev => {
            el.on(ev, e => {
                const target = el.control;
                if(target && e.target !== target){
                    target.emit(new MouseEvent(ev,e));
                }
            });
        });
    }
    for(const [key,val] of Object.entries(props)){
        if(isNode(val) && (key === 'list' || (tagName === 'label' && key === 'for'))){
            val.id ||= makeId();
            el.attr(key,val.id);
        }else if(key.startsWith('on') || key in el) el[key] = val;
        else el.attr(key,val);
    }
    return el.put(...children);
}// /tag();
const input = (() => {
    return new Proxy({},{
        get(target,typeName){
            return (...aa) => {
                const { props,children } = parseArgs(aa);
                props.type = typeName;
                const el = tag('input',props);
                if(_numberTypes.includes(typeName)){
                    const defs = _numberDefaults[typeName] || _numberDefaults['number'];
                    const numProps = Object.keys(defs);
                    const targetEl = toElement(props.for);
                    el._props = props;
                    numProps.forEach(prop => {
                        Object.defineProperty(el,prop,{
                            get(){
                                if(prop === 'number') return isNaN(this.valueAsNumber)? defs[prop] : this.valueAsNumber;
                                const val = this.attr(prop);
                                return isNull(val)? defs[prop] : (Number(val) || 0);
                            },
                            set(ab){
                                if(isNull(ab)){
                                    this.attr(prop,null);
                                }else if(prop === 'number'){
                                    const newVal = Number(ab) || 0;
                                    if(this.valueAsNumber !== newVal){
                                        this.valueAsNumber = newVal;
                                        this.emit(new Event('input',{ bubbles:true }));
                                    }
                                }else{
                                    this.attr(prop,ab);
                                }
                            },
                            configurable: true,
                            enumerable: true
                        });
                    });
                    numProps.forEach(prop => {
                        if(prop in props && !isNull(props[prop])) el[prop] = props[prop];
                    });
                    if(targetEl && targetEl._props){
                        if(!('value' in targetEl._props) && 'value' in el._props){
                            targetEl.number = el.number;
                        } else {
                            el.number = targetEl.number;
                        }
                        let syncing = false;
                        targetEl.on('input',() => {
                            if(syncing) return;
                            syncing = true;
                            el.number = targetEl.number;
                            syncing = false;
                        });
                        el.on('input',() => {
                            if(syncing) return;
                            syncing = true;
                            targetEl.number = el.number;
                            syncing = false;
                        });
                    }
                    if('value' in props) el.defaultValue = String(props.value);
                    let wheelTimer = null,wheelCount = 0;
                    el.on('mousedown',e => {
                        if(e.button === 1){
                            e.preventDefault();
                            el.number = el.defaultValue || 0;
                        }
                    })
                    .on('wheel',e => {
                        e.preventDefault();
                        clearTimeout(wheelTimer);
                        const multiplier = wheelCount > 12? 10 : wheelCount > 6? 5 : wheelCount > 2? 2 : 1;
                        const amount = (e.deltaY < 0? 1 : -1)*el.step*multiplier;
                        el.number = (el.number+amount).clamp(el.min,el.max);
                        wheelCount++;
                        wheelTimer = setTimeout(() => wheelCount = 0,150);
                    },{ passive: false });
                }else if(typeName === 'color'){
                    const col = color(el.value);
                    const _value = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value');
                    Object.defineProperty(el,'value',{
                        get(){ return _value.get.call(this); },
                        set(val){
                            col.set(val);
                            _value.set.call(this,col.hex);
                        },
                        configurable: true
                    });
                    _rgb.forEach(c => {
                        Object.defineProperty(el,c,{
                            get:() => col[c], 
                            set(ca){
                                if(col[c] !== number(ca)){
                                    col[c] = number(ca);
                                    _value.set.call(el,col.hex);
                                    this.emit(new Event('input',{ bubbles:true }));
                                }
                            },
                            configurable: true
                        });
                        if(c in props) el[c] = props[c];
                    });
                    ['hex','css'].forEach(ab => {
                        Object.defineProperty(el,ab,{
                            get:() => col[ab],
                            configurable: true
                        });
                    });
                    el.on('input',function(){
                        col.set(_value.get.call(this));
                    });
                }else if(typeName === 'checkbox'){
                    const checked = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'checked');
                    Object.defineProperty(el,'mixed',{
                        get(){   return this.indeterminate; },
                        set(ab){ this.indeterminate = !!ab; },
                        configurable: true
                    });
                    Object.defineProperty(el,'checked',{
                        get(){ return this.mixed? null : checked.get.call(this); },
                        set(ab){ checked.set.call(this,Boolean(ab)); },
                        configurable: true
                    });
                    let _checked,_mixed;
                    const captureState = () => {
                        _checked = checked.get.call(el);
                        _mixed = el.mixed;
                    };
                    const _click = () => {
                        el.emit(new MouseEvent('click',{ bubbles:true, cancelable:true, shiftKey:true }));
                    }
                    el.on('mousedown',captureState);
                    el.on('mouseup',e => {
                        if(e.button === 1){
                            e.preventDefault();
                            _click();
                        }
                    });
                    el.on('click',e => {
                        if(e.shiftKey){
                            el.mixed = !_mixed;
                            if(_checked !== undefined) el.checked = _checked;
                        }
                    });
                    el.on('keydown',captureState);
                    el.on('keyup',e => { if(e.key === ' ' && e.shiftKey) _click(); });
                }else if(typeName === 'radio'){
                    let _checked;
                    const captureState = () => _checked = el.checked;
                    captureState();
                    el.on('mousedown',captureState);
                    el.on('keydown',captureState);
                    el.on('click',()=>{
                        if(_checked){
                            el.checked = false;
                            el.emit(new Event('input' ,{ bubbles:true }));
                            el.emit(new Event('change',{ bubbles:true }));
                        }        
                    });
                    el.on('keyup',e => { if(e.key === ' ') el.click() });
                }else if(typeName === 'toggle'){
                    // ブラウザには range として認識させる
                    el.type = 'range';
                    // 初期設定
                    let value = ('value' in props)? props.value : 'on';
                    el.min = 0;
                    el.max = 1;
                    el.style.width ||= '1.5rem'; // 外部から指定がなければデフォルト幅

                    el.number = toBit(props.checked || false);
                    let _value;
                    let isMove = false;
                    const setValue = () => _value = el.number;
                    setValue();
                    const matchValue = () => el.number === _value;
                    el.on('input',() => {
                        if(!matchValue()) isMove = true;
                    });
                    el.on('mouseup', () => {
                        if(!isMove && matchValue()){
                            el.number = toBit(!isOne(_value));
                            el.emit(new Event('input' ,{ bubbles:true }));
                            el.emit(new Event('change',{ bubbles:true }));
                        }
                        setValue();
                        isMove = false;
                    });
                    el.on('change',setValue);
                    el.on('keyup',e => {
                        if(e.key === ' '){
                            e.preventDefault();
                            el.checked = !el.checked;
                            el.emit(new Event('input' ,{ bubbles:true }));
                            el.emit(new Event('change',{ bubbles:true }));
                        }
                    });
                    el.on('wheel',e => {
                        e.preventDefault();
                        el.number += (e.deltaY < 0? 1 : -1);
                        setValue();
                        el.emit(new Event('input',{bubbles:true}));
                    },{ passive: false });
                    Object.defineProperty(el,'checked',{
                        get: () => isOne(el.number),
                        set(ab){
                            el.number = toBit(ab);
                            setValue();
                        },
                        configurable: true,
                        enumerable: true
                    });
                    Object.defineProperty(el,'value',{
                        get:() => value,
                        set:(ab) => { value = ab; },
                        configurable: true,
                        enumerable: true
                    });
                }
                return el;
            };
        }
    });
})();
// /input()
const spin = (() => {
    return new Proxy({},{
        get(target,aa){
            const direction = { '+': 1,'-':-1 }[aa];
            if(!direction) return null;
            return (...ba) => {
                const { props,children } = parseArgs(ba);
                const el = toElement(props.for);
                if(!el) return;
                delete props.for;
                const typeName = el.type;
                const defs = _numberDefaults[typeName] || _numberDefaults['number'];
                const numProps = Object.keys(defs);
                numProps.forEach(prop => {
                    if(isNull(props[prop])) props[prop] = el[prop] ?? defs[prop]; 
                });
                const amount = direction * props.step;
                const limit = { '+':props.max,'-':props.min }[aa];
                const defaultNumber = props.number;
                const btn = tag('button',props,children);
                const syncDisabled = () => { btn.disabled = (el.number === limit); };
                syncDisabled();
                el.on('input',syncDisabled);
                let holdTimer = null;
                const update = (ca) => {
                    el.number = (isNumber(ca)? ca:(el.number+amount)).clamp(props.min,props.max);
                };
                const startHold = () => {
                    let count = 0;
                    const loop = () => {
                        let delay = 200,multiplier = 1;
                        if(count > 30){ delay =  25; multiplier = 10; }
                        else if(count > 15){ delay =  50; multiplier =  5; }
                        else if(count >  5){ delay = 100; multiplier =  2; }
                        for(let i = 0; i < multiplier; i++){ update(); }
                        count++;
                        holdTimer = setTimeout(loop,delay);
                    };
                    loop();
                };
                const stopHold = () => clearTimeout(holdTimer);
                btn.on('mousedown',e => {
                    if(e.button === 0){
                        stopHold();
                        startHold();
                    }else if(e.button === 1){
                        stopHold();
                        update(defaultNumber);
                    }
                })
                .on('mouseup',stopHold)
                .on('mouseleave',stopHold)
                .on('contextmenu',e => {
                    e.preventDefault();
                    stopHold();
                    if(Number.isFinite(limit)){ update(limit); }
                })
                return btn;
            };
        }
    });
})();// /spin();
function getValue(el,prop = 'value'){
    if(isString(el)) el = element(`[name="${CSS.escape(el)}"]`);
    const input = el?.matches?.('input,select,textarea')?
        el : (el?.querySelector?.('input,select,textarea') ?? el);
    if (!input) return null;
    switch(input?.type){
        case 'select-multiple':
            return array(...input.options).filter(ab => ab.selected).map(ab => ab[prop]);
        case 'select-one':
            return input.options[input.selectedIndex]?.[prop] ?? null;
        case 'checkbox':
        case 'radio': {
            // 1. 対象となる要素のリストを準備（nameがあれば同名グループ、なければ自身のみ）
            const targets = input.name? array(...elements(`input[name="${CSS.escape(input.name)}"]`)) : [input];
            // 2. 選択状態にある要素の prop 値を抽出（共通ロジック）
            const selectedValues = targets? targets.filter(ab => ab.checked).map(ab => ab[prop]) : [];
            // 3. 入力タイプに応じて返り値の型を決定
            return input.type === 'checkbox'? selectedValues : (selectedValues[0] ?? null);
        }
        default:
            return input?.[prop] ?? null;
    }
}


function addLoadEvent(func) {
    if(doc.readyState !== 'loading'){ func(); return; }
    win.addEventListener('DOMContentLoaded',func);
}

function body(...aa){ return doc.body.put(...aa); }
