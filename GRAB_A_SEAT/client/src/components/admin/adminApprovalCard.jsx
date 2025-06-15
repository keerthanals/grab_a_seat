import React from 'react';
import { User, Check, X, Mail } from 'lucide-react';
import { Card, CardContent, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import { adminAPI } from '../../services/api';

const AdminApprovalCard = ({ admin, onUpdate }) => {
  const handleApprove = async () => {
    try {
      console.log('Approving admin:', admin._id);
      
      const response = await adminAPI.approveRejectAdmin(admin._id, 'approve');
      
      console.log('Approval response:', response);
      onUpdate();
    } catch (error) {
      console.error('Failed to approve admin:', error);
      alert('Failed to approve admin: ' + error.message);
    }
  };

  const handleReject = async () => {
    const rejectionReason = prompt('Please provide a reason for rejection:');
    if (!rejectionReason) return;

    try {
      console.log('Rejecting admin:', admin._id, 'Reason:', rejectionReason);
      
      const response = await adminAPI.approveRejectAdmin(admin._id, 'reject', rejectionReason);
      
      console.log('Rejection response:', response);
      onUpdate();
    } catch (error) {
      console.error('Failed to reject admin:', error);
      alert('Failed to reject admin: ' + error.message);
    }
  };

  return (
    <Card className="overflow-hidden border border-slate-200 dark:border-slate-800">
      <div className="bg-slate-50 px-6 py-4 dark:bg-slate-800">
        <CardTitle className="text-lg">{admin.name}</CardTitle>
        <div className="mt-1 flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
          <Mail size={14} />
          <span>{admin.email}</span>
        </div>
      </div>
      <CardContent className="p-6">
        <div className="mb-4">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Role:</span> Administrator
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Status:</span>{' '}
            <span className="rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-800 dark:bg-accent-900 dark:text-accent-300">
              Pending Approval
            </span>
          </p>
          <p className="text-sm text-slate-700 dark:text-slate-300">
            <span className="font-medium">Registered:</span>{' '}
            {new Date(admin.createdAt).toLocaleDateString()}
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

export default AdminApprovalCard;