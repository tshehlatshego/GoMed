// Load cart count from localStorage



const chatContainer = document.getElementById("chatContainer");
const symptomButtons = document.querySelectorAll(".option-btn");
const cartCountElement = document.querySelector(".cart-count");

function goToChooseoption() {
    // Chatbot page created by another team member
    window.location.href = "choose-option.html";
}

let cart = JSON.parse(localStorage.getItem("gomedCart")) || {};

function updateCartCount() {
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  cartCountElement.innerText = totalItems;
}

updateCartCount();

// Function to add to cart
function addToCart(name) {
  const medId = Math.random().toString(36).substr(2, 9); // Simple ID
  cart[medId] = (cart[medId] || 0) + 1;
  localStorage.setItem("gomedCart", JSON.stringify(cart));
  updateCartCount();
  alert(`${name} added to cart ✅`);
}
function renderCart() {
  const cartList = document.getElementById("cartList");
  cartList.innerHTML = ""; // clear previous

  if (Object.keys(cart).length === 0) {
    cartList.innerHTML = "<li>Your cart is empty</li>";
    return;
  }

  // For chatbot, just show item IDs since we don't have med names stored
  Object.entries(cart).forEach(([id, qty]) => {
    const li = document.createElement("li");
    li.textContent = `Item ${id.substr(0, 5)}... (Qty: ${qty})`;

    const removeBtn = document.createElement("button");
    removeBtn.textContent = "❌";
    removeBtn.addEventListener("click", () => {
      removeFromCart(id);
    });

    li.appendChild(removeBtn);
    cartList.appendChild(li);
  });
}

function removeFromCart(id) {
  delete cart[id]; // remove the item
  localStorage.setItem("gomedCart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}


// Utility: add bot message
function addBotMessage(text) {
  const message = document.createElement("div");
  message.className = "chat-message bot";
  message.innerText = text;
  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

let typingIndicatorElement = null;

function showTypingIndicator() {
  if (typingIndicatorElement) return;

  typingIndicatorElement = document.createElement("div");
  typingIndicatorElement.className = "typing-indicator";

  typingIndicatorElement.innerHTML = `
    <span></span>
    <span></span>
    <span></span>
  `;

  chatContainer.appendChild(typingIndicatorElement);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

function hideTypingIndicator() {
  if (typingIndicatorElement) {
    typingIndicatorElement.remove();
    typingIndicatorElement = null;
  }
}


// Utility: add medication card
function addMedicationCard(name, description) {
  const card = document.createElement("div");
  card.className = "medication-card";

  card.innerHTML = `
    <div class="med-info">
      <h4>${name}</h4>
      <p>${description} • Over-the-counter</p>
       
    </div>
    <button class="add-cart-btn">Add to Cart</button>
  `;

  chatContainer.appendChild(card);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  card.querySelector(".add-cart-btn").addEventListener("click", () => {
    addToCart(name);
  });
}




function askForCustomSymptoms() {
  const wrapper = document.createElement("div");

  wrapper.innerHTML = `
    <div class="chat-message bot">
      Please describe the symptoms you are experiencing and how long you’ve had them.
    </div>

    <textarea 
      class="symptom-input" 
      placeholder="e.g. Nausea, Dizziness for 2 days"
    ></textarea>

    <button class="submit-btn">Continue</button>
  `;

  chatContainer.appendChild(wrapper);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const textarea = wrapper.querySelector(".symptom-input");
  const button = wrapper.querySelector(".submit-btn");

  button.addEventListener("click", () => {
    if (!textarea.value.trim()) return;

    const symptomText = textarea.value.trim();
    wrapper.remove();

    addBotMessage("Thank you. I’ve noted your symptoms.");
    askForSeverity(symptomText);
  });
}

function askForSeverity(symptomText) {
  addBotMessage("How severe are your symptoms?");

  const severityDiv = document.createElement("div");
  severityDiv.className = "severity-options";

  severityDiv.innerHTML = `
  <button class="severity-btn mild">🟢 Mild</button>
  <button class="severity-btn moderate">🟡 Moderate</button>
  <button class="severity-btn severe">🟠 Severe</button>
  <button class="severity-btn extreme">🔴 Extreme</button>
`;

  chatContainer.appendChild(severityDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  severityDiv.querySelectorAll(".severity-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const severity = btn.classList.contains("mild")
  ? "mild"
  : btn.classList.contains("moderate")
  ? "moderate"
  : btn.classList.contains("severe")
  ? "severe"
  : "extreme";

      severityDiv.remove();
      handleSeverityResponse(symptomText, severity);
    });
  });
}

function determineEscalation(severity) {
  if (severity === "extreme") return "urgent care";
  if (severity === "severe") return "consult doctor";
  return "none";
}


function handleSeverityResponse(symptomText, severity) {
  // Add warning banners for Severe/Extreme
  if (severity === "severe" || severity === "extreme") {
    const warning = document.createElement("div");
    warning.className = "warning-banner";
    warning.innerHTML = `
      <span class="icon">⚠</span>
      ${
        severity === "severe"
          ? "Your symptoms appear serious. Over-the-counter medication may provide temporary relief, but consulting a healthcare professional is recommended."
          : "Your symptoms may require urgent medical attention. Please seek immediate care or visit the nearest healthcare facility."
      }
    `;
    chatContainer.appendChild(warning);
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  // OTC guidance for mild/moderate

  callAI("other", symptomText, severity)
}

async function callAI(symptom, description = "", severity = "") {
  showTypingIndicator();

  try {
    const response = await fetch("/api/medical-assist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptom, description, severity })
    });

    const data = await response.json();

    hideTypingIndicator();

    if (data.guidance) addBotMessage(data.guidance);

    if (data.medications) {
      data.medications.forEach(med =>
        addMedicationCard(med.name, med.description)
      );
    }

    if (data.escalation === "consult doctor") {
      addBotMessage("⚠ We recommend consulting a healthcare professional.");
    } else if (data.escalation === "urgent care") {
      addBotMessage("🚨 Seek urgent medical attention immediately!");
    }
  } catch (err) {
    hideTypingIndicator();
    console.error(err);
    addBotMessage("Sorry, something went wrong while analyzing your symptoms.");
  }
}


function handleSymptom(symptom) {
  const optionsDiv = document.getElementById("symptomOptions");
  if (optionsDiv) optionsDiv.remove();

  if (symptom === "other") {
    askForCustomSymptoms();
  } else {
    callAI(symptom);
  }
}

// Attach click handlers
symptomButtons.forEach(button => {
  button.addEventListener("click", () => {
    const symptom = button.dataset.symptom;
    handleSymptom(symptom);
  });
});

const cartIcon = document.querySelector(".cart");
const cartDropdown = document.getElementById("cartDropdown");

cartIcon.addEventListener("click", () => {
  cartDropdown.style.display =
    cartDropdown.style.display === "none" ? "block" : "none";

  renderCart(); // show current items
});


