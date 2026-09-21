/* Set your WhatsApp number here in international format, digits only (for example 919812345678). */
var WA_NUMBER = "917070990777";

var LANG = "en";
var I18N_KEYS = [];
var DISTRICTS = ["Una","Shimla","Kullu","Mandi","Kangra","Solan","Sirmaur"];
var DIST_HI = {Una:"ऊना",Shimla:"शिमला",Kullu:"कुल्लू",Mandi:"मंडी",Kangra:"काँगड़ा",Solan:"सोलन",Sirmaur:"सिरमौर"};
var RATES = [
  {d:"Una",p:"Una",ph:"ऊना",u:"Plots and farmland",uh:"प्लॉट और खेती की ज़मीन",v:"₹ 90,000 – 2.5 lakh"},
  {d:"Una",p:"Amb",ph:"अंब",u:"Farmland and plots",uh:"खेती की ज़मीन और प्लॉट",v:"₹ 80,000 – 2 lakh"},
  {d:"Kangra",p:"Kangra",ph:"काँगड़ा",u:"Plots and farmland",uh:"प्लॉट और खेती की ज़मीन",v:"₹ 1 – 1.2 lakh"},
  {d:"Kangra",p:"Dharamshala",ph:"धर्मशाला",u:"Building plots, view land",uh:"मकान के प्लॉट, नज़ारे वाली ज़मीन",v:"₹ 1.5 – 5 lakh"},
  {d:"Kangra",p:"Ranital",ph:"रानीताल",u:"Farmland and plots",uh:"खेती की ज़मीन और प्लॉट",v:"₹ 60,000 – 80,000"},
  {d:"Shimla",p:"Shimla",ph:"शिमला",u:"Building plots",uh:"मकान के प्लॉट",v:"₹ 3 – 10 lakh"},
  {d:"Kullu",p:"Kullu",ph:"कुल्लू",u:"Orchards and plots",uh:"बागान और प्लॉट",v:"₹ 80,000 – 2.5 lakh"},
  {d:"Kullu",p:"Manali",ph:"मनाली",u:"Orchards, building plots",uh:"बागान, मकान के प्लॉट",v:"₹ 2 – 8 lakh"}
];

function t(en, hi){ return LANG === "hi" ? hi : en; }

function applyLang(){
  document.documentElement.setAttribute("data-lang", LANG);
  document.documentElement.setAttribute("lang", LANG === "hi" ? "hi" : "en");
  var nodes = document.querySelectorAll("[data-hi]");
  for (var i = 0; i < nodes.length; i++){
    var n = nodes[i];
    if (!n.hasAttribute("data-en")) n.setAttribute("data-en", n.textContent);
    n.textContent = LANG === "hi" ? n.getAttribute("data-hi") : n.getAttribute("data-en");
  }
  document.getElementById("lang-en").setAttribute("aria-pressed", String(LANG === "en"));
  document.getElementById("lang-hi").setAttribute("aria-pressed", String(LANG === "hi"));
  renderRates(); renderDistrictSelect();
}

function renderRates(){
  var tb = document.getElementById("rates-body");
  tb.innerHTML = "";
  var last = "";
  RATES.forEach(function(x){
    var tr = document.createElement("tr");
    if (x.d !== last && last !== "") tr.className = "first";
    var th = document.createElement("th"); th.scope = "row";
    if (x.d !== last){ th.className = "dist"; th.textContent = t(x.d, DIST_HI[x.d]); }
    else { th.className = "dist-cell"; th.textContent = ""; th.setAttribute("aria-label", t(x.d, DIST_HI[x.d])); }
    var c2 = document.createElement("td"); c2.textContent = t(x.p, x.ph);
    var c3 = document.createElement("td"); c3.textContent = t(x.u, x.uh);
    var c4 = document.createElement("td"); c4.className = "num"; c4.textContent = x.v;
    tr.appendChild(th); tr.appendChild(c2); tr.appendChild(c3); tr.appendChild(c4);
    tb.appendChild(tr);
    last = x.d;
  });
}

function renderDistrictSelect(){
  var s = document.getElementById("f-district");
  var cur = s.value;
  s.innerHTML = "";
  DISTRICTS.concat(["Other"]).forEach(function(d){
    var o = document.createElement("option"); o.value = d;
    o.textContent = d === "Other" ? t("Other district","अन्य ज़िला") : t(d, DIST_HI[d]);
    s.appendChild(o);
  });
  if (cur) s.value = cur;
}

function waHref(text){ return WA_NUMBER ? "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(text) : ""; }

document.getElementById("enquire").addEventListener("submit", function(e){
  e.preventDefault();
  var role = document.getElementById("role-sell").checked ? "sell" : "buy";
  var name = document.getElementById("f-name").value.trim();
  var phone = document.getElementById("f-phone").value.trim();
  var dist = document.getElementById("f-district").value;
  var vill = document.getElementById("f-village").value.trim();
  var msg = document.getElementById("f-msg").value.trim();
  var text = (role === "sell" ? "I want to sell land in Himachal." : "I want to buy land in Himachal.") +
    "\nName: " + name + "\nPhone: " + phone + "\nDistrict: " + dist + (vill ? "\nVillage/area: " + vill : "") + (msg ? "\nDetails: " + msg : "");
  var out = document.getElementById("out");
  out.hidden = false;
  out.innerHTML = "";
  var pre = document.createElement("div"); pre.textContent = text; out.appendChild(pre);
  var act = document.createElement("div"); act.className = "actions"; out.appendChild(act);
  var link = waHref(text);
  if (link){
    try { window.open(link, "_blank", "noopener"); } catch(err){}
    var a = document.createElement("a"); a.className = "btn sm"; a.href = link; a.target = "_blank"; a.rel = "noopener";
    a.textContent = t("Send on WhatsApp","व्हाट्सऐप पर भेजें"); act.appendChild(a);
  }
  var cp = document.createElement("button"); cp.type = "button"; cp.className = "btn sm ghost";
  cp.textContent = t("Copy message","संदेश कॉपी करें");
  cp.addEventListener("click", function(){
    try { navigator.clipboard.writeText(text).then(function(){ cp.textContent = t("Copied","कॉपी हो गया"); }); }
    catch(err){ cp.textContent = t("Select the text above and copy it","ऊपर का पाठ चुनकर कॉपी करें"); }
  });
  act.appendChild(cp);
});

var wl = document.querySelectorAll(".wa-link");
for (var i = 0; i < wl.length; i++){
  if (WA_NUMBER) wl[i].href = "https://wa.me/" + WA_NUMBER;
}

document.getElementById("lang-en").addEventListener("click", function(){ LANG = "en"; try{localStorage.setItem("jl-lang","en")}catch(e){} applyLang(); });
document.getElementById("lang-hi").addEventListener("click", function(){ LANG = "hi"; try{localStorage.setItem("jl-lang","hi")}catch(e){} applyLang(); });

try { var saved = localStorage.getItem("jl-lang"); if (saved === "hi") LANG = "hi"; } catch(e){}
applyLang();
