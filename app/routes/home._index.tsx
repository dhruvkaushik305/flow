import { userCookie } from "~/.server/cookies";
import type { Route } from "../+types/root";
import invariant from "tiny-invariant";
import {
  createTodo,
  deleteTodo,
  getTodosById,
  toggleTodo,
  updateTodo,
} from "~/.server/models/todo";
import {
  data,
  useFetcher,
  useLoaderData,
  type FetcherWithComponents,
} from "react-router";
import { fetchUserName } from "~/.server/models/user";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Trash } from "lucide-react";

export async function loader({ request }: Route.LoaderArgs) {
  const userId: string | null = await userCookie.parse(
    request.headers.get("Cookie"),
  );

  invariant(userId, "User cannot be null at the Home route");

  const userName = await fetchUserName(userId);

  invariant(userName, "User not found");

  const todos = await getTodosById(userId);

  return data({ userName, todos }, { status: 200 });
}

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData();

  const userId: string | null = await userCookie.parse(
    request.headers.get("Cookie"),
  );

  invariant(userId, "User id cannot be null");

  const intent = formData.get("intent");

  if (intent == "createTodo") {
    const newTodoTitle = formData.get("newTodoTitle");

    if (!newTodoTitle || String(newTodoTitle) === "") return;

    await createTodo(userId, String(newTodoTitle));
  } else if (intent == "toggleTodo") {
    const todoId = formData.get("todoId");

    const newState = formData.get("completed") === "true";

    if (!todoId) return;

    await toggleTodo(String(todoId), newState);
  } else if (intent == "updateTodo") {
    const todoId = String(formData.get("todoId"));

    const newTitle = formData.get("newTitle");

    if (!todoId || !newTitle || String(newTitle) === "") return;

    await updateTodo(todoId, String(newTitle));
  } else if (intent == "deleteTodo") {
    const todoId = formData.get("todoId");

    if (!todoId) return;

    await deleteTodo(String(todoId));
  }
}

export default function HomePage() {
  const { userName, todos } = useLoaderData<typeof loader>();

  return (
    <section className="mx-auto h-full max-w-7xl space-y-8">
      <RenderHeader userName={userName} />
      <CreateTodo />
      {todos.map((todo) => (
        <RenderTodo key={todo.id} todo={todo} />
      ))}
    </section>
  );
}

function CreateTodo() {
  const inputRef = useRef<HTMLInputElement>(null);
  const createFetcher = useFetcher();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    await createFetcher.submit(event.currentTarget.form);

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <createFetcher.Form
      method="post"
      onSubmit={handleSubmit}
      className="flex gap-2 p-2 md:gap-5"
    >
      <input
        type="text"
        name="newTodoTitle"
        ref={inputRef}
        placeholder="What do you want to do?"
        className="input-box p-1 md:p-2"
      />
      <button
        name="intent"
        value="createTodo"
        className="btn-outline-primary md:px-7"
      >
        Add
      </button>
    </createFetcher.Form>
  );
}

interface RenderHeaderProps {
  userName: string;
}

function RenderHeader({ userName }: RenderHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-around space-y-5 rounded-xl p-5 shadow-md">
      <h1 className="text-2xl font-semibold md:text-3xl">
        Hi <span className="italic">{userName}</span>,
      </h1>
      <RenderStopWatch />
    </header>
  );
}

function RenderStopWatch() {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning, time]);

  const handlePause = () => {
    setIsRunning(false);
  };

  const handlePlay = () => {
    setIsRunning(true);
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
  };

  return (
    <div className="flex w-full max-w-sm items-center justify-around rounded-md bg-primary-500 p-1 text-white shadow-lg md:p-3">
      {!isRunning && time > 0 ? (
        <button>
          <RotateCcw onClick={handleReset} />
        </button>
      ) : null}
      <p className="text-2xl md:text-3xl">
        {Math.floor(time / 3600)}:{Math.floor((time % 3600) / 60)}:{time % 60}
      </p>
      <button>
        {isRunning ? (
          <Pause onClick={handlePause} />
        ) : (
          <Play onClick={handlePlay} className="w-7" />
        )}
      </button>
    </div>
  );
}

interface RenderTodoProps {
  todo: {
    id: string;
    title: string;
    completed: boolean;
  };
}

function RenderTodo({ todo }: RenderTodoProps) {
  const toggleFetcher = useFetcher();
  const updateFetcher = useFetcher();
  const deleteFetcher = useFetcher();

  const handleToggleTodo = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append("todoId", todo.id);
    formData.append("intent", "toggleTodo");
    formData.append("completed", event.target.checked ? "true" : "false");

    await toggleFetcher.submit(formData, { method: "POST" });
  };

  const handleUpdateTodo = async (event: React.FocusEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    formData.append("todoId", todo.id);
    formData.append("intent", "updateTodo");

    await updateFetcher.submit(formData, { method: "POST" });
  };

  const handleDeleteTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();

    formData.set("todoId", todo.id);
    formData.set("intent", "deleteTodo");

    await deleteFetcher.submit(formData, { method: "POST" });
  };

  return (
    <div>
      <toggleFetcher.Form>
        <input
          type="checkbox"
          checked={todo.completed}
          name="completed"
          onChange={handleToggleTodo}
        />
      </toggleFetcher.Form>
      <updateFetcher.Form onBlur={handleUpdateTodo}>
        <input defaultValue={todo.title} name="newTitle" />
      </updateFetcher.Form>
      <deleteFetcher.Form onSubmit={handleDeleteTodo}>
        <button type="submit">
          <Trash />
        </button>
      </deleteFetcher.Form>
    </div>
  );
}
