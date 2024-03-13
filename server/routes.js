const express = require("express");
const userFavoriteRouter = express.Router();
const client = require("./db");

userFavoriteRouter.get("/users", async (req, res, next) => {
  try {
    res.send(await client.fetchUser());
  } catch (err) {
    next(err);
  }
});

userFavoriteRouter.get("/products", async (req, res, next) => {
  try {
    res.send(await client.fetchProducts());
  } catch (err) {
    next(err);
  }
});

userFavoriteRouter.get("/users/:id/favorites", async (req, res, next) => {
  try {
    res.send(await client.fetchFavorites(req.params.id));
  } catch (err) {
    next(err);
  }
});

userFavoriteRouter.post("/users/:id/favorites", async (req, res, next) => {
  try {
    res.status(201).send(
      await client.createFavorites({
        user_id: req.params.id,
        product_id: req.body.product_id,
      })
    );
  } catch (ex) {
    next(ex);
  }
});

userFavoriteRouter.delete(
  "/users/:userId/favorites/:id",
  async (req, res, next) => {
    try {
      await client.deleteFavorite({
        user_id: req.params.userId,
        id: req.params.id,
      });
      res.sendStatus(204);
    } catch (ex) {
      next(ex);
    }
  }
);

module.exports = userFavoriteRouter;
