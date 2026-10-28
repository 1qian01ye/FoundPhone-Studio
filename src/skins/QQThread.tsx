import {
  ChevronLeft,
  Menu,
  Image,
  Camera,
  Mic,
  Smile,
  Plus,
  Check,
  Video,
  Gamepad2,
  ArrowRight,
} from "lucide-react";
import { NativeComposer } from "../DeviceSystem";
import { Avatar, Media, meta, type Props } from "./shared";
import "./qq-detail.css";
export function QQThread(p: Props) {
  const [panel, setPanel] = useState("");
  const messages = p.items.filter(
    (i) => i.title === p.thread && i.folder !== "空间" && i.kind !== "post",
  );
  const read = (i: (typeof messages)[number]) =>
    p.creator || i.password ? p.onItem(i) : p.onRead(i.id);
  return (
    <div className="qq-native-thread">
      <header className="qq-thread-nav">
        <button aria-label="返回QQ消息" onClick={() => p.onThread("")}>
          <ChevronLeft size={26} />
        </button>
        <div>
          <strong>{p.thread}</strong>
          <small>{meta(messages.at(-1), "status", "聊天")}</small>
        </div>
        <button
          aria-label="QQ聊天信息"
          onClick={() => setPanel(panel ? "" : "聊天信息")}
        >
          <Menu size={24} />
        </button>
      </header>
      <div className="qq-thread-messages">
        {messages.map((i, n) => {
          const quoted = messages.find((x) => x.id === i.meta.replyTo),
  quote = i.meta.reply || quoted?.body;

const gameInvite = i.body.includes("delta-squad.invalid")
  ? {
      name: "三角洲行动",
      description: "邀请你加入小队",
      color: "#d6e5d2",
      game: "delta",
    }
  : i.body.includes("peace-squad.invalid")
    ? {
        name: "和平精英",
        description: "邀请你一起游戏",
        color: "#d5e9ff",
        game: "peace",
      }
    : null;
          return (
            <div key={i.id}>
              {(n === 0 ||
  i.time.slice(0, 10) !== messages[n - 1].time.slice(0, 10) ||
  i.time.slice(-5) !== messages[n - 1].time.slice(-5)) && (
  <time className="qq-message-time">
    {(() => {
      const match = i.time.match(
        /^(?:\d{4}-)?(\d{1,2})-(\d{1,2})\s+(\d{1,2}:\d{2})$/,
      );

      if (match) {
        return `${Number(match[1])}月${Number(match[2])}日 ${match[3]}`;
      }

      return i.time;
    })()}
  </time>
)}
              <div
                className={
                  "qq-native-message " + (i.outgoing ? "outgoing" : "")
                }
              >
                <Avatar name={i.sender} src={i.avatar} />
                <div className="qq-message-stack">
                  {i.meta.badge && <small>{i.meta.badge}</small>}
                  <button
                    className={
                      "qq-native-bubble " +
                      (i.kind === "transfer" ? "qq-transfer-bubble" : "")
                    }
                    onClick={() => read(i)}
                  >
                    {i.kind === "transfer" ? (
                      <>
                        <div className="qq-transfer-top">
                          <span>
                            <Check size={25} />
                          </span>
                          <div>
                            <strong>
                              ¥
                              {meta(
                                i,
                                "amount",
                                /^\d+(\.\d+)?$/.test(i.body) ? i.body : "—",
                              )}
                            </strong>
                            <p>转账</p>
                          </div>
                        </div>
                        <footer>
                          {meta(i, "transferStatus", "转账记录")}
                          <small>QQ支付</small>
                        </footer>
                      </>
                    ) : (
                      <>
                        {quote && (
                          <span className="qq-message-quote">
                            <b>
                              {i.meta.replySender || quoted?.sender || "引用"}
                            </b>
                            <span>{quote}</span>
                          </span>
                        )}
                        {["image", "video", "audio"].includes(i.kind) ? (
  <Media item={i} />
) : gameInvite ? (
  <div className="qq-game-invite">
    <div className="qq-game-invite-main">
      <div
        className={`qq-game-invite-icon ${gameInvite.game}`}
        style={{ backgroundColor: gameInvite.color }}
      >
        <Gamepad2 size={32} color="#263746" />
      </div>

      <div className="qq-game-invite-info">
        <strong>{gameInvite.name}</strong>
        <span>{gameInvite.description}</span>
      </div>
    </div>

    <div className="qq-game-invite-footer">
      <span>游戏邀请</span>
      <span className="qq-game-invite-action">
        加入游戏 <ArrowRight size={15} />
      </span>
    </div>
  </div>
) : (
  i.body
)}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {!messages.length && <p className="qq-thread-empty">暂无消息</p>}
      </div>
      <div className="qq-native-composer">
        <NativeComposer creator={p.creator} onAdd={p.onAdd} />
        <div>
          {[
            [Mic, "语音"],
            [Image, "图片"],
            [Camera, "相机"],
            [Video, "视频"],
            [Smile, "表情"],
            [Plus, "更多"],
          ].map(([Icon, label]) => {
            const Glyph = Icon as typeof Mic;
            return (
              <button
                aria-label={"QQ" + label}
                key={String(label)}
                onClick={() => setPanel(panel === label ? "" : String(label))}
              >
                <Glyph size={26} />
              </button>
            );
          })}
        </div>
      </div>
      {panel && (
        <div className="qq-thread-sheet">
          <header>
            <button onClick={() => setPanel("")}>
              <ChevronLeft />
              返回
            </button>
            <strong>{panel}</strong>
          </header>
          {panel === "聊天信息" ? (
            <div className="qq-member-list">
              {[...new Set(messages.map((i) => i.sender))].map((name) => (
                <div key={name}>
                  <Avatar name={name} />
                  <span>{name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="qq-media-picker">
              {messages
                .filter((i) => ["image", "audio", "video"].includes(i.kind))
                .map((i) => (
                  <button key={i.id} onClick={() => read(i)}>
                    <Media item={i} />
                    <span>
                      {i.kind === "audio"
                        ? "语音"
                        : i.kind === "image"
                          ? "图片"
                          : "视频"}
                    </span>
                  </button>
                ))}
              {!messages.some((i) =>
                ["image", "audio", "video"].includes(i.kind),
              ) && <p>暂无内容</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
