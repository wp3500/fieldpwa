/* ===== NAVIGATION ===== */
const landing = document.getElementById('landing');
const jobSheet = document.getElementById('jobSheet');
const savedSheetsPage = document.getElementById('savedSheets');

document.getElementById('createSheetBtn').onclick = () => { 
  landing.style.display='none'; 
  jobSheet.style.display='flex'; 
};
document.getElementById('savedSheetsBtn').onclick = () => { 
  landing.style.display='none'; 
  savedSheetsPage.style.display='flex'; 
  renderSavedSheets(); 
};
document.getElementById('backToLanding1').onclick = () => { 
  jobSheet.style.display='none'; 
  landing.style.display='flex'; 
};
document.getElementById('backToLanding2').onclick = () => { 
  savedSheetsPage.style.display='none'; 
  landing.style.display='flex'; 
};

/* ===== AUTO-RESIZE TEXTAREAS ===== */
const addressTA=document.getElementById('address');
const notesTA=document.getElementById('additionalNotes');
function autoResize(el){el.style.height='auto';el.style.height=el.scrollHeight+'px'}
[addressTA,notesTA].forEach(t=>t.addEventListener('input',()=>autoResize(t)));

/* ===== SAVE TOAST ===== */
const saveNotification=document.getElementById('saveNotification');
function showSaveNotification(){
  saveNotification.classList.add('show');
  setTimeout(()=>saveNotification.classList.remove('show'),1000);
}

/* ===== TABLE & SUMMARIES ===== */
const unitTableBody=document.querySelector('#unitTable tbody');
const workOptions=[
"Serviced","Due Test Awaiting Approval","Due Test Replaced","Due Test Replaced with 9W",
"Due Test Replaced with 6W","Due Test Replaced with 6F","Due Test Replaced with 5C","Due Test Replaced with 2C",
"Due Test Customer Request Not to Change","Corroded / Damaged Replaced","Corroded / Damaged","Missing",
"Missing Replaced","Bracket","Wooden Board","Due Test Replaced with 4P","Due Test Replaced with 6P",
"Due Test Replaced with 2P","Due Test Replaced with 1P","Due Test Replaced with 9P","Due Test Replaced with 3WCH",
"Due Test Replaced with 6WCH","FB Expired Replaced","FB Expired","NEW 6W","NEW 9W","NEW 6F","NEW 2C",
"NEW 5C","NEW 6P","NEW 4P","NEW FB","NEW 1P","NEW 2P","NEW 6WCH","NEW 3WCH","NEW 9P"
];
const unitList=["2C","6W","9W","6F","FB","5C","1P","2P","3P","4P","6P","9P","3F","2F","1F","9F","3W","3WC","6WC"];
let previousDates=[];

/* ===== UPDATE ROW NUMBERS =====
   SECURITY FIX: replaced innerHTML template literal with safe DOM creation.
   Using createElement + textContent ensures the row number (an integer) is
   treated as plain text, never parsed as HTML. ===== */
function updateRowNumbers(){
  [...unitTableBody.rows].forEach((r,i)=>{
    const cell = r.cells[0];
    cell.textContent = '';
    const span = document.createElement('span');
    span.className = 'row-number';
    span.textContent = i + 1;
    cell.appendChild(span);
  });
}

/* ===== ADD ROW =====
   SECURITY FIX: replaced the innerHTML template-literal block with explicit
   DOM creation. Every value (unit names, work-done options) is assigned via
   .textContent or .value so the browser never interprets them as HTML markup,
   eliminating the XSS surface entirely. ===== */
document.getElementById('addRowBtn').onclick = () => {
  const r = document.createElement('tr');

  // # column — empty until updateRowNumbers fills it
  const cellNumber = document.createElement('td');
  r.appendChild(cellNumber);

  // Unit select
  const cellUnit = document.createElement('td');
  const unitSelect = document.createElement('select');
  unitSelect.className = 'unit-input';
  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = '--';
  unitSelect.appendChild(defaultOpt);
  unitList.forEach(u => {
    const opt = document.createElement('option');
    opt.value = u;
    opt.textContent = u;
    unitSelect.appendChild(opt);
  });
  cellUnit.appendChild(unitSelect);
  r.appendChild(cellUnit);

  // Location input
  const cellLocation = document.createElement('td');
  const locInput = document.createElement('input');
  locInput.className = 'location-input';
  locInput.placeholder = 'Location';
  cellLocation.appendChild(locInput);
  r.appendChild(cellLocation);

  // Date input
  const cellDate = document.createElement('td');
  const dateInput = document.createElement('input');
  dateInput.type = 'text';
  dateInput.className = 'date-input';
  cellDate.appendChild(dateInput);
  r.appendChild(cellDate);

  // Work-done select
  const cellWork = document.createElement('td');
  const workSelect = document.createElement('select');
  workSelect.className = 'workdone-input';
  workOptions.forEach(w => {
    const opt = document.createElement('option');
    opt.value = w;
    opt.textContent = w;
    workSelect.appendChild(opt);
  });
  cellWork.appendChild(workSelect);
  r.appendChild(cellWork);

  // Delete button
  const cellAction = document.createElement('td');
  const delBtn = document.createElement('button');
  delBtn.className = 'row-btn';
  delBtn.textContent = '❌';
  delBtn.onclick = () => { r.remove(); updateRowNumbers(); updateSummaries(); };
  cellAction.appendChild(delBtn);
  r.appendChild(cellAction);

  unitTableBody.appendChild(r);

  r.querySelectorAll('input,select').forEach(i => i.oninput = updateSummaries);

  updateRowNumbers();
  setupDateAutocomplete();
};

/* ===== DATE AUTOCOMPLETE ===== */
function setupDateAutocomplete(){
  const dateInputs = document.querySelectorAll('.date-input');
  dateInputs.forEach(input=>{
    input.addEventListener('input', ()=>{
      const val = input.value.toLowerCase();
      const suggestion = previousDates.find(d=>d.toLowerCase().startsWith(val));
      if(suggestion) input.value = suggestion;
    });
  });
}

/* ===== SUMMARIES ===== */
function updateSummaries(){
  const rows=[...unitTableBody.rows];
  let tamperSeal=0,oRing=0,gaugeDot=0;
  const dueTestCount={},dueTestLocs=[];

  rows.forEach(r=>{
    const unit=r.cells[1].querySelector('select').value;
    const loc=r.cells[2].querySelector('input').value;
    const work=r.cells[4].querySelector('select').value;
    if(!unit)return;

    const tamperUnits=["2C","6W","9W","6F","5C","1P","2P","3P","4P","6P","9P","3F","2F","1F","9F","3W","3WC","6WC"];
    const oRingUnits=["2C"];
    const gaugeDotUnits=["1P","2P","3P","4P","6P","9P","2F","3F","1F","6F","9F","3W","6W","9W","3WC","6WC"];

    if(tamperUnits.includes(unit)&&unit!=="FB")tamperSeal++;
    if(oRingUnits.includes(unit))oRing++;
    if(gaugeDotUnits.includes(unit)&&!["2C","5C","FB"].includes(unit))gaugeDot++;

    if(work.toLowerCase().includes("due test")){
      dueTestCount[unit]=(dueTestCount[unit]||0)+1;
      dueTestLocs.push(`${unit} - ${loc}`);
    }
  });

  document.getElementById('inventorySummary').innerText=
  `Inventory Summary
Tamper Seals: ${tamperSeal}
O-Rings: ${oRing}
Gauge Dots: ${gaugeDot}`;

  document.getElementById('dueTestSummary').innerText=
  `DT Total:
${Object.entries(dueTestCount).map(([u,c])=>`${u}: ${c}`).join('\n')||'None'}`;

  document.getElementById('dueTestLocations').innerText=
  `Due Test Locations
${dueTestLocs.join('\n')||'None'}`;
}

/* ===== SAVE JOB SHEET ===== */
document.getElementById('saveSheetBtn').onclick = () => {
  const savedSheets = JSON.parse(localStorage.getItem('savedSheets')||'[]');
  const sheetData = {
    address:addressTA.value,
    jobNumber:document.getElementById('jobNumber').value,
    amcPO:document.getElementById('amcPO').value,
    notes:notesTA.value,
    jobDate:document.getElementById('jobDate').value,
    units:[...unitTableBody.rows].map(r=>({
      unit:r.cells[1].querySelector('select').value,
      location:r.cells[2].querySelector('input').value,
      date:r.cells[3].querySelector('input').value,
      work:r.cells[4].querySelector('select').value
    }))
  };
  savedSheets.push(sheetData);
  localStorage.setItem('savedSheets',JSON.stringify(savedSheets));
  showSaveNotification();
};

/* ===== RENDER SAVED SHEETS ===== */
function renderSavedSheets(){
  const savedList = document.getElementById('savedList');
  savedList.innerHTML = '';

  const savedSheets = JSON.parse(localStorage.getItem('savedSheets')||'[]');

  savedSheets.forEach((s,i)=>{

    const div = document.createElement('div');
    div.className = 'saved-item';

    const infoSpan = document.createElement('span');
    const jobNo = s.jobNumber || 'No Job Number';
    const address = s.address || 'No Address';
    infoSpan.textContent = `${jobNo} - ${address}`;

    const btnContainer = document.createElement('div');

    const loadBtn = document.createElement('button');
    loadBtn.textContent = 'Load';
    loadBtn.onclick = () => loadSavedSheet(i);

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => deleteSavedSheet(i);

    btnContainer.appendChild(loadBtn);
    btnContainer.appendChild(deleteBtn);

    div.appendChild(infoSpan);
    div.appendChild(btnContainer);

    savedList.appendChild(div);
  });
}

function deleteSavedSheet(idx){
  const savedSheets = JSON.parse(localStorage.getItem('savedSheets')||'[]');
  savedSheets.splice(idx,1);
  localStorage.setItem('savedSheets',JSON.stringify(savedSheets));
  renderSavedSheets();
}

/* ===== LOAD SAVED SHEET ===== */
function loadSavedSheet(idx){
  const savedSheets = JSON.parse(localStorage.getItem('savedSheets')||'[]');
  const s = savedSheets[idx];
  if(!s) return;

  savedSheetsPage.style.display='none';
  jobSheet.style.display='flex';

  addressTA.value = s.address || '';
  document.getElementById('jobNumber').value = s.jobNumber || '';
  document.getElementById('amcPO').value = s.amcPO || '';
  notesTA.value = s.notes || '';
  document.getElementById('jobDate').value = s.jobDate || '';

  unitTableBody.innerHTML = '';

  s.units.forEach((u)=>{
    const r = document.createElement('tr');

    // # column
    const cellNumber = document.createElement('td'); r.appendChild(cellNumber);

    // Unit select
    const cellUnit = document.createElement('td');
    const unitSelect = document.createElement('select'); unitSelect.className='unit-input';
    const defaultOpt=document.createElement('option'); defaultOpt.value=''; defaultOpt.textContent='--'; unitSelect.appendChild(defaultOpt);
    unitList.forEach(ul=>{const opt=document.createElement('option'); opt.value=ul; opt.textContent=ul; if(ul===u.unit) opt.selected=true; unitSelect.appendChild(opt);});
    cellUnit.appendChild(unitSelect); r.appendChild(cellUnit);

    // Location
    const cellLocation=document.createElement('td'); const locInput=document.createElement('input'); locInput.className='location-input'; locInput.value=u.location||''; cellLocation.appendChild(locInput); r.appendChild(cellLocation);

    // Date
    const cellDate=document.createElement('td'); const dateInput=document.createElement('input'); dateInput.type='text'; dateInput.className='date-input'; dateInput.value=u.date||''; cellDate.appendChild(dateInput); r.appendChild(cellDate);

    // Work select
    const cellWork=document.createElement('td'); const workSelect=document.createElement('select'); workSelect.className='workdone-input';
    workOptions.forEach(w=>{const opt=document.createElement('option'); opt.value=w; opt.textContent=w; if(w===u.work) opt.selected=true; workSelect.appendChild(opt);});
    cellWork.appendChild(workSelect); r.appendChild(cellWork);

    // Delete button
    const cellAction=document.createElement('td'); const delBtn=document.createElement('button'); delBtn.className='row-btn'; delBtn.textContent='❌';
    delBtn.onclick=()=>{r.remove(); updateRowNumbers(); updateSummaries();};
    cellAction.appendChild(delBtn); r.appendChild(cellAction);

    unitTableBody.appendChild(r);
  });

  updateRowNumbers();
  updateSummaries();
  setupDateAutocomplete();
}

/* ===== CERT PAGE ===== */
const certBtn=document.getElementById('certBtn');
const certPage=document.getElementById('certPage');
const certAddress=document.getElementById('certAddress');
const certServiceDate=document.getElementById('certServiceDate');
const certNextServiceDate=document.getElementById('certNextServiceDate');
const certQuantities=document.getElementById('certQuantities');
const certCompanyAddress=document.getElementById('certCompanyAddress');

certBtn.onclick=()=>{
  certPage.style.display = certPage.style.display==='flex'?'none':'flex';
  if(certPage.style.display==='flex'){
    certAddress.textContent=addressTA.value;

    const jobDateInput = document.getElementById('jobDate').value;
    if(jobDateInput){
      const dateObj = new Date(jobDateInput);
      const options={day:'numeric',month:'short',year:'numeric'};
      certServiceDate.textContent = dateObj.toLocaleDateString('en-GB',options).replace(/ /g,' ');
      const nextYear = new Date(dateObj);
      nextYear.setFullYear(nextYear.getFullYear()+1);
      certNextServiceDate.textContent = nextYear.toLocaleDateString('en-GB',options).replace(/ /g,' ');
    } else {
      certServiceDate.textContent='';
      certNextServiceDate.textContent='';
    }

    // Extinguishers / FB
const rows=[...unitTableBody.rows];
let extinguishers=0, fb=0;
rows.forEach(r=>{
  const unit=r.cells[1].querySelector('select').value.trim().toUpperCase(); // trim and make it uppercase for consistency
  if(unit==='FB') fb++;
  else if(unit) extinguishers++;
});
certQuantities.textContent=`Extinguishers: ${extinguishers} / Fire Blankets: ${fb}`;
  }
};



/* ===== SIGNATURE MODULE — intercepts the Export PDF button =====
   Shows a signature popup first. PDF only generates after the user
   taps Done (with signature) or Skip (without). ===== */

let capturedSignature = null; // holds the drawn signature PNG, or null if skipped

const sigModal  = document.getElementById('signatureModal');
const sigCanvas = document.getElementById('signatureCanvas');
const sigCtx    = sigCanvas.getContext('2d');
let sigDrawing  = false;

// Convert mouse or touch event to canvas-relative coordinates
function getSigPos(e) {
  const rect = sigCanvas.getBoundingClientRect();
  const src = e.touches ? e.touches[0] : e;
  return { x: src.clientX - rect.left, y: src.clientY - rect.top };
}

// Mouse drawing (desktop/laptop)
sigCanvas.addEventListener('mousedown', e => {
  sigDrawing = true;
  const p = getSigPos(e); sigCtx.beginPath(); sigCtx.moveTo(p.x, p.y);
});
sigCanvas.addEventListener('mousemove', e => {
  if (!sigDrawing) return;
  const p = getSigPos(e);
  sigCtx.lineTo(p.x, p.y);
  sigCtx.strokeStyle = '#111'; sigCtx.lineWidth = 2;
  sigCtx.lineCap = 'round'; sigCtx.lineJoin = 'round'; sigCtx.stroke();
});
sigCanvas.addEventListener('mouseup',    () => { sigDrawing = false; });
sigCanvas.addEventListener('mouseleave', () => { sigDrawing = false; });

// Touch drawing (phone/tablet) — preventDefault stops page scroll while drawing
sigCanvas.addEventListener('touchstart', e => {
  e.preventDefault(); sigDrawing = true;
  const p = getSigPos(e); sigCtx.beginPath(); sigCtx.moveTo(p.x, p.y);
}, { passive: false });
sigCanvas.addEventListener('touchmove', e => {
  e.preventDefault(); if (!sigDrawing) return;
  const p = getSigPos(e);
  sigCtx.lineTo(p.x, p.y);
  sigCtx.strokeStyle = '#111'; sigCtx.lineWidth = 2;
  sigCtx.lineCap = 'round'; sigCtx.lineJoin = 'round'; sigCtx.stroke();
}, { passive: false });
sigCanvas.addEventListener('touchend', () => { sigDrawing = false; });

// Open modal and wipe canvas clean for a fresh start
function openSignatureModal() {
  sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
  sigModal.style.display = 'flex';
}
function closeSignatureModal() { sigModal.style.display = 'none'; }

// Clear button — lets user redraw
document.getElementById('sigClearBtn').onclick = () => {
  sigCtx.clearRect(0, 0, sigCanvas.width, sigCanvas.height);
};

// Done — capture signature as PNG, close modal, run PDF
document.getElementById('sigDoneBtn').onclick = () => {
  capturedSignature = sigCanvas.toDataURL('image/png');
  closeSignatureModal();
  doExportPDF();
};

// Skip — no signature, close modal, run PDF normally
document.getElementById('sigSkipBtn').onclick = () => {
  capturedSignature = null;
  closeSignatureModal();
  doExportPDF();
};

// Export PDF button now opens signature modal first
document.getElementById('exportPDFBtn').onclick = () => {
  openSignatureModal();
};

/* ===== EXPORT PDF =====
   Called after the signature modal closes. Signature is embedded
   to the right of and just below the "Field Service Job Sheet" title
   if the user drew one. Everything else is unchanged. ===== */
function doExportPDF() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF('p', 'mm', 'a4');

  const left = 10;
  const right = 10;
  const top = 10;
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const usableWidth = pageWidth - left - right;

  let y = top;
  const lh = 2.5;
  const sh = 2.9;
  const hh = 4;

  function needSpace(h){if(y+h>pageHeight-10){pdf.addPage(); y=top;}}

  /* ===== Title ===== */
  pdf.setFont(undefined,'bold'); pdf.setFontSize(8);
  pdf.text('Field Service Job Sheet', pageWidth/2, y, {align:'center'});

  // Embed signature to the right of the title if one was drawn
  if (capturedSignature) {
    const sigW = 55;
    const sigH = sigW * (sigCanvas.height / sigCanvas.width);
    pdf.addImage(capturedSignature, 'PNG', pageWidth / 2 + 8, y + 1, sigW, sigH);
  }
  capturedSignature = null; // reset so it doesn't carry over to next export
  y += hh;

  /* ===== Pre-written Address ===== */
  const preWrittenAddress = "ANDERSON FIRE\nUnit 7\nMontrose Business Centre\nBroomfield Industrial Estate\nMontrose, Angus\nDD10 8SY";
  pdf.setFont(undefined, 'normal'); pdf.setFontSize(5);
  pdf.text(preWrittenAddress, pageWidth / 2, y, { align: 'center' });
  y += lh + 2;

  pdf.setFont(undefined,'normal'); pdf.setFontSize(6);
  const jobNumber=document.getElementById('jobNumber').value||'';
  const amcPO=document.getElementById('amcPO').value||'';
  const address=document.getElementById('address').value||'';
  const jobDate=document.getElementById('jobDate').value||'';

  pdf.text(pdf.splitTextToSize(`Job No: ${jobNumber}`, usableWidth), left, y); y+=lh;
  pdf.text(pdf.splitTextToSize(`Scutum PO: ${PO}`, usableWidth), left, y); y+=lh;
  pdf.text(pdf.splitTextToSize(`Job Date: ${jobDate}`, usableWidth), left, y); y+=lh;

  pdf.setFont('helvetica','bold'); pdf.text('Address:', left, y); y+=lh;
  pdf.setFont('helvetica','normal'); pdf.text(pdf.splitTextToSize(address, usableWidth), left, y);
  y+=pdf.splitTextToSize(address, usableWidth).length*lh+sh;

  /* ===== Summaries ===== */
  pdf.setFontSize(5);
  const colW=usableWidth/3;
  const invText=document.getElementById('inventorySummary').innerText;
  const locText=document.getElementById('dueTestLocations').innerText;
  const dtText=document.getElementById('dueTestSummary').innerText;

  const inv=pdf.splitTextToSize(invText,colW-2);
  const locs=pdf.splitTextToSize(locText,colW-2);
  const dt=pdf.splitTextToSize(dtText,colW-2);

  pdf.text(inv,left,y); pdf.text(locs,left+colW,y); pdf.text(dt,left+colW*2,y);
  y+=Math.max(inv.length,locs.length,dt.length)*lh+sh;

  /* ===== Unit Table ===== */
  const rows=[...document.querySelector('#unitTable tbody').rows].map((r,i)=>[
    i+1,
    r.cells[1].querySelector('select').value,
    r.cells[2].querySelector('input').value,
    r.cells[3].querySelector('input').value,
    r.cells[4].querySelector('select').value
  ]);

  if(rows.length){
    pdf.autoTable({
      startY:y,
      head:[['#','Unit','Location','Date','Work']],
      body:rows,
      theme: "grid",
      margin:{left,right},
      styles:{fontSize:5,cellPadding:1,lineWidth:0.1,valign:'middle'},
      headStyles:{fillColor:false,textColor:0,fontSize:5,cellPadding:1},
      columnStyles:{0:{cellWidth:8,halign:'center'},1:{cellWidth:14,halign:'center'},2:{cellWidth:60},3:{cellWidth:18,halign:'center'},4:{cellWidth:usableWidth-(8+14+60+18)}}
    });
    y=pdf.lastAutoTable.finalY+sh;
  }

  /* ===== Notes ===== */
  const notes = document.getElementById('additionalNotes').value || '';
  if (notes.trim()) {
      y += 5;
      pdf.setFont(undefined, 'bold'); pdf.setFontSize(7);
      pdf.text('Notes:', left, y);
      y += lh;
      pdf.setFont(undefined, 'normal'); pdf.setFontSize(7);
      pdf.text(pdf.splitTextToSize(notes, usableWidth), left, y);
      y += pdf.splitTextToSize(notes, usableWidth).length * lh + sh;
  }

  /* ===== Certificate (new page) ===== */
  if(certPage.style.display==='flex'){
    pdf.addPage(); 
    const topMargin = 40; 
    let y = topMargin;

    // Logos
    const logo1Img = document.getElementById('logo1');
    const logo2Img = document.getElementById('logo2');

    // Sizes
    const logo1HeightMM = 35; 
    const logo1WidthMM = logo1HeightMM * (logo1Img.naturalWidth / logo1Img.naturalHeight);

    const logo2HeightMM = 10; 
    const logo2WidthMM = logo2HeightMM * (logo2Img.naturalWidth / logo2Img.naturalHeight);

    // Positions
    const logo1X = (pageWidth - logo1WidthMM) / 2;
    const logo1Y = y;
    const spacing = 5;
    const logo2X = logo1X + logo1WidthMM + spacing;
    const logo2Y = logo1Y + (logo1HeightMM / 2 - logo2HeightMM / 2);

    // Draw logos
    pdf.addImage(logo1Img.src, 'PNG', logo1X, logo1Y, logo1WidthMM, logo1HeightMM);
    pdf.addImage(logo2Img.src, 'PNG', logo2X, logo2Y, logo2WidthMM, logo2HeightMM);

    y += logo1HeightMM + 5;

    // Default / custom company address
    const DEFAULT_COMPANY_ADDRESS = `ANDERSON FIRE LTD
Unit 7
Montrose Business Centre
Broomfield Industrial Estate
Montrose, Angus
DD10 8SY`;

    const companyInput = document.getElementById('certCompanyAddress');
    const companyAddr = companyInput.value.trim() ? companyInput.value : DEFAULT_COMPANY_ADDRESS;

    const compLines = companyAddr.split('\n');

    pdf.setFont(undefined,'bold');
    pdf.setFontSize(20); 
    pdf.text(compLines[0], pageWidth/2, y, {align:'center'});
    y += 8;

    pdf.setFontSize(10);
    compLines.slice(1).forEach(line=>{
      pdf.text(line, pageWidth/2, y, {align:'center'});
      y += 6;
    });

    y += 6;

    pdf.setFont(undefined,'bold'); pdf.setFontSize(9);

    const certNo=document.getElementById('jobNumber').value||'';
    const serviceDate=document.getElementById('certServiceDate').textContent||'';
    const nextService=document.getElementById('certNextServiceDate').textContent||'';
    const quantities=document.getElementById('certQuantities').textContent||'';
    const addressText=document.getElementById('certAddress').textContent||'';
    const technician=document.getElementById('certTechnician').value||'';
    const dutyOfCare=`DUTY OF CARE WASTE TRANSFER NOTE: By signing, the customer hereby authorises Anderson Fire to dispose of extinguishers to be removed the customers site, through an authorised waste disposal agent. Anderson Fire have serviced the portable fire extinguishers and other fire protection equipment within the premises identified above in accordance with the requirements and frequencies indicated by BS5306 PART 3 and refilled when required in accordance with BS6643 Part 1. Where dry powder extinguishers are installed the customer accepts responsibility for any secondary damage caused to people and processes. According to BS5306 part 3, it is the duty of the responsible person in the premises to inspect extinguishers at monthly intervals.`;

    const centerX=pageWidth/2;
    function addLine(text,fontSize=9,bold=false,spacing=7){
      pdf.setFont(undefined,bold?'bold':'normal'); pdf.setFontSize(fontSize);
      const lines=pdf.splitTextToSize(text,pageWidth-20);
      lines.forEach(line=>{pdf.text(line,centerX,y,{align:'center'}); y+=spacing;});
    }

    addLine(`Cert No: ${certNo}`);
    addLine(`Date of Service: ${serviceDate}`);
    addLine(`Next Service Date: ${nextService}`);
    let updatedQuantities = quantities.replace(/FB/,'Fire Blankets').replace(/Extinguishers/,'Fire Extinguishers');
    addLine(updatedQuantities);
    addLine('');
    addLine('Address:',9,true,6);
    addressText.split('\n').forEach(line=>addLine(line,9,false,4));
    addLine('');
    addLine(`Technician: ${technician}`);
    addLine('');
    const dutyY=pdf.internal.pageSize.getHeight()-50;
    addLine(dutyOfCare,7,false,5,dutyY);
  }

  pdf.save(`JobSheet_${Date.now()}.pdf`);
}

/* ===== LOCATION AUTO-CAPITALIZE & NAME MEMORY ===== */

// Load previously entered location names from localStorage
let sessionLocations = [];

// Update datalist for autocomplete
function updateLocationDatalist() {
  let dataList = document.getElementById('locationList');
  if (!dataList) {
    dataList = document.createElement('datalist');
    dataList.id = 'locationList';
    document.body.appendChild(dataList);
  }
  dataList.innerHTML = '';
  sessionLocations.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    dataList.appendChild(option);
  });
}

// Capitalize words helper
function capitalizeWords(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Apply to all current and future location inputs
function setupLocationInputs() {
  const inputs = document.querySelectorAll('.location-input');
  inputs.forEach(input => {
    // attach datalist for autocomplete
    input.setAttribute('list','locationList');

    input.addEventListener('input', e => {
      // Auto-capitalize each word
      const cursorPos = e.target.selectionStart; // preserve cursor
      e.target.value = capitalizeWords(e.target.value);
      e.target.setSelectionRange(cursorPos, cursorPos);
    });

    input.addEventListener('change', e => {
      const val = e.target.value.trim();
   if (val && !sessionLocations.includes(val)) {
  sessionLocations.push(val);
  updateLocationDatalist();
}
    });
  });
}

// Initialize on page load and whenever a new row is added
updateLocationDatalist();
setupLocationInputs();

// Re-run setup whenever a new row is added
const originalAddRow = document.getElementById('addRowBtn').onclick;
document.getElementById('addRowBtn').onclick = () => {
  originalAddRow();       // existing add row logic
  setupLocationInputs();  // attach auto-capitalize & autocomplete to new row
};

/* ===== SERVICE WORKER ===== */
if('serviceWorker' in navigator){
  navigator.serviceWorker.register('./service-worker.js');
}
