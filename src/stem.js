import React, { useState } from "react";

// ---- DATA (same as in your Vue code) ----
const categoriesData = [
  { name: "Science" },
  { name: "Mathematics" },
  { name: "Engineering" },
  { name: "Technology" },
];

const categoryColors = {
  Science: "linear-gradient(105deg, #2196F3 80%, #21CBF3 100%)", // Blue
  Mathematics: "linear-gradient(105deg, #7B1FA2 80%, #E040FB 100%)", // Purple
  Engineering: "linear-gradient(105deg, #388E3C 80%, #C8E6C9 100%)", // Green
  Technology: "linear-gradient(105deg, #F44336 80%, #FF8A65 100%)", // Red/Orange
};

const categoryIcons = {
  Science: "bi bi-radioactive", // Use bi-flask2 instead of bi-flask
  Mathematics: "bi bi-calculator",
  Engineering: "bi bi-tools",
  Technology: "bi bi-cpu",
};

const subcardColors = {
  Guide: "linear-gradient(105deg, #42a5f5 80%, #90caf9 100%)",
  "Question Bank": "linear-gradient(105deg, #7b1fa2 80%, #ba68c8 100%)",
  Concept: "linear-gradient(105deg, #388e3c 80%, #81c784 100%)",
  Practice: "linear-gradient(105deg, #fbc02d 80%, #ffe082 100%)",
  Quiz: "linear-gradient(105deg, #e53935 80%, #f06292 100%)",
};

const subcardsData = ["Guide", "Question Bank", "Concept", "Practice", "Quiz"];

const subcardIcons = {
  Guide: "bi bi-journal-text", // Journal/Book for guides
  "Question Bank": "bi bi-archive", // Archive for question bank
  Concept: "bi bi-lightbulb", // Lightbulb for concepts/ideas
  Practice: "bi bi-pencil-square", // Pencil for practice
  Quiz: "bi bi-patch-question", // Question badge for quizzes
};

const chaptersData = [
  {
    title: "Chapter 1: Introduction",
    description: "Basic overview of subject.",
    exercises: ["Exercise 1.1", "Exercise 1.2", "Exercise 1.3"],
  },
  {
    title: "Chapter 2: Advanced Concepts",
    description: "Deep dive into main concepts.",
    exercises: ["Exercise 2.1", "Exercise 2.2"],
  },
  {
    title: "Chapter 3: Problem Solving",
    description: "Examples and solutions.",
    exercises: ["Exercise 3.1", "Exercise 3.2", "Exercise 3.3"],
  },
];

// ---- COMPONENT ----
function Stem() {
  const [page, setPage] = useState("home");
  const [activeCategory, setActiveCategory] = useState({});
  const [activeSub, setActiveSub] = useState("");
  const [expandedChapterIndex, setExpandedChapterIndex] = useState(null);

  const subcards = subcardsData;
  const chapters = chaptersData;

  function toggleChapter(index) {
    setExpandedChapterIndex(expandedChapterIndex === index ? null : index);
  }

  return (
    <div className="container py-4">
      {/* HEADER */}
      <div className="app-header mb-4">
        <span className="brand-logo">STEMGURKAL</span>
        <span className="lead fw-light">
          Empower Learning in Science & Tech
        </span>
      </div>

      {/* HOME PAGE */}
      {page === "home" && (
        <>
          <div className="card-container">
            <div className="row g-4 justify-content-center">
              {categoriesData.map((item) => (
                <div
                  className="col-6 col-md-6"
                  key={item.name}
                  onClick={() => {
                    setActiveCategory(item);
                    setPage("subcategory");
                  }}
                >
                  <div
                    className="card-box"
                    style={{
                      background:
                        categoryColors[item.name] ||
                        "linear-gradient(110deg, #e3f2fd, #bbdefb 85%)",
                      color: "#fff",
                      borderRadius: "16px",
                      fontWeight: "bold",
                      boxShadow: "0 2px 12px rgba(39, 82, 163, 0.10)",
                      cursor: "pointer",
                      fontSize: "23px",
                      padding: "2rem 0",
                      textAlign: "center",
                    }}
                  >
                    {/* Icon for the category */}
                    <i
                      className={`${categoryIcons[item.name]}`}
                      style={{ fontSize: "2.5rem", display: "block" }}
                    ></i>
                    <div style={{ marginTop: "16px" }}>
                      {item.name.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* SUB-CARD PAGE */}
      {page === "subcategory" && (
        <>
          <button
            className="btn btn-outline-primary mb-3"
            onClick={() => setPage("home")}
          >
            ← Back
          </button>
          <div className="card-container">
            <div className="section-title">
              {activeCategory.name.toUpperCase()}
            </div>
            <div className="row g-4">
              {subcards.map((sub) => (
                <div
                  className="col-md-4"
                  key={sub}
                  onClick={() => {
                    setActiveSub(sub.toUpperCase());
                    setPage("details");
                    setExpandedChapterIndex(null);
                  }}
                >
                  <div
                    className="card-box-1"
                    style={{
                      background:
                        subcardColors[sub] ||
                        "linear-gradient(110deg, #e3f2fd, #bbdefb 85%)",
                      color: "#fff",
                      borderRadius: "16px",
                      fontWeight: "bold",
                      fontSize: "21px",
                      cursor: "pointer",
                      textAlign: "center",
                    }}
                  >
                    {/* Icon for the subcard */}
                    <i
                      className={`${subcardIcons[sub]}`}
                      style={{ fontSize: "2rem", display: "block" }}
                    ></i>
                    <div style={{ marginTop: "12px" }}>{sub.toUpperCase()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* DETAILS PAGE */}
      {page === "details" && (
        <>
          <button
            className="btn btn-outline-primary mb-3"
            onClick={() => setPage("subcategory")}
          >
            ← Back
          </button>
          <div className="section-title">Chapters - {activeSub}</div>
          <div className="accordion" id="chapterAccordion">
            {chapters.map((chapter, idx) => {
              const isExpanded = expandedChapterIndex === idx;
              return (
                <div
                  className="accordion-item chapter-card mb-3"
                  key={idx}
                  style={{
                    background:
                      idx % 2 === 0
                        ? "linear-gradient(110deg, #e3f2fd, #bbdefb 85%)"
                        : "linear-gradient(110deg, #fffde7, #ffe082 85%)",
                    borderRadius: "18px",
                    boxShadow: "0 2px 12px rgba(39, 82, 163, 0.10)",
                  }}
                >
                  <h2
                    className="accordion-header"
                    id={`heading${idx}`}
                    onClick={() => toggleChapter(idx)}
                    style={{
                      borderRadius: "12px",
                      fontWeight: "bold",
                      background:
                        idx % 2 === 0
                          ? "linear-gradient(90deg, #1565c0 70%, #64b5f6 100%)"
                          : "linear-gradient(90deg, #ffb300 70%, #ffe082 100%)",
                      color: "#fff",
                      boxShadow: "0 2px 8px rgba(48,99,185,0.10)",
                      cursor: "pointer",
                      padding: "0.75rem 1.25rem",
                      userSelect: "none",
                      fontSize: "16px",
                    }}
                  >
                    <i className="bi bi-journal-code fs-4 me-2"></i>
                    {chapter.title}
                    <span className="badge bg-light text-dark ms-3 px-2 py-1 shadow-sm">
                      {chapter.exercises.length} Exercises
                    </span>
                  </h2>
                  {isExpanded && (
                    <div
                      className="accordion-collapse show"
                      aria-labelledby={`heading${idx}`}
                    >
                      <div className="accordion-body">
                        <div className="mb-2">
                          <i className="bi bi-lightbulb"></i>{" "}
                          <b>Description:</b> {chapter.description}
                        </div>
                        <hr />
                        <b>
                          <i className="bi bi-list-check"></i> Exercises:
                        </b>
                        <ul className="list-group mt-2">
                          {chapter.exercises.map((ex) => (
                            <li
                              key={ex}
                              className="list-group-item border-0 px-3 py-2"
                              style={{
                                background: "rgba(255, 255, 255, 0.75)",
                                borderRadius: "8px",
                                marginBottom: "6px",
                              }}
                            >
                              <i className="bi bi-check2-circle text-primary me-2"></i>{" "}
                              {ex}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Stem;
