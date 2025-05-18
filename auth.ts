import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { AUTHOR_BY_GOOGLE_ID_QUERY } from "./sanity/lib/queries";
import { client } from "./sanity/lib/client";
import { writeClient } from "./sanity/lib/write-client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [Google],
  trustHost: true,
  callbacks: {
    async signIn({
      user,
      profile,
    }) {
      // console.log("google user", user);
      // console.log("google profile", profile);
      const existingUser = await client.fetch(AUTHOR_BY_GOOGLE_ID_QUERY, {
        id: profile?.sub,
      });
      if (!existingUser) {
        await writeClient.create({
          _type: "author",
          id: profile?.sub,
          name: user?.name,
          email: user?.email,
          image: user?.image,
        });
      }
      return true;
    },
    async jwt({token, account, profile}){
      if(account && profile){
        const user = await client.fetch(AUTHOR_BY_GOOGLE_ID_QUERY, {id: profile.sub});
        token.id = user?._id;
      }
      return token;
    },
    async session({session, token}){
      Object.assign(session,{id: token.id});
      return session;
    }
  },
});
