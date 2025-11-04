import {
  Student,
  Tournament,
  QuickMatch,
  StoredData,
  ExportData,
  Response
} from '@/types';

const STORAGE_KEY = 'blue-champ-data';

// Get stored data
export function getStoredData(): StoredData {
  if (typeof window === 'undefined') {
    return {
      students: [],
      completedTournaments: [],
      completedQuickMatches: []
    };
  }

  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return {
      students: [],
      completedTournaments: [],
      completedQuickMatches: []
    };
  }

  return JSON.parse(data);
}

// Save stored data
export function saveStoredData(data: StoredData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// Get students
export function getStudents(): Student[] {
  const data = getStoredData();
  return data.students;
}

// Save students
export function saveStudents(students: Student[]): void {
  const data = getStoredData();
  data.students = students;
  saveStoredData(data);
}

// Save completed tournament
export function saveCompletedTournament(tournament: Tournament): void {
  const data = getStoredData();
  data.completedTournaments.push(tournament);
  saveStoredData(data);
}

// Save completed quick match
export function saveCompletedQuickMatch(quickMatch: QuickMatch): void {
  const data = getStoredData();
  data.completedQuickMatches.push(quickMatch);
  saveStoredData(data);
}

// Export to CSV
export function exportToCSV(exportData: ExportData): void {
  const headers = ['Name', 'Score', 'Correct Answers', 'Total Questions', 'Accuracy'];
  const rows = exportData.participants.map(p => [
    p.name,
    p.score.toString(),
    p.correctAnswers.toString(),
    p.totalQuestions.toString(),
    `${((p.correctAnswers / p.totalQuestions) * 100).toFixed(1)}%`
  ]);

  const csvContent = [
    `Game Type: ${exportData.gameType}`,
    `Date: ${exportData.date}`,
    `Theme: ${exportData.theme}`,
    `Subject: ${exportData.subject}`,
    `Grade Level: ${exportData.gradeLevel}`,
    `Winner: ${exportData.winner}`,
    `Duration: ${exportData.duration} minutes`,
    '',
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  downloadCSV(csvContent, `game-results-${Date.now()}.csv`);
}

// Export detailed responses
export function exportDetailedReport(exportData: ExportData): void {
  const report = {
    summary: {
      gameType: exportData.gameType,
      date: exportData.date,
      theme: exportData.theme,
      subject: exportData.subject,
      gradeLevel: exportData.gradeLevel,
      winner: exportData.winner,
      duration: exportData.duration
    },
    participants: exportData.participants,
    responses: exportData.responses
  };

  const jsonContent = JSON.stringify(report, null, 2);
  downloadJSON(jsonContent, `detailed-report-${Date.now()}.json`);
}

// Download CSV file
function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

// Download JSON file
function downloadJSON(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

// Generate printable report HTML
export function generatePrintableReport(exportData: ExportData): void {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Game Results Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        h1 { color: #333; border-bottom: 3px solid #4CAF50; padding-bottom: 10px; }
        h2 { color: #666; margin-top: 30px; }
        .summary { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0; }
        .summary div { margin: 5px 0; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        th {
          background-color: #4CAF50;
          color: white;
        }
        tr:nth-child(even) { background-color: #f2f2f2; }
        .winner { background-color: #FFD700 !important; font-weight: bold; }
        @media print {
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>Blue Champ - Game Results</h1>

      <div class="summary">
        <div><strong>Game Type:</strong> ${exportData.gameType}</div>
        <div><strong>Date:</strong> ${exportData.date}</div>
        <div><strong>Theme:</strong> ${exportData.theme}</div>
        <div><strong>Subject:</strong> ${exportData.subject}</div>
        <div><strong>Grade Level:</strong> ${exportData.gradeLevel}</div>
        <div><strong>Duration:</strong> ${exportData.duration} minutes</div>
      </div>

      <h2>Final Standings</h2>
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
            <th>Correct Answers</th>
            <th>Accuracy</th>
          </tr>
        </thead>
        <tbody>
          ${exportData.participants.map((p, i) => `
            <tr class="${p.name === exportData.winner ? 'winner' : ''}">
              <td>${i + 1}</td>
              <td>${p.name}</td>
              <td>${p.score}</td>
              <td>${p.correctAnswers} / ${p.totalQuestions}</td>
              <td>${((p.correctAnswers / p.totalQuestions) * 100).toFixed(1)}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="no-print" style="margin-top: 30px;">
        <button onclick="window.print()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">
          Print Report
        </button>
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '', 'width=800,height=600');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
