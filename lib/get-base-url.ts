import { NextRequest } from 'next/server'

export function getBaseUrl(request?: NextRequest): string {
  // 1. If incoming request is available, prioritize the actual host requested by the user's browser
  if (request) {
    const forwardedHost = request.headers.get('x-forwarded-host')
    const hostHeader = request.headers.get('host')
    const forwardedProto = request.headers.get('x-forwarded-proto')

    let host = (forwardedHost || hostHeader || '').trim()

    if (host) {
      // Replace 0.0.0.0 with localhost for local dev access
      if (host.includes('0.0.0.0')) {
        host = host.replace('0.0.0.0', 'localhost')
      }

      // Determine protocol: if host is localhost / 127.0.0.1 without SSL, default to http
      const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1')
      const proto = forwardedProto || (isLocal ? 'http' : (request.nextUrl?.protocol ? request.nextUrl.protocol.replace(':', '') : 'https'))

      return `${proto}://${host}`
    }

    if (request.nextUrl?.origin) {
      let origin = request.nextUrl.origin
      if (origin.includes('0.0.0.0')) {
        origin = origin.replace('0.0.0.0', 'localhost')
      }
      return origin
    }
  }

  // 2. Fall back to environment variable if configured
  if (process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes('0.0.0.0')) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '')
  }
  if (process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes('0.0.0.0')) {
    return process.env.NEXT_PUBLIC_BASE_URL.replace(/\/$/, '')
  }
  if (process.env.VERCEL_URL && !process.env.VERCEL_URL.includes('0.0.0.0')) {
    const url = process.env.VERCEL_URL.startsWith('http')
      ? process.env.VERCEL_URL
      : `https://${process.env.VERCEL_URL}`
    return url.replace(/\/$/, '')
  }

  // 3. Fallback for server-side execution without request context
  return process.env.NODE_ENV === 'production' ? 'https://shivtirth.com' : 'http://localhost:3000'
}
