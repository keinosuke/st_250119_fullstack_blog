"use client";
import { use } from "react";
import { useRouter } from "next/navigation";
import React, { useRef, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

const toastId = Math.floor(Math.random() * 1000);

const getPost = async (id: number) => {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`);
  const data = await res.json();
  return data.post;
};

const editPost = async (
  id: number,
  title: string | undefined,
  description: string | undefined
) => {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, title, description }),
  });
  console.log(res);
  return res.json();
};
const deletePost = async (id: number) => {
  const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
    method: "DELETE",
    header: {
      "Content-Type": "application/json",
    },
  });
  return res.json();
};

const EditPost = ({ params }: { params: Promise<{ id: number }> }) => {
  const { id } = use(params);

  const router = useRouter();
  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreraElement | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(id);
    console.log(titleRef.current?.value);
    console.log(descriptionRef.current?.value);

    toast.loading("更新中...", { id: toastId });
    await editPost(id, titleRef.current?.value, descriptionRef.current?.value);
    toast.success("更新しました。", { id: toastId });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/");
    router.refresh();
  };

  const handleDelete = async () => {
    toast.loading("削除中...", { id: "1" });
    await deletePost(params.id);
    toast.success("削除しました。", { id: "1" });
    router.push("/");
    router.refresh();
  };

  useEffect(() => {
    getPost(id)
      .then((data) => {
        console.log(data);
        titleRef.current!.value = data.title;
        descriptionRef.current!.value = data.description;
      })
      .catch((err) => {
        toast.error("エラーが発生しました。", { id: "1" });
      });
  }, []);

  return (
    <>
      <Toaster />
      <div className="w-full m-auto flex my-4">
        <div className="flex flex-col justify-center items-center m-auto">
          <p className="text-2xl text-slate-200 font-bold p-3">
            ブログの編集 🚀
          </p>
          <form onSubmit={handleSubmit}>
            <input
              ref={titleRef}
              placeholder="タイトルを入力"
              type="text"
              className="rounded-md px-4 w-full py-2 my-2"
            />
            <textarea
              ref={descriptionRef}
              placeholder="記事詳細を入力"
              className="rounded-md px-4 py-2 w-full my-2"
            ></textarea>
            <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
              更新
            </button>
            <button
              className="ml-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-slate-100"
              onClick={() => handleDelete()}
            >
              削除
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditPost;
