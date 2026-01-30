import React from "react";
import { Carousel } from "react-bootstrap";

function BenefitsCarousel() {
  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#00796b",
        padding: "70px 0",
        marginTop: "10px",
      }}
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          textAlign: "center",
          color: "#ffffff",
        }}
      >
        <h2 style={{ fontWeight: 800, marginBottom: 8 }}>
          Why Students Love It
        </h2>
        <p style={{ fontSize: 16, opacity: 0.9 }}>
          Key benefits you get by learning with STEMGURUKUL.
        </p>

        <Carousel
          indicators={true}
          controls={true}
          interval={6000}
          pause="hover"
          nextLabel=""
          prevLabel=""
          nextIcon={
            <span
              className="bi bi-chevron-right"
              style={{
                width: 52,
                height: 52,
                borderRadius: "999px",
                backgroundColor: "#e0f5f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#04756c",
                fontSize: 24,
                boxShadow: "0 6px 14px rgba(15,118,110,0.5)",
              }}
            />
          }
          prevIcon={
            <span
              className="bi bi-chevron-left"
              style={{
                width: 52,
                height: 52,
                borderRadius: "999px",
                backgroundColor: "#e0f5f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#04756c",
                fontSize: 24,
                boxShadow: "0 6px 14px rgba(15,118,110,0.5)",
              }}
            />
          }
          style={{ marginTop: 40 }}
        >
          {/* Slide 1 */}
          <Carousel.Item>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 36,
                padding: "56px 110px",
                maxWidth: 1000,
                margin: "0 auto",
                color: "#111827",
                boxShadow: "0 26px 70px rgba(0,0,0,0.35)",
                border: "1px solid rgba(148,163,184,0.35)",
              }}
            >
              <h4 style={{ fontWeight: 700, marginBottom: 14, fontSize: 24 }}>
                Strong Concept Clarity
              </h4>
              <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 10 }}>
                Get crystal‑clear explanations with chapter‑wise notes, solved
                examples and visual aids so that every concept feels intuitive,
                not confusing.
              </p>
              <p style={{ fontSize: 15, color: "#374151" }}>
                This helps students build a rock‑solid foundation and reduces
                last‑minute exam stress.
              </p>
            </div>
          </Carousel.Item>

          {/* Slide 2 */}
          <Carousel.Item>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 36,
                padding: "56px 110px",
                maxWidth: 1000,
                margin: "0 auto",
                color: "#111827",
                boxShadow: "0 26px 70px rgba(0,0,0,0.35)",
                border: "1px solid rgba(148,163,184,0.35)",
              }}
            >
              <h4 style={{ fontWeight: 700, marginBottom: 14, fontSize: 24 }}>
                Exam‑Focused Practice
              </h4>
              <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 10 }}>
                Topic‑wise question banks, timed quizzes and mixed‑level
                practice sets mirror real exam patterns and difficulty.
              </p>
              <p style={{ fontSize: 15, color: "#374151" }}>
                Students quickly identify weak areas and steadily improve speed
                and accuracy with every session.
              </p>
            </div>
          </Carousel.Item>

          {/* Slide 3 */}
          <Carousel.Item>
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: 36,
                padding: "56px 110px",
                maxWidth: 1000,
                color: "#111827",
                boxShadow: "0 26px 70px rgba(0,0,0,0.35)",
                border: "1px solid rgba(148,163,184,0.35)",
              }}
            >
              <h4 style={{ fontWeight: 700, marginBottom: 14, fontSize: 24 }}>
                Guided Learning Journey
              </h4>
              <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 10 }}>
                A clear track from concepts to practice to quizzes ensures
                students always know what to study next.
              </p>
              <p style={{ fontSize: 15, color: "#374151" }}>
                This structured path saves time, keeps motivation high and makes
                self‑study much more effective.
              </p>
            </div>
          </Carousel.Item>
        </Carousel>
      </div>
    </div>
  );
}

export default BenefitsCarousel;
