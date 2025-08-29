import { createContext } from "react";

const LoaderContext = createContext({
  setLoading: (val: boolean) => {},
});

export default LoaderContext;
