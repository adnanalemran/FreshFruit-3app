// components/reused/table/StatusSwitch.tsx
import { Switch } from '@/components/ui/switch'; // Import the Switch component
import http from '@/utils/http';
import { useState } from 'react';

interface StatusSwitchProps {
  id: string;
  initialStatus: boolean;
}

const StatusSwitch: React.FC<StatusSwitchProps> = ({ id, initialStatus }) => {
  const [isActive, setIsActive] = useState(initialStatus);

  const handleToggle = async () => {
    try {
      await http.put(`/tour/destinations/status/${id}`, {
        status: !isActive,
      });
      setIsActive((prevState) => !prevState);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Switch
        title={isActive ? 'Active' : 'Inactive'}
        checked={isActive}
        onCheckedChange={handleToggle}
        className="toggle-switch"
      />
    </div>
  );
};

export default StatusSwitch;
