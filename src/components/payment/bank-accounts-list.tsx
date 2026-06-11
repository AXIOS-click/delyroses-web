import Image from "next/image";

import type { BankAccount } from "@/data/payment/types";

type BankAccountsListProps = {
  accounts: BankAccount[];
  compact?: boolean;
};

export function BankAccountsList({ accounts, compact = false }: BankAccountsListProps) {
  if (accounts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-muted p-4 text-sm font-semibold text-muted-foreground">
        No hay cuentas bancarias habilitadas. Revisa <code>src/data/payment/bank-accounts.json</code>.
      </div>
    );
  }

  return (
    <div className={compact ? "grid gap-3" : "grid gap-4 md:grid-cols-2"}>
      {accounts.map((account) => (
        <article key={account.slug} className="rounded-[1.25rem] border border-border bg-background p-4">
          <div className="flex items-start gap-4">
            <div className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl border border-border bg-card">
              <Image src={account.logoUrl} alt={account.bankName} fill sizes="48px" className="object-contain p-2" unoptimized />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-foreground">{account.displayName}</p>
              <p className="text-sm text-muted-foreground">{account.bankName}</p>
            </div>
          </div>

          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Titular</dt>
              <dd className="text-right font-semibold text-foreground">{account.accountHolder}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Tipo</dt>
              <dd className="text-right font-semibold text-foreground">{account.accountType}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Cuenta</dt>
              <dd className="text-right font-semibold text-foreground">{account.accountNumber}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Cédula/RUC</dt>
              <dd className="text-right font-semibold text-foreground">{account.documentId}</dd>
            </div>
          </dl>

          {account.instructions ? <p className="mt-4 text-sm leading-6 text-muted-foreground">{account.instructions}</p> : null}
        </article>
      ))}
    </div>
  );
}
