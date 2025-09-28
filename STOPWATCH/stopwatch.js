document.addEventListener('DOMContentLoaded', function() {
    const minutesDisplay = document.getElementById('minutes');
    const secondsDisplay = document.getElementById('seconds');
    const millisecondsDisplay = document.getElementById('milliseconds');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const lapList = document.getElementById('lapList');

    let intervalId = null;
    let startTime = 0;
    let elapsedTime = 0;
    let lapCount = 0;

    function startStopwatch() {
        startTime = Date.now() - elapsedTime;
        intervalId = setInterval(updateDisplay, 10);
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
    }

    function pauseStopwatch() {
        clearInterval(intervalId);
        elapsedTime = Date.now() - startTime;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }

    function resetStopwatch() {
        clearInterval(intervalId);
        elapsedTime = 0;
        lapCount = 0;
        updateDisplay();
        lapList.innerHTML = '';
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
    }

    function updateDisplay() {
        const currentTime = Date.now() - startTime;
        const minutes = Math.floor(currentTime / 60000);
        const seconds = Math.floor((currentTime % 60000) / 1000);
        const milliseconds = Math.floor((currentTime % 1000) / 10);

        minutesDisplay.textContent = padNumber(minutes);
        secondsDisplay.textContent = padNumber(seconds);
        millisecondsDisplay.textContent = padNumber(milliseconds);
    }

    function padNumber(number) {
        return number.toString().padStart(2, '0');
    }

    function addLap() {
        if (!intervalId) return;
        
        lapCount++;
        const lapTime = `${minutesDisplay.textContent}:${secondsDisplay.textContent}:${millisecondsDisplay.textContent}`;
        const lapItem = document.createElement('li');
        lapItem.textContent = `Lap ${lapCount}: ${lapTime}`;
        lapList.insertBefore(lapItem, lapList.firstChild);
    }

    startBtn.addEventListener('click', startStopwatch);
    pauseBtn.addEventListener('click', pauseStopwatch);
    resetBtn.addEventListener('click', resetStopwatch);
    document.addEventListener('keypress', function(e) {
        if (e.code === 'Space') {
            addLap();
        }
    });
});