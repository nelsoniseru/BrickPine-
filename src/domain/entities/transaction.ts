export enum TransactionType {
  FUND = 'FUND',
  TRANSFER = 'TRANSFER'
}

export interface Transaction {
  id: string;
  fromUserId: string | null; 
  toUserId: string;
  amount: number;
  type: TransactionType;
  createdAt: Date;
}