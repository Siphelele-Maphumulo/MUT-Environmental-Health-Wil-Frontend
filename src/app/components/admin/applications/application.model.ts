// Enums for fixed-value fields
export enum Title {
  MR = 'Mr',
  MRS = 'Mrs',
  MISS = 'Miss',
  DR = 'Dr',
  PROF = 'Prof',
}

export enum Race {
  AFRICAN = 'African',
  COLORED = 'Colored',
  INDIAN = 'Indian',
  WHITE = 'White',
  OTHER = 'Other',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
}

export enum StudyLevel {
  FIRST_YEAR = 1,
  SECOND_YEAR = 2,
  THIRD_YEAR = 3,
  POSTGRADUATE = 4,
  MASTER = 5,
  DOCTORAL = 6,
}

// Main interface
export interface Application {
  updatedAt: string;
  id: number;
  province: string;
  title: Title;
  initials: string;
  surname: string;
  first_names: string;
  student_number: string;
  level_of_study: StudyLevel;
  race: Race;
  gender: Gender;
  email: string;
  physical_address: string;
  home_town: string;
  cell_phone_number: string;
  municipality_name: string;
  town_situated: string;
  contact_person: string;
  contact_email: string;
  telephone_number: string;
  contact_cell_phone: string;
  declaration_info_1: boolean;
  declaration_info_2: boolean;
  declaration_info_3: boolean;
  signature_image: string;
  status: 'Pending' | 'Accepted' | 'Rejected';
  id_document: string;
  cv_document: string;
  created_at: string; // or Date if parsing
}

interface StatusUpdateResponse {
  success: boolean;
  message: string;
  newStatus: string;
  code?: string;
  changes?: number;
}
