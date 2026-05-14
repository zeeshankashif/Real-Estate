const TOKEN_KEY = "zexan_token";

/** Empty in dev (CRA proxy). Set REACT_APP_API_URL when the API is on another origin. */
const API_ORIGIN = (process.env.REACT_APP_API_URL || "").replace(/\/$/, "");

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(t) {
  if (t) localStorage.setItem(TOKEN_KEY, t);
  else localStorage.removeItem(TOKEN_KEY);
}

export async function api(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const url = `${API_ORIGIN}/api${path}`;
  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { error: text };
  }
  if (!res.ok) throw new Error(data?.error || res.statusText || "Request failed");
  return data;
}

export function mapProperty(p) {
  if (!p) return null;
  const id = p._id || p.id;
  return {
    id: String(id),
    _id: String(id),
    title: p.title,
    location: p.location,
    price: p.price,
    priceShort: p.priceShort,
    type: p.type,
    beds: p.beds,
    baths: p.baths,
    area: p.area,
    tag: p.tag,
    img: p.img,
    agent: p.agent,
    agentImg: p.agentImg,
    description: p.description || "",
    owner: p.owner,
  };
}
