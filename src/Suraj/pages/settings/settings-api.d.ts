export interface ApiOrganisation {
  organisationName: string;
  _id: string;
  orgId: string;
  photo: File | null;
  businessType: string;
  address: string;
  emailAddress: string;
  phone: string;
  country: string;
  language: string;
  timezone: string;
}

export interface ApiAsset {
  _id: string;
  orgId: string;
  assetName: string;
  domainName: string;
  department: string;
  versionNumber: string;
  assetType: string;
  language: string;
  timezone: string;
  description: string;
}

export enum RoleType {
  ADMIN = "admin",
  TESTER = "tester",
}

export interface ApiUser {
  _id: string;
  orgId: string;
  firstName: string;
  lastName: string;
  photo: File | null;
  role: RoleType | string;
  department: string;
  designation: string;
  userName: string;
  assignedAssets: string;
  emailAddress: string;
  phoneNumber: string;
  country: string;
  language: string;
  timezone: string;
  password: string;
}

export interface ApiEditPassword {
  _id: string;
  password: string;
}
