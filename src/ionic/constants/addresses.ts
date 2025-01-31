import { Address } from 'viem';
import { base, mode } from 'viem/chains';

export const ADDRESSES: Record<number, Record<string, Address>> = {
  [base.id]: {
    poolLens: '0x6ec80f9aCd960b568932696C0F0bE06FBfCd175a',
    flywheelLensRouter: '0xB1402333b12fc066C3D7F55d37944D5e281a3e8B',
  },
  [mode.id]: {
    poolLens: '0x70BB19a56BfAEc65aE861E6275A90163AbDF36a6',
    flywheelLensRouter: '0x01aB485A0fae0667be36AB876c95ADc1A2a5e449',
  },
};
