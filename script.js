const projectData = {
  country: "Eritrea",
  yearCurrent: 2026,
  yearPrevious: 2025,
  countriesTotal: 180,
  rankCurrent: 180,
  rankPrevious: 180,
  scoreCurrent: 10.24,
  scorePrevious: 11.32,
  detainedJournalists: 10,
  detainedMediaWorkers: 4,
  consultedOn: "15 maggio 2026",
  indicators: [
    {
      name: "Contesto politico",
      score: 8.04,
      rank: 180,
      detail: "Misura pluralismo, indipendenza editoriale e pressione del potere politico sui media."
    },
    {
      name: "Contesto economico",
      score: 12.15,
      rank: 180,
      detail: "Valuta quanto condizioni economiche e controllo delle risorse limitano il lavoro giornalistico."
    },
    {
      name: "Contesto giuridico",
      score: 9.90,
      rank: 180,
      detail: "Osserva leggi, garanzie e rischi giudiziari per chi pubblica informazioni indipendenti."
    },
    {
      name: "Contesto socioculturale",
      score: 9.57,
      rank: 178,
      detail: "Riguarda pressioni sociali, autocensura e possibilit&agrave; di discutere temi sensibili."
    },
    {
      name: "Sicurezza",
      score: 11.54,
      rank: 180,
      detail: "Misura minacce, detenzioni e pericoli concreti subiti da giornalisti e operatori media."
    }
  ]
};

const formatScore = (value) =>
  value.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

const setField = (key, value) => {
  document.querySelectorAll(`[data-field="${key}"]`).forEach((node) => {
    node.textContent = value;
  });
};

const scoreCurrentLabel = `${formatScore(projectData.scoreCurrent)} / 100`;
const scorePreviousLabel = `${formatScore(projectData.scorePrevious)} / 100`;
const rankCurrentLabel = `${projectData.rankCurrent}/${projectData.countriesTotal}`;
const rankPreviousLabel = `${projectData.rankPrevious}/${projectData.countriesTotal}`;
const detainedTotal = projectData.detainedJournalists + projectData.detainedMediaWorkers;
const detainedBreakdown = `${projectData.detainedJournalists} giornalisti + ${projectData.detainedMediaWorkers} operatori media`;

setField("score2026", scoreCurrentLabel);
setField("score2025", scorePreviousLabel);
setField("rank2026", rankCurrentLabel);
setField("rank2025", rankPreviousLabel);
setField("detainedTotal", String(detainedTotal));
setField("detainedBreakdown", detainedBreakdown);
setField("consultedOn", projectData.consultedOn);

const getFlipCards = () => document.querySelectorAll(".metric, .flip-row, .flip-indicator");

const closeFlipCards = (exceptCard = null) => {
  getFlipCards().forEach((card) => {
    if (card === exceptCard) {
      return;
    }

    card.classList.remove("is-flipped");
    card.setAttribute("aria-expanded", "false");
  });
};

const bindFlipCard = (card) => {
  if (card.dataset.flipReady === "true") {
    return;
  }

  card.dataset.flipReady = "true";

  card.addEventListener("click", (event) => {
    event.stopPropagation();

    const willOpen = !card.classList.contains("is-flipped");
    closeFlipCards(card);
    card.classList.toggle("is-flipped", willOpen);
    card.setAttribute("aria-expanded", String(willOpen));
  });

  card.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    card.click();
  });
};

document.querySelectorAll(".metric, .flip-row").forEach(bindFlipCard);

document.addEventListener("click", () => {
  closeFlipCards();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeFlipCards();
  }
});

const delta = Number((projectData.scoreCurrent - projectData.scorePrevious).toFixed(2));
const deltaNode = document.getElementById("deltaValue");
if (deltaNode) {
  const deltaText = `${delta > 0 ? "+" : ""}${formatScore(delta)}`;
  deltaNode.textContent = `${deltaText} punti`;
  deltaNode.classList.add(delta >= 0 ? "positive" : "negative");
}

const gaugeFill = document.getElementById("mainGaugeFill");
const bar2025 = document.getElementById("bar2025");
const bar2026 = document.getElementById("bar2026");

const meterTargets = [
  { node: gaugeFill, value: projectData.scoreCurrent },
  { node: bar2025, value: projectData.scorePrevious },
  { node: bar2026, value: projectData.scoreCurrent }
];

if (gaugeFill) {
  gaugeFill.setAttribute("aria-valuenow", String(projectData.scoreCurrent));
}

const indicatorGrid = document.getElementById("indicatorGrid");
if (indicatorGrid) {
  indicatorGrid.innerHTML = projectData.indicators
    .map(
      (indicator, index) => `
        <article class="indicator-row flip-indicator" tabindex="0" role="button" aria-expanded="false" aria-label="Mostra dettagli: ${indicator.name}" style="animation-delay:${index * 70}ms">
          <div class="indicator-inner">
            <div class="indicator-face indicator-front">
              <div class="indicator-main">
                <p class="indicator-name">${indicator.name}</p>
              </div>
              <div class="indicator-score">
                <span>Punteggio RSF</span>
                <strong>${formatScore(indicator.score)} / 100</strong>
              </div>
              <div class="indicator-meter">
                <div class="indicator-fill" data-meter="${indicator.score}"></div>
              </div>
            </div>
            <div class="indicator-face indicator-back">
              <strong>${indicator.name}</strong>
              <p>${indicator.detail}</p>
            </div>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll(".indicator-fill").forEach((bar) => {
    meterTargets.push({
      node: bar,
      value: Number(bar.dataset.meter || 0)
    });
  });

  document.querySelectorAll(".flip-indicator").forEach(bindFlipCard);
}

const animateMeters = () => {
  meterTargets.forEach(({ node, value }) => {
    if (!node) {
      return;
    }

    const clamped = Math.max(0, Math.min(value, 100));
    node.style.width = `${clamped}%`;
  });
};

window.addEventListener("load", () => {
  window.setTimeout(animateMeters, 220);
});
