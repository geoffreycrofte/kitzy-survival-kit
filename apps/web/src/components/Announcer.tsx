import { useEffect } from 'react';
import { clearAnnouncement, useAnnouncement } from '../lib/announce';

/** Zone de statut unique : annoncée aux lecteurs d'écran, visible quelques secondes. */
export function Announcer() {
  const message = useAnnouncement();

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(clearAnnouncement, 5000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <div role="status" className="announcer">
      {message && <p className="announcer__message">{message}</p>}
    </div>
  );
}
