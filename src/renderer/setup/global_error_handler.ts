import { getLogger } from '../lib/utils'

const log = getLogger('GlobalErrorHandler')

// Global error handler for unhandled errors
window.addEventListener('error', (event) => {
  log.error('Global error caught:', event.error)
})

// Global handler for unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  log.error('Unhandled promise rejection:', event.reason)

  // Prevent the default behavior (console error)
  // event.preventDefault()
})

// Console error interceptor (optional, for additional logging)
const originalConsoleError = console.error

console.error = (...args: unknown[]) => {
  // Still call the original console.error
  originalConsoleError.apply(console, args)
}

log.info('Global error handlers initialized')
