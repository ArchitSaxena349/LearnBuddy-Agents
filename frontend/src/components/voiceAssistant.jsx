import { useState, useEffect, useRef } from 'react';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || null;

export default function VoiceAssistant({ onResult, voiceEnabled, setVoiceEnabled, target = 'general' }) {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);
  // keep latest transcript in a ref to avoid stale closures in event handlers
  const transcriptRef = useRef('');

  useEffect(() => {
    if (!SpeechRecognition) return;
    const recog = new SpeechRecognition();
    recog.lang = 'en-US';
    recog.interimResults = true;
    recog.maxAlternatives = 1;

    recog.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) final += res[0].transcript;
        else interim += res[0].transcript;
      }
      const latest = final ? final : interim;
      transcriptRef.current = latest;
      setTranscript(latest);

      // if we have a final result, stop recognition so onend fires and parent gets notified
      if (final) {
        try {
          recog.stop();
        } catch (e) {
          // ignore
        }
      }
    };

    recog.onend = () => {
      setListening(false);
      // deliver final transcript from ref to avoid stale state
      const finalText = transcriptRef.current || transcript;
      if (finalText && onResult) onResult(finalText.trim(), target);
    };

    recog.onerror = (e) => {
      console.error('SpeechRecognition error', e);
      setListening(false);
    };

    recognitionRef.current = recog;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleListen = () => {
    if (!SpeechRecognition) {
      alert('SpeechRecognition not supported in this browser. Try Chrome.');
      return;
    }

    const recog = recognitionRef.current;
    if (!recog) return;

    if (listening) {
      recog.stop();
    } else {
      setTranscript('');
      recog.start();
      setListening(true);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button
        onClick={toggleListen}
        title={listening ? 'Stop listening' : 'Start voice input'}
        style={{
          padding: '8px 10px',
          borderRadius: 6,
          border: '1px solid #ddd',
          background: listening ? '#ef4444' : '#10b981',
          color: 'white',
          cursor: 'pointer',
        }}
      >
        {listening ? '● Listening' : '🎤 Voice'}
      </button>

      <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
        <input type="checkbox" checked={voiceEnabled} onChange={(e) => setVoiceEnabled(e.target.checked)} />
        <span style={{ fontSize: 13 }}>Speak replies</span>
      </label>

      <div style={{ minWidth: 180, maxWidth: 360, fontSize: 13, color: '#333' }}>{transcript}</div>
    </div>
  );
}
