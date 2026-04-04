"use client";

import { Component, ReactNode, ErrorInfo } from "react";

interface Props {
  children: ReactNode;
  label?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class PanelErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `[PanelError:${this.props.label || "unknown"}]`,
      error,
      info.componentStack
    );
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="card" style={{ padding: "24px", textAlign: "center" }}>
        <div
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "var(--red)",
            marginBottom: "4px",
          }}
        >
          {this.props.label
            ? `Error loading ${this.props.label}`
            : "Error loading this section"}
        </div>
        <div
          style={{
            fontSize: "11px",
            color: "var(--text-dim)",
            marginBottom: "12px",
          }}
        >
          Other sections are unaffected.
        </div>
        <button
          onClick={this.handleRetry}
          style={{
            fontSize: "10px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            padding: "4px 12px",
            borderRadius: "6px",
            background: "rgba(240, 68, 56, 0.1)",
            color: "var(--red)",
            border: "1px solid rgba(240, 68, 56, 0.2)",
            cursor: "pointer",
          }}
        >
          Retry
        </button>
      </div>
    );
  }
}
