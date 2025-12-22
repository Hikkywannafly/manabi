"use client";

import { RotateCcw, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { usePomodoroSettings } from "@/stores/use-pomodoro-settings";

interface SettingsPanelProps {
  className?: string;
}

export function SettingsPanel({ className }: SettingsPanelProps) {
  const { settings, updateSettings, resetSettings } = usePomodoroSettings();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("text-white hover:bg-white/10", className)}
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="border-white/10 bg-black/90 text-white backdrop-blur-xl sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Pomodoro Settings</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetSettings}
              className="gap-2 text-white/70 hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>
          </DialogTitle>
          <DialogDescription className="text-white/60">
            Customize your Pomodoro experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Timer Durations */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white/90">
              Timer Durations
            </h3>

            <div className="space-y-2">
              <Label htmlFor="focus-duration">Focus Duration (minutes)</Label>
              <Input
                id="focus-duration"
                type="number"
                min="1"
                max="60"
                value={settings.focusDuration}
                onChange={(e) =>
                  updateSettings({ focusDuration: Number(e.target.value) })
                }
                className="border-white/10 bg-white/5 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="short-break">Short Break (minutes)</Label>
              <Input
                id="short-break"
                type="number"
                min="1"
                max="30"
                value={settings.shortBreakDuration}
                onChange={(e) =>
                  updateSettings({ shortBreakDuration: Number(e.target.value) })
                }
                className="border-white/10 bg-white/5 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="long-break">Long Break (minutes)</Label>
              <Input
                id="long-break"
                type="number"
                min="1"
                max="60"
                value={settings.longBreakDuration}
                onChange={(e) =>
                  updateSettings({ longBreakDuration: Number(e.target.value) })
                }
                className="border-white/10 bg-white/5 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="long-break-interval">
                Long Break Interval (sessions)
              </Label>
              <Input
                id="long-break-interval"
                type="number"
                min="2"
                max="10"
                value={settings.longBreakInterval}
                onChange={(e) =>
                  updateSettings({ longBreakInterval: Number(e.target.value) })
                }
                className="border-white/10 bg-white/5 text-white"
              />
            </div>
          </div>

          {/* Auto-start */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white/90">Auto-start</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-start-breaks" className="cursor-pointer">
                Auto-start Breaks
              </Label>
              <Switch
                id="auto-start-breaks"
                checked={settings.autoStartBreaks}
                onCheckedChange={(checked) =>
                  updateSettings({ autoStartBreaks: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="auto-start-pomodoros" className="cursor-pointer">
                Auto-start Pomodoros
              </Label>
              <Switch
                id="auto-start-pomodoros"
                checked={settings.autoStartPomodoros}
                onCheckedChange={(checked) =>
                  updateSettings({ autoStartPomodoros: checked })
                }
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white/90">
              Notifications
            </h3>

            <div className="space-y-2">
              <Label htmlFor="notification-volume">
                Volume: {settings.notificationVolume}%
              </Label>
              <Slider
                id="notification-volume"
                min={0}
                max={100}
                step={5}
                value={[settings.notificationVolume]}
                onValueChange={([value]) =>
                  updateSettings({ notificationVolume: value })
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Focus Guard */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-white/90">Focus Guard</h3>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label
                  htmlFor="block-navigation"
                  className="cursor-pointer font-normal"
                >
                  Block Navigation
                </Label>
                <p className="text-white/50 text-xs">
                  Prevent leaving the page during focus sessions
                </p>
              </div>
              <Switch
                id="block-navigation"
                checked={settings.blockInternalNavigation}
                onCheckedChange={(checked) =>
                  updateSettings({ blockInternalNavigation: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label
                  htmlFor="warn-tab-switch"
                  className="cursor-pointer font-normal"
                >
                  Warn on Tab Switch
                </Label>
                <p className="text-white/50 text-xs">
                  Get notified when you switch tabs frequently
                </p>
              </div>
              <Switch
                id="warn-tab-switch"
                checked={settings.warnOnTabSwitch}
                onCheckedChange={(checked) =>
                  updateSettings({ warnOnTabSwitch: checked })
                }
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
