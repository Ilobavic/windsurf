import { Mail, User, PenTool, Send, X } from 'lucide-react';

export const EmailComposer = ({ emailData, onCancel, onSend }) => {
  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-4 border-gray-900 dark:border-gray-100"
      role="region"
      aria-label="Email composer"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Mail className="text-blue-600 dark:text-blue-400" size={32} aria-hidden="true" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Compose Email
        </h2>
      </div>

      {/* Email Fields */}
      <div className="space-y-4 mb-6">
        {/* Recipient */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border-2 border-gray-300 dark:border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <User className="text-gray-600 dark:text-gray-400" size={20} aria-hidden="true" />
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">To:</p>
          </div>
          <p className="text-lg text-gray-900 dark:text-gray-100 font-medium">
            {emailData.recipient || 'Not provided yet'}
          </p>
        </div>

        {/* Subject */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border-2 border-gray-300 dark:border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <PenTool className="text-gray-600 dark:text-gray-400" size={20} aria-hidden="true" />
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Subject:</p>
          </div>
          <p className="text-lg text-gray-900 dark:text-gray-100 font-medium">
            {emailData.subject || 'Not provided yet'}
          </p>
        </div>

        {/* Message */}
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 border-2 border-gray-300 dark:border-gray-600">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="text-gray-600 dark:text-gray-400" size={20} aria-hidden="true" />
            <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Message:</p>
          </div>
          <p className="text-lg text-gray-900 dark:text-gray-100 leading-relaxed">
            {emailData.message || 'Not provided yet'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 font-semibold text-lg py-4 px-6 rounded-xl large-touch-target focus-visible-ring transition-colors flex items-center justify-center gap-2"
          aria-label="Cancel email composition"
        >
          <X size={20} aria-hidden="true" />
          Cancel
        </button>
        <button
          onClick={onSend}
          disabled={!emailData.recipient || !emailData.subject || !emailData.message}
          className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg py-4 px-6 rounded-xl large-touch-target focus-visible-ring transition-colors flex items-center justify-center gap-2"
          aria-label="Send email"
        >
          <Send size={20} aria-hidden="true" />
          Send Email
        </button>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-xl border-l-4 border-blue-500">
        <p className="text-base text-gray-700 dark:text-gray-300">
          <strong className="text-gray-900 dark:text-gray-100">Instructions:</strong> Fill in all fields by speaking, then say "Send email" to confirm or "Cancel" to start over.
        </p>
      </div>
    </div>
  );
};
