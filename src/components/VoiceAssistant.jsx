import { useState, useEffect, useCallback, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { StatusDisplay } from './StatusDisplay';
import { EmailInbox } from './EmailInbox';
import { EmailComposer } from './EmailComposer';
import { sampleEmails } from '../data/sampleEmails';

export const VoiceAssistant = () => {
  const [systemState, setSystemState] = useState('idle'); // idle, composing, reading
  const [systemMessage, setSystemMessage] = useState('');
  const [emailData, setEmailData] = useState({ recipient: '', subject: '', message: '' });
  const [composeStep, setComposeStep] = useState(0); // 0: recipient, 1: subject, 2: message, 3: confirm
  const [currentEmailIndex, setCurrentEmailIndex] = useState(0);
  const isInitializedRef = useRef(false);

  const { isListening, transcript, error, startListening, stopListening, isSupported: speechSupported } = useSpeechRecognition();
  const { speak, isSupported: ttsSupported } = useTextToSpeech();

  // Helper functions
  const startComposeFlow = useCallback(() => {
    setSystemState('composing');
    setComposeStep(0);
    setEmailData({ recipient: '', subject: '', message: '' });
    const message = 'Who is the recipient?';
    setSystemMessage(message);
    speak(message);
  }, [speak]);

  const handleComposeInput = useCallback((input) => {
    if (composeStep === 0) {
      // Recipient
      setEmailData(prev => ({ ...prev, recipient: input }));
      setComposeStep(1);
      const message = 'What is the subject?';
      setSystemMessage(message);
      speak(message);
    } else if (composeStep === 1) {
      // Subject
      setEmailData(prev => ({ ...prev, subject: input }));
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
        setEmailData({ recipient: '', subject: '', message: '' });
      } else if (input.includes('cancel') || input.includes('start over')) {
        const message = 'Cancelled. Say a command to continue';
        setSystemMessage(message);
        speak(message);
        setSystemState('idle');
        setEmailData({ recipient: '', subject: '', message: '' });
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
        startComposeFlow();
      } else if (command.includes('read') || command.includes('inbox') || command.includes('emails')) {
        startReadFlow();
      } else if (command.includes('help')) {
        speak('You can say "compose email" to write a new email, or "read inbox" to hear your emails.');
        setSystemMessage('You can say "compose email" to write a new email, or "read inbox" to hear your emails.');
      }
    } else if (systemState === 'composing') {
      handleComposeInput(command);
    } else if (systemState === 'reading') {
      handleReadingCommand(command);
    }
  }, [systemState, speak, startComposeFlow, startReadFlow, handleComposeInput, handleReadingCommand]);

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
    setEmailData({ recipient: '', subject: '', message: '' });
  }, [speak]);

  const sendEmail = useCallback(() => {
    const message = 'Email sent successfully';
    setSystemMessage(message);
    speak(message);
    setSystemState('idle');
    setEmailData({ recipient: '', subject: '', message: '' });
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
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 max-w-2xl border-4 border-red-500">
          <h1 className="text-3xl font-bold text-red-600 dark:text-red-400 mb-4">
            Browser Not Supported
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
            This application requires a browser that supports the Web Speech API.
          </p>
          <p className="text-base text-gray-600 dark:text-gray-400">
            Please use Chrome, Edge, or Safari for the best experience.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 text-center mb-4">
            Voice-Controlled Email System
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 text-center">
            For the Visually Impaired
          </p>
        </header>

        {/* Main Control Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={handleToggleListening}
            className={`large-touch-target focus-visible-ring rounded-full p-6 transition-all ${
              isListening
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? <MicOff size={48} aria-hidden="true" /> : <Mic size={48} aria-hidden="true" />}
          </button>
        </div>

        {/* Status Display */}
        <StatusDisplay
          isListening={isListening}
          transcript={transcript}
          systemMessage={systemMessage}
          error={error}
        />

        {/* Dynamic Content based on state */}
        {systemState === 'composing' && (
          <EmailComposer
            emailData={emailData}
            onCancel={cancelCompose}
            onSend={sendEmail}
          />
        )}

        {systemState === 'reading' && (
          <EmailInbox
            emails={sampleEmails}
            currentEmailIndex={currentEmailIndex}
            onNavigate={handleEmailNavigation}
          />
        )}

        {/* Help Section */}
        {systemState === 'idle' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-4 border-gray-900 dark:border-gray-100">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Available Commands
            </h2>
            <ul className="space-y-3 text-lg text-gray-700 dark:text-gray-300">
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 dark:text-blue-400">•</span>
                <span>"Compose email" - Write a new email</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 dark:text-blue-400">•</span>
                <span>"Read inbox" - Hear your emails</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="font-bold text-blue-600 dark:text-blue-400">•</span>
                <span>"Help" - Hear available commands</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
