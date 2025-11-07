import csvParser from 'csv-parser';
import { Readable } from 'stream';
import Task from '../models/Task.js';

export const parseAndStoreCSV = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(fileBuffer.toString());

    stream
      .pipe(csvParser())
      .on('data', (row) => {
        results.push(row);
      })
      .on('end', async () => {
        try {
          const tasks = await processCSVRows(results);
          resolve({ success: true, imported: tasks.length, tasks });
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

const processCSVRows = async (rows) => {
  const tasks = [];
  
  for (const row of rows) {
    try {
      // Flexible CSV column mapping
      // Supports various column names
      const title = row.title || row.task || row.name || row['Task Name'] || row['Task Title'] || '';
      const assignedTo = row.assignedTo || row.assigned || row.assignee || row['Assigned To'] || row['Assigned'] || '';
      const status = normalizeStatus(row.status || row.state || row['Status'] || row['State'] || 'open');
      const project = row.project || row['Project'] || row.repository || row['Repository'] || 'default';
      const description = row.description || row.desc || row['Description'] || '';
      const priority = normalizePriority(row.priority || row['Priority'] || 'medium');
      const labels = row.labels ? row.labels.split(',').map(l => l.trim()) : [];
      
      // Parse dates
      const createdAt = parseDate(row.createdAt || row.created || row['Created At'] || row['Created Date']);
      const updatedAt = parseDate(row.updatedAt || row.updated || row['Updated At'] || row['Updated Date']) || createdAt;
      const closedAt = status === 'completed' ? parseDate(row.closedAt || row.closed || row['Closed At'] || row['Closed Date']) : null;
      const dueDate = parseDate(row.dueDate || row.due || row['Due Date'] || row['Due']);

      if (!title) {
        console.warn('Skipping row with no title:', row);
        continue;
      }

      // Generate unique externalId based on title and assignedTo to prevent duplicates
      const uniqueKey = `${title.trim()}_${assignedTo.trim()}`.toLowerCase().replace(/[^a-z0-9]/g, '_');
      const externalId = `csv_${uniqueKey}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      const taskData = {
        externalId,
        source: 'manual',
        title: title.trim(),
        description: description.trim(),
        status,
        assignedTo: assignedTo.trim(),
        project: project.trim(),
        labels,
        priority,
        createdAt,
        updatedAt,
        closedAt,
        dueDate,
        metadata: {
          importedFrom: 'csv',
          originalRow: row,
        },
      };

      // Upsert task
      const task = await Task.findOneAndUpdate(
        { externalId },
        taskData,
        { upsert: true, new: true }
      );

      tasks.push(task);
    } catch (error) {
      console.error('Error processing CSV row:', error, row);
    }
  }

  return tasks;
};

const normalizeStatus = (status) => {
  if (!status) return 'open';
  
  const normalized = status.toLowerCase().trim();
  
  if (normalized.includes('open') || normalized === 'new' || normalized === 'todo') {
    return 'open';
  }
  if (normalized.includes('progress') || normalized === 'in progress' || normalized === 'doing') {
    return 'in_progress';
  }
  if (normalized.includes('complete') || normalized.includes('done') || normalized === 'closed' || normalized === 'resolved') {
    return 'completed';
  }
  if (normalized.includes('block') || normalized === 'blocked') {
    return 'blocked';
  }
  
  return 'open';
};

const normalizePriority = (priority) => {
  if (!priority) return 'medium';
  
  const normalized = priority.toLowerCase().trim();
  
  if (normalized.includes('critical') || normalized.includes('urgent')) {
    return 'critical';
  }
  if (normalized.includes('high')) {
    return 'high';
  }
  if (normalized.includes('low')) {
    return 'low';
  }
  
  return 'medium';
};

const parseDate = (dateString) => {
  if (!dateString) return null;
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch (error) {
    return null;
  }
};

