import { ReactNode, useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, User, Upload, Wifi, WifiOff } from 'lucide-react';
import { wsService } from '../services/websocket';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/overview', label: 'Overview' },
  { path: '/tasks', label: 'Tasks' },
  { path: '/ai-insights', label: 'AI Insights' },
  { path: '/query', label: 'Query' },
  { path: '/settings', label: 'Settings' },
];

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [isConnected, setIsConnected] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  useEffect(() => {
    wsService.connect();
    const unsubscribe = wsService.onConnectionChange(setIsConnected);
    return () => {
      unsubscribe();
      wsService.disconnect();
    };
  }, []);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setUploadMessage('Please upload a CSV file');
      setTimeout(() => setUploadMessage(''), 3000);
      return;
    }

    setUploading(true);
    setUploadMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:8080/api/upload/csv', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setUploadMessage(`✅ Successfully imported ${data.imported} tasks from CSV!`);
        setShowUploadModal(false);
        // Refresh will happen via WebSocket update
      } else {
        setUploadMessage(`❌ Error: ${data.error || 'Failed to upload file'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadMessage('❌ Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      setTimeout(() => setUploadMessage(''), 5000);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Header */}
      <header className="border-b border-dark-border bg-dark-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <h1 className="text-2xl font-bold text-dark-text">PRODUCTIFY</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center opacity-0 gap-2 text-dark-muted">
                {isConnected ? (
                  <Wifi className="w-5 h-5 text-green-500" />
                ) : (
                  <WifiOff className="w-5 h-5 text-red-500" />
                )}
                <span className="text-sm">{isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-dark-bg rounded-lg border border-dark-border">
                <Calendar className="w-4 h-4 text-dark-muted" />
                <span className="text-sm text-dark-text">Today</span>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Upload</span>
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center cursor-pointer">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b border-dark-border bg-dark-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-6 py-3 text-sm font-medium transition-colors relative ${
                    isActive
                      ? 'text-blue-400'
                      : 'text-dark-muted hover:text-dark-text'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-400" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => !uploading && setShowUploadModal(false)}>
          <div className="bg-dark-card rounded-lg p-8 max-w-md w-full mx-4 border border-dark-border" onClick={(e) => e.stopPropagation()}>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-bg flex items-center justify-center">
                <Upload className="w-8 h-8 text-dark-muted" />
              </div>
              <h3 className="text-xl font-semibold text-dark-text mb-2">Upload CSV File</h3>
              <p className="text-dark-muted mb-4">Upload a CSV file with task data to import into the system</p>
              <p className="text-sm text-dark-muted mb-6">
                CSV should contain columns: title, assignedTo, status, project, description, priority
              </p>
              
              {uploadMessage && (
                <div className={`mb-4 p-3 rounded-lg text-sm ${
                  uploadMessage.includes('✅') ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                }`}>
                  {uploadMessage}
                </div>
              )}

              <div className="mb-4">
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleFileUpload(file);
                    }
                  }}
                  disabled={uploading}
                  className="hidden"
                  id="csv-upload-input"
                />
                <label
                  htmlFor="csv-upload-input"
                  className={`inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer ${
                    uploading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {uploading ? 'Uploading...' : 'Browse CSV File'}
                </label>
              </div>

              <button
                onClick={() => setShowUploadModal(false)}
                disabled={uploading}
                className="w-full px-6 py-2 bg-dark-bg border border-dark-border hover:bg-dark-border rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

