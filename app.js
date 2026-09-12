/* =========================================================
   NAVIGATION
   ========================================================= */

const landing = document.getElementById('landing');
const jobSheet = document.getElementById('jobSheet');
const savedSheetsPage = document.getElementById('savedSheets');
const savedSheetsSearch = document.getElementById('savedSheetsSearch');


/* CREATE SHEET */

document.getElementById('createSheetBtn').onclick = () => {
  landing.style.display = 'none';
  jobSheet.style.display = 'flex';
};


/* SAVED SHEETS */

document.getElementById('savedSheetsBtn').onclick = () => {

  landing.style.display = 'none';

  savedSheetsPage.style.display = 'flex';

  /*
     Start with a clear search every time the
     Saved Job Sheets page is opened.
  */

  savedSheetsSearch.value = '';

  renderSavedSheets();
};


/* BACK TO LANDING FROM JOB SHEET */

document.getElementById('backToLanding1').onclick = () => {
  jobSheet.style.display = 'none';
  landing.style.display = 'flex';
};


/* BACK TO LANDING FROM SAVED SHEETS */

document.getElementById('backToLanding2').onclick = () => {
  savedSheetsPage.style.display = 'none';
  landing.style.display = 'flex';
};


/* =========================================================
   AUTO-RESIZE TEXTAREAS
   ========================================================= */

const addressTA = document.getElementById('address');
const notesTA = document.getElementById('additionalNotes');


function autoResize(el) {
  el.style.height = 'auto';
  el.style.height = el.scrollHeight + 'px';
}


[addressTA, notesTA].forEach(t =>
  t.addEventListener('input', () => autoResize(t))
);


/* =========================================================
   SAVE TOAST / SAVE NOTIFICATION
   ========================================================= */

const saveNotification =
  document.getElementById('saveNotification');


function showSaveNotification() {

  saveNotification.classList.add('show');

  setTimeout(
    () => saveNotification.classList.remove('show'),
    1000
  );
}


/* =========================================================
   TABLE & SUMMARIES
   ========================================================= */

const unitTableBody =
  document.querySelector('#unitTable tbody');


const workOptions = [
  "Serviced",
  "Due Test Awaiting Approval",
  "Due Test Replaced",
  "Due Test Replaced with 9W",
  "Due Test Replaced with 6W",
  "Due Test Replaced with 6F",
  "Due Test Replaced with 5C",
  "Due Test Replaced with 2C",
  "Due Test Customer Request Not to Change",
  "Corroded / Damaged Replaced",
  "Corroded / Damaged",
  "Missing",
  "Missing Replaced",
  "Bracket",
  "Wooden Board",
  "Due Test Replaced with 4P",
  "Due Test Replaced with 6P",
  "Due Test Replaced with 2P",
  "Due Test Replaced with 1P",
  "Due Test Replaced with 9P",
  "Due Test Replaced with 3WCH",
  "Due Test Replaced with 6WCH",
  "FB Expired Replaced",
  "FB Expired",
  "NEW 6W",
  "NEW 9W",
  "NEW 6F",
  "NEW 2C",
  "NEW 5C",
  "NEW 6P",
  "NEW 4P",
  "NEW FB",
  "NEW 1P",
  "NEW 2P",
  "NEW 6WCH",
  "NEW 3WCH",
  "NEW 9P"
];


const unitList = [
  "2C",
  "6W",
  "9W",
  "6F",
  "FB",
  "5C",
  "1P",
  "2P",
  "3P",
  "4P",
  "6P",
  "9P",
  "3F",
  "2F",
  "1F",
  "9F",
  "3W",
  "3WC",
  "6WC"
];


let previousDates = [];


/* =========================================================
   UPDATE ROW NUMBERS
   ========================================================= */

function updateRowNumbers() {

  [...unitTableBody.rows].forEach((r, i) => {

    const cell = r.cells[0];

    cell.textContent = '';

    const span = document.createElement('span');

    span.className = 'row-number';

    span.textContent = i + 1;

    cell.appendChild(span);
  });
}


/* =========================================================
   ADD ROW
   ========================================================= */

document.getElementById('addRowBtn').onclick = () => {

  const r = document.createElement('tr');


  /* ROW NUMBER */

  const cellNumber = document.createElement('td');

  r.appendChild(cellNumber);


  /* UNIT */

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


  /* LOCATION */

  const cellLocation = document.createElement('td');

  const locInput = document.createElement('input');

  locInput.className = 'location-input';

  locInput.placeholder = 'Location';

  cellLocation.appendChild(locInput);

  r.appendChild(cellLocation);


  /* DATE */

  const cellDate = document.createElement('td');

  const dateInput = document.createElement('input');

  dateInput.type = 'text';

  dateInput.className = 'date-input';

  cellDate.appendChild(dateInput);

  r.appendChild(cellDate);


  /* WORK DONE */

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


  /* DELETE BUTTON */

  const cellAction = document.createElement('td');

  const delBtn = document.createElement('button');

  delBtn.className = 'row-btn';

  delBtn.textContent = '❌';


  delBtn.onclick = () => {

    r.remove();

    updateRowNumbers();

    updateSummaries();
  };


  cellAction.appendChild(delBtn);

  r.appendChild(cellAction);


  /* ADD ROW TO TABLE */

  unitTableBody.appendChild(r);


  /* UPDATE SUMMARIES WHEN ROW CHANGES */

  r.querySelectorAll('input,select').forEach(
    i => i.oninput = updateSummaries
  );


  updateRowNumbers();

  setupDateAutocomplete();
};


/* =========================================================
   DATE AUTOCOMPLETE
   ========================================================= */

function setupDateAutocomplete() {

  const dateInputs =
    document.querySelectorAll('.date-input');


  dateInputs.forEach(input => {

    input.addEventListener('input', () => {

      const val =
        input.value.toLowerCase();


      const suggestion =
        previousDates.find(
          d => d.toLowerCase().startsWith(val)
        );


      if (suggestion) {
        input.value = suggestion;
      }
    });
  });
}


/* =========================================================
   SUMMARIES
   ========================================================= */

function updateSummaries() {

  const rows = [...unitTableBody.rows];

  let tamperSeal = 0;

  let oRing = 0;

  let gaugeDot = 0;

  const dueTestCount = {};

  const dueTestLocs = [];


  rows.forEach(r => {

    const unit =
      r.cells[1].querySelector('select').value;

    const loc =
      r.cells[2].querySelector('input').value;

    const work =
      r.cells[4].querySelector('select').value;


    if (!unit) return;


    const tamperUnits = [
      "2C",
      "6W",
      "9W",
      "6F",
      "5C",
      "1P",
      "2P",
      "3P",
      "4P",
      "6P",
      "9P",
      "3F",
      "2F",
      "1F",
      "9F",
      "3W",
      "3WC",
      "6WC"
    ];


    const oRingUnits = [
      "2C"
    ];


    const gaugeDotUnits = [
      "1P",
      "2P",
      "3P",
      "4P",
      "6P",
      "9P",
      "2F",
      "3F",
      "1F",
      "6F",
      "9F",
      "3W",
      "6W",
      "9W",
      "3WC",
      "6WC"
    ];


    if (
      tamperUnits.includes(unit) &&
      unit !== "FB"
    ) {
      tamperSeal++;
    }


    if (oRingUnits.includes(unit)) {
      oRing++;
    }


    if (
      gaugeDotUnits.includes(unit) &&
      !["2C", "5C", "FB"].includes(unit)
    ) {
      gaugeDot++;
    }


    if (
      work.toLowerCase().includes("due test")
    ) {

      dueTestCount[unit] =
        (dueTestCount[unit] || 0) + 1;

      dueTestLocs.push(
        `${unit} - ${loc}`
      );
    }
  });


  document.getElementById(
    'inventorySummary'
  ).innerText =
    `Inventory Summary\n` +
    `Tamper Seals: ${tamperSeal}\n` +
    `O-Rings: ${oRing}\n` +
    `Gauge Dots: ${gaugeDot}`;


  document.getElementById(
    'dueTestSummary'
  ).innerText =
    `DT Total:\n${
      Object.entries(dueTestCount)
        .map(([u, c]) => `${u}: ${c}`)
        .join('\n') || 'None'
    }`;


  document.getElementById(
    'dueTestLocations'
  ).innerText =
    `Due Test Locations\n${
      dueTestLocs.join('\n') || 'None'
    }`;
}


/* =========================================================
   SAVE JOB SHEET
   ========================================================= */

document.getElementById('saveSheetBtn').onclick = () => {

  const savedSheets =
    JSON.parse(
      localStorage.getItem('savedSheets') || '[]'
    );


  const sheetData = {

    address:
      addressTA.value,

    jobNumber:
      document.getElementById('jobNumber').value,

    amcPO:
      document.getElementById('amcPO').value,

    notes:
      notesTA.value,

    jobDate:
      document.getElementById('jobDate').value,

    technician:
      document.getElementById('certTechnician').value,


    /*
       NEW:

       Save the customer's signature with the job sheet.

       This means the signature will still be available
       when the saved job sheet is loaded again.
    */

    signature:
      capturedSignature || null,


    units:
      [...unitTableBody.rows].map(r => ({

        unit:
          r.cells[1]
            .querySelector('select')
            .value,

        location:
          r.cells[2]
            .querySelector('input')
            .value,

        date:
          r.cells[3]
            .querySelector('input')
            .value,

        work:
          r.cells[4]
            .querySelector('select')
            .value
      }))
  };


  savedSheets.push(sheetData);


  localStorage.setItem(
    'savedSheets',
    JSON.stringify(savedSheets)
  );


  showSaveNotification();
};


/* =========================================================
   RENDER SAVED SHEETS
   ========================================================= */

function renderSavedSheets(searchTerm = '') {

  const savedList =
    document.getElementById('savedList');


  savedList.innerHTML = '';


  const savedSheets =
    JSON.parse(
      localStorage.getItem('savedSheets') || '[]'
    );


  const search =
    searchTerm.trim().toLowerCase();


  let visibleCount = 0;


  savedSheets.forEach((s, i) => {

    /*
       Search across:
       - Job number
       - Address / company name
       - AMC PO
       - Notes
    */

    const searchableText = [

      s.jobNumber || '',
      s.address || '',
      s.amcPO || '',
      s.notes || ''

    ]
      .join(' ')
      .toLowerCase();


    /*
       If a search term exists and isn't found,
       don't display this saved sheet.
    */

    if (
      search &&
      !searchableText.includes(search)
    ) {
      return;
    }


    visibleCount++;


    const div =
      document.createElement('div');

    div.className = 'saved-item';


    const infoSpan =
      document.createElement('span');


    const jobNo =
      s.jobNumber || 'No Job Number';

    const address =
      s.address || 'No Address';


    infoSpan.textContent =
      `${jobNo} - ${address}`;


    const btnContainer =
      document.createElement('div');


    const loadBtn =
      document.createElement('button');

    loadBtn.textContent = 'Load';

    loadBtn.onclick =
      () => loadSavedSheet(i);


    const deleteBtn =
      document.createElement('button');

    deleteBtn.textContent = 'Delete';

    deleteBtn.onclick =
      () => deleteSavedSheet(i);


    btnContainer.appendChild(loadBtn);

    btnContainer.appendChild(deleteBtn);

    div.appendChild(infoSpan);

    div.appendChild(btnContainer);

    savedList.appendChild(div);
  });


  /*
     Show a simple message if the search produced
     no matches.
  */

  if (
    search &&
    visibleCount === 0
  ) {

    const noResults =
      document.createElement('div');

    noResults.className = 'saved-item';

    noResults.textContent =
      'No saved job sheets found.';

    savedList.appendChild(noResults);
  }
}


/* =========================================================
   SAVED SHEETS SEARCH
   ========================================================= */

/*
   Small delay before searching.

   This prevents the list from being rebuilt
   repeatedly while the user is typing quickly.
*/

let savedSearchTimer = null;


savedSheetsSearch.addEventListener(
  'input',
  () => {

    clearTimeout(savedSearchTimer);


    savedSearchTimer = setTimeout(
      () => {

        renderSavedSheets(
          savedSheetsSearch.value
        );

      },
      120
    );
  }
);


/* =========================================================
   DELETE SAVED SHEET
   ========================================================= */

function deleteSavedSheet(idx) {

  const savedSheets =
    JSON.parse(
      localStorage.getItem('savedSheets') || '[]'
    );


  savedSheets.splice(idx, 1);


  localStorage.setItem(
    'savedSheets',
    JSON.stringify(savedSheets)
  );


  /*
     Keep the current search active after deletion.
  */

  renderSavedSheets(
    savedSheetsSearch.value
  );
}


/* =========================================================
   LOAD SAVED SHEET
   ========================================================= */

function loadSavedSheet(idx) {

  const savedSheets =
    JSON.parse(
      localStorage.getItem('savedSheets') || '[]'
    );


  const s = savedSheets[idx];


  if (!s) return;


  savedSheetsPage.style.display = 'none';

  jobSheet.style.display = 'flex';


  addressTA.value =
    s.address || '';


  document.getElementById(
    'jobNumber'
  ).value =
    s.jobNumber || '';


  document.getElementById(
    'amcPO'
  ).value =
    s.amcPO || '';


  notesTA.value =
    s.notes || '';


  document.getElementById(
    'jobDate'
  ).value =
    s.jobDate || '';


  document.getElementById(
    'certTechnician'
  ).value =
    s.technician || '';


  /*
     NEW:

     Restore the saved customer signature.

     Older saved sheets won't have a signature property,
     so they will simply load with no signature.
  */

  capturedSignature =
    s.signature || null;


  unitTableBody.innerHTML = '';


  /*
     Protect against older saved records which may not
     contain a units array.
  */

  const savedUnits =
    Array.isArray(s.units)
      ? s.units
      : [];


  savedUnits.forEach(u => {

    const r =
      document.createElement('tr');


    /* ROW NUMBER */

    const cellNumber =
      document.createElement('td');

    r.appendChild(cellNumber);


    /* UNIT */

    const cellUnit =
      document.createElement('td');

    const unitSelect =
      document.createElement('select');

    unitSelect.className =
      'unit-input';


    const defaultOpt =
      document.createElement('option');

    defaultOpt.value = '';

    defaultOpt.textContent = '--';

    unitSelect.appendChild(defaultOpt);


    unitList.forEach(ul => {

      const opt =
        document.createElement('option');

      opt.value = ul;

      opt.textContent = ul;


      if (ul === u.unit) {
        opt.selected = true;
      }


      unitSelect.appendChild(opt);
    });


    cellUnit.appendChild(unitSelect);

    r.appendChild(cellUnit);


    /* LOCATION */

    const cellLocation =
      document.createElement('td');

    const locInput =
      document.createElement('input');

    locInput.className =
      'location-input';

    locInput.value =
      u.location || '';


    cellLocation.appendChild(locInput);

    r.appendChild(cellLocation);


    /* DATE */

    const cellDate =
      document.createElement('td');

    const dateInput =
      document.createElement('input');

    dateInput.type = 'text';

    dateInput.className =
      'date-input';

    dateInput.value =
      u.date || '';


    cellDate.appendChild(dateInput);

    r.appendChild(cellDate);


    /* WORK */

    const cellWork =
      document.createElement('td');

    const workSelect =
      document.createElement('select');

    workSelect.className =
      'workdone-input';


    workOptions.forEach(w => {

      const opt =
        document.createElement('option');

      opt.value = w;

      opt.textContent = w;


      if (w === u.work) {
        opt.selected = true;
      }


      workSelect.appendChild(opt);
    });


    cellWork.appendChild(workSelect);

    r.appendChild(cellWork);


    /* DELETE */

    const cellAction =
      document.createElement('td');

    const delBtn =
      document.createElement('button');

    delBtn.className =
      'row-btn';

    delBtn.textContent = '❌';


    delBtn.onclick = () => {

      r.remove();

      updateRowNumbers();

      updateSummaries();
    };


    cellAction.appendChild(delBtn);

    r.appendChild(cellAction);


    unitTableBody.appendChild(r);
  });


  updateRowNumbers();

  updateSummaries();

  setupDateAutocomplete();

  setupLocationInputs();

  autoResize(addressTA);

  autoResize(notesTA);
}


/* =========================================================
   SIGNATURE MODULE
   ========================================================= */

let capturedSignature = null;


const sigModal =
  document.getElementById('signatureModal');


const sigCanvas =
  document.getElementById('signatureCanvas');


const sigCtx =
  sigCanvas.getContext('2d');


let sigDrawing = false;


/*
   Converts mouse/touch position into a position relative
   to the signature canvas.
*/

function getSigPos(e) {

  const rect =
    sigCanvas.getBoundingClientRect();


  const src =
    e.touches
      ? e.touches[0]
      : e;


  /*
     Account for the possibility that the canvas is displayed
     at a different CSS size than its actual drawing size.
  */

  const scaleX =
    sigCanvas.width / rect.width;

  const scaleY =
    sigCanvas.height / rect.height;


  return {

    x:
      (src.clientX - rect.left) * scaleX,

    y:
      (src.clientY - rect.top) * scaleY
  };
}


/* MOUSE DRAWING */

sigCanvas.addEventListener(
  'mousedown',
  e => {

    sigDrawing = true;

    const p =
      getSigPos(e);


    sigCtx.beginPath();

    sigCtx.moveTo(
      p.x,
      p.y
    );
  }
);


sigCanvas.addEventListener(
  'mousemove',
  e => {

    if (!sigDrawing) return;


    const p =
      getSigPos(e);


    sigCtx.lineTo(
      p.x,
      p.y
    );


    sigCtx.strokeStyle = '#111';

    sigCtx.lineWidth = 2;

    sigCtx.lineCap = 'round';

    sigCtx.lineJoin = 'round';

    sigCtx.stroke();
  }
);


sigCanvas.addEventListener(
  'mouseup',
  () => {
    sigDrawing = false;
  }
);


sigCanvas.addEventListener(
  'mouseleave',
  () => {
    sigDrawing = false;
  }
);


/* TOUCH DRAWING */

sigCanvas.addEventListener(
  'touchstart',
  e => {

    e.preventDefault();

    sigDrawing = true;

    const p =
      getSigPos(e);


    sigCtx.beginPath();

    sigCtx.moveTo(
      p.x,
      p.y
    );
  },
  { passive: false }
);


sigCanvas.addEventListener(
  'touchmove',
  e => {

    e.preventDefault();


    if (!sigDrawing) return;


    const p =
      getSigPos(e);


    sigCtx.lineTo(
      p.x,
      p.y
    );


    sigCtx.strokeStyle = '#111';

    sigCtx.lineWidth = 2;

    sigCtx.lineCap = 'round';

    sigCtx.lineJoin = 'round';

    sigCtx.stroke();
  },
  { passive: false }
);


sigCanvas.addEventListener(
  'touchend',
  () => {
    sigDrawing = false;
  }
);


/* =========================================================
   OPEN SIGNATURE WINDOW
   ========================================================= */

function openSignatureModal() {

  /*
     Clear the canvas before opening it.

     This keeps the drawing area clean when the user
     wants to create or replace a signature.
  */

  sigCtx.clearRect(
    0,
    0,
    sigCanvas.width,
    sigCanvas.height
  );


  sigModal.style.display = 'flex';
}


/* =========================================================
   CLOSE SIGNATURE WINDOW
   ========================================================= */

function closeSignatureModal() {

  sigModal.style.display = 'none';
}


/* =========================================================
   CLEAR SIGNATURE
   ========================================================= */

document.getElementById(
  'sigClearBtn'
).onclick = () => {

  sigCtx.clearRect(
    0,
    0,
    sigCanvas.width,
    sigCanvas.height
  );
};


/* =========================================================
   SEPARATE CUSTOMER SIGNATURE BUTTON
   ========================================================= */

document.getElementById(
  'signatureBtn'
).onclick = () => {

  openSignatureModal();
};


/*
   DONE

   Capture the signature and keep it attached to the
   current job sheet.

   IMPORTANT:

   It no longer starts PDF export.
*/

document.getElementById(
  'sigDoneBtn'
).onclick = () => {

  /*
     Find the actual handwritten part of the canvas
     and remove the empty space around it.
  */

  const imageData =
    sigCtx.getImageData(
      0,
      0,
      sigCanvas.width,
      sigCanvas.height
    );


  const data = imageData.data;


  let minX = sigCanvas.width;
  let minY = sigCanvas.height;
  let maxX = 0;
  let maxY = 0;


  /*
     Look through every pixel on the canvas.

     The canvas background is almost white.
     The handwritten signature is dark.

     We find the smallest rectangle containing
     the dark pixels.
  */

  for (
    let y = 0;
    y < sigCanvas.height;
    y++
  ) {

    for (
      let x = 0;
      x < sigCanvas.width;
      x++
    ) {

      const index =
        (y * sigCanvas.width + x) * 4;


      const red =
        data[index];

      const green =
        data[index + 1];

      const blue =
        data[index + 2];

      const alpha =
        data[index + 3];


      /*
         Treat dark pixels as part of the signature.
      */

      if (
        alpha > 0 &&
        red < 200 &&
        green < 200 &&
        blue < 200
      ) {

        minX = Math.min(
          minX,
          x
        );

        minY = Math.min(
          minY,
          y
        );

        maxX = Math.max(
          maxX,
          x
        );

        maxY = Math.max(
          maxY,
          y
        );
      }
    }
  }


  /*
     If no signature was detected, don't create
     an empty signature image.
  */

  if (
    minX >= sigCanvas.width ||
    minY >= sigCanvas.height
  ) {

    capturedSignature = null;

    closeSignatureModal();

    return;
  }


  /*
     Add a tiny amount of padding around the handwriting.

     This prevents the signature from being cut too tightly.
  */

  const padding = 3;


  minX =
    Math.max(
      0,
      minX - padding
    );

  minY =
    Math.max(
      0,
      minY - padding
    );

  maxX =
    Math.min(
      sigCanvas.width - 1,
      maxX + padding
    );

  maxY =
    Math.min(
      sigCanvas.height - 1,
      maxY + padding
    );


  /*
     Calculate the size of the cropped signature.
  */

  const croppedWidth =
    maxX - minX + 1;

  const croppedHeight =
    maxY - minY + 1;


  /*
     Create a new canvas containing ONLY the
     handwritten signature.
  */

  const croppedCanvas =
    document.createElement('canvas');


  croppedCanvas.width =
    croppedWidth;

  croppedCanvas.height =
    croppedHeight;


  const croppedCtx =
    croppedCanvas.getContext('2d');


  /*
     Copy only the signature area into the
     new smaller canvas.
  */

  croppedCtx.drawImage(
    sigCanvas,
    minX,
    minY,
    croppedWidth,
    croppedHeight,
    0,
    0,
    croppedWidth,
    croppedHeight
  );


  /*
     Save the cropped signature.

     This remains available until the user replaces
     or removes it.
  */

  capturedSignature =
    croppedCanvas.toDataURL('image/png');


  closeSignatureModal();
};


/* =========================================================
   SKIP SIGNATURE
   ========================================================= */

document.getElementById(
  'sigSkipBtn'
).onclick = () => {

  /*
     Skip simply closes the signature window.

     It does NOT export the PDF.
     It does NOT remove an existing saved signature.
  */

  closeSignatureModal();
};


/* =========================================================
   EXPORT PDF BUTTON
   ========================================================= */

document.getElementById(
  'exportPDFBtn'
).onclick = () => {

  if (!window.jspdf) {

    alert(
      'PDF library not loaded. Please refresh the page and try again.'
    );

    return;
  }


  /*
     Export now happens immediately.

     The signature is already stored in capturedSignature
     if the customer has signed.
  */

  doExportPDF();
};


/* =========================================================
   EXPORT PDF
   ========================================================= */

function doExportPDF() {

  const { jsPDF } =
    window.jspdf;


  const pdf =
    new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
      compress: true
    });


  /* =======================================================
     GENERAL PAGE SETTINGS
     ======================================================= */

  const left = 10;

  const right = 10;

  const top = 10;


  const pageWidth =
    pdf.internal.pageSize.getWidth();


  const pageHeight =
    pdf.internal.pageSize.getHeight();


  const usableWidth =
    pageWidth - left - right;


  let y = top;


  const lh = 2.5;

  const sh = 2.9;

  const hh = 4;


  /* =======================================================
     FIRST PAGE — TITLE
     ======================================================= */

  pdf.setFont(
    undefined,
    'bold'
  );


  pdf.setFontSize(8);


  pdf.text(
    'Field Service Job Sheet',
    pageWidth / 2,
    y,
    {
      align: 'center'
    }
  );


  /*
     Signature is placed after the table and notes.
  */

  y += hh;


  /* =======================================================
     FIRST PAGE — PRE-WRITTEN ADDRESS
     ======================================================= */

  const preWrittenAddress =
    "ANDERSON FIRE\nUnit 7\nMontrose Business Centre\nBroomfield Industrial Estate\nMontrose, Angus\nDD10 8SY";


  pdf.setFont(
    undefined,
    'normal'
  );


  pdf.setFontSize(5);


  pdf.text(
    preWrittenAddress,
    pageWidth / 2,
    y,
    {
      align: 'center'
    }
  );


  y += lh + 2;


  /* =======================================================
     FIRST PAGE — JOB DETAILS
     ======================================================= */

  pdf.setFont(
    undefined,
    'normal'
  );


  pdf.setFontSize(6);


  const jobNumber =
    document.getElementById(
      'jobNumber'
    ).value || '';


  const amcPO =
    document.getElementById(
      'amcPO'
    ).value || '';


  const address =
    document.getElementById(
      'address'
    ).value || '';


  const jobDate =
    document.getElementById(
      'jobDate'
    ).value || '';


  pdf.text(
    pdf.splitTextToSize(
      `Job No: ${jobNumber}`,
      usableWidth
    ),
    left,
    y
  );


  y += lh;


  pdf.text(
    pdf.splitTextToSize(
      `PO: ${amcPO}`,
      usableWidth
    ),
    left,
    y
  );


  y += lh;


  pdf.text(
    pdf.splitTextToSize(
      `Job Date: ${jobDate}`,
      usableWidth
    ),
    left,
    y
  );


  y += lh;


  pdf.setFont(
    'helvetica',
    'bold'
  );


  pdf.text(
    'Address:',
    left,
    y
  );


  y += lh;


  pdf.setFont(
    'helvetica',
    'normal'
  );


  const addressLines =
    pdf.splitTextToSize(
      address,
      usableWidth
    );


  pdf.text(
    addressLines,
    left,
    y
  );


  y +=
    addressLines.length * lh + sh;


  /* =======================================================
     FIRST PAGE — SUMMARIES
     ======================================================= */

  pdf.setFontSize(5);


  const colW =
    usableWidth / 3;


  const invText =
    document.getElementById(
      'inventorySummary'
    ).innerText;


  const locText =
    document.getElementById(
      'dueTestLocations'
    ).innerText;


  const dtText =
    document.getElementById(
      'dueTestSummary'
    ).innerText;


  const inv =
    pdf.splitTextToSize(
      invText,
      colW - 2
    );


  const locs =
    pdf.splitTextToSize(
      locText,
      colW - 2
    );


  const dt =
    pdf.splitTextToSize(
      dtText,
      colW - 2
    );


  pdf.text(
    inv,
    left,
    y
  );


  pdf.text(
    locs,
    left + colW,
    y
  );


  pdf.text(
    dt,
    left + colW * 2,
    y
  );


  y +=
    Math.max(
      inv.length,
      locs.length,
      dt.length
    ) * lh + sh;


  /* =======================================================
     FIRST PAGE — UNIT TABLE
     ======================================================= */

  const rows = [
    ...document.querySelector(
      '#unitTable tbody'
    ).rows
  ].map((r, i) => [

    i + 1,

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


  if (rows.length) {

    pdf.autoTable({

      startY: y,

      head: [
        [
          '#',
          'Unit',
          'Location',
          'Date',
          'Work'
        ]
      ],

      body: rows,

      theme: 'grid',

      margin: {
        left,
        right
      },

      styles: {

        fontSize: 5,

        cellPadding: 1,

        lineWidth: 0.1,

        valign: 'middle'
      },

      headStyles: {

        fillColor: false,

        textColor: 0,

        fontSize: 5,

        cellPadding: 1
      },

      columnStyles: {

        0: {
          cellWidth: 8,
          halign: 'center'
        },

        1: {
          cellWidth: 14,
          halign: 'center'
        },

        2: {
          cellWidth: 60
        },

        3: {
          cellWidth: 18,
          halign: 'center'
        },

        4: {
          cellWidth:
            usableWidth -
            (8 + 14 + 60 + 18)
        }
      }
    });


    y =
      pdf.lastAutoTable.finalY + sh;
  }


  /* =======================================================
     FIRST PAGE — NOTES
     ======================================================= */

  const notes =
    document.getElementById(
      'additionalNotes'
    ).value || '';


  if (notes.trim()) {

    y += 5;


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


    y += lh;


    pdf.setFont(
      undefined,
      'normal'
    );


    pdf.setFontSize(7);


    const noteLines =
      pdf.splitTextToSize(
        notes,
        usableWidth
      );


    pdf.text(
      noteLines,
      left,
      y
    );


    y +=
      noteLines.length * lh + sh;
  }


  /* =======================================================
     CUSTOMER SIGNATURE
     ======================================================= */

  /*
     Very small gap between the previous content and the
     Customer Signature label.
  */

  const signatureGap = 0.5;


  /*
     Width of the handwritten signature.

     Smaller number = smaller signature.
  */

  const signatureWidth = 40;


  /*
     Calculate the signature height from the canvas ratio.
  */

  const signatureHeight =
    signatureWidth *
    (
      sigCanvas.height /
      sigCanvas.width
    );


  /*
     Text size for the Customer Signature label.
  */

  const signatureLabelFontSize = 9;


  /*
     Very compact estimate of the space required.
  */

  const signatureRequiredHeight =
    signatureGap +
    1 +
    signatureHeight +
    0.5 +
    3;


  /*
     Bottom safety margin.
  */

  const signatureBottomMargin = 15;


  /*
     Only create the signature section if the customer
     actually signed.
  */

  if (capturedSignature) {

    /*
       Check whether the signature will fit on the
       current page.
    */

    if (
      y +
      signatureRequiredHeight +
      signatureBottomMargin >
      pageHeight
    ) {

      pdf.addPage();

      y = 25;
    }


    /*
       Very small gap after the previous content.
    */

    y += signatureGap;


    /* -------------------------------------------------------
       CUSTOMER SIGNATURE LABEL
       ------------------------------------------------------- */

    pdf.setFont(
      'helvetica',
      'bold'
    );

    pdf.setFontSize(
      signatureLabelFontSize
    );

    pdf.text(
      'Customer Signature:',
      left,
      y
    );


    /*
       Almost no gap between the label and signature.
    */

    y += 1;


    /* -------------------------------------------------------
       HANDWRITTEN SIGNATURE
       ------------------------------------------------------- */

    /*
       Keep the signature aligned with the label.
    */

    const signatureX = left;


    pdf.addImage(
      capturedSignature,
      'PNG',
      signatureX,
      y,
      signatureWidth,
      signatureHeight
    );


    /*
       Very small gap between the signature and underline.
    */

    y += signatureHeight + 0.5;


    /* -------------------------------------------------------
       SIGNATURE LINE
       ------------------------------------------------------- */

    const signatureLineX1 = left;

    const signatureLineX2 =
      left + signatureWidth;


    pdf.line(
      signatureLineX1,
      y,
      signatureLineX2,
      y
    );
  }


  /* =======================================================
     CERTIFICATE — NEW PAGE
     ======================================================= */

  pdf.addPage();


  /*
     Certificate top margin.

     Increase 40 -> certificate content moves DOWN.
     Decrease 40 -> certificate content moves UP.
  */

  const topMargin = 40;


  let certY = topMargin;


  /* =======================================================
     CERTIFICATE DATA
     ======================================================= */

  const certJobDate =
    document.getElementById(
      'jobDate'
    ).value;


  let certServiceDateStr = '';

  let certNextServiceDateStr = '';


  if (certJobDate) {

    const dateObj =
      new Date(certJobDate);


    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };


    certServiceDateStr =
      dateObj.toLocaleDateString(
        'en-GB',
        options
      );


    const nextYear =
      new Date(dateObj);


    nextYear.setFullYear(
      nextYear.getFullYear() + 1
    );


    certNextServiceDateStr =
      nextYear.toLocaleDateString(
        'en-GB',
        options
      );
  }


  /* =======================================================
     CERTIFICATE EQUIPMENT COUNTS
     ======================================================= */

  const certRows = [
    ...document.querySelector(
      '#unitTable tbody'
    ).rows
  ];


  let extinguishers = 0;

  let fb = 0;


  certRows.forEach(r => {

    const unit =
      r.cells[1]
        .querySelector('select')
        .value
        .trim()
        .toUpperCase();


    if (unit === 'FB') {

      fb++;

    }

    else if (unit) {

      extinguishers++;
    }
  });


  const quantitiesStr =
    `Fire Extinguishers: ${extinguishers} / Fire Blankets: ${fb}`;


  const certAddressStr =
    document.getElementById(
      'address'
    ).value || '';


  const certNo =
    document.getElementById(
      'jobNumber'
    ).value || '';


  const technician =
    document.getElementById(
      'certTechnician'
    ).value || '';


  /* =======================================================
     CERTIFICATE LOGOS
     ======================================================= */

  const logo1Img =
    document.getElementById('logo1');


  const logo2Img =
    document.getElementById('logo2');


  const logo1HeightMM = 35;


  const logo1WidthMM =
    logo1HeightMM *
    (
      logo1Img.naturalWidth /
      logo1Img.naturalHeight
    );


  const logo2HeightMM = 18;


  const logo2WidthMM =
    logo2HeightMM *
    (
      logo2Img.naturalWidth /
      logo2Img.naturalHeight
    );


  /* =======================================================
     COMPANY ADDRESS / HEADER
     ======================================================= */

  const compLines =
    "ANDERSON FIRE\nUnit 7\nMontrose Business Centre\nBroomfield Industrial Estate\nMontrose, Angus\nDD10 8SY\nTelephone 07810 566440\nEmail: enquiries@andersonfire.co.uk".split('\n');


  let companyY = 25;


  /* COMPANY NAME */

  pdf.setFont(
    undefined,
    'bold'
  );


  pdf.setFontSize(26);


  pdf.text(
    compLines[0],
    pageWidth / 2,
    companyY,
    {
      align: 'center'
    }
  );


  companyY += 9;


  /* COMPANY ADDRESS */

  pdf.setFont(
    undefined,
    'normal'
  );


  pdf.setFontSize(14);


  compLines.slice(1).forEach(line => {

    pdf.text(
      line,
      pageWidth / 2,
      companyY,
      {
        align: 'center'
      }
    );


    companyY += 6;
  });


  /* =======================================================
     CERTIFICATE LOGO POSITIONING
     ======================================================= */

  const logoY = 34;


  /* COMPRESS LOGOS */

  function compressLogoPNG(
    img,
    targetWidth = 600
  ) {

    const scale =
      targetWidth /
      img.naturalWidth;


    const finalScale =
      Math.min(scale, 1);


    const canvas =
      document.createElement(
        'canvas'
      );


    canvas.width =
      Math.round(
        img.naturalWidth *
        finalScale
      );


    canvas.height =
      Math.round(
        img.naturalHeight *
        finalScale
      );


    const ctx =
      canvas.getContext('2d');


    ctx.drawImage(
      img,
      0,
      0,
      canvas.width,
      canvas.height
    );


    return canvas.toDataURL(
      'image/png'
    );
  }


  const logo1Compressed =
    compressLogoPNG(
      logo1Img,
      600
    );


  const logo2Compressed =
    compressLogoPNG(
      logo2Img,
      600
    );


  /* LEFT LOGO */

  const logo2X = 18;

  const logo2Y =
    logoY + 8;


  pdf.addImage(
    logo2Compressed,
    'PNG',
    logo2X,
    logo2Y,
    logo2WidthMM,
    logo2HeightMM
  );


  /* RIGHT LOGO */

  const logo1X =
    pageWidth -
    logo1WidthMM -
    18;


  const logo1Y =
    logoY;


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

  certY =
    companyY + 20;


  pdf.setFont(
    undefined,
    'bold'
  );


  pdf.setFontSize(24);


  pdf.text(
    'CERTIFICATE OF MAINTENANCE',
    pageWidth / 2,
    certY,
    {
      align: 'center'
    }
  );


  certY += 8;


  /* =======================================================
     CERTIFICATE SUBTITLE
     ======================================================= */

  pdf.setFont(
    undefined,
    'normal'
  );


  pdf.setFontSize(15);


  pdf.text(
    'Fire Equipment',
    pageWidth / 2,
    certY,
    {
      align: 'center'
    }
  );


  certY += 18;


  const centerX =
    pageWidth / 2;


  /* =======================================================
     CERTIFICATE TEXT HELPER
     ======================================================= */

  function addLine(
    text,
    fontSize = 11,
    bold = false,
    spacing = 8,
    italic = false,
    align = 'center',
    xPosition = centerX
  ) {

    let fontStyle = 'normal';


    if (bold && italic) {

      fontStyle = 'bolditalic';

    }

    else if (bold) {

      fontStyle = 'bold';

    }

    else if (italic) {

      fontStyle = 'italic';
    }


    pdf.setFont(
      undefined,
      fontStyle
    );


    pdf.setFontSize(
      fontSize
    );


    const lines =
      pdf.splitTextToSize(
        text,
        pageWidth - 20
      );


    lines.forEach(line => {

      pdf.text(
        line,
        xPosition,
        certY,
        {
          align: align
        }
      );


      certY += spacing;
    });
  }


  /* =======================================================
     CERTIFICATE INFORMATION TABLE
     ======================================================= */

  const certInfoX =
    centerX - 32;


  const certLabelWidth = 38;

  const certValueWidth = 32;

  const certRowHeight = 6;


  const certInfoRows = [

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


  pdf.setFont(
    undefined,
    'normal'
  );


  pdf.setFontSize(10);


  certInfoRows.forEach(
    (row, index) => {

      const rowY =
        certY +
        (index * certRowHeight);


      pdf.rect(
        certInfoX,
        rowY - certRowHeight + 1,
        certLabelWidth,
        certRowHeight
      );


      pdf.rect(
        certInfoX + certLabelWidth,
        rowY - certRowHeight + 1,
        certValueWidth,
        certRowHeight
      );


      pdf.text(
        row[0],
        certInfoX + 2,
        rowY - 1
      );


      pdf.text(
        row[1],
        certInfoX +
        certLabelWidth +
        2,
        rowY - 1
      );
    }
  );


  certY =
    certY +
    (
      certInfoRows.length *
      certRowHeight
    ) +
    8;


  /* =======================================================
     ADDRESS HEADING
     ======================================================= */

  addLine(
    'Address:',
    14,
    true,
    6
  );


  /* =======================================================
     CERTIFICATE ADDRESS
     ======================================================= */

  certY += 3;


  certAddressStr
    .split('\n')
    .forEach(line => {

      addLine(
        line,
        15,
        false,
        7,
        true,
        'left',
        centerX - 25
      );
    });


  addLine('');


  /* =======================================================
     TECHNICIAN
     ======================================================= */

  addLine(
    `Technician: ${technician}`
  );


  addLine('');


  /* =======================================================
     DUTY OF CARE
     ======================================================= */

  const dutyOfCare =
    "Anderson Fire have serviced the portable fire extinguishers and other fire protection equipment within the premises identified above in accordance with the requirements and frequencies indicated by BS5306 part 3 and any future amendments. Where dry powder extinguishers are installed the customer accepts responsibility for any secondary damage caused to people and processes. According to BS5306 part 3, it is the duty of the responsible person in the premise to inspect extinguishers at monthly intervals. DUTY OF CARE WASTE TRANSFER NOTE: By signing, the customer hereby authorizes Anderson Fire to dispose of extinguishers to be removed from the customers site.";


  certY =
    pdf.internal.pageSize.getHeight() - 50;


  addLine(
    dutyOfCare,
    9,
    false,
    5
  );


  /* =======================================================
     SAVE PDF
     ======================================================= */

  const firstAddressLine =
    certAddressStr
      .split('\n')[0]
      .trim();


  pdf.save(
    `${firstAddressLine} ${certNo}.pdf`
  );
}


/* =========================================================
   LOCATION AUTO-CAPITALIZE & NAME MEMORY
   ========================================================= */

let sessionLocations = [];


function updateLocationDatalist() {

  let dataList =
    document.getElementById(
      'locationList'
    );


  if (!dataList) {

    dataList =
      document.createElement(
        'datalist'
      );


    dataList.id =
      'locationList';


    document.body.appendChild(
      dataList
    );
  }


  dataList.innerHTML = '';


  sessionLocations.forEach(name => {

    const option =
      document.createElement(
        'option'
      );


    option.value = name;


    dataList.appendChild(
      option
    );
  });
}


function capitalizeWords(str) {

  return str
    .split(' ')
    .map(
      word =>
        word.charAt(0).toUpperCase() +
        word.slice(1)
    )
    .join(' ');
}


function setupLocationInputs() {

  const inputs =
    document.querySelectorAll(
      '.location-input'
    );


  inputs.forEach(input => {

    /*
       Prevent attaching duplicate listeners
       when saved sheets are loaded.
    */

    if (input.dataset.locationSetup === 'true') {
      return;
    }


    input.dataset.locationSetup = 'true';


    input.setAttribute(
      'list',
      'locationList'
    );


    input.addEventListener(
      'input',
      e => {

        const cursorPos =
          e.target.selectionStart;


        e.target.value =
          capitalizeWords(
            e.target.value
          );


        e.target.setSelectionRange(
          cursorPos,
          cursorPos
        );
      }
    );


    input.addEventListener(
      'change',
      e => {

        const val =
          e.target.value.trim();


        if (
          val &&
          !sessionLocations.includes(val)
        ) {

          sessionLocations.push(val);

          updateLocationDatalist();
        }
      }
    );
  });
}


/* INITIAL LOCATION SETUP */

updateLocationDatalist();

setupLocationInputs();


/* =========================================================
   KEEP ORIGINAL ADD ROW FUNCTION
   ========================================================= */

const originalAddRow =
  document.getElementById(
    'addRowBtn'
  ).onclick;


/*
   Expand Add Row so the new Location input also receives
   autocomplete and capitalization.
*/

document.getElementById(
  'addRowBtn'
).onclick = () => {

  originalAddRow();

  setupLocationInputs();
};


/* =========================================================
   SERVICE WORKER REGISTRATION
   ========================================================= */

if ('serviceWorker' in navigator) {

  navigator.serviceWorker.addEventListener(
    'message',
    event => {

      if (
        event.data &&
        event.data.type === 'SW_UPDATED'
      ) {

        window.location.reload();
      }
    }
  );


  window.addEventListener(
    'load',
    () => {

      /*
       * Only register/check the service worker when
       * the device is online.
       *
       * When offline, the existing installed service
       * worker and cached files can work without
       * contacting GitHub.
       */
      if (!navigator.onLine) {
        return;
      }


      navigator.serviceWorker.register(
        './service-worker.js'
      )

      .then(
        () =>
          console.log(
            'SW registered'
          )
      )

      .catch(
        err =>
          console.log(
            'SW error:',
            err
          )
      );
    }
  );
}
