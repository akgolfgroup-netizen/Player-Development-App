import { Router } from "express";
import { requireFeature } from "../middleware/requireFeature";

const router = Router();

// TODO: Implement these functions with actual database calls
async function loadCoachPlayers(coachId: string) {
  return [];
}

async function loadCoachAlerts(coachId: string) {
  return [];
}

router.get(
  "/coach/players",
  requireFeature("player_overview"),
  async (req, res) => {
    const players = await loadCoachPlayers(req.user.id);
    res.json(players);
  }
);

router.get(
  "/coach/alerts",
  requireFeature("team_alerts"),
  async (req, res) => {
    const alerts = await loadCoachAlerts(req.user.id);
    res.json({ alerts });
  }
);

export default router;
