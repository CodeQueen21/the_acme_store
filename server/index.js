const {
  client,
  createTables,
  createUser,
  createProduct,
  fetchProducts,
  fetchUser,
} = require("./db");

const init = async () => {
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("tables created");
  const [Lisa, Brad, James] = await Promise.all([
    createUser({ username: "Lisa", password: "s3cr3t" }),
    createUser({ username: "Brad", password: "s3cr3t!!" }),
    createUser({ username: "James", password: "shhh" }),
    createProduct({ name: "stove" }),
    createProduct({ name: "sink" }),
    createProduct({ name: "blender" }),
    createProduct({ name: "microwave" }),
  ]);
  console.log(await fetchUser());
  console.log(await fetchProducts());
};

init();
