const API = "http://localhost:3000/api";
let token = "";
let recipeId = 0;

async function run() {
  console.log("--- СТАРТ НА ТЕСТОВЕТЕ ---\n");

  // 1. Register
  const num = Date.now();
  const regRes = await fetch(`${API}/auth/register`, {
    method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify({email: `tester${num}@example.com`, password: "password123"})
  });
  const regData = await regRes.json();
  console.log("1. Регистрация:", regData.message || regData.error);
  token = regData.token;

  // 2. Create Recipe
  const createRes = await fetch(`${API}/recipes`, {
    method: "POST", headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
    body: JSON.stringify({
      title: "Test Recipe", description: "Mnogo vkusno", ingredients: ["a", "b"], instructions: "gotvi", cookingTime: 10, servings: 2, tags: ["test", "vegan"], category: "Lunch"
    })
  });
  const createData = await createRes.json();
  console.log("2. Създаване на рецепта:", createData.title ? `Успешно създадена с ID ${createData.id}` : createData);
  recipeId = createData.id;

  // 3. Edit Recipe
  const editRes = await fetch(`${API}/recipes/${recipeId}`, {
    method: "PUT", headers: {"Content-Type": "application/json", "Authorization": `Bearer ${token}`},
    body: JSON.stringify({title: "Updated Test Recipe"})
  });
  const editData = await editRes.json();
  console.log("3. Редакция на рецепта:", editData.title ? `Ново заглавие: ${editData.title}` : editData);

  // 4. Test Public endpoints
  const listRes1 = await fetch(`${API}/recipes?page=1&pageSize=5`);
  const listData1 = await listRes1.json();
  console.log("4.1 Пагинация (page 1, size 5). Намерени записи:", listData1.data?.length);

  const listRes2 = await fetch(`${API}/recipes?tag=vegan`);
  const listData2 = await listRes2.json();
  console.log("4.2 Филтриране по таг 'vegan'. Намерени записи:", listData2.data?.length);

  const listRes3 = await fetch(`${API}/recipes?search=Updated`);
  const listData3 = await listRes3.json();
  console.log("4.3 Търсене по дума 'Updated'. Намерени записи:", listData3.data?.length);

  // 5. Delete Recipe
  const delRes = await fetch(`${API}/recipes/${recipeId}`, {
    method: "DELETE", headers: {"Authorization": `Bearer ${token}`}
  });
  const delData = await delRes.json();
  console.log("5. Изтриване на рецептата:", delData.message || delData.error);

  console.log("\n--- КРАЙ НА ТЕСТОВЕТЕ ---");
}

run().catch(console.error);