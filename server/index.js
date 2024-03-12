const {
  client,
  createTables,
  createUser,
  createProduct,
  createFavorites,
  fetchProducts,
  fetchUser,
  fetchFavorites,
  deleteFavorite,
} = require("./db");
const express = require("express");
app = express();
app.use(require("morgan")("dev"));
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/api/users", async (req, res, next) => {
  try {
    res.send(await fetchUser());
  } catch (err) {
    next(err);
  }
});

app.get("/api/products", async (req, res, next) => {
  try {
    res.send(await fetchProducts());
  } catch (err) {
    next(err);
  }
});

app.get("/api/users/:id/favorites", async (req, res, next) => {
  try {
    res.send(await fetchFavorites(req.params.id));
  } catch (err) {
    next(err);
  }
});

app.post("/api/users/:id/favorites", async (req, res, next) => {
  try {
    res
      .status(201)
      .send(
        await createFavorites({
          user_id: req.params.id,
          product_id: req.body.product_id,
        })
      );
  } catch (ex) {
    next(ex);
  }
});

app.delete("/api/users/:userId/favorites/:id", async (req, res, next) => {
  try {
    await deleteFavorite({ user_id: req.params.userId, id: req.params.id });
    res.sendStatus(204);
  } catch (ex) {
    next(ex);
  }
});

const init = async () => {
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("tables created");
  const [Lisa, Brad, James, stove, sink, blender, microwave] =
    await Promise.all([
      createUser({ username: "Lisa", password: "s3cr3t" }),
      createUser({ username: "Brad", password: "s3cr3t!!" }),
      createUser({ username: "James", password: "shhh" }),
      createProduct({ name: "stove" }),
      createProduct({ name: "sink" }),
      createProduct({ name: "blender" }),
      createProduct({ name: "microwave" }),
    ]);
  const users = await fetchUser();
  console.log(users);
  const products = await fetchProducts();
  console.log(products);

  const userFavorites = await Promise.all([
    createFavorites({ user_id: Lisa.id, product_id: blender.id }),
    createFavorites({ user_id: Brad.id, product_id: sink.id }),
    createFavorites({ user_id: James.id, product_id: stove.id }),
    createFavorites({ user_id: James.id, product_id: microwave.id }),
  ]);

  console.log(await fetchFavorites(James.id));
  await deleteFavorite({ user_id: James.id, id: userFavorites[2].id });
  console.log(await fetchFavorites(James.id));

  app.listen(port, () => console.log(`listening on port ${port}`));
};

init();
