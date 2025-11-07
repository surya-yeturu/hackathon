import { useState, useEffect } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { TeamMember } from '../types';
import { wsService } from '../services/websocket';
import DonutChart from '../components/charts/DonutChart';
import BubbleChart from '../components/charts/BubbleChart';

const API_URL = 'http://localhost:8080/api';

export default function Tasks() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<Array<{ name: string; tasks: number; openIssues: number; color: string }>>([]);
  const itemsPerPage = 8;

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/team-members`);
      if (response.ok) {
        const data = await response.json();
        setTeamMembers(data);
      }
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch(`${API_URL}/tasks`);
      if (response.ok) {
        const data = await response.json();
        const tasks = data.tasks || [];
        
        // Calculate projects from tasks
        const projectMap = new Map<string, { tasks: number; openIssues: number }>();
        const projectColors = ['#ec4899', '#3b82f6', '#f59e0b', '#10b981', '#a855f7'];
        
        tasks.forEach((task: any) => {
          const projectName = task.project || 'default';
          if (!projectMap.has(projectName)) {
            projectMap.set(projectName, { tasks: 0, openIssues: 0 });
          }
          const project = projectMap.get(projectName)!;
          project.tasks++;
          if (task.status === 'open' || task.status === 'blocked') {
            project.openIssues++;
          }
        });

        const projectList = Array.from(projectMap.entries()).map(([name, data], index) => ({
          name,
          tasks: data.tasks,
          openIssues: data.openIssues,
          color: projectColors[index % projectColors.length],
        }));

        setProjects(projectList.length > 0 ? projectList : []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
    fetchProjects();

    const unsubscribe = wsService.onMessage((message) => {
      if (message.type === 'task_update') {
        // Refresh data when tasks are updated
        fetchTeamMembers();
        fetchProjects();
      }
    });

    return unsubscribe;
  }, []);

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredMembers.length / itemsPerPage);
  const paginatedMembers = filteredMembers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getTrendIcon = (trend: number) => {
    if (trend > 0) {
      return <span className="text-green-500">↗</span>;
    } else if (trend < 0) {
      return <span className="text-red-500">↘</span>;
    }
    return <span className="text-dark-muted">—</span>;
  };

  const tasksByProjectData = projects.map((project) => ({
    name: project.name,
    value: project.tasks,
    color: project.color,
  }));

  const openIssuesData = projects.map((project) => ({
    name: project.name,
    value: project.openIssues,
    color: project.color,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-dark-text mb-2">Task Management</h2>
        <p className="text-dark-muted">View and manage team tasks and assignments</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List */}
        <div className="lg:col-span-2 bg-dark-card rounded-lg p-6 border border-dark-border">
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-dark-muted" />
              <input
                type="text"
                placeholder="Search Name..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder-dark-muted focus:outline-none focus:border-blue-500"
              />
            </div>
            <select className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-blue-500">
              <option>All Tasks</option>
              <option>Open</option>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Blocked</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-muted">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-muted">Assigned</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-muted">Completed</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-muted">Ongoing</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-dark-muted">Trend</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-dark-muted">
                      Loading team members...
                    </td>
                  </tr>
                ) : paginatedMembers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-dark-muted">
                      No team members found. Upload a CSV file to import tasks.
                    </td>
                  </tr>
                ) : (
                  paginatedMembers.map((member, index) => (
                    <tr key={member.id || index} className="border-b border-dark-border hover:bg-dark-bg transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm">
                            {member.initials}
                          </div>
                          <span className="text-dark-text">{member.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-dark-text">{member.assigned}</td>
                      <td className="py-3 px-4 text-dark-text">{member.completed}</td>
                      <td className="py-3 px-4 text-dark-text">{member.ongoing}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getTrendIcon(member.trend)}
                          <span className="text-sm text-dark-muted">
                            {member.trend > 0 ? '+' : ''}
                            {member.trend.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-border transition-colors flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'bg-dark-bg border border-dark-border text-dark-text hover:bg-dark-border'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark-border transition-colors flex items-center gap-2"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Charts */}
        <div className="space-y-6">
          <DonutChart data={tasksByProjectData} title="Tasks by Project" />
          <BubbleChart data={openIssuesData} title="Open Issues by Project" />
        </div>
      </div>
    </div>
  );
}

