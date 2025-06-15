import React from 'react';
import { MapPin, Check, X } from 'lucide-react';
import { Card, CardContent, CardTitle } from '../ui/Card';
import Button from '../ui/Button';

const TheatreApprovalCard = ({ theatre, onUpdate }) => {
  const handleApprove = async () => {
    try {
      const response = await fetch(`/api/admin/theatres/${theatre.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ action: 'approve' })
      });

      if (response.ok) {
        onUpdate();
      } else {
        const error = await response.json();
        console.error('Approval failed:', error);
        alert('Failed to approve theatre: ' + error.message);
      }
    } catch (error) {
      console.error('Failed to approve theatre:', error);
      alert('Failed to approve theatre');
    }
  };

  const handleReject = async () => {
    const rejectionReason = prompt('Please provide a reason for rejection:');
    if (!rejectionReason) return;

    try {
      const response = await fetch(`/api/admin/theatres/${theatre.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ 
          action: 'reject',
          rejectionReason 
        })
      });

      if (response.ok) {
        onUpdate();
      } else {
        const error = await response.json();
        console.error('Rejection failed:', error);
        alert('Failed to reject theatre: ' + error.message);
      }
    } catch (error) {
      console.error('Failed to reject theatre:', error);
      alert('Failed to reject theatre');
    }
  };

  return (
    <Card className="overflow-hidden border border-slate-200 dark:border-slate-800">
      <div className="bg-slate-50 px-6 py-4 dark:bg-slate-800">
        <CardTitle className="text-lg">{theatre.name}</CardTitle>
        <div className="mt-1 flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
          <MapPin size={14} />
          <span>{theatre.location}</span>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="mb-4">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Owner:</span> {theatre.ownerName} ({theatre.ownerEmail})
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Screens:</span> {theatre.screens.length}
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Status:</span>{' '}
            <span className="rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-800 dark:bg-accent-900 dark:text-accent-300">
              Pending Approval
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            leftIcon={<Check size={16} />}
            onClick={handleApprove}
          >
            Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="flex-1"
            leftIcon={<X size={16} />}
            onClick={handleReject}
          >
            Reject
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TheatreApprovalCard;