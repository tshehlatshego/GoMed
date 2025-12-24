function confirmCollection() {
    const location = document.getElementById("location").value;
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;

    if (!location || !date || !time) {
        alert("Please complete all fields before confirming.");
        return;
    }

    alert(
        "Collection appointment confirmed!\n\n" +
        "Location: " + location + "\n" +
        "Date: " + date + "\n" +
        "Time: " + time
    );

    // Backend / calendar integration can be added later
}
