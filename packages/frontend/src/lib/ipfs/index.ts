import { Blob, File, NFTStorage } from "nft.storage";

const client = new NFTStorage({
  token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGIyNTFlMzc5NDQ0ZTgwNDg1ZWY2MEM1NEZkOGVGMGMxMzUyOGRBYTYiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY2MDcxOTQ5MTg2NSwibmFtZSI6IldlYjNJbmlmaW5pdHlIYWNrYXRob24ifQ.RyQLZnrOLQILqW9ApOufGyvcB-nj3sW0QkLPxQlmG4U",
});

function toBuffer(base64: string) {
  let bin = atob(base64.replace(/^.*,/, ""));
  let buffer = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i);
  }
  return buffer;
}

export const file = (data: string, file: string, type: "image/png" | "application/json") => {
  const _file = type === "image/png" ? toBuffer(data) : data;
  return new File([_file], file, { type });
};

export const add = async (name: string, description: string, image: File, animation_url: File) => {
  await client.store({
    name,
    description,
    image,
    animation_url,
  });
  const { url } = await client.store({
    name,
    description,
    image,
    animation_ul: animation_url,
  });
  return url;
};
