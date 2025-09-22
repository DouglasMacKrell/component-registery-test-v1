
export default function Hero({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header style={{
      textAlign: 'center',
      padding: 'clamp(2rem, 5vw, 4rem) 0',
      marginBottom: '2rem',
      position: 'relative'
    }}>
      <h1 style={{
        fontSize: 'clamp(2rem, 6vw, 3.5rem)',
        fontWeight: '800',
        color: '#1f2937',
        marginBottom: subtitle ? '1.5rem' : '0',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        lineHeight: '1.1',
        letterSpacing: '-0.025em',
        position: 'relative'
      }}>
        {title}
      </h1>
      {subtitle && (
        <h2 style={{
          fontSize: 'clamp(1rem, 3vw, 1.375rem)',
          fontWeight: '400',
          color: '#6b7280',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: '1.6',
          letterSpacing: '-0.01em'
        }}>
          {subtitle}
        </h2>
      )}
    </header>
  );
}