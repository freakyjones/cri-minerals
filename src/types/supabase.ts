export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      countries: {
        Row: {
          compliance_status:
            | Database["public"]["Enums"]["compliance_status_type"]
            | null
          compliance_tags: string[] | null
          created_at: string | null
          id: string
          iso_code: string
          name: string
          updated_at: string | null
        }
        Insert: {
          compliance_status?:
            | Database["public"]["Enums"]["compliance_status_type"]
            | null
          compliance_tags?: string[] | null
          created_at?: string | null
          id?: string
          iso_code: string
          name: string
          updated_at?: string | null
        }
        Update: {
          compliance_status?:
            | Database["public"]["Enums"]["compliance_status_type"]
            | null
          compliance_tags?: string[] | null
          created_at?: string | null
          id?: string
          iso_code?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      market_alerts: {
        Row: {
          affected_minerals: string[] | null
          blast_radius: Json | null
          confidence_score: number | null
          created_at: string
          description: string
          disruption_multiplier: number | null
          embedding: string | null
          id: string
          rationale: string[] | null
          severity: Database["public"]["Enums"]["severity_level"]
          status: Database["public"]["Enums"]["alert_status"]
          title: string
        }
        Insert: {
          affected_minerals?: string[] | null
          blast_radius?: Json | null
          confidence_score?: number | null
          created_at?: string
          description: string
          disruption_multiplier?: number | null
          embedding?: string | null
          id?: string
          rationale?: string[] | null
          severity: Database["public"]["Enums"]["severity_level"]
          status?: Database["public"]["Enums"]["alert_status"]
          title: string
        }
        Update: {
          affected_minerals?: string[] | null
          blast_radius?: Json | null
          confidence_score?: number | null
          created_at?: string
          description?: string
          disruption_multiplier?: number | null
          embedding?: string | null
          id?: string
          rationale?: string[] | null
          severity?: Database["public"]["Enums"]["severity_level"]
          status?: Database["public"]["Enums"]["alert_status"]
          title?: string
        }
        Relationships: []
      }
      mineral_choke_points: {
        Row: {
          affected_countries: string[]
          description: string
          id: string
          mineral_id: string
          severity: string
          title: string
        }
        Insert: {
          affected_countries: string[]
          description: string
          id?: string
          mineral_id: string
          severity: string
          title: string
        }
        Update: {
          affected_countries?: string[]
          description?: string
          id?: string
          mineral_id?: string
          severity?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "mineral_choke_points_mineral_id_fkey"
            columns: ["mineral_id"]
            isOneToOne: false
            referencedRelation: "minerals"
            referencedColumns: ["id"]
          },
        ]
      }
      mineral_data_sources: {
        Row: {
          id: string
          label: string
          mineral_id: string
          url: string
        }
        Insert: {
          id?: string
          label: string
          mineral_id: string
          url: string
        }
        Update: {
          id?: string
          label?: string
          mineral_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "mineral_data_sources_mineral_id_fkey"
            columns: ["mineral_id"]
            isOneToOne: false
            referencedRelation: "minerals"
            referencedColumns: ["id"]
          },
        ]
      }
      mineral_esg_risks: {
        Row: {
          category: string
          country: string
          id: string
          mineral_id: string
          severity: string
          summary: string
        }
        Insert: {
          category: string
          country: string
          id?: string
          mineral_id: string
          severity: string
          summary: string
        }
        Update: {
          category?: string
          country?: string
          id?: string
          mineral_id?: string
          severity?: string
          summary?: string
        }
        Relationships: [
          {
            foreignKeyName: "mineral_esg_risks_mineral_id_fkey"
            columns: ["mineral_id"]
            isOneToOne: false
            referencedRelation: "minerals"
            referencedColumns: ["id"]
          },
        ]
      }
      mineral_production: {
        Row: {
          amount_mt: number | null
          country: string
          id: string
          mineral_id: string
          share: number
        }
        Insert: {
          amount_mt?: number | null
          country: string
          id?: string
          mineral_id: string
          share: number
        }
        Update: {
          amount_mt?: number | null
          country?: string
          id?: string
          mineral_id?: string
          share?: number
        }
        Relationships: [
          {
            foreignKeyName: "mineral_production_mineral_id_fkey"
            columns: ["mineral_id"]
            isOneToOne: false
            referencedRelation: "minerals"
            referencedColumns: ["id"]
          },
        ]
      }
      mineral_refining: {
        Row: {
          country: string
          id: string
          mineral_id: string
          share: number
        }
        Insert: {
          country: string
          id?: string
          mineral_id: string
          share: number
        }
        Update: {
          country?: string
          id?: string
          mineral_id?: string
          share?: number
        }
        Relationships: [
          {
            foreignKeyName: "mineral_refining_mineral_id_fkey"
            columns: ["mineral_id"]
            isOneToOne: false
            referencedRelation: "minerals"
            referencedColumns: ["id"]
          },
        ]
      }
      mineral_reserves: {
        Row: {
          amount_mt: number | null
          country: string
          id: string
          mineral_id: string
          share: number
        }
        Insert: {
          amount_mt?: number | null
          country: string
          id?: string
          mineral_id: string
          share: number
        }
        Update: {
          amount_mt?: number | null
          country?: string
          id?: string
          mineral_id?: string
          share?: number
        }
        Relationships: [
          {
            foreignKeyName: "mineral_reserves_mineral_id_fkey"
            columns: ["mineral_id"]
            isOneToOne: false
            referencedRelation: "minerals"
            referencedColumns: ["id"]
          },
        ]
      }
      mineral_timeline: {
        Row: {
          event: string
          id: string
          impact: string
          mineral_id: string
          year: number
        }
        Insert: {
          event: string
          id?: string
          impact: string
          mineral_id: string
          year: number
        }
        Update: {
          event?: string
          id?: string
          impact?: string
          mineral_id?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "mineral_timeline_mineral_id_fkey"
            columns: ["mineral_id"]
            isOneToOne: false
            referencedRelation: "minerals"
            referencedColumns: ["id"]
          },
        ]
      }
      mineral_use_cases: {
        Row: {
          id: string
          label: string
          mineral_id: string
          share: number
        }
        Insert: {
          id?: string
          label: string
          mineral_id: string
          share: number
        }
        Update: {
          id?: string
          label?: string
          mineral_id?: string
          share?: number
        }
        Relationships: [
          {
            foreignKeyName: "mineral_use_cases_mineral_id_fkey"
            columns: ["mineral_id"]
            isOneToOne: false
            referencedRelation: "minerals"
            referencedColumns: ["id"]
          },
        ]
      }
      minerals: {
        Row: {
          annual_production_mt: number | null
          atomic_number: number
          category: string
          color: string
          current_price_usd: number | null
          global_reserves_mt: number | null
          id: string
          last_usgs_sync: string | null
          name: string
          recycling_rate: number
          recycling_sources: string[]
          risk_score: string
          slug: string
          substitutability: string
          substitute_mineral: string | null
          symbol: string
          tagline: string
        }
        Insert: {
          annual_production_mt?: number | null
          atomic_number: number
          category: string
          color: string
          current_price_usd?: number | null
          global_reserves_mt?: number | null
          id?: string
          last_usgs_sync?: string | null
          name: string
          recycling_rate: number
          recycling_sources: string[]
          risk_score: string
          slug: string
          substitutability: string
          substitute_mineral?: string | null
          symbol: string
          tagline: string
        }
        Update: {
          annual_production_mt?: number | null
          atomic_number?: number
          category?: string
          color?: string
          current_price_usd?: number | null
          global_reserves_mt?: number | null
          id?: string
          last_usgs_sync?: string | null
          name?: string
          recycling_rate?: number
          recycling_sources?: string[]
          risk_score?: string
          slug?: string
          substitutability?: string
          substitute_mineral?: string | null
          symbol?: string
          tagline?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          full_name: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          full_name?: string | null
          id: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          full_name?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      match_alerts: {
        Args: {
          match_count: number
          match_threshold: number
          query_embedding: string
        }
        Returns: {
          affected_minerals: string[]
          created_at: string
          description: string
          id: string
          severity: string
          similarity: number
          status: string
          title: string
        }[]
      }
      sync_usgs_mineral_data: { Args: { payload: Json }; Returns: undefined }
    }
    Enums: {
      alert_status: "DRAFT" | "PUBLISHED"
      compliance_status_type: "FEOC" | "FTA" | "NEUTRAL"
      severity_level: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
      user_role: "user" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      alert_status: ["DRAFT", "PUBLISHED"],
      compliance_status_type: ["FEOC", "FTA", "NEUTRAL"],
      severity_level: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
      user_role: ["user", "admin"],
    },
  },
} as const
