import { AudioPlayer, useTrack } from "../audio";
import { useSkinState } from "../skinState";
import {
  Bookmark,
  Check,
  Compass,
  Heart,
  Home,
  MessageCircle,
  Music,
  Play,
  Plus,
  Search,
  SkipForward,
  User,
  Users,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { safeMedia, type Item } from "../schema";
import {
  Avatar,
  Empty,
  groupItems,
  Header,
  Media,
  meta,
  SearchBox,
  Tabs,
  useContent,
  type Props,
} from "./shared";
function TrackPlayer({
  item,
  p,
  onNext,
}: {
  item: Item;
  p: Props;
  onNext: () => void;
}) {
  return (
    <div className="track-player">
      <button onClick={() => p.onItem(item)}>
        <Music size={20} />
        <span>
          {item.title}
          <small>{item.sender}</small>
        </span>
      </button>
      {item.kind === "audio" && safeMedia(item.media) ? (
        <AudioPlayer p={p} item={item} />
      ) : (
        <button onClick={() => p.onItem(item)}>查看</button>
      )}
      <button aria-label="下一首" onClick={onNext}>
        <SkipForward size={19} />
      </button>
    </div>
  );
}
export function SpotifySkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "首页");
  const [playlist, setPlaylist] = useState(""),
    [track, setTrack] = useTrack(p, items);
  const list = playlist
    ? items.filter((i) => (i.folder || "我的音乐") === playlist)
    : items;
  return (
    <div className="catalog-skin spotify-ui">
      <Header p={p} />
      <div className="catalog-scroll">
        <div className="spotify-heading">
          <Avatar name={p.owner ?? "我"} />
          <button
            className={tab === "首页" ? "selected" : ""}
            onClick={() => setTab("首页")}
          >
            音乐
          </button>
          <button
            className={tab === "音乐库" ? "selected" : ""}
            onClick={() => setTab("音乐库")}
          >
            音乐库
          </button>
        </div>
        {tab === "搜索" && <SearchBox value={q} set={setQ} />}
        <h1>{playlist || (tab === "音乐库" ? "音乐库" : "为你收藏")}</h1>
        {!playlist && (
          <div className="spotify-playlists">
            {groupItems(items, "我的音乐").map((g) => (
              <button key={g} onClick={() => setPlaylist(g)}>
                <Music size={29} />
                <strong>{g}</strong>
              </button>
            ))}
          </div>
        )}
        {playlist && (
          <button className="playlist-back" onClick={() => setPlaylist("")}>
            返回全部音乐
          </button>
        )}
        <div className="spotify-tracks">
          {list.map((i, n) => (
            <button
              key={i.id}
              onClick={() => {
                setTrack(i);
              }}
            >
              <span>{n + 1}</span>
              <div>
                <strong>{i.title}</strong>
                <small>
                  {i.sender} · {meta(i, "album")}
                </small>
              </div>
              <small>{meta(i, "duration")}</small>
            </button>
          ))}
        </div>
        <Empty items={list} />
      </div>
      {track && (
        <TrackPlayer
          item={track}
          p={p}
          onNext={() =>
            setTrack(
              items[
                (items.findIndex((i) => i.id === track.id) + 1) % items.length
              ],
            )
          }
        />
      )}
      <Tabs
        tabs={["首页", "搜索", "音乐库"]}
        value={tab}
        set={(t) => {
          setTab(t);
          setPlaylist("");
        }}
        icons={[<Home />, <Search />, <Music />]}
      />
    </div>
  );
}
export function NeteaseSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "发现");
  
console.log(
  "[网易云排查]",
  "items:",
  p.items.length,
  "songs:",
  items.length,
  "titles:",
  items.map((i) => i.title),
);
  const [folder, setFolder] = useState(""),
    [track, setTrack] = useTrack(p, items);
  const list = items.filter(
  (i) => !folder || (i.folder || "我的歌单") === folder
);
  return (
    <div className="catalog-skin netease-ui">
      <Header p={p} />
      <div className="catalog-scroll">
        <SearchBox value={q} set={setQ} />
        {tab === "发现" ? (
          <>
            <div className="netease-feature">
              <Music size={44} />
              <h2>推荐歌单</h2>
            </div>
            <div className="netease-shelves">
              {groupItems(items, "我的歌单").map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setFolder(g);
                    setTab("我的");
                  }}
                >
                  <Music size={33} />
                  <strong>{g}</strong>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="netease-profile">
              <Avatar name={p.owner ?? "我"} />
              <h2>{p.owner ?? "我的音乐"}</h2>
            </div>
            <h3>{folder || "我的歌单"}</h3>
          </>
        )}
        {list.map((i, n) => (
          <div className="netease-track" key={i.id}>
            <button
              onClick={() => {
                setTrack(i);
              }}
            >
              <span>{n + 1}</span>
              <div>
                <strong>{i.title}</strong>
                <small>
                  {i.sender} · {meta(i, "album")}
                </small>
              </div>
            </button>
            <button
              aria-label={`歌曲详情${i.title}`}
              onClick={() => p.onItem(i)}
            >
              <MessageCircle size={18} />
            </button>
          </div>
        ))}
        <Empty items={list} />
      </div>
      {track && (
        <TrackPlayer
          item={track}
          p={p}
          onNext={() =>
            setTrack(
              items[
                (items.findIndex((i) => i.id === track.id) + 1) % items.length
              ],
            )
          }
        />
      )}
      <Tabs
        tabs={["发现", "我的"]}
        value={tab}
        set={(t) => {
          setTab(t);
          setFolder("");
        }}
        icons={[<Compass />, <Music />]}
      />
    </div>
  );
}
export function YouTubeSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "首页");
  const [category, setCategory] = useState("全部");
  const list = items.filter((i) =>
    tab === "Shorts"
      ? i.folder === "Shorts"
      : tab === "订阅"
        ? i.folder === "订阅"
        : tab === "播放列表"
          ? i.favorite || i.folder === "播放列表"
          : category === "全部" || i.folder === category,
  );
  return (
    <div className="catalog-skin youtube-ui">
      <Header p={p} />
      <SearchBox value={q} set={setQ} />
      <div className="youtube-chips">
        {["全部", ...groupItems(items).filter((g) => g !== "未分类")].map(
          (g) => (
            <button
              className={category === g ? "selected" : ""}
              key={g}
              onClick={() => setCategory(g)}
            >
              {g}
            </button>
          ),
        )}
      </div>
      <div className="catalog-scroll">
        <div className={tab === "Shorts" ? "youtube-shorts" : "youtube-videos"}>
          {list.map((i) => (
            <article key={i.id}>
              <button className="youtube-thumb" onClick={() => p.onItem(i)}>
                <Media item={i} />
                {meta(i, "duration") && <time>{meta(i, "duration")}</time>}
              </button>
              <button className="youtube-byline" onClick={() => p.onItem(i)}>
                <Avatar name={i.sender} />
                <div>
                  <strong>{i.title}</strong>
                  <small>
                    {i.sender} · {meta(i, "views", "—")} 次播放
                  </small>
                </div>
              </button>
            </article>
          ))}
        </div>
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["首页", "Shorts", "订阅", "播放列表"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <Video />, <Users />, <User />]}
      />
    </div>
  );
}
export function BilibiliSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "首页");
  
console.log(
  "[B站首页内容详情]",
  JSON.stringify(
    items.map((i) => ({
      id: i.id,
      title: i.title,
      body: i.body,
      sender: i.sender,
      folder: i.folder,
      kind: i.kind,
      media: i.media,
      meta: i.meta,
    })),
    null,
    2,
  ),
);
  const list =
  tab === "历史"
    ? items.filter((i) => i.folder?.trim() === "历史")
    : tab === "动态"
      ? items.filter((i) => i.folder?.trim() === "动态")
      : items.filter(
          (i) =>
            i.folder?.trim() !== "历史" &&
            i.folder?.trim() !== "动态"
        );

console.log("[B站历史检查]", {
  currentTab: tab,
  totalItems: items.length,
  historyItems: items
    .filter((i) => i.folder?.trim() === "历史")
    .map((i) => ({
      id: i.id,
      title: i.title,
      folder: i.folder,
    })),
  displayedItems: list.length,
});
  return (
    <div className="catalog-skin bilibili-ui">
      <Header p={p} />
      
<div className="bili-search">
  <img
    className="bili-avatar"
    src={`${import.meta.env.BASE_URL}linqiushui.jpg`}
    alt="林秋水"
  />
  <SearchBox value={q} set={setQ} />
</div>

<div className="bili-hero">
  <img
    className="bili-hero-image"
    src={`${import.meta.env.BASE_URL}bilibili火影.jpg`}
    alt="火影忍者推荐"
    onError={(e) => {
      e.currentTarget.style.display = "none";
    }}
  />

  <div className="bili-hero-overlay">
    <span className="bili-hero-label">热门推荐 · 动漫</span>
    <h2>火影忍者</h2>
    <p>热血、羁绊与永不放弃的忍道</p>
    <button
      className="bili-hero-button"
      onClick={() => {
        const target = items.find((i) =>
          /火影忍者|鸣人|佐助/.test(i.title)
        );
        if (target) p.onItem(target);
      }}
    >
      <Play size={14} fill="currentColor" />
      立即观看
    </button>
  </div>

  <div className="bili-hero-dots">
    <span className="active" />
    <span />
    <span />
  </div>
</div>
      <div className="catalog-scroll messages-no-scrollbar">
        
{tab === "历史" ? (
  <div className="bili-history-list">
    {[...list]
      .sort(
        (a, b) =>
          new Date(b.time ?? 0).getTime() -
          new Date(a.time ?? 0).getTime()
      )
      .map((i) => (
        <button
          className="bili-history-item"
          key={i.id}
          onClick={() => p.onItem(i)}
        >
          <div className="bili-history-cover">
            <Media item={i} />
          </div>

          <div className="bili-history-info">
  <strong>{i.title}</strong>
  <span>已看完</span>
</div>
        </button>
      ))}
  </div>
) : tab === "动态" ? (
  <div className="bili-dynamic-list">
    {[...list]
      .sort(
        (a, b) =>
          new Date(b.time ?? 0).getTime() -
          new Date(a.time ?? 0).getTime()
      )
      .map((i) => (
        <article className="bili-dynamic-card" key={i.id}>
          <div className="bili-dynamic-avatar">
            <img
              src={`${import.meta.env.BASE_URL}linqiushui.jpg`}
              alt="林秋水"
            />
          </div>

          <div className="bili-dynamic-content">
            <div className="bili-dynamic-header">
              <strong>林秋水</strong>
              <time>{i.time}</time>
            </div>

            <h3>{i.title}</h3>
            <p>{i.body}</p>

            <div className="bili-dynamic-actions">
              <span>♡ 点赞</span>
              <span>☆ 收藏</span>
              <span>评论</span>
            </div>
          </div>
        </article>
      ))}
  </div>
) : (
  <div className="bili-grid">
    {list.map((i) => (
      <button key={i.id} onClick={() => p.onItem(i)}>
        <div>
          <Media item={i} />
          <small>
            <Play size={10} />
            {meta(i, "views", "—")}
            <time>{meta(i, "duration")}</time>
          </small>
        </div>
        <strong>{i.title}</strong>
        <span>UP · {i.sender}</span>
      </button>
    ))}
  </div>
)}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["首页", "动态", "历史"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <MessageCircle />, <User />]}
      />
    </div>
  );
}
function VerticalVideo({ p, item }: { p: Props; item: Item }) {
    const articleRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const article = articleRef.current;
    const video = article?.querySelector("video");

    if (!article || !video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || entry.intersectionRatio < 0.5) {
          video.pause();
        }
      },
      { threshold: [0, 0.5, 1] },
    );

    observer.observe(article);

    return () => observer.disconnect();
  }, []);
  const [liked, setLiked] = useSkinState<boolean>(
    p,
    `liked-${item.id}`,
    false,
  );
  const [saved, setSaved] = useSkinState<boolean>(
    p,
    `saved-${item.id}`,
    false,
  );
  const [showComments, setShowComments] = useState(false);

    const displayComments = (item.comments ?? []).map((comment, index) => {
    const match = comment.match(/^@?([^：:]+)[：:]\s*(.*)$/);

    return {
      id: `${item.id}-comment-${index}`,
      nickname: match?.[1] ?? "用户",
      text: match?.[2] ?? comment,
    };
  });

  return (
    <article className="vertical-video" ref={articleRef}>
      <Media item={item} autoPlay />

      <div className="vertical-actions">
        <button
          aria-label={`作者${item.sender}`}
          onClick={() => p.onItem(item)}
        >
          <Avatar name={item.sender} />
        </button>

        <button
          aria-label={`喜欢${item.title}`}
          onClick={() => setLiked(!liked)}
        >
          <Heart size={29} fill={liked ? "#f44368" : "white"} />
          <small>{item.likes + (liked ? 1 : 0)}</small>
        </button>

        <button
          aria-label={`评论${item.title}`}
          onClick={() => setShowComments(true)}
        >
          <MessageCircle size={29} />
          <small>{item.commentCount}</small>
        </button>

        <button
          aria-label={`收藏${item.title}`}
          onClick={() => setSaved(!saved)}
        >
          <Bookmark size={27} fill={saved ? "#f8cc55" : "none"} />
        </button>
      </div>

      <button className="vertical-caption" onClick={() => p.onItem(item)}>
        <strong>@{item.sender}</strong>
        <p>{item.body}</p>
        <small>
          <Music size={11} />
          {item.title}
        </small>
      </button>

      {showComments && (
        <div
          className="douyin-comment-mask"
          onClick={() => setShowComments(false)}
        >
          <section
            className="douyin-comment-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="douyin-comment-handle" />

            <header className="douyin-comment-header">
              <strong>{item.commentCount} 条评论</strong>
              <button onClick={() => setShowComments(false)}>✕</button>
            </header>

            <div className="douyin-comment-list">
              {displayComments.map((comment) => (
  <div className="douyin-comment-item" key={comment.id}>
    <Avatar name={comment.nickname} />
    <div>
      <strong>@{comment.nickname}</strong>
      <p>{comment.text}</p>
    </div>
  </div>
))}
            </div>

            <div className="douyin-comment-input">
              <span>说点什么……</span>
            </div>
          </section>
        </div>
      )}
    </article>
  );
}
export function DouyinSkin(p: Props) {
  const { tab, setTab, items } = useContent(p, "推荐");

  const [activeFriend, setActiveFriend] = useState("");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<
    Record<string, { id: number; text: string; outgoing: boolean; time: string }[]>
  >({});

  const friends = [
    "可可嘻沥",
    "会飞的羽毛",
    "PINK 7 K.I.N.G",
    "这里有哲理",
    "利维斯",
    "大力大力",
    "同意成为魔方糕手",
  ];

  const sendMessage = (text: string) => {
    const content = text.trim();
    if (!content || !activeFriend) return;

    setMessages((old) => ({
      ...old,
      [activeFriend]: [
        ...(old[activeFriend] ?? []),
        {
          id: Date.now(),
          text: content,
          outgoing: true,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    }));

    setDraft("");
  };

  const shareVideo = (item: Item) => {
    setMessages((old) => ({
      ...old,
      [activeFriend]: [
        ...(old[activeFriend] ?? []),
        {
          id: Date.now(),
          text: `分享了视频：${item.title}`,
          outgoing: true,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ],
    }));
  };

  return (
    <div className="catalog-skin douyin-ui">
      <Header p={p} />

      {tab === "好友" ? (
        activeFriend ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "calc(100% - 60px)",
              background: "#f7f7f7",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: 14,
                background: "#fff",
                borderBottom: "1px solid #eee",
              }}
            >
              <button onClick={() => setActiveFriend("")}>‹ 返回</button>
              <strong>{activeFriend}</strong>
            </div>

            <div
              style={{
                flex: 1,
                overflowY: "auto",
                padding: 14,
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              {(messages[activeFriend] ?? []).map((message) => (
                <div
                  key={message.id}
                  style={{
                    alignSelf: message.outgoing ? "flex-end" : "flex-start",
                    maxWidth: "78%",
                    padding: "10px 13px",
                    borderRadius: 14,
                    background: message.outgoing ? "#95ec69" : "#fff",
                    overflowWrap: "anywhere",
                  }}
                >
                  {message.text}
                  <small
                    style={{
                      display: "block",
                      marginTop: 4,
                      fontSize: 10,
                      color: "#777",
                      textAlign: "right",
                    }}
                  >
                    {message.time}
                  </small>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: 8,
                padding: 10,
                background: "#fff",
                borderTop: "1px solid #eee",
              }}
            >
              <input
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") sendMessage(draft);
                }}
                placeholder="发送消息..."
                style={{
                  flex: 1,
                  minWidth: 0,
                  padding: "10px 12px",
                  border: "1px solid #ddd",
                  borderRadius: 20,
                  outline: "none",
                }}
              />
              <button onClick={() => sendMessage(draft)}>发送</button>
            </div>

            <div
              style={{
                padding: "8px 12px",
                background: "#fff",
                borderTop: "1px solid #eee",
              }}
            >
              <strong style={{ fontSize: 13 }}>分享视频</strong>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  overflowX: "auto",
                  marginTop: 8,
                }}
              >
                {items
                  .filter((item) => item.kind === "video")
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => shareVideo(item)}
                      style={{
                        flex: "0 0 150px",
                        padding: 8,
                        border: "1px solid #eee",
                        borderRadius: 8,
                        background: "#fafafa",
                        textAlign: "left",
                      }}
                    >
                      <Media item={item} />
                      <small>{item.title}</small>
                      <div style={{ color: "#fe2c55", fontSize: 12 }}>
                        分享给好友
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="catalog-scroll">
            <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 16px",
    background: "#fff",
  }}
>
  <strong style={{ fontSize: 23, color: "#161823" }}>消息</strong>
  <span style={{ color: "#666", fontSize: 14 }}>搜索　＋</span>
</div>

            {friends.map((friend, index) => {
  const latestMessage = messages[friend]?.slice(-1)[0];

  return (
    <button
      key={friend}
      onClick={() => setActiveFriend(friend)}
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        minHeight: 82,
        padding: "12px 16px",
        gap: 12,
        border: 0,
        borderBottom: "1px solid #f3f3f3",
        background: "#fff",
        textAlign: "left",
        cursor: "pointer",
        color: "#161823",
      }}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            overflow: "hidden",
            background: [
              "#f5c7d2",
              "#b9d9f5",
              "#d6c5f5",
              "#f5d9ad",
              "#c5e5d2",
              "#e7c7b6",
              "#cbd4e8",
            ][index],
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 21,
            fontWeight: 600,
          }}
        >
          {friend.slice(0, 1)}
        </div>
        <span
          style={{
            position: "absolute",
            right: 0,
            bottom: 1,
            width: 11,
            height: 11,
            borderRadius: "50%",
            background: "#31c48d",
            border: "2px solid white",
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          gap: 7,
        }}
      >
        <strong
          style={{
            display: "block",
            color: "#161823",
            fontSize: 15,
            fontWeight: 600,
            lineHeight: "20px",
          }}
        >
          {friend}
        </strong>

        <span
          style={{
            display: "block",
            color: "#999",
            fontSize: 12,
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          {latestMessage
            ? `${latestMessage.outgoing ? "我：" : ""}${latestMessage.text}`
            : "点击发消息，和好友聊一聊"}
        </span>
      </div>

      <div
        style={{
          color: "#aaa",
          fontSize: 11,
          flexShrink: 0,
        }}
      >
        {latestMessage?.time ?? ""}
      </div>
    </button>
  );
})}
          </div>
        )
      ) : (
        <>
          <div className="douyin-top">
            {["关注", "推荐"].map((t) => (
              <button
                className={tab === t ? "selected" : ""}
                key={t}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="vertical-feed">
            {items
              .filter((item) =>
                tab === "推荐" ? true : item.folder === tab,
              )
              .map((item) => (
                <VerticalVideo key={item.id} p={p} item={item} />
              ))}
          </div>
        </>
      )}

      <Tabs
        tabs={["推荐", "好友"]}
        value={tab}
        set={(value) => {
          setTab(value);
          setActiveFriend("");
        }}
        icons={[<Home />, <Users />]}
      />
    </div>
  );
}
export function TikTokSkin(p: Props) {
  const { tab, setTab, items } = useContent(p, "For You");
  const list =
    tab === "For You"
      ? items
      : tab === "Following"
        ? items.filter((i) => i.folder === "关注" || i.folder === "Following")
        : items.filter((i) => i.folder === "个人主页");
  return (
    <div className="catalog-skin tiktok-ui">
      <Header p={p} />
      <div className="tiktok-top">
        <button
          className={tab === "Following" ? "selected" : ""}
          onClick={() => setTab("Following")}
        >
          Following
        </button>
        <button
          className={tab === "For You" ? "selected" : ""}
          onClick={() => setTab("For You")}
        >
          For You
        </button>
      </div>
      <div className="vertical-feed">
        {list.map((i) => (
          <VerticalVideo key={i.id} p={p} item={i} />
        ))}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["For You", "Following", "Profile"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <Users />, <User />]}
      />
    </div>
  );
}
export function NetflixSkin(p: Props) {
  const { tab, setTab, q, setQ, items } = useContent(p, "首页");
  const [saved, setSaved] = useSkinState<string[]>(p, "saved", []);
  const list =
    tab === "我的片单"
      ? items.filter((i) => i.favorite || saved.includes(i.id))
      : items;
  const featured = list[0];
  return (
    <div className="catalog-skin netflix-ui">
      <Header p={p} />
      <div className="catalog-scroll">
        <SearchBox value={q} set={setQ} />
        {featured && tab === "首页" && (
          <div className="netflix-feature">
            <Media item={featured} />
            <div>
              <strong>{featured.title}</strong>
              <small>
                {meta(featured, "year")} · {meta(featured, "genre")} ·{" "}
                {meta(featured, "duration")}
              </small>
              <button onClick={() => p.onItem(featured)}>
                <Play size={16} />
                播放 / 详情
              </button>
              <button
                onClick={() =>
                  setSaved(
                    saved.includes(featured.id)
                      ? saved.filter((id) => id !== featured.id)
                      : [...saved, featured.id],
                  )
                }
              >
                {saved.includes(featured.id) ? (
                  <Check size={16} />
                ) : (
                  <Plus size={16} />
                )}
                我的片单
              </button>
            </div>
          </div>
        )}
        {groupItems(list, "影片").map((g) => (
          <section className="netflix-shelf" key={g}>
            <h3>{g}</h3>
            <div>
              {list
                .filter((i) => (i.folder || "影片") === g)
                .map((i) => (
                  <button key={i.id} onClick={() => p.onItem(i)}>
                    <Media item={i} />
                    <strong>{i.title}</strong>
                  </button>
                ))}
            </div>
          </section>
        ))}
        <Empty items={list} />
      </div>
      <Tabs
        tabs={["首页", "我的片单"]}
        value={tab}
        set={setTab}
        icons={[<Home />, <Bookmark />]}
      />
    </div>
  );
}

