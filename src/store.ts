import { create } from "zustand";
import { createWork, createEmptyWork } from "./demo";
import { uid, validateWork, type Work } from "./schema";
import { db } from "./persistence";

export { db } from "./persistence";

type Store = {
  works: Work[];
  work: Work | null;
  status: string;
  past: Work[];
  future: Work[];
  error: string;
  load: () => Promise<void>;
  select: (id: string) => void;
  change: (fn: (w: Work) => void) => void;
  add: (w?: Work) => Promise<void>;
  remove: (id: string) => Promise<void>;
  undo: () => void;
  redo: () => void;
  flush: () => Promise<void>;
};

let timer: ReturnType<typeof setTimeout>;
let pending: Work | undefined;
let saving: Promise<void> = Promise.resolve();

export const useStudio = create<Store>((set, get) => ({
  works: [],
  work: null,
  status: "正在加载",
  past: [],
  future: [],
  error: "",

  load: async () => {
    try {
      const template = createWork();
      const musicSongs = template.data.music ?? [];

      console.info("[Music诊断] 模板歌曲数量:", musicSongs.length);
      console.info(
        "[Music诊断] 模板歌曲:",
        musicSongs.map((song) => ({
          id: song.id,
          title: song.title,
          sender: song.sender,
        })),
      );

      if (musicSongs.length === 0) {
        console.error(
          "[Music诊断] createWork().data.music 为空，请检查 src/demo.ts。",
        );
      }

      let works = (
        await db.works.orderBy("updatedAt").reverse().toArray()
      ).map(validateWork);

      console.info("[Music诊断] 本地存档数量:", works.length);

      if (!works.length) {
        await db.works.put(template);
        works = [template];

        console.info("[Music诊断] 已保存新模板:", {
          musicCount: template.data.music?.length ?? 0,
        });
      } else if (musicSongs.length) {
        const updatedWorks: Work[] = [];

        for (const work of works) {
          const existingMusic = work.data.music ?? [];
          const musicIds = new Set(existingMusic.map((item) => item.id));
          const missingMusic = musicSongs.filter(
            (item) => !musicIds.has(item.id),
          );

          if (missingMusic.length) {
            const updated: Work = {
              ...work,
              data: {
                ...work.data,
                music: [...existingMusic, ...missingMusic],
              },
              updatedAt: Date.now(),
            };

            await db.works.put(updated);
            updatedWorks.push(updated);

            console.info("[Music诊断] 已补入歌曲:", {
              workId: work.id,
              补入数量: missingMusic.length,
              补入歌曲: missingMusic.map((song) => song.title),
              同步后总数: updated.data.music?.length ?? 0,
            });
          } else {
            updatedWorks.push(work);

            console.info("[Music诊断] 此存档无需补歌:", {
              workId: work.id,
              当前歌曲数量: existingMusic.length,
            });
          }
        }

        works = updatedWorks;
      }

      const selectedWork = works[0];
      const finalMusic = selectedWork?.data.music ?? [];

      console.info("[Music诊断] 加载完成:", {
        workId: selectedWork?.id,
        存档数量: works.length,
        当前存档音乐数量: finalMusic.length,
        当前存档歌曲: finalMusic.map((song) => song.title),
      });

      set({
        works,
        work: selectedWork,
        status: "已保存到本机",
        error: "",
      });
    } catch (e) {
      console.error("[Music诊断] 加载或同步失败:", e);
      set({
        error: String(e),
        status: "存储不可用",
      });
    }
  },

  select: (id) => {
    void get().flush();
    const work = get().works.find((w) => w.id === id);
    if (work) set({ work, past: [], future: [] });
  },

  change: (fn) => {
    const old = get().work;
    if (!old) return;

    const w = structuredClone(old);
    fn(w);
    w.updatedAt = Date.now();
    pending = w;

    set({
      work: w,
      works: get().works.map((x) => (x.id === w.id ? w : x)),
      past: [...get().past.slice(-29), old],
      future: [],
      status: "保存中…",
    });

    clearTimeout(timer);
    timer = setTimeout(() => {
      void get().flush();
    }, 450);
  },

  flush: async () => {
    clearTimeout(timer);
    const w = pending;
    pending = undefined;

    if (!w) return saving;

    saving = saving
      .catch(() => {})
      .then(async () => {
        try {
          await db.works.put(w);
          if (!pending) set({ status: "已保存到本机", error: "" });
        } catch (e) {
          pending = w;
          set({
            status: "保存失败 · 点击重试",
            error: String(e),
          });
        }
      });

    return saving;
  },

  add: async (input) => {
    await get().flush();

    const w = input
      ? { ...structuredClone(input), id: uid(), updatedAt: Date.now() }
      : createEmptyWork();

    await db.works.put(w);
    set({
      works: [w, ...get().works],
      work: w,
      past: [],
      future: [],
    });
  },

  remove: async (id) => {
    await get().flush();
    await db.works.delete(id);
    await db.saves.delete(id);

    const works = get().works.filter((w) => w.id !== id);

    if (!works.length) {
      await get().add();
      set((s) => ({
        works: s.works.filter((w) => w.id !== id),
      }));
    } else {
      set({
        works,
        work: works[0],
        past: [],
        future: [],
      });
    }
  },

  undo: () => {
    const { past, work, future } = get();
    if (!past.length || !work) return;

    const w = past[past.length - 1];
    pending = w;

    set({
      work: w,
      works: get().works.map((x) => (x.id === w.id ? w : x)),
      past: past.slice(0, -1),
      future: [work, ...future],
      status: "保存中…",
    });

    void get().flush();
  },

  redo: () => {
    const { future, work, past } = get();
    if (!future.length || !work) return;

    const w = future[0];
    pending = w;

    set({
      work: w,
      works: get().works.map((x) => (x.id === w.id ? w : x)),
      future: future.slice(1),
      past: [...past, work],
      status: "保存中…",
    });

    void get().flush();
  },
}));
