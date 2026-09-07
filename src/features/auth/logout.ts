import { baseApi } from "@/lib/api/baseApi";
import { logout } from "@/features/auth/slice/auth.slice";
import { disconnectSocket } from "@/features/chat/socket/socket.client";
import type { AppDispatch } from "@/lib/redux/store";

// One place that fully tears down a session: auth state + token (localStorage
// + cookie), the socket, and every RTK Query cache entry.
export function performLogout(dispatch: AppDispatch) {
  disconnectSocket();
  dispatch(logout());
  dispatch(baseApi.util.resetApiState());
}
