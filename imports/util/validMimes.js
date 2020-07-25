let MimeTypes = {
  imageTypes: ["image/apng", "image/bmp", "image/gif", "image/x-icon", "image/jpeg", "image/png", "image/webp"],
  audioTypes: ["audio/webm", "audio/wave", "audio/wav", "audio/ogg", "audio/opus", "audio/mpeg", "audio/flac", "audio/aac"],
  videoTypes: ["video/x-msvideo", "video/mpeg", "video/ogg", "video/mp4", "video/webm", "video/3gpp", "video/quicktime"]
};

MimeTypes.previewTypes = MimeTypes.imageTypes.concat(MimeTypes.audioTypes.concat(MimeTypes.videoTypes));

export default MimeTypes;