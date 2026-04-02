let otp;
let chart;

/* LOGIN PROTECTION */
if (window.location.pathname.includes("app.html")) {
    if (!localStorage.getItem("user")) {
        window.location.href = "index.html";
    }
}

/* OTP */
function sendOTP() {
    let id = document.getElementById("identifier").value;

    if (!id) {
        authError.innerText = "Enter email/mobile!";
        return;
    }

    otp = Math.floor(1000 + Math.random() * 9000);
    otpDisplay.innerText = "Demo OTP: " + otp;

    document.getElementById("otpSection").style.display = "block";
}

function verifyOTP() {
    if (otpInput.value == otp) {
        localStorage.setItem("user", "true");
        window.location.href = "app.html";
    } else {
        authError.innerText = "Invalid OTP!";
    }
}

/* LOGOUT */
function logout() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}

/* PAGE SWITCH */
function showPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");

    if (id === "graph") drawChart();
}

/* DEFAULT PAGE */
window.onload = () => showPage("home");

/* ANALYZE (FIXED BUG HERE) */
function analyze() {
    let s = Number(document.getElementById("steps").value);
    let w = Number(document.getElementById("water").value);
    let sc = Number(document.getElementById("screen").value);
    let e = Number(document.getElementById("exercise").value);

    if (s <= 0 || w <= 0 || sc < 0 || e <= 0) {
        document.getElementById("error").innerText = "Enter valid values!";
        return;
    }

    document.getElementById("error").innerText = "";

    let score = Math.min((s/10000)*30,30) +
                Math.min((w/3)*20,20) +
                Math.min((e/60)*30,30) -
                Math.min((sc/8)*20,20);

    score = Math.max(0, score);

    document.getElementById("score").innerText = "Score: " + score.toFixed(1);
    document.getElementById("progress").style.width = score + "%";

    saveHistory(score);
    showTips(s,w,sc,e);
}

/* SAVE HISTORY */
function saveHistory(score) {
    let data = JSON.parse(localStorage.getItem("history")) || [];
    data.push(score);
    if (data.length > 7) data.shift();
    localStorage.setItem("history", JSON.stringify(data));
}

/* GRAPH */
function drawChart() {
    let ctx = document.getElementById("chart");

    let data = JSON.parse(localStorage.getItem("history")) || [];

    if (chart) chart.destroy();

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: ["1","2","3","4","5","6","7"],
            datasets: [{
                label: "Health Score",
                data: data,
                borderColor: "#22c55e"
            }]
        }
    });
}

/* AI */
function showTips(s,w,sc,e) {
    let tips = [];

    if (s < 5000) tips.push("🚶 Walk more");
    if (w < 2) tips.push("💧 Drink water");
    if (sc > 6) tips.push("📵 Reduce screen");
    if (e < 30) tips.push("🏃 Exercise");

    if (tips.length === 0) tips.push("🔥 Great job!");

    document.getElementById("aiTips").innerHTML = tips.join("<br>");
}

/* BMI */
function calculateBMI() {
    let h = document.getElementById("height").value / 100;
    let w = document.getElementById("weight").value;

    if (!h || !w || h <= 0 || w <= 0) {
        bmiResult.innerText = "Invalid input";
        return;
    }

    let bmi = (w / (h*h)).toFixed(1);

    let msg = bmi < 18.5 ? "Underweight ⚠️"
            : bmi < 25 ? "Normal ✅"
            : bmi < 30 ? "Overweight ⚠️"
            : "Obese 🚨";

    bmiResult.innerText = `BMI: ${bmi} (${msg})`;
}

/* NUTRITION */
function showNutrition() {
    nutritionTips.innerHTML =
    "🍎 Fruits<br>🥗 Vegetables<br>🍗 Protein<br>💧 Water";
}