// Chỉ nhận link YouTube / Vimeo / Google Drive và tự dựng URL embed từ ID,
// không nhận nguyên iframe từ người dùng (tránh chèn HTML lạ).
export function getVideoEmbedUrl(input: string | null | undefined): string | null {
  if (!input) return null;
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;

  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");

  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return youtubeEmbed(id);
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") return youtubeEmbed(url.searchParams.get("v"));
    const match = url.pathname.match(/^\/(embed|shorts|live)\/([^/]+)$/);
    if (match) return youtubeEmbed(match[2]);
    return null;
  }
  if (host === "vimeo.com") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    if (id && /^\d+$/.test(id)) return `https://player.vimeo.com/video/${id}`;
    return null;
  }
  if (host === "drive.google.com") {
    const match = url.pathname.match(/^\/file\/d\/([^/]+)/);
    if (match && /^[A-Za-z0-9_-]{10,}$/.test(match[1])) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
    return null;
  }
  return null;
}

function youtubeEmbed(id: string | null | undefined): string | null {
  if (!id || !/^[A-Za-z0-9_-]{6,}$/.test(id)) return null;
  return `https://www.youtube-nocookie.com/embed/${id}`;
}
