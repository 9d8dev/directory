import { bohoAuth } from "bohoauth";

export const boho = bohoAuth({
  password: process.env.BOHO_PASSWORD!,
  secret: process.env.BOHO_SECRET!,
  expiresIn: "3h",
  middleware: {
    loginPath: "/admin/login",
    protectedPaths: ["/admin", "/admin/basic", "/admin/manage"],
    redirectPath: "/admin",
  },
});
