<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <title>Varhaiskasvatusmaksun laskin, Espoo ja erittäin epävirallinen – monilapsi, eskari/viskari, tuntaliukuri</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    :root { --pad:14px; --r:12px; --line:#e7e8ef; --muted:#5a5f6a; }
    body { font-family: system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,Arial,sans-serif; margin:0; background:#f7f8fb; color:#10131a; }
    header { padding:18px var(--pad); background:#fff; border-bottom:1px solid var(--line); }
    main { display:grid; grid-template-columns: 420px 1fr; gap:18px; padding:18px; }
    @media (max-width:1000px){ main{ grid-template-columns:1fr; } }
    .card { background:#fff; border:1px solid var(--line); border-radius:var(--r); padding:var(--pad); box-shadow:0 1px 2px rgba(0,0,0,.03); }
    .field { margin-bottom:12px; }
    .field > label { display:block; font-weight:600; margin-bottom:6px; }
    select, input[type="number"], input[type="range"], button { width:100%; padding:10px; font-size:16px; border:1px solid #d7d9e2; border-radius:10px; background:#fff; }
    .row { display:flex; gap:10px; align-items:center; }
    .row > * { flex:1; }
    .muted { color:var(--muted); }
    .pill { display:inline-block; padding:2px 8px; border:1px solid #dfe3ff; border-radius:999px; font-size:12px; background:#f0f2ff; font-weight:600; }
    .result { font-size:32px; font-weight:800; margin:6px 0 0; }
    table { width:100%; border-collapse: collapse; margin-top:10px; }
    th, td { padding:8px; border-top:1px solid var(--line); text-align:right; font-variant-numeric:tabular-nums; }
    th:first-child, td:first-child { text-align:left; }
    .child { border:1px dashed #e0e3f2; border-radius:10px; padding:10px; margin-bottom:10px; background:#fafbff; }
    .child h4 { margin:0 0 8px; }
    .k { color:#343a46; }
    .v { font-weight:600; }
    .kv { display:grid; grid-template-columns: 1fr auto; gap:6px 12px; }
    .buttons { display:flex; gap:10px; flex-wrap:wrap; }
    .ok { color:#067d00; }
    .fail { color:#b00020; }
  </style>
</head>
<body>
<header>
  <h1>Varhaiskasvatusmaksun laskin</h1>
  <div class="muted">Monilapsi · Tuntaliukuri (Taulukko 2/3/4) · Eskari/viskari · Kuukausivertailu · PS + lisämaksu</div>
</header>

<main>
  <!-- Syötteet -->
  <section class="card">
    <div class="field">
      <label for="perhe">Perhekoko</label>
      <select id="perhe">
        <option value="2">2</option>
        <option value="3" selected>3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
      </select>
      <div class="muted">Yli 6 → tulorajaa korotetaan +275 €/lisähenkilö.</div>
    </div>

    <div class="field">
      <label for="tulot">Kuukausibruttotulot (€)</label>
      <input id="tulot" type="number" inputmode="decimal" min="0" step="1" placeholder="esim. 6500">
    </div>

    <div class="field">
      <label for="lapsia">Varhaiskasvatuksessa olevien lasten määrä</label>
      <select id="lapsia">
        <option value="1" selected>1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
      </select>
      <div class="muted">Lapsijärjestys vaikuttaa: 1. lapsi (100 %), 2. lapsi (40 % 1.:stä), 3.+ (20 % 1.:stä).</div>
    </div>

    <div class="field">
      <label for="kuukausi">Kuukausi</label>
      <select id="kuukausi">
        <option value="1">Tammikuu</option>
        <option value="2">Helmikuu</option>
        <option value="3">Maaliskuu</option>
        <option value="4">Huhtikuu</option>
        <option value="5">Toukokuu</option>
        <option value="6">Kesäkuu</option>
        <option value="7">Heinäkuu</option>
        <option value="8" selected>Elokuu</option>
        <option value="9">Syyskuu</option>
        <option value="10">Lokakuu</option>
        <option value="11">Marraskuu</option>
        <option value="12">Joulukuu</option>
      </select>
      <div class="muted">Esiopetus on käynnissä yleensä elo–toukokuu. Viikko 22 jälkeen (kesä) eskari ei ole käynnissä.</div>
    </div>

    <div class="field">
      <label for="ps">Palveluseteli?</label>
      <select id="ps">
        <option value="no" selected>Ei</option>
        <option value="yes">Kyllä</option>
      </select>
    </div>

    <div class="field">
      <label for="lisamaksu">Päiväkodin lisämaksu €/lapsi (vain palvelusetelissä, katto 50 €/lapsi)</label>
      <input id="lisamaksu" type="number" min="0" step="1" placeholder="esim. 30" disabled>
    </div>

    <div class="field">
      <label>Lapsikohtaiset asetukset</label>
      <div id="childrenControls"></div>
      <div class="muted">Tila: <b>Normaali</b> (Taulukko 2), <b>Viskari</b> (Taulukko 3, 1.8.–31.7.), <b>Eskari</b> (Taulukko 4, toimikaudella). Tuntaliukuri: 0–50 h/vko.</div>
    </div>

    <div class="buttons">
      <button id="calc">Laske</button>
      <button id="demo1">Esim. 1 (alle tulorajan)</button>
      <button id="demo2">Esim. 2 (eskari 60 %)</button>
      <button id="demo3">Esim. 3 (2 lasta, katot + PS)</button>
      <button id="runTests">Aja testit</button><span id="testStatus" class="muted"></span>
    </div>
  </section>

  <!-- Tulos -->
  <section class="card" id="out">
    <div class="muted">Valitun kuukauden maksu</div>
    <div class="result" id="sumNow">–</div>
    <div class="kv" style="margin-top:10px">
      <div class="k">Kunnallinen osuus (yht.)</div><div class="v" id="muniNow">–</div>
      <div class="k">Lisämaksut (yht., PS)</div><div class="v" id="addNow">–</div>
      <div class="k">Kesävertailu (ilman eskarin vaikutusta)</div><div class="v" id="sumSummer">–</div>
    </div>

    <h3 style="margin-top:14px">Eritellyt maksut / lapsi (valittu kuukausi)</h3>
    <table id="tbl">
      <thead>
        <tr>
          <th>Lapsi</th>
          <th>Järjestys</th>
          <th>Tila</th>
          <th>Tunnit / vko</th>
          <th>Prosentti</th>
          <th>Kunnallinen ennen kerrointa</th>
          <th>Kunnallinen (kerrottu)</th>
          <th>Lisämaksu (PS)</th>
          <th>Yhteensä</th>
        </tr>
      </thead>
      <tbody></tbody>
    </table>

    <div class="muted" style="margin-top:8px">
      Säännöt (1.8.2024): maksuprosentti 10,7 %, maksukatto 311 € (1. lapsi), 2. lapsi 40 % 1.:stä (katto ~124 €), 3.+ 20 % (katto ~62 €). Tulorajataulukko kovakoodattu (2–6 hlö), yli 6: +275 €/hlö. Lisämaksu (PS) max 50 €/lapsi. 0 € sallitaan.
    </div>
  </section>
</main>

<script>
  // ---- Kovakoodatut parametrit (1.8.2024) ----
  const MAX_FEE = 311;         // €/kk (1. lapsi)
  const RATE = 0.107;          // 10,7 %
  const EXTRA_PER = 275;       // yli 6 hlö lisä tulorajassa / hlö
  // Tulorajat (min ja tulotaso jolla 1. lapsi saavuttaa katon)
  const TABLE = {
    2: { min: 4066, capIncome: 6968 },
    3: { min: 5245, capIncome: 8147 },
    4: { min: 5956, capIncome: 8858 },
    5: { min: 6667, capIncome: 9569 },
    6: { min: 7376, capIncome: 10278 }
  };
  // Järjestyskertoimet 1., 2., 3.+
  const ORDER_FACTORS = [1, 0.4, 0.2, 0.2, 0.2];

  // Apurit
  const EUR = (n) => new Intl.NumberFormat('fi-FI',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
  const byId = (id) => document.getElementById(id);

  const perhe = byId('perhe');
  const tulot = byId('tulot');
  const lapsia = byId('lapsia');
  const kuukausi = byId('kuukausi');
  const ps = byId('ps');
  const lisamaksu = byId('lisamaksu');
  const childrenControls = byId('childrenControls');

  const sumNow = byId('sumNow');
  const muniNow = byId('muniNow');
  const addNow = byId('addNow');
  const sumSummer = byId('sumSummer');
  const tblBody = document.querySelector('#tbl tbody');

  ps.addEventListener('change', ()=>{
    lisamaksu.disabled = ps.value !== 'yes';
    if(ps.value!=='yes'){ lisamaksu.value=''; }
  });

  // Generoi lapsikohtaiset kontrollit
  function rebuildChildren(){
    childrenControls.innerHTML = '';
    const n = Number(lapsia.value||1);
    for(let i=1;i<=n;i++){
      const wrap = document.createElement('div');
      wrap.className = 'child';
      wrap.innerHTML = `
        <h4>Lapsi ${i} (${i===1?'1.':'2.'} ${i>=3?'/ 3.+':''})</h4>
        <div class="row">
          <div>
            <label>Tila</label>
            <select data-role="mode">
              <option value="normal" selected>Normaali</option>
              <option value="viskari">Viskari (5 v maksuton 20 h)</option>
              <option value="eskari">Eskari</option>
            </select>
          </div>
          <div>
            <label>Tunnit / vko</label>
            <input type="range" min="0" max="50" step="1" value="35" data-role="hours">
            <div class="muted"><span data-role="hoursLabel">35 h/vko</span> → <span data-role="pctLabel">100 %</span></div>
          </div>
        </div>
      `;
      childrenControls.appendChild(wrap);
    }
    // Bind päivitys
    childrenControls.querySelectorAll('[data-role="mode"],[data-role="hours"]').forEach(el=>{
      el.addEventListener('input', updateChildLabels);
    });
    updateChildLabels();
  }
  lapsia.addEventListener('change', rebuildChildren);
  rebuildChildren();

  function monthHasEskari(m){ // Eskari käynnissä tyypillisesti 8–5
    return (m>=8 && m<=12) || (m>=1 && m<=5);
  }

  // Taulukot -> prosentti
  function pctForNormal(hours){
    if(hours >= 35) return 1.00;
    if(hours > 20)  return 0.80;
    return 0.60; // ≤20
  }
  function pctForViskari(hours){
    if(hours > 40)  return 0.80;
    if(hours > 20)  return 0.60;
    return 0.00; // ≤20
  }
  function pctForEskari(hours, m){
    if(!monthHasEskari(m)) return pctForNormal(hours); // kesä: palaan taulukko 2
    if(hours > 40)  return 0.80;
    if(hours > 20)  return 0.60;
    return 0.00; // ≤20
  }

  function updateChildLabels(){
    const m = Number(kuukausi.value||8);
    childrenControls.querySelectorAll('.child').forEach(ch=>{
      const mode = ch.querySelector('[data-role="mode"]').value;
      const hEl = ch.querySelector('[data-role="hours"]');
      const h = Number(hEl.value);
      ch.querySelector('[data-role="hoursLabel"]').textContent = `${h} h/vko`;
      let p=1.0;
      if(mode==='normal') p=pctForNormal(h);
      else if(mode==='viskari') p=pctForViskari(h);
      else p=pctForEskari(h, m);
      ch.querySelector('[data-role="pctLabel"]').textContent = `${Math.round(p*100)} %`;
    });
  }
  kuukausi.addEventListener('change', updateChildLabels);

  // Tuloraja
  function minThreshold(size){
    if(size<=6) return TABLE[size].min;
    return TABLE[6].min + (size-6)*EXTRA_PER;
    }
  function capThreshold(size){
    if(size<=6) return TABLE[size].capIncome;
    return TABLE[6].capIncome + (size-6)*EXTRA_PER;
  }
  function firstChildFee(income, familySize){
    const base = minThreshold(familySize);
    const raw = Math.max(0, (income - base) * RATE);
    return Math.min(MAX_FEE, Math.round(raw)); // 0…311
  }

  // Laskenta
  function calculate(selectedMonth){
    const familySize = Number(perhe.value||3);
    const income = Number(tulot.value||0);
    const nKids = Math.min(4, Math.max(1, Number(lapsia.value||1)));
    const hasVoucher = ps.value==='yes';
    const addAsked = hasVoucher ? Math.max(0, Number(lisamaksu.value||0)) : 0;
    const addPerChild = hasVoucher ? Math.min(50, addAsked) : 0;

    const first = firstChildFee(income, familySize);

    const rows = [];
    let muniSum = 0, addSum = 0, total = 0;

    const childEls = childrenControls.querySelectorAll('.child');
    for(let i=0;i<nKids;i++){
      const el = childEls[i];
      const mode = el.querySelector('[data-role="mode"]').value; // normal/viskari/eskari
      const hours = Number(el.querySelector('[data-role="hours"]').value);
      const ordFac = ORDER_FACTORS[Math.min(i,2)];
      const cap = Math.round(MAX_FEE * ordFac);
      const before = Math.min(cap, Math.round(first * ordFac));
      let pct=1.0;
      if(mode==='normal') pct=pctForNormal(hours);
      else if(mode==='viskari') pct=pctForViskari(hours);
      else pct=pctForEskari(hours, selectedMonth);

      const muni = Math.round(before * pct);
      const add = addPerChild;
      const sum = muni + add;

      muniSum += muni; addSum += add; total += sum;

      rows.push({
        i: i+1,
        order: (i===0?'1.': i===1?'2.':'3.+'),
        mode,
        hours,
        pct,
        before,
        muni,
        add,
        sum
      });
    }
    return { rows, muniSum, addSum, total, first };
  }

  function render(){
    const m = Number(kuukausi.value||8);
    const now = calculate(m);

    // Kesävertailu: käytä heinäkuuta (7) – eskarilla taulukko 2, viskarilla taulukko 3 edelleen
    const summer = calculate(7);

    sumNow.textContent = EUR(now.total);
    muniNow.textContent = EUR(now.muniSum);
    addNow.textContent = now.addSum ? EUR(now.addSum) : '–';
    sumSummer.textContent = EUR(summer.total);

    // Taulukko
    tblBody.innerHTML = '';
    now.rows.forEach(r=>{
      const tr = document.createElement('tr');
      const modeLabel = r.mode==='normal'?'Normaali':(r.mode==='viskari'?'Viskari':'Eskari');
      tr.innerHTML = `
        <td>Lapsi ${r.i}</td>
        <td>${r.order}</td>
        <td>${modeLabel}</td>
        <td>${r.hours} h</td>
        <td>${Math.round(r.pct*100)} %</td>
        <td>${EUR(r.before)}</td>
        <td>${EUR(r.muni)}</td>
        <td>${r.add?EUR(r.add):'–'}</td>
        <td>${EUR(r.sum)}</td>
      `;
      tblBody.appendChild(tr);
    });
  }

  // Napit
  byId('calc').addEventListener('click', render);
  byId('demo1').addEventListener('click', ()=>{
    perhe.value='2'; tulot.value='4000'; lapsia.value='1'; rebuildChildren();
    kuukausi.value='2'; ps.value='no'; lisamaksu.value=''; lisamaksu.disabled=true;
    // Lapsi 1: normaali 35 h (100 %) → mutta tulot alle rajan ⇒ 0 €
    const c = childrenControls.querySelector('.child');
    c.querySelector('[data-role="mode"]').value='normal';
    c.querySelector('[data-role="hours"]').value='35';
    updateChildLabels();
    render();
  });
  byId('demo2').addEventListener('click', ()=>{
    perhe.value='3'; tulot.value='6000'; lapsia.value='1'; rebuildChildren();
    kuukausi.value='9'; ps.value='no'; lisamaksu.value=''; lisamaksu.disabled=true;
    // Lapsi 1: eskari 30 h (→ 60 %) elo–touko
    const c = childrenControls.querySelector('.child');
    c.querySelector('[data-role="mode"]').value='eskari';
    c.querySelector('[data-role="hours"]').value='30';
    updateChildLabels();
    render();
  });
  byId('demo3').addEventListener('click', ()=>{
    perhe.value='4'; tulot.value='9000'; lapsia.value='2'; rebuildChildren();
    kuukausi.value='11'; ps.value='yes'; lisamaksu.disabled=false; lisamaksu.value='50';
    // Lapsi 1: eskari 20 h (→ 0 %), lapsi 2: normaali 35 h (→ 100 %)
    const c1 = childrenControls.querySelectorAll('.child')[0];
    const c2 = childrenControls.querySelectorAll('.child')[1];
    c1.querySelector('[data-role="mode"]').value='eskari';
    c1.querySelector('[data-role="hours"]').value='20';
    c2.querySelector('[data-role="mode"]').value='normal';
    c2.querySelector('[data-role="hours"]').value='35';
    updateChildLabels();
    render();
  });

  // Testit (uudet, vastaavat uutta logiikkaa)
  byId('runTests').addEventListener('click', ()=>{
    const out = byId('testStatus');
    const T = [];
    function assertEq(a,e,msg){ const ok=(a===e); if(!ok) console.warn('FAIL',msg,'expected',e,'actual',a); else console.log('OK',msg); return ok; }

    // 1) Alle tulorajan → 0 € (perhe 2, income 4000 < 4066)
    perhe.value='2'; tulot.value='4000'; lapsia.value='1'; rebuildChildren();
    kuukausi.value='2'; ps.value='no'; lisamaksu.value=''; lisamaksu.disabled=true;
    let c = childrenControls.querySelector('.child');
    c.querySelector('[data-role="mode"]').value='normal';
    c.querySelector('[data-role="hours"]').value='35';
    updateChildLabels();
    let r = calculate(Number(kuukausi.value));
    T.push(assertEq(r.total, 0, 'Alle tulorajan => 0 €'));

    // 2) Perhe 3, income 6000 → first=round((6000-5245)*0.107)=81; eskari 30 h (60%) → 49; kesävertailu (Taulukko 2 @30h => 80%) → 65
    perhe.value='3'; tulot.value='6000'; lapsia.value='1'; rebuildChildren();
    kuukausi.value='9'; ps.value='no'; lisamaksu.value=''; lisamaksu.disabled=true;
    c = childrenControls.querySelector('.child');
    c.querySelector('[data-role="mode"]').value='eskari';
    c.querySelector('[data-role="hours"]').value='30';
    updateChildLabels();
    r = calculate(Number(kuukausi.value));
    const now2 = r.total; // 49
    T.push(assertEq(now2, 49, 'Eskari 30h elo–touko => 60% * 81 = 49'));
    const summer2 = calculate(7).total; // 65
    T.push(assertEq(summer2, 65, 'Kesä (Taulukko 2; 30h => 80%) => 65'));

    // 3) Perhe 4, income 9000 → first = min(311, round((9000-5956)*0.107)=326) = 311.
    //    Lapsi1 eskari 20h => 0%; Lapsi2 normaali 35h => 100% * 124; PS 50 €/lapsi
    perhe.value='4'; tulot.value='9000'; lapsia.value='2'; rebuildChildren();
    kuukausi.value='11'; ps.value='yes'; lisamaksu.disabled=false; lisamaksu.value='50';
    const kids = childrenControls.querySelectorAll('.child');
    kids[0].querySelector('[data-role="mode"]').value='eskari';
    kids[0].querySelector('[data-role="hours"]').value='20';
    kids[1].querySelector('[data-role="mode"]').value='normal';
    kids[1].querySelector('[data-role="hours"]').value='35';
    updateChildLabels();
    r = calculate(Number(kuukausi.value));
    // lapsi1: 0 + 50, lapsi2: 124 + 50 => 224
    T.push(assertEq(r.total, 224, '2 lasta, PS 50€/lapsi, eskari 0% + normaali 100% => 224'));

    out.textContent = T.every(Boolean) ? 'Testit ok ✅' : 'Jokin testi epäonnistui ❌ (katso konsoli)';
    out.className = T.every(Boolean) ? 'ok' : 'fail';

    // Palauta järkevään esimerkkiin
    byId('demo2').click();
  });

  // Oletusnäkymä
  byId('demo2').click();
</script>
</body>
</html>
