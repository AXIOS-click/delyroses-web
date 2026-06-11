export type BankAccount = {
  slug: string;
  bankName: string;
  displayName: string;
  accountHolder: string;
  accountType: string;
  accountNumber: string;
  documentId: string;
  logoUrl: string;
  instructions?: string;
  enabled: boolean;
};
