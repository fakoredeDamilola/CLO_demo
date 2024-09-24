import React, { useEffect } from "react";

const MetalWeightCalculator = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://en.metcalc.info/js/calculator-v1.js";
    script.async = true;
    script.charset = "utf-8";

    // Append the script to the body
    document.body.appendChild(script);

    // Clean up the script when the component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <div
        className="metcalc-block"
        style={{
          width: "90%",
          margin: "0 auto",
          border: "1px solid black",
          background: "transparent",
          minHeight: "433px",
        }}
        data-calculator='{"product":"pipe","select":0,"zone": "en", "height": "433px", "layout": "horizontal"}'
      >
        <div style={{ padding: "5px", textAlign: "right", fontSize: "12px" }}>
          <a
            href="https://en.metcalc.info/calc-rolled/"
            style={{ color: "#444", textDecoration: "underline" }}
            target="_blank"
            rel="noopener noreferrer"
          >
            Metal Weight Calculator
          </a>{" "}
          © metcalc.ru
        </div>
      </div>
    </div>
  );
};

export default MetalWeightCalculator;
