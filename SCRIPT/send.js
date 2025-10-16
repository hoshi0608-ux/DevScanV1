function showPopup(message, isSuccess = true) {
  // Create overlay
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.background = "rgba(0, 0, 0, 0.5)";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.zIndex = "9999";
  overlay.style.backdropFilter = "blur(6px)";

  // Create popup box
  const box = document.createElement("div");
  box.style.background = "#111827";
  box.style.color = "#fff";
  box.style.padding = "30px 40px";
  box.style.borderRadius = "14px";
  box.style.textAlign = "center";
  box.style.fontFamily = "Inter, sans-serif";
  box.style.boxShadow = "0 10px 35px rgba(0,0,0,0.5)";
  box.style.maxWidth = "320px";
  box.style.animation = "popupFadeIn 0.3s ease";
  box.style.border = isSuccess
    ? "1px solid #22c55e"
    : "1px solid #ef4444";

  // Message text
  const msg = document.createElement("p");
  msg.textContent = message;
  msg.style.margin = "0 0 15px";
  msg.style.fontSize = "1rem";
  msg.style.lineHeight = "1.4";

  // OK button
  const btn = document.createElement("button");
  btn.textContent = "OK";
  btn.style.background = isSuccess ? "#22c55e" : "#ef4444";
  btn.style.color = "#fff";
  btn.style.border = "none";
  btn.style.padding = "8px 20px";
  btn.style.borderRadius = "8px";
  btn.style.cursor = "pointer";
  btn.style.fontWeight = "500";
  btn.style.transition = "0.2s";
  btn.addEventListener("mouseenter", () => (btn.style.opacity = "0.8"));
  btn.addEventListener("mouseleave", () => (btn.style.opacity = "1"));
  btn.addEventListener("click", () => overlay.remove());

  box.appendChild(msg);
  box.appendChild(btn);
  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

// Add animation once
if (!document.getElementById("popupAnimation")) {
  const style = document.createElement("style");
  style.id = "popupAnimation";
  style.textContent = `
    @keyframes popupFadeIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

function sendMail() {
  let parms = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value || "Not provided",
    feedback: document.getElementById("feedback").value,
    message: document.getElementById("message").value,
    time: new Date().toLocaleString(),
  };

  emailjs
    .send("service_gj28tsq", "template_tzsr24a", parms)
    .then(
      function (response) {
        showPopup("✅ Feedback sent successfully!", true);
        document.querySelector(".support-form").reset();
      },
      function (error) {
        showPopup("❌ Failed to send email. Please try again.", false);
        console.error("EmailJS Error:", error);
      }
    );
}