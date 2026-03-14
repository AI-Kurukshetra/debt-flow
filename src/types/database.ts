export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          annual_income: number | null;
          avatar_url: string | null;
          created_at: string;
          date_of_birth: string | null;
          email: string | null;
          employment_type: "employed" | "self_employed" | "unemployed" | "student" | null;
          family_size: number | null;
          full_name: string | null;
          id: string;
          is_active: boolean;
          is_verified: boolean;
          last_login_at: string | null;
          onboarding_step: number;
          phone: string | null;
          timezone: string | null;
          updated_at: string;
          username: string | null;
        };
        Insert: {
          annual_income?: number | null;
          avatar_url?: string | null;
          created_at?: string;
          date_of_birth?: string | null;
          email?: string | null;
          employment_type?: "employed" | "self_employed" | "unemployed" | "student" | null;
          family_size?: number | null;
          full_name?: string | null;
          id: string;
          is_active?: boolean;
          is_verified?: boolean;
          last_login_at?: string | null;
          onboarding_step?: number;
          phone?: string | null;
          timezone?: string | null;
          updated_at?: string;
          username?: string | null;
        };
        Update: {
          annual_income?: number | null;
          avatar_url?: string | null;
          date_of_birth?: string | null;
          email?: string | null;
          employment_type?: "employed" | "self_employed" | "unemployed" | "student" | null;
          family_size?: number | null;
          full_name?: string | null;
          is_active?: boolean;
          is_verified?: boolean;
          last_login_at?: string | null;
          onboarding_step?: number;
          phone?: string | null;
          timezone?: string | null;
          updated_at?: string;
          username?: string | null;
        };
      };
      projects: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          is_demo: boolean | null;
          owner_id: string | null;
          owner_name: string | null;
          progress: number;
          status: "Idea" | "Building" | "Launched";
          title: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          is_demo?: boolean;
          owner_id?: string | null;
          owner_name?: string | null;
          progress?: number;
          status?: "Idea" | "Building" | "Launched";
          title: string;
          updated_at?: string;
        };
        Update: {
          description?: string | null;
          is_demo?: boolean;
          owner_id?: string | null;
          owner_name?: string | null;
          progress?: number;
          status?: "Idea" | "Building" | "Launched";
          title?: string;
          updated_at?: string;
        };
      };
      project_updates: {
        Row: {
          created_at: string;
          event: string;
          id: string;
          project_id: string;
        };
        Insert: {
          created_at?: string;
          event: string;
          id?: string;
          project_id: string;
        };
        Update: {
          event?: string;
        };
      };
      loan_servicers: {
        Row: {
          api_supported: boolean;
          created_at: string;
          id: string;
          is_active: boolean;
          logo_url: string | null;
          name: string;
          phone: string | null;
          servicer_type: "federal" | "private" | "credit_card" | "mortgage" | "personal" | "other";
          website_url: string | null;
        };
        Insert: {
          api_supported?: boolean;
          created_at?: string;
          id?: string;
          is_active?: boolean;
          logo_url?: string | null;
          name: string;
          phone?: string | null;
          servicer_type: "federal" | "private" | "credit_card" | "mortgage" | "personal" | "other";
          website_url?: string | null;
        };
        Update: {
          api_supported?: boolean;
          is_active?: boolean;
          logo_url?: string | null;
          name?: string;
          phone?: string | null;
          servicer_type?: "federal" | "private" | "credit_card" | "mortgage" | "personal" | "other";
          website_url?: string | null;
        };
      };
      debt_accounts: {
        Row: {
          account_name: string;
          account_number_last4: string | null;
          created_at: string;
          current_balance: number;
          debt_type:
            | "student_federal"
            | "student_private"
            | "credit_card"
            | "mortgage"
            | "personal"
            | "auto"
            | "other";
          id: string;
          interest_rate: number;
          is_active: boolean;
          is_in_deferment: boolean;
          is_in_forbearance: boolean;
          is_pslf_eligible: boolean | null;
          last_synced_at: string | null;
          loan_term_months: number | null;
          loan_type: string | null;
          minimum_payment: number;
          notes: string | null;
          original_balance: number;
          payment_due_day: number | null;
          payoff_date_est: string | null;
          rate_type: "fixed" | "variable";
          repayment_plan: string | null;
          servicer_id: string | null;
          start_date: string | null;
          sync_status: "manual" | "synced" | "sync_failed" | "pending";
          updated_at: string;
          user_id: string;
        };
        Insert: {
          account_name: string;
          account_number_last4?: string | null;
          created_at?: string;
          current_balance: number;
          debt_type:
            | "student_federal"
            | "student_private"
            | "credit_card"
            | "mortgage"
            | "personal"
            | "auto"
            | "other";
          id?: string;
          interest_rate: number;
          is_active?: boolean;
          is_in_deferment?: boolean;
          is_in_forbearance?: boolean;
          is_pslf_eligible?: boolean | null;
          last_synced_at?: string | null;
          loan_term_months?: number | null;
          loan_type?: string | null;
          minimum_payment?: number;
          notes?: string | null;
          original_balance: number;
          payment_due_day?: number | null;
          payoff_date_est?: string | null;
          rate_type: "fixed" | "variable";
          repayment_plan?: string | null;
          servicer_id?: string | null;
          start_date?: string | null;
          sync_status?: "manual" | "synced" | "sync_failed" | "pending";
          updated_at?: string;
          user_id: string;
        };
        Update: {
          account_name?: string;
          account_number_last4?: string | null;
          current_balance?: number;
          debt_type?:
            | "student_federal"
            | "student_private"
            | "credit_card"
            | "mortgage"
            | "personal"
            | "auto"
            | "other";
          interest_rate?: number;
          is_active?: boolean;
          is_in_deferment?: boolean;
          is_in_forbearance?: boolean;
          is_pslf_eligible?: boolean | null;
          last_synced_at?: string | null;
          loan_term_months?: number | null;
          loan_type?: string | null;
          minimum_payment?: number;
          notes?: string | null;
          original_balance?: number;
          payment_due_day?: number | null;
          payoff_date_est?: string | null;
          rate_type?: "fixed" | "variable";
          repayment_plan?: string | null;
          servicer_id?: string | null;
          start_date?: string | null;
          sync_status?: "manual" | "synced" | "sync_failed" | "pending";
          updated_at?: string;
        };
      };
      transactions: {
        Row: {
          account_id: string;
          amount: number;
          balance_after: number | null;
          created_at: string;
          fees_applied: number | null;
          id: string;
          interest_applied: number | null;
          is_autopay: boolean;
          notes: string | null;
          payment_method: string | null;
          principal_applied: number | null;
          reference_number: string | null;
          transaction_date: string;
          transaction_type: "payment" | "extra_payment" | "refund" | "adjustment" | "fee" | "disbursement";
          user_id: string;
        };
        Insert: {
          account_id: string;
          amount: number;
          balance_after?: number | null;
          created_at?: string;
          fees_applied?: number | null;
          id?: string;
          interest_applied?: number | null;
          is_autopay?: boolean;
          notes?: string | null;
          payment_method?: string | null;
          principal_applied?: number | null;
          reference_number?: string | null;
          transaction_date: string;
          transaction_type: "payment" | "extra_payment" | "refund" | "adjustment" | "fee" | "disbursement";
          user_id: string;
        };
        Update: never;
      };
      payment_strategies: {
        Row: {
          calculation_snapshot: Json | null;
          created_at: string;
          extra_payment_amount: number | null;
          id: string;
          is_active: boolean;
          last_calculated_at: string | null;
          monthly_budget: number;
          name: string;
          priority_account_ids: string[] | null;
          projected_interest_saved: number | null;
          projected_payoff_date: string | null;
          strategy_type: "snowball" | "avalanche" | "custom" | "hybrid";
          updated_at: string;
          user_id: string;
        };
        Insert: {
          calculation_snapshot?: Json | null;
          created_at?: string;
          extra_payment_amount?: number | null;
          id?: string;
          is_active?: boolean;
          last_calculated_at?: string | null;
          monthly_budget: number;
          name: string;
          priority_account_ids?: string[] | null;
          projected_interest_saved?: number | null;
          projected_payoff_date?: string | null;
          strategy_type: "snowball" | "avalanche" | "custom" | "hybrid";
          updated_at?: string;
          user_id: string;
        };
        Update: {
          calculation_snapshot?: Json | null;
          extra_payment_amount?: number | null;
          is_active?: boolean;
          last_calculated_at?: string | null;
          monthly_budget?: number;
          name?: string;
          priority_account_ids?: string[] | null;
          projected_interest_saved?: number | null;
          projected_payoff_date?: string | null;
          strategy_type?: "snowball" | "avalanche" | "custom" | "hybrid";
          updated_at?: string;
        };
      };
      payment_schedules: {
        Row: {
          account_id: string;
          amount: number;
          created_at: string;
          due_date: string;
          id: string;
          paid_at: string | null;
          payment_type: "minimum" | "extra" | "full_payoff";
          status: "pending" | "paid" | "skipped" | "failed";
          strategy_id: string | null;
          transaction_id: string | null;
          user_id: string;
        };
        Insert: {
          account_id: string;
          amount: number;
          created_at?: string;
          due_date: string;
          id?: string;
          paid_at?: string | null;
          payment_type: "minimum" | "extra" | "full_payoff";
          status?: "pending" | "paid" | "skipped" | "failed";
          strategy_id?: string | null;
          transaction_id?: string | null;
          user_id: string;
        };
        Update: {
          amount?: number;
          due_date?: string;
          paid_at?: string | null;
          payment_type?: "minimum" | "extra" | "full_payoff";
          status?: "pending" | "paid" | "skipped" | "failed";
          strategy_id?: string | null;
          transaction_id?: string | null;
        };
      };
      forgiveness_programs: {
        Row: {
          description: string | null;
          eligible_loan_types: string[] | null;
          eligible_plans: string[] | null;
          employment_required: boolean;
          forgiveness_year: number | null;
          id: string;
          info_url: string | null;
          is_active: boolean;
          name: string;
          payment_count_req: number | null;
          program_code: string;
        };
        Insert: {
          description?: string | null;
          eligible_loan_types?: string[] | null;
          eligible_plans?: string[] | null;
          employment_required?: boolean;
          forgiveness_year?: number | null;
          id?: string;
          info_url?: string | null;
          is_active?: boolean;
          name: string;
          payment_count_req?: number | null;
          program_code: string;
        };
        Update: {
          description?: string | null;
          eligible_loan_types?: string[] | null;
          eligible_plans?: string[] | null;
          employment_required?: boolean;
          forgiveness_year?: number | null;
          info_url?: string | null;
          is_active?: boolean;
          name?: string;
          payment_count_req?: number | null;
          program_code?: string;
        };
      };
      user_forgiveness_tracking: {
        Row: {
          account_id: string | null;
          created_at: string;
          ecf_submission_date: string | null;
          employer_ein: string | null;
          employer_name: string | null;
          estimated_forgiveness_amount: number | null;
          estimated_forgiveness_date: string | null;
          id: string;
          notes: string | null;
          payments_remaining: number | null;
          program_id: string;
          qualifying_payments: number;
          status: "tracking" | "eligible" | "applied" | "approved" | "not_eligible";
          updated_at: string;
          user_id: string;
        };
        Insert: {
          account_id?: string | null;
          created_at?: string;
          ecf_submission_date?: string | null;
          employer_ein?: string | null;
          employer_name?: string | null;
          estimated_forgiveness_amount?: number | null;
          estimated_forgiveness_date?: string | null;
          id?: string;
          notes?: string | null;
          payments_remaining?: number | null;
          program_id: string;
          qualifying_payments?: number;
          status?: "tracking" | "eligible" | "applied" | "approved" | "not_eligible";
          updated_at?: string;
          user_id: string;
        };
        Update: {
          account_id?: string | null;
          ecf_submission_date?: string | null;
          employer_ein?: string | null;
          employer_name?: string | null;
          estimated_forgiveness_amount?: number | null;
          estimated_forgiveness_date?: string | null;
          notes?: string | null;
          payments_remaining?: number | null;
          program_id?: string;
          qualifying_payments?: number;
          status?: "tracking" | "eligible" | "applied" | "approved" | "not_eligible";
          updated_at?: string;
        };
      };
      user_goals: {
        Row: {
          account_id: string | null;
          completed_at: string | null;
          created_at: string;
          current_progress: number;
          description: string | null;
          goal_type: "debt_free" | "balance_target" | "emergency_fund" | "refinance" | "milestone";
          id: string;
          status: "active" | "completed" | "abandoned";
          target_amount: number | null;
          target_date: string | null;
          title: string;
          updated_at: string;
          user_id: string;
        };
        Insert: {
          account_id?: string | null;
          completed_at?: string | null;
          created_at?: string;
          current_progress?: number;
          description?: string | null;
          goal_type: "debt_free" | "balance_target" | "emergency_fund" | "refinance" | "milestone";
          id?: string;
          status?: "active" | "completed" | "abandoned";
          target_amount?: number | null;
          target_date?: string | null;
          title: string;
          updated_at?: string;
          user_id: string;
        };
        Update: {
          account_id?: string | null;
          completed_at?: string | null;
          current_progress?: number;
          description?: string | null;
          goal_type?: "debt_free" | "balance_target" | "emergency_fund" | "refinance" | "milestone";
          status?: "active" | "completed" | "abandoned";
          target_amount?: number | null;
          target_date?: string | null;
          title?: string;
          updated_at?: string;
        };
      };
      budget_categories: {
        Row: {
          actual_amount: number | null;
          budget_month: string;
          budgeted_amount: number;
          category_name: string;
          category_type: "income" | "fixed_expense" | "variable_expense" | "debt_payment" | "savings";
          created_at: string;
          id: string;
          is_recurring: boolean;
          notes: string | null;
          user_id: string;
        };
        Insert: {
          actual_amount?: number | null;
          budget_month: string;
          budgeted_amount: number;
          category_name: string;
          category_type: "income" | "fixed_expense" | "variable_expense" | "debt_payment" | "savings";
          created_at?: string;
          id?: string;
          is_recurring?: boolean;
          notes?: string | null;
          user_id: string;
        };
        Update: {
          actual_amount?: number | null;
          budget_month?: string;
          budgeted_amount?: number;
          category_name?: string;
          category_type?: "income" | "fixed_expense" | "variable_expense" | "debt_payment" | "savings";
          is_recurring?: boolean;
          notes?: string | null;
        };
      };
      credit_scores: {
        Row: {
          bureau: "equifax" | "experian" | "transunion";
          factors: Json | null;
          id: string;
          recorded_at: string;
          score: number;
          score_model: string | null;
          source: string;
          user_id: string;
        };
        Insert: {
          bureau: "equifax" | "experian" | "transunion";
          factors?: Json | null;
          id?: string;
          recorded_at?: string;
          score: number;
          score_model?: string | null;
          source?: string;
          user_id: string;
        };
        Update: {
          bureau?: "equifax" | "experian" | "transunion";
          factors?: Json | null;
          recorded_at?: string;
          score?: number;
          score_model?: string | null;
          source?: string;
        };
      };
      refinancing_offers: {
        Row: {
          apply_url: string | null;
          estimated_payment: number | null;
          fetched_at: string;
          id: string;
          lender_name: string;
          loan_term_months: number;
          min_credit_score: number | null;
          offer_expires_at: string | null;
          offered_rate: number;
          origination_fee: number | null;
          pre_qualification: boolean;
          rate_type: "fixed" | "variable";
          servicer_id: string | null;
          total_interest_cost: number | null;
          user_id: string;
        };
        Insert: {
          apply_url?: string | null;
          estimated_payment?: number | null;
          fetched_at?: string;
          id?: string;
          lender_name: string;
          loan_term_months: number;
          min_credit_score?: number | null;
          offer_expires_at?: string | null;
          offered_rate: number;
          origination_fee?: number | null;
          pre_qualification?: boolean;
          rate_type: "fixed" | "variable";
          servicer_id?: string | null;
          total_interest_cost?: number | null;
          user_id: string;
        };
        Update: {
          apply_url?: string | null;
          estimated_payment?: number | null;
          fetched_at?: string;
          lender_name?: string;
          loan_term_months?: number;
          min_credit_score?: number | null;
          offer_expires_at?: string | null;
          offered_rate?: number;
          origination_fee?: number | null;
          pre_qualification?: boolean;
          rate_type?: "fixed" | "variable";
          servicer_id?: string | null;
          total_interest_cost?: number | null;
        };
      };
      tax_optimizations: {
        Row: {
          adjusted_gross_income: number | null;
          created_at: string;
          deductible_interest: number | null;
          estimated_tax_savings: number | null;
          filing_status: "single" | "married_joint" | "married_sep" | "head_of_household" | null;
          id: string;
          idr_taxable_forgiveness: number | null;
          notes: string | null;
          pslf_tax_free_forgiveness: number | null;
          tax_year: number;
          total_interest_paid: number | null;
          user_id: string;
        };
        Insert: {
          adjusted_gross_income?: number | null;
          created_at?: string;
          deductible_interest?: number | null;
          estimated_tax_savings?: number | null;
          filing_status?: "single" | "married_joint" | "married_sep" | "head_of_household" | null;
          id?: string;
          idr_taxable_forgiveness?: number | null;
          notes?: string | null;
          pslf_tax_free_forgiveness?: number | null;
          tax_year: number;
          total_interest_paid?: number | null;
          user_id: string;
        };
        Update: {
          adjusted_gross_income?: number | null;
          deductible_interest?: number | null;
          estimated_tax_savings?: number | null;
          filing_status?: "single" | "married_joint" | "married_sep" | "head_of_household" | null;
          idr_taxable_forgiveness?: number | null;
          notes?: string | null;
          pslf_tax_free_forgiveness?: number | null;
          tax_year?: number;
          total_interest_paid?: number | null;
        };
      };
      notifications: {
        Row: {
          action_url: string | null;
          body: string;
          channel: "in_app" | "email" | "push";
          created_at: string;
          id: string;
          is_read: boolean;
          metadata: Json | null;
          notification_type:
            | "payment_due"
            | "payment_confirmed"
            | "rate_change"
            | "milestone"
            | "forgiveness_update"
            | "refinance_alert"
            | "system";
          read_at: string | null;
          title: string;
          user_id: string;
        };
        Insert: {
          action_url?: string | null;
          body: string;
          channel: "in_app" | "email" | "push";
          created_at?: string;
          id?: string;
          is_read?: boolean;
          metadata?: Json | null;
          notification_type:
            | "payment_due"
            | "payment_confirmed"
            | "rate_change"
            | "milestone"
            | "forgiveness_update"
            | "refinance_alert"
            | "system";
          read_at?: string | null;
          title: string;
          user_id: string;
        };
        Update: {
          action_url?: string | null;
          body?: string;
          channel?: "in_app" | "email" | "push";
          is_read?: boolean;
          metadata?: Json | null;
          notification_type?:
            | "payment_due"
            | "payment_confirmed"
            | "rate_change"
            | "milestone"
            | "forgiveness_update"
            | "refinance_alert"
            | "system";
          read_at?: string | null;
          title?: string;
        };
      };
      educational_content: {
        Row: {
          body: string | null;
          category: "student_loans" | "credit_cards" | "budgeting" | "forgiveness" | "investing" | "taxes";
          content_type: "article" | "video" | "guide" | "calculator_guide";
          created_at: string;
          id: string;
          is_published: boolean;
          published_at: string | null;
          reading_time_min: number | null;
          slug: string;
          summary: string | null;
          tags: string[] | null;
          title: string;
          updated_at: string;
          video_url: string | null;
        };
        Insert: {
          body?: string | null;
          category: "student_loans" | "credit_cards" | "budgeting" | "forgiveness" | "investing" | "taxes";
          content_type: "article" | "video" | "guide" | "calculator_guide";
          created_at?: string;
          id?: string;
          is_published?: boolean;
          published_at?: string | null;
          reading_time_min?: number | null;
          slug: string;
          summary?: string | null;
          tags?: string[] | null;
          title: string;
          updated_at?: string;
          video_url?: string | null;
        };
        Update: {
          body?: string | null;
          category?: "student_loans" | "credit_cards" | "budgeting" | "forgiveness" | "investing" | "taxes";
          content_type?: "article" | "video" | "guide" | "calculator_guide";
          is_published?: boolean;
          published_at?: string | null;
          reading_time_min?: number | null;
          slug?: string;
          summary?: string | null;
          tags?: string[] | null;
          title?: string;
          updated_at?: string;
          video_url?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      project_status: "Idea" | "Building" | "Launched";
    };
  };
};
