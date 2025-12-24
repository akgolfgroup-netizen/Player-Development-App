import { Request, Response, NextFunction } from "express";
import { hasFeature } from "../domain/subscription/access";

export function requireFeature(feature: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const tier = req.user.subscriptionTier;

    if (!hasFeature(tier, feature)) {
      return res.status(403).json({
        error: "FEATURE_LOCKED",
        feature,
      });
    }

    next();
  };
}
