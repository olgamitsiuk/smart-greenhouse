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
        ],
        initialImage: "./2/1.png"  // Add initial image reference
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
        ],
        initialImage: "./3/1.png"  // Add initial image reference
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

// Dynamic Elements
const dynamicElements = {
    temperature: document.getElementById('dynamicTemperature'),
    lightIntensity: document.getElementById('dynamicLightLevel'),
    moisture: document.getElementById('dynamicMoisture'),
    humidity: document.getElementById('dynamicHumidity')
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
    
    // Set initial image when changing crops
    if (params.initialImage) {
        elements.plantImage.src = params.initialImage;
    }
    
    updateAllDynamicParameters();
    updateActuators();
}


// Update all dynamic parameters
function updateAllDynamicParameters() {
    Object.keys(dynamicElements).forEach(param => {
        updateDynamicParameter(param);
    });
}

// Update a single dynamic parameter
function updateDynamicParameter(param) {
    const initialElement = elements[param];
    const dynamicElement = dynamicElements[param];
    if (initialElement && dynamicElement) {
        const initialValue = parseFloat(initialElement.textContent);
        const targetValue = cropParameters[currentCrop][param];
        const deviation = targetValue * 0.1; // 10% deviation
        const newValue = initialValue + (Math.random() - 0.5) * 2 * deviation;
        dynamicElement.textContent = newValue.toFixed(2);
        
        updateIndicator(param, newValue, initialValue);
        
        // Log the update
        console.log(`Updated ${param}: ${newValue.toFixed(2)} (Initial: ${initialValue}, Target: ${targetValue})`);
    }
}

// Update indicator based on current and initial values
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
    const temp = parseFloat(dynamicElements.temperature.textContent);
    const moisture = parseFloat(dynamicElements.moisture.textContent);
    const humidity = parseFloat(dynamicElements.humidity.textContent);
    const light = parseFloat(dynamicElements.lightIntensity.textContent);
    
    console.log('Updating actuators:');
    console.log(`Temperature: ${temp} (Ideal: ${params.temperature})`);
    console.log(`Moisture: ${moisture} (Ideal: ${params.moisture})`);
    console.log(`Humidity: ${humidity} (Ideal: ${params.humidity})`);
    console.log(`Light: ${light} (Ideal: ${params.lightIntensity})`);

    setActuatorStatus('heater', temp < params.temperature - 2);
    setActuatorStatus('cooler', temp > params.temperature + 2);
    setActuatorStatus('humidifier', humidity < params.humidity - 5);
    setActuatorStatus('dehumidifier', humidity > params.humidity + 5);
    setActuatorStatus('irrigation', moisture < params.moisture - 10);
    
    // Simplified light actuator logic
    const lightsOn = light < params.lightIntensity;
    setActuatorStatus('lights', lightsOn);
    console.log(`Light actuator should be: ${lightsOn ? 'On' : 'Off'}`);
}
// Separate function to update light actuator
function updateLightActuator(currentLight, idealLight) {
    const lightThreshold = idealLight - 10;
    const shouldTurnOn = currentLight < lightThreshold;
    console.log(`Light actuator check: Current ${currentLight}, Ideal ${idealLight}, Threshold ${lightThreshold}, Should turn on: ${shouldTurnOn}`);
    setActuatorStatus('lights', shouldTurnOn);
}


// Set actuator status
function setActuatorStatus(actuatorId, isOn) {
    const actuator = document.getElementById(`${actuatorId}Status`);
    if (actuator) {
        actuator.textContent = isOn ? 'On' : 'Off';
        actuator.closest('.actuator').classList.toggle('active', isOn);
        console.log(`Actuator ${actuatorId} set to ${isOn ? 'On' : 'Off'}`);
    } else {
        console.error(`Actuator element not found for ID: ${actuatorId}Status`);
    }
}
// Update parameter
function updateParameter(param, increment) {
    const element = elements[param];
    if (element) {
        let value = parseFloat(element.textContent) + increment;
        switch (param) {
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
        
        // Update the ideal parameter in cropParameters
        cropParameters[currentCrop][param] = value;
        
        recalculatePredictedDays();
        updateDynamicParameter(param);
        updateActuators();
    }
}

// Recalculate predicted days
function recalculatePredictedDays() {
    const params = cropParameters[currentCrop];
    let baseDays = params.predictedDays;
    
    ['temperature', 'lightIntensity', 'moisture', 'humidity'].forEach(param => {
        const currentValue = parseFloat(dynamicElements[param].textContent);
        const targetValue = params[param];
        const deviation = Math.abs(currentValue - targetValue);
        
        if (deviation > targetValue * 0.1) { // If deviation is more than 10%
            baseDays += Math.floor(deviation / 5); // Add 1 day for every 5 units of deviation
        }
    });

    if (elements.window.textContent === "Closed") baseDays += 2;
    if (elements.fan.textContent === "Off") baseDays += 2;
    
    predictedDays = Math.max(baseDays, 1);
    elements.predictedDays.textContent = `Predicted Days: ${predictedDays}`;
}

// Toggle state (window/fan)
function toggleState(elementId) {
    const element = elements[elementId];
    if (element) {
        element.textContent = element.textContent === "Closed" ? "Open" : "Closed";
        recalculatePredictedDays();
        updateActuators();
    }
}

// Start simulation
function startSimulation() {
    stopSimulation(); // Reset if already running
    day = 0;
    updateDayAndGrowth();
    updateSimulation();
    interval = setInterval(updateSimulation, 1000);
    console.log('Simulation started');
}

// Stop simulation
function stopSimulation() {
    clearInterval(interval);
    Object.keys(actuators).forEach(actuator => setActuatorStatus(actuator, false));
    
    // Reset day count and growth
    day = 0;
    updateDayAndGrowth();
    
    // Reset plant image to initial state
    const initialImage = cropParameters[currentCrop].initialImage;
    if (initialImage) {
        elements.plantImage.src = initialImage;
    }
    
    console.log('Simulation stopped, growth and days reset to 0, main picture reset');
}

function updateDayAndGrowth() {
    elements.dayCount.innerText = `Day: ${day}`;
    const growthPercentage = (day / predictedDays) * 100;
    elements.growthStatus.innerText = `Crop Growth: ${growthPercentage.toFixed(2)}%`;
}

// Update simulation
function updateSimulation() {
    if (day >= predictedDays) {
        stopSimulation();
    } else {
        day++;
        const imageIndex = Math.floor((day / predictedDays) * (plantImages.length - 1));
        elements.plantImage.src = plantImages[imageIndex];
        
        updateDayAndGrowth();

        updateAllDynamicParameters();
        updateActuators();
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
            const increment = this.classList.contains('plus') ? 1 : -1;
            updateParameter(parameter, increment);
        });
    });
    
    document.querySelectorAll('.parameter button:not(.parameter-buttons button)').forEach(button => {
        button.addEventListener('click', function() {
            const parameter = this.closest('.parameter').querySelector('.parameter-value').id;
            toggleState(parameter);
        });
    });
    
}

// Initialize the simulation when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    initSimulation();
    attachEventListeners();
    console.log('Simulation initialized');
});