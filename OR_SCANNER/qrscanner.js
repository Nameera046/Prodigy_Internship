document.addEventListener('DOMContentLoaded', function() {
    const html5QrCode = new Html5Qrcode("reader");
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');
    const cameraSelect = document.getElementById('cameraSelect');
    const result = document.getElementById('result');
    const resultActions = document.getElementById('result-actions');
    const scanHistory = document.getElementById('scanHistory');
    let scanning = false;

    // Load available cameras
    Html5Qrcode.getCameras().then(devices => {
        cameraSelect.innerHTML = devices.map(device => 
            `<option value="${device.id}">${device.label}</option>`
        ).join('');
    }).catch(err => {
        console.error('Error getting cameras', err);
    });

    function startScanning() {
        const cameraId = cameraSelect.value;
        const config = {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
        };

        html5QrCode.start(
            cameraId, 
            config,
            onScanSuccess,
            onScanError
        ).then(() => {
            scanning = true;
            startButton.disabled = true;
            stopButton.disabled = false;
        });
    }

    function stopScanning() {
        html5QrCode.stop().then(() => {
            scanning = false;
            startButton.disabled = false;
            stopButton.disabled = true;
        });
    }

    function onScanSuccess(decodedText, decodedResult) {
        result.textContent = decodedText;
        addToHistory(decodedText);
        processQRContent(decodedText);
    }

    function onScanError(error) {
        console.warn(`QR Code scan error: ${error}`);
    }

    function processQRContent(content) {
        resultActions.innerHTML = '';

        // Check if content is a URL
        if (isValidURL(content)) {
            const openButton = createActionButton('Open Link', () => {
                window.open(content, '_blank');
            });
            resultActions.appendChild(openButton);
        }

        // Check if content is email
        if (content.includes('@')) {
            const mailButton = createActionButton('Send Email', () => {
                window.location.href = `mailto:${content}`;
            });
            resultActions.appendChild(mailButton);
        }

        // Add copy button for all content
        const copyButton = createActionButton('Copy', () => {
            navigator.clipboard.writeText(content);
            alert('Content copied to clipboard!');
        });
        resultActions.appendChild(copyButton);
    }

    function createActionButton(text, onClick) {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = 'action-button';
        button.addEventListener('click', onClick);
        return button;
    }

    function addToHistory(content) {
        const li = document.createElement('li');
        const timestamp = new Date().toLocaleTimeString();
        li.innerHTML = `
            <span>${content}</span>
            <small>${timestamp}</small>
        `;
        scanHistory.insertBefore(li, scanHistory.firstChild);
    }

    function isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }

    startButton.addEventListener('click', startScanning);
    stopButton.addEventListener('click', stopScanning);
});