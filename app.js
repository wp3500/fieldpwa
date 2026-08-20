/* =========================================================
   NAVIGATION
   =========================================================
   This section controls which "page" of the app is visible.

   The app has:
   - Landing page
   - Job Sheet page
   - Saved Sheets page

   Changing "display" between "none", "flex", etc. determines
   which page the user can currently see.
   ========================================================= */

const landing = document.getElementById('landing');
const jobSheet = document.getElementById('jobSheet');
const savedSheetsPage = document.getElementById('savedSheets');


/*
   CREATE SHEET BUTTON

   When the user clicks "Create Sheet":
   - Hide the landing page
   - Show the job sheet page
*/
document.getElementById('createSheetBtn').onclick = () => {
  landing.style.display='none';
  jobSheet.style.display='flex';
};


/*
   SAVED SHEETS BUTTON

   When the user clicks "Saved Sheets":
   - Hide the landing page
   - Show the saved sheets page
   - Run renderSavedSheets() so the saved jobs appear
*/
document.getElementById('savedSheetsBtn').onclick = () => {
  landing.style.display='none';
  savedSheetsPage.style.display='flex';
  renderSavedSheets();
};


/*
   BACK TO LANDING PAGE FROM JOB SHEET
*/
document.getElementById('backToLanding1').onclick = () => {
  jobSheet.style.display='none';
  landing.style.display='flex';
};


/*
   BACK TO LANDING PAGE FROM SAVED SHEETS
*/
document.getElementById('backToLanding2').onclick = () => {
  savedSheetsPage.style.display='none';
  landing.style.display='flex';
};


/* =========================================================
   AUTO-RESIZE TEXTAREAS
   =========================================================
   This makes the Address and Additional Notes text boxes
   automatically grow taller when the user types more text.
   ========================================================= */

const addressTA=document.getElementById('address');
const notesTA=document.getElementById('additionalNotes');


/*
   autoResize()

   "el" means the HTML element we want to resize.

   First:
      height = auto

   This allows the browser to recalculate the correct height.

   Then:
      scrollHeight

   tells us how tall the content actually needs to be.
*/
function autoResize(el){
  el.style.height='auto';
  el.style.height=el.scrollHeight+'px';
}


/*
   Whenever the user types into either textarea,
   automatically resize it.
*/
[addressTA,notesTA].forEach(t=>t.addEventListener('input',()=>autoResize(t)));


/* =========================================================
   SAVE TOAST / SAVE NOTIFICATION
   =========================================================
   This controls the little "Saved" notification that appears
   after a job sheet has been saved.
   ========================================================= */

const saveNotification=document.getElementById('saveNotification');


/*
   Shows the save notification.

   "show" is presumably a CSS class that makes the notification
   visible.

   After 1000 milliseconds (1 second), the "show" class is removed
   and the notification disappears.
*/
function showSaveNotification(){
  saveNotification.classList.add('show');

  setTimeout(
    ()=>saveNotification.classList.remove('show'),
    1000
  );
}


/* =========================================================
   TABLE & SUMMARIES
   =========================================================
   This section contains:
   - The unit table
   - Available work options
   - Available unit types
   - Previously entered dates
   ========================================================= */

const unitTableBody=document.querySelector('#unitTable tbody');


/*
   These are all of the options that can appear in the
   "Work Done" dropdown for each table row.

   To ADD a new Work Done option:
   Add another item between the quotation marks.

   Example:
      "New Work Option"

   To REMOVE an option:
   Delete its line from this list.
*/
const workOptions=[
"Serviced","Due Test Awaiting Approval","Due Test Replaced","Due Test Replaced with 9W",
"Due Test Replaced with 6W","Due Test Replaced with 6F","Due Test Replaced with 5C","Due Test Replaced with 2C",
"Due Test Customer Request Not to Change","Corroded / Damaged Replaced","Corroded / Damaged","Missing",
"Missing Replaced","Bracket","Wooden Board","Due Test Replaced with 4P","Due Test Replaced with 6P",
"Due Test Replaced with 2P","Due Test Replaced with 1P","Due Test Replaced with 9P","Due Test Replaced with 3WCH",
"Due Test Replaced with 6WCH","FB Expired Replaced","FB Expired","NEW 6W","NEW 9W","NEW 6F","NEW 2C",
"NEW 5C","NEW 6P","NEW 4P","NEW FB","NEW 1P","NEW 2P","NEW 6WCH","NEW 3WCH","NEW 9P"
];


/*
   These are the available unit types that appear in the
   "Unit" dropdown.

   To add another unit:
      Add it to this list.

   Example:
      "10W"
*/
const unitList=[
  "2C","6W","9W","6F","FB","5C","1P","2P","3P","4P",
  "6P","9P","3F","2F","1F","9F","3W","3WC","6WC"
];


/*
   Stores dates that have previously been entered.

   This is used by the date autocomplete system later.
*/
let previousDates=[];


/* =========================================================
   UPDATE ROW NUMBERS
   =========================================================
   Every row in the unit table needs a number:
   1, 2, 3, 4, etc.

   This function goes through every row and updates the number.

   It is called after adding or deleting rows so the numbering
   always stays correct.
   ========================================================= */

function updateRowNumbers(){

  [...unitTableBody.rows].forEach((r,i)=>{

    const cell=r.cells[0];

    /*
       Clear whatever is currently inside the first cell.
    */
    cell.textContent='';


    /*
       Create a <span> element to hold the row number.
    */
    const span=document.createElement('span');


    /*
       Gives the span the CSS class "row-number".

       Its appearance can therefore also be controlled from CSS.
    */
    span.className='row-number';


    /*
       i starts at 0, so we add 1.

       Row 0 becomes number 1.
       Row 1 becomes number 2.
       etc.
    */
    span.textContent=i+1;


    /*
       Put the number inside the first table cell.
    */
    cell.appendChild(span);
  });
}


/* =========================================================
   ADD ROW
   =========================================================
   This is the code that creates a NEW unit-table row.

   Each time the user clicks "Add Row", this entire function
   runs and creates:
   - Row number
   - Unit dropdown
   - Location input
   - Date input
   - Work Done dropdown
   - Delete button
   ========================================================= */

document.getElementById('addRowBtn').onclick=()=>{

  /*
     Create a new table row.
  */
  const r=document.createElement('tr');


  /* -------------------------
     ROW NUMBER CELL
     ------------------------- */
  const cellNumber=document.createElement('td');
  r.appendChild(cellNumber);


  /* -------------------------
     UNIT CELL
     ------------------------- */

  const cellUnit=document.createElement('td');

  const unitSelect=document.createElement('select');

  /*
     CSS class for the Unit dropdown.
  */
  unitSelect.className='unit-input';


  /*
     Create the default "--" option.
  */
  const defaultOpt=document.createElement('option');
  defaultOpt.value='';
  defaultOpt.textContent='--';
  unitSelect.appendChild(defaultOpt);


  /*
     Add every item from unitList into the dropdown.
  */
  unitList.forEach(u=>{

    const opt=document.createElement('option');

    opt.value=u;
    opt.textContent=u;

    unitSelect.appendChild(opt);
  });


  cellUnit.appendChild(unitSelect);
  r.appendChild(cellUnit);


  /* -------------------------
     LOCATION CELL
     ------------------------- */

  const cellLocation=document.createElement('td');

  const locInput=document.createElement('input');

  /*
     CSS class for the Location input.
  */
  locInput.className='location-input';

  locInput.placeholder='Location';

  cellLocation.appendChild(locInput);
  r.appendChild(cellLocation);


  /* -------------------------
     DATE CELL
     ------------------------- */

  const cellDate=document.createElement('td');

  const dateInput=document.createElement('input');

  /*
     This is intentionally a text input rather than an HTML
     date picker.
  */
  dateInput.type='text';

  dateInput.className='date-input';

  cellDate.appendChild(dateInput);
  r.appendChild(cellDate);


  /* -------------------------
     WORK DONE CELL
     ------------------------- */

  const cellWork=document.createElement('td');

  const workSelect=document.createElement('select');

  workSelect.className='workdone-input';


  /*
     Add every Work Done option to the dropdown.
  */
  workOptions.forEach(w=>{

    const opt=document.createElement('option');

    opt.value=w;
    opt.textContent=w;

    workSelect.appendChild(opt);
  });


  cellWork.appendChild(workSelect);
  r.appendChild(cellWork);


  /* -------------------------
     DELETE BUTTON CELL
     ------------------------- */

  const cellAction=document.createElement('td');

  const delBtn=document.createElement('button');

  delBtn.className='row-btn';
  delBtn.textContent='❌';


  /*
     When the delete button is clicked:
     1. Remove this row.
     2. Renumber the remaining rows.
     3. Recalculate the summaries.
  */
  delBtn.onclick=()=>{
    r.remove();
    updateRowNumbers();
    updateSummaries();
  };


  cellAction.appendChild(delBtn);
  r.appendChild(cellAction);


  /*
     Finally add the newly created row to the table.
  */
  unitTableBody.appendChild(r);


  /*
     Whenever the user changes anything in this row,
     update the summaries.
  */
  r.querySelectorAll('input,select').forEach(
    i=>i.oninput=updateSummaries
  );


  /*
     Update row numbers after adding the row.
  */
  updateRowNumbers();


  /*
     Activate the date autocomplete system for the new row.
  */
  setupDateAutocomplete();
};


/* =========================================================
   DATE AUTOCOMPLETE
   =========================================================
   Attempts to automatically complete a date based on previously
   entered dates.
   ========================================================= */

function setupDateAutocomplete(){

  const dateInputs=document.querySelectorAll('.date-input');

  dateInputs.forEach(input=>{

    input.addEventListener('input',()=>{

      const val=input.value.toLowerCase();


      /*
         Look through previousDates and find the first date
         beginning with whatever the user has typed.
      */
      const suggestion=previousDates.find(
        d=>d.toLowerCase().startsWith(val)
      );


      /*
         If a matching date was found, put it into the input.
      */
      if(suggestion)input.value=suggestion;
    });
  });
}


/* =========================================================
   SUMMARIES
   =========================================================
   Counts various pieces of equipment and creates the summary
   information shown on the job sheet.
   ========================================================= */

function updateSummaries(){

  const rows=[...unitTableBody.rows];

  let tamperSeal=0;
  let oRing=0;
  let gaugeDot=0;

  const dueTestCount={};
  const dueTestLocs=[];


  /*
     Go through every table row.
  */
  rows.forEach(r=>{

    const unit=r.cells[1].querySelector('select').value;
    const loc=r.cells[2].querySelector('input').value;
    const work=r.cells[4].querySelector('select').value;

    /*
       If no unit has been selected, ignore this row.
    */
    if(!unit)return;


    /*
       These lists determine which units require which items.
    */
    const tamperUnits=[
      "2C","6W","9W","6F","5C","1P","2P","3P","4P",
      "6P","9P","3F","2F","1F","9F","3W","3WC","6WC"
    ];

    const oRingUnits=["2C"];

    const gaugeDotUnits=[
      "1P","2P","3P","4P","6P","9P","2F","3F",
      "1F","6F","9F","3W","6W","9W","3WC","6WC"
    ];


    /*
       Count Tamper Seals.
    */
    if(tamperUnits.includes(unit)&&unit!=="FB")tamperSeal++;


    /*
       Count O-Rings.
    */
    if(oRingUnits.includes(unit))oRing++;


    /*
       Count Gauge Dots.
    */
    if(
      gaugeDotUnits.includes(unit)&&
      !["2C","5C","FB"].includes(unit)
    ){
      gaugeDot++;
    }


    /*
       If the Work Done description contains "due test",
       count that unit and remember its location.
    */
    if(work.toLowerCase().includes("due test")){

      dueTestCount[unit]=(dueTestCount[unit]||0)+1;

      dueTestLocs.push(`${unit} - ${loc}`);
    }
  });


  /*
     Display the inventory summary.
  */
  document.getElementById('inventorySummary').innerText=
    `Inventory Summary\nTamper Seals: ${tamperSeal}\nO-Rings: ${oRing}\nGauge Dots: ${gaugeDot}`;


  /*
     Display the Due Test totals.
  */
  document.getElementById('dueTestSummary').innerText=
    `DT Total:\n${
      Object.entries(dueTestCount)
        .map(([u,c])=>`${u}: ${c}`)
        .join('\n')||'None'
    }`;


  /*
     Display the Due Test locations.
  */
  document.getElementById('dueTestLocations').innerText=
    `Due Test Locations\n${
      dueTestLocs.join('\n')||'None'
    }`;
};


/* =========================================================
   SAVE JOB SHEET
   =========================================================
   Saves the current job sheet into the browser's localStorage.

   localStorage means the information is stored inside the
   user's browser rather than on a server.
   ========================================================= */

document.getElementById('saveSheetBtn').onclick=()=>{

  /*
     Get all previously saved sheets.

     If there aren't any, use an empty array [].
  */
  const savedSheets=
    JSON.parse(localStorage.getItem('savedSheets')||'[]');


  /*
     Build an object containing all information from this job.
  */
  const sheetData={

    address:addressTA.value,

    jobNumber:
      document.getElementById('jobNumber').value,

    amcPO:
      document.getElementById('amcPO').value,

    notes:notesTA.value,

    jobDate:
      document.getElementById('jobDate').value,

    technician:
      document.getElementById('certTechnician').value,


    /*
       Save every row of the unit table.
    */
    units:[...unitTableBody.rows].map(r=>({

      unit:
        r.cells[1].querySelector('select').value,

      location:
        r.cells[2].querySelector('input').value,

      date:
        r.cells[3].querySelector('input').value,

      work:
        r.cells[4].querySelector('select').value
    }))
  };


  /*
     Add the current job to the saved sheets array.
  */
  savedSheets.push(sheetData);


  /*
     Convert the JavaScript object into text and save it.
  */
  localStorage.setItem(
    'savedSheets',
    JSON.stringify(savedSheets)
  );


  /*
     Show the "Saved" notification.
  */
  showSaveNotification();
};


/* =========================================================
   RENDER SAVED SHEETS
   =========================================================
   Builds the list of previously saved job sheets.
   ========================================================= */

function renderSavedSheets(){

  const savedList=document.getElementById('savedList');

  /*
     Clear the existing list before rebuilding it.
  */
  savedList.innerHTML='';


  /*
     Get saved jobs from localStorage.
  */
  const savedSheets=
    JSON.parse(localStorage.getItem('savedSheets')||'[]');


  /*
     Create a visual item for every saved job.
  */
  savedSheets.forEach((s,i)=>{

    const div=document.createElement('div');

    div.className='saved-item';


    const infoSpan=document.createElement('span');

    const jobNo=s.jobNumber||'No Job Number';
    const address=s.address||'No Address';

    infoSpan.textContent=`${jobNo} - ${address}`;


    /*
       Create the Load and Delete buttons.
    */
    const btnContainer=document.createElement('div');

    const loadBtn=document.createElement('button');

    loadBtn.textContent='Load';

    loadBtn.onclick=()=>loadSavedSheet(i);


    const deleteBtn=document.createElement('button');

    deleteBtn.textContent='Delete';

    deleteBtn.onclick=()=>deleteSavedSheet(i);


    btnContainer.appendChild(loadBtn);
    btnContainer.appendChild(deleteBtn);

    div.appendChild(infoSpan);
    div.appendChild(btnContainer);

    savedList.appendChild(div);
  });
}


/* =========================================================
   DELETE SAVED SHEET
   ========================================================= */

function deleteSavedSheet(idx){

  /*
     Load all saved sheets.
  */
  const savedSheets=
    JSON.parse(localStorage.getItem('savedSheets')||'[]');


  /*
     Remove one item from the array.

     "idx" tells us which saved sheet to remove.
  */
  savedSheets.splice(idx,1);


  /*
     Save the updated list.
  */
  localStorage.setItem(
    'savedSheets',
    JSON.stringify(savedSheets)
  );


  /*
     Refresh the visible list.
  */
  renderSavedSheets();
};


/* =========================================================
   LOAD SAVED SHEET
   =========================================================
   Takes a previously saved job and puts all of its information
   back into the form.
   ========================================================= */

function loadSavedSheet(idx){

  const savedSheets=
    JSON.parse(localStorage.getItem('savedSheets')||'[]');

  const s=savedSheets[idx];


  /*
     If that saved sheet doesn't exist, stop.
  */
  if(!s)return;


  /*
     Hide Saved Sheets and show the Job Sheet.
  */
  savedSheetsPage.style.display='none';
  jobSheet.style.display='flex';


  /*
     Restore the normal form fields.
  */
  addressTA.value=s.address||'';

  document.getElementById('jobNumber').value=s.jobNumber||'';

  document.getElementById('amcPO').value=s.amcPO||'';

  notesTA.value=s.notes||'';

  document.getElementById('jobDate').value=s.jobDate||'';

  document.getElementById('certTechnician').value=s.technician||'';


  /*
     Remove all current table rows.
  */
  unitTableBody.innerHTML='';


  /*
     Re-create every saved table row.
  */
  s.units.forEach(u=>{

    const r=document.createElement('tr');


    /* Row number cell */
    const cellNumber=document.createElement('td');
    r.appendChild(cellNumber);


    /* Unit dropdown */
    const cellUnit=document.createElement('td');

    const unitSelect=document.createElement('select');

    unitSelect.className='unit-input';

    const defaultOpt=document.createElement('option');

    defaultOpt.value='';
    defaultOpt.textContent='--';

    unitSelect.appendChild(defaultOpt);


    /*
       Add all unit options and select the saved one.
    */
    unitList.forEach(ul=>{

      const opt=document.createElement('option');

      opt.value=ul;
      opt.textContent=ul;

      if(ul===u.unit)opt.selected=true;

      unitSelect.appendChild(opt);
    });

    cellUnit.appendChild(unitSelect);
    r.appendChild(cellUnit);


    /* Location */
    const cellLocation=document.createElement('td');

    const locInput=document.createElement('input');

    locInput.className='location-input';

    locInput.value=u.location||'';

    cellLocation.appendChild(locInput);
    r.appendChild(cellLocation);


    /* Date */
    const cellDate=document.createElement('td');

    const dateInput=document.createElement('input');

    dateInput.type='text';

    dateInput.className='date-input';

    dateInput.value=u.date||'';

    cellDate.appendChild(dateInput);
    r.appendChild(cellDate);


    /* Work Done */
    const cellWork=document.createElement('td');

    const workSelect=document.createElement('select');

    workSelect.className='workdone-input';


    /*
       Add all work options and select the saved option.
    */
    workOptions.forEach(w=>{

      const opt=document.createElement('option');

      opt.value=w;
      opt.textContent=w;

      if(w===u.work)opt.selected=true;

      workSelect.appendChild(opt);
    });


    cellWork.appendChild(workSelect);
    r.appendChild(cellWork);


    /* Delete button */
    const cellAction=document.createElement('td');

    const delBtn=document.createElement('button');

    delBtn.className='row-btn';

    delBtn.textContent='❌';


    delBtn.onclick=()=>{
      r.remove();
      updateRowNumbers();
      updateSummaries();
    };


    cellAction.appendChild(delBtn);
    r.appendChild(cellAction);


    unitTableBody.appendChild(r);
  });


  /*
     Recalculate everything after loading.
  */
  updateRowNumbers();
  updateSummaries();
  setupDateAutocomplete();
}


/* =========================================================
   SIGNATURE MODULE
   =========================================================
   This section creates the signature drawing box.

   The user can:
   - Draw with a mouse
   - Draw with a touchscreen
   - Clear the signature
   - Accept the signature
   - Skip the signature
   ========================================================= */

let capturedSignature=null;


const sigModal=
  document.getElementById('signatureModal');

const sigCanvas=
  document.getElementById('signatureCanvas');

const sigCtx=
  sigCanvas.getContext('2d');

let sigDrawing=false;


/*
   Converts the mouse/touch position into a position relative
   to the signature canvas.
*/
function getSigPos(e){

  const rect=sigCanvas.getBoundingClientRect();

  const src=e.touches?e.touches[0]:e;

  return{
    x:src.clientX-rect.left,
    y:src.clientY-rect.top
  };
}


/* -------------------------
   MOUSE DRAWING
   ------------------------- */

sigCanvas.addEventListener('mousedown',e=>{

  sigDrawing=true;

  const p=getSigPos(e);

  sigCtx.beginPath();
  sigCtx.moveTo(p.x,p.y);
});


sigCanvas.addEventListener('mousemove',e=>{

  if(!sigDrawing)return;

  const p=getSigPos(e);

  sigCtx.lineTo(p.x,p.y);

  /*
     Signature colour.
     Change #111 to another colour if desired.
  */
  sigCtx.strokeStyle='#111';


  /*
     Signature line thickness.

     Increase 2 -> 4 for a thicker signature.
     Decrease 2 -> 1 for a thinner signature.
  */
  sigCtx.lineWidth=2;

  sigCtx.lineCap='round';
  sigCtx.lineJoin='round';

  sigCtx.stroke();
});


sigCanvas.addEventListener('mouseup',()=>{
  sigDrawing=false;
});


sigCanvas.addEventListener('mouseleave',()=>{
  sigDrawing=false;
});


/* -------------------------
   TOUCHSCREEN DRAWING
   ------------------------- */

sigCanvas.addEventListener('touchstart',e=>{

  e.preventDefault();

  sigDrawing=true;

  const p=getSigPos(e);

  sigCtx.beginPath();
  sigCtx.moveTo(p.x,p.y);

},{passive:false});


sigCanvas.addEventListener('touchmove',e=>{

  e.preventDefault();

  if(!sigDrawing)return;

  const p=getSigPos(e);

  sigCtx.lineTo(p.x,p.y);

  sigCtx.strokeStyle='#111';

  sigCtx.lineWidth=2;

  sigCtx.lineCap='round';
  sigCtx.lineJoin='round';

  sigCtx.stroke();

},{passive:false});


sigCanvas.addEventListener('touchend',()=>{
  sigDrawing=false;
});


/* -------------------------
   OPEN SIGNATURE WINDOW
   ------------------------- */

function openSignatureModal(){

  /*
     Clear any previous signature.
  */
  sigCtx.clearRect(
    0,
    0,
    sigCanvas.width,
    sigCanvas.height
  );


  /*
     Show the signature modal.
  */
  sigModal.style.display='flex';
}


/* Close signature window */
function closeSignatureModal(){
  sigModal.style.display='none';
}


/* Clear signature button */
document.getElementById('sigClearBtn').onclick=()=>{

  sigCtx.clearRect(
    0,
    0,
    sigCanvas.width,
    sigCanvas.height
  );
};


/*
   DONE BUTTON

   Convert the signature canvas into a PNG image.

   Then close the signature window and generate the PDF.
*/
document.getElementById('sigDoneBtn').onclick=()=>{

  capturedSignature=
    sigCanvas.toDataURL('image/png');

  closeSignatureModal();

  doExportPDF();
};


/*
   SKIP SIGNATURE BUTTON

   Removes any signature and generates the PDF without one.
*/
document.getElementById('sigSkipBtn').onclick=()=>{

  capturedSignature=null;

  closeSignatureModal();

  doExportPDF();
};


/*
   EXPORT PDF BUTTON

   Before opening the signature window, check that jsPDF
   has actually loaded.
*/
document.getElementById('exportPDFBtn').onclick=()=>{

  if(!window.jspdf){

    alert(
      'PDF library not loaded. Please refresh the page and try again.'
    );

    return;
  }

  openSignatureModal();
};


/* =========================================================
   EXPORT PDF
   =========================================================
   THIS IS THE MAIN PDF GENERATION SECTION.

   Everything below controls what gets put into the PDF.

   jsPDF is being used to create the PDF.

   IMPORTANT:

   jsPDF uses MILLIMETRES here because of:

       new jsPDF('p','mm','a4');

   Therefore most certificate position and size numbers below
   are in MILLIMETRES, not pixels.
   ========================================================= */

function doExportPDF(){

  /*
     Get the jsPDF constructor.
  */
  const{jsPDF}=window.jspdf;


  /*
     Create an A4 PDF.

     'p' = portrait
     'mm' = measurements are millimetres
     'a4' = A4 paper size
  */
  const pdf=new jsPDF({
  orientation:'p',
  unit:'mm',
  format:'a4',
  compress:true
});


  /* =======================================================
     GENERAL PAGE SETTINGS
     ======================================================= */

  /*
     These control the margins used by the FIRST page.

     left = distance from left edge
     right = distance from right edge
     top = distance from top edge
  */
  const left=10;
  const right=10;
  const top=10;


  /*
     Get the physical width and height of A4.

     A4 is approximately:
     Width  = 210mm
     Height = 297mm
  */
  const pageWidth=
    pdf.internal.pageSize.getWidth();

  const pageHeight=
    pdf.internal.pageSize.getHeight();


  /*
     usableWidth is the width remaining after the left and
     right margins are removed.
  */
  const usableWidth=
    pageWidth-left-right;


  /*
     y is the current vertical position on the first page.

     Increasing y moves things DOWN.
     Decreasing y moves things UP.
  */
  let y=top;


  /*
     lh = line height / normal vertical spacing
     sh = additional spacing
     hh = title/header spacing

     These mainly affect the first page.
  */
  const lh=2.5;
  const sh=2.9;
  const hh=4;


  /* =======================================================
     FIRST PAGE — TITLE
     ======================================================= */

  pdf.setFont(undefined,'bold');

  /*
     Font size for "Field Service Job Sheet".
  */
  pdf.setFontSize(8);


  /*
     pageWidth/2 = centre of the page.

     Changing pageWidth/2 to another value would move the title
     horizontally.

     The text is centered because of:
        align:'center'
  */
  pdf.text(
    'Field Service Job Sheet',
    pageWidth/2,
    y,
    {align:'center'}
  );


  /* =======================================================
     SIGNATURE ON FIRST PAGE
     ======================================================= */

  if(capturedSignature){

    /*
       SIGNATURE WIDTH

       This is the main number controlling the signature size.

       Increase 55 -> 70
       = larger signature.

       Decrease 55 -> 40
       = smaller signature.
    */
    const sigW=55;


    /*
       Automatically calculate the signature height based on
       the original signature canvas proportions.

       You normally DON'T need to change this.
    */
    const sigH=
      sigW*(sigCanvas.height/sigCanvas.width);


    /*
       Signature position and size.

       X POSITION:
       pageWidth/2+8

       Increase +8 -> +20
       = move signature RIGHT.

       Change +8 -> -5
       = move signature LEFT.

       Y POSITION:
       y+1

       Increase +1 -> +10
       = move signature DOWN.

       Decrease +1 -> -5
       = move signature UP.

       SIZE:
       sigW = width
       sigH = height
    */
    pdf.addImage(
      capturedSignature,
      'PNG',
      pageWidth/2+8,
      y+1,
      sigW,
      sigH
    );
  }


  capturedSignature=null;

  y+=hh;


  /* =======================================================
     FIRST PAGE — PRE-WRITTEN ADDRESS
     ======================================================= */

  /*
     IMPORTANT:

     Your original code used curly quotation marks here.

     JavaScript needs normal quotes.

     Change the text between the quotes to whatever you want
     printed above the job details.
  */
  const preWrittenAddress="ANDERSON FIRE\nUnit 7\nMontrose Business Centre\nBroomfield Industrial Estate\nMontrose, Angus\nDD10 8SY";


  /*
     Font style.
  */
  pdf.setFont(undefined,'normal');


  /*
     Font size of this text.

     Increase 5 -> 8 = larger.
     Decrease 5 -> 4 = smaller.
  */
  pdf.setFontSize(5);


  /*
     Position:
     pageWidth/2 = horizontal centre
     y = current vertical position

     align:'center' means the text is centred.
  */
  pdf.text(
    preWrittenAddress,
    pageWidth/2,
    y,
    {align:'center'}
  );


  y+=lh+2;


  /* =======================================================
     FIRST PAGE — JOB DETAILS
     ======================================================= */

  pdf.setFont(undefined,'normal');
  pdf.setFontSize(6);


  /*
     Get information from the form.
  */
  const jobNumber=
    document.getElementById('jobNumber').value||'';

  const amcPO=
    document.getElementById('amcPO').value||'';

  const address=
    document.getElementById('address').value||'';

  const jobDate=
    document.getElementById('jobDate').value||'';


  /*
     These are positioned from the LEFT margin.

     Therefore:

       left = 10

     means the text starts 10mm from the left edge.

     Increase left -> move these items RIGHT.
     Decrease left -> move these items LEFT.
  */

  pdf.text(
    pdf.splitTextToSize(
      `Job No: ${jobNumber}`,
      usableWidth
    ),
    left,
    y
  );

  y+=lh;


  pdf.text(
    pdf.splitTextToSize(
      `PO: ${amcPO}`,
      usableWidth
    ),
    left,
    y
  );

  y+=lh;


  pdf.text(
    pdf.splitTextToSize(
      `Job Date: ${jobDate}`,
      usableWidth
    ),
    left,
    y
  );

  y+=lh;


  /*
     "Address:" is bold.
  */
  pdf.setFont(
    'helvetica',
    'bold'
  );

  pdf.text(
    'Address:',
    left,
    y
  );

  y+=lh;


  /*
     Actual address is normal weight.
  */
  pdf.setFont(
    'helvetica',
    'normal'
  );


  /*
     splitTextToSize() makes long text wrap onto multiple lines
     instead of running outside the page.
  */
  pdf.text(
    pdf.splitTextToSize(
      address,
      usableWidth
    ),
    left,
    y
  );


  y+=
    pdf.splitTextToSize(
      address,
      usableWidth
    ).length*lh+sh;


  /* =======================================================
     FIRST PAGE — SUMMARIES
     ======================================================= */

  pdf.setFontSize(5);


  /*
     Divide the available width into three equal columns.
  */
  const colW=usableWidth/3;


  /*
     Get the summary text from the page.
  */
  const invText=
    document.getElementById('inventorySummary').innerText;

  const locText=
    document.getElementById('dueTestLocations').innerText;

  const dtText=
    document.getElementById('dueTestSummary').innerText;


  /*
     Wrap each summary so it fits inside its column.
  */
  const inv=
    pdf.splitTextToSize(invText,colW-2);

  const locs=
    pdf.splitTextToSize(locText,colW-2);

  const dt=
    pdf.splitTextToSize(dtText,colW-2);


  /*
     COLUMN 1:
     Inventory
  */
  pdf.text(
    inv,
    left,
    y
  );


  /*
     COLUMN 2:
     Due Test Locations
  */
  pdf.text(
    locs,
    left+colW,
    y
  );


  /*
     COLUMN 3:
     Due Test Totals
  */
  pdf.text(
    dt,
    left+colW*2,
    y
  );


  /*
     Move down far enough to clear whichever summary is tallest.
  */
  y+=
    Math.max(
      inv.length,
      locs.length,
      dt.length
    )*lh+sh;


  /* =======================================================
     FIRST PAGE — UNIT TABLE
     ======================================================= */

  /*
     Read all rows from the HTML table and turn them into
     simple JavaScript data for the PDF.
  */
  const rows=[
    ...document.querySelector(
      '#unitTable tbody'
    ).rows
  ].map((r,i)=>[

    i+1,

    r.cells[1]
      .querySelector('select')
      .value,

    r.cells[2]
      .querySelector('input')
      .value,

    r.cells[3]
      .querySelector('input')
      .value,

    r.cells[4]
      .querySelector('select')
      .value

  ]);


  /*
     Only create the PDF table if there are rows.
  */
  if(rows.length){

    pdf.autoTable({

      /*
         Vertical position where the table begins.
      */
      startY:y,


      /*
         Table headings.
      */
      head:[
        ['#','Unit','Location','Date','Work']
      ],


      /*
         Actual table data.
      */
      body:rows,


      /*
         "grid" creates borders around the cells.
      */
      theme:"grid",


      /*
         Left and right margins.
      */
      margin:{
        left,
        right
      },


      /*
         General table styling.
      */
      styles:{

        /*
           Table text size.

           Increase 5 -> 7 = larger text.
           Decrease 5 -> 4 = smaller text.
        */
        fontSize:5,

        /*
           Space between text and cell edges.

           Increase = more internal spacing.
           Decrease = tighter cells.
        */
        cellPadding:1,

        /*
           Thickness of table lines.
        */
        lineWidth:0.1,

        /*
           Vertical alignment of text.
        */
        valign:'middle'
      },


      /*
         Styling for the header row.
      */
      headStyles:{
        fillColor:false,
        textColor:0,
        fontSize:5,
        cellPadding:1
      },


      /*
         Individual column widths.

         These are VERY useful if you want to change the
         appearance of the first-page table.
      */
      columnStyles:{

        /*
           Column 1 = row number.
           Width = 8mm.
        */
        0:{
          cellWidth:8,
          halign:'center'
        },


        /*
           Column 2 = Unit.
           Width = 14mm.
        */
        1:{
          cellWidth:14,
          halign:'center'
        },


        /*
           Column 3 = Location.
           Width = 60mm.
        */
        2:{
          cellWidth:60
        },


        /*
           Column 4 = Date.
           Width = 18mm.
        */
        3:{
          cellWidth:18,
          halign:'center'
        },


        /*
           Column 5 = Work.

           Its width is whatever remains after the other
           columns have been allocated.
        */
        4:{
          cellWidth:
            usableWidth-(8+14+60+18)
        }
      }
    });


    /*
       Move y below the table.

       finalY tells us where jsPDF finished drawing the table.
    */
    y=
      pdf.lastAutoTable.finalY+sh;
  }


  /* =======================================================
     FIRST PAGE — NOTES
     ======================================================= */

  const notes=
    document.getElementById(
      'additionalNotes'
    ).value||'';


  /*
     Only print Notes if the user actually entered something.
  */
  if(notes.trim()){

    y+=5;


    /*
       Notes heading.
    */
    pdf.setFont(
      undefined,
      'bold'
    );

    pdf.setFontSize(7);

    pdf.text(
      'Notes:',
      left,
      y
    );

    y+=lh;


    /*
       Actual notes text.
    */
    pdf.setFont(
      undefined,
      'normal'
    );

    pdf.setFontSize(7);


    /*
       splitTextToSize allows the notes to wrap.
    */
    pdf.text(
      pdf.splitTextToSize(
        notes,
        usableWidth
      ),
      left,
      y
    );


    y+=
      pdf.splitTextToSize(
        notes,
        usableWidth
      ).length*lh+sh;
  }


  /* =======================================================
     CERTIFICATE — NEW PAGE
     =======================================================
     
     THIS IS THE MAIN SECTION YOU WILL PROBABLY EDIT.

     Everything after this point is the certificate.

     The certificate is placed on a completely new A4 page.
     ======================================================= */

  pdf.addPage();


  /*
     TOP MARGIN FOR CERTIFICATE CONTENT

     This controls the starting vertical position of the
     certificate's main content.

     40mm means 40mm down from the TOP of the page.

     Increase:
         40 -> 50
         = move the certificate content DOWN.

     Decrease:
         40 -> 30
         = move the certificate content UP.
  */
  const topMargin=40;


  /*
     certY is the certificate's current vertical position.

     This is one of the MOST IMPORTANT variables in the
     certificate section.

     Generally:

         increase certY = move content DOWN
         decrease certY = move content UP
  */
  let certY=topMargin;


  /* =======================================================
     CERTIFICATE DATA
     ======================================================= */

  /*
     Get the service date from the Job Date field.
  */
  const certJobDate=
    document.getElementById('jobDate').value;


  let certServiceDateStr='';
  let certNextServiceDateStr='';


  /*
     If a job date exists, calculate:
     - Date of Service
     - Next Service Date
  */
  if(certJobDate){

    const dateObj=
      new Date(certJobDate);


    const options={
      day:'numeric',
      month:'short',
      year:'numeric'
    };


    /*
       Convert the date into something like:
       13 Aug 2026
    */
    certServiceDateStr=
      dateObj.toLocaleDateString(
        'en-GB',
        options
      );


    /*
       Create another date and add one year.
    */
    const nextYear=
      new Date(dateObj);

    nextYear.setFullYear(
      nextYear.getFullYear()+1
    );


    certNextServiceDateStr=
      nextYear.toLocaleDateString(
        'en-GB',
        options
      );
  }


  /* =======================================================
     CERTIFICATE EQUIPMENT COUNTS
     ======================================================= */

  /*
     Get all rows from the unit table.
  */
  const certRows=[
    ...document.querySelector(
      '#unitTable tbody'
    ).rows
  ];


  let extinguishers=0;
  let fb=0;


  /*
     Count Fire Blankets and Fire Extinguishers.
  */
  certRows.forEach(r=>{

    const unit=
      r.cells[1]
        .querySelector('select')
        .value
        .trim()
        .toUpperCase();


    if(unit==='FB'){
      fb++;
    }

    else if(unit){
      extinguishers++;
    }
  });


  /*
     This creates the quantity sentence that appears
     on the certificate.
  */
  const quantitiesStr=
    `Fire Extinguishers: ${extinguishers} / Fire Blankets: ${fb}`;


  /*
     Get certificate address.
  */
  const certAddressStr=
    document.getElementById(
      'address'
    ).value||'';


  /*
     Get certificate number.
  */
  const certNo=
    document.getElementById(
      'jobNumber'
    ).value||'';


  /*
     Get technician name.
  */
  const technician=
    document.getElementById(
      'certTechnician'
    ).value||'';


  /* =======================================================
     CERTIFICATE LOGOS
     =======================================================
     
     The logos are taken from HTML elements with IDs:
     
        logo1
        logo2

     Their sizes are calculated automatically using their
     original image proportions.
     ======================================================= */

  const logo1Img=
    document.getElementById('logo1');

  const logo2Img=
    document.getElementById('logo2');


  /*
     LOGO 1 HEIGHT

     This controls the height of Logo 1.

     Increase 35 -> 45
     = larger Logo 1.

     Decrease 35 -> 25
     = smaller Logo 1.
  */
  const logo1HeightMM=35;


  /*
     Automatically calculate Logo 1's width based on the
     original image's aspect ratio.

     This prevents the logo from being stretched or squashed.
  */
  const logo1WidthMM=
    logo1HeightMM*
    (
      logo1Img.naturalWidth/
      logo1Img.naturalHeight
    );


  /*
     LOGO 2 HEIGHT

     Increase 18 -> 25
     = larger Logo 2.

     Decrease 18 -> 12
     = smaller Logo 2.
  */
  const logo2HeightMM=18;


  /*
     Automatically calculate Logo 2 width using its original
     aspect ratio.
  */
  const logo2WidthMM=
    logo2HeightMM*
    (
      logo2Img.naturalWidth/
      logo2Img.naturalHeight
    );


  /* =======================================================
     COMPANY ADDRESS / HEADER TEXT
     ======================================================= */

  /*
     IMPORTANT:

     Your original pasted code contained invalid curly quotes.

     Use normal JavaScript quotes here.

     Put your company name on the FIRST line.

     Put each additional address line on its own line.

     Example:

     const compLines="MY COMPANY
     123 Example Street
     London
     AB1 2CD";

     The split('\n') below turns those lines into an array.
  */
  const compLines="ANDERSON FIRE LTD\nUnit 7\nMontrose Business Centre\nBroomfield Industrial Estate\nMontrose, Angus\nDD10 8SY".split('\n');


  /*
     Starting Y position for the company information.

     Increase 25 = move company header DOWN.
     Decrease 25 = move company header UP.
  */
  let companyY=25;


  /* =======================================================
     COMPANY NAME
     ======================================================= */

  pdf.setFont(
    undefined,
    'bold'
  );


  /*
     COMPANY NAME FONT SIZE

     Increase 26 -> 30 = larger.
     Decrease 26 -> 22 = smaller.
  */
  pdf.setFontSize(26);


  /*
     COMPANY NAME POSITION

     X:
        pageWidth/2
        = centre of page

     Y:
        companyY
        = vertical position

     align:'center'
        = centre the text around its X position.
  */
  pdf.text(
    compLines[0],
    pageWidth/2,
    companyY,
    {align:'center'}
  );


  /*
     Move down 9mm before printing the next line.

     Increase 9 = more space between company name and address.
     Decrease 9 = less space.
  */
  companyY+=9;


  /* =======================================================
     COMPANY ADDRESS
     ======================================================= */

  pdf.setFont(
    undefined,
    'normal'
  );


  /*
     COMPANY ADDRESS FONT SIZE

     Increase 14 = larger.
     Decrease 14 = smaller.
  */
  pdf.setFontSize(14);


  /*
     Print every company-address line after the company name.
  */
  compLines.slice(1).forEach(line=>{

    pdf.text(
      line,
      pageWidth/2,
      companyY,
      {align:'center'}
    );


    /*
       6mm vertical gap between address lines.

       Increase 6 = lines farther apart.
       Decrease 6 = lines closer together.
    */
    companyY+=6;
  });


   /* =======================================================
     CERTIFICATE LOGOS — POSITIONING
     =======================================================
     
     This is another VERY important area for you.

     The logos are positioned using X and Y coordinates.

     Remember:

        X increases -> moves RIGHT
        X decreases -> moves LEFT

        Y increases -> moves DOWN
        Y decreases -> moves UP
     ======================================================= */

  /*
     Base vertical position for the logos.

     Increase 34 = move the logo area DOWN.
     Decrease 34 = move the logo area UP.
  */
  const logoY=34;


  /* =======================================================
     PDF LOGO COMPRESSION
     ======================================================= */

  /*
     Creates a smaller PNG version of a logo before it is
     embedded into the PDF.

     PNG is kept so that transparent backgrounds are preserved.

     This reduces the amount of image data stored inside
     the PDF without changing the visible logo size.
  */
  function compressLogoPNG(
    img,
    targetWidth=600
  ){

    /*
       Calculate how much the original image should be
       reduced by.
    */
    const scale=
      targetWidth/img.naturalWidth;


    /*
       Never enlarge the original image.

       If the original is already smaller than 600px wide,
       it will be left at its original size.
    */
    const finalScale=
      Math.min(scale,1);


    /*
       Create an invisible canvas used to create the
       smaller version of the logo.
    */
    const canvas=
      document.createElement('canvas');


    /*
       Set the canvas dimensions.
    */
    canvas.width=
      Math.round(
        img.naturalWidth*finalScale
      );

    canvas.height=
      Math.round(
        img.naturalHeight*finalScale
      );


    /*
       Get the canvas drawing context.
    */
    const ctx=
      canvas.getContext('2d');


    /*
       Draw the original logo onto the smaller canvas.
    */
    ctx.drawImage(
      img,
      0,
      0,
      canvas.width,
      canvas.height
    );


    /*
       Convert the smaller canvas back into a PNG.

       PNG is used rather than JPEG so that any transparent
       background on the logos remains transparent.
    */
    return canvas.toDataURL(
      'image/png'
    );
  }


  /*
     Create compressed versions of both logos.

     600 = maximum width in pixels of the embedded logo.

     The logos will still appear at exactly the same physical
     size in the PDF because logo1WidthMM/logo1HeightMM and
     logo2WidthMM/logo2HeightMM are unchanged.
  */
  const logo1Compressed=
    compressLogoPNG(
      logo1Img,
      600
    );

  const logo2Compressed=
    compressLogoPNG(
      logo2Img,
      600
    );


  /* =======================================================
     LOGO 2 — LEFT LOGO
     ======================================================= */

  /*
     LOGO 2 X POSITION

     18mm from the left edge.

     Increase 18 -> move Logo 2 RIGHT.
     Decrease 18 -> move Logo 2 LEFT.
  */
  const logo2X=18;


  /*
     LOGO 2 Y POSITION

     logoY + 8 means the logo is 8mm lower than logoY.

     Increase +8 -> move Logo 2 DOWN.
     Decrease +8 -> move Logo 2 UP.
  */
  const logo2Y=logoY+8;


  /*
     Add the COMPRESSED Logo 2 to the PDF.

     The position and displayed size are exactly the same
     as before.
  */
  pdf.addImage(
    logo2Compressed,
    'PNG',
    logo2X,
    logo2Y,
    logo2WidthMM,
    logo2HeightMM
  );


  /* =======================================================
     LOGO 1 — RIGHT LOGO
     ======================================================= */

  /*
     Logo 1 is positioned from the RIGHT side.

     "pageWidth - logo1WidthMM - 18"

     means:

       Start at right edge
       Move left by logo width
       Then move another 18mm left

     Therefore:

       Increase 18 -> move Logo 1 LEFT.
       Decrease 18 -> move Logo 1 RIGHT.
  */
  const logo1X=
    pageWidth-logo1WidthMM-18;


  /*
     Vertical position of Logo 1.

     Increase logoY -> move DOWN.
     Decrease logoY -> move UP.
  */
  const logo1Y=logoY;


  /*
     Add the COMPRESSED Logo 1 to the PDF.

     The position and displayed size are exactly the same
     as before.
  */
  pdf.addImage(
    logo1Compressed,
    'PNG',
    logo1X,
    logo1Y,
    logo1WidthMM,
    logo1HeightMM
  );

  /* =======================================================
     CERTIFICATE TITLE
     ======================================================= */

  /*
     This determines where the main certificate title starts.

     companyY is currently below the company address.

     +20 adds 20mm of space between the company address and
     the certificate title.

     Increase 20 -> title moves DOWN.
     Decrease 20 -> title moves UP.
  */
  certY=companyY+20;


  /*
     TITLE FONT STYLE
  */
  pdf.setFont(
    undefined,
    'bold'
  );


  /*
     TITLE FONT SIZE

     Increase 18 -> larger title.
     Decrease 18 -> smaller title.
  */
  pdf.setFontSize(22);


  /*
     TITLE TEXT AND POSITION

     X = centre of page.
     Y = certY.
  */
  pdf.text(
    'CERTIFICATE OF MAINTENANCE',
    pageWidth/2,
    certY,
    {align:'center'}
  );


  /*
     Space below the title.

     Increase 8 -> more space before subtitle.
     Decrease 8 -> less space.
  */
  certY+=8;


  /* =======================================================
     CERTIFICATE SUBTITLE
     ======================================================= */

  pdf.setFont(
    undefined,
    'normal'
  );


  /*
     Subtitle font size.
  */
  pdf.setFontSize(13);


  /*
     Subtitle position.

     X = page centre.
     Y = certY.
  */
  pdf.text(
    'Fire Equipment',
    pageWidth/2,
    certY,
    {align:'center'}
  );


  /*
     Space below subtitle.

     Increase 18 -> move everything below further DOWN.
     Decrease 18 -> move everything below UP.
  */
  certY+=18;


  /*
     Centre X position used by the certificate text below.
  */
  const centerX=pageWidth/2;


   /* =======================================================
     CERTIFICATE TEXT HELPER FUNCTION
     ======================================================= */

  function addLine(
    text,
    fontSize=11,
    bold=false,
    spacing=8,
    italic=false,
    align='center',
    xPosition=centerX
  ){

    /*
       Choose bold, italic, or normal font.
    */
    let fontStyle='normal';

    if(bold && italic){
      fontStyle='bolditalic';
    }
    else if(bold){
      fontStyle='bold';
    }
    else if(italic){
      fontStyle='italic';
    }


    /*
       Set the font style.
    */
    pdf.setFont(
      undefined,
      fontStyle
    );


    /*
       Set the font size.
    */
    pdf.setFontSize(fontSize);


    /*
       Make sure long text wraps instead of going outside
       the page.
    */
    const lines=
      pdf.splitTextToSize(
        text,
        pageWidth-20
      );


    /*
       Print every line.
    */
    lines.forEach(line=>{

      pdf.text(
        line,
        xPosition,
        certY,
        {align:align}
      );


      /*
         Move down after each line.
      */
      certY+=spacing;
    });
  }


    /* =======================================================
     CERTIFICATE INFORMATION TABLE
     ======================================================= */

  /*
     Create a compact two-column table.

     Left column  = information label
     Right column = information value

     The table is positioned centrally on the page.
  */

  const certInfoX=centerX-32;

  const certLabelWidth=38;

  const certValueWidth=32;

  const certRowHeight=6;


  /*
     Table rows.
  */

  const certInfoRows=[

    [
      'Cert No:',
      certNo
    ],

    [
      'Date of Service:',
      certServiceDateStr
    ],

    [
      'Next Service Date:',
      certNextServiceDateStr
    ],

    [
      'Fire Extinguishers:',
      `${extinguishers}`
    ],

    [
      'Fire Blankets:',
      `${fb}`
    ]

  ];


  /*
     Font settings for the table.
  */

  pdf.setFont(
    undefined,
    'normal'
  );

  pdf.setFontSize(10);


  /*
     Draw each row.
  */

  certInfoRows.forEach((row,index)=>{

    const rowY=
      certY+(index*certRowHeight);


    /*
       Draw left cell.
    */

    pdf.rect(
      certInfoX,
      rowY-certRowHeight+1,
      certLabelWidth,
      certRowHeight
    );


    /*
       Draw right cell.
    */

    pdf.rect(
      certInfoX+certLabelWidth,
      rowY-certRowHeight+1,
      certValueWidth,
      certRowHeight
    );


    /*
       Left cell text.
    */

    pdf.text(
      row[0],
      certInfoX+2,
      rowY-1
    );


    /*
       Right cell text.
    */

    pdf.text(
      row[1],
      certInfoX+certLabelWidth+2,
      rowY-1
    );

  });


  /*
     Move certY below the table.

     Increase 8 -> more space below the table.
     Decrease 8 -> less space below the table.
  */

  certY=
    certY+
    (certInfoRows.length*certRowHeight)+8;

  /* =======================================================
     ADDRESS HEADING
     ======================================================= */

  /*
     Here we explicitly use:
       font size = 9
       bold = true
       spacing = 6
  */
  addLine(
    'Address:',
    14,
    true,
    6
  );


  /* =======================================================
     CERTIFICATE ADDRESS
     ======================================================= */

  /*
     Break the address into separate lines.

     The address is:
     - Italic
     - Not bold
     - Left aligned
     - Positioned centrally underneath the Address heading

     Extra spacing has been added:
     - Between the Address heading and the first address line
     - Between each address line
  */

  certY+=3;

  certAddressStr.split('\n').forEach(line=>{

    addLine(
      line,
      15,
      false,
      7,
      true,
      'left',
      centerX-25
    );
  });


  /*
     Extra blank line after the address.
  */

  addLine('');

  /* =======================================================
     TECHNICIAN
     ======================================================= */

  addLine(
    `Technician: ${technician}`
  );


  /*
     Another blank line.
  */
  addLine('');


  /* =======================================================
     DUTY OF CARE / DISCLAIMER
     ======================================================= */

  /*
     Put your disclaimer text between the quotation marks.

     Example:

       const dutyOfCare="This certificate confirms...";

     IMPORTANT:
     The disclaimer is positioned separately from the other
     certificate text below.
  */
  const dutyOfCare="Anderson Fire have serviced the portable fire extinguishers and other fire protection equipment within the premises identified above in accordance with the requirements and frequencies indicated by BS5306 part 3 and any future amendments. Where dry powder extinguishers are installed the customer accepts responsibility for any secondary damage caused to people and processes. According to BS5306 part 3, it is the duty of the responsible person in the premise to inspect extinguishers at monthly intervals. DUTY OF CARE WASTE TRANSFER NOTE: By signing, the customer hereby authorizes Anderson Fire to dispose of extinguishers to be removed from the customers site.";


  /*
     Move certY to 50mm ABOVE the bottom of the page.

     A4 height is approximately 297mm.

     297 - 50 = approximately 247mm.

     So this places the disclaimer around Y = 247mm.

     Increase 50 -> disclaimer moves UP.
     Decrease 50 -> disclaimer moves DOWN.

     This is slightly different from most of the certificate
     because you're calculating its position from the BOTTOM.
  */
  certY=
    pdf.internal.pageSize.getHeight()-50;


  /*
     Print the disclaimer.

     7 = font size
     false = normal font
     5 = line spacing
  */
  addLine(
    dutyOfCare,
    7,
    false,
    5
  );


  /* =======================================================
     SAVE THE PDF
     ======================================================= */

  /*
     Creates the PDF filename.

     Date.now() adds a unique number based on the current time
     so each exported PDF gets a different filename.
  */
  pdf.save(
    `JobSheet_${Date.now()}.pdf`
  );
}


/* =========================================================
   LOCATION AUTO-CAPITALIZE & NAME MEMORY
   =========================================================
   This section:
   - Remembers locations during the current session
   - Suggests previously used locations
   - Automatically capitalizes words
   ========================================================= */

let sessionLocations=[];


/*
   Creates/updates the HTML <datalist> containing remembered
   location names.
*/
function updateLocationDatalist(){

  let dataList=
    document.getElementById('locationList');


  /*
     If the datalist doesn't exist yet, create it.
  */
  if(!dataList){

    dataList=
      document.createElement('datalist');

    dataList.id='locationList';

    document.body.appendChild(dataList);
  }


  /*
     Clear the existing suggestions.
  */
  dataList.innerHTML='';


  /*
     Add each remembered location as an option.
  */
  sessionLocations.forEach(name=>{

    const option=
      document.createElement('option');

    option.value=name;

    dataList.appendChild(option);
  });
}


/*
   Capitalizes the first letter of every word.

   Example:

       "london fire station"

   becomes:

       "London Fire Station"
*/
function capitalizeWords(str){

  return str
    .split(' ')
    .map(
      word=>
        word.charAt(0).toUpperCase()+
        word.slice(1)
    )
    .join(' ');
}


/*
   Set up all Location inputs.
*/
function setupLocationInputs(){

  const inputs=
    document.querySelectorAll(
      '.location-input'
    );


  inputs.forEach(input=>{

    /*
       Connect the input to the location datalist.
    */
    input.setAttribute(
      'list',
      'locationList'
    );


    /*
       Automatically capitalize as the user types.
    */
    input.addEventListener(
      'input',
      e=>{

        const cursorPos=
          e.target.selectionStart;

        e.target.value=
          capitalizeWords(
            e.target.value
          );

        /*
           Put the cursor back where it was.
        */
        e.target.setSelectionRange(
          cursorPos,
          cursorPos
        );
      }
    );


    /*
       When the user finishes entering a location,
       remember it for this session.
    */
    input.addEventListener(
      'change',
      e=>{

        const val=
          e.target.value.trim();


        if(
          val &&
          !sessionLocations.includes(val)
        ){

          sessionLocations.push(val);

          updateLocationDatalist();
        }
      }
    );
  });
}


/*
   Set up the location system when the app starts.
*/
updateLocationDatalist();
setupLocationInputs();


/*
   Keep a reference to the original Add Row function.
*/
const originalAddRow=
  document.getElementById(
    'addRowBtn'
  ).onclick;


/*
   Replace the Add Row function with a slightly expanded version.

   First:
      Create the row normally.

   Then:
      Set up the location autocomplete/capitalization
      for the newly created row.
*/
document.getElementById('addRowBtn').onclick=()=>{

  originalAddRow();

  setupLocationInputs();
};


/* =========================================================
   SERVICE WORKER REGISTRATION
   =========================================================
   A service worker is normally used for things like:
   - Offline functionality
   - PWA functionality
   - Caching
   - Updating the app without a traditional server

   This section is NOT related to the PDF certificate layout.
   ========================================================= */

if('serviceWorker' in navigator){

  /*
     Listen for a message from the service worker saying
     that a new version of the app is available.
  */
  navigator.serviceWorker.addEventListener(
    'message',
    event=>{

      if(
        event.data &&
        event.data.type === 'SW_UPDATED'
      ){

        /*
           Reload the page to use the updated version.
        */
        window.location.reload();
      }
    }
  );


  /*
     Once the page has completely loaded, register the
     service worker file.
  */
  window.addEventListener(
    'load',
    ()=>{

      navigator.serviceWorker.register(
        './service-worker.js'
      )

      .then(
        ()=>console.log('SW registered')
      )

      .catch(
        err=>console.log(
          'SW error:',
          err
        )
      );
    }
  );
}