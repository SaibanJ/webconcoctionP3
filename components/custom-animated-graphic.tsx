"use client"

export function CustomAnimatedGraphic() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <style jsx>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes rotate-reverse {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }
        @keyframes flow {
          to {
            stroke-dashoffset: -1000;
          }
        }
        @keyframes pulse {
          0%,
          100% {
            r: 4;
            opacity: 1;
          }
          50% {
            r: 6;
            opacity: 0.7;
          }
        }
        .orbit {
          animation: rotate 20s linear infinite;
          transform-origin: center;
        }
        .orbit-reverse {
          animation: rotate-reverse 30s linear infinite;
          transform-origin: center;
        }
        .data-flow {
          stroke-dasharray: 10 15;
          stroke-dashoffset: 0;
          animation: flow 8s linear infinite;
        }
        .node {
          animation: pulse 2.5s ease-in-out infinite;
        }
      `}</style>
      <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="core-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f3e8ff" />
            <stop offset="100%" stopColor="#a855f7" />
          </radialGradient>
        </defs>

        {/* Orbits and Data Flows */}
        <g className="orbit">
          <circle cx="100" cy="100" r="80" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.3" />
          <path d="M100,20 A80,80 0 0,1 100,180" stroke="#c084fc" strokeWidth="1" className="data-flow" />
        </g>
        <g className="orbit-reverse">
          <circle cx="100" cy="100" r="55" stroke="#a855f7" strokeWidth="0.5" strokeOpacity="0.3" />
          <path
            d="M155,100 A55,55 0 1,0 45,100"
            stroke="#c084fc"
            strokeWidth="1"
            className="data-flow"
            style={{ animationDuration: "12s" }}
          />
        </g>

        {/* Central Core */}
        <circle cx="100" cy="100" r="15" fill="url(#core-grad)" filter="url(#glow)" />

        {/* Nodes */}
        <g>
          <circle cx="100" cy="20" r="4" fill="#e9d5ff" className="node" style={{ animationDelay: "0s" }} />
          <circle cx="180" cy="100" r="4" fill="#e9d5ff" className="node" style={{ animationDelay: "0.5s" }} />
          <circle cx="100" cy="180" r="4" fill="#e9d5ff" className="node" style={{ animationDelay: "1s" }} />
          <circle cx="20" cy="100" r="4" fill="#e9d5ff" className="node" style={{ animationDelay: "1.5s" }} />

          <circle cx="138.9" cy="61.1" r="3" fill="#d8b4fe" className="node" style={{ animationDelay: "0.25s" }} />
          <circle cx="138.9" cy="138.9" r="3" fill="#d8b4fe" className="node" style={{ animationDelay: "0.75s" }} />
          <circle cx="61.1" cy="138.9" r="3" fill="#d8b4fe" className="node" style={{ animationDelay: "1.25s" }} />
          <circle cx="61.1" cy="61.1" r="3" fill="#d8b4fe" className="node" style={{ animationDelay: "1.75s" }} />
        </g>
      </svg>
    </div>
  )
}
