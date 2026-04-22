import { Mic, MicOff, Volume2 } from 'lucide-react';

export const StatusDisplay = ({ isListening, transcript, systemMessage, error }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6 border-4 border-gray-900 dark:border-gray-100"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {/* System Status */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-4 rounded-full large-touch-target ${
          isListening 
            ? 'bg-green-500 text-white animate-pulse' 
            : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
        }`}>
          {isListening ? <Mic size={32} aria-hidden="true" /> : <MicOff size={32} aria-hidden="true" />}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {isListening ? 'Listening...' : 'Voice Assistant'}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isListening ? 'Speak your command' : 'Press the button to start'}
          </p>
        </div>
      </div>

      {/* System Message */}
      {systemMessage && (
        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 mb-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <Volume2 className="text-blue-600 dark:text-blue-400 mt-1" size={24} aria-hidden="true" />
            <p className="text-xl text-gray-900 dark:text-gray-100 font-medium" role="alert">
              {systemMessage}
            </p>
          </div>
        </div>
      )}

      {/* Transcript */}
      {transcript && (
        <div className="bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-300 dark:border-gray-600 p-4 rounded-lg">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
            You said:
          </p>
          <p className="text-xl text-gray-900 dark:text-gray-100 leading-relaxed">
            {transcript}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-4 mt-4 rounded-r-lg" role="alert">
          <p className="text-lg text-red-900 dark:text-red-300 font-medium">
            Error: {error}
          </p>
        </div>
      )}
    </div>
  );
};
