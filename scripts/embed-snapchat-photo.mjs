
import fs from "node:fs";

const imagePath = "public/snapchat-photo.jpg";
const storyPath = "stories/template/story.json";

const image = fs.readFileSync(imagePath);
const base64 = image.toString("base64");
const media = `data:image/jpeg;base64,${base64}`;

const story = JSON.parse(fs.readFileSync(storyPath, "utf8"));

if (!story.content?.snapchat?.length) {
  throw new Error("没有找到 content.snapchat 数据");
}

story.content.snapchat[0].media = media;
story.content.snapchat[0].kind = "image";

fs.writeFileSync(
  storyPath,
  JSON.stringify(story, null, 2) + "\n",
  "utf8",
);

console.log("已将 Snapchat 图片转换为内嵌 Base64 格式");
