import { Router, type IRouter } from "express";
import { SubmitContactBody, SubmitContactResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact", (req, res): void => {
  const parsed = SubmitContactBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // MVP: no persistence layer yet for contact messages. Log for visibility;
  // a future iteration can add a `contact_messages` table or forward to an
  // email/notification service without changing this route's contract.
  req.log.info(
    { name: parsed.data.name, email: parsed.data.email },
    "Contact form submission received",
  );

  res.status(201).json(SubmitContactResponse.parse({ success: true }));
});

export default router;
