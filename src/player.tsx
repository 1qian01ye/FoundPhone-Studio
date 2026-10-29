import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Phone } from "./Phone";
import { validateWork, type Work } from "./schema";
import "./styles.css";
function Player() {
  const [work, setWork] = useState<Work | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    fetch("./work.json")
      .then((r) => {
        if (!r.ok) throw Error("缺少 work.json");
        return r.json();
      })
      
.then((x) => {
  const w = validateWork(x);

  console.log(
    "[播放器 B 站媒体检查]",
    w.data["Bilibili"]?.map((item) => ({
      id: item.id,
      title: item.title,
      kind: item.kind,
      media: item.media,
    })),
  );

  document.title = w.title;
  setWork(w);
})
      .catch((e) => setError(String(e)));
  }, []);
  return (
    <main className="standalone-player">
      {work ? (
        <>
          <div className="player-title">
            <h1>{work.title}</h1>
          </div>
          <Phone work={work} />
          <p className="player-footnote">
            {work.description}
            <br />
            进度保存在此浏览器 · FoundPhone Studio
          </p>
        </>
      ) : (
        <p>{error || "正在打开故事…"}</p>
      )}
    </main>
  );
}
createRoot(document.getElementById("root")!).render(<Player />);
