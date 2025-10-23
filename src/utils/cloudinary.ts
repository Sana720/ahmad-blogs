export function cloudinaryUrl(src: string | undefined | null, width?: number) {
  if (!src) return src || '';
  try {
    const url = new URL(src);
    // If already a cloudinary URL host, inject transformation before /upload/
    if (url.hostname.includes('cloudinary.com') && url.pathname.includes('/upload/')) {
      const parts = url.pathname.split('/upload/');
      const transform = `upload/` + (width ? `w_${width},` : '') + `f_auto,q_auto/`;
      return `${url.origin}${parts[0]}/${transform}${parts[1]}`;
    }
    return src;
  } catch (err) {
    return src;
  }
}
