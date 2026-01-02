const requests = [
  {
    id: crypto.randomUUID(),
    clientName: 'Nova Nine',
    comms: 'Spectrum // Nova9',
    location: 'Orison - Platform A19',
    urgency: 'Priority',
    type: 'Medical',
    description: 'Critical bleed-out. Needs med evac and ICU bed.',
    preferredShip: 'Cutlass Red',
    status: 'New',
    assignedCrewId: null,
    assignedShipId: null,
    updatedAt: '2m ago'
  },
  {
    id: crypto.randomUUID(),
    clientName: 'Silver Spear',
    comms: 'SCM 345.9',
    location: 'Daymar - Wolf Point',
    urgency: 'High',
    type: 'Extraction',
    description: 'Engine failure, 2 crew stable, needs tow and escort.',
    preferredShip: 'SRV + Light Fighter',
    status: 'In Progress',
    assignedCrewId: 'crew-1',
    assignedShipId: 'ship-1',
    updatedAt: '8m ago'
  },
  {
    id: crypto.randomUUID(),
    clientName: 'Valkyrie Med',
    comms: 'Spectrum // Valk',
    location: 'MicroTech - New Babbage',
    urgency: 'Routine',
    type: 'Recovery',
    description: 'Body recovery and evidence bagging for insurance claim.',
    preferredShip: 'Pisces',
    status: 'New',
    assignedCrewId: null,
    assignedShipId: null,
    updatedAt: '14m ago'
  }
];

const crews = [
  { id: 'crew-1', name: 'Blackstar Medics', focus: 'Trauma', comms: 'Callsign: Blackstar' },
  { id: 'crew-2', name: 'Astra Salvage', focus: 'Recovery', comms: 'Spectrum: Astra' },
  { id: 'crew-3', name: 'Vigil Escorts', focus: 'Escort', comms: 'Vigil-Lead' }
];

const ships = [
  { id: 'ship-1', name: 'Cutlass Red', role: 'Medical', capacity: '2 beds' },
  { id: 'ship-2', name: 'Argo SRV', role: 'Recovery', capacity: 'Tow' },
  { id: 'ship-3', name: 'Anvil Pisces', role: 'Shuttle', capacity: '4 pax' }
];

const statusColumns = [
  { key: 'New', label: 'New', accent: 'tag--priority' },
  { key: 'In Progress', label: 'Dispatched', accent: 'tag--high' },
  { key: 'Completed', label: 'Resolved', accent: 'tag--routine' }
];

const activity = [
  'Blackstar Medics acknowledged Nova Nine ticket.',
  'Vigil Escorts cleared to support SRV tow.',
  'Hangar: Pisces prepped for shuttle duty.',
  'Ops: Added recovery crew Astra Salvage to roster.'
];

const requestForm = document.getElementById('request-form');
const crewForm = document.getElementById('crew-form');
const shipForm = document.getElementById('ship-form');
const requestList = document.getElementById('request-list');
const crewList = document.getElementById('crew-list');
const shipList = document.getElementById('ship-list');
const queueCount = document.getElementById('queue-count');
const boardColumns = document.getElementById('board-columns');
const urgencyFilter = document.getElementById('urgency-filter');
const typeFilter = document.getElementById('type-filter');
const activityFeed = document.getElementById('activity');
const statActive = document.getElementById('stat-active');

function urgencyClass(urgency) {
  if (urgency === 'Priority') return 'tag--priority';
  if (urgency === 'High') return 'tag--high';
  return 'tag--routine';
}

function renderQueue() {
  queueCount.textContent = `${requests.filter(r => r.status === 'New').length} waiting`;
  statActive.textContent = requests.filter(r => r.status !== 'Completed').length;

  requestList.innerHTML = '';
  requests
    .slice()
    .sort((a, b) => {
      const order = { Priority: 0, High: 1, Routine: 2 };
      return order[a.urgency] - order[b.urgency];
    })
    .forEach(request => {
      const item = document.createElement('div');
      item.className = 'list__item';
      item.innerHTML = `
        <div class="card__row">
          <div class="list__meta">
            <span class="tag ${urgencyClass(request.urgency)}">${request.urgency}</span>
            <strong>${request.clientName}</strong>
            <span>• ${request.location}</span>
          </div>
          <p class="cardlet__body">${request.description}</p>
          <div class="list__meta">
            <span class="chip">${request.type}</span>
            <span class="chip">${request.comms}</span>
            ${request.preferredShip ? `<span class="chip">Prefers ${request.preferredShip}</span>` : ''}
          </div>
        </div>
      `;
      requestList.appendChild(item);
    });
}

function renderCrews() {
  crewList.innerHTML = '';
  crews.forEach(crew => {
    const item = document.createElement('div');
    item.className = 'list__item';
    item.innerHTML = `
      <div class="cardlet__top">
        <div>
          <div class="cardlet__title">${crew.name}</div>
          <div class="cardlet__status">${crew.focus}</div>
        </div>
        <span class="chip">${crew.comms}</span>
      </div>
    `;
    crewList.appendChild(item);
  });
}

function renderShips() {
  shipList.innerHTML = '';
  ships.forEach(ship => {
    const item = document.createElement('div');
    item.className = 'list__item';
    item.innerHTML = `
      <div class="cardlet__top">
        <div>
          <div class="cardlet__title">${ship.name}</div>
          <div class="cardlet__status">${ship.role}</div>
        </div>
        <span class="chip">${ship.capacity}</span>
      </div>
    `;
    shipList.appendChild(item);
  });
}

function renderBoard() {
  boardColumns.innerHTML = '';
  statusColumns.forEach(column => {
    const col = document.createElement('div');
    col.className = 'column';
    col.innerHTML = `
      <div class="column__header">
        <h3>${column.label}</h3>
        <span class="tag ${column.accent}">${requests.filter(r => r.status === column.key).length}</span>
      </div>
    `;

    requests
      .filter(r => r.status === column.key)
      .filter(r => urgencyFilter.value === 'all' || r.urgency === urgencyFilter.value)
      .filter(r => typeFilter.value === 'all' || r.type === typeFilter.value)
      .forEach(r => {
        const card = document.createElement('div');
        card.className = 'cardlet';
        card.innerHTML = `
          <div class="cardlet__top">
            <div class="cardlet__title">${r.clientName}</div>
            <div class="cardlet__status">${r.location}</div>
          </div>
          <div class="cardlet__body">${r.description}</div>
          <div class="list__meta">
            <span class="tag ${urgencyClass(r.urgency)}">${r.urgency}</span>
            <span class="chip">${r.type}</span>
            <span class="chip">${r.updatedAt}</span>
          </div>
          <div class="cardlet__controls">
            <label>Assign crew
              <select data-id="${r.id}" class="crew-select">
                <option value="">Select crew</option>
                ${crews.map(c => `<option value="${c.id}" ${c.id === r.assignedCrewId ? 'selected' : ''}>${c.name}</option>`).join('')}
              </select>
            </label>
            <label>Assign ship
              <select data-id="${r.id}" class="ship-select">
                <option value="">Select ship</option>
                ${ships.map(s => `<option value="${s.id}" ${s.id === r.assignedShipId ? 'selected' : ''}>${s.name}</option>`).join('')}
              </select>
            </label>
            <label>Status
              <select data-id="${r.id}" class="status-select">
                ${statusColumns.map(s => `<option value="${s.key}" ${s.key === r.status ? 'selected' : ''}>${s.label}</option>`).join('')}
              </select>
            </label>
          </div>
        `;
        col.appendChild(card);
      });

    boardColumns.appendChild(col);
  });
}

function renderActivity() {
  activityFeed.innerHTML = '';
  activity.forEach(item => {
    const row = document.createElement('div');
    row.className = 'feed__item';
    row.innerHTML = `<span>${item}</span><span>Now</span>`;
    activityFeed.appendChild(row);
  });
}

function addActivity(entry) {
  activity.unshift(entry);
  if (activity.length > 8) activity.pop();
  renderActivity();
}

function handleBoardInteractions() {
  boardColumns.addEventListener('change', event => {
    const target = event.target;
    const requestId = target.getAttribute('data-id');
    if (!requestId) return;
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    if (target.classList.contains('crew-select')) {
      request.assignedCrewId = target.value || null;
      addActivity(`Assigned ${target.options[target.selectedIndex].text} to ${request.clientName}`);
    }

    if (target.classList.contains('ship-select')) {
      request.assignedShipId = target.value || null;
      addActivity(`Queued ${target.options[target.selectedIndex].text} for ${request.clientName}`);
    }

    if (target.classList.contains('status-select')) {
      request.status = target.value;
      request.updatedAt = 'Just now';
      addActivity(`Status for ${request.clientName} set to ${target.value}`);
    }

    renderBoard();
    renderQueue();
  });
}

requestForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(requestForm);
  const newRequest = {
    id: crypto.randomUUID(),
    clientName: data.get('clientName'),
    comms: data.get('comms'),
    location: data.get('location'),
    urgency: data.get('urgency'),
    type: data.get('type'),
    description: data.get('description'),
    preferredShip: data.get('preferredShip'),
    status: 'New',
    assignedCrewId: null,
    assignedShipId: null,
    updatedAt: 'Just now'
  };
  requests.unshift(newRequest);
  addActivity(`New ${newRequest.type} request from ${newRequest.clientName}`);
  requestForm.reset();
  renderQueue();
  renderBoard();
});

crewForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(crewForm);
  const crew = {
    id: crypto.randomUUID(),
    name: data.get('crewName'),
    focus: data.get('crewFocus'),
    comms: data.get('crewComms')
  };
  crews.push(crew);
  addActivity(`Crew added: ${crew.name}`);
  crewForm.reset();
  renderCrews();
  renderBoard();
});

shipForm.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(shipForm);
  const ship = {
    id: crypto.randomUUID(),
    name: data.get('shipName'),
    role: data.get('shipRole'),
    capacity: data.get('shipCapacity')
  };
  ships.push(ship);
  addActivity(`Ship added: ${ship.name}`);
  shipForm.reset();
  renderShips();
  renderBoard();
});

urgencyFilter.addEventListener('change', renderBoard);
typeFilter.addEventListener('change', renderBoard);

renderQueue();
renderCrews();
renderShips();
renderBoard();
renderActivity();
handleBoardInteractions();
