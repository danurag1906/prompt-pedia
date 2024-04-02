export async function fetchPromptsServerSide() {
  const response = await fetch("/api/prompt", { cache: "no-store" });
  const data = await response.json();
  //   console.log(data, "data from server props");
  return data;
}
