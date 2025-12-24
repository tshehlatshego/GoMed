function submitPrescription() {
    const fileInput = document.getElementById("prescriptionFile");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload your prescription before continuing.");
        return;
    }

    // Backend / Firebase / Pharmacist verification will be added later
    alert("Prescription uploaded successfully!");

    // Example next step:
    // window.location.href = "confirmation.html";
}

