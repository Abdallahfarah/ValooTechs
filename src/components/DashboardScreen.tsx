
export default function DashboardScreen() {
  return (
    <div className="w-[1024px] h-[670px] bg-[#0E0F19] text-white p-6 font-sans flex flex-col justify-between select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
            <img
              src="/logo_icon_transparent.png"
              alt="VALO"
              className="w-5.5 h-5.5 object-contain"
            />
          </div>
          <span className="font-semibold text-lg tracking-wider text-[#F7F9FC]">VALO-RES</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-8 px-4 rounded-full bg-white/5 border border-white/10 flex items-center text-xs text-white/60">
            Search dashboard...
          </div>
          <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-semibold text-sm">
            JD
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-5 my-auto">
        {/* Left Side: Headline & Quick Actions */}
        <div className="col-span-5 flex flex-col justify-center pr-4">
          <h2 className="text-3xl font-bold leading-tight mb-3">
            Restaurant <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-light to-white">
              Management
            </span> <br />
            Simplified
          </h2>
          <p className="text-white/60 text-sm mb-6 max-w-xs">
            All-in-one POS and management system tailored for modern enterprise restaurants.
          </p>
          <button className="self-start px-5 py-2.5 bg-gradient-to-r from-primary to-primary-light border border-white/10 text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
            <span>View Case Study</span>
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Right Side: Dashboard Stats and Charts */}
        <div className="col-span-7 space-y-4">
          {/* Quick Metrics */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Total Revenue', value: '$24,840', change: '+12%' },
              { label: 'Orders', value: '128', change: '+8%' },
              { label: 'Customers', value: '96', change: '+15%' },
              { label: 'Active Tables', value: '24', change: '85%' },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[10px] uppercase tracking-wider text-white/40">{stat.label}</span>
                <span className="text-lg font-bold my-1 text-white">{stat.value}</span>
                <span className="text-[9px] text-[#68C247]">{stat.change}</span>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Revenue Area Chart */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between h-[260px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-white/80">Revenue Overview</span>
                <span className="text-[10px] text-white/40">Weekly</span>
              </div>
              <div className="relative flex-1 flex items-end">
                <svg className="w-full h-full" viewBox="0 0 200 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2D2D73" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#2D2D73" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Area */}
                  <path
                    d="M0 120 C 30 90, 60 100, 90 60 C 120 20, 150 40, 200 10 L 200 120 Z"
                    fill="url(#chartGrad)"
                  />
                  {/* Line */}
                  <path
                    d="M0 120 C 30 90, 60 100, 90 60 C 120 20, 150 40, 200 10"
                    fill="none"
                    stroke="#68C247"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  {/* Dot */}
                  <circle cx="90" cy="60" r="4" fill="#68C247" />
                  <circle cx="200" cy="10" r="4" fill="#68C247" />
                </svg>
              </div>
              <div className="flex justify-between text-[9px] text-white/40 mt-2">
                <span>Mon</span>
                <span>Wed</span>
                <span>Fri</span>
                <span>Sun</span>
              </div>
            </div>

            {/* Doughnut Chart */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col justify-between h-[260px]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-white/80">Top Categories</span>
                <span className="text-[10px] text-white/40">Sales</span>
              </div>
              <div className="flex-1 flex items-center justify-center relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  {/* Outer circle track */}
                  <circle cx="64" cy="64" r="45" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="16" />
                  {/* Segment 1: Secondary color (Green) */}
                  <circle
                    cx="64"
                    cy="64"
                    r="45"
                    fill="transparent"
                    stroke="#68C247"
                    strokeWidth="16"
                    strokeDasharray="282.7"
                    strokeDashoffset="70.6" /* 75% */
                    strokeLinecap="round"
                  />
                  {/* Segment 2: Primary color (Blue/Purple) */}
                  <circle
                    cx="64"
                    cy="64"
                    r="45"
                    fill="transparent"
                    stroke="#2D2D73"
                    strokeWidth="16"
                    strokeDasharray="282.7"
                    strokeDashoffset="212" /* 25% */
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-lg font-bold">78%</span>
                  <span className="text-[9px] text-white/40">Dine-in</span>
                </div>
              </div>
              <div className="flex justify-around text-[10px] text-white/60">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#68C247]"></span>
                  <span>Food</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2D2D73]"></span>
                  <span>Drinks</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[11px] text-white/40 border-t border-white/5 pt-4">
        <span>© 2026 VALO Systems</span>
        <div className="flex gap-4">
          <span>POS Status: Online</span>
          <span>System Version: 4.8.2-enterprise</span>
        </div>
      </div>
    </div>
  );
}
