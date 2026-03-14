import { NextResponse } from "next/server";
import { getAuthenticatedAppContext } from "@/lib/auth/server";

type Account = {
  id: string;
  account_name: string;
  debt_type: string | null;
  is_pslf_eligible: boolean | null;
  repayment_plan: string | null;
  current_balance: number;
};

type Program = {
  id: string;
  name: string;
  program_code: string;
  eligible_loan_types: string[] | null;
  eligible_plans: string[] | null;
};

export async function GET() {
  const auth = await getAuthenticatedAppContext();
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { supabase, user } = auth;

  const { data: accounts, error: accountsError } = await supabase
    .from("debt_accounts")
    .select("id, account_name, debt_type, is_pslf_eligible, repayment_plan, current_balance")
    .eq("user_id", user.id)
    .eq("is_active", true);

  if (accountsError) {
    return NextResponse.json({ error: accountsError.message }, { status: 500 });
  }

  const { data: programs, error: programsError } = await supabase
    .from("forgiveness_programs")
    .select("id, name, program_code, eligible_loan_types, eligible_plans")
    .eq("is_active", true);

  if (programsError) {
    return NextResponse.json({ error: programsError.message }, { status: 500 });
  }

  const accountList = (accounts ?? []) as Account[];
  const programList = (programs ?? []) as Program[];

  const results = programList.map((program) => {
    const isPslf = program.program_code === "PSLF";

    const eligibleAccounts = accountList.filter((account) => {
      const loanTypeMatch =
        !program.eligible_loan_types ||
        (account.debt_type !== null &&
          program.eligible_loan_types.includes(account.debt_type));
      const repaymentMatch =
        !program.eligible_plans ||
        (account.repayment_plan !== null &&
          program.eligible_plans.includes(account.repayment_plan));
      const pslfMatch = isPslf ? account.is_pslf_eligible === true : true;
      return loanTypeMatch && repaymentMatch && pslfMatch;
    });

    const hasFederal = eligibleAccounts.some(
      (a) => a.debt_type === "student_federal"
    );
    const status =
      eligibleAccounts.length === 0
        ? "not_eligible"
        : hasFederal
        ? "eligible"
        : "potentially_eligible";

    return {
      program_id: program.id,
      program_name: program.name,
      eligible_accounts: eligibleAccounts.map((a) => ({
        id: a.id,
        account_name: a.account_name,
        current_balance: a.current_balance,
      })),
      status,
    };
  });

  return NextResponse.json({ data: results });
}
