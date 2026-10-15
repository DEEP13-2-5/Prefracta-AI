import dns from "node:dns/promises";
import net from "node:net";

const privateV4 = (ip) => {
  const [a, b] = ip.split(".").map(Number);
  return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168);
};
const privateAddress = (address) => {
  if (net.isIP(address) === 4) return privateV4(address);
  const value = address.toLowerCase();
  return value === "::1" || value.startsWith("fc") || value.startsWith("fd") || value.startsWith("fe80:");
};

export const validateAuthorizedTarget = async (rawUrl, authorized) => {
  if (authorized !== true) throw new Error("Confirm that you own or are authorized to test this target.");
  let target;
  try { target = new URL(rawUrl); } catch { throw new Error("A valid HTTP(S) target URL is required."); }
  if (!["http:", "https:"].includes(target.protocol) || target.username || target.password) throw new Error("Only credential-free HTTP(S) URLs can be scanned.");
  const host = target.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || privateAddress(host)) throw new Error("Private, local, and loopback targets are blocked for scanner safety.");
  let addresses;
  try { addresses = await dns.lookup(host, { all: true, verbatim: true }); } catch { throw new Error("Target host could not be resolved."); }
  if (!addresses.length || addresses.some(({ address }) => privateAddress(address))) throw new Error("Target resolves to a private or restricted network address.");
  return target.toString();
};
