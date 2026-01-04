"use client";

import { Github, Globe, Linkedin, Twitter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ProfileSocialCardProps {
  data?: {
    website_url: string;
    github_url: string;
    twitter_url: string;
    linkedin_url: string;
  };
  onChange?: (field: string, value: string) => void;
}

export function ProfileSocialCard({ data, onChange }: ProfileSocialCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="website" className="flex items-center gap-2">
            <Globe className="h-4 w-4" /> Website
          </Label>
          <Input
            id="website"
            placeholder="https://yourwebsite.com"
            defaultValue={data?.website_url}
            onChange={(e) => onChange?.("website_url", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="github" className="flex items-center gap-2">
            <Github className="h-4 w-4" /> GitHub
          </Label>
          <Input
            id="github"
            placeholder="https://github.com/username"
            defaultValue={data?.github_url}
            onChange={(e) => onChange?.("github_url", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="twitter" className="flex items-center gap-2">
            <Twitter className="h-4 w-4" /> Twitter / X
          </Label>
          <Input
            id="twitter"
            placeholder="https://twitter.com/username"
            defaultValue={data?.twitter_url}
            onChange={(e) => onChange?.("twitter_url", e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="linkedin" className="flex items-center gap-2">
            <Linkedin className="h-4 w-4" /> LinkedIn
          </Label>
          <Input
            id="linkedin"
            placeholder="https://linkedin.com/in/username"
            defaultValue={data?.linkedin_url}
            onChange={(e) => onChange?.("linkedin_url", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
