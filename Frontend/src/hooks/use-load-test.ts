import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./use-auth";

export function useLoadTest(id?: string | number) {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["load-test", id],
    queryFn: async () => {
      if (!id || !token) return null;
      const result = await api.getLoadTest(token, id);
      if (result.error) throw new Error(result.error);
      return result;
    },
    enabled: !!id && !!token,
  });
}


export function useRunLoadTest() {
  const { token, user, updateUser } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { url: string; githubRepo?: string }) => {
      if (!token) throw new Error("Not authenticated");

      const result = await api.runLoadTest(
        token,
        data.url,
        data.githubRepo
      );

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (data: { id: number; url: string; metrics?: any }) => {
      if (user) {
        updateUser({
          ...user,
          credits: Math.max(0, user.credits - 1),
          totalTests: (user.totalTests || 0) + 1
        });
      }
      toast({
        title: "Load Test Complete",
        description: `Successfully analyzed ${data.metrics?.totalRequests || 0} requests`,
      });
      queryClient.invalidateQueries({ queryKey: ["load-test"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Test Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}