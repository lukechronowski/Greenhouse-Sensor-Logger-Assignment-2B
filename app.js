(function () {
    "use strict";

    const STORAGE_KEY = "greenhouse_sensor_records";
    const sensorForm = document.getElementById("sensor-form");
    const errorBanner = document.getElementById("form-error-banner");
    const recordsList = document.getElementById("records-list");
    const logCount = document.getElementById("log-count");
    const emptyState = document.getElementById("empty-state");
    const inputBayId = document.getElementById("bayId");
    const inputTemp = document.getElementById("temp");
    const inputHumidity = document.getElementById("humidity");
    const inputEc = document.getElementById("ec");
    const inputPh = document.getElementById("pH");
    const clearAllButton = document.getElementById("btn-clear-all");

    let records = loadRecords();

    render();

    function loadRecords() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error("Failed to load records from localStorage", error);
            return [];
        }
    }

    function saveRecords() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
        } catch (error) {
            console.error("Failed to write to localStorage", error);
        }
    }

    function evaluateStatus(pH, ec, temp, humidity) {
        if ((pH > 7.5 || pH < 5.5) || (ec > 2.0 || ec < 1.0) || (temp < 60 || temp > 88) || (humidity < 40 || humidity > 72)) {
            return {level: "critical", label: "Critical"};
        }
        if ((pH >= 6.0 && pH <= 7.0) && (ec >= 1.0 && ec <= 1.6) && (temp >= 68 && temp <= 82) && (humidity >= 55 && humidity <= 69)) {
            return {level: "optimal", label: "Optimal"};
        }
        return {level: "warning", label: "Warning"};
    }
 
    function validateInput(data) {
        const errors = [];
        if (!data.bayId.trim()) {
            errors.push("Bay ID is required.");
        }
        if (isNaN(data.pH) || data.pH < 0 || data.pH > 14) {
            errors.push("pH must be a number between 0 to 14.");
        }
        if (isNaN(data.ec) || data.ec < 0 || data.ec > 6) {
            errors.push("EC must be a number between 0 and 6 mS/cm.");
        }
        if (isNaN(data.temp) || data.temp < 0 || data.temp > 120) {
            errors.push("Temperature must be a number between 0 and 120 °F.");
        }
        if (isNaN(data.humidity) || data.humidity < 0 || data.humidity > 100) {
            errors.push("Humidity must be a number between 0 and 100%.");
        }
        return errors;
    }

    sensorForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = {
            id: crypto.randomUUID(),
            bayId: inputBayId.value,
            pH: parseFloat(inputPh.value),
            ec: parseFloat(inputEc.value),
            temp: parseFloat(inputTemp.value),
            humidity: parseFloat(inputHumidity.value),
            timestamp: new Date().toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"}),
        };

        const validationErrors = validateInput(formData);
        if (validationErrors.length > 0) {
            displayError(validationErrors.join(" "));
            return;
        }
        hideError();
        formData.status = evaluateStatus(formData.pH, formData.ec, formData.temp, formData.humidity);
        records.unshift(formData);
        saveRecords();
        render();
        sensorForm.reset();
        inputBayId.focus();
    });
    
    recordsList.addEventListener("click", (event) => {
        const target = event.target;
        if (target.classList.contains("btn-delete")) {
            const recordId = target.dataset.id;
            records = records.filter(function (record) {
                return record.id !== recordId;
            });
            saveRecords();
            render();
        }
    });

    clearAllButton.addEventListener("click", () => {
        records = [];
        saveRecords();
        render();
    });

    function render() {
        logCount.textContent = records.length;
        if (records.length === 0) {
            emptyState.classList.remove("hidden");
            recordsList.innerHTML = "";
            return;
        }

        emptyState.classList.add("hidden");
        const fragment = document.createDocumentFragment();
        records.forEach(function (rec) {
            const li = document.createElement("li");
            li.className = "sensor-record status-" + rec.status.level;
            li.innerHTML = `<div class="records-header">
                    <div>
                        <div class="bay-name">${escapeHtml(rec.bayId)} </div>
                        <div class="timestamp">Logged at ${rec.timestamp} </div>
                        <span class="status-tag ${rec.status.level}">${rec.status.label} </span>
                    </div>
                    <div class="sensor-stats">
                        <div class="stat-item"><span>pH</span>${rec.pH}</div>
                        <div class="stat-item"><span>EC</span>${rec.ec} mS/cm </div>
                        <div class="stat-item"><span>Humidity</span>${rec.humidity}% </div>
                        <div class="stat-item"><span>Temperature</span>${rec.temp.toFixed(1)} °F </div>
                    </div>
                    <button class="btn btn-outline-danger btn-sm btn-delete" data-id="${rec.id}">Delete</button>
                </div>`;
                fragment.appendChild(li);
        })
        recordsList.innerHTML = "";
        recordsList.appendChild(fragment);
    }
    function displayError(message) {
        errorBanner.textContent = message;
        errorBanner.classList.remove("hidden");
    }
    function hideError() {
        errorBanner.textContent = "";
        errorBanner.classList.add("hidden");
    }
    function escapeHtml(str) {
        return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
    }

})();
