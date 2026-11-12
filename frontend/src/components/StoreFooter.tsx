import { useEffect, useState } from 'react'
import { checkApiHealth } from '../api/health'

export function StoreFooter() {
  const [apiStatus, setApiStatus] = useState<'connected' | 'unavailable'>(
    'unavailable',
  )

  useEffect(() => {
    let active = true

    checkApiHealth()
      .then(() => {
        if (active) setApiStatus('connected')
      })
      .catch(() => {
        if (active) setApiStatus('unavailable')
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <footer className="site-footer" id="footer">
      <div className="footer-main page-width">
        <a className="brand footer-brand" href="#" aria-label="FamilyOfSix home">
          <span className="brand-mark" aria-hidden="true">f<span>✳</span></span>
          <span className="brand-copy">
            <span className="brand-name">FamilyOfSix</span>
            <span className="brand-tagline">HANDMADE WITH HEART</span>
          </span>
        </a>
        <p className="footer-message">Made by hand, shared with love.</p>
        <nav className="footer-nav" aria-label="Footer navigation">
          <a href="#products">Products</a>
          <a href="#collections">Collections</a>
          <a href="#about">Our story</a>
        </nav>
        <p
          className={`api-status api-status-${apiStatus}`}
          role="status"
          aria-live="polite"
        >
          <span className="api-status-dot" aria-hidden="true" />
          API {apiStatus === 'connected' ? 'Connected' : 'Unavailable'}
        </p>
      </div>
      <div className="footer-bottom">
        <p>© 2026 FamilyOfSix. Placeholder copyright text.</p>
        <p>Thanks for stopping by <span aria-hidden="true">♡</span></p>
      </div>
    </footer>
  )
}
