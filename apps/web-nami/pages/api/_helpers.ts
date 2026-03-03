import { NextApiRequest, NextApiResponse } from 'next';
import { createErrorResult, UNAUTHORIZED, httpStatus } from '@namiuy/bff-core';

// Extract Firebase token from Authorization header
export const extractFirebaseToken = (req: NextApiRequest): string | null => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;

  return parts[1];
};

// Middleware to require authentication
export const requireAuth = (
  handler: (req: NextApiRequest, res: NextApiResponse, token: string) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = extractFirebaseToken(req);

    if (!token) {
      return res.status(httpStatus.UNAUTHORIZED).json({
        error: UNAUTHORIZED.message,
      });
    }

    return handler(req, res, token);
  };
};

// Middleware for optional authentication
export const optionalAuth = (
  handler: (req: NextApiRequest, res: NextApiResponse, token: string | null) => Promise<void>
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const token = extractFirebaseToken(req);
    return handler(req, res, token);
  };
};

// Helper to send result responses
export const sendResult = <T>(res: NextApiResponse, result: { data: T | null; error: any | null }) => {
  if (result.error) {
    const status = result.error.httpStatus || httpStatus.SERVER_ERROR;
    return res.status(status).json({
      error: result.error.message,
    });
  }

  return res.status(200).json(result.data);
};

// Helper for method not allowed
export const methodNotAllowed = (res: NextApiResponse, allowedMethods: string[]) => {
  res.setHeader('Allow', allowedMethods.join(', '));
  return res.status(405).json({
    error: `Method not allowed. Allowed methods: ${allowedMethods.join(', ')}`,
  });
};
