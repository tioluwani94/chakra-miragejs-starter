import React from "react";
import ReactDOM from "react-dom";
import { makeServer } from "./server";
import {
  ThemeProvider,
  CSSReset,
  Box,
  Heading,
  Stack,
  Text,
  Button,
  IconButton,
  Input
} from "@chakra-ui/core";

function App() {
  if (process.env.NODE_ENV === "development") {
    makeServer();
  }

  const [todos, setTodos] = React.useState([]);
  const [edit, setEdit] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/todos");
      const { todos } = await response.json();
      setTodos(todos);
    };

    fetchData();
  }, []);

  const addTask = (e, task) => {
    e.preventDefault();
    if (edit) {
      let newTasks = todos.map((value, i) =>
        activeIndex === i ? task : value
      );
      setTodos(newTasks);
      setActiveIndex(null);
      setEdit(false);
    } else {
      setTodos([task, ...todos]);
    }
    setInputValue("");
  };

  const deleteTask = async i => {
    const response = await fetch(`/api/todos/${i}`, { method: "DELETE" });
    const data = response.json();
    console.log(data);
    // setTodos(todos.filter((task, index) => index !== i));
  };

  const setEditMode = i => {
    setInputValue(todos[i].title);
    setActiveIndex(i);
    setEdit(true);
  };

  return (
    <ThemeProvider>
      <CSSReset />
      <Box padding={4}>
        <Heading>
          Welcome to{" "}
          <span role="img" aria-label="logo">
            ⚡️
          </span>{" "}
          Chakra UI
        </Heading>
        <form onSubmit={e => addTask(e, inputValue)}>
          <Stack marginY="1rem" isInline alignItems="center">
            <Box>
              <Input
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
              />
            </Box>
            <Box>
              <Button variantColor="blue" type="submit">
                {edit ? `Edit` : `Add`} task
              </Button>
            </Box>
          </Stack>
        </form>
        <ul>
          {todos.map((task, i) => (
            <Stack
              isInline
              alignItems="center"
              marginBottom="0.5rem"
              key={`${task}-${i}`}
            >
              <Box>
                <Text>{task.title}</Text>
              </Box>
              <Box>
                <IconButton
                  icon="edit"
                  size="sm"
                  onClick={() => setEditMode(i)}
                />
              </Box>
              <Box>
                <IconButton
                  icon="delete"
                  size="sm"
                  onClick={() => deleteTask(i)}
                />
              </Box>
            </Stack>
          ))}
        </ul>
      </Box>
    </ThemeProvider>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
