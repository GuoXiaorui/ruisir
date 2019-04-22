
!function(){
    var log = window.console.log
    var $ = function(sel){
        var domList = typeof sel == 'string'? document.querySelectorAll(sel):[sel],r = [];
        if(!domList.length) return r;
        for (var i = 0;i <domList.length;i++){
            r.push(domList[i])
        }
        return new ruiDomlist(r)
    }
    
    function ruiDomlist (domArr) {
        this.length = domArr.length
        var domAll = []
        for(var i = 0;i<domArr.length;i++){
            this[i] = domArr[i]
            domAll.push(domArr[i])
        }
        this.domList = domAll
        this.souceDom = domArr
        return this
    }
    ruiDomlist.prototype.eq = function (i) {
        return this.domList[i]?this.domList[i]:null
    }
    ruiDomlist.prototype.addClass = function (sel) {
        var _this = this,news = sel.split(','),cNew=[]
        _this.domList.forEach(function(item){
            var cArr = item.className?item.className:''
            var newCarr = cArr.split(' ').concat(news)
            newCarr.forEach(function(v){
                if(cNew.indexOf(v)==-1){
                    cNew.push(v)
                }
            })
            item.className = cNew.join(' ')
        })
        return this
    }
    ruiDomlist.prototype.rmClass = function (sel) {
        var _this = this,news = sel.split(','),cNew=[]
        _this.domList.forEach(function(item){
            var cArr = item.className?item.className:''
            cArr.forEach(function(v){
                news.forEach(function(c1){
                    if(v !== c1){
                        cNew.push(v)
                    }
                })
            })
            item.className = cNew.join(' ')
        })
        return this
    }
    ruiDomlist.prototype.remove = function(){
        this.domList.forEach(function(v){
            v.parentNode.removeChild(v)
        })
    }

    ruiDomlist.prototype.is = function(sel){
        var cur = document.querySelectorAll(sel)
        if(!cur.length) return 0;
        var f = 1
        this.domList.forEach(function(v,i){
            cur[i] !== v && (f = 0);
        })
        return f
    }
    ruiDomlist.prototype.append = function(str){
        if (typeof str != 'string') str = str.outerHTML;
        this.domList.forEach(function(v){
            var _div = document.createElement('DIV')
            _div.innerHTML = str
            var _divC = _div.childNodes
            for(var i = 0;i<_divC.length;i++){
                v.appendChild(_divC[i])
            }
        })
        return this
    }
    ruiDomlist.prototype.parents = function(sel){
        var pdom = [],_this = this,domes = $(sel)
        _this.domList.forEach(function(idom,index){
            var i = 1
            while(i && idom.parentNode){
                idom = idom.parentNode
                if(idom == domes[index]) break;
            }
            tdom && pdom.push(idom);
        })
        return new ruiDomlist(pdom)    
    }
    ruiDomlist.prototype.on = function(a,b,c){
        this.domList.forEach(function(v){
            if(typeof b == 'function'){
                v['on'+a] = b
            } else{
                v.addEventListener(a,function(e){
                    var seles = b.split(',')
                    seles.forEach(function(sel){
                        var dl = v.querySelectorAll(sel)
                        for(var _i = 0;_i < dl.length;_i++){
                            if(dl[_i] == e.target) {c(e);return;}
                        }
                    })
                },false)
            }
        })
    }

    function getLocationSearch(key, url){
        var search = url || location.search.trim()
        if (!search || search == '?') return null;
        var reg = /(\?|\&)[^\&]*/gi
        var result = {}
        search.replace(reg, function(str){
            var map = str.replace(/\?|\&/, '').split('=')
            if(map.length ===1 ) return result[map[0]] = undefined;
            if(map.length !== 2) return '';
            result[map[0]] = map[1]
        })
        if (key && result.hasOwnProperty(key)) return result[key]
        return result
    }
    function bothJoin(arr, str1,str2){
        var r = [],s = arr;
        for(var i=0;i<s.length;i++){
            r.push(str1+s[i]+str2);
        }        
        return r.join('');
    }
    //模板解析
    function turnModal(str, data) {
        var data = data.length?data:[data]
        var r = [];
        var one = function(index){
            if(index>=data.length) return false;
            var obj = data[index];
            obj.rui_index = index
            var fs = [];
            for(var i in obj){
                fs.push('var '+i+'= obj.'+i+';');
            }
            fs = fs.join('');
            r.push(str.replace(/{{[^}}]+}}/gi, function (x) {
                var x = x.substring(2, x.length - 2).trim();
                var el = new Function('x','obj',fs+' return '+x);
                try{
                    return el(x,obj);
                }catch(e){
                    return ''
                }
            }))
            index++;
            one(index)
        }
        one(0);
        return r.join('')
    }
    // 时间格式化
    function dateTimeFormatter (t) {
        if (!t) return ''
        t = new Date(t*1000).getTime()
        t = new Date(t)
        var year = t.getFullYear()
        var month = (t.getMonth() + 1)
        month = checkAddZone(month)
       
        var date = t.getDate()
        date = checkAddZone(date)
       
        var hour = t.getHours()
        hour = checkAddZone(hour)
       
        var min = t.getMinutes()
        min = checkAddZone(min)
       
        var se = t.getSeconds()
        se = checkAddZone(se)
        function checkAddZone (num) {
            return num<10 ? '0' + num.toString() : num
        }
        return year + '-' + month + '-' + date + '   ' + hour + ':' + min + ':' + se
    }
    // 弹窗
    function Layer(){
        var count = 0
        var tem = [
            '<div data-layer="{{"layer"+count}}" class="rui-layer rui-layer-show {{model?"rui-layer-model":""}}">',
                '<div class="rui-layer-content">{{content}}</div>',
            '</div>'
        ]
        this.msg = function(text){
            var _this = this
            count ++;
            show({
                model:0,
                count: count,
                content:'<p class="rui-msg">'+text+'</p>',
            })
            var _i = count
            setTimeout(function(){
                _this.close(_i)
            },1300)
            return count;
        }
        this.loading = function(text){
            count ++;
            show({
                model:0,
                count: count,
                content:'<img src="./static/css/loading-2.gif">',
            })
            return count;
        }
        this.open = function(con,model){
            count ++;
            show({
                model:model,
                count: count,
                content:con
            })
            return count
        }
        this.close = function(i){
            if(i!==undefined){
                $('[data-layer=layer'+i+']').remove()
            }else{
                $('.rui-layer').remove()
            }
        }
        this.getLayer= function (i){
            var dom = $('[data-layer=layer'+i+']')
            return dom.length? dom : null
        }
        function show (opt){
            var tem1 = turnModal(tem.join(''),opt)
            $('body').append(tem1)
            var sel = '[data-layer=layer'+opt.count+']'
            setTimeout(function(){
                $(sel).addClass('in')
            },0)
        }
        $('body').on('click','.rui-layer,.rui-layer .rui-layer-close',function(e){
            var dom = $(e.target)
            if(dom.is('.rui-layer-close')){
                dom.parents('.rui-layer').remove()
            } else if(dom.is('.rui-layer')){
                dom.remove()
            }
        })
    }
    window.rui = {
        $:$,
        layer:new Layer(),
        ruiDomlist:ruiDomlist,
        turnModal:turnModal,
        dateTimeFormatter:dateTimeFormatter,
        getLocationSearch:getLocationSearch,
        bothJoin: bothJoin
    }
}();