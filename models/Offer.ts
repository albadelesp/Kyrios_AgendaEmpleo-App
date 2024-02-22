export interface Offer {
  documentId?: string;
  position: string;
  company: string;
  schedule: string;
  job_address: string;
  job_latitude?: number;
  job_longitude?: number;
  registration_date: string;
  mandatory_education: boolean;
  required_education: string;
  mandatory_experience: boolean;
  required_experience: string;
  interview_date?: string;
  interview_hour?: string;
  contact_person?: string;
  interview_address?: string;
  interview_latitude?: number;
  interview_longitude?: number;
}
