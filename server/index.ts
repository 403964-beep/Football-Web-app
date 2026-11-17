import cors from "cors";
import express from "express";
import { clerkMiddleware } from "@clerk/express";
import { publishableKeyFromHost } from "@clerk/shared/keys";
import { createServer as createViteServer } from "vite";
import {
  CLERK_PROXY_PATH,
  clerkProxyMiddleware,
  getClerkProxyHost,
} from "./middlewares/clerkProxyMiddleware.ts";

const app = express();
const port = Number(process.env.PORT || 5000);

// Clerk's proxy needs the raw request body, so mount it before body parsers.
app.use(CLERK_PROXY_PATH, clerkProxyMiddleware());

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  clerkMiddleware((req) => ({
    publishableKey: publishableKeyFromHost(
      getClerkProxyHost(req) ?? "",
      process.env.CLERK_PUBLISHABLE_KEY,
    ),
  })),
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("dist"));
  app.get(/.*/, (_req, res) => res.sendFile("index.html", { root: "dist" }));
} else {
  const vite = await createViteServer({
    configFile: "vite.config.ts",
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
}

app.listen(port, "0.0.0.0", () => {
  console.log(`The Flock Forecast is listening on port ${port}.`);
});
