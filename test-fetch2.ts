async function test() {
  const res = await fetch("http://localhost:3000/api/integrados");
  const data = await res.json();
  console.log("Integrados fetch length:", data.length);
  console.log("Integrados fetch sample:", data.slice(0, 2));
}
test();
