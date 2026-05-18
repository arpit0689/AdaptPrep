import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const colors = ['#748b5d', '#a9bd89', '#e8dcc6', '#c8bedb', '#9a8f7f'];

export function StudyTrendChart({ data = [] }) {
  return (
    <div className="surface rounded-2xl p-5">
      <h3 className="mb-4 font-black">Study Hour Trends</h3>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
          <XAxis dataKey="date" tick={{ fill: 'var(--muted)', fontSize: 12 }} />
          <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} />
          <Tooltip />
          <Area type="monotone" dataKey="hours" stroke="#748b5d" fill="#a9bd89" fillOpacity={0.45} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SubjectDistributionChart({ data = [] }) {
  return (
    <div className="surface rounded-2xl p-5">
      <h3 className="mb-4 font-black">Subject Distribution</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} dataKey="minutes" nameKey="subject" outerRadius={92}>
            {data.map((_, index) => <Cell key={index} fill={colors[index % colors.length]} />)}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CompletionChart({ data = [] }) {
  return (
    <div className="surface rounded-2xl p-5">
      <h3 className="mb-4 font-black">Completion Analytics</h3>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--line)" />
          <XAxis dataKey="subject" tick={{ fill: 'var(--muted)', fontSize: 12 }} />
          <YAxis tick={{ fill: 'var(--muted)', fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="completed" fill="#748b5d" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
