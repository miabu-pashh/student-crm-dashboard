"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthWrapper from "@/components/dashboard/AuthWrapper";
import styles from "./page.module.css";
import { generateMockStudents } from "@/lib/seedData";

interface Student {
  id: string;
  name: string;
  email: string;
  country: string;
  applicationStatus: "Exploring" | "Shortlisting" | "Applying" | "Submitted";
  lastActive: Date;
  intentScore: number;
  needsEssayHelp: boolean;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const generatedStudents = generateMockStudents(50);
    setStudents(generatedStudents);
    setFilteredStudents(generatedStudents);
    setMounted(true); // Add this line!
  }, []);

  useEffect(() => {
    // Apply URL parameters for filtering
    const status = searchParams.get("applicationStatus");
    const needsHelp = searchParams.get("needsEssayHelp");

    if (status) setStatusFilter(status);
    if (needsHelp === "true") {
      // Filter students who need essay help
      setFilteredStudents(students.filter((s) => s.needsEssayHelp));
    }
  }, [searchParams, students]);

  useEffect(() => {
    if (!mounted) return;

    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter(
        (student) => student.applicationStatus === statusFilter
      );
    }

    if (countryFilter) {
      filtered = filtered.filter(
        (student) => student.country === countryFilter
      );
    }

    setFilteredStudents(filtered);
  }, [searchTerm, statusFilter, countryFilter, students, mounted]);

  const handleStudentClick = (studentId: string) => {
    router.push(`/students/${studentId}`);
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Exploring":
        return styles.statusExploring;
      case "Shortlisting":
        return styles.statusShortlisting;
      case "Applying":
        return styles.statusApplying;
      case "Submitted":
        return styles.statusSubmitted;
      default:
        return styles.statusExploring;
    }
  };

  const getIntentClass = (score: number) => {
    if (score >= 80) return styles.intentHigh;
    if (score >= 60) return styles.intentMedium;
    return styles.intentLow;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setCountryFilter("");
  };

  if (!mounted) {
    return (
      <AuthWrapper>
        <div className={styles.container}>
          <div className={styles.maxWidth}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "200px",
              }}
            >
              <div>Loading students...</div>
            </div>
          </div>
        </div>
      </AuthWrapper>
    );
  }

  return (
    <AuthWrapper>
      <div className={styles.container}>
        <div className={styles.maxWidth}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>Students</h1>
            <p className={styles.subtitle}>
              Manage and track all student interactions (
              {filteredStudents.length} students)
            </p>
          </div>

          {/* Filters */}
          <div className={styles.filtersCard}>
            <div className={styles.filtersRow}>
              <div className={styles.searchGroup}>
                <label className={styles.searchLabel} htmlFor="search">
                  Search Students
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Status</option>
                <option value="Exploring">Exploring</option>
                <option value="Shortlisting">Shortlisting</option>
                <option value="Applying">Applying</option>
                <option value="Submitted">Submitted</option>
              </select>

              <select
                value={countryFilter}
                onChange={(e) => setCountryFilter(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">All Countries</option>
                <option value="USA">USA</option>
                <option value="Canada">Canada</option>
                <option value="UK">UK</option>
                <option value="Australia">Australia</option>
                <option value="India">India</option>
                <option value="Germany">Germany</option>
              </select>

              <button onClick={clearFilters} className={styles.clearButton}>
                Clear Filters
              </button>
            </div>
          </div>

          {/* Students Table */}
          <div className={styles.tableCard}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th className={styles.tableHeaderCell}>Student</th>
                  <th className={styles.tableHeaderCell}>Country</th>
                  <th className={styles.tableHeaderCell}>Status</th>
                  <th className={styles.tableHeaderCell}>Intent Score</th>
                  <th className={styles.tableHeaderCell}>Last Active</th>
                  <th className={styles.tableHeaderCell}>Essay Help</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr
                    key={student.id}
                    className={styles.tableRow}
                    onClick={() => handleStudentClick(student.id)}
                  >
                    <td className={styles.tableCell}>
                      <div>
                        <div className={styles.studentName}>{student.name}</div>
                        <div className={styles.studentEmail}>
                          {student.email}
                        </div>
                      </div>
                    </td>
                    <td className={styles.tableCell}>{student.country}</td>
                    <td className={styles.tableCell}>
                      <span
                        className={`${styles.statusBadge} ${getStatusClass(
                          student.applicationStatus
                        )}`}
                      >
                        {student.applicationStatus}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span
                        className={`${styles.intentScore} ${getIntentClass(
                          student.intentScore
                        )}`}
                      >
                        {student.intentScore}%
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      {student.lastActive.toLocaleDateString()}
                    </td>
                    <td className={styles.tableCell}>
                      {student.needsEssayHelp ? "⚠️ Yes" : "✅ No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredStudents.length === 0 && (
              <div
                style={{
                  padding: "48px 20px",
                  textAlign: "center",
                  color: "#6b7280",
                }}
              >
                No students found matching your criteria
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthWrapper>
  );
}
