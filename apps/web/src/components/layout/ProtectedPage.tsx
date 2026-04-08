'use client';
 
import React from 'react';
import { useRequireAuth, useRequireAdmin } from '@/context/AuthContext';
import { styles } from '@/style/protectpage';
 
function LoadingScreen() {
  return (
    <div style={styles.loading}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={styles.spinner} />
    </div>
  );
}
 
export function AuthPage({ children }: { children: React.ReactNode }) {
  const { user, loading } = useRequireAuth();
  if (loading || !user) return <LoadingScreen />;
  return <>{children}</>;
}
 
export function AdminPage({ children }: { children: React.ReactNode }) {
  const { user, loading } = useRequireAdmin();
  if (loading || !user) return <LoadingScreen />;
  return <>{children}</>;
}