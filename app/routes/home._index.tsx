import { userCookie } from "~/.server/cookies";
import type { Route } from "../+types/root";
import invariant from "tiny-invariant";
import { createTodo, getTodosById } from "~/.server/models/todo";
import {
  data,
  useFetcher,
  useLoaderData,
  type FetcherWithComponents,
} from "react-router";
import { fetchUserName } from "~/.server/models/user";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";

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
  console.log("action invoked");
  const formData = await request.formData();

  const userId: string | null = await userCookie.parse(
    request.headers.get("Cookie"),
  );

  invariant(userId, "User id cannot be null");

  const intent = formData.get("intent");

  switch (intent) {
    case "createTodo":
      const newTodoTitle = formData.get("newTodoTitle");

      if (!newTodoTitle || newTodoTitle === "") {
        console.log("empty title");
        return;
      }

      await createTodo(userId, String(newTodoTitle));
    default:
      return;
  }
}

export default function HomePage() {
  const { userName, todos } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <section className="mx-auto h-full max-w-7xl bg-red-50">
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
    <createFetcher.Form method="post" onSubmit={handleSubmit}>
      <input type="text" name="newTodoTitle" ref={inputRef} />
      <button name="intent" value="createTodo">
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
    <header className="rounded-md bg-red-100 p-5 text-3xl font-semibold">
      Hi {userName},
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
  }, [isRunning]);

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
    <div>
      {!isRunning && time > 0 ? (
        <button>
          <RotateCcw onClick={handleReset} />
        </button>
      ) : null}
      <p>
        {Math.floor(time / 3600)}:{Math.floor((time % 3600) / 60)}:{time % 60}
      </p>
      <button>
        {isRunning ? (
          <Pause onClick={handlePause} />
        ) : (
          <Play onClick={handlePlay} />
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
  return (
    <div>
      <input type="checkbox" checked={todo.completed} />
      <span>{todo.title}</span>
    </div>
  );
}
