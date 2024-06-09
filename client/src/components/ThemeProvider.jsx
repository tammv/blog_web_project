import { useSelector } from "react-redux";

export default function ThemeProvider({ children }) {
  // Destructure children from props
  const { theme } = useSelector((state) => state.theme);

  return <div className={`${theme} min-h-screen`}>{children}</div>;
}
