"use strict";(self.webpackChunkweb_scraper=self.webpackChunkweb_scraper||[]).push([[8162],{6074:(e,r,o)=>{o.d(r,{QP:()=>U});const t=e=>{const r=a(e),{conflictingClassGroups:o,conflictingClassGroupModifiers:t}=e;return{getClassGroupId:e=>{const o=e.split("-");return""===o[0]&&1!==o.length&&o.shift(),n(o,r)||s(e)},getConflictingClassGroupIds:(e,r)=>{const n=o[e]||[];return r&&t[e]?[...n,...t[e]]:n}}},n=(e,r)=>{if(0===e.length)return r.classGroupId;const o=e[0],t=r.nextPart.get(o),l=t?n(e.slice(1),t):void 0;if(l)return l;if(0===r.validators.length)return;const s=e.join("-");return r.validators.find((e=>{let{validator:r}=e;return r(s)}))?.classGroupId},l=/^\[(.+)\]$/,s=e=>{if(l.test(e)){const r=l.exec(e)[1],o=r?.substring(0,r.indexOf(":"));if(o)return"arbitrary.."+o}},a=e=>{const{theme:r,prefix:o}=e,t={nextPart:new Map,validators:[]};return p(Object.entries(e.classGroups),o).forEach((e=>{let[o,n]=e;i(n,t,o,r)})),t},i=(e,r,o,t)=>{e.forEach((e=>{if("string"!==typeof e){if("function"===typeof e)return c(e)?void i(e(t),r,o,t):void r.validators.push({validator:e,classGroupId:o});Object.entries(e).forEach((e=>{let[n,l]=e;i(l,d(r,n),o,t)}))}else{(""===e?r:d(r,e)).classGroupId=o}}))},d=(e,r)=>{let o=e;return r.split("-").forEach((e=>{o.nextPart.has(e)||o.nextPart.set(e,{nextPart:new Map,validators:[]}),o=o.nextPart.get(e)})),o},c=e=>e.isThemeGetter,p=(e,r)=>r?e.map((e=>{let[o,t]=e;return[o,t.map((e=>"string"===typeof e?r+e:"object"===typeof e?Object.fromEntries(Object.entries(e).map((e=>{let[o,t]=e;return[r+o,t]}))):e))]})):e,u=e=>{if(e<1)return{get:()=>{},set:()=>{}};let r=0,o=new Map,t=new Map;const n=(n,l)=>{o.set(n,l),r++,r>e&&(r=0,t=o,o=new Map)};return{get(e){let r=o.get(e);return void 0!==r?r:void 0!==(r=t.get(e))?(n(e,r),r):void 0},set(e,r){o.has(e)?o.set(e,r):n(e,r)}}},b=e=>{const{separator:r,experimentalParseClassName:o}=e,t=1===r.length,n=r[0],l=r.length,s=e=>{const o=[];let s,a=0,i=0;for(let p=0;p<e.length;p++){let d=e[p];if(0===a){if(d===n&&(t||e.slice(p,p+l)===r)){o.push(e.slice(i,p)),i=p+l;continue}if("/"===d){s=p;continue}}"["===d?a++:"]"===d&&a--}const d=0===o.length?e:e.substring(i),c=d.startsWith("!");return{modifiers:o,hasImportantModifier:c,baseClassName:c?d.substring(1):d,maybePostfixModifierPosition:s&&s>i?s-i:void 0}};return o?e=>o({className:e,parseClassName:s}):s},m=e=>{if(e.length<=1)return e;const r=[];let o=[];return e.forEach((e=>{"["===e[0]?(r.push(...o.sort(),e),o=[]):o.push(e)})),r.push(...o.sort()),r},g=/\s+/;function f(){let e,r,o=0,t="";for(;o<arguments.length;)(e=arguments[o++])&&(r=h(e))&&(t&&(t+=" "),t+=r);return t}const h=e=>{if("string"===typeof e)return e;let r,o="";for(let t=0;t<e.length;t++)e[t]&&(r=h(e[t]))&&(o&&(o+=" "),o+=r);return o};function x(e){for(var r=arguments.length,o=new Array(r>1?r-1:0),n=1;n<r;n++)o[n-1]=arguments[n];let l,s,a,i=function(r){const n=o.reduce(((e,r)=>r(e)),e());return l=(e=>({cache:u(e.cacheSize),parseClassName:b(e),...t(e)}))(n),s=l.cache.get,a=l.cache.set,i=d,d(r)};function d(e){const r=s(e);if(r)return r;const o=((e,r)=>{const{parseClassName:o,getClassGroupId:t,getConflictingClassGroupIds:n}=r,l=[],s=e.trim().split(g);let a="";for(let i=s.length-1;i>=0;i-=1){const e=s[i],{modifiers:r,hasImportantModifier:d,baseClassName:c,maybePostfixModifierPosition:p}=o(e);let u=Boolean(p),b=t(u?c.substring(0,p):c);if(!b){if(!u){a=e+(a.length>0?" "+a:a);continue}if(b=t(c),!b){a=e+(a.length>0?" "+a:a);continue}u=!1}const g=m(r).join(":"),f=d?g+"!":g,h=f+b;if(l.includes(h))continue;l.push(h);const x=n(b,u);for(let o=0;o<x.length;++o){const e=x[o];l.push(f+e)}a=e+(a.length>0?" "+a:a)}return a})(e,l);return a(e,o),o}return function(){return i(f.apply(null,arguments))}}const y=e=>{const r=r=>r[e]||[];return r.isThemeGetter=!0,r},v=/^\[(?:([a-z-]+):)?(.+)\]$/i,w=/^\d+\/\d+$/,k=new Set(["px","full","screen"]),z=/^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,C=/\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,j=/^(rgba?|hsla?|hwb|(ok)?(lab|lch))\(.+\)$/,G=/^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,P=/^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,N=e=>I(e)||k.has(e)||w.test(e),S=e=>D(e,"length",F),I=e=>Boolean(e)&&!Number.isNaN(Number(e)),M=e=>D(e,"number",I),$=e=>Boolean(e)&&Number.isInteger(Number(e)),E=e=>e.endsWith("%")&&I(e.slice(0,-1)),O=e=>v.test(e),R=e=>z.test(e),W=new Set(["length","size","percentage"]),_=e=>D(e,W,H),B=e=>D(e,"position",H),T=new Set(["image","url"]),q=e=>D(e,T,K),A=e=>D(e,"",J),Q=()=>!0,D=(e,r,o)=>{const t=v.exec(e);return!!t&&(t[1]?"string"===typeof r?t[1]===r:r.has(t[1]):o(t[2]))},F=e=>C.test(e)&&!j.test(e),H=()=>!1,J=e=>G.test(e),K=e=>P.test(e),L=(Symbol.toStringTag,()=>{const e=y("colors"),r=y("spacing"),o=y("blur"),t=y("brightness"),n=y("borderColor"),l=y("borderRadius"),s=y("borderSpacing"),a=y("borderWidth"),i=y("contrast"),d=y("grayscale"),c=y("hueRotate"),p=y("invert"),u=y("gap"),b=y("gradientColorStops"),m=y("gradientColorStopPositions"),g=y("inset"),f=y("margin"),h=y("opacity"),x=y("padding"),v=y("saturate"),w=y("scale"),k=y("sepia"),z=y("skew"),C=y("space"),j=y("translate"),G=()=>["auto",O,r],P=()=>[O,r],W=()=>["",N,S],T=()=>["auto",I,O],D=()=>["","0",O],F=()=>[I,O];return{cacheSize:500,separator:":",theme:{colors:[Q],spacing:[N,S],blur:["none","",R,O],brightness:F(),borderColor:[e],borderRadius:["none","","full",R,O],borderSpacing:P(),borderWidth:W(),contrast:F(),grayscale:D(),hueRotate:F(),invert:D(),gap:P(),gradientColorStops:[e],gradientColorStopPositions:[E,S],inset:G(),margin:G(),opacity:F(),padding:P(),saturate:F(),scale:F(),sepia:D(),skew:F(),space:P(),translate:P()},classGroups:{aspect:[{aspect:["auto","square","video",O]}],container:["container"],columns:[{columns:[R]}],"break-after":[{"break-after":["auto","avoid","all","avoid-page","page","left","right","column"]}],"break-before":[{"break-before":["auto","avoid","all","avoid-page","page","left","right","column"]}],"break-inside":[{"break-inside":["auto","avoid","avoid-page","avoid-column"]}],"box-decoration":[{"box-decoration":["slice","clone"]}],box:[{box:["border","content"]}],display:["block","inline-block","inline","flex","inline-flex","table","inline-table","table-caption","table-cell","table-column","table-column-group","table-footer-group","table-header-group","table-row-group","table-row","flow-root","grid","inline-grid","contents","list-item","hidden"],float:[{float:["right","left","none","start","end"]}],clear:[{clear:["left","right","both","none","start","end"]}],isolation:["isolate","isolation-auto"],"object-fit":[{object:["contain","cover","fill","none","scale-down"]}],"object-position":[{object:["bottom","center","left","left-bottom","left-top","right","right-bottom","right-top","top",O]}],overflow:[{overflow:["auto","hidden","clip","visible","scroll"]}],"overflow-x":[{"overflow-x":["auto","hidden","clip","visible","scroll"]}],"overflow-y":[{"overflow-y":["auto","hidden","clip","visible","scroll"]}],overscroll:[{overscroll:["auto","contain","none"]}],"overscroll-x":[{"overscroll-x":["auto","contain","none"]}],"overscroll-y":[{"overscroll-y":["auto","contain","none"]}],position:["static","fixed","absolute","relative","sticky"],inset:[{inset:[g]}],"inset-x":[{"inset-x":[g]}],"inset-y":[{"inset-y":[g]}],start:[{start:[g]}],end:[{end:[g]}],top:[{top:[g]}],right:[{right:[g]}],bottom:[{bottom:[g]}],left:[{left:[g]}],visibility:["visible","invisible","collapse"],z:[{z:["auto",$,O]}],basis:[{basis:G()}],"flex-direction":[{flex:["row","row-reverse","col","col-reverse"]}],"flex-wrap":[{flex:["wrap","wrap-reverse","nowrap"]}],flex:[{flex:["1","auto","initial","none",O]}],grow:[{grow:D()}],shrink:[{shrink:D()}],order:[{order:["first","last","none",$,O]}],"grid-cols":[{"grid-cols":[Q]}],"col-start-end":[{col:["auto",{span:["full",$,O]},O]}],"col-start":[{"col-start":T()}],"col-end":[{"col-end":T()}],"grid-rows":[{"grid-rows":[Q]}],"row-start-end":[{row:["auto",{span:[$,O]},O]}],"row-start":[{"row-start":T()}],"row-end":[{"row-end":T()}],"grid-flow":[{"grid-flow":["row","col","dense","row-dense","col-dense"]}],"auto-cols":[{"auto-cols":["auto","min","max","fr",O]}],"auto-rows":[{"auto-rows":["auto","min","max","fr",O]}],gap:[{gap:[u]}],"gap-x":[{"gap-x":[u]}],"gap-y":[{"gap-y":[u]}],"justify-content":[{justify:["normal","start","end","center","between","around","evenly","stretch"]}],"justify-items":[{"justify-items":["start","end","center","stretch"]}],"justify-self":[{"justify-self":["auto","start","end","center","stretch"]}],"align-content":[{content:["normal","start","end","center","between","around","evenly","stretch","baseline"]}],"align-items":[{items:["start","end","center","baseline","stretch"]}],"align-self":[{self:["auto","start","end","center","stretch","baseline"]}],"place-content":[{"place-content":["start","end","center","between","around","evenly","stretch","baseline"]}],"place-items":[{"place-items":["start","end","center","baseline","stretch"]}],"place-self":[{"place-self":["auto","start","end","center","stretch"]}],p:[{p:[x]}],px:[{px:[x]}],py:[{py:[x]}],ps:[{ps:[x]}],pe:[{pe:[x]}],pt:[{pt:[x]}],pr:[{pr:[x]}],pb:[{pb:[x]}],pl:[{pl:[x]}],m:[{m:[f]}],mx:[{mx:[f]}],my:[{my:[f]}],ms:[{ms:[f]}],me:[{me:[f]}],mt:[{mt:[f]}],mr:[{mr:[f]}],mb:[{mb:[f]}],ml:[{ml:[f]}],"space-x":[{"space-x":[C]}],"space-x-reverse":["space-x-reverse"],"space-y":[{"space-y":[C]}],"space-y-reverse":["space-y-reverse"],w:[{w:["auto","min","max","fit","svw","lvw","dvw",O,r]}],"min-w":[{"min-w":[O,r,"min","max","fit"]}],"max-w":[{"max-w":[O,r,"none","full","min","max","fit","prose",{screen:[R]},R]}],h:[{h:[O,r,"auto","min","max","fit","svh","lvh","dvh"]}],"min-h":[{"min-h":[O,r,"min","max","fit","svh","lvh","dvh"]}],"max-h":[{"max-h":[O,r,"min","max","fit","svh","lvh","dvh"]}],size:[{size:[O,r,"auto","min","max","fit"]}],"font-size":[{text:["base",R,S]}],"font-smoothing":["antialiased","subpixel-antialiased"],"font-style":["italic","not-italic"],"font-weight":[{font:["thin","extralight","light","normal","medium","semibold","bold","extrabold","black",M]}],"font-family":[{font:[Q]}],"fvn-normal":["normal-nums"],"fvn-ordinal":["ordinal"],"fvn-slashed-zero":["slashed-zero"],"fvn-figure":["lining-nums","oldstyle-nums"],"fvn-spacing":["proportional-nums","tabular-nums"],"fvn-fraction":["diagonal-fractions","stacked-fractons"],tracking:[{tracking:["tighter","tight","normal","wide","wider","widest",O]}],"line-clamp":[{"line-clamp":["none",I,M]}],leading:[{leading:["none","tight","snug","normal","relaxed","loose",N,O]}],"list-image":[{"list-image":["none",O]}],"list-style-type":[{list:["none","disc","decimal",O]}],"list-style-position":[{list:["inside","outside"]}],"placeholder-color":[{placeholder:[e]}],"placeholder-opacity":[{"placeholder-opacity":[h]}],"text-alignment":[{text:["left","center","right","justify","start","end"]}],"text-color":[{text:[e]}],"text-opacity":[{"text-opacity":[h]}],"text-decoration":["underline","overline","line-through","no-underline"],"text-decoration-style":[{decoration:["solid","dashed","dotted","double","none","wavy"]}],"text-decoration-thickness":[{decoration:["auto","from-font",N,S]}],"underline-offset":[{"underline-offset":["auto",N,O]}],"text-decoration-color":[{decoration:[e]}],"text-transform":["uppercase","lowercase","capitalize","normal-case"],"text-overflow":["truncate","text-ellipsis","text-clip"],"text-wrap":[{text:["wrap","nowrap","balance","pretty"]}],indent:[{indent:P()}],"vertical-align":[{align:["baseline","top","middle","bottom","text-top","text-bottom","sub","super",O]}],whitespace:[{whitespace:["normal","nowrap","pre","pre-line","pre-wrap","break-spaces"]}],break:[{break:["normal","words","all","keep"]}],hyphens:[{hyphens:["none","manual","auto"]}],content:[{content:["none",O]}],"bg-attachment":[{bg:["fixed","local","scroll"]}],"bg-clip":[{"bg-clip":["border","padding","content","text"]}],"bg-opacity":[{"bg-opacity":[h]}],"bg-origin":[{"bg-origin":["border","padding","content"]}],"bg-position":[{bg:["bottom","center","left","left-bottom","left-top","right","right-bottom","right-top","top",B]}],"bg-repeat":[{bg:["no-repeat",{repeat:["","x","y","round","space"]}]}],"bg-size":[{bg:["auto","cover","contain",_]}],"bg-image":[{bg:["none",{"gradient-to":["t","tr","r","br","b","bl","l","tl"]},q]}],"bg-color":[{bg:[e]}],"gradient-from-pos":[{from:[m]}],"gradient-via-pos":[{via:[m]}],"gradient-to-pos":[{to:[m]}],"gradient-from":[{from:[b]}],"gradient-via":[{via:[b]}],"gradient-to":[{to:[b]}],rounded:[{rounded:[l]}],"rounded-s":[{"rounded-s":[l]}],"rounded-e":[{"rounded-e":[l]}],"rounded-t":[{"rounded-t":[l]}],"rounded-r":[{"rounded-r":[l]}],"rounded-b":[{"rounded-b":[l]}],"rounded-l":[{"rounded-l":[l]}],"rounded-ss":[{"rounded-ss":[l]}],"rounded-se":[{"rounded-se":[l]}],"rounded-ee":[{"rounded-ee":[l]}],"rounded-es":[{"rounded-es":[l]}],"rounded-tl":[{"rounded-tl":[l]}],"rounded-tr":[{"rounded-tr":[l]}],"rounded-br":[{"rounded-br":[l]}],"rounded-bl":[{"rounded-bl":[l]}],"border-w":[{border:[a]}],"border-w-x":[{"border-x":[a]}],"border-w-y":[{"border-y":[a]}],"border-w-s":[{"border-s":[a]}],"border-w-e":[{"border-e":[a]}],"border-w-t":[{"border-t":[a]}],"border-w-r":[{"border-r":[a]}],"border-w-b":[{"border-b":[a]}],"border-w-l":[{"border-l":[a]}],"border-opacity":[{"border-opacity":[h]}],"border-style":[{border:["solid","dashed","dotted","double","none","hidden"]}],"divide-x":[{"divide-x":[a]}],"divide-x-reverse":["divide-x-reverse"],"divide-y":[{"divide-y":[a]}],"divide-y-reverse":["divide-y-reverse"],"divide-opacity":[{"divide-opacity":[h]}],"divide-style":[{divide:["solid","dashed","dotted","double","none"]}],"border-color":[{border:[n]}],"border-color-x":[{"border-x":[n]}],"border-color-y":[{"border-y":[n]}],"border-color-s":[{"border-s":[n]}],"border-color-e":[{"border-e":[n]}],"border-color-t":[{"border-t":[n]}],"border-color-r":[{"border-r":[n]}],"border-color-b":[{"border-b":[n]}],"border-color-l":[{"border-l":[n]}],"divide-color":[{divide:[n]}],"outline-style":[{outline:["","solid","dashed","dotted","double","none"]}],"outline-offset":[{"outline-offset":[N,O]}],"outline-w":[{outline:[N,S]}],"outline-color":[{outline:[e]}],"ring-w":[{ring:W()}],"ring-w-inset":["ring-inset"],"ring-color":[{ring:[e]}],"ring-opacity":[{"ring-opacity":[h]}],"ring-offset-w":[{"ring-offset":[N,S]}],"ring-offset-color":[{"ring-offset":[e]}],shadow:[{shadow:["","inner","none",R,A]}],"shadow-color":[{shadow:[Q]}],opacity:[{opacity:[h]}],"mix-blend":[{"mix-blend":["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity","plus-lighter","plus-darker"]}],"bg-blend":[{"bg-blend":["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","hard-light","soft-light","difference","exclusion","hue","saturation","color","luminosity"]}],filter:[{filter:["","none"]}],blur:[{blur:[o]}],brightness:[{brightness:[t]}],contrast:[{contrast:[i]}],"drop-shadow":[{"drop-shadow":["","none",R,O]}],grayscale:[{grayscale:[d]}],"hue-rotate":[{"hue-rotate":[c]}],invert:[{invert:[p]}],saturate:[{saturate:[v]}],sepia:[{sepia:[k]}],"backdrop-filter":[{"backdrop-filter":["","none"]}],"backdrop-blur":[{"backdrop-blur":[o]}],"backdrop-brightness":[{"backdrop-brightness":[t]}],"backdrop-contrast":[{"backdrop-contrast":[i]}],"backdrop-grayscale":[{"backdrop-grayscale":[d]}],"backdrop-hue-rotate":[{"backdrop-hue-rotate":[c]}],"backdrop-invert":[{"backdrop-invert":[p]}],"backdrop-opacity":[{"backdrop-opacity":[h]}],"backdrop-saturate":[{"backdrop-saturate":[v]}],"backdrop-sepia":[{"backdrop-sepia":[k]}],"border-collapse":[{border:["collapse","separate"]}],"border-spacing":[{"border-spacing":[s]}],"border-spacing-x":[{"border-spacing-x":[s]}],"border-spacing-y":[{"border-spacing-y":[s]}],"table-layout":[{table:["auto","fixed"]}],caption:[{caption:["top","bottom"]}],transition:[{transition:["none","all","","colors","opacity","shadow","transform",O]}],duration:[{duration:F()}],ease:[{ease:["linear","in","out","in-out",O]}],delay:[{delay:F()}],animate:[{animate:["none","spin","ping","pulse","bounce",O]}],transform:[{transform:["","gpu","none"]}],scale:[{scale:[w]}],"scale-x":[{"scale-x":[w]}],"scale-y":[{"scale-y":[w]}],rotate:[{rotate:[$,O]}],"translate-x":[{"translate-x":[j]}],"translate-y":[{"translate-y":[j]}],"skew-x":[{"skew-x":[z]}],"skew-y":[{"skew-y":[z]}],"transform-origin":[{origin:["center","top","top-right","right","bottom-right","bottom","bottom-left","left","top-left",O]}],accent:[{accent:["auto",e]}],appearance:[{appearance:["none","auto"]}],cursor:[{cursor:["auto","default","pointer","wait","text","move","help","not-allowed","none","context-menu","progress","cell","crosshair","vertical-text","alias","copy","no-drop","grab","grabbing","all-scroll","col-resize","row-resize","n-resize","e-resize","s-resize","w-resize","ne-resize","nw-resize","se-resize","sw-resize","ew-resize","ns-resize","nesw-resize","nwse-resize","zoom-in","zoom-out",O]}],"caret-color":[{caret:[e]}],"pointer-events":[{"pointer-events":["none","auto"]}],resize:[{resize:["none","y","x",""]}],"scroll-behavior":[{scroll:["auto","smooth"]}],"scroll-m":[{"scroll-m":P()}],"scroll-mx":[{"scroll-mx":P()}],"scroll-my":[{"scroll-my":P()}],"scroll-ms":[{"scroll-ms":P()}],"scroll-me":[{"scroll-me":P()}],"scroll-mt":[{"scroll-mt":P()}],"scroll-mr":[{"scroll-mr":P()}],"scroll-mb":[{"scroll-mb":P()}],"scroll-ml":[{"scroll-ml":P()}],"scroll-p":[{"scroll-p":P()}],"scroll-px":[{"scroll-px":P()}],"scroll-py":[{"scroll-py":P()}],"scroll-ps":[{"scroll-ps":P()}],"scroll-pe":[{"scroll-pe":P()}],"scroll-pt":[{"scroll-pt":P()}],"scroll-pr":[{"scroll-pr":P()}],"scroll-pb":[{"scroll-pb":P()}],"scroll-pl":[{"scroll-pl":P()}],"snap-align":[{snap:["start","end","center","align-none"]}],"snap-stop":[{snap:["normal","always"]}],"snap-type":[{snap:["none","x","y","both"]}],"snap-strictness":[{snap:["mandatory","proximity"]}],touch:[{touch:["auto","none","manipulation"]}],"touch-x":[{"touch-pan":["x","left","right"]}],"touch-y":[{"touch-pan":["y","up","down"]}],"touch-pz":["touch-pinch-zoom"],select:[{select:["none","text","all","auto"]}],"will-change":[{"will-change":["auto","scroll","contents","transform",O]}],fill:[{fill:[e,"none"]}],"stroke-w":[{stroke:[N,S,M]}],stroke:[{stroke:[e,"none"]}],sr:["sr-only","not-sr-only"],"forced-color-adjust":[{"forced-color-adjust":["auto","none"]}]},conflictingClassGroups:{overflow:["overflow-x","overflow-y"],overscroll:["overscroll-x","overscroll-y"],inset:["inset-x","inset-y","start","end","top","right","bottom","left"],"inset-x":["right","left"],"inset-y":["top","bottom"],flex:["basis","grow","shrink"],gap:["gap-x","gap-y"],p:["px","py","ps","pe","pt","pr","pb","pl"],px:["pr","pl"],py:["pt","pb"],m:["mx","my","ms","me","mt","mr","mb","ml"],mx:["mr","ml"],my:["mt","mb"],size:["w","h"],"font-size":["leading"],"fvn-normal":["fvn-ordinal","fvn-slashed-zero","fvn-figure","fvn-spacing","fvn-fraction"],"fvn-ordinal":["fvn-normal"],"fvn-slashed-zero":["fvn-normal"],"fvn-figure":["fvn-normal"],"fvn-spacing":["fvn-normal"],"fvn-fraction":["fvn-normal"],"line-clamp":["display","overflow"],rounded:["rounded-s","rounded-e","rounded-t","rounded-r","rounded-b","rounded-l","rounded-ss","rounded-se","rounded-ee","rounded-es","rounded-tl","rounded-tr","rounded-br","rounded-bl"],"rounded-s":["rounded-ss","rounded-es"],"rounded-e":["rounded-se","rounded-ee"],"rounded-t":["rounded-tl","rounded-tr"],"rounded-r":["rounded-tr","rounded-br"],"rounded-b":["rounded-br","rounded-bl"],"rounded-l":["rounded-tl","rounded-bl"],"border-spacing":["border-spacing-x","border-spacing-y"],"border-w":["border-w-s","border-w-e","border-w-t","border-w-r","border-w-b","border-w-l"],"border-w-x":["border-w-r","border-w-l"],"border-w-y":["border-w-t","border-w-b"],"border-color":["border-color-s","border-color-e","border-color-t","border-color-r","border-color-b","border-color-l"],"border-color-x":["border-color-r","border-color-l"],"border-color-y":["border-color-t","border-color-b"],"scroll-m":["scroll-mx","scroll-my","scroll-ms","scroll-me","scroll-mt","scroll-mr","scroll-mb","scroll-ml"],"scroll-mx":["scroll-mr","scroll-ml"],"scroll-my":["scroll-mt","scroll-mb"],"scroll-p":["scroll-px","scroll-py","scroll-ps","scroll-pe","scroll-pt","scroll-pr","scroll-pb","scroll-pl"],"scroll-px":["scroll-pr","scroll-pl"],"scroll-py":["scroll-pt","scroll-pb"],touch:["touch-x","touch-y","touch-pz"],"touch-x":["touch"],"touch-y":["touch"],"touch-pz":["touch"]},conflictingClassGroupModifiers:{"font-size":["leading"]}}}),U=x(L)}}]);
//# sourceMappingURL=vendor.tailwind-merge.9863f2c9.js.map