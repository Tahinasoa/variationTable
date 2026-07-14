export const ThemeToggle = ({
  isDark,
  setIsDark,
}: {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}) => {
  const styles = {
    button: {
      padding: '8px 12px',
      cursor: 'pointer',
      fontSize: '12px',
      borderRadius: '4px',
      border: '1px solid',
      transition: 'all 0.2s ease',
      // Dynamic styles based on props, not global CSS
      backgroundColor: isDark ? '#222222' : '#ffffff',
      color: isDark ? '#ffffff' : '#000000',
      borderColor: isDark ? '#ffffff' : '#000000',
    },
  };

  return (
    <button style={styles.button} onClick={() => setIsDark(!isDark)}>
      {isDark ? 'Switch to Light' : 'Switch to Dark'}
    </button>
  );
};