import React, { useState } from "react";

const SubcategoryContent = () => {
  const subjects = ["Science", "Technology", "Engineering", "Mathematics"];
  const [hoveredClass, setHoveredClass] = useState(null);
  const [activeSubject, setActiveSubject] = useState(null);
  const [showBoardSelect, setShowBoardSelect] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  // Subject-specific gradients & icons
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
      onClick={() => setActiveSubject(activeSubject === sub ? null : sub)}
      onMouseEnter={(e) => {
        setHoveredClass(sub);
        e.currentTarget.style.transform = "scale(1.05)";
        e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        setHoveredClass(null);
        e.currentTarget.style.transform = hoveredClass
          ? "scale(0.95)"
          : "scale(1)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.15)";
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
        }}
      >
        {sub}
      </div>
      <div style={{ fontSize: 16, opacity: 0.95, lineHeight: 1.4 }}>
        Complete curriculum for all classes 6-12
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          fontSize: 28,
          opacity: 0.8,
        }}
      >
        →
      </div>
    </div>
  );

  const handleModuleClick = (module) => {
    setSelectedModule(module);
    setShowBoardSelect(true); // Show board selection
  };

  const handleBoardSelect = (board) => {
    console.log(`${activeSubject} - ${selectedModule} - ${board} selected`);
    // Navigate logic here
    setShowBoardSelect(false);
    setActiveSubject(null);
    // Add your navigation: setPage("classSelect"), etc.
  };

  return (
    <div
      id="subcategory-content"
      className="container-fluid p-5"
      style={{
        marginTop: "120px",
        background: "linear-gradient(180deg, #f8fdf7 0%, #e8f5e8 100%)",
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
        <div
          style={{
            fontSize: 20,
            color: "#555",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          Explore comprehensive curriculum across Science, Technology,
          Engineering & Mathematics for Classes 6-12
        </div>
      </div>

      <div className="row g-4 justify-content-center">
        {subjects.map((sub) => (
          <div key={sub} className="col-lg-3 col-md-6 col-sm-12">
            {renderSubjectCard(sub)}
          </div>
        ))}
      </div>

      {/* Modules Panel */}
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
          <div style={{ textAlign: "center", marginBottom: "32px" }}>
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
                color: "white",
              }}
            >
              ← Back to Subjects
            </button>
          </div>

          <div className="row g-3 justify-content-center">
            {subModules.map((module) => (
              <div key={module} className="col-md-6 col-lg-4 col-sm-12">
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
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 16px 35px rgba(0,0,0,0.15)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
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
                    style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}
                  >
                    {module}
                  </div>
                  <div style={{ fontSize: 14, color: "#666" }}>
                    Interactive learning materials
                  </div>
                </div>
              </div>
            ))}
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
              <div style={{ fontSize: 18, color: "#666", marginBottom: 24 }}>
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
                      style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}
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

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @media (max-width: 768px) {
          .subject-card,
          .module-card {
            margin-bottom: 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SubcategoryContent;
