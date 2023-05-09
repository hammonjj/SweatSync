export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      "SweatSync.Activities": {
        Row: {
          created_at: string | null
          data: Json | null
          date: string
          id: number
          plannedData: Json | null
          title: string
          type: string
          user: string
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          date: string
          id?: number
          plannedData?: Json | null
          title: string
          type: string
          user: string
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          date?: string
          id?: number
          plannedData?: Json | null
          title?: string
          type?: string
          user?: string
        }
      }
      "SweatSync.ActivityTemplates": {
        Row: {
          created_at: string
          id: number
          plannedData: Json
          title: string
          type: string
          user: string
        }
        Insert: {
          created_at?: string
          id?: number
          plannedData: Json
          title: string
          type: string
          user: string
        }
        Update: {
          created_at?: string
          id?: number
          plannedData?: Json
          title?: string
          type?: string
          user?: string
        }
      }
      "SweatSync.Exercises": {
        Row: {
          created_at: string
          created_by: string
          date: string
          id: number
          name: string
          type: string
        }
        Insert: {
          created_at?: string
          created_by: string
          date?: string
          id?: number
          name: string
          type: string
        }
        Update: {
          created_at?: string
          created_by?: string
          date?: string
          id?: number
          name?: string
          type?: string
        }
      }
      "SweatSync.Metrics": {
        Row: {
          created_at: string | null
          date: string
          id: number
          type: string
          unit: string
          user: string
          value: number
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: number
          type: string
          unit: string
          user: string
          value: number
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: number
          type?: string
          unit?: string
          user?: string
          value?: number
        }
      }
      "SweatSync.PreviousLifts": {
        Row: {
          data: Json
          date: string
          id: number
          name: string
          user: string
        }
        Insert: {
          data: Json
          date?: string
          id?: number
          name: string
          user: string
        }
        Update: {
          data?: Json
          date?: string
          id?: number
          name?: string
          user?: string
        }
      }
      "SweatSync.WorkoutTemplates": {
        Row: {
          created_at: string | null
          created_by: string
          id: number
          name: string
          type: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id?: number
          name: string
          type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: number
          name?: string
          type?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
