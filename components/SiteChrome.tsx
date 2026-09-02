"use client";

import Header from "./Header";
import { useLenis } from "./useLenis";

/** Client shell: smooth scroll plus the fixed header. */
export default function SiteChrome() {
  useLenis();
  return <Header />;
}
