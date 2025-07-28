// Set tanggal hari ini sebagai default
document.getElementById("assessmentDate").value = new Date()
  .toISOString()
  .split("T")[0];

function calculateTotal() {
  const factors = [
    "fall_history",
    "secondary_diagnosis",
    "ambulatory_aid",
    "iv_therapy",
    "gait",
    "mental_status",
  ];

  let total = 0;
  factors.forEach((factor) => {
    const selected = document.querySelector(`input[name="${factor}"]:checked`);
    if (selected) {
      total += parseInt(selected.value);
    }
  });

  document.getElementById("totalScore").innerHTML = `<strong>${total}</strong>`;
  updateRiskLevel(total);
}

function updateRiskLevel(score) {
  const riskLevelDiv = document.getElementById("riskLevel");

  if (score === 0 && !hasAnySelection()) {
    riskLevelDiv.textContent =
      "Silakan lengkapi penilaian untuk melihat tingkat risiko";
    riskLevelDiv.style.backgroundColor = "#f8f9fa";
    riskLevelDiv.style.color = "#666";
    return;
  }

  if (score >= 0 && score <= 24) {
    riskLevelDiv.textContent = `TINGKAT RISIKO: RENDAH (${score} poin)`;
    riskLevelDiv.style.backgroundColor = "#d4edda";
    riskLevelDiv.style.color = "#155724";
  } else if (score >= 25 && score <= 50) {
    riskLevelDiv.textContent = `TINGKAT RISIKO: SEDANG (${score} poin)`;
    riskLevelDiv.style.backgroundColor = "#fff3cd";
    riskLevelDiv.style.color = "#856404";
  } else if (score >= 51) {
    riskLevelDiv.textContent = `TINGKAT RISIKO: TINGGI (${score} poin)`;
    riskLevelDiv.style.backgroundColor = "#f8d7da";
    riskLevelDiv.style.color = "#721c24";
  }
}

function hasAnySelection() {
  const factors = [
    "fall_history",
    "secondary_diagnosis",
    "ambulatory_aid",
    "iv_therapy",
    "gait",
    "mental_status",
  ];

  return factors.some((factor) => {
    return document.querySelector(`input[name="${factor}"]:checked`);
  });
}
function submitToSheet() {
  const totalScore = document.getElementById("totalScore").textContent.replace(/\D/g, "") || "0";

  const data = {
    nama: document.getElementById("patientName").value,
    no_rm: document.getElementById("medicalRecord").value,
    tanggal: document.getElementById("assessmentDate").value,
    perawat: document.getElementById("nurseName").value,
    skor: totalScore,
    risiko: document.getElementById("riskLevel").textContent,
  };

  fetch("https://script.google.com/macros/s/AKfycbyl_-GZmQrQsB_b5SNuqqpR5MKaDPwvrQEUcdOHUH5jRtMlXaW4GpfSMVYP41XOVyJ0nQ/exec", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.text())
    .then((res) => {
      alert("✅ Data berhasil dikirim ke Google Sheets!");
    })
    .catch((err) => {
      alert("❌ Gagal mengirim data: " + err);
    });
}

