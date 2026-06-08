import React, { useState } from 'react';
import taskService from '../services/taskService';
import { useToast } from '../context/ToastContext';
import { Card, CardHeader, CardTitle, CardContent } from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';

const AddTask = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const newTask = await taskService.createTask({ title, description, priority, category, dueDate });
      
      setTitle('');
      setDescription('');
      setPriority('Medium');
      setCategory('Personal');
      setDueDate('');
      
      showToast('Task created successfully!', 'success');
      
      if (onTaskAdded) {
        onTaskAdded(newTask);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create task', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="sticky top-8">
      <CardHeader>
        <CardTitle>Add New Task</CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            label="Task Title"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="E.g., Complete project report"
            disabled={loading}
          />
          
          <Input
            as="textarea"
            label="Description (Optional)"
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details here..."
            disabled={loading}
          />
          
          <Input
            as="select"
            label="Priority"
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={loading}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Input>

          <Input
            as="select"
            label="Category"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={loading}
          >
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
            <option value="Health">Health</option>
          </Input>
          
          <Input
            label="Due Date (Optional)"
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            disabled={loading}
          />
          
          <Button
            type="submit"
            fullWidth
            disabled={!title.trim() || loading}
            className={`mt-2 ${(!title.trim() || loading) ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Adding Task...' : 'Create Task'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddTask;
