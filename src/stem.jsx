import React, { useEffect, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import BenefitsCarousel from "./BenefitsCarousel";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Offcanvas from "react-bootstrap/Offcanvas";

import {
  Container,
  Row,
  Col,
  Dropdown,
  Button,
  ButtonGroup,
  Modal,
} from "react-bootstrap";

const categoriesData = [
  { name: "Science" },
  { name: "Technology" },
  { name: "Engineering" },
  { name: "Mathematics" },
];

const categoryIcons = {
  Science: "bi bi-radioactive",
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
  Guide: "bi bi-journal-text",
  "Question Bank": "bi bi-archive",
  Concept: "bi bi-lightbulb",
  Practice: "bi bi-pencil-square",
  Quiz: "bi bi-patch-question",
};
const features = ["Guide", "Question Bank", "Concept", "Practice", "Quiz"];

const syllabusOptions = ["TamilNadu StateBoard Class 12", "NCERT Class 12"];

const classList = Array.from({ length: 12 - 6 + 1 }, (_, i) => 12 - i);

const fallbackChaptersData = [
  {
    title: "Chapter 1: Introduction",
    description: "Basic overview of subject.",
    exercises: ["chapter-1", "chapter-2", "chapter-3"],
  },
  {
    title: "Chapter 2: Advanced Concepts",
    description: "Deep dive into main concepts.",
    exercises: ["chapter-2", "chapter-2"],
  },
  {
    title: "Chapter 3: Problem Solving",
    description: "Examples and solutions.",
    exercises: ["chapter-2", "chapter-2", "chapter-2"],
  },
];

const renderBoardFooter = (boardLabel) => (
  <div style={{ marginBottom: "32px", textAlign: "left" }}>
    <div
      style={{
        fontWeight: 800,
        fontSize: "20px",
        color: "#facc15",
        marginBottom: "18px",
      }}
    >
      {boardLabel}
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
        rowGap: "32px",
        columnGap: "40px",
        justifyItems: "start",
      }}
    >
      {classList.map((cls) => (
        <div key={`${boardLabel}-${cls}`}>
          <div
            style={{
              fontWeight: 700,
              marginBottom: "10px",
              fontSize: "16px",
              color: "#facc15",
            }}
          >
            Class {cls}
          </div>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              lineHeight: 1.7,
            }}
          >
            {["Guide", "Question Bank", "Concept", "Practice", "Quiz"].map(
              (item) => (
                <li key={item} style={{ cursor: "pointer" }}>
                  {item}
                </li>
              ),
            )}
          </ul>
        </div>
      ))}
    </div>
  </div>
);

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function Stem() {
  const [showLogin, setShowLogin] = useState(false);
  const [page, setPage] = useState("home"); // existing
  const [selectedSchoolClass, setSelectedSchoolClass] = useState(null); // NEW
  const [activeCategory, setActiveCategory] = useState({});
  const [activeSub, setActiveSub] = useState("");
  const [expandedChapterIndex, setExpandedChapterIndex] = useState(null);
  const [selectedSub, setSelectedSub] = useState("");
  const [openCategory, setOpenCategory] = useState("");
  const subjects = ["Science", "Technology", "Engineering", "Mathematics"];
  const [loginContext, setLoginContext] = useState("home");
  const [hoveredClass, setHoveredClass] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [showBoardSelect, setShowBoardSelect] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState("");
  const [openExercise, setOpenExercise] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [subscribeChoice, setSubscribeChoice] = useState(true); // default Yes
  const [isProtectedMode, setIsProtectedMode] = useState(true);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [allowClick, setAllowClick] = useState(false);
  const [openChapterPdf, setOpenChapterPdf] = useState(null);
  const [showSubscribePopup, setShowSubscribePopup] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [comingSoonSubject, setComingSoonSubject] = useState("");

  // master + dynamic content
  const [masterData, setMasterData] = useState(null);
  const [contentData, setContentData] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const subcards = subcardsData;
  const chaptersFallback = fallbackChaptersData;
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    name: "",
    mobileNo: "",
    emailID: "",
    password: "",
  });

  const toggleChapter = (index) => {
    setExpandedChapterIndex(expandedChapterIndex === index ? null : index);
    // Load chapter PDF when expanding
    if (expandedChapterIndex !== index) {
      const chapters = getChaptersData() || chaptersFallback;
      const chapterPdfPath = chapters[index]?.pdfpath;
      if (chapterPdfPath) {
        setOpenChapterPdf(chapterPdfPath);
      }
    } else {
      setOpenChapterPdf(null);
    }
  };

  const handleExerciseClick = (exerciseName) => {
    if (openExercise === exerciseName) {
      setOpenExercise(null);
      setAllowClick(false);
      return;
    }
    // INSTANT allow + open
    setAllowClick(true);
    setOpenExercise(exerciseName);
    // Block screenshot only after PDF loads (5s)
    setTimeout(() => {
      if (openExercise === exerciseName) {
        setAllowClick(false);
      }
    }, 5000);
  };
  const subjectStyles = {
    Science: {
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      icon: "🔬",
    },
    Technology: {
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      icon: "💻",
    },
    Engineering: {
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      icon: "🔧",
    },
    Mathematics: {
      gradient: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
      icon: "📐",
    },
  };

  const subModules = ["Guide", "Question Bank", "Concept", "Practice", "Quiz"];
  const boards = ["TamilNadu StateBoard", "NCERT"]; // TamilNadu only available
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn"); // ✅ remove login status
    toast.info("Logged out successfully", { autoClose: 1500 });

    setPage("home"); // optional: return home
  };

  const renderSubjectCard = (sub) => (
    <div
      key={sub}
      className="subject-card"
      style={{
        borderRadius: 20,
        padding: "28px 24px",
        marginBottom: 16,
        cursor: "pointer",
        background: subjectStyles[sub].gradient,
        color: "white",
        transition: "all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
        position: "relative",
        overflow: "hidden",
        transform: hoveredClass ? "scale(0.95)" : "scale(1)",
        opacity: hoveredClass && hoveredClass !== sub ? 0.7 : 1,
      }}
      onClick={() => {
        if (sub === "Mathematics") {
          if (isMobile) {
            // 📱 Mobile → open new page
            setActiveSubject("Mathematics");
            setPage("mathModules");
          } else {
            // 🖥 Desktop → show below (existing)
            setActiveSubject(sub);
          }
        } else {
          setComingSoonSubject(sub);
          setShowComingSoon(true);
        }
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 16px 35px rgba(0,0,0,0.15)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
      }}
    >
      <div
        style={{
          fontSize: 48,
          marginBottom: 16,
          filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
        }}
      >
        {subjectStyles[sub].icon}
      </div>
      <div
        style={{
          fontWeight: 800,
          fontSize: 24,
          marginBottom: 8,
          textShadow: "0 2px 4px rgba(0,0,0,0.3)",
          color: "#000000",
        }}
      >
        {sub}
      </div>
      <div
        style={{
          fontSize: 16,
          opacity: 0.95,
          lineHeight: 1.4,
          color: "#000000",
        }}
      >
        Complete curriculum for all classes 6-12
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          fontSize: 28,
          opacity: 0.8,
          color: "#000000",
        }}
      >
        →
      </div>
    </div>
  );

  const handleModuleClick = (module) => {
    // ✅ Only Mathematics + Guide allowed
    if (activeSubject === "Mathematics" && module === "Guide") {
      setSelectedModule(module);
      setShowBoardSelect(true); // open 2nd screenshot popup
    } else {
      // ❌ Everything else = Coming Soon
      setComingSoonSubject(`${activeSubject} - ${module}`);
      setShowComingSoon(true);
    }
  };

  const handleBoardSelect = (board) => {
    console.log(`${activeSubject} - ${selectedModule} - ${board} selected`);

    if (board === "TamilNadu StateBoard") {
      // 1) subject & module state
      setActiveCategory({ name: activeSubject }); // e.g. Mathematics
      setSelectedSub(selectedModule); // e.g. Guide
      setActiveSub(`${activeSubject} ${selectedModule}`); // "Mathematics Guide"

      // 2) board + class selection (same as syllabus page logic)
      setSelectedSyllabus("TamilNadu StateBoard Class 12");
      setSelectedClass(null); // let user choose class 12–6

      // 3) go to CLASS page (already exists in Stem.jsx)
      setPage("class"); // or "classSelect" if you prefer that page
    } else {
      alert("NCERT coming soon");
    }

    setShowBoardSelect(false);
    setActiveSubject(null);
  };
  const [loginData, setLoginData] = useState({
    emailid: "",
    password: "",
  });

  const renderSubjectBlock = (subjectName, classLabel) => (
    <div
      style={{
        borderRadius: 14,
        border: "1px solid #e0e0e0",
        padding: "12px 16px",
        marginBottom: 12,
        backgroundColor: "#fafafa",
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 16 }}>{subjectName}</div>
      <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>
        Content for {classLabel} {subjectName}
      </div>
      <div
        style={{
          marginTop: 8,
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        {subcardsData.map((sub) => (
          <button
            key={sub}
            onClick={() => {
              // your logic
            }}
            style={{
              width: "100%",
              textAlign: "left",
              border: "1px solid rgba(0,0,0,0.05)",
              background: "white",
              padding: "12px 12px",
              fontSize: 14,
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderRadius: 14,
              cursor: "pointer",
              marginBottom: 8,
              boxShadow: "0 10px 20px rgba(15,23,42,0.06)",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateX(5px)";
              e.currentTarget.style.boxShadow =
                "0 14px 30px rgba(15,23,42,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateX(0px)";
              e.currentTarget.style.boxShadow =
                "0 10px 20px rgba(15,23,42,0.06)";
            }}
          >
            {subjectName} {sub}
          </button>
        ))}
      </div>
    </div>
  );
  // Add this NEW useEffect after all useState declarations
  useEffect(() => {
    // Restore login state on page refresh
    const savedLogin = localStorage.getItem("isLoggedIn");
    if (savedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []); // Empty dependency - runs once on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSubscribePopup(true);
    }, 180000); // ✅ 3 minutes = 180000 ms

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (page !== "details") return;

    // 1. Block ALL context menus
    document.addEventListener(
      "contextmenu",
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      },
      true,
    );

    // 2. Block PrintScreen + variants (multiple layers)
    const blockKeys = (e) => {
      const blocked = [
        "PrintScreen",
        "PrtSc",
        "PrtScr",
        "prt sc",
        e.ctrlKey && "p", // Ctrl+P
        e.ctrlKey && e.shiftKey && "i", // DevTools
      ];

      if (blocked.some((b) => b && (e.key === b || e.code === b))) {
        e.preventDefault();
        e.stopImmediatePropagation();
        document.body.innerHTML +=
          '<div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:red;z-index:99999;font-size:50px;display:flex;align-items:center;justify-content:center">🚫 SCREENSHOT BLOCKED</div>';
        setTimeout(
          () =>
            document
              .querySelectorAll('div[style*="SCREENSHOT"]')
              .forEach((el) => el.remove()),
          1000,
        );
        return false;
      }
    };

    // Multiple listeners - capture phase
    document.addEventListener("keydown", blockKeys, {
      capture: true,
      passive: false,
    });
    window.addEventListener("keydown", blockKeys, {
      capture: true,
      passive: false,
    });

    // 3. Canvas trap (advanced - detects screenshot attempts)
    const canvasTrap = document.createElement("canvas");
    canvasTrap.width = 1;
    canvasTrap.height = 1;
    canvasTrap.style.position = "absolute";
    canvasTrap.style.left = "-9999px";
    document.body.appendChild(canvasTrap);

    return () => {
      document.removeEventListener("contextmenu", () => {});
      document.removeEventListener("keydown", blockKeys);
      window.removeEventListener("keydown", blockKeys);
      if (canvasTrap.parentNode) canvasTrap.parentNode.removeChild(canvasTrap);
    };
  }, [page]);

  // load master (stemsubs.json) once
  useEffect(() => {
    fetch("/stemsubs.json")
      .then((res) => res.json())
      .then(setMasterData)
      .catch(console.error);
  }, []); // [web:10][web:28]

  // load subject/class json dynamically
  useEffect(() => {
    if (
      !masterData ||
      !selectedClass ||
      !selectedSyllabus ||
      !activeCategory.name ||
      !selectedSub
    ) {
      setContentData(null);
      return;
    }

    setContentLoading(true);

    const subjectKey = activeCategory.name; // Science / Technology / Engineering / Mathematics
    const classKey = String(selectedClass); // "12"
    const jsonPath =
      masterData.subjects?.[subjectKey]?.[selectedSub]?.[selectedSyllabus]?.[
        classKey
      ];

    if (jsonPath) {
      fetch(jsonPath)
        .then((res) => res.json())
        .then(setContentData)
        .catch(() => setContentData(null))
        .finally(() => setContentLoading(false));
    } else {
      setContentData(null);
      setContentLoading(false);
    }
  }, [
    masterData,
    activeCategory.name,
    selectedSub,
    selectedSyllabus,
    selectedClass,
  ]); // [web:10][web:31]
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 992);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const getChaptersData = () => {
    return (
      contentData?.[activeCategory.name]?.[selectedSub]?.[selectedSyllabus]
        ?.chapters || []
    );
  };

  const getExercisePdfPath = (exerciseName) => {
    const syllabusData =
      contentData?.[activeCategory.name]?.[selectedSub]?.[selectedSyllabus];
    if (!syllabusData) return null;

    for (const chapter of syllabusData.chapters) {
      if (chapter.exercises?.[exerciseName]) {
        return chapter.exercises[exerciseName].pdfpath; // Use JSON path: "/Exercise-1.pdf"
      }
    }
    return null;
  };

  const isValidContentFlow = !!(
    contentData &&
    activeCategory.name &&
    selectedSub &&
    selectedSyllabus &&
    selectedClass
  );

  return (
    <div
      className="w-100"
      style={{
        minHeight: "100vh", // ✅ MUST
        margin: 0,
        padding: 0,
        overflowX: "hidden",
        overflowY: "visible", // ✅ OR remove completely
        background: "transparent",
      }}
    >
      {/* TOP HEADER BAR */}
      <div
        style={{
          width: "100%",
          background: "linear-gradient(90deg,#006666,#00897b)",
          color: "white",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 2px 12px rgba(0,0,0,0.12)",
        }}
      >
        {/* same two <span> elements stay here */}
        <span
          style={{ fontWeight: 700, letterSpacing: "0.08em", fontSize: "22px" }}
        >
          STEMGURUKUL
        </span>
        <span style={{ fontSize: isMobile ? "12px" : "14px" }}>
          {isMobile
            ? "Science & Tech Learning"
            : "Empower Learning in Science & Tech"}
        </span>
      </div>

      {/* CATEGORY / LOGIN ROW */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e0e0e0",
          padding: "8px 24px",
        }}
      >
        <Container fluid>
          {isMobile ? (
            <Row className="align-items-center">
              <Col xs={12}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  {/* ✅ Attractive MENU button */}
                  <button
                    type="button"
                    onClick={() => setShowMobileMenu(true)}
                    style={{
                      width: 46,
                      height: 46,
                      borderRadius: 14,
                      border: "1px solid rgba(0,0,0,0.08)",
                      background: "linear-gradient(135deg,#ffffff,#f1f5f9)",
                      boxShadow: "0 8px 22px rgba(15,23,42,0.12)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                    }}
                  >
                    <i
                      className="bi bi-list"
                      style={{
                        fontSize: 26,
                        color: "#0f172a",
                      }}
                    />
                  </button>

                  {/* ✅ Right Login */}
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      style={{
                        border: "none",
                        background: "transparent",
                        fontSize: 22,
                        color: "#dc2626",
                        cursor: "pointer",
                      }}
                    >
                      <i className="bi bi-box-arrow-right" />
                    </button>
                  ) : (
                    <Button
                      variant="primary"
                      style={{
                        borderRadius: 12,
                        padding: "8px 16px",
                        fontWeight: 800,
                        boxShadow: "0 10px 22px rgba(37,99,235,0.25)",
                      }}
                      onClick={() => {
                        setLoginContext("home");
                        setShowLogin(true);
                      }}
                    >
                      Login
                    </Button>
                  )}
                </div>

                {/* ✅ MOBILE SIDEBAR MENU */}
                <Offcanvas
                  show={showMobileMenu}
                  onHide={() => setShowMobileMenu(false)}
                  placement="start"
                  style={{
                    width: "300px",
                    borderRadius: "0 24px 24px 0",
                    overflow: "hidden",
                    boxShadow: "18px 0 60px rgba(0,0,0,0.35)",
                  }}
                >
                  {/* ✅ Header + Close button right */}
                  <div
                    style={{
                      padding: "18px 16px",
                      background: "linear-gradient(135deg,#006666,#00a680)",
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 10 }}
                    >
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 14,
                          background: "rgba(255,255,255,0.15)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 18,
                          fontWeight: 900,
                        }}
                      >
                        SG
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 900,
                            letterSpacing: "0.08em",
                            fontSize: 15,
                          }}
                        >
                          STEMGURUKUL
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setShowMobileMenu(false)}
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.3)",
                        background: "rgba(255,255,255,0.15)",
                        color: "white",
                        fontSize: 18,
                        cursor: "pointer",
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  {/* ✅ Body */}
                  <div style={{ padding: "14px 12px" }}>
                    {categoriesData.map((item) => {
                      const isOpen = openCategory === item.name; // ✅ MUST DEFINE HERE

                      return (
                        <div key={item.name} style={{ marginBottom: 10 }}>
                          {/* Category Button */}
                          <button
                            onClick={() => {
                              setOpenCategory(
                                openCategory === item.name ? "" : item.name,
                              );
                            }}
                            style={{
                              width: "100%",
                              textAlign: "left",
                              border: isOpen
                                ? "1px solid rgba(0,166,128,0.45)"
                                : "1px solid rgba(0,0,0,0.05)",
                              background: isOpen
                                ? "linear-gradient(135deg,#ecfeff,#eef2ff)"
                                : "linear-gradient(135deg,#ffffff,#f8fafc)",
                              padding: "14px 14px",
                              borderRadius: 16,
                              fontWeight: 900,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              cursor: "pointer",
                              boxShadow: isOpen
                                ? "0 12px 30px rgba(0,166,128,0.18)"
                                : "0 8px 18px rgba(15,23,42,0.08)",
                              transition: "all 0.25s ease",
                            }}
                          >
                            <span
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 10,
                              }}
                            >
                              <span
                                style={{
                                  width: 34,
                                  height: 34,
                                  borderRadius: 14,
                                  background: isOpen
                                    ? "rgba(0,166,128,0.12)"
                                    : "rgba(2,132,199,0.08)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <i
                                  className={categoryIcons[item.name]}
                                  style={{ fontSize: 18 }}
                                />
                              </span>

                              {item.name}
                            </span>

                            <i
                              className={
                                isOpen
                                  ? "bi bi-chevron-up"
                                  : "bi bi-chevron-down"
                              }
                            />
                          </button>

                          {/* Sub menu */}
                          {isOpen && (
                            <div style={{ paddingLeft: 8, marginTop: 8 }}>
                              {subcardsData.map((sub) => (
                                <button
                                  key={sub}
                                  onClick={() => {
                                    const label = `${item.name} ${sub}`;

                                    setActiveCategory(item);
                                    setSelectedSub(sub);

                                    setActiveSubject(item.name);
                                    setSelectedModule(sub);

                                    setActiveSub(label.toUpperCase());
                                    setSelectedSyllabus("");
                                    setSelectedClass(null);

                                    setShowBoardSelect(true);
                                    setExpandedChapterIndex(null);

                                    setShowMobileMenu(false); // ✅ close sidebar
                                    setOpenCategory("");
                                  }}
                                  style={{
                                    width: "100%",
                                    textAlign: "left",
                                    border: "1px solid rgba(0,0,0,0.05)",
                                    background: "white",
                                    padding: "12px 12px",
                                    fontSize: 14,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    borderRadius: 14,
                                    cursor: "pointer",
                                    marginBottom: 8,
                                    boxShadow:
                                      "0 10px 20px rgba(15,23,42,0.06)",
                                    transition: "all 0.2s ease",
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.transform =
                                      "translateX(5px)";
                                    e.currentTarget.style.boxShadow =
                                      "0 14px 30px rgba(15,23,42,0.12)";
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.transform =
                                      "translateX(0px)";
                                    e.currentTarget.style.boxShadow =
                                      "0 10px 20px rgba(15,23,42,0.06)";
                                  }}
                                >
                                  <i
                                    className={subcardIcons[sub]}
                                    style={{ fontSize: 16 }}
                                  />
                                  <span>
                                    {item.name} {sub}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </Offcanvas>
              </Col>
            </Row>
          ) : (
            // ✅ desktop section remains same
            <Row className="align-items-center g-3 flex-wrap">
              <Col xs="auto" className="d-flex gap-3 flex-wrap">
                {categoriesData.map((item) => {
                  const isActive = activeCategory.name === item.name;
                  const isOpen = openCategory === item.name;
                  return (
                    <Dropdown
                      as={ButtonGroup}
                      key={item.name}
                      show={isOpen}
                      onToggle={(nextShow) =>
                        setOpenCategory(nextShow ? item.name : "")
                      }
                    >
                      <Dropdown.Toggle
                        id={`${item.name}-dropdown`}
                        size="sm"
                        variant={isActive ? "primary" : "light"}
                        style={{
                          minWidth: "180px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          borderRadius: "999px",
                          padding: "8px 16px",
                          backgroundColor: isActive ? "#1976d2" : "#f5f5f5",
                          color: isActive ? "#ffffff" : "#333333",
                          border: "1px solid rgba(0,0,0,0.08)",
                          boxShadow:
                            isActive || isOpen
                              ? "0 4px 10px rgba(25,118,210,0.35)"
                              : "0 1px 3px rgba(0,0,0,0.06)",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                          }}
                        >
                          <span
                            style={{
                              width: 26,
                              height: 26,
                              borderRadius: "50%",
                              backgroundColor: isActive
                                ? "rgba(255,255,255,0.2)"
                                : "#e3f2fd",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <i
                              className={categoryIcons[item.name]}
                              style={{ fontSize: "14px" }}
                            />
                          </span>
                          <span>{item.name}</span>
                        </span>
                      </Dropdown.Toggle>

                      <Dropdown.Menu
                        style={{
                          minWidth: "220px",
                          borderRadius: "12px",
                          boxShadow: "0 8px 24px rgba(0,0,0,0.16)",
                          fontSize: "13px",
                          padding: "6px 0",
                        }}
                      >
                        {subcards.map((sub) => {
                          const label = `${item.name} ${sub}`;
                          return (
                            <Dropdown.Item
                              key={sub}
                              onClick={() => {
                                setActiveCategory(item);
                                setSelectedSub(sub);

                                // ✅ Board modal title correct varanum
                                setActiveSubject(item.name);
                                setSelectedModule(sub);

                                // ✅ Always open board selection popup
                                setActiveSub(label.toUpperCase());
                                setSelectedSyllabus("");
                                setSelectedClass(null);
                                setShowBoardSelect(true);

                                setExpandedChapterIndex(null);
                                setOpenCategory("");
                              }}
                              className="d-flex align-items-center gap-2"
                            >
                              <i className={subcardIcons[sub]} />
                              <span>{label}</span>
                            </Dropdown.Item>
                          );
                        })}
                      </Dropdown.Menu>
                    </Dropdown>
                  );
                })}
              </Col>

              <Col
                xs={12}
                lg
                className="d-flex justify-content-lg-end justify-content-start mt-2 mt-lg-0"
              >
                {isLoggedIn ? (
                  <Button
                    variant="outline-danger"
                    style={{
                      borderRadius: 999,
                      padding: "6px 28px",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    style={{
                      borderRadius: 999,
                      padding: "6px 28px",
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                    onClick={() => {
                      setLoginContext("home");
                      setShowLogin(true);
                    }}
                  >
                    Login
                  </Button>
                )}
              </Col>
            </Row>
          )}
        </Container>
      </div>

      {/* LOGIN MODAL */}
      <Modal
        show={showLogin}
        onHide={() => setShowLogin(false)}
        centered
        size="md"
      >
        <Modal.Body
          style={{
            padding: "32px 40px 28px",
            background: "#f5f7fb",
            borderRadius: "24px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              boxShadow: "0 18px 40px rgba(15, 23, 42, 0.12)",
              padding: "28px 32px 24px",
            }}
          >
            <h4
              style={{
                textAlign: "center",
                marginBottom: "24px",
                fontWeight: 700,
                color: "#111827",
              }}
            >
              Login
            </h4>

            {/* ✅ Username Binding */}
            <div className="mb-3">
              <label
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                  display: "block",
                }}
              >
                Username<span style={{ color: "#ef4444" }}> *</span>
              </label>

              <input
                type="text"
                className="form-control"
                placeholder="Enter email"
                value={loginData.emailid}
                onChange={(e) =>
                  setLoginData({ ...loginData, emailid: e.target.value })
                }
                style={{
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  padding: "10px 12px",
                  fontSize: 14,
                }}
              />
            </div>

            {/* ✅ Password Binding */}
            <div className="mb-2">
              <label
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#374151",
                  marginBottom: 4,
                  display: "block",
                }}
              >
                Password<span style={{ color: "#ef4444" }}> *</span>
              </label>

              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                style={{
                  borderRadius: 10,
                  border: "1px solid #d1d5db",
                  padding: "10px 12px",
                  fontSize: 14,
                }}
              />
            </div>

            <div
              className="d-flex justify-content-between align-items-center mb-3"
              style={{ fontSize: 13 }}
            >
              <button
                type="button"
                className="btn btn-link p-0"
                style={{ textDecoration: "none", color: "#2563eb" }}
              >
                Forgot Password
              </button>
            </div>

            {/* ✅ Login Button */}
            <div className="d-flex justify-content-end gap-2">
              <Button
                variant="primary"
                style={{
                  borderRadius: 999,
                  padding: "6px 28px",
                  fontWeight: 600,
                  fontSize: 14,
                }}
                onClick={async () => {
                  if (!loginData.emailid || !loginData.password) {
                    toast.error("Please enter username & password");
                    return;
                  }

                  try {
                    const response = await fetch("/api/login", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(loginData),
                    });

                    const data = await response.json();

                    if (response.ok) {
                      toast.success("Login successful!", { autoClose: 1500 });

                      setIsLoggedIn(true);
                      localStorage.setItem("isLoggedIn", "true");
                      localStorage.setItem("user", JSON.stringify(data.user));

                      setShowLogin(false);
                      setLoginData({ emailid: "", password: "" });

                      // ✅ Scenario based navigation
                      if (loginContext === "home") {
                        // ✅ Home login → stay in home
                        setPage("home");
                      } else if (loginContext === "download") {
                        // ✅ Download login → stay in details
                        // DO NOTHING
                      }
                    } else {
                      toast.error(`❌ ${data.error || "Invalid login"}`);
                    }
                  } catch (error) {
                    toast.error("❌ Server error");
                  }
                }}
              >
                Login
              </Button>
            </div>

            {/* ✅ Open Signup Modal */}
            <div
              style={{
                marginTop: 16,
                textAlign: "center",
                fontSize: 13,
                color: "#6b7280",
              }}
            >
              New to STEMGURUKUL?{" "}
              <button
                type="button"
                className="btn btn-link p-0"
                style={{
                  fontSize: "13px",
                  color: "#2563eb",
                  textDecoration: "none",
                }}
                onClick={() => {
                  setShowLogin(false);
                  setShowSignup(true);
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>

      {/* Sign Up Modal */}
      <Modal
        show={showSignup}
        onHide={() => setShowSignup(false)}
        centered
        size="md"
      >
        <Modal.Body
          style={{
            padding: "32px 40px 28px",
            background: "#f5f7fb",
            borderRadius: "24px",
          }}
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "18px",
              boxShadow: "0 18px 40px rgba(15,23,42,0.12)",
              padding: "28px 32px 24px",
            }}
          >
            <h4
              style={{
                textAlign: "center",
                marginBottom: "24px",
                fontWeight: "700",
                color: "#111827",
              }}
            >
              Sign Up
            </h4>

            {/* ✅ FORM */}
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                const payload = {
                  name: signupData.name.trim(),
                  mobileNo: signupData.mobileNo.trim(),
                  emailID: signupData.emailID.trim(),
                  password: signupData.password.trim(),
                };

                // ✅ Proper Validation
                if (
                  !payload.name ||
                  !payload.mobileNo ||
                  !payload.emailID ||
                  !payload.password
                ) {
                  toast.error("❌ All fields required");
                  return;
                }

                if (payload.mobileNo.length !== 10) {
                  toast.error("❌ Mobile number must be 10 digits");
                  return;
                }

                try {
                  const response = await fetch("/api/signup", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });

                  const data = await response.json();

                  if (response.ok) {
                    toast.success(`${data.message}`, { autoClose: 1500 });

                    setShowSignup(false);
                    setSignupData({
                      name: "",
                      mobileNo: "",
                      emailID: "",
                      password: "",
                    });
                  } else {
                    toast.error(`❌ ${data.error}`);
                  }
                } catch (error) {
                  toast.error(`❌ Error: ${error.message}`);
                  console.error("Signup failed:", error);
                }
              }}
            >
              {/* Name */}
              <div className="mb-3">
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "4px",
                    display: "block",
                  }}
                >
                  Name <span style={{ color: "#ef4444" }}>*</span>
                </label>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={signupData.name}
                  onChange={(e) =>
                    setSignupData({ ...signupData, name: e.target.value })
                  }
                  onInput={(e) =>
                    setSignupData({ ...signupData, name: e.target.value })
                  }
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    padding: "10px 12px",
                    fontSize: "14px",
                  }}
                  required
                />
              </div>

              {/* Mobile No */}
              <div className="mb-3">
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "4px",
                    display: "block",
                  }}
                >
                  Mobile No <span style={{ color: "#ef4444" }}>*</span>
                </label>

                <input
                  type="tel"
                  className="form-control"
                  placeholder="Enter mobile number (10 digits)"
                  value={signupData.mobileNo}
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      mobileNo: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                  onInput={(e) =>
                    setSignupData({
                      ...signupData,
                      mobileNo: e.target.value.replace(/\D/g, "").slice(0, 10),
                    })
                  }
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    padding: "10px 12px",
                    fontSize: "14px",
                  }}
                  maxLength={10}
                  required
                />
              </div>

              {/* Email ID */}
              <div className="mb-3">
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "4px",
                    display: "block",
                  }}
                >
                  Email ID <span style={{ color: "#ef4444" }}>*</span>
                </label>

                <input
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={signupData.emailID}
                  onChange={(e) =>
                    setSignupData({ ...signupData, emailID: e.target.value })
                  }
                  onInput={(e) =>
                    setSignupData({ ...signupData, emailID: e.target.value })
                  }
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    padding: "10px 12px",
                    fontSize: "14px",
                  }}
                  required
                />
              </div>

              {/* Password */}
              <div className="mb-3">
                <label
                  style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#374151",
                    marginBottom: "4px",
                    display: "block",
                  }}
                >
                  Password <span style={{ color: "#ef4444" }}>*</span>
                </label>

                <input
                  type="password"
                  className="form-control"
                  placeholder="Create password"
                  value={signupData.password}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  onInput={(e) =>
                    setSignupData({ ...signupData, password: e.target.value })
                  }
                  style={{
                    borderRadius: "10px",
                    border: "1px solid #d1d5db",
                    padding: "10px 12px",
                    fontSize: "14px",
                  }}
                  required
                />
              </div>

              <div className="d-flex justify-content-end">
                <Button
                  type="submit"
                  variant="primary"
                  style={{
                    borderRadius: "999px",
                    padding: "6px 28px",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  Sign Up
                </Button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>

      {/* HOME PAGE */}
      {page === "home" && (
        <Container
          fluid
          className="mt-3"
          style={{
            position: "relative",
            overflow: "visible",
            marginTop: "24px",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "60px",
            }}
          >
            {/* ===== GOOGLE ADSENSE TOP BANNERS ===== */}
            <div
              style={{
                width: "100%",
                maxWidth: "1200px",
                display: "flex",
                flexDirection: "column",
                gap: "18px", // space between ads
                margin: "0 auto",
              }}
            >
              {/* TOP BANNER 1 */}
              <div
                style={{
                  width: "100%",
                  height: "60px",
                  border: "2px dashed #cbd5e1",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                Google AdSense – Top Banner (728x90)
              </div>

              {/* TOP BANNER 2 (IN CONTENT STYLE) */}
              <div
                style={{
                  width: "100%",
                  height: "60px",
                  border: "2px dashed #cbd5e1",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#64748b",
                  fontSize: "14px",
                }}
              >
                Google AdSense – In-Content Ad
              </div>
            </div>

            {/* Blurred hero */}
            <div
              style={{
                width: "100%",
                height: "620px",
                borderRadius: "18px",
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                position: "relative",
              }}
            >
              <img
                src="/Carousel_image.png"
                alt="STEMGURUKUL Carousel"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "blur(6px)",
                  transform: "scale(1.05)",
                }}
              />

              {/* Centered text on hero */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  textAlign: "center",
                  padding: "0 24px",
                }}
              >
                <h2 style={{ fontWeight: 800, letterSpacing: "0.05rem" }}>
                  Welcome to STEMGURUKUL
                </h2>
                <p style={{ maxWidth: 600, fontSize: 18, marginTop: 8 }}>
                  Explore interactive lessons and practice questions in Science,
                  Technology, Engineering and Mathematics designed to strengthen
                  your concepts.
                </p>

                <Button
                  variant="light"
                  style={{
                    marginTop: 16,
                    borderRadius: 999,
                    padding: "8px 28px",
                    fontWeight: 600,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                  onClick={() => {
                    const subcategoryElement = document.getElementById(
                      "subcategory-content",
                    );
                    if (subcategoryElement) {
                      subcategoryElement.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                >
                  <i className="bi bi-arrow-right" style={{ fontSize: 16 }} />
                  Start Learning
                </Button>
              </div>
            </div>

            {/* STEM OPTIONS FOR CLASS */}
            {page === "stemForClass" && (
              <div className="p-4" style={{ marginTop: "24px" }}>
                ...
              </div>
            )}
            <div
              style={{
                width: "100%",
                padding: isMobile ? "20px 0" : "40px 0",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",

                  width: "100%",
                  gap: "12px",
                  justifyContent: "center",
                }}
              >
                {/* ⬅ LEFT ADSENSE */}
                {!isMobile && (
                  <div
                    style={{
                      width: "50px",
                      minHeight: "60%",
                      border: "2px dashed #cbd5e1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#64748b",
                      writingMode: "vertical-rl",
                      fontSize: "12px",
                    }}
                  >
                    AdSense
                  </div>
                )}

                {/* ✅ CENTER UI BOX */}
                <div
                  id="subcategory-content"
                  className="container-fluid p-5"
                  style={{
                    maxWidth: "1250px",
                    width: "100%",
                    background:
                      "linear-gradient(180deg, #f8fdf7 0%, #e8f5e8 100%)",
                    borderRadius: "18px",
                  }}
                >
                  {/* Header */}
                  <div style={{ textAlign: "center", marginBottom: "60px" }}>
                    <div
                      style={{
                        fontSize: 40,
                        fontWeight: 900,
                        background: "linear-gradient(135deg, #00796b, #00a680)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginBottom: 16,
                        animation: "fadeInUp 1s ease",
                      }}
                    >
                      Choose Your Subject
                    </div>
                  </div>

                  {/* SUBJECT CARDS */}
                  <div className="row g-4 justify-content-center">
                    {subjects.map((sub) => (
                      <div key={sub} className="col-lg-3 col-md-6 col-sm-12">
                        {renderSubjectCard(sub)}
                      </div>
                    ))}
                  </div>

                  {/* MODULES PANEL */}
                  {activeSubject && !showBoardSelect && (
                    <div
                      style={{
                        background: subjectStyles[activeSubject].gradient,
                        borderRadius: 24,
                        padding: "40px",
                        marginTop: "40px",
                        animation: "slideDown 0.5s ease",
                      }}
                    >
                      <div
                        style={{ textAlign: "center", marginBottom: "32px" }}
                      >
                        <div
                          style={{
                            fontSize: 32,
                            fontWeight: 800,
                            marginBottom: 8,
                            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                          }}
                        >
                          {activeSubject}
                        </div>

                        <div style={{ fontSize: 18, opacity: 0.9 }}>
                          Select learning module
                        </div>

                        <button
                          onClick={() => setActiveSubject(null)}
                          style={{
                            marginTop: 16,
                            padding: "8px 24px",
                            background: "rgba(255,255,255,0.2)",
                            border: "1px solid rgba(255,255,255,0.3)",
                            borderRadius: 20,
                            color: "black",
                          }}
                        >
                          ← Back to Subjects
                        </button>
                      </div>

                      <div className="row g-3 justify-content-center">
                        {subModules.map((module) => (
                          <div
                            key={module}
                            className="col-md-6 col-lg-4 col-sm-12"
                          >
                            <div
                              className="module-card"
                              style={{
                                background: "rgba(255,255,255,0.95)",
                                borderRadius: 16,
                                padding: "24px",
                                cursor: "pointer",
                                boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                                transition: "all 0.3s ease",
                                color: "#333",
                                border: "1px solid rgba(255,255,255,0.5)",
                              }}
                              onClick={() => handleModuleClick(module)}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                  "translateY(-8px)";
                                e.currentTarget.style.boxShadow =
                                  "0 16px 35px rgba(0,0,0,0.15)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                  "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                  "0 8px 25px rgba(0,0,0,0.1)";
                              }}
                            >
                              <div style={{ fontSize: 48, marginBottom: 12 }}>
                                {module === "Guide"
                                  ? "📚"
                                  : module === "Question Bank"
                                    ? "❓"
                                    : module === "Concept"
                                      ? "💡"
                                      : module === "Practice"
                                        ? "✏️"
                                        : "🧠"}
                              </div>

                              <div
                                style={{
                                  fontWeight: 700,
                                  fontSize: 18,
                                  marginBottom: 6,
                                }}
                              >
                                {module}
                              </div>

                              <div style={{ fontSize: 14, color: "#666" }}>
                                {module === "Guide"
                                  ? "Quick chapter-wise notes with key points, formulas and shortcuts to revise before exams."
                                  : module === "Question Bank"
                                    ? "Topic-wise practice questions with varying difficulty to build speed and accuracy."
                                    : module === "Concept"
                                      ? "Crystal-clear explanations of core ideas with examples to strengthen understanding."
                                      : module === "Practice"
                                        ? "Step-by-step solved examples and worksheets to reinforce concepts through regular practice."
                                        : "Timed quizzes to test your preparation level and identify weak areas instantly."}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Animations */}
                  <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 768px) {
          .subject-card,
          .module-card {
            margin-bottom: 20px !important;
          }
        }
      `}</style>
                </div>

                {/* ➡ RIGHT ADSENSE */}
                {!isMobile && (
                  <div
                    style={{
                      width: "50px",
                      minHeight: "60%",
                      border: "2px dashed #cbd5e1",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#64748b",
                      writingMode: "vertical-rl",
                      fontSize: "12px",
                    }}
                  >
                    AdSense
                  </div>
                )}
              </div>
            </div>

            {/* Benefits carousel */}
            <BenefitsCarousel />

            {/* Footer (unchanged) */}
            <div
              style={{
                width: "100%",
                backgroundColor: "#022c22",
                padding: "48px 0 8px",
                marginTop: 0,
              }}
            >
              <div
                style={{
                  margin: "0 auto",
                  color: "#e5e7eb",
                  fontSize: "14px",
                  textAlign: "left", // keep everything left
                }}
              >
                {/* MAIN FOOTER */}
                <div
                  style={{
                    backgroundColor: "#001b1b",
                    color: "#e5e7eb",
                    padding: "40px 0 16px",
                  }}
                >
                  <div
                    style={{
                      maxWidth: 1100,
                      margin: "0 auto",
                      padding: "0 24px",
                    }}
                  >
                    {/* Top 4 columns */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1fr 1fr 1fr",
                        gap: 32,
                        marginBottom: 32,
                      }}
                    >
                      {/* Logo / about */}
                      <div>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: 22,
                            letterSpacing: "0.08em",
                          }}
                        >
                          STEMGURUKUL
                        </div>
                        <p
                          style={{
                            marginTop: 12,
                            fontSize: 13,
                            lineHeight: 1.7,
                            maxWidth: 280,
                          }}
                        >
                          Smart notes, question banks and quizzes for Class 6–12
                          students across major boards.
                        </p>
                      </div>

                      {/* STEM tracks */}
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            marginBottom: 10,
                            fontSize: 15,
                          }}
                        >
                          STEM Tracks
                        </div>
                        <ul
                          style={{
                            listStyle: "none",
                            padding: 0,
                            margin: 0,
                            lineHeight: 1.8,
                          }}
                        >
                          {[
                            "Science",
                            "Technology",
                            "Engineering",
                            "Mathematics",
                          ].map((item) => (
                            <li key={item} style={{ cursor: "pointer" }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Materials */}
                      <div>
                        <div
                          style={{
                            fontWeight: 700,
                            marginBottom: 10,
                            fontSize: 15,
                          }}
                        >
                          Materials
                        </div>
                        <ul
                          style={{
                            listStyle: "none",
                            padding: 0,
                            margin: 0,
                            lineHeight: 1.8,
                          }}
                        >
                          {[
                            "Guide",
                            "Question Bank",
                            "Concept",
                            "Practice",
                            "Quiz",
                          ].map((item) => (
                            <li key={item} style={{ cursor: "pointer" }}>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Syllabus overview using renderBoardFooter */}
                    <div
                      style={{
                        borderTop: "1px solid rgba(148,163,184,0.4)",
                        paddingTop: 24,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          marginBottom: 12,
                          fontSize: 15,
                        }}
                      >
                        Syllabus Overview
                      </div>
                      {renderBoardFooter("TamilNadu StateBoard")}
                      {renderBoardFooter("NCERT")}
                    </div>

                    {/* Bottom bar */}
                    <div
                      style={{
                        marginTop: 24,
                        borderTop: "1px solid rgba(30,64,75,0.9)",
                        paddingTop: 12,
                        fontSize: 12,
                        display: "flex",
                        justifyContent: "space-between",
                        flexWrap: "wrap",
                        gap: 8,
                      }}
                    >
                      <span>
                        © {new Date().getFullYear()} STEMGURUKUL. All rights
                        reserved.
                      </span>
                      <span>Made for curious mind with lots of ❤️</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      )}

      {/* SYLLABUS PAGE */}
      {page === "syllabus" && (
        <div className="p-4" style={{ marginTop: "24px" }}>
          <button
            className="btn btn-outline-primary mb-3"
            onClick={() => setPage("home")}
          >
            ← Back
          </button>
          <div className="section-title">Select Syllabus - {activeSub}</div>

          <div className="row g-4 mt-4">
            {syllabusOptions.map((opt, index) => (
              <div className="col-md-6" key={opt}>
                <div
                  className="card-box-1"
                  style={{
                    background:
                      index === 0
                        ? "linear-gradient(110deg, #bbdefb, #64b5f6 85%)"
                        : "linear-gradient(110deg, #ffe0b2, #ffb74d 85%)",
                    color: "#000",
                    borderRadius: "16px",
                    fontWeight: "bold",
                    fontSize: "16px",
                    cursor: "pointer",
                    textAlign: "center",
                    padding: "2rem 1rem",
                    border:
                      selectedSyllabus === opt
                        ? "3px solid #1976d2"
                        : "3px solid transparent",
                    transition: "all 0.15s ease-in-out",
                    boxShadow: "0 2px 12px rgba(39, 82, 163, 0.1)",
                  }}
                  onClick={() => {
                    setSelectedSyllabus(opt);
                    setExpandedChapterIndex(null);

                    if (opt === "TamilNadu StateBoard Class 12") {
                      setSelectedClass(null);
                      setPage("class");
                    } else {
                      setSelectedClass(null);
                      setPage("details");
                    }
                  }}
                >
                  {opt}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CLASS PAGE */}
      {page === "class" && (
        <div
          className="p-4"
          style={{
            marginTop: "24px",
            background: "linear-gradient(180deg,#f3f8ff 0%,#ffffff 45%)",
            minHeight: "calc(100vh - 140px)",
          }}
        >
          <button
            className="btn btn-outline-primary mb-3"
            onClick={() => setPage("home")}
          >
            ← Back
          </button>

          <div
            className="section-title"
            style={{
              fontSize: "26px",
              fontWeight: 800,
              letterSpacing: "0.04em",
              color: "#12355B",
            }}
          >
            Select Class – {activeCategory.name} {selectedSub} (
            {selectedSyllabus})
          </div>

          <div className="row g-3 mt-3">
            {classList.map((cls) => {
              const isSelected = selectedClass === cls;
              const isEnabled = cls === 12;

              return (
                <div className="col-6 col-md-3" key={cls}>
                  <div
                    onClick={() => {
                      if (cls !== 12) {
                        setSelectedClass(cls);
                        setPage("details");
                        return;
                      }

                      setSelectedClass(cls);
                      setPage("details");
                    }}
                    style={{
                      borderRadius: 18,
                      padding: "1.4rem 1rem",
                      textAlign: "center",
                      cursor: isEnabled ? "pointer" : "default",
                      background: isEnabled
                        ? isSelected
                          ? "linear-gradient(120deg,#42a5f5,#1e88e5)"
                          : "linear-gradient(120deg,#e3f2fd,#bbdefb)"
                        : "linear-gradient(120deg,#f5f5f5,#e0e0e0)",
                      color: isEnabled ? "#0d1b2a" : "#9e9e9e",
                      boxShadow: isEnabled
                        ? "0 6px 16px rgba(25,118,210,0.25)"
                        : "0 3px 10px rgba(0,0,0,0.06)",
                      border: isSelected
                        ? "2px solid rgba(21,101,192,0.9)"
                        : "1px solid rgba(0,0,0,0.05)",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isEnabled) return;
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isEnabled) return;
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    <div style={{ fontWeight: 800, fontSize: 20 }}>
                      Class {cls}
                    </div>
                    {!isEnabled && (
                      <div
                        style={{
                          fontSize: 12,
                          marginTop: 8,
                          fontStyle: "italic",
                        }}
                      >
                        Content is being prepared
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Board Selection Modal */}
      {showBoardSelect && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            animation: "fadeIn 0.3s ease",
          }}
          onClick={() => setShowBoardSelect(false)}
        >
          <div
            style={{
              background: "white",
              borderRadius: 24,
              padding: "40px",
              maxWidth: 400,
              width: "90%",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              animation: "slideUp 0.4s ease",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: "center", marginBottom: "32px" }}>
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  marginBottom: 8,
                  color: "#111",
                }}
              >
                {activeSubject} - {selectedModule}
              </div>
              <div
                style={{
                  fontSize: 18,
                  color: "#666",
                  marginBottom: 24,
                }}
              >
                Choose your board (TamilNadu StateBoard available)
              </div>
            </div>

            <div className="row g-3">
              {boards.map((board) => (
                <div
                  key={board}
                  className="col-12"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleBoardSelect(board)}
                >
                  <div
                    style={{
                      background:
                        board === "TamilNadu StateBoard"
                          ? "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                          : "#f8f9fa",
                      color:
                        board === "TamilNadu StateBoard" ? "white" : "#333",
                      borderRadius: 16,
                      padding: "20px",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                      transition: "all 0.3s ease",
                      border: "2px solid transparent",
                      ...(board === "TamilNadu StateBoard" && {
                        boxShadow: "0 12px 35px rgba(79, 172, 254, 0.4)",
                      }),
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 18,
                        marginBottom: 4,
                      }}
                    >
                      {board}
                    </div>
                    <div
                      style={{
                        fontSize: 14,
                        opacity: board === "TamilNadu StateBoard" ? 0.9 : 0.6,
                      }}
                    >
                      {board === "TamilNadu StateBoard"
                        ? "✅ Fully Available"
                        : "Coming Soon"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SELECT SCHOOL CLASS (6–12) */}
      {page === "classSelect" && (
        <div className="p-4" style={{ marginTop: "24px" }}>
          <button
            className="btn btn-outline-primary mb-3"
            onClick={() => setPage("home")}
          >
            ← Back
          </button>

          <div
            className="section-title"
            style={{
              fontSize: "26px",
              fontWeight: 800,
              letterSpacing: "0.04em",
              color: "#12355B",
            }}
          >
            Select Your Class
          </div>

          <div className="row g-3 mt-3">
            {classList.map((cls) => (
              <div className="col-6 col-md-3" key={cls}>
                <div
                  onClick={() => {
                    setSelectedSchoolClass(cls);
                    setPage("stemForClass");
                  }}
                  style={{
                    borderRadius: 18,
                    padding: "1.4rem 1rem",
                    textAlign: "center",
                    cursor: "pointer",
                    background: "linear-gradient(120deg,#e3f2fd,#bbdefb)",
                    color: "#0d1b2a",
                    boxShadow: "0 6px 16px rgba(25,118,210,0.25)",
                    border: "1px solid rgba(0,0,0,0.05)",
                    transition: "transform 0.15s ease, box-shadow 0.15s ease",
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: 20 }}>
                    Class {cls}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* MOBILE MATHEMATICS MODULE PAGE */}
      {page === "mathModules" && (
        <div
          className="p-4"
          style={{
            marginTop: "24px",
            background: "linear-gradient(180deg,#f3f8ff 0%,#ffffff 45%)",
            minHeight: "calc(100vh - 140px)",
          }}
        >
          <button
            className="btn btn-outline-primary mb-4"
            onClick={() => setPage("home")}
            style={{ borderRadius: 12 }}
          >
            ← Back
          </button>

          <h3
            style={{
              fontWeight: 900,
              marginBottom: 28,
              letterSpacing: "0.04em",
              color: "#0f172a",
            }}
          >
            Mathematics – Select Module
          </h3>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            {subModules.map((module, index) => {
              const gradients = [
                "linear-gradient(135deg,#42a5f5,#90caf9)",
                "linear-gradient(135deg,#ab47bc,#ce93d8)",
                "linear-gradient(135deg,#66bb6a,#a5d6a7)",
                "linear-gradient(135deg,#ffa726,#ffcc80)",
                "linear-gradient(135deg,#ef5350,#f48fb1)",
              ];

              const icons = ["📚", "❓", "💡", "✏️", "🧠"];

              return (
                <div
                  key={module}
                  onClick={() => {
                    if (module === "Guide") {
                      setActiveCategory({ name: "Mathematics" });
                      setSelectedSub("Guide");
                      setActiveSubject("Mathematics");
                      setSelectedModule("Guide");

                      setSelectedSyllabus("TamilNadu StateBoard Class 12");
                      setPage("class");
                    } else {
                      setComingSoonSubject(`Mathematics - ${module}`);
                      setShowComingSoon(true);
                    }
                  }}
                  style={{
                    background: gradients[index],
                    borderRadius: 20,
                    padding: "20px 18px",
                    color: "#000",
                    fontWeight: 800,
                    fontSize: 18,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 14px 30px rgba(0,0,0,0.18)",
                    cursor: "pointer",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onTouchStart={(e) =>
                    (e.currentTarget.style.transform = "scale(0.97)")
                  }
                  onTouchEnd={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 14 }}
                  >
                    <span style={{ fontSize: 30 }}>{icons[index]}</span>
                    <span>{module}</span>
                  </div>

                  <span style={{ fontSize: 22 }}>→</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* DETAILS PAGE */}
      {page === "details" && (
        <div className="p-4" style={{ marginTop: "24px" }}>
          <button
            className="btn btn-outline-primary mb-3"
            onClick={() => {
              if (
                activeCategory.name === "Mathematics" &&
                selectedSub === "Guide" &&
                selectedSyllabus
              ) {
                if (selectedClass) {
                  setPage("class");
                } else {
                  setPage("syllabus");
                }
              } else {
                setPage("class");
              }
            }}
          >
            ← Back
          </button>

          <div className="section-title">
            Chapters - {activeSub}
            {selectedClass && (
              <span
                style={{
                  fontSize: "14px",
                  marginLeft: 12,
                  color: "#333",
                  background: "#fff3e0",
                  padding: "4px 12px",
                  borderRadius: "20px",
                }}
              >
                Class {selectedClass}
              </span>
            )}
            {selectedSyllabus && (
              <span
                style={{
                  fontSize: "14px",
                  marginLeft: 12,
                  color: "#666",
                  background: "#e3f2fd",
                  padding: "4px 12px",
                  borderRadius: "20px",
                }}
              >
                {selectedSyllabus}
              </span>
            )}
          </div>

          {isValidContentFlow && !contentLoading ? (
            getChaptersData(chaptersFallback).map((chapter, idx) => {
              const isExpanded = expandedChapterIndex === idx;
              const exerciseList = isValidContentFlow
                ? Object.keys(chapter.exercises || {})
                : [];

              return (
                <div
                  key={idx}
                  className="accordion-item chapter-card mb-4"
                  style={{
                    background:
                      idx % 2 === 0
                        ? "linear-gradient(110deg, #e3f2fd, #bbdefb 85%)"
                        : "linear-gradient(110deg, #fffde7, #ffe082 85%)",
                    borderRadius: "20px",
                    boxShadow: "0 8px 32px rgba(39, 82, 163, 0.2)",
                    overflow: "hidden",
                    marginBottom: "24px",
                    border: "none",
                  }}
                >
                  {/* Header */}
                  <h2
                    className="accordion-header"
                    id={`heading${idx}`}
                    style={{
                      margin: 0,
                      background:
                        idx % 2 === 0
                          ? "linear-gradient(90deg, #1565c0 70%, #64b5f6 100%)"
                          : "linear-gradient(90deg, #ffb300 70%, #ffe082 100%)",
                      color: "white",
                      borderRadius: "12px",
                      fontWeight: "bold",
                      cursor: "pointer",
                      padding: "1rem 1.25rem",
                      userSelect: "none",
                      fontSize: "16px",
                    }}
                    onClick={() => toggleChapter(idx)}
                  >
                    <i className="bi bi-journal-code fs-4 me-2"></i>
                    {isValidContentFlow ? chapter.chaptername : chapter.title}
                    <span className="badge bg-light text-dark ms-3 px-2 py-1 shadow-sm"></span>
                  </h2>

                  {/* PDF Content */}
                  {isExpanded && openChapterPdf && (
                    <div
                      className="accordion-collapse collapse show"
                      style={{
                        padding: "0",
                        maxHeight: "95vh",
                        overflowY: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "#90caf9 #f8f9fa",
                      }}
                    >
                      {/* Sticky Navigation */}
                      {numPages && (
                        <div
                          style={{
                            position: "sticky",
                            top: 0,
                            zIndex: 20,
                            background:
                              "linear-gradient(135deg, #42a5f5, #1976d2)",
                            color: "white",
                            padding: "12px 20px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              flexWrap: "wrap",
                              gap: "8px",
                            }}
                          >
                            <div
                              style={{ fontWeight: "bold", fontSize: "16px" }}
                            >
                              📖 {chapter.chaptername}
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "12px",
                              }}
                            >
                              <button
                                className="pdf-nav-btn"
                                onClick={() =>
                                  setCurrentPage((p) => Math.max(p - 1, 1))
                                }
                                disabled={currentPage <= 1}
                              >
                                ← Prev
                              </button>

                              <span className="pdf-page-indicator">
                                Page {currentPage} / {numPages}
                              </span>

                              <button
                                className="pdf-nav-btn"
                                onClick={() =>
                                  setCurrentPage((p) =>
                                    Math.min(p + 1, numPages),
                                  )
                                }
                                disabled={currentPage >= numPages}
                              >
                                Next →
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Controls */}
                      <div
                        style={{
                          padding: "16px 20px",
                          background: "#f8f9fa",
                          borderBottom: "1px solid #e0e6ed",
                          display: "flex",
                          gap: "12px",
                          flexWrap: "wrap",
                        }}
                      >
                        <a
                          href={openChapterPdf}
                          download
                          className="btn btn-success btn-sm me-2"
                          target="_blank"
                          onClick={(e) => {
                            // **CLASS 12 DOWNLOAD ONLY PROTECTION**
                            if (selectedClass === 12 && !isLoggedIn) {
                              e.preventDefault();
                              e.stopPropagation();
                              toast.warning("PDF Download - Login Required!");
                              setLoginContext("download"); // ✅ IMPORTANT
                              setShowLogin(true);

                              return false;
                            }
                          }}
                        >
                          📥{" "}
                          {selectedClass === 12 && !isLoggedIn
                            ? "Download"
                            : "Download"}
                        </a>

                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => {
                            setOpenChapterPdf(null);
                            setExpandedChapterIndex(null);
                            setNumPages(null);
                            setCurrentPage(1);
                          }}
                        >
                          ❌ Close PDF
                        </button>
                      </div>

                      {/* FULL PAGE PDF */}
                      {/* FULL PAGE PDF */}
                      <div
                        style={{
                          padding: "24px",
                          minHeight: "600px",
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          background:
                            "linear-gradient(180deg, #fafbfc 0%, #f0f4f8 100%)",
                          position: "relative", // ✅ REQUIRED for arrows
                        }}
                      >
                        {/* 🔵 LEFT ARROW */}
                        <div
                          className={`pdf-side-nav left ${
                            currentPage <= 1 ? "disabled" : ""
                          }`}
                          onClick={() => {
                            if (currentPage > 1) {
                              setCurrentPage((p) => p - 1);
                            }
                          }}
                        >
                          <i className="bi bi-chevron-left"></i>
                        </div>

                        {/* 🔵 RIGHT ARROW */}
                        <div
                          className={`pdf-side-nav right ${
                            currentPage >= numPages ? "disabled" : ""
                          }`}
                          onClick={() => {
                            if (currentPage < numPages) {
                              setCurrentPage((p) => p + 1);
                            }
                          }}
                        >
                          <i className="bi bi-chevron-right"></i>
                        </div>

                        {/* PDF DOCUMENT */}
                        {openChapterPdf ? (
                          <Document
                            file={openChapterPdf}
                            onLoadSuccess={(pdf) => {
                              setNumPages(pdf.numPages);
                              setCurrentPage(1);
                            }}
                            onLoadError={(error) => {
                              console.error("PDF Error:", error);
                              toast.error("PDF load failed");
                            }}
                            loading={
                              <div
                                style={{
                                  height: "500px",
                                  display: "flex",
                                  flexDirection: "column",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: "20px",
                                  fontSize: "18px",
                                  color: "#666",
                                }}
                              >
                                <i className="bi bi-file-earmark-pdf fs-1 text-primary mb-3"></i>
                                <div>Loading PDF...</div>
                                <div style={{ fontSize: "14px", opacity: 0.7 }}>
                                  Large file, please wait
                                </div>
                              </div>
                            }
                          >
                            <Page
                              pageNumber={currentPage}
                              width={Math.min(
                                900,
                                (window.innerWidth || 1200) * 0.92,
                              )}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                            />
                          </Document>
                        ) : (
                          <div
                            style={{
                              padding: "80px 40px",
                              textAlign: "center",
                              color: "#999",
                              fontSize: "16px",
                            }}
                          >
                            <i className="bi bi-file-earmark-pdf fs-1 mb-3 text-muted"></i>
                            <div>Click chapter title to load PDF</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            // Loading state
            <div style={{ padding: "60px", textAlign: "center" }}>
              <div
                style={{
                  fontSize: "18px",
                  color: "#666",
                  marginBottom: "20px",
                }}
              >
                Comming Soon....
              </div>
            </div>
          )}
        </div>
      )}
      <Modal
        show={showSubscribePopup}
        onHide={() => setShowSubscribePopup(false)}
        backdrop="static"
        keyboard={false}
        centered
        dialogClassName="subscribe-modal"
      >
        <div
          style={{
            borderRadius: "22px",
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.25)",
            boxShadow: "0 25px 70px rgba(0,0,0,0.35)",
          }}
        >
          {/* ✅ TOP GRADIENT HEADER */}
          <div
            style={{
              background: "linear-gradient(135deg,#00c6ff,#0072ff)",
              padding: "20px 22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              color: "#fff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.18)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 20,
                }}
              >
                📩
              </div>
              <div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>
                  Subscribe Now
                </div>
                <div style={{ fontSize: 12, opacity: 0.9 }}>
                  Get updates & new materials
                </div>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={() => setShowSubscribePopup(false)}
              style={{
                border: "none",
                background: "rgba(255,255,255,0.2)",
                color: "white",
                width: 36,
                height: 36,
                borderRadius: 12,
                fontSize: 18,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* ✅ BODY */}
          <div
            style={{
              padding: "22px",
              background: "rgba(255,255,255,0.9)",
              backdropFilter: "blur(14px)",
            }}
          >
            <div style={{ marginBottom: 14, color: "#374151", fontSize: 14 }}>
              Enter your EmailID to receive:
            </div>

            {/* small benefits */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginBottom: 16,
              }}
            >
              {["New PDFs", "Updates", "Free resources"].map((t) => (
                <span
                  key={t}
                  style={{
                    fontSize: 12,
                    padding: "6px 10px",
                    borderRadius: 999,
                    background: "linear-gradient(135deg,#eff6ff,#dbeafe)",
                    border: "1px solid rgba(59,130,246,0.25)",
                    color: "#1e3a8a",
                    fontWeight: 600,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>

            {/* ✅ EMAIL INPUT */}
            <div style={{ position: "relative" }}>
              <i
                className="bi bi-envelope-fill"
                style={{
                  position: "absolute",
                  left: 14,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#2563eb",
                  fontSize: 16,
                }}
              />
              <input
                type="email"
                className="form-control"
                placeholder="Enter your EmailID"
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                style={{
                  borderRadius: 14,
                  border: "1px solid rgba(0,0,0,0.12)",
                  padding: "12px 12px 12px 42px",
                  fontSize: 14,
                  background: "#f8fafc",
                  boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
                }}
              />
            </div>
            {/* ✅ Subscribe Choice */}
            <div style={{ marginTop: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                Do you want to Subscribe?
              </div>

              <div style={{ display: "flex", gap: 18, marginTop: 10 }}>
                <label
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <input
                    type="radio"
                    name="subscribeChoice"
                    checked={subscribeChoice === true}
                    onChange={() => setSubscribeChoice(true)}
                  />
                  <span style={{ fontWeight: 600 }}>Yes</span>
                </label>

                <label
                  style={{ display: "flex", alignItems: "center", gap: 8 }}
                >
                  <input
                    type="radio"
                    name="subscribeChoice"
                    checked={subscribeChoice === false}
                    onChange={() => setSubscribeChoice(false)}
                  />
                  <span style={{ fontWeight: 600 }}>No</span>
                </label>
              </div>
            </div>
            <button
              onClick={async () => {
                if (!subscribeEmail.trim()) {
                  toast.error("Please enter EmailID");
                  return;
                }

                try {
                  const response = await fetch("/api/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      emailid: subscribeEmail,
                      subscribers: subscribeChoice, // ✅ true/false
                    }),
                  });

                  const data = await response.json();

                  if (response.ok) {
                    toast.success("Saved successfully!");
                    setShowSubscribePopup(false);
                    setSubscribeEmail("");
                  } else {
                    toast.error(`❌ ${data.error || "Save failed"}`);
                  }
                } catch (err) {
                  toast.error("❌ Server error");
                }
              }}
              style={{
                flex: 1,
                borderRadius: 14,
                padding: "11px 14px",
                border: "none",
                background: "linear-gradient(135deg,#2563eb,#0ea5e9)",
                color: "white",
                fontWeight: 800,
                cursor: "pointer",
                boxShadow: "0 15px 30px rgba(37,99,235,0.35)",
              }}
            >
              {subscribeChoice === true ? "Subscribe" : "Save"}
            </button>
          </div>
        </div>
      </Modal>
      {/* COMING SOON POPUP */}
      <Modal
        show={showComingSoon}
        onHide={() => setShowComingSoon(false)}
        centered
        size="md"
      >
        <Modal.Body
          style={{
            padding: "40px",
            textAlign: "center",
            borderRadius: "20px",
            background: "linear-gradient(135deg,#f0f9ff,#e0f2fe)",
          }}
        >
          <div style={{ fontSize: "60px", marginBottom: "16px" }}>🚧</div>

          <h3
            style={{ fontWeight: 800, marginBottom: "12px", color: "#0f172a" }}
          >
            {comingSoonSubject}
          </h3>

          <p
            style={{ fontSize: "16px", color: "#334155", marginBottom: "24px" }}
          >
            This subject content is coming soon. We are working hard to bring it
            to you!
          </p>

          <Button
            variant="primary"
            style={{
              borderRadius: "999px",
              padding: "8px 32px",
              fontWeight: 700,
            }}
            onClick={() => setShowComingSoon(false)}
          >
            OK
          </Button>
        </Modal.Body>
      </Modal>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default Stem;
