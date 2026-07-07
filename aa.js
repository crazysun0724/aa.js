//aa.js
const aa = {
    version: '0.22',
    date: '2026/07/07 16:26',
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
    'div','span','p','br','hr','ol','ul','li',
    'table','tr','th','td',
    'form','fieldset','legend','label','pre','code','button','select','option',
    'optgroup','textarea',
    'h1','h2','h3','h4','h5','h6'
];
_tags.forEach(name => { win[name] = (...aa) => tag(name,...aa); });
const _checkTypes = ['checkbox', 'radio'];
const _numberTypes  = ['number', 'range'];
const _numberDefaults = {
    'number':{ value: 0,min:-Infinity,max: Infinity,step: 1 },
    'range' :{ value: 0,min: 0,       max: 100,     step: 1 }
};

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

function log(aa){ console.log( aa); }

function isArray( aa){ return Array.isArray(aa);      }
function isNode(  aa){ return aa instanceof Node;     }
function isString(aa){ return typeof aa === 'string'; }
function isNumber(aa){ return typeof aa === 'number' && !Number.isNaN(aa); }
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
                                if(prop === 'value'){
                                    const ab = this.valueAsNumber;
                                    return isNaN(ab)? defs[prop] : ab;
                                }
                                const val = this.getAttribute(prop);
                                return isNull(val)? defs[prop] : (Number(val) || 0);
                            },
                            set(ab){
                                if(isNull(ab)){ this.removeAttribute(prop);
                                              }else if(prop === 'value'){
                                    const ac = Number(ab) || 0;
                                    if(this.valueAsNumber !== ac){
                                        this.valueAsNumber = ac;
                                        this.dispatchEvent(new Event('input',{ bubbles:true }));
                                    }
                                }else{ this.setAttribute(prop,String(ab)); }
                            },
                            configurable: true,
                            enumerable: true
                        });
                    });
                    numProps.forEach(prop => {
                        if(prop in props && !isNull(props[prop])) el[prop] = props[prop];
                    });
                    if(targetEl && targetEl._props){
                        if (!('value' in targetEl._props) && 'value' in el._props) {
                            targetEl.value = el.value;
                        } else {
                            el.value = targetEl.value;
                        }
                        let syncing = false;
                        targetEl.on('input',() => {
                            if(syncing) return;
                            syncing = true;
                            el.value = targetEl.value;
                            syncing = false;
                        });
                        el.on('input',() => {
                            if(syncing) return;
                            syncing = true;
                            targetEl.value = el.value;
                            syncing = false;
                        });
                    }
                    if('value' in props) el.defaultValue = String(props.value);
                    let wheelTimer = null,wheelCount = 0;
                    el.on('mousedown',e => {
                        if(e.button === 1){
                            e.preventDefault();
                            el.value = el.defaultValue || 0;
                            el.dispatchEvent(new Event('input',{ bubbles:true }));
                        }
                    })
                        .on('wheel',e => {
                            e.preventDefault();
                            clearTimeout(wheelTimer);
                            const multiplier = wheelCount > 12? 10 : wheelCount > 6? 5 : wheelCount > 2? 2 : 1;
                            const amount = (e.deltaY < 0? 1 : -1)*el.step*multiplier;
                            el.value = (el.value + amount).clamp(el.min,el.max);
                            el.dispatchEvent(new Event('input',{ bubbles: true }));
                            wheelCount++;
                            wheelTimer = setTimeout(() => wheelCount = 0,150);
                        },{ passive: false });
                }else if(typeName === 'color'){
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
                            get:() => ba[c], 
                            set(ca){
                                if(ba[c] !== number(ca)){
                                    ba[c] = number(ca);
                                    nativeValue.set.call(el,ba.hex);
                                    this.dispatchEvent(new Event('input',{ bubbles:true }));
                                }
                            },
                            configurable: true
                        });
                        if(c in props) el[c] = props[c];
                    });
                    ['hex','css'].forEach(ab => {
                        Object.defineProperty(el,ab,{
                            get:() => ba[ab],
                            configurable: true
                        });
                    });
                    el.on('input',function(){
                        ba.set(nativeValue.get.call(this));

                    });
                }else if(_checkTypes.includes(typeName)){
                    const labelEl = tag('label',el,...children);
                    Object.defineProperty(labelEl,'checked',{
                        get:() => el.checked,
                        set(ab){ el.checked = Boolean(ab); },
                        configurable: true
                    });
                    if(typeName === 'checkbox'){
                        const nativeChecked = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'checked');
                        Object.defineProperty(el,'checked',{
                            get(){ return this.indeterminate? null : nativeChecked.get.call(this); },
                            set(ab){ nativeChecked.set.call(this, Boolean(ab)); },
                            configurable: true
                        });
                        labelEl.on('mousedown',e => {
                            if(e.button === 1){
                                e.preventDefault();
                                el.indeterminate = !el.indeterminate;
                                el.dispatchEvent(new Event('input', { bubbles:true }));
                                el.dispatchEvent(new Event('change',{ bubbles:true }));
                            }
                        });
                    }else if(typeName === 'radio'){
                        let wasChecked = false;
                        labelEl.on('mousedown',() => { wasChecked = el.checked; });
                        el.on('click',() => {
                            if(wasChecked){
                                el.checked = false;
                                el.dispatchEvent(new Event('input', { bubbles:true }));
                                el.dispatchEvent(new Event('change',{ bubbles:true }));
                            }
                        });
                    }
                    return labelEl;
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
                const limit = { '+': props.max, '-': props.min }[aa];
                const btn = tag('button',props,children);
                const syncDisabled = () => { btn.disabled = (el.value === limit); };
                syncDisabled();
                el.on('input', syncDisabled);
                let holdTimer = null;
                const update = (ca) => {
                    el.value = (isNumber(ca)? ca :(el.value + amount)).clamp(props.min,props.max);
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
                        update(defs['value']);
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

function getValue(el, prop = 'value'){
    if(isString(el)) el = element(`[name="${el}"]`);   // ← 文字列ならnameで検索
    const input = el?.matches?.('input,select,textarea')?
        el : (el?.querySelector?.('input,select,textarea') ?? el);
    switch(input?.type){
        case 'select-multiple':
            return array(...input.options).filter(ab => ab.selected).map(ab => ab[prop]);
        case 'select-one':
            return input.options[input.selectedIndex]?.[prop] ?? null;
        case 'checkbox':
            return array(...elements(`input[name="${input.name}"]`))
                .filter(ab => ab.checked).map(ab => ab[prop]);
        case 'radio':
            return array(...elements(`input[name="${input.name}"]`))
                .find(ab => ab.checked)?.[prop] ?? null;
        default:
            return input?.[prop] ?? null;
    }
}

Object.defineProperty(Node.prototype,'on',{
    value(aa,ab,ac){
        this.addEventListener(aa,ab,ac);
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
Object.defineProperty(Element.prototype,'element',{
    value(aa){ return element(aa,this); },
    enumerable:false,
});
Object.defineProperty(Element.prototype,'elements',{
    value(aa){ return elements(aa,this); },
    enumerable:false,
});
Object.defineProperty(Element.prototype,'getValue',{
    value(aa){ return getValue(this,aa); },
    enumerable:false,
});
Object.defineProperty(Element.prototype,'deStyle',{
    value(prop){
        if(prop) this.style[prop] = '';
        else     this.removeAttribute('style');
        return   this;
    },
    enumerable:false
});
Object.defineProperty(String.prototype,'convertBase',{
    value(aa,ab = 10,ac = 0){
        const ba = parseInt(this,aa).toString(ab).padStart(ac,'0');
        return (ab === 10 && ac === 0)? Number(ba) : ba;
    },
    enumerable:false
});
Object.defineProperty(Number.prototype,'convertBase',{
    value(aa = 10,ab,ac = 0){
        const ba = aa === 10? ab : aa;
        const bb = aa === 10? ac : ab || 0;
        const bc = parseInt(this.toString(10),10).toString(ba).padStart(bb,'0');
        return (ba === 10 && bb === 0)? Number(bc) : bc;
    },
    enumerable:false
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
