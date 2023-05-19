const express = require("express");
const path = require("path");
// const bcrypt = require("bcrypt");
const format = require("date-fns/format");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "todoApplication.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
//GET todo

app.get("/todos/", async (request, response) => {
  const { category, status, priority, search_q } = request.query;
  if (priority !== undefined && status !== undefined) {
    const getTodo = `select * from todo where priority like '%${priority}%' and status like '%${status}%'; `;
    const dbResponse = await db.all(getTodo);
    response.send(
      dbResponse.map((todo) => {
        return {
          id: todo.id,
          todo: todo.todo,
          priority: todo.priority,
          status: todo.status,
          category: todo.category,
          dueDate: todo.due_date,
        };
      })
    );
  } else if (category !== undefined && status !== undefined) {
    const getTodo = `select * from todo where category like '%${category}%' and status like '%${status}%'; `;
    const dbResponse = await db.all(getTodo);
    response.send(
      dbResponse.map((todo) => {
        return {
          id: todo.id,
          todo: todo.todo,
          priority: todo.priority,
          status: todo.status,
          category: todo.category,
          dueDate: todo.due_date,
        };
      })
    );
  } else if (category !== undefined && priority !== undefined) {
    const getTodo = `select * from todo where priority like '%${priority}%' and category like '%${category}%'; `;
    const dbResponse = await db.all(getTodo);
    response.send(
      dbResponse.map((todo) => {
        return {
          id: todo.id,
          todo: todo.todo,
          priority: todo.priority,
          status: todo.status,
          category: todo.category,
          dueDate: todo.due_date,
        };
      })
    );
  } else if (status !== undefined) {
    if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
      const getTodo = `select * from todo where status like '%${status}%'; `;
      const dbResponse = await db.all(getTodo);
      response.send(
        dbResponse.map((todo) => {
          return {
            id: todo.id,
            todo: todo.todo,
            priority: todo.priority,
            status: todo.status,
            category: todo.category,
            dueDate: todo.due_date,
          };
        })
      );
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else if (category !== undefined) {
    if (category === "WORK" || category === "HOME" || category === "LEARNING") {
      const getTodo = `select * from todo where category like '%${category}%'; `;
      const dbResponse = await db.all(getTodo);
      response.send(
        dbResponse.map((todo) => {
          return {
            id: todo.id,
            todo: todo.todo,
            priority: todo.priority,
            status: todo.status,
            category: todo.category,
            dueDate: todo.due_date,
          };
        })
      );
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else if (priority !== undefined) {
    if (priority === "HIGH" || priority === "LOW" || priority === "MEDIUM") {
      const getTodo = `select * from todo where priority like '%${priority}%'; `;
      const dbResponse = await db.all(getTodo);
      response.send(
        dbResponse.map((todo) => {
          return {
            id: todo.id,
            todo: todo.todo,
            priority: todo.priority,
            status: todo.status,
            category: todo.category,
            dueDate: todo.due_date,
          };
        })
      );
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (search_q !== undefined) {
    const getTodo = `select * from todo where todo like '%${search_q}%'; `;
    const dbResponse = await db.all(getTodo);
    response.send(
      dbResponse.map((todo) => {
        return {
          id: todo.id,
          todo: todo.todo,
          priority: todo.priority,
          status: todo.status,
          category: todo.category,
          dueDate: todo.due_date,
        };
      })
    );
  }
});

//GET specific todo

app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const getTodo = `select * from todo where id = ${todoId};`;
  const todo = await db.get(getTodo);
  response.send({
    id: todo.id,
    todo: todo.todo,
    priority: todo.priority,
    status: todo.status,
    category: todo.category,
    dueDate: todo.due_date,
  });
});

//GET specific due date
app.get("/agenda/", async (request, response) => {
  const { date } = request.query;
  const getTodo = `select * from todo where due_date ='${date}';`;
  const dbResponse = await db.all(getTodo);
  response.send(
    dbResponse.map((todo) => {
      return {
        id: todo.id,
        todo: todo.todo,
        priority: todo.priority,
        status: todo.status,
        category: todo.category,
        dueDate: todo.due_date,
      };
    })
  );
});

//POST todo

app.post("/todos/", async (request, response) => {
  const { id, todo, priority, category, status, dueDate } = request.body;
  if (status !== "TO DO" && status !== "IN PROGRESS" && status !== "DONE") {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (
    category !== "WORK" &&
    category !== "HOME" &&
    category !== "LEARNING"
  ) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else if (
    priority !== "HIGH" &&
    priority !== "LOW" &&
    priority !== "MEDIUM"
  ) {
    response.status(400);
    response.send("Invalid Todo Priority");
  }  else {
    const addTodo = `insert into todo (id,todo,priority,status,category,due_date) values(${id},'${todo}','${priority}','${status}','${category}','${dueDate}');`;
    await db.run(addTodo);
    response.send("Todo Successfully Added");
  }
});

//PUT
app.put("/todos/:todoId/", async (request, response) => {
  const { status, category, todo, priority, dueDate } = request.body;
  const { todoId } = request.params;
  if (status !== undefined) {
    if (status === "TO DO" || status === "IN PROGRESS" || status === "DONE") {
      const updateTodo = `update todo set status='${status}' where id = ${todoId} ;`;
      await db.run(updateTodo);
      response.send("Status Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else if (category !== undefined) {
    if (category === "WORK" || category === "HOME" || category === "LEARNING") {
      const updateTodo = `update todo set category='${category}' where id = ${todoId} ;`;
      await db.run(updateTodo);
      response.send("Category Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else if (priority !== undefined) {
    if (priority === "HIGH" || priority === "LOW" || priority === "MEDIUM") {
      const updateTodo = `update todo set priority='${priority}' where id = ${todoId} ;`;
      await db.run(updateTodo);
      response.send("Priority Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (todo !== undefined) {
    const updateTodo = `update todo set todo='${todo}' where id = ${todoId} ;`;
    await db.run(updateTodo);
    response.send("Todo Updated");
  } else if (dueDate !== undefined) {
    const updateTodo = `update todo set due_date='${dueDate}' where id = ${todoId} ;`;
    await db.run(updateTodo);
    response.send("Due Date Updated");
  }
});

//DELETE
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const deleteTodo = `delete from todo where id = ${todoId};`;
  await db.run(deleteTodo);
  response.send("Todo Deleted");
});

module.exports = app;
