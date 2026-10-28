import { useState } from "react";
import {
  ChevronLeft,
  MoreHorizontal,
  Share,
  Heart,
  Phone,
  MessageCircle,
  Video,
  Folder,
  Search,
  Copy,
  Check,
} from "lucide-react";
import { RichText } from "../RichText";
import { safeMedia, type Item } from "../schema";
export const nativeDetailApps = new Set([
  "notes",
  "photos",
  "contacts",
  "phone",
  "calendar",
  "files",
  "safari",
]);
export function NativeDetail({
  app,
  item,
  back,
}: {
  app: string;
  item: Item;
  back: () => void;
}) {
    const [favorite, setFavorite] = useState(item.favorite),
  [copied, setCopied] = useState(false),
  [call, setCall] = useState(false),
  [safariSection, setSafariSection] = useState("首页");

  const demonSlayerCharacters = [
    {
      name: "灶门炭治郎",
      desc: "温柔坚毅的鬼杀队剑士",
      symbol: "炭",
      color: "#285b53",
      image: "https://asia.sega.com/kimetsu_hinokami/en/assets/img/sub/character/chara1_thumb.png",
    },
    {
      name: "灶门祢豆子",
      desc: "努力守护人类的鬼",
      symbol: "禰",
      color: "#a84d70",
      image: "https://asia.sega.com/kimetsu_hinokami/en/assets/img/sub/character/chara2_thumb.png",
    },
    {
      name: "我妻善逸",
      desc: "关键时刻爆发的剑士",
      symbol: "雷",
      color: "#b58a24",
      image: "https://asia.sega.com/kimetsu_hinokami/en/assets/img/sub/character/chara3_thumb.png",
    },
    {
      name: "嘴平伊之助",
      desc: "勇猛直率的山中少年",
      symbol: "猪",
      color: "#637c8d",
      image: "https://asia.sega.com/kimetsu_hinokami/en/assets/img/sub/character/chara4_thumb.png",
    },
  ];

  const media = safeMedia(item.media),
    name =
      app === "notes"
        ? "备忘录"
        : app === "contacts"
          ? "通讯录"
          : app === "photos"
            ? "所有照片"
            : app === "phone"
              ? "最近通话"
              : app === "calendar"
                ? "日历"
                : app === "files"
                  ? "浏览"
                  : "书签";
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(item.body);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  return (
    <div className={"native-detail native-detail-" + app}>
      <header className="app-nav">
        <button aria-label="返回" onClick={back}>
          <ChevronLeft size={24} />
          {name}
        </button>
        <strong>{app === "photos" ? item.time.slice(0, 10) : ""}</strong>
        <button aria-label="更多操作" onClick={() => setCopied(!copied)}>
          <MoreHorizontal size={23} />
        </button>
      </header>
      {copied && (
        <div className="native-action-sheet">
          <button onClick={copy}>
            <Copy size={18} />
            复制文字
          </button>
          <button onClick={() => setCopied(false)}>取消</button>
        </div>
      )}
      {app === "photos" ? (
        <>
          <div className="native-photo-stage">
            {media ? (
              <img src={media} alt={item.title} />
            ) : (
              <div className="native-photo-caption">
                <h2>{item.title}</h2>
                <p>{item.body}</p>
              </div>
            )}
          </div>
          <footer className="native-detail-toolbar">
            <button aria-label="分享照片说明" onClick={copy}>
              <Share />
            </button>
            <button
              aria-label="收藏照片"
              onClick={() => setFavorite(!favorite)}
            >
              <Heart fill={favorite ? "#007aff" : "none"} />
            </button>
            <span>{copied ? "已复制" : item.title}</span>
          </footer>
        </>
      ) : app === "contacts" || app === "phone" ? (
        <div className="native-detail-scroll">
          <div className="native-contact-hero">
            <span>{item.title.slice(0, 1)}</span>
            <h1>{item.title}</h1>
          </div>
          <div className="native-contact-actions">
            {[
              [MessageCircle, "信息"],
              [Phone, "呼叫"],
              [Video, "视频"],
            ].map(([Icon, label]) => {
              const Glyph = Icon as typeof Phone;
              return (
                <button key={String(label)} onClick={() => setCall(true)}>
                  <Glyph size={23} />
                  {String(label)}
                </button>
              );
            })}
          </div>
          <div className="native-detail-group">
            <small>手机</small>
            <p className="native-blue">{item.meta.phone || "未设置号码"}</p>
          </div>
          <div className="native-detail-group">
            <small>备注</small>
            <p>{item.body}</p>
          </div>
          {call && (
            <div className="native-detail-group">
              <p>作品内模拟 · {item.title}</p>
              <button onClick={() => setCall(false)}>结束</button>
            </div>
          )}
        </div>
      ) : app === "notes" ? (
        <>
          <div className="native-detail-scroll native-note-paper">
            <time>{item.time}</time>
            <h1>{item.title}</h1>
            <RichText value={item.richText} fallback={item.body} />
          </div>
          <footer className="native-detail-toolbar">
            <button aria-label="返回文件夹" onClick={back}>
              <Folder />
            </button>
            <span />
            <button aria-label="复制备忘录" onClick={copy}>
              {copied ? <Check /> : <Share />}
            </button>
          </footer>
        </>
      ) : app === "calendar" ? (
        <div className="native-detail-scroll native-event-paper">
          <h1>{item.title}</h1>
          <p>{item.time}</p>
          <div className="native-detail-group">
            <small>日程</small>
            <p>{item.body}</p>
          </div>
          {Object.entries(item.meta).map(([k, v]) => (
            <div className="native-detail-group" key={k}>
              <small>{k}</small>
              <p>{v}</p>
            </div>
          ))}
        </div>
      ) : app === "safari" ? (
        <>
          {item.title === "测试内容" ||
          item.title === "鬼灭之刃" ||
          item.meta.url === "kimetsu.local" ? (
            <div
              className="native-detail-scroll"
              style={{
                padding: 0,
                background: "#fff",
                color: "#191919",
                overflowY: "auto",
              }}
            >
              {safariSection === "首页" ? (
                <>
                  <div
                    style={{
                      padding: "28px 20px 24px",
                      background:
                        "linear-gradient(145deg, #171717 0%, #381719 55%, #8b2424 100%)",
                      color: "#fff",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 11,
                        letterSpacing: 3,
                        color: "#f5b9b9",
                        marginBottom: 12,
                      }}
                    >
                      KIMETSU NO YAIBA
                    </div>
                    <h1
                      style={{
                        fontSize: 36,
                        lineHeight: 1.2,
                        margin: "0 0 12px",
                        fontWeight: 900,
                      }}
                    >
                      鬼灭之刃
                    </h1>
                    <p
                      style={{
                        fontSize: 13,
                        lineHeight: 1.9,
                        margin: 0,
                        color: "#f3dddd",
                      }}
                    >
                      跨越黑暗，挥刀守护重要的人。
                    </p>
                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        marginTop: 22,
                        flexWrap: "wrap",
                      }}
                    >
                      {["热血", "冒险", "羁绊"].map((tag) => (
                        <span
                          key={tag}
                          style={{
                            border: "1px solid #ffffff55",
                            borderRadius: 20,
                            padding: "5px 12px",
                            fontSize: 12,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ padding: "22px 18px" }}>
                    <h2 style={{ fontSize: 21, margin: "0 0 12px" }}>
                      故事简介
                    </h2>
                    <p
                      style={{
                        margin: 0,
                        color: "#555",
                        fontSize: 14,
                        lineHeight: 1.9,
                      }}
                    >
                      少年灶门炭治郎的家人遭到鬼袭击，妹妹祢豆子也变成了鬼。
                      为了寻找让妹妹恢复人类的方法，炭治郎加入鬼杀队，
                      踏上了充满挑战的旅程。
                    </p>

                    <h2 style={{ fontSize: 21, margin: "26px 0 14px" }}>
                      主要角色
                    </h2>

                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                        gap: 12,
                      }}
                    >
                      {[
                        {
                          name: "灶门炭治郎",
                          desc: "温柔坚毅的鬼杀队剑士",
                          symbol: "炭",
                          color: "#285b53",
                        },
                        {
                          name: "灶门祢豆子",
                          desc: "努力守护人类的鬼",
                          symbol: "禰",
                          color: "#a84d70",
                        },
                        {
                          name: "我妻善逸",
                          desc: "关键时刻爆发的剑士",
                          symbol: "雷",
                          color: "#b58a24",
                        },
                        {
                          name: "嘴平伊之助",
                          desc: "勇猛直率的山中少年",
                          symbol: "猪",
                          color: "#637c8d",
                        },
                      ].map((character) => (
                        <button
                          key={character.name}
                          onClick={() => setSafariSection(character.name)}
                          style={{
                            padding: 0,
                            textAlign: "left",
                            border: "1px solid #e8e8e8",
                            borderRadius: 14,
                            overflow: "hidden",
                            background: "#fff",
                            color: "#222",
                            cursor: "pointer",
                          }}
                        >
                          <div
                            style={{
                              height: 92,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: `linear-gradient(145deg, ${character.color}, #191919)`,
                              color: "#fff",
                              fontSize: 40,
                              fontWeight: 900,
                            }}
                          >
                            {character.symbol}
                          </div>
                          <div style={{ padding: "11px 10px 13px" }}>
                            <strong
                              style={{
                                display: "block",
                                fontSize: 13,
                                marginBottom: 6,
                              }}
                            >
                              {character.name}
                            </strong>
                            <span
                              style={{
                                display: "block",
                                color: "#777",
                                fontSize: 11,
                                lineHeight: 1.6,
                              }}
                            >
                              {character.desc}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <h2 style={{ fontSize: 21, margin: "26px 0 12px" }}>
                      专题导航
                    </h2>

                    {[
                      ["呼吸法大全", "了解水、雷、炎等呼吸法"],
                      ["鬼杀队", "认识鬼杀队与柱"],
                      ["故事世界", "探索鬼与剑士的世界"],
                    ].map(([title, desc]) => (
                      <button
                        key={title}
                        onClick={() => setSafariSection(title)}
                        style={{
                          width: "100%",
                          padding: "15px 14px",
                          marginBottom: 9,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "flex-start",
                          gap: 5,
                          background: "#f6f6f6",
                          border: "1px solid #ededed",
                          borderRadius: 12,
                          color: "#222",
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        <strong style={{ fontSize: 14 }}>{title}</strong>
                        <span style={{ fontSize: 12, color: "#777" }}>
                          {desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div style={{ padding: 20 }}>
                  <button
                    onClick={() => setSafariSection("首页")}
                    style={{
                      border: 0,
                      background: "transparent",
                      color: "#007aff",
                      padding: "4px 0 18px",
                      fontSize: 15,
                    }}
                  >
                    ‹ 返回专题首页
                  </button>

                  <h1 style={{ fontSize: 27, margin: "8px 0 18px" }}>
                    {safariSection}
                  </h1>

                  {safariSection === "灶门炭治郎" ? (
                    <p style={{ lineHeight: 2, color: "#444" }}>
                      炭治郎善良、坚强且富有同情心。为了保护妹妹祢豆子，
                      他不断磨炼剑术，努力寻找让妹妹恢复人类的方法。
                    </p>
                  ) : safariSection === "灶门祢豆子" ? (
                    <p style={{ lineHeight: 2, color: "#444" }}>
                      祢豆子虽然变成了鬼，却始终努力克制自己，不伤害人类，
                      并与哥哥并肩面对旅途中的危险。
                    </p>
                  ) : safariSection === "我妻善逸" ? (
                    <p style={{ lineHeight: 2, color: "#444" }}>
                      善逸平时胆小又容易害怕，但在关键时刻能够发挥惊人的
                      实力，是炭治郎重要的伙伴。
                    </p>
                  ) : safariSection === "嘴平伊之助" ? (
                    <p style={{ lineHeight: 2, color: "#444" }}>
                      伊之助性格直率、好胜，擅长使用自己创造的兽之呼吸，
                      在战斗中不断成长。
                    </p>
                  ) : safariSection === "呼吸法大全" ? (
                    <div style={{ lineHeight: 2.2, color: "#444" }}>
                      <p>水之呼吸：动作流畅，招式如流水般连贯。</p>
                      <p>雷之呼吸：强调迅捷的突进与爆发。</p>
                      <p>炎之呼吸：以强大的气势和正面攻击著称。</p>
                      <p>兽之呼吸：灵活、野性十足的独特剑技。</p>
                    </div>
                  ) : safariSection === "鬼杀队" ? (
                    <p style={{ lineHeight: 2, color: "#444" }}>
                      鬼杀队是一群与鬼战斗的剑士组织。队员通过训练和任务
                      不断成长，柱则是其中实力出众的剑士。
                    </p>
                  ) : (
                    <p style={{ lineHeight: 2, color: "#444" }}>
                      这是《鬼灭之刃》的专题内容页。你可以返回首页，
                      继续查看角色介绍与其他主题。
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="native-detail-scroll native-reader">
                <h1>{item.title}</h1>
                <RichText value={item.richText} fallback={item.body} />
              </div>
              <footer className="native-reader-address">
                <Search size={16} />
                <span>{item.meta.url || item.title}</span>
                <Share size={18} />
              </footer>
            </>
          )}
        </>
              ) : (
        <div className="native-detail-scroll native-file-preview">
          <Folder size={64} color="#007aff" />
          <h2>{item.title}</h2>
          <p>{item.body}</p>
          <small>{item.time}</small>
          <button onClick={copy}>复制内容</button>
        </div>
      )}
    </div>
  );
}
