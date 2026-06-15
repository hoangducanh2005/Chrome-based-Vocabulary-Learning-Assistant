export const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="p-4 text-center border-t border-[var(--border)] bg-[var(--surface)]">
      <p className="text-sm text-[var(--text3)]">
        &copy; {currentYear} Vocabulary Learning Assistant
      </p>
    </footer>
  );
};
