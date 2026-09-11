import React from 'react';
import { Users, User } from 'lucide-react';
import { Badge } from '../ui/Badge';

export function ParticipantsBar({ squad = [] }) {
  return (
    <div className="cyber-glass rounded-xl p-3.5 border border-slate-800 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400">
          <Users className="w-4 h-4" />
        </div>
        <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
          Current Squad ({squad.length}):
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {squad.map((name) => (
          <Badge key={name} variant="cyan" icon={User}>
            {name}
          </Badge>
        ))}
      </div>
    </div>
  );
}
