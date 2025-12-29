export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5";
  };
  public: {
    Tables: {
      achievements: {
        Row: {
          category: string | null;
          code: string | null;
          created_at: string;
          description: string;
          icon: string;
          id: string;
          rarity: string | null;
          sort_order: number | null;
          title: string;
          total_steps: number | null;
          xp_reward: number | null;
        };
        Insert: {
          category?: string | null;
          code?: string | null;
          created_at?: string;
          description: string;
          icon: string;
          id?: string;
          rarity?: string | null;
          sort_order?: number | null;
          title: string;
          total_steps?: number | null;
          xp_reward?: number | null;
        };
        Update: {
          category?: string | null;
          code?: string | null;
          created_at?: string;
          description?: string;
          icon?: string;
          id?: string;
          rarity?: string | null;
          sort_order?: number | null;
          title?: string;
          total_steps?: number | null;
          xp_reward?: number | null;
        };
        Relationships: [];
      };
      collections: {
        Row: {
          created_at: string | null;
          id: string;
          is_public: boolean | null;
          name: string;
          owner_id: string;
          parent_id: string | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          is_public?: boolean | null;
          name: string;
          owner_id: string;
          parent_id?: string | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          is_public?: boolean | null;
          name?: string;
          owner_id?: string;
          parent_id?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "collections_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "collections_parent_id_fkey";
            columns: ["parent_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
        ];
      };
      decks: {
        Row: {
          collection_id: string | null;
          created_at: string | null;
          description: string | null;
          failure_reason: string | null;
          generation_params: Json | null;
          id: string;
          mastery_percentage: number | null;
          owner_id: string;
          settings: Json | null;
          source_content: string | null;
          source_type: string | null;
          status: Database["public"]["Enums"]["deck_status"] | null;
          title: string;
          updated_at: string | null;
          visibility: Database["public"]["Enums"]["deck_visibility"] | null;
        };
        Insert: {
          collection_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          failure_reason?: string | null;
          generation_params?: Json | null;
          id?: string;
          mastery_percentage?: number | null;
          owner_id: string;
          settings?: Json | null;
          source_content?: string | null;
          source_type?: string | null;
          status?: Database["public"]["Enums"]["deck_status"] | null;
          title: string;
          updated_at?: string | null;
          visibility?: Database["public"]["Enums"]["deck_visibility"] | null;
        };
        Update: {
          collection_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          failure_reason?: string | null;
          generation_params?: Json | null;
          id?: string;
          mastery_percentage?: number | null;
          owner_id?: string;
          settings?: Json | null;
          source_content?: string | null;
          source_type?: string | null;
          status?: Database["public"]["Enums"]["deck_status"] | null;
          title?: string;
          updated_at?: string | null;
          visibility?: Database["public"]["Enums"]["deck_visibility"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "decks_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "decks_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      flashcard_reviews: {
        Row: {
          ease_factor: number | null;
          flashcard_id: string;
          id: string;
          interval: number | null;
          last_reviewed: string | null;
          next_review: string | null;
          repetition_count: number | null;
          status: Database["public"]["Enums"]["flashcard_status"] | null;
          user_id: string;
        };
        Insert: {
          ease_factor?: number | null;
          flashcard_id: string;
          id?: string;
          interval?: number | null;
          last_reviewed?: string | null;
          next_review?: string | null;
          repetition_count?: number | null;
          status?: Database["public"]["Enums"]["flashcard_status"] | null;
          user_id: string;
        };
        Update: {
          ease_factor?: number | null;
          flashcard_id?: string;
          id?: string;
          interval?: number | null;
          last_reviewed?: string | null;
          next_review?: string | null;
          repetition_count?: number | null;
          status?: Database["public"]["Enums"]["flashcard_status"] | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "flashcard_reviews_flashcard_id_fkey";
            columns: ["flashcard_id"];
            isOneToOne: false;
            referencedRelation: "flashcards";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "flashcard_reviews_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      flashcards: {
        Row: {
          back: string;
          created_at: string | null;
          deck_id: string;
          front: string;
          id: string;
          image_url: string | null;
          order_index: number | null;
        };
        Insert: {
          back: string;
          created_at?: string | null;
          deck_id: string;
          front: string;
          id?: string;
          image_url?: string | null;
          order_index?: number | null;
        };
        Update: {
          back?: string;
          created_at?: string | null;
          deck_id?: string;
          front?: string;
          id?: string;
          image_url?: string | null;
          order_index?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "flashcards_deck_id_fkey";
            columns: ["deck_id"];
            isOneToOne: false;
            referencedRelation: "decks";
            referencedColumns: ["id"];
          },
        ];
      };
      materials: {
        Row: {
          content: string | null;
          created_at: string | null;
          id: string;
          type: string;
          url: string | null;
          user_id: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          type: string;
          url?: string | null;
          user_id: string;
        };
        Update: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          type?: string;
          url?: string | null;
          user_id?: string;
        };
        Relationships: [];
      };
      missions: {
        Row: {
          created_at: string | null;
          criteria_type: string;
          description: string | null;
          id: string;
          is_active: boolean | null;
          target_value: number;
          title: string;
          type: Database["public"]["Enums"]["mission_type"];
          xp_reward: number | null;
        };
        Insert: {
          created_at?: string | null;
          criteria_type: string;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          target_value: number;
          title: string;
          type: Database["public"]["Enums"]["mission_type"];
          xp_reward?: number | null;
        };
        Update: {
          created_at?: string | null;
          criteria_type?: string;
          description?: string | null;
          id?: string;
          is_active?: boolean | null;
          target_value?: number;
          title?: string;
          type?: Database["public"]["Enums"]["mission_type"];
          xp_reward?: number | null;
        };
        Relationships: [];
      };
      notes: {
        Row: {
          content: string | null;
          created_at: string | null;
          id: string;
          is_pinned: boolean | null;
          title: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          is_pinned?: boolean | null;
          title?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          content?: string | null;
          created_at?: string | null;
          id?: string;
          is_pinned?: boolean | null;
          title?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      planner_tasks: {
        Row: {
          completed_at: string | null;
          created_at: string | null;
          due_date: string | null;
          id: string;
          is_completed: boolean | null;
          plan_id: string | null;
          priority: Database["public"]["Enums"]["task_priority"] | null;
          title: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          completed_at?: string | null;
          created_at?: string | null;
          due_date?: string | null;
          id?: string;
          is_completed?: boolean | null;
          plan_id?: string | null;
          priority?: Database["public"]["Enums"]["task_priority"] | null;
          title: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          completed_at?: string | null;
          created_at?: string | null;
          due_date?: string | null;
          id?: string;
          is_completed?: boolean | null;
          plan_id?: string | null;
          priority?: Database["public"]["Enums"]["task_priority"] | null;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "planner_tasks_plan_id_fkey";
            columns: ["plan_id"];
            isOneToOne: false;
            referencedRelation: "study_plans";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "planner_tasks_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      pomodoro_sessions: {
        Row: {
          created_at: string;
          duration_minutes: number;
          end_time: string;
          id: string;
          mode: string;
          start_time: string;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          duration_minutes: number;
          end_time: string;
          id?: string;
          mode: string;
          start_time: string;
          user_id: string;
        };
        Update: {
          created_at?: string;
          duration_minutes?: number;
          end_time?: string;
          id?: string;
          mode?: string;
          start_time?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pomodoro_sessions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          account_type: string | null;
          allow_messages: boolean | null;
          avatar_url: string | null;
          banner_url: string | null;
          bio: string | null;
          created_at: string | null;
          current_streak: number | null;
          full_name: string | null;
          github_url: string | null;
          id: string;
          is_public: boolean | null;
          language: string | null;
          last_study_date: string | null;
          level: number | null;
          linkedin_url: string | null;
          longest_streak: number | null;
          metadata: Json | null;
          nickname: string;
          onboarding_completed: boolean | null;
          onboarding_completed_at: string | null;
          settings: Json | null;
          show_email: boolean | null;
          status: string | null;
          theme: string | null;
          timezone: string | null;
          total_followers: number | null;
          total_following: number | null;
          total_posts: number | null;
          total_study_minutes: number | null;
          total_xp: number | null;
          twitter_url: string | null;
          updated_at: string | null;
          website_url: string | null;
          xp: number | null;
        };
        Insert: {
          account_type?: string | null;
          allow_messages?: boolean | null;
          avatar_url?: string | null;
          banner_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          current_streak?: number | null;
          full_name?: string | null;
          github_url?: string | null;
          id: string;
          is_public?: boolean | null;
          language?: string | null;
          last_study_date?: string | null;
          level?: number | null;
          linkedin_url?: string | null;
          longest_streak?: number | null;
          metadata?: Json | null;
          nickname: string;
          onboarding_completed?: boolean | null;
          onboarding_completed_at?: string | null;
          settings?: Json | null;
          show_email?: boolean | null;
          status?: string | null;
          theme?: string | null;
          timezone?: string | null;
          total_followers?: number | null;
          total_following?: number | null;
          total_posts?: number | null;
          total_study_minutes?: number | null;
          total_xp?: number | null;
          twitter_url?: string | null;
          updated_at?: string | null;
          website_url?: string | null;
          xp?: number | null;
        };
        Update: {
          account_type?: string | null;
          allow_messages?: boolean | null;
          avatar_url?: string | null;
          banner_url?: string | null;
          bio?: string | null;
          created_at?: string | null;
          current_streak?: number | null;
          full_name?: string | null;
          github_url?: string | null;
          id?: string;
          is_public?: boolean | null;
          language?: string | null;
          last_study_date?: string | null;
          level?: number | null;
          linkedin_url?: string | null;
          longest_streak?: number | null;
          metadata?: Json | null;
          nickname?: string;
          onboarding_completed?: boolean | null;
          onboarding_completed_at?: string | null;
          settings?: Json | null;
          show_email?: boolean | null;
          status?: string | null;
          theme?: string | null;
          timezone?: string | null;
          total_followers?: number | null;
          total_following?: number | null;
          total_posts?: number | null;
          total_study_minutes?: number | null;
          total_xp?: number | null;
          twitter_url?: string | null;
          updated_at?: string | null;
          website_url?: string | null;
          xp?: number | null;
        };
        Relationships: [];
      };
      quiz_attempts: {
        Row: {
          answers_log: Json | null;
          completed_at: string | null;
          duration_seconds: number | null;
          id: string;
          quiz_id: string;
          score: number;
          user_id: string;
        };
        Insert: {
          answers_log?: Json | null;
          completed_at?: string | null;
          duration_seconds?: number | null;
          id?: string;
          quiz_id: string;
          score: number;
          user_id: string;
        };
        Update: {
          answers_log?: Json | null;
          completed_at?: string | null;
          duration_seconds?: number | null;
          id?: string;
          quiz_id?: string;
          score?: number;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_attempts_quiz_id_fkey";
            columns: ["quiz_id"];
            isOneToOne: false;
            referencedRelation: "quizzes";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quiz_attempts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      quiz_questions: {
        Row: {
          correct_answer: string | null;
          explanation: string | null;
          id: string;
          options: Json | null;
          order_index: number;
          question_text: string;
          question_type: Database["public"]["Enums"]["question_type"] | null;
          quiz_id: string;
        };
        Insert: {
          correct_answer?: string | null;
          explanation?: string | null;
          id?: string;
          options?: Json | null;
          order_index: number;
          question_text: string;
          question_type?: Database["public"]["Enums"]["question_type"] | null;
          quiz_id: string;
        };
        Update: {
          correct_answer?: string | null;
          explanation?: string | null;
          id?: string;
          options?: Json | null;
          order_index?: number;
          question_text?: string;
          question_type?: Database["public"]["Enums"]["question_type"] | null;
          quiz_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "quiz_questions_quiz_id_fkey";
            columns: ["quiz_id"];
            isOneToOne: false;
            referencedRelation: "quizzes";
            referencedColumns: ["id"];
          },
        ];
      };
      quizzes: {
        Row: {
          collection_id: string | null;
          created_at: string | null;
          description: string | null;
          failure_reason: string | null;
          generation_params: Json | null;
          id: string;
          owner_id: string;
          slug: string | null;
          source_content: string | null;
          source_type: string | null;
          status: Database["public"]["Enums"]["quiz_status"] | null;
          title: string;
          updated_at: string | null;
          visibility: Database["public"]["Enums"]["quiz_visibility"] | null;
        };
        Insert: {
          collection_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          failure_reason?: string | null;
          generation_params?: Json | null;
          id?: string;
          owner_id: string;
          slug?: string | null;
          source_content?: string | null;
          source_type?: string | null;
          status?: Database["public"]["Enums"]["quiz_status"] | null;
          title: string;
          updated_at?: string | null;
          visibility?: Database["public"]["Enums"]["quiz_visibility"] | null;
        };
        Update: {
          collection_id?: string | null;
          created_at?: string | null;
          description?: string | null;
          failure_reason?: string | null;
          generation_params?: Json | null;
          id?: string;
          owner_id?: string;
          slug?: string | null;
          source_content?: string | null;
          source_type?: string | null;
          status?: Database["public"]["Enums"]["quiz_status"] | null;
          title?: string;
          updated_at?: string | null;
          visibility?: Database["public"]["Enums"]["quiz_visibility"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "quizzes_collection_id_fkey";
            columns: ["collection_id"];
            isOneToOne: false;
            referencedRelation: "collections";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "quizzes_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      room_users: {
        Row: {
          id: string;
          joined_at: string;
          room_id: string;
          status: string | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          joined_at?: string;
          room_id: string;
          status?: string | null;
          user_id: string;
        };
        Update: {
          id?: string;
          joined_at?: string;
          room_id?: string;
          status?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "room_users_room_id_fkey";
            columns: ["room_id"];
            isOneToOne: false;
            referencedRelation: "study_rooms";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "room_users_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      study_plans: {
        Row: {
          created_at: string | null;
          description: string | null;
          end_date: string | null;
          id: string;
          start_date: string | null;
          status: Database["public"]["Enums"]["study_plan_status"] | null;
          title: string;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["study_plan_status"] | null;
          title: string;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          created_at?: string | null;
          description?: string | null;
          end_date?: string | null;
          id?: string;
          start_date?: string | null;
          status?: Database["public"]["Enums"]["study_plan_status"] | null;
          title?: string;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "study_plans_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      study_rooms: {
        Row: {
          about: string | null;
          created_at: string;
          discoverable: boolean | null;
          enable_chat: boolean | null;
          id: string;
          is_public: boolean | null;
          lock_room: boolean | null;
          name: string;
          owner_id: string | null;
          slug: string | null;
        };
        Insert: {
          about?: string | null;
          created_at?: string;
          discoverable?: boolean | null;
          enable_chat?: boolean | null;
          id?: string;
          is_public?: boolean | null;
          lock_room?: boolean | null;
          name: string;
          owner_id?: string | null;
          slug?: string | null;
        };
        Update: {
          about?: string | null;
          created_at?: string;
          discoverable?: boolean | null;
          enable_chat?: boolean | null;
          id?: string;
          is_public?: boolean | null;
          lock_room?: boolean | null;
          name?: string;
          owner_id?: string | null;
          slug?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "study_rooms_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      tags: {
        Row: {
          id: string;
          name: string;
        };
        Insert: {
          id?: string;
          name: string;
        };
        Update: {
          id?: string;
          name?: string;
        };
        Relationships: [];
      };
      tasks: {
        Row: {
          actual_pomodoros: number | null;
          created_at: string | null;
          estimated_pomodoros: number | null;
          id: string;
          position_order: number | null;
          status: string | null;
          title: string;
          user_id: string;
        };
        Insert: {
          actual_pomodoros?: number | null;
          created_at?: string | null;
          estimated_pomodoros?: number | null;
          id?: string;
          position_order?: number | null;
          status?: string | null;
          title: string;
          user_id: string;
        };
        Update: {
          actual_pomodoros?: number | null;
          created_at?: string | null;
          estimated_pomodoros?: number | null;
          id?: string;
          position_order?: number | null;
          status?: string | null;
          title?: string;
          user_id?: string;
        };
        Relationships: [];
      };
      user_achievements: {
        Row: {
          achievement_id: string;
          id: string;
          progress_snapshot: number | null;
          unlocked_at: string;
          user_id: string;
        };
        Insert: {
          achievement_id: string;
          id?: string;
          progress_snapshot?: number | null;
          unlocked_at?: string;
          user_id: string;
        };
        Update: {
          achievement_id?: string;
          id?: string;
          progress_snapshot?: number | null;
          unlocked_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_achievements_achievement_id_fkey";
            columns: ["achievement_id"];
            isOneToOne: false;
            referencedRelation: "achievements";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_achievements_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_daily_stats: {
        Row: {
          date: string;
          flashcards_reviewed: number | null;
          focus_minutes: number | null;
          id: string;
          quizzes_completed: number | null;
          tasks_completed: number | null;
          user_id: string;
          xp_earned: number | null;
        };
        Insert: {
          date: string;
          flashcards_reviewed?: number | null;
          focus_minutes?: number | null;
          id?: string;
          quizzes_completed?: number | null;
          tasks_completed?: number | null;
          user_id: string;
          xp_earned?: number | null;
        };
        Update: {
          date?: string;
          flashcards_reviewed?: number | null;
          focus_minutes?: number | null;
          id?: string;
          quizzes_completed?: number | null;
          tasks_completed?: number | null;
          user_id?: string;
          xp_earned?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "user_daily_stats_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_missions: {
        Row: {
          id: string;
          mission_id: string;
          period_start: string;
          progress_value: number | null;
          status: Database["public"]["Enums"]["mission_status"] | null;
          user_id: string;
        };
        Insert: {
          id?: string;
          mission_id: string;
          period_start: string;
          progress_value?: number | null;
          status?: Database["public"]["Enums"]["mission_status"] | null;
          user_id: string;
        };
        Update: {
          id?: string;
          mission_id?: string;
          period_start?: string;
          progress_value?: number | null;
          status?: Database["public"]["Enums"]["mission_status"] | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_missions_mission_id_fkey";
            columns: ["mission_id"];
            isOneToOne: false;
            referencedRelation: "missions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "user_missions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      user_stats: {
        Row: {
          created_at: string;
          date: string;
          focus_minutes: number | null;
          id: string;
          sessions_count: number | null;
          user_id: string;
        };
        Insert: {
          created_at?: string;
          date: string;
          focus_minutes?: number | null;
          id?: string;
          sessions_count?: number | null;
          user_id: string;
        };
        Update: {
          created_at?: string;
          date?: string;
          focus_minutes?: number | null;
          id?: string;
          sessions_count?: number | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      xp_transactions: {
        Row: {
          amount: number;
          created_at: string | null;
          id: string;
          source_id: string | null;
          source_type: Database["public"]["Enums"]["xp_source_type"];
          user_id: string;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          id?: string;
          source_id?: string | null;
          source_type: Database["public"]["Enums"]["xp_source_type"];
          user_id: string;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          id?: string;
          source_id?: string | null;
          source_type?: Database["public"]["Enums"]["xp_source_type"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "xp_transactions_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      complete_user_mission: {
        Args: { p_mission_id: string; p_user_id: string; p_xp_reward: number };
        Returns: undefined;
      };
      get_global_leaderboard: {
        Args: never;
        Returns: {
          avatar_url: string;
          display_name: string;
          rank: number;
          total_minutes: number;
          user_id: string;
        }[];
      };
      get_weekly_leaderboard: {
        Args: never;
        Returns: {
          avatar_url: string;
          display_name: string;
          rank: number;
          total_minutes: number;
          user_id: string;
        }[];
      };
      increment_user_stats: {
        Args: { minutes: number; row_date: string; row_user_id: string };
        Returns: undefined;
      };
      increment_user_xp: {
        Args: { x_amount: number; x_user_id: string };
        Returns: undefined;
      };
      increment_xp: { Args: { amount: number }; Returns: undefined };
    };
    Enums: {
      achievement_category:
        | "STUDY"
        | "CREATION"
        | "PERFORMANCE"
        | "STREAK"
        | "SOCIAL"
        | "SPECIAL";
      achievement_rarity: "COMMON" | "RARE" | "EPIC" | "LEGENDARY";
      achievement_target_type:
        | "DAYS_STREAK"
        | "QUIZZES_DONE"
        | "GOALS_COMPLETED"
        | "FLASHCARDS_REVIEWED"
        | "XP_EARNED"
        | "FOCUS_MINUTES";
      deck_status: "draft" | "generating" | "ready" | "failed";
      deck_visibility: "public" | "private" | "shared";
      flashcard_status: "new" | "learning" | "review" | "relearning";
      mission_status: "IN_PROGRESS" | "COMPLETED" | "CLAIMED";
      mission_type: "DAILY" | "WEEKLY";
      pomodoro_mode: "focus" | "short_break" | "long_break";
      question_type:
        | "multiple_choice"
        | "true_false"
        | "fill_in_blank"
        | "short_answer";
      quiz_status: "draft" | "generating" | "ready" | "failed";
      quiz_visibility: "public" | "private" | "shared";
      study_plan_status: "active" | "completed" | "archived";
      task_priority: "low" | "medium" | "high";
      user_achievement_status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED";
      xp_source_type:
        | "ACHIEVEMENT"
        | "QUIZ"
        | "STREAK"
        | "MISSION"
        | "POMODORO";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {
      achievement_category: [
        "STUDY",
        "CREATION",
        "PERFORMANCE",
        "STREAK",
        "SOCIAL",
        "SPECIAL",
      ],
      achievement_rarity: ["COMMON", "RARE", "EPIC", "LEGENDARY"],
      achievement_target_type: [
        "DAYS_STREAK",
        "QUIZZES_DONE",
        "GOALS_COMPLETED",
        "FLASHCARDS_REVIEWED",
        "XP_EARNED",
        "FOCUS_MINUTES",
      ],
      deck_status: ["draft", "generating", "ready", "failed"],
      deck_visibility: ["public", "private", "shared"],
      flashcard_status: ["new", "learning", "review", "relearning"],
      mission_status: ["IN_PROGRESS", "COMPLETED", "CLAIMED"],
      mission_type: ["DAILY", "WEEKLY"],
      pomodoro_mode: ["focus", "short_break", "long_break"],
      question_type: [
        "multiple_choice",
        "true_false",
        "fill_in_blank",
        "short_answer",
      ],
      quiz_status: ["draft", "generating", "ready", "failed"],
      quiz_visibility: ["public", "private", "shared"],
      study_plan_status: ["active", "completed", "archived"],
      task_priority: ["low", "medium", "high"],
      user_achievement_status: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED"],
      xp_source_type: ["ACHIEVEMENT", "QUIZ", "STREAK", "MISSION", "POMODORO"],
    },
  },
} as const;
