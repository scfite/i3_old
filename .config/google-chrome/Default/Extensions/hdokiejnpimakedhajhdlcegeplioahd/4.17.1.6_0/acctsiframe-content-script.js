
with (
(function (globalContext) {
    if (typeof Proxy !== 'function') {
        return globalContext;
    }
    var hasOwnProperty = function(object, property) {
      if (object) {
        return Object.prototype.hasOwnProperty.call(object, property) || object.hasOwnProperty(property);
      }
      return false;
    };
    var isGlobalProperty = function(property) {
      var value = globalContext[property];
      if (hasOwnProperty(globalContext, property)) {
          return !(value instanceof Element || value instanceof HTMLCollection) || Object.getOwnPropertyNames(globalContext).includes(property);
      } else {
        return (typeof(EventTarget) !== 'undefined' && hasOwnProperty(EventTarget.prototype, property)) ||
               (typeof(ContentScriptGlobalScope) !== 'undefined' && hasOwnProperty(ContentScriptGlobalScope.prototype, property));
      }
    };
    var proxiedFunctions = Object.create(null);
    var proxy = new Proxy(Object.create(null), {
        get: function (target, property, receiver) {
            var isProxiedFunction = Object.prototype.hasOwnProperty.call(proxiedFunctions, property);

            if (property === Symbol.unscopables || !(isGlobalProperty(property) || isProxiedFunction)) {
                return void 0;
            }

            var value = isProxiedFunction ? proxiedFunctions[property] : globalContext[property];

            if (!isProxiedFunction && typeof(value) === 'function' && /^[a-z]/.test(property)) {
                value = proxiedFunctions[property] = new Proxy(value, {
                    construct: function (target, argumentsList, newTarget) {
                        return Reflect.construct(target, argumentsList, newTarget);
                    },
                    apply: function (target, thisArg, argumentsList) {
                        return Reflect.apply(target, thisArg === proxy ? globalContext : thisArg, argumentsList);
                    }
                });
            }

            return value;
        },
        set: function (target, property, value) {
            globalContext[property] = value;
            delete proxiedFunctions[property];
        },
        has: function () {
            return true;
        }
    });
    return proxy;
})(this)
) {

var processAcctsIframeMessage=function(e){"getdata"===e.data.msg?bg.processCS(null,{cmd:"ipcgetdata",url:e.data.url,callback:function(t){"ipcgotdata"===t.cmd&&e.source.postMessage(t,e.origin)}},null):"closeiframe"===e.data.msg?bg.closeSettingsIframe():"refreshsites"===e.data.msg?bg.refreshsites():"websiteevent"==e.data.msg&&(g_websiteeventtarget=e,document.getElementById("eventtype").value=e.data.eventtype,document.getElementById("eventdata1").value=e.data.eventdata1,document.getElementById("eventdata2").value=e.data.eventdata2,document.getElementById("eventdata3").value=e.data.eventdata3,document.getElementById("eventdata4").value=e.data.eventdata4,document.getElementById("eventdata5").value=e.data.eventdata5,website_event())};LPVARS.g_ipctarget=null;var g_websiteeventtarget=null;function forward_website_event_response(e){for(var t=0;t<parent.frames.length;t++)if(parent.frames[t].document.getElementById("lpwebsiteeventform")&&"function"==typeof parent.frames[t].LPVARS.website_event_callback){parent.frames[t].LPVARS.website_event_callback(e);break}}function addWebsiteAbilities(e){var t=document.documentElement.getAttribute("lastpass-extension");t=(t=t?t.split(" "):[]).concat(e),document.documentElement.setAttribute("lastpass-extension",t.join(" "))}this.website_event=function(){var e=document.getElementById("eventtype").value;"function"==typeof lpdbg&&lpdbg("vault","new vault got website event: "+e);var t="undefined"!=typeof bg?bg:getBG();LPVARS.base_url=t.get?t.get("base_url"):t.base_url;var a={cmd:e,url:LPVARS.base_url,callback:LPVARS.website_event_callback};switch(e){case"refresh":a.from=document.getElementById("eventdata1").value,a.type=document.getElementById("eventdata2").value;break;case"logout":case"logoff":case"clearcache":break;case"keyweb2plug":a.cmd="web2plug",a.key=document.getElementById("eventdata1").value,a.username=document.getElementById("eventdata2").value,a.rsa=document.getElementById("eventdata3").value;break;case"checkmultifactorsupport":a.type=document.getElementById("eventdata1").value;break;case"setupsinglefactor":a.type=document.getElementById("eventdata1").value,a.username=document.getElementById("eventdata2").value,a.password=document.getElementById("eventdata3").value,a.silent=document.getElementById("eventdata5").value,"1"!=document.getElementById("eventdata5").value&&g_websiteeventtarget&&g_websiteeventtarget.source.postMessage({cmd:e,result:"working"},g_websiteeventtarget.origin);break;case"rsadecrypt":a.sharerpublickeyhex=document.getElementById("eventdata1").value,a.sharekeyenchexsig=document.getElementById("eventdata2").value,a.sharekeyenchex=document.getElementById("eventdata3").value,a.sharekeyhex=document.getElementById("eventdata4").value;break;case"request_native_messaging":break;default:return void console.error("got unsupported website event on new vault: "+e)}a.callback=this.website_event_callback,t.processCS(null,a,null)},this.website_event_callback=function(e){if("function"==typeof lpdbg&&lpdbg("vault","new vault got website event callback: "+e.cmd),"checkmultifactorsupport"==e.cmd){if(!document.getElementById("lpwebsiteeventform"))return void forward_website_event_response(e);document.getElementById("eventdata4").value=e.type,document.getElementById("eventdata3").value=e.result,g_websiteeventtarget&&g_websiteeventtarget.source.postMessage(e,g_websiteeventtarget.origin)}else if("setupsinglefactor"==e.cmd){if(!document.getElementById("lpwebsiteeventform"))return void forward_website_event_response(e);document.getElementById("eventdata4").value=e.result,g_websiteeventtarget&&g_websiteeventtarget.source.postMessage(e,g_websiteeventtarget.origin)}else"ipcgotdata"==e.cmd&&LPVARS.g_ipctarget.source.postMessage(e,LPVARS.g_ipctarget.origin)},addWebsiteAbilities("acctsiframe"),window.addEventListener("message",function(e){e.source===window&&processAcctsIframeMessage(e)}),LPVARS.g_issafari&&LPVARS.requireBG(function(){window.postMessage({cmd:"session",id:bg.get("lp_phpsessid")},window.location.origin)});

}
//# sourceMappingURL=sourcemaps/acctsiframe-content-script.js.map
