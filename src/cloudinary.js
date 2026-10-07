export async function uploadImage(file) {
  const e = import.meta.env, fd = new FormData();
  fd.append("file", file); fd.append("upload_preset", e.VITE_CLOUDINARY_UPLOAD_PRESET); fd.append("folder", "trendspot");
  const r = await fetch(`https://api.cloudinary.com/v1_1/${e.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: fd });
  if (!r.ok) throw new Error("Image upload failed. Check your Cloudinary cloud name and unsigned preset.");
  return (await r.json()).secure_url;
}
// Serve resized, optimised images from Cloudinary
export const thumb = (url, w = 800) => url && url.includes("res.cloudinary.com") ? url.replace("/upload/", `/upload/f_auto,q_auto,w_${w}/`) : url;
