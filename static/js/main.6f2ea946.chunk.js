(this.webpackJsonpfrontend=this.webpackJsonpfrontend||[]).push([[0],{36:function(e,t,n){},37:function(e,t,n){"use strict";n.r(t);var a=n(0),c=n.n(a),r=n(12),s=n.n(r),o=n(5),i=n.n(o),l=n(8),d=n(7),j=n(2),u=n(21),h=n.n(u),b=n(40),x=n(41),O=n(22),m=n(46),f=n(42),p=n(43),v=n(45),g=n(44),k=n(26),S=n(1),y=h()(window.fetch),w=Object({NODE_ENV:"production",PUBLIC_URL:"",WDS_SOCKET_HOST:void 0,WDS_SOCKET_PATH:void 0,WDS_SOCKET_PORT:void 0,FAST_REFRESH:!0}).REACT_APP_BACKEND_URL||"http://localhost:5000",C=function(){var e=JSON.parse(localStorage.getItem("cachedFormData")||"{}"),t=Object(k.a)({defaultValues:Object(j.a)({scOnly:!0},e)}),n=t.register,c=t.handleSubmit,r=Object(a.useState)(""),s=Object(d.a)(r,2),o=s[0],u=s[1],h=Object(a.useState)({}),C=Object(d.a)(h,2),E=C[0],I=E.taskId,T=E.videoId,_=C[1],N=Object(a.useState)(null),R=Object(d.a)(N,2),L=R[0],D=R[1],A=Object(a.useState)(!1),U=Object(d.a)(A,2),F=U[0],P=U[1],B=Object(a.useState)(null),J=Object(d.a)(B,2),K=J[0],H=J[1];Object(a.useEffect)((function(){fetch(w).catch((function(){return D("\u26a0 Backend unavailable \u26a0")}))}),[]);var M=function(){var e=Object(l.a)(i.a.mark((function e(t){var n,a,c,r,s,o;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return D(null),_({}),H(null),P(!0),n=JSON.stringify(t),localStorage.setItem("cachedFormData",n),e.prev=6,e.next=9,fetch("".concat(w,"/chat"),{method:"POST",headers:{"Content-Type":"application/json"},body:n});case 9:if((a=e.sent).ok){e.next=15;break}return e.next=13,a.json();case 13:throw c=e.sent,new Error(null===c||void 0===c?void 0:c.message);case 15:return e.next=17,a.json();case 17:r=e.sent,s=r.id,o=r.videoId,_({taskId:s,videoId:o}),y("".concat(w,"/chat/status/").concat(s),{retryOn:function(){var e=Object(l.a)(i.a.mark((function e(t,n,a){var c;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,null===a||void 0===a?void 0:a.json();case 2:if(e.t1=c=e.sent,e.t0=null===e.t1,e.t0){e.next=6;break}e.t0=void 0===c;case 6:if(!e.t0){e.next=10;break}e.t2=void 0,e.next=11;break;case 10:e.t2=c.state;case 11:return e.t3=e.t2,e.abrupt("return","SENT"===e.t3);case 13:case"end":return e.stop()}}),e)})));return function(t,n,a){return e.apply(this,arguments)}}(),retryDelay:2e3}).then(Object(l.a)(i.a.mark((function e(){var t,n;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(w,"/chat/").concat(s));case 2:if(t=e.sent,P(!1),!t.ok){e.next=12;break}return e.t0=H,e.next=8,t.json();case 8:e.t1=e.sent,(0,e.t0)(e.t1),e.next=16;break;case 12:return e.next=14,t.json();case 14:n=e.sent,D(null===n||void 0===n?void 0:n.message);case 16:case"end":return e.stop()}}),e)})))),e.next=28;break;case 24:e.prev=24,e.t0=e.catch(6),D(e.t0.message),P(!1);case 28:case"end":return e.stop()}}),e,null,[[6,24]])})));return function(t){return e.apply(this,arguments)}}(),V=function(){var e=Object(l.a)(i.a.mark((function e(){var t,n,a,c,r;return i.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,fetch("".concat(w,"/chat/").concat(I,"/csv"));case 2:if(!(t=e.sent).ok){e.next=18;break}return e.next=6,t.blob();case 6:n=e.sent,a=URL.createObjectURL(n),(c=document.createElement("a")).style.display="none",c.href=a,c.download="".concat(I,".csv"),document.body.appendChild(c),c.click(),URL.revokeObjectURL(a),c.remove(),e.next=22;break;case 18:return e.next=20,t.json();case 20:r=e.sent,D(null===r||void 0===r?void 0:r.message);case 22:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return Object(S.jsxs)(b.a,{fluid:"xl",children:[Object(S.jsx)(x.a,{children:Object(S.jsxs)(O.a,{children:[Object(S.jsx)("h1",{children:"Chat Downloader"}),Object(S.jsx)("hr",{})]})}),Object(S.jsx)(m.a,{className:"pb-1 px-2",onSubmit:c(M),children:Object(S.jsxs)(m.a.Group,{as:x.a,controlId:"formSearch",children:[Object(S.jsx)(O.a,{children:Object(S.jsx)(m.a.Control,Object(j.a)({type:"search",className:"mx-0",required:!0,tabIndex:1,placeholder:"YouTube Link"},n("url")))}),Object(S.jsx)(f.a,{variant:"primary",type:"submit",className:"col-3",tabIndex:3,disabled:F,children:F?Object(S.jsx)(p.a,{animation:"border",size:"sm"}):"Load"}),Object(S.jsx)(m.a.Group,{as:x.a,className:"my-3",children:Object(S.jsx)(O.a,{children:Object(S.jsx)(m.a.Check,Object(j.a)({type:"checkbox",label:"Super Chats only",tabIndex:2},n("scOnly")))})})]})}),L&&Object(S.jsx)(v.a,{variant:"danger",dismissible:!0,onClose:function(){return D("")},children:L}),K?Object(S.jsxs)(S.Fragment,{children:[Object(S.jsxs)(x.a,{className:"pb-3",children:[Object(S.jsxs)(O.a,{md:4,children:[Object(S.jsx)("h3",{children:"Chat messages"}),K.length?Object(S.jsxs)("small",{children:[o?"Showing":"Loading"," ",K.filter((function(e){return o?e.message&&e.message.match(new RegExp(o,"i")):e})).length," messages."]}):Object(S.jsxs)("small",{children:["Loaded ",K.length," messages. Maybe try different filters?"]})]}),Object(S.jsx)(O.a,{md:4,children:Object(S.jsx)(m.a.Control,{type:"search",className:"mb-4",placeholder:"Search message...",value:o,onChange:function(e){return u(e.target.value)}})}),Object(S.jsx)(O.a,{md:4,style:{textAlign:"right"},children:Object(S.jsx)(f.a,{variant:"success",onClick:V,children:"Download CSV"})})]}),Object(S.jsxs)(g.a,{variant:"dark",hover:!0,children:[Object(S.jsx)("thead",{children:Object(S.jsxs)("tr",{children:[Object(S.jsx)("th",{children:"Time"}),Object(S.jsx)("th",{children:"Amount"}),Object(S.jsx)("th",{children:"Author"}),Object(S.jsx)("th",{children:"Message"})]})}),Object(S.jsx)("tbody",{children:K.filter((function(e){return o?e.message&&e.message.match(new RegExp(o,"i")):e})).map((function(e,t){return Object(S.jsxs)("tr",{children:[Object(S.jsx)("td",{children:Object(S.jsx)("a",{href:"https://youtu.be/".concat(T,"?t=").concat(e.time>0?e.time.toFixed(0):0),children:e.time_text})}),Object(S.jsx)("td",{children:e.amount||"-"}),Object(S.jsx)("td",{children:e.author}),Object(S.jsx)("td",{children:e.message||""})]},t)}))})]})]}):null]})};n(36);s.a.render(Object(S.jsx)(c.a.StrictMode,{children:Object(S.jsx)(C,{})}),document.getElementById("root"))}},[[37,1,2]]]);
//# sourceMappingURL=main.6f2ea946.chunk.js.map