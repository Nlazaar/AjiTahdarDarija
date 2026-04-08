"use client"
import React from 'react'

interface Props { children: React.ReactNode }
interface State { hasError: boolean; message: string | null }

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, message: null }
  }

  static getDerivedStateFromError(err: Error): State {
    return { hasError: true, message: err.message ?? 'Erreur inconnue' }
  }

  componentDidCatch(err: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught error:', err, info.componentStack)
    // Sentry sera injecté ici si configuré
    if (typeof window !== 'undefined' && (window as any).__SENTRY__) {
      (window as any).__SENTRY__.captureException(err)
    }
  }

  componentDidMount() {
    window.addEventListener('unhandledrejection', this.handleRejection)
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleRejection)
  }

  private handleRejection = (e: PromiseRejectionEvent) => {
    const msg = e?.reason?.message ?? String(e?.reason ?? '')
    if (!msg || msg.includes('ResizeObserver') || msg.includes('Script error') ||
        msg.includes('NEXT_REDIRECT') || msg.includes('NEXT_NOT_FOUND')) return
    console.error('[ErrorBoundary] Unhandled rejection:', msg)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: '#0f1923', padding: '32px',
        }}>
          <div style={{
            maxWidth: '480px', width: '100%', textAlign: 'center',
            background: '#1a2530', borderRadius: '20px', padding: '40px 32px',
            border: '2px solid #3a1e1e',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
            <h2 style={{ fontSize: '22px', fontWeight: '900', color: '#ffffff', marginBottom: '12px' }}>
              Une erreur inattendue est survenue
            </h2>
            <p style={{
              fontSize: '13px', fontFamily: 'monospace', color: '#ff6b6b',
              background: '#3a1e1e', borderRadius: '8px', padding: '12px',
              marginBottom: '24px', wordBreak: 'break-word',
            }}>
              {this.state.message}
            </p>
            <button
              onClick={() => { this.setState({ hasError: false, message: null }); location.reload() }}
              style={{
                background: '#1cb0f6', color: '#ffffff', border: 'none',
                borderRadius: '12px', padding: '12px 32px',
                fontWeight: '700', fontSize: '15px', cursor: 'pointer',
              }}
            >
              Recharger la page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
