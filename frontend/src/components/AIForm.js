// src/components/AIForm.js
import React, { useState, useRef } from 'react';
import '../styles/AIForm.css'; // Importă fișierul CSS din folderul styles

const AIForm = () => {
    const [inputData, setInputData] = useState('');
    const [sourceLanguage, setSourceLanguage] = useState('ro');
    const [targetLanguage, setTargetLanguage] = useState('en');
    const [translations, setTranslations] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [audioURL, setAudioURL] = useState('');
    const mediaRecorderRef = useRef(null);

    // Funcții pentru gestionarea schimbărilor
    const handleSourceLanguageChange = (e) => setSourceLanguage(e.target.value);
    const handleTargetLanguageChange = (e) => setTargetLanguage(e.target.value);
    const handleInputChange = (e) => setInputData(e.target.value);

    // Funcția pentru trimiterea textului pentru traducere
    const handleTranslationSubmit = async () => {
        try {
            const response = await fetch('http://localhost:5000/ai-endpoint', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ data: inputData, sourceLanguage, targetLanguage }),
            });
            const data = await response.json();
            setTranslations((prev) => [...prev, { original: inputData, translated: data.generated_text }]);
            setInputData('');
        } catch (error) {
            console.error('Eroare la comunicarea cu serverul:', error);
        }
    };

    // Funcții pentru înregistrare audio
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.start();

            mediaRecorderRef.current.ondataavailable = (event) => {
                const audioBlob = new Blob([event.data], { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudioURL(audioUrl);
            };
            setIsRecording(true);
        } catch (error) {
            console.error('Eroare la începutul înregistrării:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const handlePlayAudio = () => {
        const audio = new Audio(audioURL);
        audio.play();
    };

    const handleSpeakText = (text) => {
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    };

    return (
        <div className="container">
            <div>
                <label>
                    Limba vorbită:
                    <select value={sourceLanguage} onChange={handleSourceLanguageChange}>
                        <option value="ro">Română</option>
                        <option value="en">Engleză</option>
                        <option value="fr">Franceză</option>
                        <option value="de">Germană</option>
                    </select>
                </label>
            </div>

            <div>
                <label>
                    Limba de traducere:
                    <select value={targetLanguage} onChange={handleTargetLanguageChange}>
                        <option value="en">Engleză</option>
                        <option value="ro">Română</option>
                        <option value="fr">Franceză</option>
                        <option value="de">Germană</option>
                    </select>
                </label>
            </div>

            <textarea
                rows="4"
                cols="50"
                value={inputData}
                onChange={handleInputChange}
                placeholder="Introduceți textul aici..."
            ></textarea>

            <button onClick={handleTranslationSubmit}>Trimite</button>

            <div>
                <h2>Conversația:</h2>
                <ul>
                    {translations.map((entry, index) => (
                        <li key={index}>
                            <strong>{entry.original}</strong> - {entry.translated}
                            <button onClick={() => handleSpeakText(entry.translated)}>Vorbește</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>Înregistrare audio:</h2>
                <button onClick={isRecording ? stopRecording : startRecording}>
                    {isRecording ? 'Oprește înregistrarea' : 'Înregistrează'}
                </button>
                {audioURL && (
                    <div>
                        <audio controls src={audioURL}></audio>
                        <button onClick={handlePlayAudio}>Redă audio</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIForm;
