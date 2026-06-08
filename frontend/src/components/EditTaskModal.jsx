import React, { useState, useEffect } from 'react';
import taskService from '../services/taskService';
import { useToast } from '../context/ToastContext';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

const EditTaskModal = ({ isOpen, onClose, task, onTaskUpdated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [category, setCategory] = useState('Personal');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (task && isOpen) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || 'Medium');
      setCategory(task.category || 'Personal');
      if (task.dueDate) {
        setDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
      } else {
        setDueDate('');
      }
    }
  }, [task, isOpen]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Title is required', 'error');
      return;
    }

    try {
      setLoading(true);
      
      const updatedTask = await taskService.updateTask(task._id, { title, description, priority, category, dueDate });
      
      if (onTaskUpdated) {
        onTaskUpdated(updatedTask);
      }
      
      showToast('Task updated successfully', 'success');
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update task', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          label="Task Title"
          id="edit-title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={loading}
        />
        <Input
          as="textarea"
          label="Description (Optional)"
          id="edit-description"
          rows="4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
        />
        
        <Input
          as="select"
          label="Priority"
          id="edit-priority"
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
          id="edit-category"
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
          id="edit-dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={loading}
        />
        
        <div className="flex justify-end space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!title.trim() || loading}
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTaskModal;
