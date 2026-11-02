import { NativeComposer } from "./DeviceSystem";
import { useSkinState } from "./skinState";
import { useState } from "react";
import {
  ChevronLeft,
  Plus,
  CirclePlus,
  Search,
  MessageCircle,
  Users,
  Compass,
  User,
  Camera,
  Phone,
  Video,
  Settings,
  Heart,
  Send,
  Home,
  Play,
  Bookmark,
  MoreHorizontal,
  Mic,
  Smile,
  Grid,
  CheckCheck,
  AtSign,
  Star,
  Music,
  Image as ImageIcon,
  Layers,
  ShoppingBag,
} from "lucide-react";
import { safeMedia, type Item, type UiValue } from "./schema";
export type SkinProps = {
  ui?: Record<string, UiValue>;
  onUi?: (key: string, value: UiValue) => void;
  appId?: string;
  owner?: string;
  virtualTime?: string;
  name: string;
  items: Item[];
  creator: boolean;
  onRead: (id: string) => void;
  onItem: (i: Item) => void;
  onAdd: () => void;
  onSendMessage?: (body: string) => void;
  onBack: () => void;
  thread: string;
  onThread: (s: string) => void;
};

function Avatar({
  name,
  round = false,
  src = "",
}: {
  name: string;
  round?: boolean;
  src?: string;
}) {
  const avatarFiles: Record<string, string> = {
    "陈璟翊": "/FoundPhone-Studio/陈璟翊.jpg",
    "陈燊": "/FoundPhone-Studio/陈燊.jpg",
    "Father": "/FoundPhone-Studio/Father.jpg",
    "侯王子": "/FoundPhone-Studio/侯王子.jpg",
    "胡阿米": "/FoundPhone-Studio/胡阿米.jpg",
    "刘瀚辰": "/FoundPhone-Studio/刘瀚辰.jpg",
    "刘禹辰": "/FoundPhone-Studio/刘禹辰.jpg",
    "吕政熙": "/FoundPhone-Studio/吕政熙.jpg",
    "Mother": "/FoundPhone-Studio/Mother.jpg",
    "皮子渝": "/FoundPhone-Studio/皮子渝.jpg",
    "任玄哲": "/FoundPhone-Studio/任玄哲.jpg",
    "沈子航": "/FoundPhone-Studio/沈子航.jpg",
    "时代峰峻": "/FoundPhone-Studio/时代峰峻.jpg",
    "宋金泽": "/FoundPhone-Studio/宋金泽.jpg",
    "佟弋": "/FoundPhone-Studio/佟弋.jpg",
    "魏新航": "/FoundPhone-Studio/魏新航.jpg",
    "小胖": "/FoundPhone-Studio/小胖.jpg",
    "杨林好": "/FoundPhone-Studio/杨林好.jpg",
    "杨云皓": "/FoundPhone-Studio/杨云皓.jpg",
    "杨子豪": "/FoundPhone-Studio/杨子豪.jpg",
    "余政霖": "/FoundPhone-Studio/余政霖.jpg",
    "越艺晨": "/FoundPhone-Studio/越艺晨.jpg",
    "张誉严": "/FoundPhone-Studio/张誉严.jpg",
    "赵俊羽": "/FoundPhone-Studio/赵俊羽.jpg",
    "智恩涵": "/FoundPhone-Studio/智恩涵.jpg",
    "朱映宸": "/FoundPhone-Studio/朱映宸.jpg",
  };

  const imageSrc = src || avatarFiles[name];

  return (
    <span className={`skin-avatar ${round ? "round" : ""}`}>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt=""
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        name.slice(0, 1)
      )}
    </span>
  );
}
function ItemMedia({ item }: { item: Item }) {
  const src = safeMedia(item.media);
  return src ? (
    item.kind === "audio" ? (
      <audio controls src={src} />
    ) : item.kind === "video" ? (
      <video controls playsInline src={src} />
    ) : (
      <img loading="lazy" alt={item.title} src={src} />
    )
  ) : (
    <div className="skin-photo">
      <span>{item.title}</span>
    </div>
  );
}
function MessageList({
  items,
  creator,
  onItem,
  onRead,
  whatsapp = false,
}: {
  items: Item[];
  creator: boolean;
  onItem: (i: Item) => void;
  onRead: (id: string) => void;
  whatsapp?: boolean;
}) {
  return (
    <div className={`skin-messages ${whatsapp ? "wa-wallpaper" : ""}`}>
      <div className="skin-date">
  {items[0]?.time
    ? `${Number(items[0].time.slice(5, 7))}月${Number(items[0].time.slice(8, 10))}日 ${items[0].time.slice(11, 16)}`
    : ""}
</div>
      {items.map((i) => (
        <div
          key={i.id}
          className={`skin-message ${i.outgoing ? "outgoing" : ""}`}
        >
          {!whatsapp && !i.outgoing && (
            <Avatar name={i.sender} src={i.avatar} />
          )}
          <button
            className="skin-bubble"
            onClick={() => (creator ? onItem(i) : onRead(i.id))}
          >
            {["image", "audio", "video"].includes(i.kind) ? (
              <ItemMedia item={i} />
            ) : i.kind === "transfer" ? (
              <div className="skin-transfer">
                ¥ {i.body}
                <small>转账记录 · 虚构</small>
              </div>
            ) : (
              i.body
            )}
            <small className={whatsapp ? undefined : "wx-message-time"}>
              {i.time.slice(-5)}{" "}
              {whatsapp && i.outgoing && <CheckCheck size={11} />}
            </small>
          </button>
          {!whatsapp && i.outgoing && <Avatar name={i.sender} src={i.avatar} />}
        </div>
      ))}
    </div>
  );
}
function Compose({
  creator,
  onAdd,
  onSend,
  wa = false,
}: {
  creator: boolean;
  onAdd: () => void;
  onSend?: (body: string) => void;
  wa?: boolean;
}) {
  const [value, setValue] = useState("");

  const send = () => {
    const body = value.trim();
    if (!body) return;

    onSend?.(body);
    setValue("");
  };

  return (
    <div className={`skin-compose ${wa ? "wa-compose" : ""}`}>
      {wa ? <Plus size={20} /> : <Mic size={20} />}

      {creator ? (
        <NativeComposer creator={creator} onAdd={onAdd} />
      ) : (
        <>
          <input
            className="native-compose-field"
            aria-label="输入消息"
            placeholder="输入消息"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") send();
            }}
          />
          {value.trim() ? (
            <button type="button" onClick={send}>
              发送
            </button>
          ) : (
            <Smile size={21} />
          )}
        </>
      )}

      {wa ? <Mic size={20} /> : <Plus size={22} />}
    </div>
  );
}
export function WeChatSkin(p: SkinProps) {
  const [tab, setTab] = useState("微信"),
    [query, setQuery] = useState(""),
    [moments, setMoments] = useState(false),
    [menu, setMenu] = useState(false),
    [searchOpen, setSearchOpen] = useState(false),
    [utility, setUtility] = useState("");
  const [readThreads, setReadThreads] = useSkinState<string[]>(
    p,
    "readThreads",
    [],
  );
  const conversations = [
  ...new Set([
    ...p.items
      .filter((i) => !["朋友圈", "我"].includes(i.folder))
      .map((i) => i.title),
    "五五不呜呜",
  ]),
];
  
const contacts = [
{ name: "陈璟翊", initial: "C" },
{ name: "陈燊", initial: "C" },
{ name: "Father", initial: "F" },
{ name: "侯王子", initial: "H" },
{ name: "胡阿米", initial: "H" },
{ name: "刘瀚辰", initial: "L" },
{ name: "刘禹辰", initial: "L" },
{ name: "吕政熙", initial: "L" },
{ name: "Mother", initial: "M" },
{ name: "皮子渝", initial: "P" },
{ name: "任玄哲", initial: "R" },
{ name: "沈子航", initial: "S" },
{ name: "时代峰峻", initial: "S" },
{ name: "宋金泽", initial: "S" },
{ name: "佟弋", initial: "T" },
{ name: "魏新航", initial: "W" },
{ name: "小胖", initial: "X" },
{ name: "杨林好", initial: "Y" },
{ name: "杨云皓", initial: "Y" },
{ name: "杨子豪", initial: "Y" },
{ name: "余政霖", initial: "Y" },
{ name: "越艺晨", initial: "Y" },
{ name: "张誉严", initial: "Z" },
{ name: "赵俊羽", initial: "Z" },
{ name: "智恩涵", initial: "Z" },
{ name: "朱映宸", initial: "Z" },
];

  const posts = p.items.filter(
    (i) => i.folder === "朋友圈" || i.kind === "post",
  );
  return (
    <div
      className="wechat-ui independent-skin"
      data-tab={tab}
      data-thread={!!p.thread}
      data-moments={moments}
      data-utility={!!utility}
    >
      <div className="app-nav wx-nav">
        <button
          aria-label={utility || p.thread || moments ? "返回" : "收藏"}
          onClick={() =>
            utility
              ? setUtility("")
              : p.thread
                ? p.onThread("")
                : moments
                  ? setMoments(false)
                  : setUtility("收藏")
          }
        >
          {utility || p.thread || moments ? (
            <ChevronLeft size={22} />
          ) : (
            <Star size={22} />
          )}
        </button>
        <strong>
          {utility ||
            p.thread ||
            (moments ? "朋友圈" : tab === "微信" ? p.name : tab)}
        </strong>
        <button
          aria-label={
            p.creator ? "新增内容" : p.thread ? "聊天详情" : "微信菜单"
          }
          onClick={() => {
  if (p.thread) {
    setUtility("聊天信息");
  } else if (p.creator) {
    p.onAdd();
  } else {
    setMenu(!menu);
  }
}}
          >
          {p.thread ? <MoreHorizontal size={22} /> : <CirclePlus size={22} />}
        </button>
      </div>
      {menu && (
        <div className="wx-popup-menu" role="menu">
          {["搜索", "发起群聊", "添加朋友", "扫一扫", "收付款"].map((label) => (
            <button
              role="menuitem"
              key={label}
              onClick={() => {
                setMenu(false);
                if (label === "搜索") {
                  setSearchOpen(true);
                } else setUtility(label);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {utility ? (
        <div className="skin-scroll wx-utility">
          {utility === "聊天信息" && (
  <div
    className="wx-members"
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
      gap: "20px 8px",
      padding: "20px 12px",
    }}
  >
    {[
      "吕政熙",
      "杨云皓",
      "侯王子",
      "刘禹辰",
      "余政霖",
      "杨子豪",
      "宋金泽",
      "任玄哲",
      "皮子渝",
      "智恩涵",
      "沈子航",
      "杨林好",
      "朱映宸",
      "张誉严",
      "陈璟翊",
      "胡阿米",
      "魏新航",
      "佟弋",
      "赵俊羽",
      "刘瀚辰",
      "陈燊",
      "越艺晨",
      "时代峰峻",
      "阳阳（我）",
    ].map((name) => (
      <div
        key={name}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "6px",
          minWidth: 0,
        }}
      >
        <Avatar
          name={name}
          src={`/FoundPhone-Studio/${name === "阳阳（我）" ? "阳阳" : name}.jpg`}
        />
        <small
          style={{
            textAlign: "center",
            width: "100%",
            fontSize: "12px",
            overflowWrap: "anywhere",
          }}
        >
          {name}
        </small>
      </div>
    ))}
  </div>
)}
          {p.items
            .filter((i) => i.folder === utility)
            .map((i) => (
              <button
                key={i.id}
                className="wx-discovery"
                onClick={() => p.onItem(i)}
              >
                {i.title}
                <span>›</span>
              </button>
            ))}
          {!p.items.some((i) => i.folder === utility) &&
            utility !== "聊天信息" && <p className="skin-empty">暂无内容</p>}
        </div>
      ) : p.thread ? (
        <>
          <MessageList
            items={p.items.filter((i) => i.title === p.thread)}
            creator={p.creator}
            onItem={p.onItem}
            onRead={p.onRead}
          />
          <Compose
  creator={p.creator}
  onAdd={p.onAdd}
  onSend={p.onSendMessage}
/>
        </>
      ) : moments ? (
        <div className="wx-moments">
          <div
  className="wx-moment-cover"
style={{
  backgroundImage: 'url("/FoundPhone-Studio/朋友圈背景图.jpg")',
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  width: "100%",
  height: "300px",
}}
>
  {/* 原来的朋友圈封面内容保留在这里 */}
</div>
          {posts.map((i) => (
            <button
              key={i.id}
              className="wx-moment-post"
              onClick={() => p.onItem(i)}
            >
              <Avatar name={i.sender} />
              <div>
                <strong>{i.sender}</strong>
                <p>{i.body}</p>
                {i.media && <ItemMedia item={i} />}
                <small>{i.time}</small>
              </div>
            </button>
          ))}
          {!posts.length && <p className="skin-empty">暂无朋友圈动态</p>}
          {p.creator && (
            <button className="phone-add" onClick={p.onAdd}>
              添加朋友圈动态
            </button>
          )}
        </div>
      ) : (
        <div className="skin-scroll">
          {tab === "微信" ? (
            <>
              {searchOpen && (
                <label className="wx-search">
                  <Search size={14} />
                  <input
                    aria-label="搜索微信内容"
                    placeholder="搜索"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                </label>
              )}
              {conversations
                .filter(
                  (t) =>
                    t.includes(query) ||
                    p.items.some(
                      (i) => i.title === t && i.body.includes(query),
                    ),
                )
                .map((t) => {
  const list = p.items.filter((i) => i.title === t);
  const last = list.at(-1);

  return (
    <button
      className="wx-chat-row"
      key={t}
      onClick={() => {
        setReadThreads((v) => (v.includes(t) ? v : [...v, t]));
        p.onThread(t);
        if (last) p.onRead(t);
      }}
    >
      <span className="wx-chat-avatar">
        <Avatar name={t} src={last?.avatar ?? ""} />
        {!readThreads.includes(t) &&
          list.some((i) => !i.read) && (
            <b className="wx-unread">
              {list.filter((i) => !i.read).length}
            </b>
          )}
      </span>
      <div>
        <strong>{t}</strong>
        <p>{last?.body ?? "暂无消息"}</p>
      </div>
      <time>{last?.time.slice(-5) ?? ""}</time>
    </button>
  );
})}
              {!conversations.length && <p className="skin-empty">暂无聊天</p>}
            </>
          ) : tab === "通讯录" ? (
            <>
              <div className="wx-section-label">联系人</div>
              
{contacts.map((c, index) => (
  <div key={c.name}>
    {(index === 0 ||
      contacts[index - 1].initial !== c.initial) && (
      <div
        className="wx-section-label"
        style={{
          padding: "12px 16px 6px",
          fontSize: "13px",
          color: "#888",
          fontWeight: 600,
        }}
      >
        {c.initial}
      </div>
    )}

    <button
      className="wx-contact"
      onClick={() => {
        const item = p.items.find((i) => i.sender === c.name);
        if (item) {
          p.onThread(item.title);
          p.onRead(item.title);
        }
      }}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        boxSizing: "border-box",
        gap: "12px",
      }}
    >
      <Avatar
        name={c.name}
        src={`/FoundPhone-Studio/${c.name}.jpg`}
      />
      <span>{c.name}</span>
    </button>
  </div>
))}

            </>
          ) : tab === "发现" ? (
            <div className="wx-discover-groups">
              {[
                [Camera, "朋友圈", "#26a958"],
                [Play, "视频号", "#fa9d3b"],
                [Music, "听一听", "#fa5151"],
              ].map(([Icon, label, color]) => {
                const Glyph = Icon as typeof Camera;
                return (
                  <button
                    key={String(label)}
                    className="wx-discovery"
                    onClick={() =>
                      label === "朋友圈"
                        ? setMoments(true)
                        : setUtility(String(label))
                    }
                  >
                    <Glyph size={22} style={{ color: String(color) }} />
                    {String(label)}
                    <span>›</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <>
  <div className="wx-profile">
    <Avatar
      name="阳阳"
      src="/FoundPhone-Studio/阳阳.jpg"
    />
    <div>
      <h2>阳阳</h2>
      <small>微信号：yang20121117</small>
      <button
        className="wx-profile-status"
        onClick={() => setUtility("状态")}
      >
        ＋ 状态
                  </button>
                </div>
              </div>
              <div className="wx-profile-menu">
                {[
                  [MessageCircle, "服务", "#07c160"],
                  [Layers, "收藏", "#e8a828"],
                  [ImageIcon, "朋友圈", "#3a9bd9"],
                  [Layers, "作品", "#329dd8"],
                  [ShoppingBag, "小店与卡包", "#ed7c59"],
                  [Smile, "表情", "#f7b900"],
                  [Settings, "设置", "#1696d2"],
                ].map(([Icon, label, color]) => {
                  const Glyph = Icon as typeof Settings;
                  return (
                    <button
                      key={String(label)}
                      className="wx-discovery"
                      onClick={() =>
                        label === "朋友圈"
                          ? setMoments(true)
                          : setUtility(String(label))
                      }
                    >
                      <Glyph size={22} style={{ color: String(color) }} />
                      {String(label)}
                      <span>›</span>
                    </button>
                  );
                })}
              </div>
              {p.items
                .filter((i) => i.folder === "我")
                .map((i) => (
                  <button
                    className="wx-discovery"
                    key={i.id}
                    onClick={() => p.onItem(i)}
                  >
                    <User size={18} />
                    {i.title}
                    <span>›</span>
                  </button>
                ))}
              {p.creator && (
                <button className="phone-add" onClick={p.onAdd}>
                  编辑个人资料内容
                </button>
              )}
            </>
          )}
        </div>
      )}
      {!p.thread && !moments && !utility && (
        <nav className="wx-bottom">
          {[
            { label: "微信", icon: MessageCircle },
            { label: "通讯录", icon: Users },
            { label: "发现", icon: Compass },
            { label: "我", icon: User },
          ].map((t) => (
            <button
              className={tab === t.label ? "selected" : ""}
              key={t.label}
              onClick={() => setTab(t.label)}
            >
              <t.icon size={21} />
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
export function WhatsAppSkin(p: SkinProps) {
  const [tab, setTab] = useState("聊天"),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("全部");
  const tabs = [
    { label: "动态", icon: Compass },
    { label: "通话", icon: Phone },
    { label: "社区", icon: Users },
    { label: "聊天", icon: MessageCircle },
    { label: "设置", icon: Settings },
  ];
  const conversations = [
    ...new Set(
      p.items
        .filter((i) => !["动态", "通话", "社区", "设置"].includes(i.folder))
        .filter((i) => filter !== "未读" || !i.read)
        .map((i) => i.title),
    ),
  ];
  const name = tab === "聊天" ? p.name : tab;
  return (
    <div className="whatsapp-ui independent-skin">
      <div className="app-nav wa-nav">
        <button
          aria-label="返回"
          onClick={() => (p.thread ? p.onThread("") : p.onBack())}
        >
          <ChevronLeft size={22} />
        </button>
        <strong>{p.thread || name}</strong>
        <button
          aria-label={p.creator ? "新增内容" : "搜索内容"}
          onClick={
            p.creator
              ? p.onAdd
              : () =>
                  document
                    .querySelector<HTMLInputElement>(".wa-search input")
                    ?.focus()
          }
        >
          {p.creator ? <Plus size={21} /> : <Search size={20} />}
        </button>
      </div>
      {p.thread ? (
        <>
          <div className="wa-thread-profile">
            <button aria-label="返回聊天列表" onClick={() => p.onThread("")}>
              <ChevronLeft size={23} />
            </button>
            <Avatar
              name={p.thread}
              src={p.items.find((i) => i.title === p.thread)?.avatar}
              round
            />
            <div>
              <strong>{p.thread}</strong>
              <small>联系人</small>
            </div>
            <Video size={18} />
            <Phone size={17} />
          </div>
          <MessageList
            items={p.items.filter((i) => i.title === p.thread)}
            creator={p.creator}
            onItem={p.onItem}
            onRead={p.onRead}
            whatsapp
          />
          <Compose creator={p.creator} onAdd={p.onAdd} wa />
        </>
      ) : (
        <div className="skin-scroll">
          <h1 className="wa-large-title">{tab}</h1>
          {tab === "聊天" ? (
            <>
              <label className="wa-search">
                <Search size={16} />
                <input
                  placeholder="搜索"
                  aria-label="搜索WhatsApp"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </label>
              <div className="wa-filters">
                {["全部", "未读", "群组"].map((f) => (
                  <button
                    key={f}
                    className={filter === f ? "selected" : ""}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                  </button>
                ))}
              </div>
              {conversations
                .filter((t) => t.includes(query))
                .filter(
                  (t) =>
                    filter !== "群组" ||
                    p.items.some((i) => i.title === t && i.folder === "群组"),
                )
                .map((t) => {
                  const last = p.items.filter((i) => i.title === t).at(-1)!;
                  return (
                    <button
                      className="wa-chat-row"
                      key={t}
                      onClick={() => {
                        p.onThread(t);
                        p.onRead(t);
                      }}
                    >
                      <Avatar name={t} src={last.avatar} round />
                      <div>
                        <strong>{t}</strong>
                        <p>
                          {last.outgoing && <CheckCheck size={12} />}{" "}
                          {last.body}
                        </p>
                      </div>
                      <time>{last.time.slice(-5)}</time>
                    </button>
                  );
                })}
            </>
          ) : tab === "设置" ? (
            <>
              <div className="wa-settings-profile">
                <Avatar name="我" round />
                <h2>个人资料</h2>
              </div>
              {p.items
                .filter((i) => i.folder === "设置")
                .map((i) => (
                  <button
                    key={i.id}
                    className="wa-record"
                    onClick={() => p.onItem(i)}
                  >
                    {i.title}
                    <span>›</span>
                  </button>
                ))}
            </>
          ) : (
            <>
              {tab === "动态" && (
                <div className="wa-status">
                  <Avatar name="我" round />
                  <span>我的状态</span>
                  {p.creator && (
                    <button aria-label="添加状态" onClick={p.onAdd}>
                      <Plus size={17} />
                    </button>
                  )}
                </div>
              )}
              {p.items
                .filter(
                  (i) =>
                    i.folder === tab || (tab === "通话" && i.kind === "call"),
                )
                .map((i) => (
                  <button
                    className="wa-record"
                    key={i.id}
                    onClick={() => p.onItem(i)}
                  >
                    <Avatar name={i.sender} src={i.avatar} round />
                    <div>
                      <strong>{i.title}</strong>
                      <p>{i.body}</p>
                    </div>
                    <span>
                      {tab === "通话" ? (
                        <Phone size={17} />
                      ) : (
                        <ChevronLeft size={15} />
                      )}
                    </span>
                  </button>
                ))}
              {!p.items.some((i) => i.folder === tab) && (
                <p className="skin-empty">暂无{tab}内容</p>
              )}
            </>
          )}
          {p.creator && (
            <button className="phone-add" onClick={p.onAdd}>
              添加{tab === "聊天" ? "聊天" : tab}内容
            </button>
          )}
        </div>
      )}
      {!p.thread && (
        <nav className="wa-bottom">
          {tabs.map((t) => (
            <button
              className={tab === t.label ? "selected" : ""}
              key={t.label}
              onClick={() => setTab(t.label)}
            >
              <t.icon size={20} />
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
export function InstagramSkin(p: SkinProps) {
  const [tab, setTab] = useState("首页"),
    [dm, setDm] = useState(false),
    [query, setQuery] = useState(""),
    [likes, setLikes] = useSkinState<string[]>(p, "likes", []),
    [saved, setSaved] = useSkinState<string[]>(p, "saved", []),
    [showSaved, setShowSaved] = useState(false);
  const posts = p.items.filter(
      (i) =>
        i.kind === "post" ||
        !["私信", "Story", "Reels", "个人主页"].includes(i.folder),
    ),
    stories = p.items.filter((i) => i.folder === "Story"),
    reels = p.items.filter((i) => i.kind === "video" || i.folder === "Reels"),
    messages = p.items.filter((i) => i.folder === "私信");
  const tabs = [
    { label: "首页", icon: Home },
    { label: "搜索", icon: Search },
    { label: "Reels", icon: Play },
    { label: "个人主页", icon: User },
  ];
  const shown = (
    showSaved ? posts.filter((i) => saved.includes(i.id)) : posts
  ).filter((i) => (i.title + i.body + i.sender).includes(query));
  return (
    <div className="instagram-ui independent-skin">
      <div className="app-nav ig-nav">
        <button
          aria-label="返回"
          onClick={() => (dm ? setDm(false) : p.onBack())}
        >
          <ChevronLeft size={22} />
        </button>
        <strong>{dm ? "私信" : p.name}</strong>
        <div>
          {p.creator && (
            <button aria-label="新增内容" onClick={p.onAdd}>
              <Plus size={21} />
            </button>
          )}
          <button aria-label="Instagram 私信" onClick={() => setDm(!dm)}>
            <Send size={20} />
          </button>
        </div>
      </div>
      <div className="skin-scroll ig-scroll">
        {dm ? (
          <>
            {messages.map((i) => (
              <button
                key={i.id}
                className="ig-dm-row"
                onClick={() => p.onItem(i)}
              >
                <Avatar name={i.sender} round />
                <div>
                  <strong>{i.sender}</strong>
                  <p>{i.body}</p>
                </div>
              </button>
            ))}
            {!messages.length && <p className="skin-empty">暂无私信</p>}
            {p.creator && (
              <button className="phone-add" onClick={p.onAdd}>
                添加私信
              </button>
            )}
          </>
        ) : tab === "首页" ? (
          <>
            <div className="ig-stories">
              <button
                className="ig-story"
                onClick={
                  p.creator
                    ? p.onAdd
                    : () => {
                        if (stories[0]) p.onItem(stories[0]);
                      }
                }
                disabled={!p.creator && !stories.length}
              >
                <span>
                  <Avatar name="我" round />
                </span>
                <small>你的快拍</small>
              </button>
              {stories.map((i) => (
                <button
                  key={i.id}
                  className="ig-story"
                  onClick={() => p.onItem(i)}
                >
                  <span>
                    <Avatar name={i.sender} round />
                  </span>
                  <small>{i.sender}</small>
                </button>
              ))}
            </div>
            {posts.map((i) => (
              <article className="ig-post" key={i.id}>
                <div className="ig-post-author">
                  <Avatar name={i.sender} round />
                  <strong>{i.sender}</strong>
                  <button
                    aria-label={`帖子详情${i.title}`}
                    onClick={() => p.onItem(i)}
                  >
                    <MoreHorizontal size={19} />
                  </button>
                </div>
                <button className="ig-post-media" onClick={() => p.onItem(i)}>
                  <ItemMedia item={i} />
                </button>
                <div className="ig-post-controls">
                  <button
                    aria-label={`喜欢${i.title}`}
                    onClick={() =>
                      setLikes(
                        likes.includes(i.id)
                          ? likes.filter((x) => x !== i.id)
                          : [...likes, i.id],
                      )
                    }
                  >
                    <Heart
                      size={23}
                      fill={likes.includes(i.id) ? "#ed4956" : "none"}
                      color={likes.includes(i.id) ? "#ed4956" : "currentColor"}
                    />
                  </button>
                  <button
                    aria-label={`评论${i.title}`}
                    onClick={() => p.onItem(i)}
                  >
                    <MessageCircle size={22} />
                  </button>
                  <button
                    aria-label={`查看${i.title}`}
                    onClick={() => p.onItem(i)}
                  >
                    <Send size={21} />
                  </button>
                  <button
                    aria-label={`收藏${i.title}`}
                    onClick={() =>
                      setSaved(
                        saved.includes(i.id)
                          ? saved.filter((x) => x !== i.id)
                          : [...saved, i.id],
                      )
                    }
                  >
                    <Bookmark
                      size={22}
                      fill={saved.includes(i.id) ? "currentColor" : "none"}
                    />
                  </button>
                </div>
                <div className="ig-post-caption">
                  <strong>
                    {i.likes + (likes.includes(i.id) ? 1 : 0)} 次赞
                  </strong>
                  <p>
                    <b>{i.sender}</b> {i.body}
                  </p>
                  <button onClick={() => p.onItem(i)}>
                    查看全部 {i.comments.length} 条评论
                  </button>
                  <time>{i.time}</time>
                </div>
              </article>
            ))}
          </>
        ) : tab === "搜索" ? (
          <>
            <label className="ig-search">
              <Search size={15} />
              <input
                value={query}
                aria-label="搜索Instagram"
                placeholder="搜索"
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <div className="ig-explore">
              {shown.map((i) => (
                <button key={i.id} onClick={() => p.onItem(i)}>
                  <ItemMedia item={i} />
                </button>
              ))}
            </div>
          </>
        ) : tab === "Reels" ? (
          <>
            {reels.map((i) => (
              <div className="ig-reel" key={i.id}>
                <ItemMedia item={i} />
                <button onClick={() => p.onItem(i)}>
                  {i.sender} · {i.title}
                </button>
              </div>
            ))}
            {!reels.length && <p className="skin-empty">暂无 Reels</p>}
          </>
        ) : (
          <>
            <div className="ig-profile">
              <Avatar name={posts[0]?.sender ?? "我"} round />
              <div>
                <strong>{posts.length}</strong>
                <small>帖子</small>
              </div>
              <div>
                <strong>0</strong>
                <small>关注者</small>
              </div>
              <div>
                <strong>0</strong>
                <small>正在关注</small>
              </div>
            </div>
            <h3 className="ig-profile-name">{posts[0]?.sender ?? "我"}</h3>
            <div className="ig-profile-tabs">
              <button aria-label="帖子网格" onClick={() => setShowSaved(false)}>
                <Grid size={21} />
              </button>
              <button
                aria-label="已收藏帖子"
                onClick={() => setShowSaved(true)}
              >
                <Bookmark size={21} />
              </button>
              <button
                aria-label="资料内容"
                onClick={() => {
                  const i = p.items.find((i) => i.folder === "个人主页");
                  if (i) p.onItem(i);
                  else if (p.creator) p.onAdd();
                }}
              >
                <AtSign size={21} />
              </button>
            </div>
            <div className="ig-explore">
              {shown.map((i) => (
                <button key={i.id} onClick={() => p.onItem(i)}>
                  <ItemMedia item={i} />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <nav className="ig-bottom">
        {tabs.map((t) => (
          <button
            key={t.label}
            className={tab === t.label ? "selected" : ""}
            aria-label={`Instagram ${t.label}`}
            onClick={() => {
              setTab(t.label);
              setDm(false);
            }}
          >
            <t.icon size={23} />
          </button>
        ))}
      </nav>
    </div>
  );
}
