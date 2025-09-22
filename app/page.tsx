import { demoPage, mockTickets } from '../src/mockPage';
import { renderBlocks } from '../src/renderBlocks';
import TicketList from '../src/components/TicketList';

export default function Page() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <main style={{
        flex: 1,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: 'clamp(1rem, 4vw, 2rem) clamp(0.5rem, 2vw, 1rem)',
        lineHeight: '1.6'
      }}>
        {demoPage.pageTitle && (
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: '800',
            color: '#1f2937',
            marginBottom: '0.5rem',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.025em'
          }}>
            {demoPage.pageTitle} - CACHE BUST {new Date().toLocaleTimeString()}
          </h1>
        )}
        
        <div style={{ marginBottom: '3rem' }}>
          {renderBlocks(demoPage.blocks)}
        </div>
        
        <section style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          padding: 'clamp(1.5rem, 4vw, 2.5rem)',
          boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e5e7eb',
          marginBottom: '3rem'
        }}>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '1.5rem',
            textAlign: 'center',
            position: 'relative',
            letterSpacing: '-0.025em'
          }}>
            All Available Events
            <div style={{
              width: '80px',
              height: '4px',
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              margin: '0.75rem auto 0',
              borderRadius: '2px'
            }} />
          </h2>
          <TicketList tickets={mockTickets} />
        </section>
      </main>
      
      <footer style={{
        backgroundColor: '#1f2937',
        color: '#f9fafb',
        padding: 'clamp(1.5rem, 4vw, 2rem) clamp(0.5rem, 2vw, 1rem)',
        textAlign: 'center',
        borderTop: '1px solid #374151'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <p style={{
            margin: '0 0 1rem 0',
            fontSize: 'clamp(1rem, 3vw, 1.125rem)',
            fontWeight: '600'
          }}>
            Component Registry Showcase
          </p>
          <p style={{
            margin: '0 0 1rem 0',
            color: '#d1d5db',
            fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)'
          }}>
            Built with Next.js, React, TypeScript, and modern web technologies
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'clamp(1rem, 3vw, 2rem)',
            flexWrap: 'wrap',
            fontSize: 'clamp(0.75rem, 2.5vw, 0.875rem)',
            color: '#9ca3af'
          }}>
            <span>🚀 Next.js 15</span>
            <span>⚛️ React 19</span>
            <span>📘 TypeScript 5.9</span>
            <span>🧪 Jest Testing</span>
            <span>🎨 Modern UI</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
