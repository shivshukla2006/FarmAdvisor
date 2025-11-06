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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      community_posts: {
        Row: {
          category: string
          content: string
          created_at: string
          downvotes: number | null
          id: string
          images: string[] | null
          tags: string[] | null
          title: string
          updated_at: string
          upvotes: number | null
          user_id: string
          view_count: number | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          downvotes?: number | null
          id?: string
          images?: string[] | null
          tags?: string[] | null
          title: string
          updated_at?: string
          upvotes?: number | null
          user_id: string
          view_count?: number | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          downvotes?: number | null
          id?: string
          images?: string[] | null
          tags?: string[] | null
          title?: string
          updated_at?: string
          upvotes?: number | null
          user_id?: string
          view_count?: number | null
        }
        Relationships: []
      }
      community_replies: {
        Row: {
          content: string
          created_at: string
          downvotes: number | null
          id: string
          post_id: string
          updated_at: string
          upvotes: number | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          downvotes?: number | null
          id?: string
          post_id: string
          updated_at?: string
          upvotes?: number | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          downvotes?: number | null
          id?: string
          post_id?: string
          updated_at?: string
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_replies_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      crop_recommendations: {
        Row: {
          created_at: string
          id: string
          latitude: number | null
          location: string
          longitude: number | null
          preferences: string[] | null
          recommendations: Json
          season: string
          soil_type: string
          status: Database["public"]["Enums"]["recommendation_status"] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          latitude?: number | null
          location: string
          longitude?: number | null
          preferences?: string[] | null
          recommendations: Json
          season: string
          soil_type: string
          status?: Database["public"]["Enums"]["recommendation_status"] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          latitude?: number | null
          location?: string
          longitude?: number | null
          preferences?: string[] | null
          recommendations?: Json
          season?: string
          soil_type?: string
          status?: Database["public"]["Enums"]["recommendation_status"] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      government_schemes: {
        Row: {
          active: boolean | null
          application_link: string | null
          application_process: string | null
          benefits: string
          contact_info: Json | null
          created_at: string
          crop_types: string[] | null
          deadline: string | null
          description: string
          documents_required: string[] | null
          eligibility: string
          id: string
          scheme_type: string | null
          state: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          application_link?: string | null
          application_process?: string | null
          benefits: string
          contact_info?: Json | null
          created_at?: string
          crop_types?: string[] | null
          deadline?: string | null
          description: string
          documents_required?: string[] | null
          eligibility: string
          id?: string
          scheme_type?: string | null
          state?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          application_link?: string | null
          application_process?: string | null
          benefits?: string
          contact_info?: Json | null
          created_at?: string
          crop_types?: string[] | null
          deadline?: string | null
          description?: string
          documents_required?: string[] | null
          eligibility?: string
          id?: string
          scheme_type?: string | null
          state?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      pest_diagnoses: {
        Row: {
          created_at: string
          crop_type: string | null
          diagnosis_result: Json | null
          id: string
          image_url: string
          pest_identified: string | null
          severity: string | null
          status: Database["public"]["Enums"]["diagnosis_status"] | null
          treatment_recommendations: string[] | null
          updated_at: string
          user_feedback: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          crop_type?: string | null
          diagnosis_result?: Json | null
          id?: string
          image_url: string
          pest_identified?: string | null
          severity?: string | null
          status?: Database["public"]["Enums"]["diagnosis_status"] | null
          treatment_recommendations?: string[] | null
          updated_at?: string
          user_feedback?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          crop_type?: string | null
          diagnosis_result?: Json | null
          id?: string
          image_url?: string
          pest_identified?: string | null
          severity?: string | null
          status?: Database["public"]["Enums"]["diagnosis_status"] | null
          treatment_recommendations?: string[] | null
          updated_at?: string
          user_feedback?: string | null
          user_id?: string
        }
        Relationships: []
      }
      post_votes: {
        Row: {
          created_at: string
          id: string
          post_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          farm_location: string | null
          farm_size: string | null
          full_name: string
          id: string
          language: string | null
          notifications_community: boolean | null
          notifications_schemes: boolean | null
          notifications_weather: boolean | null
          phone: string | null
          primary_crops: string[] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          farm_location?: string | null
          farm_size?: string | null
          full_name: string
          id: string
          language?: string | null
          notifications_community?: boolean | null
          notifications_schemes?: boolean | null
          notifications_weather?: boolean | null
          phone?: string | null
          primary_crops?: string[] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          farm_location?: string | null
          farm_size?: string | null
          full_name?: string
          id?: string
          language?: string | null
          notifications_community?: boolean | null
          notifications_schemes?: boolean | null
          notifications_weather?: boolean | null
          phone?: string | null
          primary_crops?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      reply_votes: {
        Row: {
          created_at: string
          id: string
          reply_id: string
          user_id: string
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          reply_id: string
          user_id: string
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          reply_id?: string
          user_id?: string
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "reply_votes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "community_replies"
            referencedColumns: ["id"]
          },
        ]
      }
      scheme_bookmarks: {
        Row: {
          application_status: string | null
          created_at: string
          id: string
          notes: string | null
          scheme_id: string
          user_id: string
        }
        Insert: {
          application_status?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          scheme_id: string
          user_id: string
        }
        Update: {
          application_status?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          scheme_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "scheme_bookmarks_scheme_id_fkey"
            columns: ["scheme_id"]
            isOneToOne: false
            referencedRelation: "government_schemes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          title: string
          user_id: string
        }
        Insert: {
          activity_type: Database["public"]["Enums"]["activity_type"]
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          title: string
          user_id: string
        }
        Update: {
          activity_type?: Database["public"]["Enums"]["activity_type"]
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weather_alerts: {
        Row: {
          affected_regions: string[] | null
          alert_type: string
          created_at: string
          description: string
          end_time: string | null
          id: string
          location: string
          severity: Database["public"]["Enums"]["alert_severity"]
          start_time: string
          title: string
        }
        Insert: {
          affected_regions?: string[] | null
          alert_type: string
          created_at?: string
          description: string
          end_time?: string | null
          id?: string
          location: string
          severity: Database["public"]["Enums"]["alert_severity"]
          start_time: string
          title: string
        }
        Update: {
          affected_regions?: string[] | null
          alert_type?: string
          created_at?: string
          description?: string
          end_time?: string | null
          id?: string
          location?: string
          severity?: Database["public"]["Enums"]["alert_severity"]
          start_time?: string
          title?: string
        }
        Relationships: []
      }
    }
    Views: {
      post_vote_counts: {
        Row: {
          downvote_count: number | null
          post_id: string | null
          total_votes: number | null
          upvote_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "post_votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      reply_vote_counts: {
        Row: {
          downvote_count: number | null
          reply_id: string | null
          total_votes: number | null
          upvote_count: number | null
        }
        Relationships: [
          {
            foreignKeyName: "reply_votes_reply_id_fkey"
            columns: ["reply_id"]
            isOneToOne: false
            referencedRelation: "community_replies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      can_access_profile: { Args: { profile_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      activity_type:
        | "recommendation"
        | "diagnosis"
        | "forum_post"
        | "scheme_bookmark"
      alert_severity: "info" | "warning" | "critical"
      app_role: "admin" | "moderator" | "user"
      diagnosis_status: "pending" | "completed" | "reviewed"
      recommendation_status: "pending" | "completed" | "saved"
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
      activity_type: [
        "recommendation",
        "diagnosis",
        "forum_post",
        "scheme_bookmark",
      ],
      alert_severity: ["info", "warning", "critical"],
      app_role: ["admin", "moderator", "user"],
      diagnosis_status: ["pending", "completed", "reviewed"],
      recommendation_status: ["pending", "completed", "saved"],
    },
  },
} as const
