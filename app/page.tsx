'use client';

import { useState } from 'react';

interface DmData {
  username: string;
  message: string;
}

export default function Home() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [recipients, setRecipients] = useState<DmData[]>([]);
  const [bulkUsernames, setBulkUsernames] = useState('');
  const [status, setStatus] = useState('');
  const [sending, setSending] = useState(false);

  const addRecipient = () => {
    if (username && message) {
      setRecipients([...recipients, { username, message }]);
      setUsername('');
      setMessage('');
      setStatus(`Added @${username} to queue`);
    }
  };

  const addBulkRecipients = () => {
    const usernames = bulkUsernames.split('\n').filter(u => u.trim());
    if (usernames.length > 0 && message) {
      const newRecipients = usernames.map(u => ({
        username: u.trim(),
        message
      }));
      setRecipients([...recipients, ...newRecipients]);
      setBulkUsernames('');
      setStatus(`Added ${usernames.length} recipients to queue`);
    }
  };

  const removeRecipient = (index: number) => {
    setRecipients(recipients.filter((_, i) => i !== index));
  };

  const sendDMs = async () => {
    if (recipients.length === 0) return;

    setSending(true);
    setStatus('Sending DMs...');

    // Simulate sending DMs
    for (let i = 0; i < recipients.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus(`Sent DM ${i + 1}/${recipients.length} to @${recipients[i].username}`);
    }

    setStatus(`✓ Successfully sent ${recipients.length} DMs`);
    setSending(false);
    setRecipients([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-orange-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Instagram Auto DM
          </h1>
          <p className="text-gray-600">Automate your Instagram direct messages</p>
        </header>

        <div className="max-w-4xl mx-auto">
          {/* Status Bar */}
          {status && (
            <div className="mb-6 p-4 bg-white rounded-lg shadow-md border-l-4 border-purple-500">
              <p className="text-gray-700">{status}</p>
            </div>
          )}

          {/* Single Recipient Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add Single Recipient</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="username"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={addRecipient}
                disabled={!username || !message}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Add to Queue
              </button>
            </div>
          </div>

          {/* Bulk Recipients Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Add Bulk Recipients</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Usernames (one per line)
                </label>
                <textarea
                  value={bulkUsernames}
                  onChange={(e) => setBulkUsernames(e.target.value)}
                  placeholder="username1&#10;username2&#10;username3"
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (same for all)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter your message..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={addBulkRecipients}
                disabled={!bulkUsernames || !message}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Add Bulk Recipients
              </button>
            </div>
          </div>

          {/* Queue */}
          {recipients.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Message Queue ({recipients.length})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recipients.map((recipient, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-purple-600">@{recipient.username}</p>
                      <p className="text-sm text-gray-600 mt-1">{recipient.message}</p>
                    </div>
                    <button
                      onClick={() => removeRecipient(index)}
                      className="ml-4 text-red-500 hover:text-red-700 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={sendDMs}
                disabled={sending}
                className="w-full mt-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-bold text-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {sending ? 'Sending...' : `Send ${recipients.length} DMs`}
              </button>
            </div>
          )}

          {/* Info */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
            <h3 className="font-semibold text-yellow-800 mb-2">⚠️ Important Notes</h3>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• This is a demo application showing the UI for Instagram auto DM functionality</li>
              <li>• Instagram's official API has restrictions on automated DMs</li>
              <li>• Real implementation would require Instagram Business API access</li>
              <li>• Always comply with Instagram's Terms of Service and rate limits</li>
              <li>• Use automation responsibly to avoid account restrictions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
