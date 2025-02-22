export interface CourseCardProps {
  title: string;
  rating: number;
  reviewCount: number;
  creatorName: string;
  language: string;
  sessions: number;
  duration: string;
  sales: number;
  description: string;
  progress?: number;
  isCompleted?: boolean;
  groupName: string;
  thumbnailUrl: string;
  onManage?: () => void;
}
