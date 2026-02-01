export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum UserStatus {
  FREE = 'FREE',
  PREMIUM = 'PREMIUM'
}

export interface User {
  id: string;
  name: string;
  phone: string; // Used as ID
  email: string;
  password: string;
  refCode: string;
  uplineCode: string; // Who referred them
  status: UserStatus;
  balanceFree: number;
  balancePremium: number;
  joinDate: string;
  isBlocked: boolean;
  refBonusReceived: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  amount: number;
  image: string;
  link: string;
  type: 'FREE' | 'PREMIUM';
  category: 'YOUTUBE' | 'FACEBOOK' | 'TIKTOK' | 'GMAIL';
  limitPerDay?: number;
}

export interface TaskSubmission {
  id: string;
  userId: string;
  taskId: string;
  proofLink: string;
  details: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
  amount: number;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  method: 'BKASH' | 'NAGAD' | 'ROCKET';
  number: string;
  type: 'MAIN' | 'JOB';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  date: string;
}

export interface Ticket {
  id: string;
  userId: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'CLOSED';
  date: string;
}

export interface Settings {
  companyName: string;
  notice: string;
  landingText: string;
  youtubeLink: string;
  facebookLink: string;
  telegramLink: string;
  whatsappLink: string;
  premiumCost: number;
  refBonus: number;
  contactNumber: string;
  quizReward: number;
}