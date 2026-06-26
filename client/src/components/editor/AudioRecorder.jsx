import { useState, useRef, useEffect } from 'react';

export default function AudioRecorder({ onAudioReady, initialAudio }) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(initialAudio || null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // NEW: Listen for the cloud audio link to load!
  useEffect(() => {
    setAudioUrl(initialAudio || null);
  }, [initialAudio]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onAudioReady(url); // Send back to the editor
        audioChunksRef.current = []; // Reset chunks
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Microphone access denied", err);
      alert("Please allow microphone access to record an audio log.");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setIsRecording(false);
    mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
  };

  const clearAudio = () => {
    setAudioUrl(null);
    onAudioReady(null); // Tell the editor the audio was deleted
  };

  return (
    <div className="flex items-center gap-4 bg-white/5 p-3 rounded-xl border border-white/10">
      {!audioUrl ? (
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`px-4 py-2 rounded-lg font-bold transition-all ${
            isRecording ? 'bg-red-500 animate-pulse text-white' : 'bg-white/10 hover:bg-white/20 text-white/80'
          }`}
        >
          {isRecording ? '⏹ Stop Recording' : '🎙️ Record Audio Log'}
        </button>
      ) : (
        <div className="flex items-center gap-3 w-full">
          <audio src={audioUrl} controls className="h-8 max-w-[200px]" />
          <button onClick={clearAudio} className="text-red-400 hover:text-red-300 text-sm font-semibold">
            ✕ Remove
          </button>
        </div>
      )}
    </div>
  );
}