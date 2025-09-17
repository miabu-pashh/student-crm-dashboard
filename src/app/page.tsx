"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthWrapper from "@/components/dashboard/AuthWrapper";
import styles from "./page.module.css";

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleFilterClick = (filter: string) => {
    router.push(`/students?${filter}`);
  };

  if (!mounted) {
    return (
      <AuthWrapper>
        <div className={styles.container}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            Loading...
          </div>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <div className={styles.container}>
        <div className={styles.maxWidth}>
          <div className={styles.header}>
            <h1 className={styles.title}>Dashboard</h1>
            <p className={styles.subtitle}>
              Welcome to the Student CRM Dashboard
            </p>
          </div>

          <div className={styles.grid}>
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Total Students</h3>
              <div className={`${styles.statNumber} ${styles.blue}`}>342</div>
              <p className={styles.description}>Registered students</p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Active Students</h3>
              <div className={`${styles.statNumber} ${styles.green}`}>189</div>
              <p className={styles.description}>Active in last 30 days</p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Essay Stage</h3>
              <div className={`${styles.statNumber} ${styles.orange}`}>67</div>
              <p className={styles.description}>Working on essays</p>
            </div>

            <div className={styles.card}>
              <h3 className={styles.cardTitle}>Applications Submitted</h3>
              <div className={`${styles.statNumber} ${styles.green}`}>23</div>
              <p className={styles.description}>Completed applications</p>
            </div>

            {/* Action Items - Make these clickable */}
            <div
              className={`${styles.card} ${styles.red}`}
              onClick={() => handleFilterClick("needsEssayHelp=true")}
              style={{ cursor: "pointer", border: "2px solid #fecaca" }}
            >
              <h3 className={styles.cardTitle} style={{ color: "#dc2626" }}>
                Needs Essay Help
              </h3>
              <div className={`${styles.statNumber} ${styles.red}`}>15</div>
              <p className={styles.description} style={{ color: "#dc2626" }}>
                Students struggling
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#dc2626",
                  marginTop: "8px",
                }}
              >
                Click to view →
              </p>
            </div>

            <div
              className={styles.card}
              onClick={() => handleFilterClick("notContactedDays=7")}
              style={{ cursor: "pointer", border: "2px solid #fed7aa" }}
            >
              <h3 className={styles.cardTitle} style={{ color: "#ea580c" }}>
                Not Contacted (7d)
              </h3>
              <div className={`${styles.statNumber} ${styles.orange}`}>28</div>
              <p className={styles.description} style={{ color: "#ea580c" }}>
                Need follow-up
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#ea580c",
                  marginTop: "8px",
                }}
              >
                Click to view →
              </p>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div style={{ marginTop: "32px" }}>
            <div className={styles.card}>
              <h3
                className={styles.cardTitle}
                style={{ fontSize: "1.125rem", marginBottom: "16px" }}
              >
                Recent Activity
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "8px 0",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#2563eb",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <div>
                    <span style={{ fontWeight: "600" }}>Sarah Johnson</span>{" "}
                    asked about Common App essays
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      15 minutes ago
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "8px 0",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#059669",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <div>
                    <span style={{ fontWeight: "600" }}>Michael Chen</span>{" "}
                    submitted first essay draft
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      2 hours ago
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "8px 0",
                  }}
                >
                  <div
                    style={{
                      width: "8px",
                      height: "8px",
                      backgroundColor: "#d97706",
                      borderRadius: "50%",
                    }}
                  ></div>
                  <div>
                    <span style={{ fontWeight: "600" }}>Emma Davis</span> viewed
                    Stanford University
                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                      4 hours ago
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={() => router.push("/students")}
                style={{
                  marginTop: "16px",
                  padding: "8px 16px",
                  backgroundColor: "#2563eb",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.875rem",
                }}
              >
                View All Students →
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
