import React, { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // [Tab x 1] Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // [Tab x 1] You can log the error to an analytics service here
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        // [Tab x 2] Neon Error Fallback Card Layout Container
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 text-zinc-100">
          <div className="max-w-md w-full bg-[#121214] border border-red-500/20 p-6 rounded-xl shadow-lg shadow-red-500/5 text-center">
            <div className="text-3xl mb-3">⚠️</div>
            <h2 className="text-lg font-bold text-zinc-200">
              System Interface Halted
            </h2>
            <p className="text-sm text-zinc-500 mt-2 mb-4">
              A critical UI rendering anomaly was intercepted inside the
              processing context loop.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              Reload Interface
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
