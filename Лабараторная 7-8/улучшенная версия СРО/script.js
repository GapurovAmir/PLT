const presets = {
  chilled: {name:"Охлаждённый продукт", temp:[0,5], ph:[4,7], mass:[95,105], massLabel:"95–105% от условной массы упаковки"},
  dry: {name:"Сухой продукт", temp:[10,25], ph:[4,8], mass:[95,105], massLabel:"95–105% от условной массы упаковки"},
  frozen: {name:"Замороженный продукт", temp:[-25,-18], ph:[4,8], mass:[95,105], massLabel:"95–105% от условной массы упаковки"}
};
const defaults=JSON.parse(JSON.stringify(presets));
try{const sv=JSON.parse(localStorage.getItem("qc_limits")||"null");if(sv)for(const k in sv)if(presets[k])["temp","ph","mass"].forEach(f=>{if(Array.isArray(sv[k][f]))presets[k][f]=sv[k][f];});}catch(e){}
// Значения демонстрационные, не являются официальными пищевыми нормативами.
let history = [];
try{history=JSON.parse(localStorage.getItem("qc_history")||"[]")}catch(e){history=[]}
history.forEach((x,i)=>{x.id=x.id||Date.now()+i;});
let filter="all",q="";
const save=()=>{try{localStorage.setItem("qc_history",JSON.stringify(history))}catch(e){}};
let lastReport="";
const $ = id => document.getElementById(id);
const form = $("qualityForm");

function renderLimits(){
  const p = presets[$("category").value];
  $("limitDescription").textContent = p.name;
  $("limitsText").innerHTML = `
    <span class="limit-chip">Температура: ${p.temp[0]}…${p.temp[1]} °C</span>
    <span class="limit-chip">pH: ${p.ph[0]}…${p.ph[1]}</span>
    <span class="limit-chip">Масса: ${p.mass[0]}…${p.mass[1]}%</span>`;
}
function inRange(value, range){ return value >= range[0] && value <= range[1]; }
function runCheck(data){
  const p = presets[data.category];
  const massPercent = data.mass / data.nominalMass * 100;
  const checks = [
    {name:"Температура", value:`${data.temperature.toFixed(1)} °C`, rule:`Допустимый учебный диапазон: ${p.temp[0]}…${p.temp[1]} °C`, ok:inRange(data.temperature,p.temp)},
    {name:"Уровень pH", value:data.ph.toFixed(1), rule:`Допустимый учебный диапазон: ${p.ph[0]}…${p.ph[1]}`, ok:inRange(data.ph,p.ph)},
    {name:"Масса упаковки", value:`${data.mass.toFixed(1)} г (${massPercent.toFixed(1)}%)`, rule:`Условный диапазон: ${p.mass[0]}…${p.mass[1]}% от ${data.nominalMass} г`, ok:inRange(massPercent,p.mass)},
    {name:"Визуальный осмотр", value:data.visual === "ok" ? "Без видимых отклонений" : "Обнаружены отклонения", rule:"Результат ручного визуального осмотра", ok:data.visual === "ok"}
  ];
  const rg={"Температура":[p.temp,data.temperature," °C"],"Уровень pH":[p.ph,data.ph,""],"Масса упаковки":[p.mass,massPercent,"%"]};
  checks.forEach(c=>{const x=rg[c.name];if(x)c.g=[x[0][0],x[0][1],x[1]];if(x&&!c.ok){const low=x[1]<x[0][0];c.note=`${low?"Ниже":"Выше"} допустимого на ${(low?x[0][0]-x[1]:x[1]-x[0][1]).toFixed(1)}${x[2]}`;}});
  return {checks, passed:checks.every(c=>c.ok), issues:checks.filter(c=>!c.ok).length};
}
function renderReport(data, result){
  $("emptyState").hidden = true;
  const el = $("resultContent"); el.hidden = false;
  const status = result.passed ? "pass" : "fail";
  el.innerHTML = `
    <div class="result-summary ${status}">
      <div class="result-icon">${result.passed ? "✓" : "!"}</div>
      <div><h3>${result.passed ? "Отклонения не обнаружены" : "Обнаружены отклонения"}</h3>
      <p>${result.passed ? "Все проверенные показатели в заданных учебных диапазонах." : `Показателей вне диапазона: ${result.issues}. Проверьте строки ниже.`}</p></div>
    </div>
    <div class="report-meta">
      <div class="meta-box"><span>Продукт</span><strong>${escapeHTML(data.productName)}</strong></div>
      <div class="meta-box"><span>Номер партии</span><strong>${escapeHTML(data.batchNumber)}</strong></div>
      <div class="meta-box"><span>Категория</span><strong>${presets[data.category].name}</strong></div>
    </div>
    <div class="checks">${result.checks.map(c=>`<div class="check-row">
      <div><div class="check-name">${c.name}</div><div class="check-detail">${c.rule}<br>Получено: ${c.value}${c.note?`<br><b class="note">${c.note}</b>`:""}${c.g?gauge(c.g):""}</div></div>
      <span class="check-status ${c.ok?"pass":"fail"}">${c.ok?"В НОРМЕ":"ОТКЛОНЕНИЕ"}</span>
    </div>`).join("")}</div>
    ${adviceHTML(result)}<p class="report-note">Отчёт является учебной оценкой по встроенным демонстрационным диапазонам. Он не подтверждает безопасность продукта и не заменяет лабораторные исследования или официальные требования.</p>`;
}
function escapeHTML(value){
  return String(value).replace(/[&<>"']/g, ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function renderHistory(){
  const n=history.length, pass=history.filter(x=>x.passed).length, rate=n?Math.round(pass/n*100):0;
  $("checkedCount").textContent=n; $("passedCount").textContent=pass; $("issueCount").textContent=n-pass;
  $("rateBar").style.width=rate+"%";
  $("rateText").textContent=n?`Без отклонений: ${rate}% партий`:"Статистика появится после первой проверки";
  $("ribbon").innerHTML=history.slice(0,24).reverse().map(x=>`<i class="${x.passed?"pass":"fail"}" title="${escapeHTML(x.batchNumber)}"></i>`).join("");
  const list=history.filter(x=>(filter==="all"||(filter==="pass")===x.passed)&&(!q||(x.batchNumber+" "+x.productName).toLowerCase().includes(q)));
  $("historyEmpty").hidden=n>0; $("historyTable").hidden=!list.length; $("noMatch").hidden=!(n>0&&!list.length);
  $("historyBody").innerHTML=list.map(x=>`<tr><td>${escapeHTML(x.batchNumber)}</td><td>${escapeHTML(x.productName)}</td><td>${x.time}</td><td><span class="table-badge ${x.passed?"pass":"fail"}">${x.passed?"Соответствует":"Отклонения"}</span></td><td class="row-actions"><button class="row-btn" data-open="${x.id}">Открыть отчёт</button><button class="row-btn" data-del="${x.id}" aria-label="Удалить запись">×</button></td></tr>`).join("");
}
$("category").addEventListener("change",()=>{renderLimits();fillSettings();});
form.addEventListener("submit",event=>{
  event.preventDefault();
  const productName=$("productName").value.trim(), batchNumber=$("batchNumber").value.trim();
  const temperature=Number($("temperature").value), ph=Number($("ph").value), mass=Number($("mass").value);
  if(!productName || !batchNumber){showError("Заполните название продукта и номер партии.");return;}
  if(!Number.isFinite(temperature)||!Number.isFinite(ph)||!Number.isFinite(mass)||ph<0||ph>14||mass<=0){
    showError("Проверьте данные: pH должен быть от 0 до 14, масса — больше нуля.");return;
  }
  const nominalMass = $("nominal").value===""? mass : Number($("nominal").value);
  if(!Number.isFinite(nominalMass)||nominalMass<=0){showError("Номинальная масса должна быть больше нуля.");return;}
  const data={productName,batchNumber,category:$("category").value,temperature,ph,mass,nominalMass,visual:document.querySelector('input[name="visual"]:checked').value};
  const result=runCheck(data);
  if(history.some(x=>x.batchNumber.toLowerCase()===batchNumber.toLowerCase()))toast("Партия с таким номером уже есть в журнале");
  renderReport(data,result);
  history.unshift({...data,id:Date.now(),passed:result.passed,time:new Date().toLocaleString("ru-RU")});
  save(); renderHistory(); showError("");
  $("resultActions").hidden=false;
  lastReport=reportText(data,result);
  $("resultPanel").scrollIntoView({behavior:"smooth",block:"start"});
});
form.addEventListener("reset",()=>setTimeout(()=>{ $("resultContent").hidden=true;$("emptyState").hidden=false;$("resultActions").hidden=true;showError("");["temperature","ph","mass"].forEach(updateHint); },0));
$("clearHistory").addEventListener("click",()=>{if(history.length&&confirm("Очистить весь журнал?")){history=[];save();renderHistory();}});
renderLimits(); renderHistory();

// ===== Улучшения =====
function showError(msg){const e=$("formError");e.textContent=msg;e.hidden=!msg;}
function toast(msg){const t=document.createElement("div");t.className="toast";t.textContent=msg;document.body.append(t);setTimeout(()=>t.remove(),2000);}
// Подсказки в реальном времени
function hintEl(id){let h=$(id).parentElement.querySelector(".hint");if(!h){h=document.createElement("span");h.className="hint";$(id).parentElement.append(h);}return h;}
function updateHint(id){
  const inp=$(id),h=hintEl(id),p=presets[$("category").value];
  inp.classList.remove("ok","bad");h.className="hint";h.textContent="";
  if(inp.value===""||id==="mass")return;
  const v=Number(inp.value),r=id==="temperature"?p.temp:p.ph,unit=id==="temperature"?" °C":"";
  const ok=inRange(v,r);
  inp.classList.add(ok?"ok":"bad");h.classList.add(ok?"ok":"bad");
  h.textContent=ok?"В пределах диапазона":`Вне диапазона ${r[0]}…${r[1]}${unit}`;
}
function updateMassHint(){
  const m=Number($("mass").value),n=$("nominal").value===""?m:Number($("nominal").value),h=hintEl("mass"),inp=$("mass"),p=presets[$("category").value];
  inp.classList.remove("ok","bad");h.className="hint";h.textContent="";
  if(!m||!n)return;
  const pc=m/n*100,ok=inRange(pc,p.mass);
  inp.classList.add(ok?"ok":"bad");h.classList.add(ok?"ok":"bad");
  h.textContent=`${pc.toFixed(1)}% от номинала`+(ok?"":" — вне диапазона");
}
["temperature","ph"].forEach(id=>$(id).addEventListener("input",()=>updateHint(id)));
["mass","nominal"].forEach(id=>$(id).addEventListener("input",updateMassHint));
$("category").addEventListener("change",()=>{["temperature","ph"].forEach(updateHint);updateMassHint();});
// Примеры
function fill(o){Object.entries(o).filter(([k])=>k!=="visual").forEach(([k,v])=>{$(k).value=v;});document.querySelector(`input[name=visual][value=${o.visual||"ok"}]`).checked=true;["temperature","ph"].forEach(updateHint);updateMassHint();}
$("fillGood").addEventListener("click",()=>{$("category").value="chilled";renderLimits();fill({productName:"Молоко",batchNumber:"M-104",temperature:4,ph:6.7,mass:500,nominal:500});});
$("fillBad").addEventListener("click",()=>{$("category").value="chilled";renderLimits();fill({productName:"Йогурт",batchNumber:"Y-077",temperature:9,ph:3.6,mass:470,nominal:500,visual:"issue"});});
// Текст отчёта, копирование, печать
function reportText(d,r){return [`Отчёт проверки партии ${d.batchNumber} (${d.productName})`,`Категория: ${presets[d.category].name}`,...r.checks.map(c=>`- ${c.name}: ${c.value} — ${c.ok?"в норме":"ОТКЛОНЕНИЕ"}`),`Итог: ${r.passed?"отклонений нет":"отклонений: "+r.issues}`,"(учебная оценка по демонстрационным диапазонам)"].join("\n");}
$("copyReport").addEventListener("click",()=>{(navigator.clipboard?navigator.clipboard.writeText(lastReport):Promise.reject()).then(()=>toast("Отчёт скопирован"),()=>toast("Не удалось скопировать"));});
$("printReport").addEventListener("click",()=>window.print());
// CSV
$("exportCsv").addEventListener("click",()=>{
  if(!history.length){toast("Журнал пуст");return;}
  const q=v=>`"${String(v).replace(/"/g,'""')}"`;
  const rows=[["Партия","Продукт","Категория","Темп.","pH","Масса","Номинал","Осмотр","Дата","Результат"],...history.map(x=>[x.batchNumber,x.productName,presets[x.category].name,x.temperature,x.ph,x.mass,x.nominalMass,x.visual==="ok"?"норма":"отклонения",x.time,x.passed?"Соответствует":"Отклонения"])];
  const blob=new Blob(["\ufeff"+rows.map(r=>r.map(q).join(";")).join("\n")],{type:"text/csv;charset=utf-8"});
  const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="journal.csv";a.click();URL.revokeObjectURL(a.href);
});
// Тема
const root=document.documentElement;
try{root.dataset.theme=localStorage.getItem("qc_theme")||(matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");}catch(e){}
$("themeToggle").addEventListener("click",()=>{root.dataset.theme=root.dataset.theme==="dark"?"light":"dark";try{localStorage.setItem("qc_theme",root.dataset.theme)}catch(e){}});

// ===== Версия 3 =====
const refreshHints=()=>{["temperature","ph"].forEach(updateHint);updateMassHint();};
// Журнал: поиск, фильтр, открыть, удалить
$("histSearch").addEventListener("input",e=>{q=e.target.value.trim().toLowerCase();renderHistory();});
$("histFilter").addEventListener("change",e=>{filter=e.target.value;renderHistory();});
$("historyBody").addEventListener("click",e=>{
  const o=e.target.dataset.open,d=e.target.dataset.del;
  if(o){const x=history.find(h=>String(h.id)===o);if(!x)return;const res=runCheck(x);renderReport(x,res);lastReport=reportText(x,res);$("resultActions").hidden=false;$("resultPanel").scrollIntoView({behavior:"smooth",block:"start"});}
  if(d){history=history.filter(h=>String(h.id)!==d);save();renderHistory();toast("Запись удалена");}
});
// Настройка диапазонов
const FIELDS=[["temp","Температура, °C"],["ph","pH"],["mass","Масса, % от номинала"]];
$("setGrid").innerHTML=FIELDS.map(([f,l])=>`<label>${l}<span class="pair"><input type="number" step="0.1" data-f="${f}" data-i="0" aria-label="${l}: минимум"><input type="number" step="0.1" data-f="${f}" data-i="1" aria-label="${l}: максимум"></span></label>`).join("");
function fillSettings(){const p=presets[$("category").value];$("setGrid").querySelectorAll("input").forEach(i=>{i.value=p[i.dataset.f][i.dataset.i];});}
const saveLimits=()=>{try{localStorage.setItem("qc_limits",JSON.stringify(presets));}catch(e){}};
$("setGrid").addEventListener("input",e=>{const i=e.target,v=parseFloat(i.value);if(!Number.isFinite(v))return;presets[$("category").value][i.dataset.f][i.dataset.i]=v;saveLimits();renderLimits();refreshHints();});
$("resetLimits").addEventListener("click",()=>{for(const k in defaults)["temp","ph","mass"].forEach(f=>{presets[k][f]=[...defaults[k][f]];});try{localStorage.removeItem("qc_limits");}catch(e){}fillSettings();renderLimits();refreshHints();toast("Диапазоны сброшены");});
// Ctrl+Enter — проверить партию
document.addEventListener("keydown",e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter")form.requestSubmit();});
fillSettings();renderHistory();

["temperature","ph","mass"].forEach(hintEl);

// ===== Версия 5: шкала положения значения и рекомендации =====
function gauge(g){
  const [lo,hi,v]=g,span=(hi-lo)||1,min=Math.min(lo,v)-span*.5,max=Math.max(hi,v)+span*.5;
  const pc=x=>(x-min)/(max-min)*100, ok=v>=lo&&v<=hi;
  return `<div class="gauge" aria-hidden="true"><i class="band" style="left:${pc(lo).toFixed(1)}%;width:${(pc(hi)-pc(lo)).toFixed(1)}%"></i><b class="pin ${ok?"ok":"bad"}" style="left:${pc(v).toFixed(1)}%"></b></div>`;
}
const ADVICE={
  "Температура":"Проверьте холодильное или морозильное оборудование и повторите измерение другим термометром.",
  "Уровень pH":"Откалибруйте pH-метр и повторите измерение на другой пробе из партии.",
  "Масса упаковки":"Перевесьте несколько упаковок из партии и сравните со средним значением.",
  "Визуальный осмотр":"Зафиксируйте, что именно замечено, и попросите второго сотрудника осмотреть партию."
};
function adviceHTML(r){
  const bad=r.checks.filter(c=>!c.ok);
  if(!bad.length)return "";
  return `<div class="advice"><strong>Что сделать дальше</strong><ul>${bad.map(c=>`<li><b>${c.name}.</b> ${ADVICE[c.name]}</li>`).join("")}</ul></div>`;
}
