import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "./use-auth";

export function useChatHistory(sessionId?: string | number) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["chat", sessionId],
    queryFn: async () => {
      if (!sessionId || !token) return [];
      const result = await api.getChatHistory(token, sessionId);
      if (result.error) throw new Error(result.error);
      return result;
    },
    enabled: !!sessionId && !!token,
  });
}

export function useSendMessage() {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, message }: { sessionId: string | number; message: string }) => {
      if (!token) throw new Error("Not authenticated");
      const result = await api.sendMessage(token, sessionId.toString(), message);
      if (result.error) throw new Error(result.error);
      return { ...result, sentMessage: message };
    },
    onSuccess: (data, variables) => {
      // Manually update the cache to show the new message instantly
      queryClient.setQueryData(
        ["chat", variables.sessionId],
        (oldData: any[]) => {
          const currentData = oldData || [];
          return [
            ...currentData,
            { role: "user", content: variables.message, id: Date.now() },
            { role: "bot", content: data.reply, id: Date.now() + 1 }
          ];
        }
      );
      // Also invalidate to ensure sync
      queryClient.invalidateQueries({ queryKey: ["chat", variables.sessionId] });
    },
  });
}
