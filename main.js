const run = () => {
	console.log("REEEEEEeeeeeeeeeeeeee UWU");
	const SpeechRecognition = window.SpeechRecognition || webkitSpeechRecognition;
	const SpeechGrammarList = window.SpeechGrammarList || webkitSpeechGrammarList
	const SpeechRecognitionEvent = window.SpeechRecognitionEvent || webkitSpeechRecognitionEvent;

	const recognition = new SpeechRecognition();
	recognition.continuous = true;
	recognition.lang = 'en-US';
	recognition.interimResults = true;
	recognition.maxAlternatives = 1;

	const diagnostic = document.querySelector('.output');
	const bg = document.querySelector('html');

	let voices = [];
	const voiceSelect = document.getElementById("voice-select");
	window.speechSynthesis.addEventListener("voiceschanged", () => {
		voices = window.speechSynthesis.getVoices();
		console.log(voices);
		for (const voiceId in voices) {
			const voice = voices[voiceId];
			const option = document.createElement("option");
			option.innerText = voice.name;
			if (voice.default) {
				option.innerText += " (default)";
			}
			option.setAttribute("data-id", voiceId);
			voiceSelect.appendChild(option);
		}
	});

	let running = false;
	const startButton = document.getElementById("start");
	startButton.addEventListener("click", () => {
		if (running) {
			startButton.innerText = "start";
			recognition.stop();
			console.log("Stopping TTS.");
		} else {
			startButton.innerText = "stop";
			recognition.start();
			console.log("Ready to do text-to-speach.");
		}
		running = !running;
	});

	const pitchSlider = document.getElementById("pitch");
	pitchSlider.addEventListener("change", ev => document.getElementById("pitch-value").innerText = pitchSlider.value);
	const speedSlider = document.getElementById("speed");
	speedSlider.addEventListener("change", ev => document.getElementById("speed-value").innerText = speedSlider.value);
	recognition.addEventListener("result", () => {
		console.log("result", event.results);
		const result = event.results[event.results.length-1];
		let text = "";
		for (const line of result) {
			text += line.transcript;
		}
		if (result.isFinal) {
			const utterance = new SpeechSynthesisUtterance(text);
			utterance.voice = voices[voiceSelect.selectedOptions[0].getAttribute('data-id')];
			utterance.pitch = pitchSlider.value;
			utterance.rate = speedSlider.value;
			window.speechSynthesis.speak(utterance);
			document.getElementById("output").style.backgroundColor = "green";
		} else {
			document.getElementById("output").style.backgroundColor = "yellow";
		}
		document.getElementById("output").innerText = text;
	});
};

window.addEventListener("load", () => setTimeout(run, 100));
