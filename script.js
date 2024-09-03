// Global variables
let day = 0;
let interval;
let predictedDays = 0;
let plantImages = [];
let currentCrop = 'strawberry';

// Crop-specific parameters
const cropParameters = {
    strawberry: {
        predictedDays: 60,
        temperature: 20,
        lightIntensity: 60,
        moisture: 70,
        humidity: 65,
        images: [
            "./2/1.png", "./2/2.png", "./2/3.png", "./2/4.png",
            "./2/5.png", "./2/6.png", "./2/7.png", "./2/8.png"
        ]
    },
    tomatoes: {
        predictedDays: 50,
        temperature: 25,
        lightIntensity: 70,
        moisture: 60,
        humidity: 70,
        images: [
            "./3/1.png", "./3/2.png", "./3/3.png", "./3/4.png",
            "./3/5.png", "./3/6.png", "./3/7.png", "./3/8.png"
        ]
    }
};

// DOM Elements
const elements = {
    temperature: document.getElementById('temperature'),
    lightIntensity: document.getElementById('lightIntensity'),
    moisture: document.getElementById('moisture'),
    humidity: document.getElementById('humidity'),
    window: document.getElementById('window'),
    fan: document.getElementById('fan'),
    predictedDays: document.getElementById('predictedDays'),
    plantImage: document.getElementById('plantImage'),
    dayCount: document.getElementById('dayCount'),
    growthStatus: document.getElementById('growthStatus'),
    cropSelect: document.getElementById('cropSelect'),
    startBtn: document.getElementById('startBtn'),
    stopBtn: document.getElementById('stopBtn')
};

// Actuator Elements
const actuators = {
    heater: document.getElementById('heaterStatus'),
    cooler: document.getElementById('coolerStatus'),
    humidifier: document.getElementById('humidifierStatus'),
    dehumidifier: document.getElementById('dehumidifierStatus'),
    irrigation: document.getElementById('irrigationStatus'),
    lights: document.getElementById('lightsStatus')
};

// Initialize the simulation
function initSimulation() {
    setParameters(currentCrop);
    attachEventListeners();
}

// Set parameters based on selected crop
function setParameters(crop) {
    const params = cropParameters[crop];
    predictedDays = params.predictedDays;
    plantImages = params.images;
    
    elements.temperature.textContent = params.temperature.toFixed(2);
    elements.lightIntensity.textContent = params.lightIntensity.toFixed(2);
    elements.moisture.textContent = params.moisture.toFixed(2);
    elements.humidity.textContent = params.humidity.toFixed(2);
    
    elements.predictedDays.textContent = `Predicted Days: ${predictedDays}`;
    
    updateDynamicParameters();
    updateActuatorsForNewCrop(params);
}

function updateActuatorsForNewCrop(params) {
    const temp = parseFloat(elements.temperature.textContent);
    const moisture = parseFloat(elements.moisture.textContent);
    const humidity = parseFloat(elements.humidity.textContent);
    const light = parseFloat(elements.lightIntensity.textContent);
    
    setActuatorStatus('heaterStatus', temp < params.temperature - 2);
    setActuatorStatus('coolerStatus', temp > params.temperature + 2);
    setActuatorStatus('humidifierStatus', humidity < params.humidity - 5);
    setActuatorStatus('dehumidifierStatus', humidity > params.humidity + 5);
    setActuatorStatus('irrigationStatus', moisture < params.moisture - 10);
    setActuatorStatus('lightsStatus', light < params.lightIntensity - 10);
}

// Update dynamic parameters
function updateDynamicParameters() {
    const params = cropParameters[currentCrop];
    ['Temperature', 'LightIntensity', 'Moisture', 'Humidity'].forEach(param => {
        const lowercaseParam = param.toLowerCase();
        const dynamicElement = document.getElementById(`dynamic${param}`);
        const initialElement = document.getElementById(lowercaseParam);
        if (dynamicElement && initialElement) {
            const initialValue = parseFloat(initialElement.textContent);
            const targetValue = params[lowercaseParam];
            const newValue = initialValue + (Math.random() - 0.5) * 2 * (targetValue * 0.1);
            dynamicElement.textContent = newValue.toFixed(2);
            
            updateIndicator(lowercaseParam, newValue, initialValue);
        }
    });
    
    updateActuators();
}

function updateIndicator(param, currentValue, initialValue) {
    const lowElement = document.getElementById(`${param}Low`);
    const highElement = document.getElementById(`${param}High`);
    if (lowElement && highElement) {
        const threshold = param === 'temperature' ? 2 : 5; // Different threshold for temperature
        lowElement.classList.toggle('active', currentValue < initialValue - threshold);
        highElement.classList.toggle('active', currentValue > initialValue + threshold);
    }
}

// Update actuators based on dynamic parameters
function updateActuators() {
    const params = cropParameters[currentCrop];
    const temp = parseFloat(document.getElementById('dynamicTemperature').textContent);
    const moisture = parseFloat(document.getElementById('dynamicMoisture').textContent);
    const humidity = parseFloat(document.getElementById('dynamicHumidity').textContent);
    const light = parseFloat(document.getElementById('dynamicLightLevel').textContent);
    
    setActuatorStatus('heaterStatus', temp < params.temperature - 2);
    setActuatorStatus('coolerStatus', temp > params.temperature + 2);
    setActuatorStatus('humidifierStatus', humidity < params.humidity - 5);
    setActuatorStatus('dehumidifierStatus', humidity > params.humidity + 5);
    setActuatorStatus('irrigationStatus', moisture < params.moisture - 10);
    setActuatorStatus('lightsStatus', light < params.lightIntensity - 10);
}
// Set actuator status
function setActuatorStatus(actuatorId, isOn) {
    const actuator = document.getElementById(actuatorId);
    if (actuator) {
        actuator.textContent = isOn ? 'On' : 'Off';
        actuator.closest('.actuator').classList.toggle('active', isOn);
    }
}

// Toggle actuator
function toggleActuator(actuatorId) {
    const actuator = document.getElementById(actuatorId);
    if (actuator) {
        const newStatus = actuator.textContent.trim() !== 'On';
        setActuatorStatus(actuatorId, newStatus);
    }
}
function setAllActuatorsOff() {
    Object.keys(actuators).forEach(actuator => setActuatorStatus(actuator + 'Status', false));
}

// Start simulation
function startSimulation() {
    stopSimulation(); // Reset if already running
    setAllActuatorsOff(); // Turn off all actuators before starting
    day = 0;
    updateSimulation();
    interval = setInterval(updateSimulation, 1000);
}

// Stop simulation
function stopSimulation() {
    clearInterval(interval);
    setAllActuatorsOff(); // Turn off all actuators when stopping
}

// Update simulation
function updateSimulation() {
    if (day >= predictedDays) {
        stopSimulation();
    } else {
        const imageIndex = Math.floor((day / (predictedDays - 1)) * (plantImages.length - 1));
        elements.plantImage.src = plantImages[imageIndex];
        elements.dayCount.innerText = `Day: ${day + 1}`;
        const growthPercentage = ((day + 1) / predictedDays) * 100;
        elements.growthStatus.innerText = `Crop Growth: ${growthPercentage.toFixed(2)}%`;
        day++;

        updateDynamicParameters();
    }
}

// Recalculate predicted days
function recalculatePredictedDays() {
    const params = cropParameters[currentCrop];
    let baseDays = params.predictedDays;
    
    const temp = parseFloat(elements.temperature.textContent);
    const light = parseFloat(elements.lightIntensity.textContent);
    const moisture = parseFloat(elements.moisture.textContent);
    
    if (temp > params.temperature + 5) baseDays -= 5;
    if (light > params.lightIntensity + 10) baseDays -= 5;
    if (moisture < params.moisture - 10) baseDays += 5;
    if (elements.window.textContent === "Closed") baseDays += 2;
    if (elements.fan.textContent === "Off") baseDays += 2;
    
    predictedDays = Math.max(baseDays, 1);
    elements.predictedDays.textContent = `Predicted Days: ${predictedDays}`;
}

// Update numeric parameter
function updateParameter(elementId, increment) {
    const element = document.getElementById(elementId);
    if (element) {
        let value = parseFloat(element.textContent) + increment;
        switch (elementId) {
            case 'temperature':
                value = Math.max(0, Math.min(40, value));
                break;
            case 'lightIntensity':
            case 'moisture':
            case 'humidity':
                value = Math.max(0, Math.min(100, value));
                break;
        }
        element.textContent = value.toFixed(2);
        recalculatePredictedDays();
    }
}

// Toggle state (window/fan)
function toggleState(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = element.textContent === "Closed" ? "Open" : "Closed";
        recalculatePredictedDays();
    }
}

// Attach event listeners
function attachEventListeners() {
    elements.cropSelect.addEventListener('change', () => {
        currentCrop = elements.cropSelect.value;
        setParameters(currentCrop);
    });
    
    elements.startBtn.addEventListener('click', startSimulation);
    elements.stopBtn.addEventListener('click', stopSimulation);
    
    document.querySelectorAll('.parameter-buttons button').forEach(button => {
        button.addEventListener('click', function() {
            const parameter = this.closest('.parameter').querySelector('.parameter-value').id;
            const increment = this.textContent === '+' ? 1 : -1;
            updateParameter(parameter, increment);
        });
    });
    
    document.querySelectorAll('.parameter button:not(.parameter-buttons button)').forEach(button => {
        button.addEventListener('click', function() {
            const parameter = this.closest('.parameter').querySelector('.parameter-value').id;
            toggleState(parameter);
        });
    });
    
    Object.keys(actuators).forEach(actuator => {
        const element = actuators[actuator];
        if (element) {
            element.closest('.actuator').addEventListener('click', () => toggleActuator(actuator + 'Status'));
        }
    });
}

// Initialize the simulation when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initSimulation();
    setAllActuatorsOff(); // Ensure all actuators are off at initial load
    elements.cropSelect.addEventListener('change', () => {
        currentCrop = elements.cropSelect.value;
        setParameters(currentCrop);
        // The setParameters function now includes actuator updates
    });
});