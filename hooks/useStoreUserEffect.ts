import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-react";
import { useConvexAuth, useMutation } from "convex/react";
import { useEffect, useState } from "react";

export default function useStoreUserEffect() {
  const storeUser = useMutation(api.users.storeUser);
  const { isAuthenticated, isLoading } = useConvexAuth();

  const [userId, setUserId] = useState<Id<"users"> | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    async function createUser() {
      const id = await storeUser();
      setUserId(id);
    }

    createUser();
    return () => setUserId(null);
  }, [isAuthenticated, storeUser, user?.id]);

  return userId;
}
