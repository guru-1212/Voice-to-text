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
    recognition.lang = 'en-US'; // Set language to English
    recognition.continuous = true; // Keep recording continuously
    recognition.interimResults = true; // Show partial results while speaking

    let isRecognitionActive = false;
    let lastResultTime = Date.now();

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            // Optional: Create an AudioContext if additional processing is needed
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContext.createMediaStreamSource(stream);

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
                    const currentTime = Date.now();
                    const timeDifference = currentTime - lastResultTime;

                    if (event.results[i].isFinal) {
                        // Add a new line if there was a 3-second pause
                        if (timeDifference > 3000) {
                            finalText += '<br>' + transcript;
                        } else {
                            finalText += transcript + ' ';
                        }
                        lastResultTime = currentTime;
                    } else {
                        interimText += transcript;
                    }
                }

                output.innerHTML += finalText + '<i>' + interimText + '</i>';
            };

            recognition.onerror = function (event) {
                console.error("Speech recognition error detected: " + event.error);
            };

            recognition.onend = function () {
                if (isRecognitionActive) {
                    recognition.start(); // Restart the recognition if it was manually stopped
                    console.log("Speech recognition restarted.");
                }
            };
        })
        .catch(error => {
            console.error("Error accessing media devices.", error);
        });
};
