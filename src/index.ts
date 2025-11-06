import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.redirect("https://rust-unofficial.github.io/too-many-lists/");
});

export default app;
