import { useAuth } from "./useAuth";

export function useUser() {
  const { user } = useAuth();
  return user;
}
