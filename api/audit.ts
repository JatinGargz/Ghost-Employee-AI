import { CoralService } from '../services/coralService';
import { EmployeeProfile } from '../types/coral';

export default function handler(req: any, res: any) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const footprints = CoralService.getEmployeeFootprints();
  const employees: EmployeeProfile[] = [
    {
      name: 'Sarah Connor',
      role: 'DevOps Engineer',
      payrollStatus: 'Active',
      monthlySalary: 8500,
      digitalFootprintScore: 92,
      lastActive: '2026-05-30T14:22:00Z',
      activityBreakdown: footprints['Sarah Connor'] as any,
    },
    {
      name: 'Marcus Wright',
      role: 'Senior Backend Engineer',
      payrollStatus: 'Active',
      monthlySalary: 9800,
      digitalFootprintScore: 88,
      lastActive: '2026-05-29T13:10:00Z',
      activityBreakdown: footprints['Marcus Wright'] as any,
    },
    {
      name: 'Elena Rostova',
      role: 'Lead Frontend UI Developer',
      payrollStatus: 'Active',
      monthlySalary: 9200,
      digitalFootprintScore: 95,
      lastActive: '2026-05-31T00:45:00Z',
      activityBreakdown: footprints['Elena Rostova'] as any,
    },
    {
      name: 'Thomas Anderson',
      role: 'Security & Auth Engineer',
      payrollStatus: 'Active',
      monthlySalary: 8900,
      digitalFootprintScore: 81,
      lastActive: '2026-05-30T15:00:00Z',
      activityBreakdown: footprints['Thomas Anderson'] as any,
    },
    {
      name: 'Apoorva Jha',
      role: 'Staff Generative AI Engineer',
      payrollStatus: 'Active',
      monthlySalary: 11000,
      digitalFootprintScore: 94,
      lastActive: '2026-05-31T01:10:00Z',
      activityBreakdown: footprints['Apoorva Jha'] as any,
    },
    {
      name: 'Donald Vance',
      role: 'Principal SRE Architect',
      payrollStatus: 'Anomaly', // Highlighted Ghost payroll entry!
      monthlySalary: 14500, // Getting paid, but has 0 footprint across Slack, Jira, GitHub, Notion
      digitalFootprintScore: 0,
      lastActive: 'Never',
      activityBreakdown: footprints['Donald Vance'] as any,
    },
  ];

  res.status(200).json(employees);
}
