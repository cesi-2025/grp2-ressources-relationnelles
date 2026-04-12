import { CSSProperties } from 'react';
 
const moderationStyles: Record<string, CSSProperties> = {
  tabBar: {
    display: 'flex',
    gap: 8,
    marginBottom: 24,
  },
 
  tab: {
    padding: '8px 20px',
    borderRadius: 8,
    border: 'none',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    background: '#f1f5f9',
    color: '#64748b',
  },
 
  tabActive: {
    background: '#5BA4CF',
    color: '#ffffff',
  },
};
 
export default moderationStyles;