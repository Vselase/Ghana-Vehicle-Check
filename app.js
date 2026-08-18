  const DB = {
    "GR2451-24": {
      make:"Toyota", model:"Corolla", year:2019, color:"Silver",
      roadworthy:{status:"valid", expiry:"14 Nov 2026", issued:"14 Nov 2025"},
      insurance:{status:"valid", expiry:"02 Jan 2027", insurer:"SIC Insurance PLC", type:"Comprehensive"},
      flag:null
    },
    "AS8890-22": {
      make:"Nissan", model:"Almera", year:2016, color:"Blue",
      roadworthy:{status:"expired", expiry:"22 Feb 2026", issued:"22 Feb 2025"},
      insurance:{status:"valid", expiry:"30 Sep 2026", insurer:"Enterprise Insurance", type:"Third Party"},
      flag:null
    },
    "GT1123-23": {
      make:"Hyundai", model:"i10", year:2020, color:"White",
      roadworthy:{status:"valid", expiry:"09 Dec 2026", issued:"09 Dec 2025"},
      insurance:{status:"none", expiry:null, insurer:null, type:null},
      flag:null
    },
    "WR4471-21": {
      make:"Kia", model:"Rio", year:2015, color:"Red",
      roadworthy:{status:"expired", expiry:"11 May 2025", issued:"11 May 2024"},
      insurance:{status:"expired", expiry:"03 Jun 2025", insurer:"Star Assurance", type:"Third Party"},
      flag:null
    },
    "CR9902-25": {
      make:"Honda", model:"Civic", year:2021, color:"Black",
      roadworthy:{status:"valid", expiry:"18 Mar 2027", issued:"18 Mar 2026"},
      insurance:{status:"valid", expiry:"18 Mar 2027", insurer:"Vanguard Assurance", type:"Comprehensive"},
      flag:"Reported to MTTD as associated with an open investigation. Contact the nearest police station before any transaction."
    }
  };

  const norm = s => s.toUpperCase().replace(/[^A-Z0-9]/g,"");

  const plateInput = document.getElementById('plateInput');
  const checkBtn = document.getElementById('checkBtn');
  const certCard = document.getElementById('certCard');
  const notFound = document.getElementById('notFound');

  function iconOk(){return '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5L10 17L19 7" stroke="#0B3D2C" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';}
  function iconBad(){return '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="#B3122A" stroke-width="2.4" stroke-linecap="round"/></svg>';}
  function iconWarn(){return '<svg viewBox="0 0 24 24" fill="none"><path d="M12 8V13" stroke="#A6741B" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="16.3" r="1.2" fill="#A6741B"/><path d="M12 3L21.5 20H2.5L12 3Z" stroke="#A6741B" stroke-width="1.8" stroke-linejoin="round"/></svg>';}

  function overallPill(rw, ins, flagged){
    if(flagged) return {cls:'bad', label:'SECURITY ALERT'};
    if(rw==='valid' && (ins==='valid')) return {cls:'ok', label:'CLEAR'};
    if(rw==='expired' && ins==='expired') return {cls:'bad', label:'NOT ROADWORTHY · UNINSURED'};
    if(ins==='none') return {cls:'bad', label:'UNINSURED'};
    if(rw==='expired') return {cls:'warn', label:'ROADWORTHY EXPIRED'};
    if(ins==='expired') return {cls:'warn', label:'INSURANCE EXPIRED'};
    return {cls:'warn', label:'CHECK REQUIRED'};
  }

  function render(reg){
    const key = norm(reg);
    const rec = DB[key];
    if(!rec){
      certCard.classList.remove('show');
      notFound.classList.add('show');
      return;
    }
    notFound.classList.remove('show');

    const rw = rec.roadworthy.status;
    const ins = rec.insurance.status;
    const pill = overallPill(rw, ins, rec.flag);

    const rwIcon = rw==='valid' ? iconOk() : iconBad();
    const rwClass = rw==='valid' ? 'good' : 'bad';
    const rwLabel = rw==='valid' ? `Valid — expires ${rec.roadworthy.expiry}` : `Expired ${rec.roadworthy.expiry}`;

    let insIcon, insClass, insLabel;
    if(ins==='valid'){ insIcon=iconOk(); insClass='good'; insLabel=`Valid — expires ${rec.insurance.expiry}`; }
    else if(ins==='expired'){ insIcon=iconBad(); insClass='bad'; insLabel=`Expired ${rec.insurance.expiry}`; }
    else { insIcon=iconBad(); insClass='bad'; insLabel='No active policy found'; }

    const noteBlock = rec.flag
      ? `<div class="seal" style="color:var(--red)">${iconWarn()}</div>
         <div class="note-text"><strong>Security flag on record</strong>${rec.flag}</div>`
      : (pill.cls==='ok'
          ? `<div class="seal" style="color:var(--forest)">${iconOk()}</div>
             <div class="note-text"><strong>No issues found</strong>This vehicle has a valid roadworthy certificate and active insurance as of today.</div>`
          : `<div class="seal" style="color:var(--amber)">${iconWarn()}</div>
             <div class="note-text"><strong>Action needed</strong>One or more requirements have lapsed. Driving this vehicle on public roads may be an offence until resolved.</div>`);

    certCard.innerHTML = `
      <div class="cert-top">
        <div>
          <div class="cert-plate">${reg.toUpperCase()}</div>
          <div class="cert-sub">${rec.year} ${rec.make} ${rec.model} · ${rec.color}</div>
        </div>
        <div class="status-pill ${pill.cls}"><span class="dot"></span>${pill.label}</div>
      </div>
      <div class="cert-body">
        <div class="cert-col">
          <h3>Roadworthy certificate</h3>
          <div class="field-row"><span class="k">Status</span><span class="v ${rwClass}">${rwLabel}</span></div>
          <div class="field-row"><span class="k">Issued</span><span class="v">${rec.roadworthy.issued}</span></div>
          <div class="field-row"><span class="k">Issuing authority</span><span class="v">DVLA Ghana</span></div>
        </div>
        <div class="cert-col">
          <h3>Motor insurance</h3>
          <div class="field-row"><span class="k">Status</span><span class="v ${insClass}">${insLabel}</span></div>
          <div class="field-row"><span class="k">Insurer</span><span class="v">${rec.insurance.insurer || '—'}</span></div>
          <div class="field-row"><span class="k">Policy type</span><span class="v">${rec.insurance.type || '—'}</span></div>
        </div>
        <div class="cert-note">${noteBlock}</div>
      </div>
    `;
    certCard.classList.remove('show');
    void certCard.offsetWidth;
    certCard.classList.add('show');
  }

  checkBtn.addEventListener('click', ()=>{
    if(plateInput.value.trim()) render(plateInput.value.trim());
  });
  plateInput.addEventListener('keydown', e=>{
    if(e.key==='Enter' && plateInput.value.trim()) render(plateInput.value.trim());
  });
  document.querySelectorAll('.sample-chip').forEach(chip=>{
    chip.addEventListener('click', ()=>{
      plateInput.value = chip.dataset.plate;
      render(chip.dataset.plate);
    });
  });

  // load first sample on start for an immediate impression
  window.addEventListener('load', ()=>{
    plateInput.value = 'GR 2451-24';
    render('GR 2451-24');
  });
