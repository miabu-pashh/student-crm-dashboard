"use client";
import { useEffect } from "react";
import { seedStudentsToFirestore } from "@/lib/seedToFirestore";

export default function SeedPage() {
  useEffect(() => {
    seedStudentsToFirestore(25).then(() => {
      alert("Seed complete ✅ Check Firestore.");
    });
  }, []);

  return <div style={{ padding: 20 }}>Seeding students...</div>;
}
