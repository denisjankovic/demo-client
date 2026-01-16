lucide.createIcons();

// Price Simulator Logic
const selectableCards = document.querySelectorAll(".selectable-card");
const pricingToggle = document.getElementById("pricingToggle");
const toggleBtns = document.querySelectorAll(".toggle-btn");
const toggleContainer = document.getElementById("pricingToggleContainer");
const annualDiscounts = document.querySelectorAll(".annual-discount");

// Recap elements
const defaultIntegration = document.getElementById("defaultIntegration");
const selectedPlanInfo = document.getElementById("selectedPlanInfo");
const recapPlanIcon = document.getElementById("recapPlanIcon");
const recapPlanTitle = document.getElementById("recapPlanTitle");
const recapPlanPrice = document.getElementById("recapPlanPrice");
const recapPlanPeriod = document.getElementById("recapPlanPeriod");
const recapServicesList = document.getElementById("recapServicesList");
const recapDivider = document.getElementById("recapDivider");
const recapYears = document.getElementById("recapYears");
const year1Amount = document.getElementById("year1Amount");
const year2Amount = document.getElementById("year2Amount");

let isAnnual = false;
let selectedCard = null;

const planDetails = {
  lite: {
    title: "LITE",
    desc: "Hébergement + Maintenance + Support",
    services: [
      { key: "hosting", text: "Hébergement", level: "lite" },
      { key: "support", text: "Support client", level: "lite" },
      { key: "logs", text: "Logs 24h (temps réel)", level: "lite" },
      { key: "fixes", text: "Correctifs en cas de panne", level: "lite" },
      {
        key: "server",
        text: "Serveur sup. : +70 € / mois",
        level: "lite",
      },
    ],
  },
  plus: {
    title: "PLUS",
    desc: "LITE + Évolutions + Support prioritaire",
    services: [
      { key: "hosting", text: "Hébergement", level: "lite" },
      { key: "support", text: "Support client", level: "lite" },
      {
        key: "logs",
        text: "Logs avec historique 30 jours",
        level: "plus",
      },
      { key: "fixes", text: "Correctifs en cas de panne", level: "lite" },
      {
        key: "monitoring",
        text: "Supervision des erreurs",
        level: "plus",
      },
      {
        key: "updates",
        text: "Mises à jour sécurité & compatibilité",
        level: "plus",
      },
      {
        key: "intervention",
        text: "1 journée d'intervention / mois",
        level: "plus",
      },
      {
        key: "server",
        text: "Serveur sup. : +90 € / mois",
        level: "plus",
      },
    ],
  },
  pro: {
    title: "PRO",
    desc: "PLUS + Interventions + Ressources étendues",
    services: [
      { key: "hosting", text: "Hébergement", level: "lite" },
      {
        key: "support",
        text: "Support client prioritaire",
        level: "pro",
      },
      {
        key: "logs",
        text: "Logs avec historique 90 jours",
        level: "pro",
      },
      { key: "fixes", text: "Correctifs en cas de panne", level: "lite" },
      {
        key: "monitoring",
        text: "Supervision des erreurs",
        level: "plus",
      },
      {
        key: "updates",
        text: "Mises à jour sécurité & compatibilité",
        level: "plus",
      },
      { key: "adjustments", text: "Ajustements avancés", level: "pro" },
      {
        key: "intervention",
        text: "2 journées d'intervention / mois",
        level: "pro",
      },
      {
        key: "server",
        text: "Serveur sup. : +120 € / mois",
        level: "pro",
      },
    ],
  },
};

// Toggle between monthly and annual
pricingToggle.addEventListener("change", function () {
  isAnnual = this.checked;

  // Update toggle buttons
  toggleBtns.forEach((btn) => {
    if (
      (btn.dataset.period === "annual" && isAnnual) ||
      (btn.dataset.period === "monthly" && !isAnnual)
    ) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Show/hide discount badges
  annualDiscounts.forEach((badge) => {
    if (isAnnual) {
      badge.classList.add("show");
    } else {
      badge.classList.remove("show");
    }
  });

  // Update all card prices
  selectableCards.forEach((card) => {
    const monthlyPrice = card.querySelector(".sim-price-monthly");
    const annualPrice = card.querySelector(".sim-price-annual");

    if (isAnnual) {
      monthlyPrice.style.display = "none";
      annualPrice.style.display = "block";
    } else {
      monthlyPrice.style.display = "block";
      annualPrice.style.display = "none";
    }
  });

  // Update total if a card is selected
  if (selectedCard) {
    updateTotal(selectedCard);
  }
});

// Toggle options click handling
toggleBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const period = btn.dataset.period;
    pricingToggle.checked = period === "annual";
    pricingToggle.dispatchEvent(new Event("change"));
  });
});

// Card selection and activation
selectableCards.forEach((card, index) => {
  card.addEventListener("click", function () {
    // Check if this card is already selected
    if (this.classList.contains("selected")) {
      // Deselect the card
      this.classList.remove("active");
      this.classList.remove("selected");
      selectedCard = null;

      // Reset z-index for all cards
      selectableCards.forEach((c) => {
        c.style.zIndex = "";
      });

      // Hide selection info, show only default
      selectedPlanInfo.style.display = "none";
      recapServicesList.style.display = "none";
      recapDivider.style.display = "none";
      recapYears.style.display = "none";
      defaultIntegration.style.display = "flex";
      toggleContainer.style.visibility = "hidden";

      // Remove from localStorage
      localStorage.removeItem("jdIntegrationSelection");

      // Reset contact button to default
      resetContactButton();

      return;
    }

    // Remove active and selected class from all cards
    selectableCards.forEach((c) => {
      c.classList.remove("active");
      c.classList.remove("selected");
      c.style.zIndex = "";
    });

    // Add active and selected class to clicked card
    this.classList.add("active");
    this.classList.add("selected");
    selectedCard = this;

    // Set z-index based on which card is selected
    const clickedIndex = Array.from(selectableCards).indexOf(this);

    if (clickedIndex === 0) {
      // LITE selected: LITE (10) > PLUS (5) > PRO (3)
      selectableCards[0].style.zIndex = "10";
      selectableCards[1].style.zIndex = "5";
      selectableCards[2].style.zIndex = "3";
    } else if (clickedIndex === 1) {
      // PLUS selected: PLUS (10) > LITE & PRO (2)
      selectableCards[0].style.zIndex = "2";
      selectableCards[1].style.zIndex = "10";
      selectableCards[2].style.zIndex = "2";
    } else if (clickedIndex === 2) {
      // PRO selected: PRO (10) > PLUS (5) > LITE (3)
      selectableCards[0].style.zIndex = "3";
      selectableCards[1].style.zIndex = "5";
      selectableCards[2].style.zIndex = "10";
    }

    // Update total price
    updateTotal(this);
  });
});

function updateTotal(card) {
  const plan = card.dataset.plan;
  const monthlyPrice = parseInt(card.dataset.priceMonthly);
  const annualPrice = parseInt(card.dataset.priceAnnual);
  // Get initial cost from CSS variable
  const initialCostStr = getComputedStyle(document.documentElement)
    .getPropertyValue("--initial-price")
    .trim();
  const initialCost = parseInt(initialCostStr) || 4400;

  // Keep default visible, show selection and toggle
  defaultIntegration.style.display = "flex";
  selectedPlanInfo.style.display = "block";
  recapServicesList.style.display = "block";
  recapDivider.style.display = "block";
  recapYears.style.display = "flex";
  toggleContainer.style.visibility = "visible";

  // Update plan details
  const planInfo = planDetails[plan];
  recapPlanTitle.textContent = planInfo.title;

  // Add plan class to recap card for color styling
  selectedPlanInfo.className = `recap-plan-card plan-${plan}`;

  // Define colors for each specific service
  const serviceColors = {
    Hébergement: { bg: "#e0f9f6", border: "#4fd1c5" },
    "Support client": { bg: "#e0f9f6", border: "#4fd1c5" },
    "Support client prioritaire": { bg: "#fef3e8", border: "#e6a871" },
    "Logs 24h (temps réel)": { bg: "#e0f9f6", border: "#4fd1c5" },
    "Logs avec historique 30 jours": { bg: "#dbeafe", border: "#7cb8f7" },
    "Logs avec historique 90 jours": { bg: "#fef3e8", border: "#e6a871" },
    "Correctifs en cas de panne": { bg: "#e0f9f6", border: "#4fd1c5" },
    "Supervision des erreurs": { bg: "#dbeafe", border: "#7cb8f7" },
    "Mises à jour sécurité & compatibilité": {
      bg: "#dbeafe",
      border: "#7cb8f7",
    },
    "Ajustements avancés": { bg: "#fef3e8", border: "#e6a871" },
    "1 journée d'intervention / mois": {
      bg: "#dbeafe",
      border: "#7cb8f7",
    },
    "2 journées d'intervention / mois": {
      bg: "#fef3e8",
      border: "#e6a871",
    },
    "Serveur sup. : +70 € / mois": { bg: "#e0f9f6", border: "#4fd1c5" },
    "Serveur sup. : +90 € / mois": { bg: "#dbeafe", border: "#7cb8f7" },
    "Serveur sup. : +120 € / mois": { bg: "#fef3e8", border: "#e6a871" },
  };

  // Render services list with service-specific colors
  recapServicesList.innerHTML = planInfo.services
    .map((service) => {
      const colors = serviceColors[service.text] || {
        bg: "#f1f5f9",
        border: "#cbd5e1",
      };
      return `
          <div class="service-item" style="background-color: ${colors.bg}; border-color: ${colors.border};">
            ${service.text}
          </div>
        `;
    })
    .join("");
  lucide.createIcons();

  if (isAnnual) {
    recapPlanPrice.innerHTML =
      '<span class="annual-discount">2 mois offerts</span>' +
      annualPrice.toLocaleString("fr-FR") +
      "€";
    recapPlanPeriod.textContent = "/an";

    // Calculate totals for annual
    const year1Total = initialCost + annualPrice;
    const year2Total = annualPrice;

    year1Amount.textContent = year1Total.toLocaleString("fr-FR") + "€";
    year2Amount.textContent = year2Total.toLocaleString("fr-FR") + "€";
  } else {
    recapPlanPrice.textContent = monthlyPrice.toLocaleString("fr-FR") + "€";
    recapPlanPeriod.textContent = "/mois";

    // Calculate totals for monthly (12 months per year)
    const year1Total = initialCost + monthlyPrice * 12;
    const year2Total = monthlyPrice * 12;

    year1Amount.textContent = year1Total.toLocaleString("fr-FR") + "€";
    year2Amount.textContent = year2Total.toLocaleString("fr-FR") + "€";
  }

  // Update CTA button mailto with selection details
  updateContactButton(plan, isAnnual, monthlyPrice, annualPrice);

  // Save selection to localStorage
  saveSelectionToLocalStorage(
    plan,
    isAnnual,
    monthlyPrice,
    annualPrice,
    initialCost
  );
}

// Save user selection to localStorage
function saveSelectionToLocalStorage(
  plan,
  isAnnual,
  monthlyPrice,
  annualPrice,
  initialCost
) {
  const selection = {
    plan: plan,
    isAnnual: isAnnual,
    monthlyPrice: monthlyPrice,
    annualPrice: annualPrice,
    initialCost: initialCost,
    timestamp: new Date().toISOString(),
    year1Total: initialCost + (isAnnual ? annualPrice : monthlyPrice * 12),
    year2Total: isAnnual ? annualPrice : monthlyPrice * 12,
  };

  localStorage.setItem("jdIntegrationSelection", JSON.stringify(selection));
}

// Load selection from localStorage on page load
function loadSelectionFromLocalStorage() {
  const saved = localStorage.getItem("jdIntegrationSelection");
  if (saved) {
    try {
      const selection = JSON.parse(saved);

      // Find the card that matches the saved plan
      const savedCard = Array.from(selectableCards).find(
        (card) => card.dataset.plan === selection.plan
      );

      if (savedCard) {
        // Set the billing period toggle
        pricingToggle.checked = selection.isAnnual;
        pricingToggle.dispatchEvent(new Event("change"));

        // Trigger card selection
        setTimeout(() => {
          savedCard.click();
        }, 100);
      }

      return selection;
    } catch (e) {
      console.error("Error loading saved selection:", e);
    }
  }
  return null;
}

// Load saved selection on page load
window.addEventListener("DOMContentLoaded", () => {
  loadSelectionFromLocalStorage();
});

// Reset contact button to default (no plan selected)
function resetContactButton() {
  const contactButton = document.querySelector(".contact-button");
  if (!contactButton) return;

  const emailSubject = encodeURIComponent(
    "Demande de devis - Intégration BackYou × HubSpot"
  );
  const emailBody = encodeURIComponent(
    `Bonjour,\n\n` +
      `Je souhaite recevoir un devis pour les prestations suivantes :\n\n` +
      `    • Intégration initiale : 4 400€ (développement initial)\n\n` +
      `Merci de me contacter pour finaliser cette demande.\n\n` +
      `Cordialement`
  );

  contactButton.href = `mailto:jankovicdenis.jd@gmail.com?subject=${emailSubject}&body=${emailBody}`;
}

// Update contact button with selected plan details
function updateContactButton(plan, isAnnual, monthlyPrice, annualPrice) {
  const contactButton = document.querySelector(".contact-button");
  if (!contactButton) return;

  const planNames = {
    lite: "LITE",
    plus: "PLUS",
    pro: "PRO",
  };

  const planName = planNames[plan];
  const price = isAnnual ? annualPrice : monthlyPrice;
  const period = isAnnual ? "an" : "mois";
  const initialCostStr = getComputedStyle(document.documentElement)
    .getPropertyValue("--initial-price")
    .trim();
  const initialCost = parseInt(initialCostStr) || 4400;

  const emailSubject = encodeURIComponent(
    "Demande de devis - Intégration BackYou × HubSpot"
  );

  const indent = "    ";

  const emailBody = encodeURIComponent(
    `Bonjour,\n\n` +
      `Je souhaite recevoir un devis pour les prestations suivantes :\n\n` +
      `${indent}• Intégration initiale : 4 400€ (développement initial)\n` +
      `${indent}• Offre ${planName} : ${price.toLocaleString(
        "fr-FR"
      )}€/${period}\n` +
      `${indent}• Facturation : ${
        isAnnual ? "Annuelle (2 mois offerts)" : "Mensuelle"
      }\n\n` +
      `Coût total première année : ${(
        initialCost + (isAnnual ? price : price * 12)
      ).toLocaleString("fr-FR")}€\n\n` +
      `Merci de me contacter pour finaliser cette demande.\n\n` +
      `Cordialement`
  );

  contactButton.href = `mailto:jankovicdenis.jd@gmail.com?subject=${emailSubject}&body=${emailBody}`;
}
