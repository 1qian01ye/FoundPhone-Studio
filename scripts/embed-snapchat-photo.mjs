
import fs from "node:fs";

const storyPath = "stories/template/story.json";

const photos = [
  "public/snapchat-photo.jpg",
  "public/snapchat-photo-2.jpg",
  "public/snapchat-photo-3.jpg",
  "public/snapchat-photo-4.jpg",
  "public/memory-photo-1.jpg",
  "public/memory-photo-2.jpg",
  "public/memory-photo-3.jpg",
  "public/memory-photo-4.jpg",
  "public/memory-photo-5.jpg",
  "public/memory-photo-6.jpg",
  "public/memory-photo-7.jpg",
  "public/memory-photo-8.jpg",
];

const story = JSON.parse(fs.readFileSync(storyPath, "utf8"));

if (!story.content?.snapchat || story.content.snapchat.length < photos.length) {
  throw new Error(
    `Snapchat 快拍数量不足：需要至少 ${photos.length} 条，请先在 story.json 中添加 4 条快拍数据`,
  );
}

photos.forEach((imagePath, index) => {
  if (!fs.existsSync(imagePath)) {
    throw new Error(`找不到照片：${imagePath}`);
  }

  const image = fs.readFileSync(imagePath);
  const ext = imagePath.split(".").pop()?.toLowerCase();

  const mime =
    ext === "png"
      ? "image/png"
      : ext === "webp"
        ? "image/webp"
        : "image/jpeg";

  const media = `data:${mime};base64,${image.toString("base64")}`;

  story.content.snapchat[index].media = media;
  story.content.snapchat[index].kind = "image";
});

fs.writeFileSync(
  storyPath,
  JSON.stringify(story, null, 2) + "\n",
  "utf8",
);

console.log(`已将 ${photos.length} 张 Snapchat 照片转换为内嵌 Base64 格式`);
