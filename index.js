const ytdl = require("ytdl-core");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");

ffmpeg.setFfmpegPath(ffmpegInstaller.path);

const musicDir = path.join(__dirname, "music");
if (!fs.existsSync(musicDir)) {
  fs.mkdirSync(musicDir);
}

const sanitizeFilename = (name) => {
  return name.replace(/[^a-z0-9]/gi, "_").toLowerCase();
};

const downloadAndConvertToMP3 = async (link) => {
  try {
    const info = await ytdl.getInfo(link);
    const title = sanitizeFilename(info.videoDetails.title);
    const outputPath = path.join(musicDir, `${title}.mp3`);

    const stream = ytdl.downloadFromInfo(info, { quality: "highestaudio" });

    stream.on("error", (err) => {
      console.error("Error in ytdl stream:", err);
    });

    const ffmpegProcess = ffmpeg(stream)
      .audioCodec("libmp3lame")
      .format("mp3")
      .on("error", (err) => {
        console.error("Error in ffmpeg process:", err);
      })
      .on("end", () => {
        console.log(`Download and conversion completed: ${outputPath}`);
      });

    ffmpegProcess.pipe(fs.createWriteStream(outputPath), { end: true });
  } catch (error) {
    console.error("Error downloading or converting video:", error);
  }
};
// HERE Add here your list of links in this array.
const links = [
  "https://www.youtube.com/watch?v=1YyAzVmP9xQ",
  "https://www.youtube.com/watch?v=XvGxb1-YpQE",
];
// HERE Add here your list of links in this array.

links.forEach((link) => {
  downloadAndConvertToMP3(link);
});
