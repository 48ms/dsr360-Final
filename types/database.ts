export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      competitors: {
        Row: {
          brand: string
          category: string | null
          created_at: string
          id: string
          is_active: boolean
          notes: string | null
          product_name: string | null
          updated_at: string
        }
        Insert: {
          brand: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          product_name?: string | null
          updated_at?: string
        }
        Update: {
          brand?: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          notes?: string | null
          product_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      customer_contacts: {
        Row: {
          contact_type: Database["public"]["Enums"]["contact_type"]
          created_at: string
          customer_id: string
          decision_power: Database["public"]["Enums"]["decision_power"]
          department: string | null
          email: string | null
          id: string
          influence_level: Database["public"]["Enums"]["influence_level"]
          is_primary: boolean
          name: string
          notes: string | null
          phone: string | null
          position: string | null
          updated_at: string
        }
        Insert: {
          contact_type?: Database["public"]["Enums"]["contact_type"]
          created_at?: string
          customer_id: string
          decision_power?: Database["public"]["Enums"]["decision_power"]
          department?: string | null
          email?: string | null
          id?: string
          influence_level?: Database["public"]["Enums"]["influence_level"]
          is_primary?: boolean
          name: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          updated_at?: string
        }
        Update: {
          contact_type?: Database["public"]["Enums"]["contact_type"]
          created_at?: string
          customer_id?: string
          decision_power?: Database["public"]["Enums"]["decision_power"]
          department?: string | null
          email?: string | null
          id?: string
          influence_level?: Database["public"]["Enums"]["influence_level"]
          is_primary?: boolean
          name?: string
          notes?: string | null
          phone?: string | null
          position?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_contacts_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_equipment: {
        Row: {
          application: string | null
          brand: string | null
          created_at: string
          current_brand: string | null
          current_product: string | null
          current_viscosity: string | null
          customer_id: string
          drain_interval: string | null
          equipment_type: string
          id: string
          model: string | null
          notes: string | null
          oil_capacity: number | null
          operating_condition: string | null
          quantity: number | null
          updated_at: string
        }
        Insert: {
          application?: string | null
          brand?: string | null
          created_at?: string
          current_brand?: string | null
          current_product?: string | null
          current_viscosity?: string | null
          customer_id: string
          drain_interval?: string | null
          equipment_type: string
          id?: string
          model?: string | null
          notes?: string | null
          oil_capacity?: number | null
          operating_condition?: string | null
          quantity?: number | null
          updated_at?: string
        }
        Update: {
          application?: string | null
          brand?: string | null
          created_at?: string
          current_brand?: string | null
          current_product?: string | null
          current_viscosity?: string | null
          customer_id?: string
          drain_interval?: string | null
          equipment_type?: string
          id?: string
          model?: string | null
          notes?: string | null
          oil_capacity?: number | null
          operating_condition?: string | null
          quantity?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customer_equipment_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_products: {
        Row: {
          brand: string
          category: string | null
          created_at: string
          customer_id: string
          id: string
          monthly_volume: number | null
          notes: string | null
          product_name: string
          status: Database["public"]["Enums"]["customer_product_status"]
          updated_at: string
          usage_application: string | null
          viscosity: string | null
        }
        Insert: {
          brand: string
          category?: string | null
          created_at?: string
          customer_id: string
          id?: string
          monthly_volume?: number | null
          notes?: string | null
          product_name: string
          status?: Database["public"]["Enums"]["customer_product_status"]
          updated_at?: string
          usage_application?: string | null
          viscosity?: string | null
        }
        Update: {
          brand?: string
          category?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          monthly_volume?: number | null
          notes?: string | null
          product_name?: string
          status?: Database["public"]["Enums"]["customer_product_status"]
          updated_at?: string
          usage_application?: string | null
          viscosity?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_products_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          address: string | null
          city: string | null
          created_at: string
          created_by: string
          customer_code: string
          customer_name: string
          estimated_monthly_volume: number | null
          id: string
          industry: string | null
          latitude: number | null
          longitude: number | null
          notes: string | null
          owner_id: string
          payment_term_days: number | null
          potential_monthly_volume: number | null
          priority: Database["public"]["Enums"]["customer_priority"]
          province: string | null
          segment: Database["public"]["Enums"]["customer_segment"]
          status: Database["public"]["Enums"]["customer_status"]
          updated_at: string
        }
        Insert: {
          address?: string | null
          city?: string | null
          created_at?: string
          created_by: string
          customer_code?: string
          customer_name: string
          estimated_monthly_volume?: number | null
          id?: string
          industry?: string | null
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          owner_id: string
          payment_term_days?: number | null
          potential_monthly_volume?: number | null
          priority?: Database["public"]["Enums"]["customer_priority"]
          province?: string | null
          segment: Database["public"]["Enums"]["customer_segment"]
          status?: Database["public"]["Enums"]["customer_status"]
          updated_at?: string
        }
        Update: {
          address?: string | null
          city?: string | null
          created_at?: string
          created_by?: string
          customer_code?: string
          customer_name?: string
          estimated_monthly_volume?: number | null
          id?: string
          industry?: string | null
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          owner_id?: string
          payment_term_days?: number | null
          potential_monthly_volume?: number | null
          priority?: Database["public"]["Enums"]["customer_priority"]
          province?: string | null
          segment?: Database["public"]["Enums"]["customer_segment"]
          status?: Database["public"]["Enums"]["customer_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "customers_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "customers_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      follow_ups: {
        Row: {
          activity_type: Database["public"]["Enums"]["follow_up_activity_type"]
          completed_at: string | null
          created_at: string
          customer_id: string
          description: string | null
          due_date: string
          id: string
          opportunity_id: string | null
          priority: Database["public"]["Enums"]["follow_up_priority"]
          result: string | null
          status: Database["public"]["Enums"]["follow_up_status"]
          updated_at: string
          user_id: string
          visit_id: string | null
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["follow_up_activity_type"]
          completed_at?: string | null
          created_at?: string
          customer_id: string
          description?: string | null
          due_date: string
          id?: string
          opportunity_id?: string | null
          priority?: Database["public"]["Enums"]["follow_up_priority"]
          result?: string | null
          status?: Database["public"]["Enums"]["follow_up_status"]
          updated_at?: string
          user_id: string
          visit_id?: string | null
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["follow_up_activity_type"]
          completed_at?: string | null
          created_at?: string
          customer_id?: string
          description?: string | null
          due_date?: string
          id?: string
          opportunity_id?: string | null
          priority?: Database["public"]["Enums"]["follow_up_priority"]
          result?: string | null
          status?: Database["public"]["Enums"]["follow_up_status"]
          updated_at?: string
          user_id?: string
          visit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follow_ups_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_ups_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_ups_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follow_ups_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunities: {
        Row: {
          competitor_id: string | null
          created_at: string
          created_by: string
          customer_id: string
          customer_need: string | null
          expected_close_date: string | null
          id: string
          next_action: string | null
          next_action_date: string | null
          objection: string | null
          opportunity_name: string
          potential_value: number | null
          potential_volume: number | null
          probability: number | null
          product_id: string | null
          stage: Database["public"]["Enums"]["opportunity_stage"]
          status: string | null
          updated_at: string
          visit_id: string | null
        }
        Insert: {
          competitor_id?: string | null
          created_at?: string
          created_by: string
          customer_id: string
          customer_need?: string | null
          expected_close_date?: string | null
          id?: string
          next_action?: string | null
          next_action_date?: string | null
          objection?: string | null
          opportunity_name: string
          potential_value?: number | null
          potential_volume?: number | null
          probability?: number | null
          product_id?: string | null
          stage?: Database["public"]["Enums"]["opportunity_stage"]
          status?: string | null
          updated_at?: string
          visit_id?: string | null
        }
        Update: {
          competitor_id?: string | null
          created_at?: string
          created_by?: string
          customer_id?: string
          customer_need?: string | null
          expected_close_date?: string | null
          id?: string
          next_action?: string | null
          next_action_date?: string | null
          objection?: string | null
          opportunity_name?: string
          potential_value?: number | null
          potential_volume?: number | null
          probability?: number | null
          product_id?: string | null
          stage?: Database["public"]["Enums"]["opportunity_stage"]
          status?: string | null
          updated_at?: string
          visit_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          application: string | null
          brand: string
          category: string | null
          created_at: string
          id: string
          is_active: boolean
          packaging: string | null
          packaging_size: number | null
          product_name: string
          updated_at: string
          viscosity: string | null
        }
        Insert: {
          application?: string | null
          brand: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          packaging?: string | null
          packaging_size?: number | null
          product_name: string
          updated_at?: string
          viscosity?: string | null
        }
        Update: {
          application?: string | null
          brand?: string
          category?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          packaging?: string | null
          packaging_size?: number | null
          product_name?: string
          updated_at?: string
          viscosity?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          annual_quota_liter: number | null
          created_at: string
          full_name: string
          id: string
          is_active: boolean
          monthly_quota_liter: number | null
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          sales_area: string | null
          updated_at: string
        }
        Insert: {
          annual_quota_liter?: number | null
          created_at?: string
          full_name: string
          id: string
          is_active?: boolean
          monthly_quota_liter?: number | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          sales_area?: string | null
          updated_at?: string
        }
        Update: {
          annual_quota_liter?: number | null
          created_at?: string
          full_name?: string
          id?: string
          is_active?: boolean
          monthly_quota_liter?: number | null
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          sales_area?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      visit_photos: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          photo_type: Database["public"]["Enums"]["photo_type"]
          photo_url: string
          visit_id: string
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          photo_type?: Database["public"]["Enums"]["photo_type"]
          photo_url: string
          visit_id: string
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          photo_type?: Database["public"]["Enums"]["photo_type"]
          photo_url?: string
          visit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visit_photos_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: false
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      visit_popsas: {
        Row: {
          anticipate: string | null
          created_at: string
          id: string
          objective: string | null
          premises: string | null
          purpose: string | null
          strategy: string | null
          updated_at: string
          visit_id: string
        }
        Insert: {
          anticipate?: string | null
          created_at?: string
          id?: string
          objective?: string | null
          premises?: string | null
          purpose?: string | null
          strategy?: string | null
          updated_at?: string
          visit_id: string
        }
        Update: {
          anticipate?: string | null
          created_at?: string
          id?: string
          objective?: string | null
          premises?: string | null
          purpose?: string | null
          strategy?: string | null
          updated_at?: string
          visit_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "visit_popsas_visit_id_fkey"
            columns: ["visit_id"]
            isOneToOne: true
            referencedRelation: "visits"
            referencedColumns: ["id"]
          },
        ]
      }
      visits: {
        Row: {
          competitor_id: string | null
          created_at: string
          customer_condition: string | null
          customer_id: string
          customer_response:
            | Database["public"]["Enums"]["customer_response"]
            | null
          discussion: string | null
          duration_minutes: number | null
          end_time: string | null
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          opportunity_found: boolean
          potential_volume: number | null
          purpose: string | null
          start_time: string | null
          technical_issue: string | null
          updated_at: string
          user_id: string
          visit_date: string
          visit_status: Database["public"]["Enums"]["visit_status"]
          visit_type: Database["public"]["Enums"]["visit_type"]
        }
        Insert: {
          competitor_id?: string | null
          created_at?: string
          customer_condition?: string | null
          customer_id: string
          customer_response?:
            | Database["public"]["Enums"]["customer_response"]
            | null
          discussion?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          opportunity_found?: boolean
          potential_volume?: number | null
          purpose?: string | null
          start_time?: string | null
          technical_issue?: string | null
          updated_at?: string
          user_id: string
          visit_date: string
          visit_status?: Database["public"]["Enums"]["visit_status"]
          visit_type: Database["public"]["Enums"]["visit_type"]
        }
        Update: {
          competitor_id?: string | null
          created_at?: string
          customer_condition?: string | null
          customer_id?: string
          customer_response?:
            | Database["public"]["Enums"]["customer_response"]
            | null
          discussion?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          opportunity_found?: boolean
          potential_volume?: number | null
          purpose?: string | null
          start_time?: string | null
          technical_issue?: string | null
          updated_at?: string
          user_id?: string
          visit_date?: string
          visit_status?: Database["public"]["Enums"]["visit_status"]
          visit_type?: Database["public"]["Enums"]["visit_type"]
        }
        Relationships: [
          {
            foreignKeyName: "visits_competitor_id_fkey"
            columns: ["competitor_id"]
            isOneToOne: false
            referencedRelation: "competitors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visits_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_customer: { Args: { customer_uuid: string }; Returns: boolean }
      can_access_visit: { Args: { visit_uuid: string }; Returns: boolean }
      find_similar_customers: {
        Args: { p_name: string }
        Returns: {
          city: string
          customer_name: string
          id: string
          owner_name: string
          segment: Database["public"]["Enums"]["customer_segment"]
          similarity_score: number
        }[]
      }
      generate_customer_code: { Args: Record<string, never>; Returns: string }
    }
    Enums: {
      contact_type:
        | "PURCHASING"
        | "MAINTENANCE"
        | "USER"
        | "OWNER"
        | "MANAGER"
        | "FINANCE"
        | "OTHER"
      customer_priority: "A" | "B" | "C"
      customer_product_status: "CURRENT" | "TRIAL" | "PROPOSED" | "REJECTED"
      customer_response:
        | "INTERESTED"
        | "CONSIDERING"
        | "NEUTRAL"
        | "NOT_INTERESTED"
      customer_segment:
        | "FLEET"
        | "TRANSPORT"
        | "MANUFACTURING"
        | "CONSTRUCTION"
        | "MINING"
        | "WORKSHOP"
        | "DISTRIBUTOR"
        | "RESELLER"
        | "AGRICULTURE"
        | "MARINE"
        | "OTHER"
      customer_status: "PROSPECT" | "ACTIVE" | "DORMANT" | "INACTIVE" | "LOST"
      decision_power: "NONE" | "INFLUENCER" | "DECISION_MAKER"
      follow_up_activity_type:
        | "CALL"
        | "WHATSAPP"
        | "EMAIL"
        | "VISIT"
        | "SEND_QUOTATION"
        | "SEND_SAMPLE"
        | "TRIAL_FOLLOWUP"
        | "TECHNICAL_FOLLOWUP"
        | "COLLECTION"
        | "OTHER"
      follow_up_priority: "LOW" | "MEDIUM" | "HIGH"
      follow_up_status: "PENDING" | "COMPLETED" | "CANCELLED"
      influence_level: "LOW" | "MEDIUM" | "HIGH"
      opportunity_stage:
        | "PROSPECT"
        | "QUALIFIED"
        | "PRESENTATION"
        | "TRIAL"
        | "QUOTATION"
        | "NEGOTIATION"
        | "WON"
        | "LOST"
      photo_type:
        | "CUSTOMER"
        | "EQUIPMENT"
        | "EXISTING_PRODUCT"
        | "NAMEPLATE"
        | "WORKSHOP"
        | "DOCUMENT"
        | "OTHER"
      user_role: "DSR" | "SPV" | "MANAGER" | "ADMIN"
      visit_status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
      visit_type:
        | "PROSPECTING"
        | "FOLLOW_UP"
        | "ROUTINE"
        | "PRESENTATION"
        | "TRIAL"
        | "NEGOTIATION"
        | "COMPLAINT"
        | "TECHNICAL"
        | "COLLECTION"
        | "RELATIONSHIP"
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
