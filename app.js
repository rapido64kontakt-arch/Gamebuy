const eur=n=>n.toLocaleString("de-DE",{style:"currency",currency:"EUR"});
const rows=document.getElementById("cardRows");
const defaults=[{face:50,cost:41.68},{face:20,cost:16.73},{face:10,cost:8.79}];

function addRow(face="",cost=""){
  const row=document.createElement("div"); row.className="cardRow";
  row.innerHTML=`<input class="face" type="number" min="0.01" step="0.01" value="${face}" aria-label="Nennwert"><input class="cost" type="number" min="0.01" step="0.01" value="${cost}" aria-label="Kaufpreis"><button class="remove" type="button" title="Entfernen">×</button>`;
  row.querySelector(".remove").onclick=()=>row.remove();
  rows.appendChild(row);
}
defaults.forEach(x=>addRow(x.face,x.cost));
document.getElementById("addCard").onclick=()=>addRow();

function getCards(){
  return [...document.querySelectorAll(".cardRow")].map(r=>({
    face:parseFloat(r.querySelector(".face").value),
    cost:parseFloat(r.querySelector(".cost").value)
  })).filter(x=>Number.isFinite(x.face)&&Number.isFinite(x.cost)&&x.face>0&&x.cost>0);
}

/* Unbounded integer optimization.
   State = exact wallet face value in cents.
   For each reachable value, keep the lowest real purchase cost and card counts.
   We search only far enough above the game price to guarantee a useful solution. */
function optimize(targetEuro,cards){
  const target=Math.round(targetEuro*100);
  const normalized=cards.map((c,i)=>({face:Math.round(c.face*100),cost:Math.round(c.cost*100),i,...c}));
  if(!normalized.length) return null;
  const maxFace=Math.max(...normalized.map(c=>c.face));
  const limit=target+maxFace*2;
  const dp=Array(limit+1).fill(null);
  dp[0]={cost:0,counts:Array(cards.length).fill(0)};
  for(let value=0;value<=limit;value++){
    if(!dp[value]) continue;
    for(const c of normalized){
      const nv=value+c.face;
      if(nv>limit) continue;
      const nc=dp[value].cost+c.cost;
      if(!dp[nv]||nc<dp[nv].cost){
        const counts=[...dp[value].counts]; counts[c.i]++;
        dp[nv]={cost:nc,counts};
      }
    }
  }
  let best=null;
  for(let value=target;value<=limit;value++){
    if(!dp[value]) continue;
    const candidate={credit:value,cost:dp[value].cost,counts:dp[value].counts};
    if(!best || candidate.cost<best.cost || (candidate.cost===best.cost && candidate.credit<best.credit)) best=candidate;
  }
  return best;
}

function calculate(){
  const price=parseFloat(document.getElementById("storePrice").value);
  const cards=getCards();
  if(!Number.isFinite(price)||price<=0||!cards.length){alert("Bitte Storepreis und mindestens eine gültige Guthabenkarte eintragen.");return;}
  const opt=optimize(price,cards);
  if(!opt){alert("Keine Kombination gefunden.");return;}

  const cost=opt.cost/100, credit=opt.credit/100, save=price-cost, pct=(save/price)*100;
  document.getElementById("gameName").textContent=document.getElementById("game").value.trim()||"Dein Game";
  document.getElementById("meta").textContent=`${document.getElementById("platform").value} · Digital · ${document.getElementById("region").value}`;
  document.getElementById("regular").textContent=eur(price);
  document.getElementById("best").textContent=eur(cost);
  document.getElementById("saving").textContent=save>=0?eur(save):"0,00 €";
  document.getElementById("routeDiscount").textContent=save>0?`−${pct.toFixed(1).replace(".",",")} %`:"kein Vorteil";
  document.getElementById("creditTotal").textContent=eur(credit);
  document.getElementById("leftover").textContent=eur(credit-price);
  document.getElementById("routeTotal").textContent=eur(cost);

  const route=document.getElementById("routeCards"); route.innerHTML="";
  opt.counts.forEach((count,i)=>{
    if(!count)return;
    const c=cards[i], line=document.createElement("div"); line.className="routeItem";
    line.innerHTML=`<span>${count}× ${eur(c.face)} Guthaben <em>je ${eur(c.cost)}</em></span><b>${eur(count*c.cost)}</b>`;
    route.appendChild(line);
  });
  document.getElementById("result").classList.remove("hidden");
  setTimeout(()=>document.getElementById("result").scrollIntoView({behavior:"smooth",block:"center"}),80);
}
document.getElementById("calculate").onclick=calculate;
calculate();
