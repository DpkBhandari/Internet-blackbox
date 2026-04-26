import { z } from 'zod'

// ── Auth validators ────────────────────────────────────────────────
export const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().email().toLowerCase(),
  password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)/, 'Must contain letters and numbers'),
  role: z.enum(['user', 'researcher']).optional().default('user'),
  institution: z.string().trim().max(200).optional(),
  researchFocus: z.string().trim().max(300).optional(),
})

export const loginSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string().min(1),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)/),
})

export const resetPasswordSchema = z.object({
  password: z.string().min(8).regex(/^(?=.*[A-Za-z])(?=.*\d)/),
})

// ── Content validators ─────────────────────────────────────────────
const CONTENT_CATEGORIES = [
  'Politics', 'Health', 'Technology', 'Entertainment',
  'Education', 'Economy', 'Environment', 'Science', 'Sports', 'General',
] as const

export const analyzeContentSchema = z.object({
  text: z.string().min(10).max(100000).optional(),
  url: z.string().url().optional(),
  source: z.string().trim().max(100).optional().default('manual'),
  category: z.enum(CONTENT_CATEGORIES).optional().default('General'),
  isPublic: z.boolean().optional().default(false),
  tags: z.array(z.string().trim().max(30)).max(10).optional().default([]),
}).refine(data => data.text || data.url, { message: 'Provide text or url' })

export const batchAnalyzeSchema = z.object({
  texts: z.array(z.string().min(10).max(100000)).min(1).max(100),
  source: z.string().trim().max(100).optional().default('batch'),
  category: z.enum(CONTENT_CATEGORIES).optional().default('General'),
})

export const contentQuerySchema = z.object({
  page: z.string().optional().transform(v => Math.max(1, parseInt(v || '1'))),
  limit: z.string().optional().transform(v => Math.min(100, parseInt(v || '20'))),
  category: z.enum(CONTENT_CATEGORIES).optional(),
  misinfo: z.enum(['true', 'false']).optional(),
  label: z.enum(['positive', 'negative', 'neutral']).optional(),
  platform: z.string().optional(),
  source: z.string().optional(),
  days: z.string().optional().transform(v => v ? parseInt(v) : undefined),
  sort: z.string().optional(),
})

// ── Report validators ──────────────────────────────────────────────
export const createReportSchema = z.object({
  type: z.enum(['sentiment', 'viral', 'misinfo', 'full', 'custom']),
  period: z.string().min(1),
  category: z.enum([...CONTENT_CATEGORIES, 'all']).optional().default('all'),
  format: z.enum(['pdf', 'csv', 'json', 'xlsx']).optional().default('pdf'),
  title: z.string().trim().max(200).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
})

// ── Admin validators ───────────────────────────────────────────────
export const updateUserSchema = z.object({
  status: z.enum(['active', 'suspended', 'pending', 'banned']).optional(),
  role: z.enum(['superadmin', 'admin', 'researcher', 'user']).optional(),
  institution: z.string().trim().max(200).optional(),
  researchFocus: z.string().trim().max(300).optional(),
})

// ── Scraper validators ─────────────────────────────────────────────
export const scraperSchema = z.object({
  source: z.string().trim().default('newsapi'),
  category: z.enum(CONTENT_CATEGORIES).optional().default('General'),
  limit: z.number().int().min(1).max(100).optional().default(20),
})

// ── Zod middleware factory ─────────────────────────────────────────
import { Request, Response, NextFunction } from 'express'

export const zodValidate = (schema: z.ZodSchema, target: 'body' | 'query' | 'params' = 'body') =>
  (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target])
    if (!result.success) {
      return res.status(422).json({
        success: false,
        message: 'Validation failed',
        errors: result.error.errors.map(e => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      })
    }
    req[target] = result.data
    next()
  }
