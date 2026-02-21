import React from "react";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error("Dashboard render error:", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: "100vh",
                    background: "#0b0f1a",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    padding: "2rem",
                    fontFamily: "sans-serif"
                }}>
                    <h2 style={{ color: "#f87171", fontSize: "1.5rem", marginBottom: "1rem" }}>
                        ⚠️ Dashboard Error
                    </h2>
                    <pre style={{
                        background: "#111827",
                        padding: "1rem",
                        borderRadius: "0.5rem",
                        maxWidth: "600px",
                        overflowX: "auto",
                        fontSize: "0.85rem",
                        color: "#fca5a5"
                    }}>
                        {this.state.error?.message}
                    </pre>
                    <p style={{ marginTop: "1rem", color: "#9ca3af" }}>
                        Check the browser console (F12) for full details.
                    </p>
                </div>
            );
        }
        return this.props.children;
    }
}
