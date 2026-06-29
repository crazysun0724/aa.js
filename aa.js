//aa.js
const aa = {
    version: '0.18.9',
    date: '2026/06/29 17:18',
    status: 2,
    state: {
        1:'developing',
        2:'experimental',
        3:'beta'
    },
    log(){
        if(!this.status) return;
        log(`aa.js ver${this.version}-${this.state[this.status]}`);
        log(new Date());
    }
};
aa.log();
const win = window;
const doc = document;
const _rgb = ['r','g','b'];

const _tags = [
    'header','footer','main','article','section','aside','dialog','menu','nav',
    'div','span','p','br','hr','ol','ul','li',
    'table','tr','th','td',
    'form','fieldset','legend','label','pre','code','button','select','option',
    'optgroup','textarea',
    'h1','h2','h3','h4','h5','h6','img','a'
];
_tags.forEach(name => { win[name] = (...aa) => tag(name,...aa); });
const _checkTypes = ['checkbox', 'radio'];
const _numberTypes  = ['number', 'range'];

function element( aa,ab = doc){ return ab.querySelector(aa);   }
function elements(aa,ab = doc){ return ab.querySelectorAll(aa);}
const _elements = {};
function id(aa){ return _elements[aa] ||= doc.getElementById(aa); }
function toElement(aa){
    if(isNode(  aa)) return aa;
    if(isString(aa)) return id(aa) || element(aa);
    return null;
}
const _palette = {
    set(aa){
        this.x.fillStyle = '#000000';
        this.y.color = '';
        this.y.color = aa;
        if(this.y.color === '') return false;
        this.x.fillStyle = this.y.color;
        this.y.color = this.x.fillStyle;
        return this.y.color !== '';
    },
    get hex(){ return this.x.fillStyle; },
    get css(){ return this.y.color; },
    get  z (){ return this._z ||= tag('canvas'); },
    get  x (){ return this._x ||= this.z.getContext('2d'); },
    get  y (){ return this._y ||= this.z.style; }
};

function log(aa){ console.log( aa);   }

function isArray( aa){ return Array.isArray(aa);      }
function isNumber(aa){ return Number.isFinite(aa);    }
function isNode(  aa){ return aa instanceof Node;     }
function isString(aa){ return typeof aa === 'string'; }
function isObject(aa){ return typeof aa === 'object' && !isNull(aa) && !isArray(aa) && !isNode(aa); }

function isBlank( aa){ return aa === ''; }
function isNull(  aa){ return aa === null || aa === undefined; }
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
  if(aa.length === 1 && isObject(aa)) return aa;
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

function number(...aa) {
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
    const rgb = { r: 0,g: 0,b: 0 };
    const setPalette = () => _palette.set(`rgb(${rgb.r},${rgb.g},${rgb.b})`);
    const res = Object.fromEntries(_rgb.map(c => [c,{
        get: () => rgb[c],
        set: val => rgb[c] = number(val),
        enumerable: true
    }]));
    Object.defineProperties(res,{
        hex: { get(){ setPalette(); return _palette.hex; }},
        css: { get(){ setPalette(); return _palette.css; }}
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
                        const seed = number(ca) % 65535;
                        t = [(seed * 7) % 256,(seed * 13) % 256,(seed * 17) % 256];
                    }
                }
                _rgb.forEach((c,i) => rgb[c] = isFirst? t[i] : Math.round((rgb[c] + t[i]) / 2));
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
   else if(isArray(ac)) ab.children.push(...ac);
   else if(isNode(ac) || isNumber(ac) || isString(ac)){
            ab.children.push(ac);
        }
        return ab;
    },{ props:{},children:[] });
}
function tag(tagName,...aa){
    if(!isString(tagName)) return null; 
    const { props,children } = parseArgs(aa);
    const el = doc.createElement(tagName);
    for(const [key,val] of Object.entries(props)){
        if(key === 'list' && isNode(val)) el.setAttribute('list',val.id);
   else if(key.startsWith('on') || key in el) el[key] = val;
   else el.setAttribute(key,val);
    }
    return el.put(...children);
}// /tag();

const input = (() => {
    return new Proxy({},{
        get(target, typeName){
            return (...aa) => {
                const { props, children } = parseArgs(aa);
                props.type = typeName;
                const isNumberType = _numberTypes.includes(typeName);
                const el = tag('input',props);
                if(isNumberType){
                    const numProps = {
                        value:{ def: 0, asNumber: true },
                        min  :{ def:-Infinity },
                        max  :{ def: Infinity },
                        step :{ def: 1 }
                    };
                    Object.keys(numProps).forEach(prop => {
                        const { def,asNumber } = numProps[prop];
                        Object.defineProperty(el,prop,{
                            get(){
                                if(asNumber) return isNaN(this.valueAsNumber)? def : this.valueAsNumber;
                                const val = this.getAttribute(prop);
                                return val === null? def : (Number(val) || 0);
                            },
                            set(ab){
                                if(asNumber) this.valueAsNumber = Number(ab) || 0;
                                else this.setAttribute(prop, String(ab));
                            },
                            configurable: true
                        });
                        if(prop in props) el[prop] = props[prop];
                    });
                    if('value' in props) el.defaultValue = String(props.value);
                    let wheelTimer = null, wheelCount = 0;
                    el.on('mousedown', e => {
                        if (e.button === 1){
                            e.preventDefault();
                            el.value = el.defaultValue || 0;
                            el.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    })
                    .on('wheel', e => {
                        e.preventDefault();
                        clearTimeout(wheelTimer);
                        const baseStep = el.step;
                        let multiplier = wheelCount > 12? 10 : wheelCount > 6? 5 : wheelCount > 2? 2 : 1;
                        const amount = (e.deltaY < 0? 1 :-1) * baseStep * multiplier;
                        el.value = (el.value + amount).clamp(el.min,el.max);
                        el.dispatchEvent(new Event('input',{ bubbles: true }));
                        wheelCount++;
                        wheelTimer = setTimeout(() => { wheelCount = 0; },150);
                    },{ passive: false });
                    // ---------------------------------------------------------
                } else if(typeName === 'color'){
                    const ba = color(el.value);
                    const nativeValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value');
                    Object.defineProperty(el,'value',{
                        get(){ return nativeValue.get.call(this); },
                        set(val){
                            ba.set(val);
                            nativeValue.set.call(this,ba.hex);
                        },
                        configurable: true
                    });
                    _rgb.forEach(c => {
                        Object.defineProperty(el,c,{
                            get: () => ba[c], 
                            set: (ca) => {
                                ba[c] = number(ca);
                                nativeValue.set.call(el,ba.hex);
                            },
                            configurable: true
                        });
                        if(c in props) el[c] = props[c];
                    });
                    el.on('input',function(){
                        ba.set(nativeValue.get.call(this));
                    });
                } else if(_checkTypes.includes(typeName)){
                    const labelEl = label(el,...children);
                    Object.defineProperty(labelEl,'checked',{
                        get(){ return el.checked; },
                        set(ab){ el.checked = Boolean(ab); },
                        configurable: true
                    });
                    return labelEl;
                }
                return el;
            };
        }
    });
})();// input()

const spin = (() => {
    return new Proxy({},{
        get(target,aa){
            const direction = { '+': 1,'-':-1 }[aa];
            if(!direction) return null;
            return (...aa) => {
                const { props,children } = parseArgs(aa);
                const targetRef = props.for;
                const customStep = !isNull(props.step)? Math.abs(Number(props.step)) : null;
                delete props.for;
                delete props.step;
                const btn = tag('button', props, children);
                let holdTimer = null;
                const update = () => {
                    const el = toElement(targetRef);
                    if(!el) return;
                    const baseStep = customStep? customStep : (Number(el.step) || 1);
                    const amount = direction * baseStep;
                    const min = !isNull(el.min)? Number(el.min) :-Infinity;
                    const max = !isNull(el.max)? Number(el.max) : Infinity;
                    el.value = (el.value + amount).clamp(min,max);
                    el.dispatchEvent(new Event('input',{ bubbles: true }));
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
                        holdTimer = setTimeout(loop, delay);
                    };
                    loop();
                };
                const stopHold = () => clearTimeout(holdTimer);
                btn.on('mousedown', e => {
                    if(e.button === 0){
                        stopHold();
                        startHold();
                    }
                })
                .on('mouseup',stopHold)
                .on('mouseleave',stopHold);
                return btn;
            };
        }
    });
})();// /spin();

Object.defineProperty(Node.prototype,'on',{
    value(aa,ab,ac){
        this.addEventListener(aa,ab,ac);
        return this;
    },
    enumerable: false
});
Object.defineProperty(Element.prototype,'put',{
    value(...aa){
        const { children } = parseArgs(aa);
        this.append(...children);         
        return this;
    },
    enumerable: false
});
Object.defineProperty(Element.prototype,'element',{
    value(aa){ return element(aa,this); },
    enumerable: false,
});
Object.defineProperty(Element.prototype,'elements',{
    value(aa){ return elements(aa,this); },
    enumerable: false,
});
Object.defineProperty(Element.prototype,'deStyle',{
    value(prop){
        if(prop) this.style[prop] = '';
        else     this.removeAttribute('style');
        return this;
    },
    enumerable: false
});
Object.defineProperty(String.prototype,'convertBase',{
    value(aa,ab = 10,ac = 0){
        const ba = parseInt(this,aa).toString(ab).padStart(ac,'0');
        return (ab === 10 && ac === 0)? Number(ba) : ba;
    },
    enumerable: false
});
Object.defineProperty(Number.prototype,'convertBase',{
    value(aa = 10,ab,ac = 0){
        const ba = aa === 10? ab : aa;
        const bb = aa === 10? ac : ab || 0;
        const bc = parseInt(this.toString(10),10).toString(ba).padStart(bb,'0');
        return (ba === 10 && bb === 0)? Number(bc) : bc;
    },
    enumerable: false
});

function random(n){ return Math.floor(Math.random() * n); }

Object.defineProperty(Array.prototype,'sum',{
    value(){
        return this.reduce((aa,ab) => aa + (isNumber(ab)? ab : 0),0);
    },
    enumerable: false
});
Object.defineProperty(Array.prototype,'mean',{
    value(){
        return this.length? this.sum() / this.length : 0;  
    },
    enumerable: false
});
Object.defineProperty(Array.prototype,'shuffle',{
    value(){
        for(let i = this.length - 1; i > 0; i--){
            const aa = random(i + 1);
            [this[i],this[aa]] = [this[aa],this[i]];
        }
        return this;
    },
    enumerable: false
});
Object.defineProperty(Array.prototype,'clear',{
    value(){ this.length = 0; },
    enumerable: false
});
Object.defineProperty(Number.prototype,'clamp',{
    value(aa = 100,ab = 0){
        return Math.max(Math.min(aa,ab),Math.min(Math.max(aa,ab),this));
    },
    enumerable: false
});
function addLoadEvent(func) {
    if(doc.readyState !== 'loading'){ func(); return; }
    win.addEventListener('DOMContentLoaded',func);
}

const datalist = (...aa) => {
    const { props,children } = parseArgs(aa);
    props.id = props.id || string('id-',crypto.randomUUID());
    return tag('datalist',props,children);
};

function body(...aa){ return doc.body.put(...aa); }
