const presets = {
  chilled: {name:"Охлаждённый продукт", temp:[0,5], ph:[4,7], mass:[95,105], massLabel:"95–105% от условной массы упаковки"},
  dry: {name:"Сухой продукт", temp:[10,25], ph:[4,8], mass:[95,105], massLabel:"95–105% от условной массы упаковки"},
  frozen: {name:"Замороженный продукт", temp:[-25,-18], ph:[4,8], mass:[95,105], massLabel:"95–105% от условной массы упаковки"}
};
// Значения демонстрационные, не являются официальными пищевыми нормативами.
let history = [];
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
      <div><div class="check-name">${c.name}</div><div class="check-detail">${c.rule}<br>Получено: ${c.value}</div></div>
      <span class="check-status ${c.ok?"pass":"fail"}">${c.ok?"В НОРМЕ":"ОТКЛОНЕНИЕ"}</span>
    </div>`).join("")}</div>
    <p class="report-note">Отчёт является учебной оценкой по встроенным демонстрационным диапазонам. Он не подтверждает безопасность продукта и не заменяет лабораторные исследования или официальные требования.</p>`;
}
function escapeHTML(value){
  return String(value).replace(/[&<>"']/g, ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function renderHistory(){
  $("checkedCount").textContent = history.length;
  $("passedCount").textContent = history.filter(x=>x.passed).length;
  $("issueCount").textContent = history.filter(x=>!x.passed).length;
  $("historyEmpty").hidden = history.length>0;
  $("historyTable").hidden = history.length===0;
  $("historyBody").innerHTML = history.map(x=>`<tr><td>${escapeHTML(x.batchNumber)}</td><td>${escapeHTML(x.productName)}</td><td>${x.time}</td><td><span class="table-badge ${x.passed?"pass":"fail"}">${x.passed?"Соответствует":"Отклонения"}</span></td></tr>`).join("");
}
$("category").addEventListener("change",renderLimits);
form.addEventListener("submit",event=>{
  event.preventDefault();
  const productName=$("productName").value.trim(), batchNumber=$("batchNumber").value.trim();
  const temperature=Number($("temperature").value), ph=Number($("ph").value), mass=Number($("mass").value);
  if(!productName || !batchNumber){alert("Заполните название продукта и номер партии.");return;}
  if(!Number.isFinite(temperature)||!Number.isFinite(ph)||!Number.isFinite(mass)||ph<0||ph>14||mass<=0){
    alert("Проверьте данные: pH должен быть от 0 до 14, масса — больше нуля.");return;
  }
  const nominalMass = Number(prompt("Введите номинальную массу упаковки в граммах:", String(mass)));
  if(!Number.isFinite(nominalMass)||nominalMass<=0){alert("Номинальная масса должна быть больше нуля.");return;}
  const data={productName,batchNumber,category:$("category").value,temperature,ph,mass,nominalMass,visual:document.querySelector('input[name="visual"]:checked').value};
  const result=runCheck(data);
  renderReport(data,result);
  history.unshift({...data,passed:result.passed,time:new Date().toLocaleString("ru-RU")});
  renderHistory();
  $("resultPanel").scrollIntoView({behavior:"smooth",block:"start"});
});
form.addEventListener("reset",()=>setTimeout(()=>{ $("resultContent").hidden=true;$("emptyState").hidden=false; },0));
$("clearHistory").addEventListener("click",()=>{history=[];renderHistory();});
renderLimits(); renderHistory();
