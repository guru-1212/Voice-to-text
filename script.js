window.onload = function () {
    const startBtn = document.getElementById("start-btn");
    const stopBtn = document.getElementById("stop-btn");
    const output = document.getElementById("output");

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Sorry, your browser does not support the Web Speech API. Please try using Google Chrome.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // Transcribe everything to English
    recognition.continuous = true; // Keep recording continuously
    recognition.interimResults = true; // Show partial results while speaking

    let isRecognitionActive = false;

    startBtn.addEventListener("click", () => {
        if (!isRecognitionActive) {
            recognition.start();
            isRecognitionActive = true;
            console.log("Speech recognition started.");
        }
    });

    stopBtn.addEventListener("click", () => {
        if (isRecognitionActive) {
            recognition.stop();
            isRecognitionActive = false;
            console.log("Speech recognition stopped.");
        }
    });

    recognition.onresult = function (event) {
        let interimText = '';
        let finalText = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;

            if (event.results[i].isFinal) {
                finalText += transcript + ' ';
            } else {
                interimText += transcript;
            }
        }

        output.innerHTML += finalText + '<i>' + interimText + '</i>';
        output.scrollTop = output.scrollHeight; // Auto-scroll to the bottom
    };

    recognition.onerror = function (event) {
        console.error("Speech recognition error detected: " + event.error);
    };

    recognition.onend = function () {
        if (isRecognitionActive) {
            recognition.start(); // Restart recognition to keep it running
        }
    };
};
