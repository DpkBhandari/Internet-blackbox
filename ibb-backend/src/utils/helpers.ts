import { Response } from 'express'
import { ApiResponse, PaginationOptions } from '../types'

// ── Standard response senders ─────────────────────────────────────
export const sendSuccess = <T>(
  res: Response,
  data: T,
  message = 'Success',
  status = 200,
  extra?: Record<string, any>
): void => {
  res.status(status).json({ success: true, message, data, ...extra } satisfies ApiResponse<T>)
}

export const sendError = (
  res: Response,
  message: string,
  status = 400,
  error?: string
): void => {
  res.status(status).json({ success: false, message, error } satisfies ApiResponse)
}

export const sendPaginated = <T>(
  res: Response,
  data: T[],
  total: number,
  options: PaginationOptions,
  message = 'Success'
): void => {
  const pages = Math.ceil(total / options.limit)
  res.json({
    success: true,
    message,
    data,
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      pages,
      hasNext: options.page < pages,
      hasPrev: options.page > 1,
    },
  } satisfies ApiResponse<T[]>)
}

// ── Pagination parser ─────────────────────────────────────────────
export const parsePagination = (query: Record<string, any>): PaginationOptions => ({
  page: Math.max(1, parseInt(query.page ?? '1', 10)),
  limit: Math.min(100, Math.max(1, parseInt(query.limit ?? '20', 10))),
  sort: query.sort ?? '-createdAt',
})

// ── Async wrapper (belt-and-suspenders on top of express-async-errors) ──
export const asyncHandler = (fn: Function) =>
  (req: any, res: Response, next: any) =>
    Promise.resolve(fn(req, res, next)).catch(next)

// ── Generate random token ─────────────────────────────────────────
export const randomToken = (length = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

// ── Sleep helper ──────────────────────────────────────────────────
export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// ── Sanitise text for storage ─────────────────────────────────────
export const sanitiseText = (text: string): string =>
  text.trim().replace(/\s+/g, ' ').substring(0, 100000)

// ── Build MongoDB sort from query string ──────────────────────────
export const buildSort = (sort?: string): Record<string, 1 | -1> => {
  if (!sort) return { createdAt: -1 }
  const parts = sort.split(',')
  const result: Record<string, 1 | -1> = {}
  for (const p of parts) {
    if (p.startsWith('-')) result[p.slice(1)] = -1
    else result[p] = 1
  }
  return result
}

// ── Build MongoDB date range filter ──────────────────────────────
export const buildDateFilter = (days?: number | string, from?: string, to?: string) => {
  const filter: Record<string, any> = {}
  if (days) filter.$gte = new Date(Date.now() - Number(days) * 86400000)
  if (from) filter.$gte = new Date(from)
  if (to) filter.$lte = new Date(to)
  return Object.keys(filter).length ? { createdAt: filter } : {}
}
