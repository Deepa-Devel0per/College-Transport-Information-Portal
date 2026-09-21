/* =========================================================
   KAMBAN COLLEGE TRANSPORT PORTAL
   app.js — Data, navigation, search, filtering & interaction
   ========================================================= */

"use strict";

/* =========================================================
   TRANSPORT DATA
   Source basis: reference PDF supplied for the assignment.
   The presentation and identifiers are intentionally redesigned.
   ========================================================= */

const transportData = [
  { bus:"KB-01", route:"Tirukoilur Corridor", start:"Tirukoilur", end:"Kamban College Campus", corridor:"Tirukoilur", stops:[
    ["Tirukoilur Bus Stand","06:20 AM"],["Railway Gate","06:32 AM"],["Market Road","06:45 AM"],["Government Hospital","07:02 AM"],["East Junction","07:18 AM"],["College Campus","08:10 AM"]
  ]},
  { bus:"KB-02", route:"Thanipadi Route", start:"Thanipadi", end:"Kamban College Campus", corridor:"Thanipadi", stops:[
    ["Thanipadi Main Stop","06:25 AM"],["Lake Junction","06:39 AM"],["Post Office Road","06:52 AM"],["Panchayat Office","07:08 AM"],["High School Corner","07:24 AM"],["College Campus","08:15 AM"]
  ]},
  { bus:"KB-03", route:"Chengam Route", start:"Chengam", end:"Kamban College Campus", corridor:"Chengam", stops:[
    ["Chengam Bus Stand","06:15 AM"],["Old Market","06:28 AM"],["Town Bypass","06:44 AM"],["Rice Mill Junction","07:03 AM"],["Main Road Stop","07:22 AM"],["North Junction","07:39 AM"],["College Campus","08:12 AM"]
  ]},
  { bus:"KB-04", route:"Gingee Corridor", start:"Gingee", end:"Kamban College Campus", corridor:"Gingee", stops:[
    ["Gingee Bus Stand","06:10 AM"],["Fort Road Junction","06:24 AM"],["Highway Service Road","06:41 AM"],["College Campus","08:18 AM"]
  ]},
  { bus:"KB-05", route:"Polur Route", start:"Polur", end:"Kamban College Campus", corridor:"Polur", stops:[
    ["Polur Bus Stand","06:05 AM"],["Market Junction","06:18 AM"],["Temple Road","06:33 AM"],["Railway Crossing","06:50 AM"],["Bypass Stop","07:12 AM"],["College Campus","08:14 AM"]
  ]},
  { bus:"KB-06", route:"Arani Route", start:"Arani", end:"Kamban College Campus", corridor:"Arani", stops:[
    ["Arani Bus Stand","06:00 AM"],["Old Town Junction","06:13 AM"],["Textile Market","06:27 AM"],["Collectorate Road","06:43 AM"],["Main Road Stop","07:02 AM"],["Railway Station","07:20 AM"],["Industrial Road","07:39 AM"],["College Campus","08:20 AM"]
  ]}
];

/* Route polish helpers */
function pickupCount(route){ return Math.max(0, route.stops.length - 1); }
function routeDurationMinutes(route){ return Math.max(0, parseTime(route.stops[route.stops.length-1][1]) - parseTime(route.stops[0][1])); }

/* =========================================================
   UTILITY FUNCTIONS
   ========================================================= */

function parseTime(timeText) {
  const [hm, period] = timeText.split(" ");
  let [hours, minutes] = hm.split(":").map(Number);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

function getAllStopsCount() {
  return transportData.reduce((total, route) => total + route.stops.length, 0);
}

function getEarliestRoute() {
  return transportData
    .slice()
    .sort((a, b) =>
      parseTime(a.stops[0][1]) - parseTime(b.stops[0][1])
    )[0];
}

/* =========================================================
   VIEW NAVIGATION
   ========================================================= */

function openView(viewId) {
  const target = document.getElementById(viewId);

  if (!target) return;

  document.querySelectorAll(".view").forEach(view => {
    view.classList.remove("active");
  });

  target.classList.add("active");

  document.querySelectorAll(".nav button").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.view === viewId
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

function setupNavigation() {
  document.querySelectorAll(".nav button").forEach(button => {
    button.addEventListener("click", () => {
      openView(button.dataset.view);
    });
  });
}

/* =========================================================
   ROUTE CARD
   ========================================================= */

function routeCard(route) {
  const firstPickup = route.stops[0][1];
  const finalArrival = route.stops[route.stops.length - 1][1];

  return `
    <article class="route-card">
      <div class="route-top">
        <span class="bus-badge">${escapeHTML(route.bus)}</span>
        <span class="status">Scheduled</span>
      </div>

      <h3>${escapeHTML(route.route)}</h3>

      <div class="route">
        ${escapeHTML(route.start)}
        →
        ${escapeHTML(route.end)}
      </div>

      <div class="route-line">
        <span class="dot"></span>
        <span>${route.stops.length} pickup points</span>
        <span class="line"></span>
        <span class="dot"></span>
      </div>

      <div class="meta">
        <div>
          <small>First pickup</small>
          <b>${escapeHTML(firstPickup)}</b>
        </div>

        <div>
          <small>Final arrival</small>
          <b>${escapeHTML(finalArrival)}</b>
        </div>
      </div>

      <div class="card-actions">
        <button
          class="mini-btn"
          type="button"
          onclick="showDetails('${escapeHTML(route.bus)}')">
          View route
        </button>

        <button
          class="mini-btn"
          type="button"
          onclick="showStops('${escapeHTML(route.bus)}')">
          Stops
        </button>
      </div>
    </article>
  `;
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function renderFeatured(data = transportData.slice(0, 3)) {
  const container = document.getElementById("featuredGrid");

  if (!container) return;

  if (!data.length) {
    container.innerHTML = `
      <div class="empty">
        No matching transport found.
      </div>
    `;
    return;
  }

  container.innerHTML = data.map(routeCard).join("");
}

function updateDashboardStats() {
  const busCount = document.getElementById("busCount");
  const stopCount = document.getElementById("stopCount");
  const firstTime = document.getElementById("firstTime");
  const coverage = document.getElementById("coverage");

  if (busCount) {
    busCount.textContent = transportData.length;
  }

  if (stopCount) {
    stopCount.textContent = getAllStopsCount();
  }

  if (firstTime) {
    firstTime.textContent = getEarliestRoute().stops[0][1];
  }

  if (coverage) {
    coverage.textContent =
      new Set(transportData.map(route => route.corridor)).size;
  }
}

/* =========================================================
   ROUTE DIRECTORY
   ========================================================= */

function populateRouteFilters() {
  const routeSelect = document.getElementById("routeSelect");
  const stopRoute = document.getElementById("stopRoute");

  const corridors = [
    ...new Set(transportData.map(route => route.corridor))
  ];

  if (routeSelect) {
    routeSelect.innerHTML =
      `<option value="all">All corridors</option>` +
      corridors
        .map(corridor =>
          `<option value="${escapeHTML(corridor)}">
             ${escapeHTML(corridor)}
           </option>`
        )
        .join("");
  }

  if (stopRoute) {
    stopRoute.innerHTML =
      `<option value="all">All routes</option>` +
      transportData
        .map(route =>
          `<option value="${escapeHTML(route.bus)}">
            ${escapeHTML(route.bus)} · ${escapeHTML(route.route)}
          </option>`
        )
        .join("");
  }
}

function renderRoutes() {
  const grid = document.getElementById("routesGrid");
  const searchInput = document.getElementById("routeSearch");
  const corridorSelect = document.getElementById("routeSelect");
  const sortSelect = document.getElementById("routeSort");

  if (!grid) return;

  const query = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  const corridor = corridorSelect
    ? corridorSelect.value
    : "all";

  const sort = sortSelect
    ? sortSelect.value
    : "default";

  let results = transportData.filter(route => {
    const searchableText = [
      route.bus,
      route.route,
      route.start,
      route.end,
      route.corridor,
      ...route.stops.map(stop => stop[0])
    ]
      .join(" ")
      .toLowerCase();

    return (
      (corridor === "all" || route.corridor === corridor) &&
      searchableText.includes(query)
    );
  });

  if (sort === "early") {
    results.sort(
      (a, b) =>
        parseTime(a.stops[0][1]) -
        parseTime(b.stops[0][1])
    );
  }

  if (sort === "name") {
    results.sort((a, b) =>
      a.route.localeCompare(b.route)
    );
  }

  grid.innerHTML = results.length
    ? results.map(routeCard).join("")
    : `<div class="empty">No routes match your search.</div>`;
}

/* =========================================================
   PICKUP TABLE
   ========================================================= */

function renderStops() {
  const table = document.getElementById("stopTable");
  const searchInput = document.getElementById("stopSearch");
  const routeSelect = document.getElementById("stopRoute");

  if (!table) return;

  const query = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  const selectedRoute = routeSelect
    ? routeSelect.value
    : "all";

  const rows = [];

  transportData.forEach(route => {
    if (
      selectedRoute !== "all" &&
      route.bus !== selectedRoute
    ) {
      return;
    }

    route.stops.forEach((stop, index) => {
      const searchable = [
        stop[0],
        route.bus,
        route.route,
        route.start,
        route.end
      ]
        .join(" ")
        .toLowerCase();

      if (searchable.includes(query)) {
        rows.push({
          location: stop[0],
          bus: route.bus,
          route: route.route,
          time: stop[1],
          sequence: index + 1
        });
      }
    });
  });

  if (!rows.length) {
    table.innerHTML = `
      <tr>
        <td colspan="5" class="empty">
          No pickup point found.
        </td>
      </tr>
    `;
    return;
  }

  table.innerHTML = rows
    .map(row => `
      <tr>
        <td>
          <strong>${escapeHTML(row.location)}</strong>
        </td>
        <td>
          <span class="bus-badge">
            ${escapeHTML(row.bus)}
          </span>
        </td>
        <td>${escapeHTML(row.route)}</td>
        <td>
          <strong>${escapeHTML(row.time)}</strong>
        </td>
        <td>${row.sequence}</td>
      </tr>
    `)
    .join("");
}

/* =========================================================
   DASHBOARD QUICK SEARCH
   ========================================================= */

function quickSearch() {
  const searchInput = document.getElementById("quickSearch");
  const timeFilter = document.getElementById("timeFilter");
  const sortFilter = document.getElementById("sortFilter");

  const query = searchInput
    ? searchInput.value.toLowerCase().trim()
    : "";

  const timeRange = timeFilter
    ? timeFilter.value
    : "all";

  const sort = sortFilter
    ? sortFilter.value
    : "default";

  let results = transportData.filter(route => {
    const searchableText = [
      route.bus,
      route.route,
      route.start,
      route.end,
      ...route.stops.map(stop => stop[0])
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch =
      searchableText.includes(query);

    const firstPickup = parseTime(route.stops[0][1]);

    let matchesTime = true;

    if (timeRange === "early") {
      matchesTime = firstPickup < 420;
    }

    if (timeRange === "mid") {
      matchesTime =
        firstPickup >= 420 &&
        firstPickup <= 480;
    }

    if (timeRange === "late") {
      matchesTime = firstPickup > 480;
    }

    return matchesSearch && matchesTime;
  });

  if (sort === "early") {
    results.sort(
      (a, b) =>
        parseTime(a.stops[0][1]) -
        parseTime(b.stops[0][1])
    );
  }

  if (sort === "late") {
    results.sort(
      (a, b) =>
        parseTime(b.stops[0][1]) -
        parseTime(a.stops[0][1])
    );
  }

  renderFeatured(results);
}

function clearSearch() {
  const search = document.getElementById("quickSearch");
  const time = document.getElementById("timeFilter");
  const sort = document.getElementById("sortFilter");

  if (search) search.value = "";
  if (time) time.value = "all";
  if (sort) sort.value = "default";

  renderFeatured();
}

/* =========================================================
   ROUTE DETAILS MODAL
   ========================================================= */

function showDetails(busNumber) {
  const route = transportData.find(
    item => item.bus === busNumber
  );

  if (!route) return;

  const title = document.getElementById("modalTitle");
  const body = document.getElementById("modalBody");
  const modal = document.getElementById("modal");

  if (!title || !body || !modal) return;

  title.textContent =
    `${route.bus} · ${route.route}`;

  body.innerHTML = `
    <p style="color:#64748b;font-size:13px;margin-bottom:15px">
      ${escapeHTML(route.start)}
      →
      ${escapeHTML(route.end)}
    </p>

    <div class="timeline">
      ${route.stops
        .map((stop, index) => `
          <div class="stop">
            <div class="time">
              ${escapeHTML(stop[1])}
            </div>

            <div class="stop-marker"></div>

            <div>
              <strong>${escapeHTML(stop[0])}</strong>
              <small>
                Pickup sequence ${index + 1}
              </small>
            </div>
          </div>
        `)
        .join("")}
    </div>
  `;

  modal.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  const modal = document.getElementById("modal");

  if (modal) {
    modal.classList.remove("show");
  }

  document.body.style.overflow = "";
}

function setupModal() {
  const modal = document.getElementById("modal");

  if (!modal) return;

  modal.addEventListener("click", event => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeModal();
    }
  });
}

function showStops(busNumber) {
  openView("stops");

  const search = document.getElementById("stopSearch");

  if (search) {
    search.value = busNumber;
    renderStops();
  }
}

/* =========================================================
   ROUTE FINDER
   ========================================================= */

function findRoute() {
  const input = document.getElementById("finderInput");
  const resultBox = document.getElementById("finderResult");

  if (!input || !resultBox) return;

  const query = input.value.toLowerCase().trim();

  if (!query) {
    resultBox.innerHTML = `
      <div class="panel empty">
        Enter a town or pickup point to search.
      </div>
    `;
    return;
  }

  const matches = [];

  transportData.forEach(route => {
    route.stops.forEach((stop, index) => {
      const searchable = [
        stop[0],
        route.bus,
        route.route,
        route.start
      ]
        .join(" ")
        .toLowerCase();

      if (searchable.includes(query)) {
        matches.push({
          route,
          stop,
          index
        });
      }
    });
  });

  if (!matches.length) {
    resultBox.innerHTML = `
      <div class="panel empty">
        <strong>No matching route found.</strong>
        <br>
        Try a different town or pickup point.
      </div>
    `;
    return;
  }

  resultBox.innerHTML = matches
    .map(match => `
      <div class="panel">
        <div class="panel-head">
          <div>
            <h2>
              ${escapeHTML(match.route.bus)}
              ·
              ${escapeHTML(match.route.route)}
            </h2>

            <div class="sub">
              ${escapeHTML(match.route.start)}
              →
              ${escapeHTML(match.route.end)}
            </div>
          </div>

          <span class="bus-badge">
            ${escapeHTML(match.stop[1])}
          </span>
        </div>

        <div class="timeline">
          ${match.route.stops
            .map((stop, index) => `
              <div
                class="stop"
                style="${
                  index === match.index
                    ? "border-color:#8ba7ff;background:#f4f7ff"
                    : ""
                }"
              >
                <div class="time">
                  ${escapeHTML(stop[1])}
                </div>

                <div class="stop-marker"></div>

                <div>
                  <strong>
                    ${escapeHTML(stop[0])}
                  </strong>

                  <small>
                    ${
                      index === match.index
                        ? "Matching pickup point"
                        : `Pickup sequence ${index + 1}`
                    }
                  </small>
                </div>
              </div>
            `)
            .join("")}
        </div>
      </div>
    `)
    .join("");
}

/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {
  const clock = document.getElementById("clock");

  if (!clock) return;

  clock.textContent = new Date().toLocaleString(
    "en-IN",
    {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }
  );
}

/* =========================================================
   INITIALIZATION
   ========================================================= */

function initPortal() {
  setupNavigation();
  setupModal();
  populateRouteFilters();
  updateDashboardStats();
  renderFeatured();
  renderRoutes();
  renderStops();
  updateClock();

  setInterval(updateClock, 1000);
}

document.addEventListener("DOMContentLoaded", initPortal);
