const WHATSAPP = "524621872594";

const catalogo = [
  {id:"filete",cat:"PREMIUM",name:"Filete limpio",price:870,desc:"Corte premium, limpio y suave.",image:"assets/filete.webp"},
  {id:"tomahawk",cat:"PREMIUM",name:"Tomahawk",price:829,desc:"Corte grueso con hueso largo.",image:"assets/tomahawk.webp"},
  {id:"ribeye",cat:"PREMIUM",name:"Rib Eye",price:629,desc:"Marmoleo y gran sabor para parrilla.",image:"assets/ribeye.webp"},
  {id:"picana",cat:"PREMIUM",name:"Picaña",price:492,desc:"Corte jugoso con capa de grasa.",image:"assets/picana.webp"},
  {id:"arrachera",cat:"PREMIUM",name:"Arrachera",price:497,desc:"Ideal para asar y compartir.",image:"assets/arrachera.webp"},
  {id:"newyork",cat:"PREMIUM",name:"New York",price:489,desc:"Firme, jugoso y de sabor intenso.",image:"assets/new_york.webp"},
  {id:"tbone",cat:"PREMIUM",name:"T-Bone",price:482,desc:"Dos cortes en una sola pieza.",image:"assets/tbone.webp"},
  {id:"topsirloin",cat:"PREMIUM",name:"Top Sirloin",price:482,desc:"Versátil y excelente para parrilla.",image:"assets/top_sirloin.webp"},

  {id:"diezmillo",cat:"PARRILLA / DIARIO",name:"Diezmillo S/H",price:420,desc:"Sin hueso, para bistec o parrilla.",image:"assets/top_sirloin.webp"},
  {id:"sirloin",cat:"PARRILLA / DIARIO",name:"Sirloin",price:398,desc:"Corte versátil para asar o cocinar.",image:"assets/new_york.webp"},
  {id:"agujanortena",cat:"PARRILLA / DIARIO",name:"Aguja Norteña",price:398,desc:"Jugosa y con excelente sabor.",image:"assets/ribeye.webp"},
  {id:"pulpanegra",cat:"PARRILLA / DIARIO",name:"Bistec Pulpa Negra",price:398,desc:"Bistec suave para comida diaria.",image:"assets/top_sirloin.webp"},
  {id:"brisket",cat:"PARRILLA / DIARIO",name:"Brisket",price:366,desc:"Ideal para cocción lenta o ahumado.",image:"assets/picana.webp"},
  {id:"shortrib",cat:"PARRILLA / DIARIO",name:"Short Rib",price:345,desc:"Costilla corta para asar o brasear.",image:"assets/ribeye.webp"},
  {id:"bistec",cat:"PARRILLA / DIARIO",name:"Bistec",price:328,desc:"Corte práctico para todos los días.",image:"assets/top_sirloin.webp"},
  {id:"molida",cat:"PARRILLA / DIARIO",name:"Molida 90/10",price:318,desc:"Carne molida con poca grasa.",image:"assets/top_sirloin.webp"},

  {id:"cocido",cat:"COCINA",name:"Carne para Cocido",price:250,desc:"Ideal para caldo y guisos.",image:"assets/top_sirloin.webp"},
  {id:"pecho",cat:"COCINA",name:"Pecho",price:250,desc:"Excelente para cocción lenta.",image:"assets/picana.webp"},
  {id:"flecha",cat:"COCINA",name:"Flecha para Asar",price:200,desc:"Económica y sabrosa para la parrilla.",image:"assets/arrachera.webp"}
];

const CATS = ["PREMIUM","PARRILLA / DIARIO","COCINA"];
let activeCat = CATS[0];
let cart = [];
let currentItem = null;

const $ = id => document.getElementById(id);
const money = n => new Intl.NumberFormat("es-MX",{style:"currency",currency:"MXN",maximumFractionDigits:2}).format(n);
const fmt = n => Number(n).toFixed(2).replace(/\.00$/,'').replace(/(\.\d)0$/,'$1');
const esc = s => String(s || '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');

function renderTabs(){
  $("tabs").innerHTML = "";
  CATS.forEach(cat=>{
    const b = document.createElement("button");
    b.className = "tab" + (cat === activeCat ? " active" : "");
    b.textContent = cat;
    b.onclick = ()=>{activeCat=cat;renderTabs();renderItems();};
    $("tabs").appendChild(b);
  });
}

function renderItems(){
  const term = ($("q").value || "").toLowerCase().trim();
  $("sectionTitle").textContent = activeCat;
  const list = catalogo.filter(p =>
    p.cat === activeCat &&
    (!term || p.name.toLowerCase().includes(term) || p.desc.toLowerCase().includes(term))
  );

  $("items").innerHTML = "";
  if(!list.length){
    $("items").innerHTML = '<div class="cartEmpty">No se encontraron productos.</div>';
    return;
  }

  list.forEach(p=>{
    const card = document.createElement("article");
    card.className = "prod";
    card.innerHTML = `
      <div class="prodVisual"><img src="${p.image}" alt="${esc(p.name)}"><span>${esc(p.cat)}</span></div>
      <div class="prodBody">
        <div class="prodName">${esc(p.name)}</div>
        <div class="prodMeta">${esc(p.desc)}</div>
        <div class="price">Precio por kg <strong>${money(p.price)}</strong></div>
        <button class="addBtn">Agregar al pedido</button>
      </div>`;
    card.querySelector("button").onclick = ()=>openModal(p);
    $("items").appendChild(card);
  });
}

function openModal(item){
  currentItem = item;
  $("mTitle").textContent = item.name + " — " + money(item.price) + "/kg";
  $("qtyProd").value = 1;
  $("noteProd").value = "";
  $("quickQty").innerHTML = "";
  [0.5,1,2,5,10,20].forEach(n=>{
    const b=document.createElement("button");
    b.textContent = n + " kg";
    b.onclick = ()=>$("qtyProd").value=n;
    $("quickQty").appendChild(b);
  });
  $("backdrop").style.display="flex";
}

function closeModal(){
  $("backdrop").style.display="none";
  currentItem=null;
}

function renderCart(){
  const count = cart.length;
  $("cartPill").innerHTML = `🛒 <b>${count}</b> <span>Mi pedido</span>`;
  $("cartSmall").textContent = count === 1 ? "1 producto" : `${count} productos`;

  if(!cart.length){
    $("cart").innerHTML='<div class="cartEmpty">Aún no agregas productos.</div>';
    $("total").textContent=money(0);
    return;
  }

  $("cart").innerHTML="";
  let total=0;
  cart.forEach((line,idx)=>{
    total += line.qty * line.price;
    const div=document.createElement("div");
    div.className="cartLine";
    div.innerHTML=`
      <div>
        <div class="lineName">${esc(line.name)}</div>
        <div class="lineSub">
          ${fmt(line.qty)} kg × ${money(line.price)}<br>
          Subtotal: <b>${money(line.qty*line.price)}</b>
          ${line.note ? "<br>Nota: "+esc(line.note) : ""}
        </div>
      </div>
      <div>
        <div class="qtyBox">
          <button class="mini" data-a="dec">−</button>
          <div class="qtyText">${fmt(line.qty)}</div>
          <button class="mini" data-a="inc">+</button>
        </div>
        <button class="remove">Quitar</button>
      </div>`;
    div.querySelector('[data-a="dec"]').onclick=()=>{
      line.qty=Math.max(.1,Number((line.qty-.1).toFixed(1)));
      renderCart();
    };
    div.querySelector('[data-a="inc"]').onclick=()=>{
      line.qty=Number((line.qty+.1).toFixed(1));
      renderCart();
    };
    div.querySelector(".remove").onclick=()=>{cart.splice(idx,1);renderCart();};
    $("cart").appendChild(div);
  });
  $("total").textContent=money(total);
}

function whatsappText(){
  const cliente = $("cliente").value.trim() || "Cliente";
  const tel = $("telefono").value.trim();
  const direccion = $("direccion").value.trim();

  const lines = [];
  lines.push("*CARNES Y VÍSCERAS DEL CENTRO*");
  lines.push("*PEDIDO DE CORTES DE RES*");
  lines.push("");
  lines.push(`Cliente: *${cliente}*`);
  if(tel) lines.push(`Teléfono: *${tel}*`);
  lines.push(`Entrega: *Envío / Ruta*`);
  if(direccion) lines.push(`Dirección: ${direccion}`);
  lines.push("");
  lines.push("--------------------------");

  let total=0;
  cart.forEach((x,i)=>{
    const subtotal=x.qty*x.price;
    total += subtotal;
    lines.push(`${i+1}. *${x.name}*`);
    lines.push(`   ${fmt(x.qty)} kg × ${money(x.price)} = *${money(subtotal)}*`);
    if(x.note) lines.push(`   Nota: ${x.note}`);
  });

  lines.push("--------------------------");
  lines.push(`TOTAL: *${money(total)}*`);
  lines.push("");
  lines.push("Quedo atento a la confirmación y disponibilidad.");
  return lines.join("\n");
}

$("q").addEventListener("input",renderItems);
$("mClose").onclick=closeModal;
$("mCancel").onclick=closeModal;
$("backdrop").onclick=e=>{if(e.target===$("backdrop"))closeModal();};
$("mAdd").onclick=()=>{
  if(!currentItem)return;
  const qty=Number($("qtyProd").value);
  if(!qty || qty<.1){alert("Captura una cantidad válida.");return;}
  const note=$("noteProd").value.trim();
  const existing=cart.find(x=>x.id===currentItem.id && x.note===note);
  if(existing) existing.qty=Number((existing.qty+qty).toFixed(1));
  else cart.push({...currentItem,qty,note});
  renderCart();
  closeModal();
};
$("btnClear").onclick=()=>{
  if(confirm("¿Vaciar todo el pedido?")){cart=[];renderCart();}
};
$("btnCheckout").onclick=()=>{
  if(!cart.length){alert("Agrega al menos un producto.");return;}
  if(!$("direccion").value.trim()){
    alert("Captura la dirección de envío.");
    return;
  }
  window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(whatsappText())}`,"_blank");
};

renderTabs();
renderItems();
renderCart();
