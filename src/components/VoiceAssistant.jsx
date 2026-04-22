import { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { sampleEmails } from '../data/sampleEmails';

export const VoiceAssistant = () => {
  const [systemState, setSystemState] = useState('idle'); // idle, composing, reading
  const [systemMessage, setSystemMessage] = useState('');
  const [emailData, setEmailData] = useState({ sender: '', recipient: '', message: '' });
  const [composeStep, setComposeStep] = useState(0);
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const [commandLog, setCommandLog] = useState([]);
  const isInitializedRef = useRef(false);

  const { isListening, transcript, error, startListening, stopListening, isSupported: speechSupported } = useSpeechRecognition();
  const { speak, isSupported: ttsSupported } = useTextToSpeech();

  // Add to command log
  const addToLog = useCallback((userInput, systemResponse) => {
    setCommandLog(prev => [...prev, { user: userInput, system: systemResponse }].slice(-5));
  }, []);

  // Helper functions
  const startComposeFlow = useCallback(() => {
    setSystemState('composing');
    setComposeStep(0);
    setEmailData({ sender: '', recipient: '', message: '' });
    const message = 'What is your email address?';
    setSystemMessage(message);
    speak(message);
  }, [speak]);

  const handleComposeInput = useCallback((input) => {
    if (composeStep === 0) {
      // Sender email
      setEmailData(prev => ({ ...prev, sender: input }));
      setComposeStep(1);
      const message = 'Who is the recipient?';
      setSystemMessage(message);
      speak(message);
    } else if (composeStep === 1) {
      // Recipient email
      setEmailData(prev => ({ ...prev, recipient: input }));
      setComposeStep(2);
      const message = 'What is the message?';
      setSystemMessage(message);
      speak(message);
    } else if (composeStep === 2) {
      // Message
      setEmailData(prev => ({ ...prev, message: input }));
      setComposeStep(3);
      const message = 'Say send to confirm, or cancel to start over';
      setSystemMessage(message);
      speak(message);
    } else if (composeStep === 3) {
      // Confirm or cancel
      if (input.includes('send') || input.includes('confirm')) {
        const message = 'Email sent successfully';
        setSystemMessage(message);
        speak(message);
        setSystemState('idle');
        setEmailData({ sender: '', recipient: '', message: '' });
      } else if (input.includes('cancel') || input.includes('start over')) {
        const message = 'Cancelled. Say a command to continue';
        setSystemMessage(message);
        speak(message);
        setSystemState('idle');
        setEmailData({ sender: '', recipient: '', message: '' });
      }
    }
  }, [composeStep, speak]);

  const startReadFlow = useCallback(() => {
    setSystemState('reading');
    setCurrentEmailIndex(0);
    const email = sampleEmails[0];
    const message = `You have ${sampleEmails.length} emails. First email from ${email.sender}. Subject: ${email.subject}. ${email.body}`;
    setSystemMessage(`Reading email 1 of ${sampleEmails.length}`);
    speak(message);
  }, [speak]);

  const navigateEmail = useCallback((direction) => {
    if (direction === 'next' && currentEmailIndex < sampleEmails.length - 1) {
      setCurrentEmailIndex(prev => prev + 1);
      const newIndex = currentEmailIndex + 1;
      const email = sampleEmails[newIndex];
      const message = `Next email from ${email.sender}. Subject: ${email.subject}. ${email.body}`;
      setSystemMessage(`Reading email ${newIndex + 1} of ${sampleEmails.length}`);
      speak(message);
    } else if (direction === 'previous' && currentEmailIndex > 0) {
      setCurrentEmailIndex(prev => prev - 1);
      const newIndex = currentEmailIndex - 1;
      const email = sampleEmails[newIndex];
      const message = `Previous email from ${email.sender}. Subject: ${email.subject}. ${email.body}`;
      setSystemMessage(`Reading email ${newIndex + 1} of ${sampleEmails.length}`);
      speak(message);
    } else {
      speak('No more emails in that direction');
    }
  }, [currentEmailIndex, speak]);

  const readCurrentEmail = useCallback(() => {
    const email = sampleEmails[currentEmailIndex];
    const message = `Email from ${email.sender}. Subject: ${email.subject}. ${email.body}`;
    speak(message);
  }, [currentEmailIndex, speak]);

  const returnToIdle = useCallback(() => {
    const message = 'Returning to main menu. Say a command';
    setSystemMessage(message);
    speak(message);
    setSystemState('idle');
  }, [speak]);

  const handleReadingCommand = useCallback((command) => {
    if (command.includes('next') || command.includes('forward')) {
      navigateEmail('next');
    } else if (command.includes('previous') || command.includes('back')) {
      navigateEmail('previous');
    } else if (command.includes('stop') || command.includes('cancel') || command.includes('back to menu')) {
      returnToIdle();
    } else if (command.includes('read') || command.includes('again')) {
      readCurrentEmail();
    }
  }, [navigateEmail, returnToIdle, readCurrentEmail]);

  // Handle voice commands
  const handleVoiceResult = useCallback((command) => {
    console.log('Command received:', command);

    if (systemState === 'idle') {
      if (command.includes('compose') || command.includes('write') || command.includes('send')) {
        addToLog(command, 'Starting email composition');
        startComposeFlow();
      } else if (command.includes('read') || command.includes('inbox') || command.includes('emails')) {
        addToLog(command, 'Reading inbox');
        startReadFlow();
      } else if (command.includes('help')) {
        const helpMessage = 'You can say "compose email" to write a new email, or "read inbox" to hear your emails.';
        addToLog(command, helpMessage);
        speak(helpMessage);
        setSystemMessage(helpMessage);
      }
    } else if (systemState === 'composing') {
      handleComposeInput(command);
    } else if (systemState === 'reading') {
      handleReadingCommand(command);
    }
  }, [systemState, speak, startComposeFlow, startReadFlow, handleComposeInput, handleReadingCommand, addToLog]);

  // Initialize with welcome message
  useEffect(() => {
    if (!isInitializedRef.current && ttsSupported) {
      speak('Welcome. Say a command like "compose email" or "read inbox"');
      setSystemMessage('Welcome. Say a command like "compose email" or "read inbox"');
      isInitializedRef.current = true;
    }
  }, [ttsSupported, speak]);

  // Handle transcript changes
  useEffect(() => {
    if (speechSupported && transcript) {
      handleVoiceResult(transcript.toLowerCase().trim());
    }
  }, [transcript, handleVoiceResult, speechSupported]);

  const cancelCompose = useCallback(() => {
    const message = 'Cancelled. Say a command to continue';
    setSystemMessage(message);
    speak(message);
    setSystemState('idle');
    setEmailData({ sender: '', recipient: '', message: '' });
  }, [speak]);

  const sendEmail = useCallback(() => {
    const message = 'Email sent successfully';
    setSystemMessage(message);
    speak(message);
    setSystemState('idle');
    setEmailData({ sender: '', recipient: '', message: '' });
  }, [speak]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleEmailNavigation = (direction) => {
    navigateEmail(direction);
  };

  // Browser support warning
  if (!speechSupported || !ttsSupported) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl border-2 border-red-500">
          <h1 className="text-3xl font-bold text-white mb-4">
            Browser Not Supported
          </h1>
          <p className="text-xl text-gray-300 mb-4">
            This application requires a browser that supports the Web Speech API.
          </p>
          <p className="text-lg text-gray-400">
            Please use Chrome, Edge, or Safari for the best experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* Main Container */}
      <div className="w-full max-w-2xl text-center">
        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-2">
          Voice Email Assistant
        </h1>
        <p className="text-xl text-gray-400 mb-12">
          Tap the microphone and speak
        </p>

        {/* Big Microphone Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleToggleListening}
            className={`large-touch-target focus-visible-ring rounded-full p-12 transition-all ${
              isListening
                ? 'bg-green-500 hover:bg-green-600 text-white animate-pulse shadow-lg shadow-green-500/50'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/50'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? <MicOff size={64} aria-hidden="true" /> : <Mic size={64} aria-hidden="true" />}
          </button>
        </div>

        {/* Status Indicator */}
        <div className="mb-6">
          <p className="text-2xl font-semibold text-white mb-2">
            {isListening ? 'Listening...' : 'Waiting for command...'}
          </p>
          {systemMessage && (
            <p className="text-xl text-gray-300 flex items-center justify-center gap-2">
              <Volume2 size={20} aria-hidden="true" />
              {systemMessage}
            </p>
          )}
        </div>

        {/* Last Command */}
        {transcript && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-400 mb-1">You said:</p>
            <p className="text-xl text-white font-medium">
              {transcript}
            </p>
          </div>
        )}

        {/* Command Log (Optional) */}
        {commandLog.length > 0 && (
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-left">
            <p className="text-sm text-gray-500 mb-3">Recent interactions:</p>
            {commandLog.map((log, index) => (
              <div key={index} className="mb-3 last:mb-0">
                <p className="text-sm text-blue-400">You: {log.user}</p>
                <p className="text-sm text-gray-300">System: {log.system}</p>
              </div>
            ))}
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-500 rounded-xl p-4 mt-6">
            <p className="text-lg text-red-300">
              Error: {error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
