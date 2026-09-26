const games=[
{name:"Crimson Desert",aliases:["crimson desert"],platform:"PlayStation 5",regular:69.99,cards:[["50 € PSN Deutschland",41.68],["20 € PSN Deutschland",16.73]]},
{name:"GTA VI",aliases:["gta vi","gta 6","grand theft auto vi"],platform:"PlayStation 5",regular:79.99,cards:[["50 € PSN Deutschland",42.49],["30 € PSN Deutschland",25.29]]},
{name:"Elden Ring",aliases:["elden ring"],platform:"PlayStation 5",regular:59.99,cards:[["60 € PSN Deutschland",51.14]]}
];
const eur=n=>n.toLocaleString("de-DE",{style:"currency",currency:"EUR"});
function findGame(q){q=q.toLowerCase();return games.find(g=>g.aliases.some(a=>q.includes(a)))||games[0]}
function render(g){
 const total=g.cards.reduce((a,c)=>a+c[1],0),saving=g.regular-total,pct=saving/g.regular*100;
 gameName.textContent=g.name;meta.textContent=g.platform+" · Digital · Deutschland";
 regular.textContent=eur(g.regular);best.textContent=eur(total);saving.textContent=eur(saving);
 routeDiscount.textContent="−"+pct.toFixed(1).replace(".",",")+" %";routeTotal.textContent=eur(total);
 cards.innerHTML=g.cards.map(c=>`<div class="routeItem"><span>${c[0]} <em>optimierter Anbieter</em></span><b>${eur(c[1])}</b></div>`).join("");
 result.classList.remove("hidden");setTimeout(()=>result.scrollIntoView({behavior:"smooth",block:"center"}),80);
}
searchForm.addEventListener("submit",e=>{e.preventDefault();render(findGame(query.value))});
document.querySelectorAll(".chips button").forEach(b=>b.onclick=()=>{query.value=b.dataset.q;render(findGame(query.value))});
buy.onclick=()=>{toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),2200)};
