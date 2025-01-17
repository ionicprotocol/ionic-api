import { Request, Response, NextFunction } from 'express';
import { isAddress } from 'viem';

export function validateWithdrawRequest(
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  const { poolAddress, amount, privateKey } = req.body;

  // Validate pool address
  if (!poolAddress || !isAddress(poolAddress)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid pool address'
    });
  }

  // Validate amount
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    return res.status(400).json({
      success: false,
      error: 'Invalid amount'
    });
  }

  // Validate private key format
  if (!privateKey || !/^[0-9a-fA-F]{64}$/.test(privateKey)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid private key format'
    });
  }

  next();
} 