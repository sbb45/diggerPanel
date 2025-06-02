import React, { useEffect, useState } from 'react';
import { useUI } from "@/components/UI/UIProvider";

type Props = {
  agentId: number;
  username: string;
};

const WorkerStatisticsModal = ({ agentId, username }: Props) => {
  const { closeModal, addToast } = useUI();
  const [data, setData] = useState<any>(null);
  const api = process.env.NEXT_PUBLIC_API_BASE;

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${api}/api/v1/agents/${agentId}/command/statistic-worker/${username}/1hour`, {
          credentials: 'include'
        });
        if (!res.ok) {
          const error = await res.text();
          throw new Error(error || 'Failed to fetch worker stats');
        }
        const result = await res.json();
        setData(result);
      } catch (err) {
        addToast({
          type: 'danger',
          title: 'Statistics error',
          message: err instanceof Error ? err.message : 'Unknown error'
        });
        closeModal();
      }
    };

    fetchStats();
  }, [agentId, username]);

  return (
    <div style={{ padding: '20px', width: '600px' }}>
      <h2>Statistics for {username}</h2>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default WorkerStatisticsModal;
