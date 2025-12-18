Pomodoro Feature Architecture & Implementation Plan
Goal Description
Refactor the existing Pomodoro feature to be production-ready, robust, and scalable. Key objectives:

Precision: Fix timer drift using timestamp-based calculations in a Web Worker.
Decoupling: Separate UI, Timer Logic, and Audio State.
Scalability: modular stores for Timer, Session, and Audio.
Data Integrity: Accurate session tracking (accounting for pauses) for Supabase syncing.
Feature Completeness: Support Social Rooms and Distraction Blocking.
User Review Required
IMPORTANT

Timer Precision Strategy: The new timer will use Date.now() deltas. If the device sleeps, the timer continues in "real time" (mimicking a physical clock).

WARNING

Store Breaking Changes: usePomodoroStore will be split into useTimerStore, useAudioStore, and usePomodoroSettings.

Architecture Component Diagram
Social
Audio System
Core Engine
Tick/Complete
State Change
Sync
Trigger
Config
Play/Mix
Presence
User
UI
TimerStore
AudioStore
RoomStore
TaskStore
Timer Worker
SessionController
Supabase
AudioController
Howler
SupabaseRealtime
Phased Implementation Plan
Phase 1: Core Timer Stabilization
Goal: Reliable timing that works in background/tabs.

[NEW] src/features/pomodoro/engines/timer-engine.ts
Class-based engine to manage Worker instantiation and message passing.
Methods: start(duration), pause(), resume(), stop().
[MODIFY]
src/features/pomodoro/workers/timer.worker.ts
Switch to "heartbeat" model.
Calulate params.endTime on start.
On each tick, send Math.max(0, endTime - Date.now()).
[NEW] src/stores/use-timer-store.ts
State: timeLeft, duration, mode (focus/short/long), status (idle/running/paused).
Actions: start, pause,
reset
,
setMode
.
[MODIFY]
src/features/pomodoro/hooks/use-pomodoro-timer.ts
Rewrite to wrap useTimerStore and handling completion logic (sound trigger + session save).
Phase 2: Audiovisual Cleanup
Goal: Glitch-free audio mixing and immersive background.

[NEW] src/stores/use-audio-store.ts
State: masterVolume, musicVolume, sfxVolume, activeSoundscapes (array), isMuted.
[MODIFY]
src/features/pomodoro/components/sound-manager.tsx
Rename to SoundController (headless).
React to timerStatus (auto-ducking audio during breaks if configured).
React to useAudioStore changes to mix Howler instances.
[MODIFY]
src/features/pomodoro/components/background-scene.tsx
Optimize video loading (lazy load non-active scenes).
consume usePomodoroSettings.
Phase 3: Tasks & Analytics
Goal: Task tracking integrated with sessions, but not coupling stores.

[MODIFY]
src/stores/use-task-store.ts
Add activeTaskId selection for Pomodoro.
Add estimatedPomodoros field to tasks.
[MODIFY]
src/services/pomodoro-service.ts
Update schema types.
Ensure
createSession
 links to taskId if present.
[NEW] src/features/pomodoro/components/analytics/heatmap.tsx
GitHub-style contribution graph using react-activity-calendar or custom SVG.
Fetch data via pomodoroService.getYearlyStats().
Phase 4: Social Rooms
Goal: Real-time presence without overloading the DB.

[NEW]
src/stores/use-room-store.ts
State: roomId, participants (list of users + status).
Logic: Handle Supabase Presence channel subscriptions.
[NEW] src/features/pomodoro/components/social/room-presence.tsx
Show avatars of active users in the room.
Show status indicators (Focusing / Break).
[MODIFY] src/lib/supabase/realtime.ts
Utility to subscribe to room_{id} channels.
Broadcast events: timer_start, timer_pause (for status only, not syncing ticks).
Phase 5: Distraction Blocker
Goal: Keep user focused within the app.

[NEW] src/features/pomodoro/components/focus-guard.tsx
Headless component.
Uses Page Visibility API to detect tab switching.
Uses Next.js Router events to prevent navigation away from Pomodoro page while timer is running.
Shows "Are you sure?" modal if trying to leave.
[MODIFY] src/stores/use-pomodoro-settings.ts
Add toggles: blockInternalNavigation, warnOnTabSwitch.
Checklist
 Phase 1: Timer Engine & Worker
 Phase 1: Split Stores (Timer/Settings)
 Phase 2: Audio Store & Mixer Refactor
 Phase 3: Analytics Dashboard
 Phase 4: Supabase Presence Implementation
 Phase 5: Focus Guard Component
