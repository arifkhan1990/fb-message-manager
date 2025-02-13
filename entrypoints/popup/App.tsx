import { useLanguage } from '@/src/hooks/useLanguage';
import { useChatStats } from '@/src/hooks/useChatStats';
import { useMessengerTab } from '@/src/hooks/useMessengerTab';
import { sendMessageToContent, showAlert } from '@/src/utils/messageUtils';
import { IoChatbubblesSharp, IoRefreshSharp, IoArchiveSharp, IoTrashSharp, IoCheckmarkDoneSharp, IoHeartSharp } from 'react-icons/io5';
import "./App.css";

// Language display component
function LanguageDisplay({ currentLanguage }: { currentLanguage: string }) {
  const languageNames: { [key: string]: string } = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    it: 'Italiano',
    pt: 'Português',
    bn: 'বাংলা',
    hi: 'हिन्दी',
    ar: 'العربية',
    // Add more languages as needed
  };

  return (
    <div className="language-display">
      <span className="language-label">
        {languageNames[currentLanguage] || currentLanguage}
      </span>
    </div>
  );
}

function App() {
  const { getTranslation, currentLanguage, isLoading } = useLanguage();
  const stats = useChatStats();
  const { currentTab, isEnabled, navigateToMessages } = useMessengerTab();

  const handleAction = async (action: string) => {
    if (!currentTab?.id) return;
    try {
      await sendMessageToContent(currentTab.id, action);
    } catch (error) {
      showAlert(getTranslation('Failed to send message to content script.'));
    }
  };

  // Show loading state while detecting language
  if (isLoading) {
    return (
      <div className="app-container">
        <h2>{getTranslation('Facebook Chat Manager')}</h2>
        <div className="loading-container">
          <p>{getTranslation('Loading language settings...')}</p>
        </div>
      </div>
    );
  }

  if (!isEnabled) {
    return (
      <>
        <div className="app-container">
          <div className="header">
            <h2>{getTranslation('Facebook Chat Manager')}</h2>
          </div>
          <div className="error-container">
            <p className="error-message">
              {getTranslation('This extension only works on Facebook Messages')}
            </p>
            <button className="action-button primary" onClick={navigateToMessages}>
              <IoChatbubblesSharp size={20} /> {getTranslation('Go to Messages')}
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
        <div className="app-container">
      <div className="header">
        <h2 style={{marginTop:'12px', fontSize:'18px', paddingRight:"8px"}}>{getTranslation('Chat Manager')}</h2>
        <LanguageDisplay currentLanguage={currentLanguage} />
      </div>
      <StatsDisplay stats={stats} getTranslation={getTranslation} />
      <ActionButtons stats={stats} onAction={handleAction} getTranslation={getTranslation} />
      <HelpText getTranslation={getTranslation} />
    </div>
    <Footer />
    </>

  );
}

// Add proper TypeScript interfaces for component props
interface StatsDisplayProps {
  stats: {
    totalChats: number;
    selectedCount: number;
  };
  getTranslation: (key: string) => string;
}

function StatsDisplay({ stats, getTranslation }: StatsDisplayProps) {
  return (
    <div className="stats-container">
      <p>
        <IoChatbubblesSharp size={16} /> 
        {getTranslation('Total Chats')}: {stats.totalChats}
      </p>
      <p>
        <IoCheckmarkDoneSharp size={16} /> 
        {getTranslation('Selected')}: {stats.selectedCount}
      </p>
    </div>
  );
}

interface ActionButtonsProps {
  stats: {
    selectedCount: number;
  };
  onAction: (action: string) => void;
  getTranslation: (key: string) => string;
}

function ActionButtons({ stats, onAction, getTranslation }: ActionButtonsProps) {
  return (
    <div className="actions-container">
      <div className="actions-row">
        <button
          className="action-button toggle-selection"
          onClick={() => onAction("TOGGLE_SELECTION")}
        >
          <IoCheckmarkDoneSharp size={20} /> 
          {stats.selectedCount > 0 
            ? getTranslation('Cancel Selection')
            : getTranslation('Select Chats')
          }
        </button>

        <button
          className="action-button select-all"
          onClick={() => onAction("SELECT_ALL")}
        >
          <IoCheckmarkDoneSharp size={20} /> {getTranslation('Select All')}
        </button>

        <button
          className="action-button refresh-chats"
          onClick={() => onAction("REFRESH_CHATS")}
        >
          <IoRefreshSharp size={20} /> {getTranslation('Refresh Chats')}
        </button>
      </div>

      <div className="actions-row">
        <button
          className="action-button archive-selected warning"
          onClick={() => onAction("ARCHIVE_SELECTED")}
          disabled={stats.selectedCount === 0}
        >
          <IoArchiveSharp size={20} /> {getTranslation('Archive Selected')} ({stats.selectedCount})
        </button>

        <button
          className="action-button delete-selected danger"
          onClick={() => onAction("DELETE_SELECTED")}
          disabled={stats.selectedCount === 0}
        >
          <IoTrashSharp size={20} /> {getTranslation('Delete Selected')} ({stats.selectedCount})
        </button>
      </div>
    </div>
  );
}

interface HelpTextProps {
  getTranslation: (key: string) => string;
}

function HelpText({ getTranslation }: HelpTextProps) {
  return (
    <div className="help-text">
      <p>{getTranslation('💡 Tip: Click on chats to select them for bulk actions')}</p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer-container" style={{marginTop:'35px'}}>
      Developed by <IoHeartSharp size={14} />
      <a href="https://arif-portfolio-orcin.vercel.app/" target="_blank" rel="noopener noreferrer">
        Arif Khan
      </a>
    </footer>
  );
}

export default App;
