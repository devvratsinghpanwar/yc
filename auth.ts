// "use server"

// import { redirect } from "next/navigation";
// import { supabase } from "./lib/supabaseClient";

// export async function signInWithEmail(email: string, password: string) {
//   const { error } = await supabase.auth.signInWithPassword({
//     email,
//     password,
//   });
//   if (error) throw error;
// }

// export async function signOut() {
//   const { error } = await supabase.auth.signOut();
//   if (error) {
//     throw error;
//   } else {
//     redirect("/");
//   }
// }
