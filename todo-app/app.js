const express = require("express");
const app = express();
const { Todo, User } = require("./models");
const bodyParser = require("body-parser");
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
const passport = require("passport");
const connectEnsureLogin = require("connect-ensure-login");
const session = require("express-session");
const localStrategy = require("passport-local");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const flash = require("connect-flash");
app.use(flash());
app.use(
  session({
    secret: "helloworld0992766237857235",
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use(function (request, response, next) {
  response.locals.messages = request.flash();
  next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ where: { email: username } });
        const result = await bcrypt.compare(password, user.password);

        if (result) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid password" });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("seriealizing user ", user.id);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
var csrf = require("csurf");
var cookieParser = require("cookie-parser");
const { where } = require("sequelize");
app.use(cookieParser("something"));
app.use(csrf({ cookie: true }));
// // app.js
// const { Sequelize } = require('sequelize')

// // Initialize and sync the model
// async function initializeModels() {
//   try {
//     await Todo.sync() // This will create the "Todos" table if it doesn't exist
//     console.log('Models synchronized successfully.')
//   } catch (error) {
//     console.error('Error synchronizing models:', error)
//   }
// }

// // Call the function to initialize models
// initializeModels()

app.get("/", async (request, response) => {
  if (request.accepts("html")) {
    response.render("index", {
      csrfToken: request.csrfToken(),
    });
  }
});

app.get(
  "/todo",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response) => {
    const user = request.user;
    const allTodos = await Todo.getAllTodos(user.id);
    if (request.accepts("html")) {
      response.render("todo", {
        allTodos,
        csrfToken: request.csrfToken(),
      });
    } else {
      response.json({ allTodos });
    }
  }
);

app.get("/signup", async (request, response) => {
  if (request.accepts("html")) {
    response.render("signup", {
      csrfToken: request.csrfToken(),
    });
  }
});

app.get("/login", async (request, response) => {
  response.render("login", { csrfToken: request.csrfToken() });
});

app.get(
  "/signout",
  connectEnsureLogin.ensureLoggedIn(),
  async (request, response, next) => {
    request.logOut((err) => {
      if (err) {
        next(err);
      }
      response.redirect("/");
    });
  }
);

app.get(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    try {
      const todo = await Todo.findAll(user.id);
      return response.json(todo);
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.post(
  "/session",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  (request, response) => {
    response.redirect("/todo");
  }
);

app.post(
  "/todos",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    try {
      const { title, dueDate } = request.body;
      if (!title || !dueDate) {
        request.flash("error", "title and dueDate cannot be empty");
        return response.redirect("/todo");
      }
      console.log(request.user.id);
      const todo = await Todo.addTodo({
        title: title,
        dueDate: dueDate,
        userId: request.user.id,
      });
      return response.redirect("/todo"), todo;
    } catch (error) {
      console.log(error);
      return response.status(422).json(error);
    }
  }
);

app.post("/users", async (request, response) => {
  const securePass = await bcrypt.hash(request.body.password, saltRounds);
  const { firstName, lastName, email, password } = request.body;
  if (!firstName || !email || !password) {
    request.flash("error", "Enter the details");
    return response.redirect("/signup");
  }
  try {
    console.log("creating");
    const user = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: securePass,
    });
    console.log(securePass);
    request.login(user, (err) => {
      if (err) {
        console.log(err);
      }
      response.redirect("/todo");
    });
  } catch (error) {
    console.log(error);
    request.flash("error", "Enter the details");
    return response.redirect("/signup").status(422).json(error);
  }
});

app.put(
  "/todos/:id/markAsIncomplete",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    try {
      const todo = await Todo.findByPk(request.params.id);

      if (!todo) {
        return response.status(404).json({ error: "Todo not found" });
      }

      const updatedTodo = await todo.markAsIncomplete();
      return response.json(updatedTodo);
    } catch (error) {
      console.error("Error marking todo as incomplete:", error);
      return response
        .status(422)
        .json({ error: "Failed to mark todo as incomplete" });
    }
  }
);

app.put(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    try {
      const todo = await Todo.findByPk(request.params.id);

      if (!todo) {
        return response.status(404).json({ error: "Todo not found" });
      }

      const updatedTodo = await todo.markAsCompleted();
      return response.sendStatus(200);
    } catch (error) {
      console.error("Error marking todo as completed:", error);
      return response
        .status(422)
        .json({ error: "Failed to mark todo as completed" });
    }
  }
);

app.put(
  "/todos/:id/:x",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    try {
      const todo = await Todo.findByPk(request.params.id);
      if (!todo) {
        return response.status(404).json({ error: "Todo not found" });
      }
      const updatedTodo = await todo.statusChange(request.params.x);
      console.log("done");
      return response.json(updatedTodo); // Return the updated todo object
    } catch (error) {
      console.error("Error marking todo as completed:", error);
      return response
        .status(422)
        .json({ error: "Failed to mark todo as completed" });
    }
  }
);

app.delete(
  "/todos/:id",
  connectEnsureLogin.ensureLoggedIn(),
  async function (request, response) {
    console.log("We have to delete a Todo with ID: ", request.params.id);
    try {
      const todo = await Todo.remove(request.params.id);

      if (todo) {
        response.sendStatus(200);
      } else {
        response.status(422).json({ error: "Failed to delete the Todo" });
      }
    } catch (error) {
      console.error(error);
      response.status(422).json({ error: "Internal Server Error" });
    }
  }
);

module.exports = app;
