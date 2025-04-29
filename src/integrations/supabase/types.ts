export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      academic_periods: {
        Row: {
          created_at: string
          end_date: string
          id: string
          name: string
          start_date: string
        }
        Insert: {
          created_at?: string
          end_date: string
          id?: string
          name: string
          start_date: string
        }
        Update: {
          created_at?: string
          end_date?: string
          id?: string
          name?: string
          start_date?: string
        }
        Relationships: []
      }
      annual_plans: {
        Row: {
          academic_period_id: string
          created_at: string
          description: string | null
          evaluation: string
          general_content: string
          id: string
          methodology: string
          objectives: string[]
          references_materials: string[]
          subject_id: string
          title: string
          updated_at: string
        }
        Insert: {
          academic_period_id: string
          created_at?: string
          description?: string | null
          evaluation: string
          general_content: string
          id?: string
          methodology: string
          objectives?: string[]
          references_materials?: string[]
          subject_id: string
          title: string
          updated_at?: string
        }
        Update: {
          academic_period_id?: string
          created_at?: string
          description?: string | null
          evaluation?: string
          general_content?: string
          id?: string
          methodology?: string
          objectives?: string[]
          references_materials?: string[]
          subject_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "annual_plans_academic_period_id_fkey"
            columns: ["academic_period_id"]
            isOneToOne: false
            referencedRelation: "academic_periods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "annual_plans_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      assessments: {
        Row: {
          created_at: string
          date: string
          description: string | null
          due_date: string | null
          id: string
          subject_id: string
          teaching_plan_id: string | null
          title: string
          total_points: number
          type: Database["public"]["Enums"]["assessment_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          date: string
          description?: string | null
          due_date?: string | null
          id?: string
          subject_id: string
          teaching_plan_id?: string | null
          title: string
          total_points: number
          type: Database["public"]["Enums"]["assessment_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          date?: string
          description?: string | null
          due_date?: string | null
          id?: string
          subject_id?: string
          teaching_plan_id?: string | null
          title?: string
          total_points?: number
          type?: Database["public"]["Enums"]["assessment_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assessments_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "assessments_teaching_plan_id_fkey"
            columns: ["teaching_plan_id"]
            isOneToOne: false
            referencedRelation: "teaching_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      calendar_events: {
        Row: {
          all_day: boolean
          assessment_id: string | null
          color: string | null
          created_at: string
          description: string | null
          end_date: string | null
          id: string
          lesson_plan_id: string | null
          location: string | null
          start_date: string
          subject_id: string | null
          title: string
          type: Database["public"]["Enums"]["event_type"]
        }
        Insert: {
          all_day?: boolean
          assessment_id?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          lesson_plan_id?: string | null
          location?: string | null
          start_date: string
          subject_id?: string | null
          title: string
          type: Database["public"]["Enums"]["event_type"]
        }
        Update: {
          all_day?: boolean
          assessment_id?: string | null
          color?: string | null
          created_at?: string
          description?: string | null
          end_date?: string | null
          id?: string
          lesson_plan_id?: string | null
          location?: string | null
          start_date?: string
          subject_id?: string | null
          title?: string
          type?: Database["public"]["Enums"]["event_type"]
        }
        Relationships: [
          {
            foreignKeyName: "calendar_events_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_lesson_plan_id_fkey"
            columns: ["lesson_plan_id"]
            isOneToOne: false
            referencedRelation: "lesson_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calendar_events_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      lesson_plans: {
        Row: {
          activities: string[]
          contents: string[]
          created_at: string
          date: string
          duration: number
          evaluation: string | null
          homework: string | null
          id: string
          material_ids: string[] | null
          notes: string | null
          objectives: string[]
          resources: string[]
          teaching_plan_id: string
          title: string
          updated_at: string
        }
        Insert: {
          activities?: string[]
          contents?: string[]
          created_at?: string
          date: string
          duration: number
          evaluation?: string | null
          homework?: string | null
          id?: string
          material_ids?: string[] | null
          notes?: string | null
          objectives?: string[]
          resources?: string[]
          teaching_plan_id: string
          title: string
          updated_at?: string
        }
        Update: {
          activities?: string[]
          contents?: string[]
          created_at?: string
          date?: string
          duration?: number
          evaluation?: string | null
          homework?: string | null
          id?: string
          material_ids?: string[] | null
          notes?: string | null
          objectives?: string[]
          resources?: string[]
          teaching_plan_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_plans_teaching_plan_id_fkey"
            columns: ["teaching_plan_id"]
            isOneToOne: false
            referencedRelation: "teaching_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          created_at: string
          description: string | null
          file_path: string | null
          file_size: number | null
          id: string
          subject_id: string | null
          tags: string[]
          title: string
          type: Database["public"]["Enums"]["material_type"]
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          subject_id?: string | null
          tags?: string[]
          title: string
          type: Database["public"]["Enums"]["material_type"]
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          id?: string
          subject_id?: string | null
          tags?: string[]
          title?: string
          type?: Database["public"]["Enums"]["material_type"]
          updated_at?: string
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materials_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      student_assessments: {
        Row: {
          assessment_id: string
          created_at: string
          feedback: string | null
          graded_date: string | null
          id: string
          score: number
          student_id: string
          submitted_date: string | null
        }
        Insert: {
          assessment_id: string
          created_at?: string
          feedback?: string | null
          graded_date?: string | null
          id?: string
          score: number
          student_id: string
          submitted_date?: string | null
        }
        Update: {
          assessment_id?: string
          created_at?: string
          feedback?: string | null
          graded_date?: string | null
          id?: string
          score?: number
          student_id?: string
          submitted_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "student_assessments_assessment_id_fkey"
            columns: ["assessment_id"]
            isOneToOne: false
            referencedRelation: "assessments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_assessments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string
          id: string
          name: string
          registration: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          registration: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          registration?: string
        }
        Relationships: []
      }
      subjects: {
        Row: {
          academic_period_id: string
          created_at: string
          grade: string
          id: string
          name: string
        }
        Insert: {
          academic_period_id: string
          created_at?: string
          grade: string
          id?: string
          name: string
        }
        Update: {
          academic_period_id?: string
          created_at?: string
          grade?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_academic_period_id_fkey"
            columns: ["academic_period_id"]
            isOneToOne: false
            referencedRelation: "academic_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      teaching_plans: {
        Row: {
          annual_plan_id: string
          bncc_references: string[]
          contents: string[]
          created_at: string
          description: string | null
          end_date: string
          evaluation: string
          id: string
          methodology: string
          objectives: string[]
          resources: string[]
          start_date: string
          subject_id: string
          title: string
          updated_at: string
        }
        Insert: {
          annual_plan_id: string
          bncc_references?: string[]
          contents?: string[]
          created_at?: string
          description?: string | null
          end_date: string
          evaluation: string
          id?: string
          methodology: string
          objectives?: string[]
          resources?: string[]
          start_date: string
          subject_id: string
          title: string
          updated_at?: string
        }
        Update: {
          annual_plan_id?: string
          bncc_references?: string[]
          contents?: string[]
          created_at?: string
          description?: string | null
          end_date?: string
          evaluation?: string
          id?: string
          methodology?: string
          objectives?: string[]
          resources?: string[]
          start_date?: string
          subject_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "teaching_plans_annual_plan_id_fkey"
            columns: ["annual_plan_id"]
            isOneToOne: false
            referencedRelation: "annual_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "teaching_plans_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      assessment_type: "diagnostic" | "formative" | "summative"
      event_type: "class" | "exam" | "meeting" | "deadline" | "other"
      material_type: "document" | "video" | "link" | "image" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      assessment_type: ["diagnostic", "formative", "summative"],
      event_type: ["class", "exam", "meeting", "deadline", "other"],
      material_type: ["document", "video", "link", "image", "other"],
    },
  },
} as const
