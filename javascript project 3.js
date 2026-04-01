let chart = null;

// DOM ELEMENTS
const stepsEl = document.getElementById("steps");
const waterEl = document.getElementById("water");
const screenEl = document.getElementById("screen");
const exerciseEl = document.getElementById("exercise");

const scoreEl = document.getElementById("score");
const progressEl = document.getElementById("progress");
const errorEl = document.getElementById("error");

// VALIDATION
function valid(v, min, max) {
    return !isNaN(v) && v >= min && v <= max;
}

// MAIN FUNCTION
function analyze() {
    let steps = parseInt(stepsEl.value);
    let water = parseFloat(waterEl.value);
    let screen = parseFloat(screenEl.value);
    let exercise = parseInt(exerciseEl.value);

    if (!valid(steps,0,50000) || !valid(water,0,10) ||
        !valid(screen,0,24) || !valid(exercise,0,300)) {
        errorEl.innerText = "⚠️ Please enter valid values!";
        return;
    }

    errorEl.innerText = "";

    let score = 0;
    score += Math.min((steps/10000)*30,30);
    score += Math.min((water/3)*20,20);
    score += Math.min((exercise/60)*30,30);
    score -= Math.min((screen/8)*20,20);

    score = Math.max(score,0);

    scoreEl.innerText = "💯 " + score.toFixed(1);
    progressEl.style.width = score + "%";

    saveHistory(score);
    updateChart();
    aiSuggestions(steps, water, screen, exercise);
}

// SAVE HISTORY
function saveHistory(score) {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.push(score);
    if (history.length > 7) history.shift();
    localStorage.setItem("history", JSON.stringify(history));
}

// GRAPH
function updateChart() {
    let data = JSON.parse(localStorage.getItem("history")) || [];

    let ctx = document.getElementById("chart");

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["1","2","3","4","5","6","7"],
            datasets: [{
                label: "Score",
                data: data
            }]
        }
    });
}

// AI SUGGESTIONS
function aiSuggestions(steps, water, screen, exercise) {
    let tips = [];

    if (steps < 5000) tips.push("🚶 Walk more");
    if (water < 2) tips.push("💧 Drink more water");
    if (screen > 6) tips.push("📵 Reduce screen time");
    if (exercise < 30) tips.push("🏃 Exercise more");

    if (tips.length === 0) tips.push("🔥 Excellent lifestyle!");

    document.getElementById("aiTips").innerHTML = tips.join("<br>");
}

// BMI
function calculateBMI() {
    let h = parseFloat(document.getElementById("height").value);
    let w = parseFloat(document.getElementById("weight").value);

    if (!h || !w) {
        document.getElementById("bmiResult").innerText = "⚠️ Enter valid data";
        return;
    }

    h = h / 100;
    let bmi = (w / (h*h)).toFixed(1);

    let status = bmi < 18.5 ? "Underweight" :
                 bmi < 25 ? "Normal" :
                 bmi < 30 ? "Overweight" : "Obese";

    document.getElementById("bmiResult").innerText =
        `BMI: ${bmi} (${status})`;
}

// REMINDER
function setReminder() {
    let time = document.getElementById("reminderTime").value;
    if (!time) return alert("Select time!");

    localStorage.setItem("reminderTime", time);
    document.getElementById("reminderStatus").innerText = "Reminder set!";
}

// CHECK REMINDER
setInterval(()=>{
    let saved = localStorage.getItem("reminderTime");
    if(!saved) return;

    let now = new Date();
    let current = now.toTimeString().slice(0,5);

    if(current === saved){
        alert("⏰ Reminder!");
    }
},60000);

// NUTRITION
function showNutrition() {
    document.getElementById("nutritionTips").innerHTML =
        "🥗 Eat veggies<br>🍎 Fruits<br>💧 Water<br>🍗 Protein";
}

// DARK MODE
function toggleDarkMode() {
    document.body.classList.toggle("dark");
}

// LOAD GRAPH ON START
window.onload = updateChart;