import { Calendar, Edit, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function ProfileHeader() {
  return (
    <Card className="w-full overflow-hidden border-none bg-transparent shadow-none">
      <div className="h-32 w-full bg-gradient-to-r from-primary/20 to-accent/20 md:h-48" />
      <CardContent className="relative px-6 pt-0">
        <div className="flex flex-col items-start gap-4 md:flex-row md:items-end">
          <Avatar className="-mt-12 md:-mt-16 relative h-24 w-24 border-4 border-background md:h-32 md:w-32">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col gap-1 pt-2 md:pt-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-2xl">MerQyan</h2>
                <p className="text-muted-foreground">@merqyan</p>
              </div>
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>
            <p className="mt-2 max-w-2xl text-muted-foreground text-sm">
              Passionate learner and developer. Always exploring new
              technologies and sharing knowledge.
            </p>
            <div className="mt-2 flex flex-wrap gap-4 text-muted-foreground text-xs">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>Ho Chi Minh, Vietnam</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>Joined November 2025</span>
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full md:hidden">
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
