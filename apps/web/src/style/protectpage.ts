export const styles = {
  loading: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F6F7F9',
  } as React.CSSProperties,
 
  spinner: {
    width: 32,
    height: 32,
    border: '3px solid #e2e5ea',
    borderTopColor: '#5BA4CF',
    borderRadius: '50%',
    animation: 'spin 0.7s linear infinite',
  } as React.CSSProperties,
} as const;
 