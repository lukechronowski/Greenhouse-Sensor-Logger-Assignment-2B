# Assignment 2B
## Greenhouse Sensor Logger UI
### Section 4.1: The Less-than-equal-4-Click User Journey Funnel

- **Starting State:** User sees the Greenhouse Sensor Logger interface containing a header, a sensor input form for recording greenhouse telemetry readings, and a log history section displaying previously saved readings retrieved from localStorage. If no readings have been recorded, the log history section displays an empty-state message.
- **Action 1:** User enters the greenhouse bay identifier and sensor readings (pH, EC, temperature, and humidity) into the input form. JavaScript event listeners monitor the numeric inputs and provide immediate visual feedback when values fall outside acceptable ranges.
- **Action 2:** User clicks the "Record Reading" button to submit the sensor readings. JavaScript validates the submitted values, calculates the environmental status, and saves the reading to localStorage if all inputs are valid.
- **Action 3:** User sees the submitted reading appear in the telemetry log history with its corresponding environmental status tag ("Optimal", "Warning", or "Critical Hazard"). The active log counter updates to reflect the new entry.
- **Action 4:** User can delete individual telemetry records or click "Purge Log History" to remove all recorded entries. JavaScript updates the displayed log history and localStorage to reflect these changes.
- **Terminal State:** User sees the updated telemetry log history containing the remaining recorded readings and their environmental status tags. The readings are retained in localStorage so they remain available after refreshing the webpage.

### Section 4.2: Don Norman Usability & Constraint Audit

| Norman Principle / Concept | System Context | Questions to Answer Using Concrete Implementation Mechanism (DOM / HTML / JS) |
| --- | --- | --- |
| Gulf of Execution | Typing numeric sensor metrics (pH, ElectricalConductivity[EC], Temp, Humidity) | The `<label>` element identifies each sensor metric and its unit of measurement. The `<input>` element allows users to enter sensor readings, while the `placeholder` attribute provides an example of the expected input. |
| Gulf of Evaluation | Ingesting sensor values after clicking "Record Reading" | JavaScript calculates the environmental status and dynamically displays a corresponding status tag ("Optimal", "Warning", or "Critical Hazard") in the telemetry log history after submission. |
| System Constraint | E.g. Water pH Boundaries (0.0 <= pH <= 14.0) | The `type="number"`, `min`, `max`, `step`, and `required` attributes define acceptable input values. JavaScript validates these constraints before recording readings to prevent invalid values from entering the stored data. |
| Visual Feedback State | Real-Time Input Error / Out-of-Bounds | JavaScript event listeners attached to the `<input>` elements detect values outside acceptable ranges and apply a CSS class to the corresponding input field, changing its border color and displaying a warning message before submission. |
| Error Recovery | Accidental or test data submissions | Each recorded sensor reading has an individual "Delete" button that allows users to remove specific telemetry records, while the "Purge Log History" button removes all recorded readings. JavaScript click event listeners attached to these buttons update the displayed log history and `localStorage` accordingly. |

### Section 4.3: Component, DOM Tree & Event Target Architecture

```

index.html
<body> [STATIC] (CSS: flex, column)
|
|-- <header class="portal-header"> [STATIC]
|   |-- <div class="header-content"> [STATIC] (CSS: flex, space-between, center)
|   |   |-- <h1> (Greenhouse Sensor Logger) [STATIC]
|   |   |-- <p> (Active Logs) [STATIC]
|   |   |-- <span id="log-count"> [STATIC, JS-updated]
|
|-- <main class="portal-container"> [STATIC] (CSS: grid, columns 380px 1fr, gap 2rem)
|   |
|   |-- <aside class="panel form-panel"> [STATIC]
|   |   |-- <h2> (Record Sensor Reading) [STATIC]
|   |   |-- <p id="form-error"> [STATIC, JS-updated]
|   |   |
|   |   |-- <form id="sensor-form" novalidate> [STATIC] (Event: submit)
|   |   |   |
|   |   |   |-- <div class="form-group"> [STATIC] (CSS: flex, column)
|   |   |   |   |-- <label for="bayId"> (Greenhouse Bay) [STATIC]
|   |   |   |   |-- <input type="text" name="bayId" id="bayId" placeholder="e.g. Bay A1" required> [STATIC]
|   |   |   |
|   |   |   |-- <div class="form-row"> [STATIC] (CSS: flex, row)
|   |   |   |   |-- <div class="form-group"> [STATIC] (CSS: flex, column)
|   |   |   |   |   |-- <label for="pH"> (pH Level) [STATIC]
|   |   |   |   |   |-- <input type="number" name="pH" id="pH" min="0" max="14" step="0.1" placeholder="6.0" required> [STATIC] (Event: input; JS toggles .input-invalid)
|   |   |   |   |
|   |   |   |   |-- <div class="form-group"> [STATIC] (CSS: flex, column)
|   |   |   |       |-- <label for="ec"> (EC, mS/cm) [STATIC]
|   |   |   |       |-- <input type="number" name="ec" id="ec" min="0" max="6" step="0.1" placeholder="1.5" required> [STATIC] (Event: input; JS toggles .input-invalid)
|   |   |   |
|   |   |   |-- <div class="form-row"> [STATIC] (CSS: flex, row)
|   |   |   |   |-- <div class="form-group"> [STATIC] (CSS: flex, column)
|   |   |   |   |   |-- <label for="temp"> (Temperature, °F) [STATIC]
|   |   |   |   |   |-- <input type="number" name="temp" id="temp" min="0" max="120" step="0.1" placeholder="68.0" required> [STATIC] (Event: input; JS toggles .input-invalid)
|   |   |   |   |
|   |   |   |   |-- <div class="form-group"> [STATIC] (CSS: flex, column)
|   |   |   |       |-- <label for="humidity"> (Relative Humidity, %) [STATIC]
|   |   |   |       |-- <input type="number" name="humidity" id="humidity" min="0" max="100" step="0.1" placeholder="60.0" required> [STATIC] (Event: input; JS toggles .input-invalid)
|   |   |   |
|   |   |   |-- <button type="submit" id="btn-submit" class="btn btn-primary btn-block"> (Record Reading) [STATIC]
|   |
|   |-- <section class="panel records-panel"> [STATIC]
|   |   |-- <header class="records-header"> [STATIC] (CSS: flex, space-between, center)
|   |   |   |-- <h2> (Telemetry Log History) [STATIC]
|   |   |   |-- <button type="button" id="btn-clear-all" class="btn btn-outline-danger"> (Purge Log History) [STATIC] (Event: click)
|   |   |
|   |   |-- <p id="empty-state"> (No readings recorded) [STATIC, JS-updated]
|   |   |
|   |   |-- <ul id="records-list" class="records-grid"> [STATIC] (CSS: grid, auto-fill columns)
|   |   |   |
|   |   |   |-- <li class="sensor-record"> [DYNAMIC] (CSS: flex, column)
|   |   |   |   |-- <header class="record-header"> [DYNAMIC] (CSS: flex, space-between)
|   |   |   |   |   |-- <h3> (Greenhouse Bay Identifier) [DYNAMIC]
|   |   |   |   |   |-- <span class="timestamp"> (Date and Time) [DYNAMIC]
|   |   |   |   |
|   |   |   |   |-- <span class="status-tag"> (Optimal / Warning / Critical Hazard) [DYNAMIC]
|   |   |   |   |
|   |   |   |   |-- <section class="sensor-stats"> [DYNAMIC] (CSS: grid, two columns)
|   |   |   |   |   |-- <p> (pH Reading) [DYNAMIC]
|   |   |   |   |   |-- <p> (EC Reading) [DYNAMIC]
|   |   |   |   |   |-- <p> (Temperature Reading) [DYNAMIC]
|   |   |   |   |   |-- <p> (Humidity Reading) [DYNAMIC]
|   |   |   |   |
|   |   |   |   |-- <button type="button" class="btn btn-outline-danger btn-sm"> (Delete) [DYNAMIC] (Event: click)
|
|-- <footer class="portal-footer"> [STATIC]
|   |-- <p> (© 2026 Greenhouse Sensor Logger. All rights reserved.) [STATIC]
</body>

```

### Section 4.4: Data Schema

```

const sensorReadingSchema = {
    id: "String",          // Unique identifier for each record
    bayId: "String",       // Greenhouse bay identifier
    pH: "Number",          // pH reading (0 to 14)
    ec: "Number",          // Electrical conductivity (mS/cm)
    temp: "Number",        // Air temperature (°F)
    humidity: "Number",    // Relative humidity (%)
    status: "String",      // Optimal, Warning, or Critical Hazard
    timestamp: "String"    // Date and time of recorded reading
};

```
