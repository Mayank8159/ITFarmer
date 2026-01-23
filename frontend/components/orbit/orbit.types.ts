// FILE: src/components/orbit/orbit.types.ts

export type Sender = 'system' | 'user';

export type MessageType = 'text' | 'options' | 'input-text' | 'input-email';

export interface Option {
  label: string;
  value: string;
  action: string;
}

export interface Message {
  id: string;
  sender: Sender;
  type: MessageType;
  content: string[]; // Array for multi-line system logs
  options?: Option[];
  timestamp: number;
}

export interface OrbitState {
  isOpen: boolean;
  flowStep: 'IDLE' | 'INTAKE' | 'DETAILS' | 'AUTH' | 'COMPLETE';
  history: Message[];
  userData: {
    intent?: string;
    details?: string;
    name?: string;
    email?: string;
  };
}