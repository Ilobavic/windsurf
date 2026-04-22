import { Mail, Clock, User } from 'lucide-react';

export const EmailInbox = ({ emails, currentEmailIndex, onNavigate }) => {
  if (!emails || emails.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-4 border-gray-900 dark:border-gray-100">
        <div className="text-center">
          <Mail className="mx-auto text-gray-400 mb-4" size={48} aria-hidden="true" />
          <p className="text-xl text-gray-600 dark:text-gray-400">No emails available</p>
        </div>
      </div>
    );
  }

  const currentEmail = emails[currentEmailIndex];

  return (
    <div 
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border-4 border-gray-900 dark:border-gray-100"
      role="region"
      aria-label="Email inbox"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Mail className="text-blue-600 dark:text-blue-400" size={32} aria-hidden="true" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Inbox ({emails.length} emails)
        </h2>
      </div>

      {/* Email Content */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6 border-2 border-gray-300 dark:border-gray-600">
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <User className="text-gray-600 dark:text-gray-400" size={20} aria-hidden="true" />
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {currentEmail.sender}
            </p>
          </div>
          <p className="text-base text-gray-600 dark:text-gray-400 ml-7">
            {currentEmail.email}
          </p>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {currentEmail.subject}
          </h3>
        </div>

        <div className="mb-4">
          <p className="text-lg text-gray-900 dark:text-gray-100 leading-relaxed">
            {currentEmail.body}
          </p>
        </div>

        <div className="flex items-center gap-2 pt-4 border-t-2 border-gray-300 dark:border-gray-600">
          <Clock className="text-gray-500 dark:text-gray-400" size={18} aria-hidden="true" />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {currentEmail.timestamp}
          </p>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex gap-4">
        <button
          onClick={() => onNavigate('previous')}
          disabled={currentEmailIndex === 0}
          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-900 dark:text-gray-100 font-semibold text-lg py-4 px-6 rounded-xl large-touch-target focus-visible-ring transition-colors"
          aria-label="Previous email"
        >
          Previous
        </button>
        <button
          onClick={() => onNavigate('next')}
          disabled={currentEmailIndex === emails.length - 1}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-lg py-4 px-6 rounded-xl large-touch-target focus-visible-ring transition-colors"
          aria-label="Next email"
        >
          Next
        </button>
      </div>

      {/* Email Counter */}
      <div className="mt-4 text-center">
        <p className="text-base text-gray-600 dark:text-gray-400">
          Email {currentEmailIndex + 1} of {emails.length}
        </p>
      </div>
    </div>
  );
};
